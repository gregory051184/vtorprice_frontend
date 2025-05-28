import { IAppSelect } from '../types';

export type ISelect<T> = Omit<IAppSelect<T>, 'onInput'>;
