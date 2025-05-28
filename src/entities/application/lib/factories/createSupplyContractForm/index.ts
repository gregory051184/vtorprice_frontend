import { createForm } from '@box/shared/effector-forms';
import {applicationRecyclableStatusSelectValues, dealTypeSelectValues} from '@box/entities/application';
import { ISelectValue } from '@box/shared/ui';
import { companyModel } from '@box/entities/company';
import { combine, sample } from 'effector';
import { $nds } from '@box/entities/nds';
import { $authStore } from "@box/entities/auth";

export const createSupplyContractForm = () => {
  const supplyContractForm = createForm({
    fields: {
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
      company: {
        init: null as null | ISelectValue<companyModel.ICompany>,
        rules: [
          {
            name: 'not_null',
            validator: (val, { dealType }) => (dealType.id === 1 ? val != null : true)
          }
        ]
      },
      price: {
        init: '',
        rules: [
          {
            name: 'not_null',
            validator: (val) => val.length > 0
          },
          {
            name: 'less_then_4_symbols',
            validator: (val) => val.length <= 3
          }
        ]
      },
      volume: {
        init: '',
        rules: [
          {
            name: 'not_null',
            validator: (val) => val.length > 0
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
      withNds: {
        init: false
      }
    },
    validateOn: ['change', 'submit']
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
    target: supplyContractForm.fields.company.set
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
    target: supplyContractForm.fields.address.set
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
    target: supplyContractForm.fields.longitude.set
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
    target: supplyContractForm.fields.latitude.set
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
    target: supplyContractForm.fields.city.set
  });

  // TODO: create external calc methods
  const $totalPrice = combine(supplyContractForm.$values, $nds).map(([val, nds]) => {
    let price = 0;
    const volume = +val.volume;
    const itemPrice = +val.price;

    price = volume * 1000 * itemPrice;

    let ndsTax = 0;

    /*Временно убранная часть в связи в решениями заказчика*/
    //ndsTax = Math.floor(calcNds({
    //  itemPrice,
    //  nds,
    //  totalVolume: volume
    //}));
    //if (val.withNds) {
    //  price += ndsTax;
    //}

    return [price, ndsTax];
  });

  return {
    $totalPrice,
    form: supplyContractForm
  };
};
