import { createEvent, createStore } from 'effector';

const openModalNotAuthEvent = createEvent();
const closeModalNotAuthEvent = createEvent();
const $modalVisibleNotAuth = createStore(false)
  .on(openModalNotAuthEvent, () => true)
  .on(closeModalNotAuthEvent, () => false);

export {
    openModalNotAuthEvent,
    closeModalNotAuthEvent,
    $modalVisibleNotAuth
}