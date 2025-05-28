import { createForm } from '@box/shared/effector-forms';
import {
  applicationRecyclableStatusSelectValues,
  dealTypeSelectValues,
  packingSelectValues,
  packingTaxSelectValues
} from '@box/entities/application';
import { ISelectValue } from '@box/shared/ui';
import { combine, sample } from 'effector';
import { $nds } from '@box/entities/nds';
import { companyModel } from '@box/entities/company';
import { $authStore } from "@box/entities/auth";

export const createReadyForShipmentForm = () => {
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
      applicationRecyclableStatus: {
        init: applicationRecyclableStatusSelectValues[0],
        rules: [
          {
            name: 'not_null',
            validator: (val) => val != null
          }
        ]
      },
      weediness: {
        init: '',
        rules: [
          {
            name: 'null_or_less_then_3_symbols',
            validator: (val) => val.length > 0 ? val.length <= 2 : true
          }
        ]
      },
      moisture: {
        init: '',
        rules: [
          {
            name: 'null_or_less_then_3_symbols',
            validator: (val) => val.length > 0 ? val.length <= 2 : true
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
        init: 0,
        rules: [
          {
            name: 'not_null',
            validator: (val) => val > 0
          },
          {
            name: 'not_more_than_300',
            validator: (val) => +val <= 300
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
          },
          {
            name: 'max_weight_44',
            validator: (val) => +val <= 44
          }
        ]
      },
      kipVolume: {
        init: '',
      },
      kipWeight: {
        init: '',
        rules: [
          {
            name: 'null_or_less_then_3_symbols',
            validator: (val) => val.length > 0 ? val.length <= 2 : true
          }
        ]
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
        init: ''
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
    const allVolume = +val.allVolume;
    let totalVolume = kipVolume * kipWeight;

    if (val.packing.value === 2) {
      if (val.packingTax.value === 1) {
        kipWeight -= taxVolume;
        totalVolume = kipVolume * kipWeight;
      } else {
        totalVolume *= (1 - (taxVolume / 100));
      }
    }
    // Возможно потом к этому вернуться...
    //price = kipPrice * totalVolume;
    price = kipPrice * 1000 * allVolume

    let ndsTax = 0;

    /*Временно убранная часть в связи в решениями заказчика*/
    //ndsTax = Math.floor(calcNds({
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

  sample({
    // @ts-ignore
    source: $authStore.map((val) => val.user?.company),
    fn: (source) => {
      if (source != null) {
        return ({
          id: source.id,
          label: source.name,
          value: source.id,
        });
      }
      return null;
    },
    target: readyForShipmentForm.fields.company.set
  });
  sample({
    // @ts-ignore
    source: $authStore.map((val) => val.user?.company),
    fn: (source) => {
      if (source != null) {
        return source.address;
      }
      return null;
    },
    target: readyForShipmentForm.fields.address.set
  });
  sample({
    // @ts-ignore
    source: $authStore.map((val) => val.user?.company),
    fn: (source) => {
      if (source != null) {
        return source.longitude;
      }
      return null;
    },
    target: readyForShipmentForm.fields.longitude.set
  });
  sample({
    // @ts-ignore
    source: $authStore.map((val) => val.user?.company),
    fn: (source) => {
      if (source != null) {
        return source.latitude;
      }
      return null;
    },
    target: readyForShipmentForm.fields.latitude.set
  });
  sample({
    // @ts-ignore
    source: $authStore.map((val) => val.user?.company),
    fn: (source) => {
      if (source != null) {
        return source.city.id;
      }
      return null;
    },
    target: readyForShipmentForm.fields.city.set
  });

  return {
    $totalPrice,
    $totalWeight,
    form: readyForShipmentForm
  };
};
