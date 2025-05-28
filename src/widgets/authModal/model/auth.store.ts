import { authFx } from '@box/features/auth/code_form/model';
import { makeCallFx } from '@box/features/auth/phone_form/model';
import { createEvent, createStore, sample } from 'effector';

const setShowAuthModal = createEvent<boolean>();
const setAuthStep = createEvent<number>();

const $showAuthModal = createStore<boolean>(false).on(setShowAuthModal, (_, visible) => visible);

const $authStep = createStore<number>(1).on(setAuthStep, (_, step) => step);

sample({
  clock: authFx.done,
  target: setShowAuthModal.prepend(() => false)
});

sample({
  clock: makeCallFx.done,
  target: setAuthStep.prepend(() => 2)
});

sample({
  source: setShowAuthModal,
  filter: $showAuthModal.map((data) => !data),
  target: setAuthStep.prepend(() => 1)
});

export {
  setShowAuthModal,
  $showAuthModal,
  $authStep,
  setAuthStep
};
