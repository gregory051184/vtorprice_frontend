import { useState, useEffect, useRef } from 'react';

function useInterval(fn: () => void, delay: number | null | undefined) {
  let fnRef = useRef();
  // @ts-ignore
  fnRef.current = fn;
  useEffect(function () {
    if (delay === undefined || delay === null) return;

    let timer = setInterval(function () {
      let _a;

      // @ts-ignore
      (_a = fnRef.current) === null || _a === void 0 ? void 0 : _a.call(fnRef);
    }, delay);
    return function () {
      clearInterval(timer);
    };
  }, [delay]);
}

const useTimer = ({ time = 60, interval: initialInterval = 1 } = {}) => {
  const [timer, setTimer] = useState(time);
  const [interval, setInterval] = useState<null | number>(initialInterval * 1000);

  const start = () => {
    setTimer(time);
    setInterval(initialInterval * 1000);
  };
  const stop = () => {
    setTimer(0);
    setInterval(null);
  };

  useInterval(() => {
    timer >= 1 && setTimer((count) => count - 1);
    timer <= 1 && setInterval(null);
  }, interval);

  return { timer, start, stop };
};

export { useTimer };
