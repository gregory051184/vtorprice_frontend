import { createEvent, createStore } from 'effector';

const openModalNotVerifEvent = createEvent();
const closeModalNotVerifEvent = createEvent();
const $modalVisibleNotVerif = createStore(false)
  .on(openModalNotVerifEvent, () => true)
  .on(closeModalNotVerifEvent, () => false);

export {
    openModalNotVerifEvent,
    closeModalNotVerifEvent,
    $modalVisibleNotVerif
}