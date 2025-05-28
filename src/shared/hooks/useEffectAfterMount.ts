import { useEffect, useRef } from 'react';

export function useEffectAfterMount(
  fun: (...[props]: any) => void,
  dep: Array<any>,
) {
  const didRendered = useRef<boolean>(false);
  useEffect(() => {
    if (!didRendered.current) {
      didRendered.current = true;
    } else {
      fun();
    }
  }, dep);
}
