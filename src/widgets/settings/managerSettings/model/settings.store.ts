import { sample, createEvent } from "effector";

import { notificationModel } from "@box/entities/notification";
import { specialUserInfoForm } from "@box/features/settings/special_user_info";

const submit = createEvent();

sample({
  clock: submit,
  filter: specialUserInfoForm.isFormValid,
  target: specialUserInfoForm.submit,
});

sample({
  source: specialUserInfoForm.formValid,
  target: notificationModel.showAlert.prepend(() => ({
    title: "Успешно",
    message: "Данные сохранены.",
  })),
});

export { submit };
