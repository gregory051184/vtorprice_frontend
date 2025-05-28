import { createForm } from '@box/shared/effector-forms';
import { dealTypeSelectValues, wasInUseSelectValues } from '@box/entities/application';
import { ISelectValue } from '@box/shared/ui';
import { combine, sample } from 'effector';
import { $nds } from '@box/entities/nds';
import { $authStore } from '@box/entities/auth';

export const createEquipmentForm = () => {
  const equipmentForm = createForm({
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
      //ИЗМЕНИЛ
      category: {
        init: null as ISelectValue<number> | null,
        rules: [
          {
            name: 'not_null',
            validator: (val) => val != null
          }
        ]
      },

  //ДОБАВИЛ
      equipment: {
        init: '',
        rules: [
          {
            name: 'not_null',
            validator: (val) => val != null
          }
        ]
      },

      description: {
        init: '',
      },

    //________________________________________________

      priceForUnit: {
        init: '',
        rules: [
          {
            name: 'not_null',
            validator: (val) => val.length > 0
          }
        ]
      },
      company: {
        init: null as ISelectValue | null,
        rules: [
          {
            name: 'not_null',
            validator: (val, { dealType }) => (dealType.id === 1 ? val != null : true)
          }
        ]
      },
      count: {
        init: '',
        rules: [
          {
            name: 'not_null',
            validator: (val) => val.length > 0
          }
        ]
      },
      withNds: {
        init: false
      },
      saleByParts: {
        init: false
      },
      wasInUse: {
        init: wasInUseSelectValues[0],
      },
      manufactureDate: {
        init: null as Date | null | string,
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
    },
    validateOn: ['change', 'submit']
  });

  const $totalPrice = combine(equipmentForm.$values, $nds, (val, nds) => {
    const { priceForUnit, count } = val;
    let price = 0;
    let ndsTax = 0;
    if (count && priceForUnit) {
      price = +count * +priceForUnit;
      // Временно убранная часть в связи с пожеланиями заказчика
      //if (val.withNds) {
      //  ndsTax = Math.floor(calcNds({
      //    itemPrice: +priceForUnit,
      //    totalVolume: +count,
      //    nds,
      //  }));
      //  price += ndsTax;
      //}
    }

    return [price, ndsTax];
  });

  sample({
    //@ts-ignore
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
    target: equipmentForm.fields.company.set
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
    target: equipmentForm.fields.address.set
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
    target: equipmentForm.fields.longitude.set
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
    target: equipmentForm.fields.latitude.set
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
    target: equipmentForm.fields.city.set
  });

  return {
    $totalPrice,
    form: equipmentForm
  };
};
