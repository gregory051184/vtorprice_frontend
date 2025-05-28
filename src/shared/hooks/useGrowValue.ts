import { useEffect, useMemo, useState } from 'react';

export const useGrowValue = (from: number, to: number, duration: number) => {
  const [value, setValue] = useState(from);
  const step = useMemo(() => Math.ceil((to - from) / duration), [from, to, duration]);
  useEffect(() => {
    let frame: any = null;
    let vl = from;
    // eslint-disable-next-line no-unused-vars
    let counter = 0;
    const callback = () => {
      counter += 1;
      vl += step;
      if (vl < to) {
        setValue(vl);
        frame = requestAnimationFrame(callback);
      } else {
        setValue(to);
        if (frame) {
          cancelAnimationFrame(frame);
        }
      }
    };
    requestAnimationFrame(callback);

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, [from, to, duration]);
  return value;
};
