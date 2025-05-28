import {
  combine, createEffect, createEvent, createStore,
  sample
} from 'effector';
import {
  packingSelectValues, packingTaxSelectValues, applicationModel, dealTypeSelectValues
} from '@box/entities/application';
import { createForm } from '@box/shared/effector-forms';
import { ISelectValue } from '@box/shared/ui';
import { $nds } from '@box/entities/nds';
import { companyModel } from '@box/entities/company';
import { $authHost } from '@box/shared/api';

const readyForShipmentForm = createForm({
  fields: {
    images: {
      init: [null, null, null, null, null] as Array<File | null | string>,
    },
    dealType: {
      init: dealTypeSelectValues[0],
      rules: [
        {
          name: 'not_null',
          validator: (val) => val != null
        }
      ]
    },
    company: {
      init: null as null | ISelectValue<companyModel.ICompany>,
      rules: [
        {
          name: 'not_null',
          validator: (val, { dealType }) => (dealType.id === 1 ? val != null : true)
        }
      ]
    },
    packing: {
      init: packingSelectValues[0],
      rules: [
        {
          name: 'not_null',
          validator: (val) => val != null
        }
      ]
    },
    packingTax: {
      init: packingTaxSelectValues[0],
      rules: [
        {
          name: 'not_null',
          validator: (val) => val != null
        }
      ]
    },
    packingTaxVolume: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val, { packing }) => (packing.id === 2 ? val.length > 0 : true)
        }
      ]
    },
    price: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val.length > 0
        }
      ]
    },
    allVolume: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val.length > 0
        }
      ]
    },
    preferential: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val.length > 0
        }
      ]
    },
    kipVolume: {
      init: ''
    },
    kipWeight: {
      init: ''
    },
    recyclableType: {
      init: null as null | ISelectValue<companyModel.ICompanyRecyclable['recyclables']>,
      rules: [
        {
          name: 'not_null',
          validator: (val) => val != null
        }
      ]
    },
    address: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val.length > 0
        }
      ]
    },
    latitude: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => !!val
        }
      ]
    },
    longitude: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => !!val
        }
      ]
    },
    city: {
      init: '',
    },
    comment: {
      init: '',
    },
    withNds: {
      init: false
    }
  },
  validateOn: ['change', 'submit']
});

const $totalWeight = readyForShipmentForm.$values.map((val) => {
  if (val.kipWeight.length > 0 && val.kipVolume.length > 0) {
    return parseInt(val.kipWeight, 10) * parseInt(val.kipVolume, 10);
  }
  return 0;
});

// TODO: create external calc methods
const $totalPrice = combine(readyForShipmentForm.$values, $nds).map(([val, nds]) => {
  let price = 0;
  let kipWeight = +val.kipWeight;
  const kipVolume = +val.kipVolume;
  const kipPrice = +val.price;
  const taxVolume = +val.packingTaxVolume;
  let totalVolume = kipVolume * kipWeight;
  const allVolume = +val.allVolume;

  if (val.packing.value === 2) {
    if (val.packingTax.value === 1) {
      kipWeight -= taxVolume;
      totalVolume = kipVolume * kipWeight;
    } else {
      totalVolume *= (1 - (taxVolume / 100));
    }
  }

  // Временно убрано
  // price = kipPrice * totalVolume;

  // 
  price = kipPrice * 1000 * allVolume;

  const ndsTax = 0;

  // Временно убрано
  //const ndsTax = Math.floor(calcNds({
  //  itemPrice: kipPrice,
  //  nds,
  //  totalVolume
  //}));
  //if (val.withNds) {
  //  price += ndsTax;
  //}

  return [price, ndsTax];
});

sample({
  clock: readyForShipmentForm.$values.map((el) => el.packing),
  target: readyForShipmentForm.validate
});

const addImage = createEvent<{
  index: number
  file: File
}>();
const removeImage = createEvent<{
  index: number,
  imageId: number
}>();

const addImageFx = createEffect<{
  index: number
  file: File
  applicationId: number
}, applicationModel.IRecyclableApplication>({
  handler: async ({
    file,
    applicationId
  }) => {
    const { data } = await $authHost.post(`/recyclables_applications/${applicationId}/add_images/`, {
      image: file
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return data;
  }
});

const removeImageFx = createEffect<{
  imageId: number
  index: number
  applicationId: number
}, {
  index: number,
}>({
  handler: async ({
    index,
    applicationId,
    imageId
  }) => {
    await $authHost.delete(`/recyclables_applications/${applicationId}/delete_image/${imageId}`);

    return {
      index,
    };
  }
});

const $images = createStore<Array<applicationModel.IRecyclableApplication['images'][0] | null>>([])
  .on([applicationModel.$application, addImageFx.doneData], (_, data) => {
    if (data?.images) {
      const images = [...data.images, null, null, null, null, null];
      images.length = 5;
      return images;
    }
    return [];
  })
  .on(removeImageFx.doneData, (state, data) => {
    const newState = [...state];
    newState[data.index] = null;
    return newState;
  });

sample({
  clock: addImage,
  source: applicationModel.$application,
  fn: (source, clock) => ({
    ...clock,
    applicationId: source?.id || 0
  }),
  filter: (src) => src !== null,
  target: addImageFx
});

sample({
  clock: removeImage,
  source: applicationModel.$application,
  fn: (source, clock) => ({
    ...clock,
    applicationId: source?.id || 0
  }),
  filter: (src) => src !== null,
  target: removeImageFx
});

sample({
  // @ts-ignore
  source: applicationModel.$application,
  fn: (source) => {
    if (source) {
      const packingTax = packingTaxSelectValues.find(
        (el) => el.value === source.packingDeductionType?.id
      );
      return ({
        dealType: source.dealType,
        company: {
          id: source.company?.id,
          label: source.company.name,
          value: source.company
        },
        packing: packingSelectValues[source.isPackingDeduction ? 1 : 2],
        packingTax,
        packingTaxVolume: ((source.packingDeductionValue || 0) / 1000).toFixed(1),
        price: source.price?.toString(),
        preferential: ((source.lotSize || 0) / 1000).toFixed(1),
        kipVolume: source.baleCount?.toString(),
        kipWeight: ((source.baleWeight || 0) / 1000).toFixed(1),
        allVolume: ((source.fullWeigth || 0) / 1000).toFixed(1),
        recyclableType: {
          id: source.recyclables.id,
          label: source.recyclables.name,
          value: source.recyclables
        },
        address: source.address,
        longitude: source.longitude,
        latitude: source.latitude,
        city: source.city,
        comment: source.comment,
        withNds: source.withNds,
      });
    }
    return {};
  },
  target: readyForShipmentForm.setForm
});

sample({
  // @ts-ignore
  clock: readyForShipmentForm.formValidated,
  source: {
    values: readyForShipmentForm.$values,
    id: applicationModel.$application.map((el) => el?.id)
  },
  fn: ({ values, id }) => {
    return({
    id: id || 0,
    deal_type: values.dealType.id,
    urgency_type: 1,
    with_nds: values.withNds,
    bale_count: +values.kipVolume,
    ...(values.kipWeight && {bale_weight: (+values.kipWeight) * 1000}),
    price: +values.price,
    ...(values.allVolume && {full_weigth: (+values.allVolume) * 1000}),
    ...(values.preferential && {lot_size: (+values.preferential) * 1000}),
    is_packing_deduction: values.packing.value === 2,
    packing_deduction_type: values.packingTax.value,
    packing_deduction_value: +values.packingTaxVolume,
    ...(values.packingTaxVolume && {packing_deduction_value: (+values.packingTaxVolume) * 1000}),
    comment: values.comment,
    address: values.address,
    longitude: values.longitude,
    latitude: values.latitude,
    city: values.city,
    recyclables: values.recyclableType?.value?.id,
    company: values.company?.value?.id,
  })},
  filter: ({ id }) => typeof id !== 'undefined',
  target: applicationModel.updateApplicationEvent
});

export {
  readyForShipmentForm,
  $totalPrice,
  $totalWeight,
  $images,
  addImage,
  removeImage
};
