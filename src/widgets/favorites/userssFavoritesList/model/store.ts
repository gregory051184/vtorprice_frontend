import { createEvent, createStore } from 'effector';
import { favoritesTypes } from '../lib';

const changeFavoriteListType = createEvent<string | number>();
const $favoriteListType = createStore(favoritesTypes[0]).on(
  changeFavoriteListType,
  (_, payload) => {
    const findElement = favoritesTypes.find((element) => element.id === payload);
    return findElement;
  }
);

export { $favoriteListType, changeFavoriteListType };
