import { useEvent, useStore } from 'effector-react';
import { Ordering } from './types';

export const useOrdering = (ordering: Ordering) => ({
  ordering: useStore(ordering.$ordering),
  setOrdering: useEvent(ordering.setOrdering)
});
