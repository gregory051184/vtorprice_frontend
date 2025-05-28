import { createEvent, createStore } from 'effector';
import { applicationTypes } from '@box/features/application/lib';

const changeUserApplicationListTypeManagement = createEvent<{ id: string | number, 
  label: string, value: number }>();
const $userApplicationlistTypeManagement = createStore(applicationTypes[0]).on(
  changeUserApplicationListTypeManagement,
  (_, payload) => {
    const findElement = applicationTypes.find(
      (element) => element.id === payload.id
    );
    return findElement;
  }
);

export { $userApplicationlistTypeManagement, changeUserApplicationListTypeManagement };