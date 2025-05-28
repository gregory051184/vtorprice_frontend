import { useEffect } from 'react';

// eslint-disable-next-line max-len
export const useClickOutside = (callback: ()=>void, node: (HTMLElement | null) | Array<(HTMLElement | null)>) => {
  useEffect(() => {
    const cb = (ev: MouseEvent) => {
      const target = ev.target as any;
      if (Array.isArray(node)) {
        if (node.every((el) => !el?.contains(target))) {
          callback();
        }
      } else if (!node?.contains(target)) {
        callback();
      }
    };
    
    window.addEventListener('click', cb);
    
    return () => window.removeEventListener('click', cb);
  }, [callback]);
};
