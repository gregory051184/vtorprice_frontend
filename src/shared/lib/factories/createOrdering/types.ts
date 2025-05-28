import { Store, Event } from 'effector';

export type Ordering = {
  $ordering: Store<string | null>,
  setOrdering: Event<string | null>
};
