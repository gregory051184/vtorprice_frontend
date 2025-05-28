import {
  sample, createApi, createStore, Effect,
} from 'effector';

// eslint-disable-next-line max-len
export const createLoaderStore = (initialState = false, loadingEffect: Effect<any, any, any> | undefined | null = undefined) => {
  const $loaderStore = createStore<boolean>(initialState);

  const api = createApi($loaderStore, {
    startLoading: () => true,
    stopLoading: () => false,
    toggleLoading: (state) => !state,
  });

  if (loadingEffect) {
    sample({
      clock: loadingEffect.pending,
      target: api.startLoading,
    });
    sample({
      clock: loadingEffect.finally,
      target: api.stopLoading,
    });
  }

  return {
    $loaderStore,
    api,
  };
};
