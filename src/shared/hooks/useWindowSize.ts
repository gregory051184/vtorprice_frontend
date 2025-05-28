import {useState, useEffect} from 'react';

export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined
    });
    useEffect(() => {
        function handleResize() {
            setWindowSize({
                //@ts-ignore
                width: window.innerWidth,
                //@ts-ignore
                height: window.innerHeight,
            });
        }

        window.addEventListener('resize', handleResize);

        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return windowSize;
}

