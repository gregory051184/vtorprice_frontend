import { useEffect } from 'react';
import { useLoading } from './useLoading';

export const useInit = () => {
  const { loading } = useLoading();

  useEffect(() => {
    const callback = () => {
      const height = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${height}px`);
    };
    callback();
    window.addEventListener('resize', callback);
    return () => {
      window.removeEventListener('resize', callback);
    };
  }, []);

  return { loading };
};
