import {
  createEvent, createStore
} from 'effector';
import { Ordering } from './types';

export const createOrdering = (): Ordering => {
  const setOrdering = createEvent<string | null>();
  const $ordering = createStore<string | null>(null)
    .on(setOrdering, (_, data) => data);
  
  return {
    $ordering,
    setOrdering
  };
};
