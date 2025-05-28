import {
  combine, createEffect, createStore, sample
} from 'effector';
import {
  applicationModel, applicationApi, packingSelectValues, packingTaxSelectValues
} from '@box/entities/application';
import { dealCreateFormModel } from '@box/features/deal/forms';
import { $authStore } from '@box/entities/auth';

const getApplicationFx = createEffect<number, applicationModel.IRecyclableApplication >({
  handler: async (id) => {
    const { data } = await applicationApi.getApplication(id);
    return data;
  }
});
const $application = createStore<applicationModel.IRecyclableApplication | null>(null)
  .on(getApplicationFx.doneData, (_, data) => data);

sample({
  source: combine(
    {
      application: $application,
      user: $authStore.map((el) => el.user)
    }
  ),
  filter: (src) => src !== null,
  fn: ({ application, user }) => {
    if (application && user) {
      const isPurchase = application.dealType.id === 1;
      const packingType = packingTaxSelectValues.find((el) => el.value === application.packingDeductionType?.id)

      return {
        application,
        companySeller: {
          id: isPurchase ? (user?.company?.id || '') : application.company.id,
          label: isPurchase ? (user?.company?.name || '') : application.company.name,
          value: isPurchase ? (user?.company || '') : application.company
        },
        companyBuyer: {
          id: isPurchase ? application.company.id : (user?.company?.id  || ''),
          label: isPurchase ? application.company.name : (user?.company?.name  || ''),
          value: isPurchase ? application.company : (user?.company || '')
        },
        weediness: application.weediness,
        moisture: application.moisture,
        price: application.price.toString(),
        weight: ((application.totalWeight) / 1000).toFixed(1),
        withNds: application.withNds,
        addressSeller: isPurchase ? (user?.company?.address || '') : application.address,
        latitudeSeller: isPurchase ? (user?.company?.latitude || '') : application.latitude,
        longitudeSeller: isPurchase ? (user?.company?.longitude || '') : application.longitude,
        citySeller: isPurchase ? (user?.company?.city?.id || '') : application.city,
        addressBuyer: isPurchase ? application.address : (user?.company?.address || ''),
        longitudeBuyer: isPurchase ? application.longitude : (user?.company?.longitude || ''),
        latitudeBuyer: isPurchase ? application.latitude : (user?.company?.longitude || ''),
        cityBuyer: isPurchase ? application.city : (user?.company?.city?.id || ''),
        kipVolume: application.baleCount,
        ...(application.baleWeight && { kipWeight: ((+application.baleWeight) / 1000).toFixed(1)}),
        packing: packingSelectValues[application.isPackingDeduction ? 1 : 0],
        ...(application.isPackingDeduction
            && {
              packingTax: packingType
            }
        ),
        ...(application.isPackingDeduction
            && { packingTaxVolume: packingType?.id === 2 ? application.packingDeductionValue : ((application.packingDeductionValue || 0) / 1000).toFixed(1)}
        )
      };
    }
    return {};
  },
  target: dealCreateFormModel.form.setForm
});

export {
  getApplicationFx,
  $application
};
