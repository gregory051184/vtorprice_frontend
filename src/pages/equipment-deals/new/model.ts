import { combine, createEffect, createStore, sample } from "effector";
import { equiomentApplicationApi } from "@box/entities/application";
import { IEquipmentApplication } from "@box/entities/application/model";
import { $authStore } from "@box/entities/auth";
import { equipmentDealCreateFormModel } from "@box/features/deal/forms/equipment";

const getEquipmentApplicationFx = createEffect<number, IEquipmentApplication>({
  handler: async (id) => {
    const {data} = await equiomentApplicationApi.getEquipmentApplication(id)

    return data;
  }
})

const $application = createStore<IEquipmentApplication | null>(null)
  .on(getEquipmentApplicationFx.doneData, (_, data) => data);

sample({
  // @ts-ignore
  source: combine(
    {
      application: $application,
      user: $authStore.map((el) => el.user)
    }
  ),
  filter: (src) => src !== null,
  fn: ({ application, user }) => {
    if (application && user) {
      return {
        application,
        companySeller: {
          id: application.dealType.id === 1 ? user.company.id : application.company.id,
          label: application.dealType.id === 1 ? user.company.name : application.company.name,
          value: application.dealType.id === 1 ? user.company : application.company
        },
        companyBuyer: {
          id: application.dealType.id === 1 ? application.company.id : user.company.id,
          label: application.dealType.id === 1 ? application.company.name : user.company.name,
          value: application.dealType.id === 1 ? application.company : user.company
        },
        price: application.price.toString(),
        wasInUse: !!application.wasInUse ? { id: 2, label: 'Б/У', value: true } : { id: 1, value: false, label: 'Новое' },
        saleByParts: application.saleByParts,
        withNds: application.withNds,
        addressSeller: application.dealType.id === 1 ? user.company.address : application.address,
        latitudeSeller: application.dealType.id === 1 ? user.company.latitude : application.latitude,
        longitudeSeller: application.dealType.id === 1 ? user.company.longitude : application.longitude,
        citySeller: application.dealType.id === 1 ? user.company.city.id : application.city,
        addressBuyer: application.dealType.id === 1 ? application.address : user.company.address,
        longitudeBuyer: application.dealType.id === 1 ? application.longitude : user.company.longitude,
        latitudeBuyer: application.dealType.id === 1 ? application.latitude : user.company.longitude,
        cityBuyer: application.dealType.id === 1 ? application.city : user.company.city.id,
        count: application.count,
        type: application.equipment.name,
        manufactureDate: application.manufactureDate
      };
    }
    return {};
  },
  target: equipmentDealCreateFormModel.form.setForm
});

export { getEquipmentApplicationFx, $application }
