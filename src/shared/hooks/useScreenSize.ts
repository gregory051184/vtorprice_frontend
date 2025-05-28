import { useEffect, useState } from 'react';

type ScreenSize = 'xl' | 'lg' | 'md' | 'sm' | 'xsm' | 'xxsm';

const sizes = {
  xxsm: 430,
  xsm: 744,
  sm: 1023,
  md: 1279,
  lg: 1365,
  xl: 1599,
};

const entries = Object.entries(sizes);
export const useScreenSize = (): [ScreenSize, (size: ScreenSize)=>boolean] => {
  const [screenSize, setScreenSize] = useState<ScreenSize>('lg');

  const satisfies = (size: ScreenSize) => sizes[screenSize] >= sizes[size];
  
  useEffect(() => {
    const handler = () => {
      for (let i = 0; i < entries.length; i++) {
        if (window.matchMedia(`only screen and (max-width: ${entries[i][1]}px)`).matches) {
          setScreenSize(entries[i][0] as ScreenSize);
          break;
        }
      }
    };
    handler();
    window.addEventListener('resize', handler);

    return () => window.removeEventListener('resize', handler);
  }, []);

  return [screenSize, satisfies];
};
