import { createEvent, createStore } from 'effector';
import { applicationTypes } from '@box/features/application/lib';

const changeUserApplicationListType = createEvent<{ id: string | number, 
  label: string, value: number }>();
const $userApplicationlistType = createStore(applicationTypes[0]).on(
  changeUserApplicationListType,
  (_, payload) => {
    const findElement = applicationTypes.find(
      (element) => element.id === payload.id
    );
    return findElement;
  }
);

export { $userApplicationlistType, changeUserApplicationListType };
