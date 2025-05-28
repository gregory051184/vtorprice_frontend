import { createEvent, createStore } from 'effector';
import { Alert, Confirm } from './types';

const showConfirm = createEvent<Confirm>();
const hideConfirm = createEvent();
const $confirm = createStore<Confirm & {
  show: boolean
} | null>(null).on(showConfirm, (_, data) => ({
  ...data,
  show: true
})).on(hideConfirm, (state) => {
  if (state) {
    return {
      ...state,
      show: false
    };
  }
  return state;
});

const showAlert = createEvent<Alert>();
const hideAlert = createEvent();
const $alert = createStore<Alert & {
  show: boolean
} | null>(null).on(showAlert, (_, data) => ({
  ...data,
  show: true
})).on(hideAlert, (state) => {
  if (state) {
    return {
      ...state,
      show: false
    };
  }
  return state;
});

export {
  $confirm,
  showConfirm,
  hideConfirm,
  showAlert, hideAlert,
  $alert
};
