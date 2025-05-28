import React, {useEffect, useRef, useState} from "react";
import classNames from "classnames";
import {ITabSelect, ITabSelectValue} from "../types";
import s from "./style.module.scss";
import {useWindowSize} from "@box/shared/hooks";


type TabValueRefType = Record<number | string, HTMLButtonElement>;
export const TabSelectStatisticsRunningText = <T, >({
                                                        value: selectedValue,
                                                        values,
                                                        onChange,
                                                        className,
                                                        label,
                                                        propWidth
                                                    }: ITabSelect<T>) => {
    const {width} = useWindowSize();
    const buttons = useRef<TabValueRefType>({});
    const sliderParentRef = useRef<HTMLDivElement>(null);
    const [sliderX, setSliderX] = useState<number>(0);
    const [sliderY, setSliderY] = useState<number>(0);
    const [sliderWidth, setSliderWidth] = useState<number>(0);

    const [win, setWin] = useState(true);

    const [sliderWidthToParent, setSliderWidthToParent] = useState<number>(0);
    const [sliderXToParent, setSliderXToParent] = useState<number>(0);
    const [sliderHeight, setSliderHeight] = useState<number>(0);
    const [mounted, setMounted] = useState(false);
    const onSelect = (value: ITabSelectValue) => {
        onChange && onChange(value);
    };
    const updateSliderPosition = () => {
        if (!selectedValue || !buttons.current || !sliderParentRef.current) {
            return;
        }
        const currentSelectedValueNode = buttons.current[selectedValue.id];
        if (currentSelectedValueNode) {
            const currentNodeRectData =
                currentSelectedValueNode.getBoundingClientRect();

            if (window.innerWidth > 450) {
                const y =
                    currentNodeRectData.y -
                    sliderParentRef.current.getBoundingClientRect().y;
                const x =
                    currentNodeRectData.x -
                    sliderParentRef.current.getBoundingClientRect().x;
                setWin(false)
                //@ts-ignore
                setSliderXToParent(selectedValue?.id === 4 ? x * 1.52 : x)
                setSliderX(x - 26)
                //@ts-ignore
                setSliderWidthToParent(currentNodeRectData.width + 51)
                setSliderWidth(currentNodeRectData.width + 71)

                setSliderHeight(currentNodeRectData.height + 11.5);
                setSliderY(y - 8);
                return;
            }
            setWin(true)
            const y =
                currentNodeRectData.y -
                sliderParentRef.current.getBoundingClientRect().y;
            setSliderX(0);
            setSliderY(y);
            setSliderWidth(currentNodeRectData.width);
            setSliderHeight(currentNodeRectData.height);
        }
    };


    useEffect(() => {
        if (propWidth) {
            propWidth(sliderXToParent + sliderWidthToParent), [sliderXToParent, sliderWidthToParent]
        }
    })

    useEffect(updateSliderPosition, [selectedValue]);

    useEffect(() => {
        const handleResize = () => {
            updateSliderPosition();
        };
        let resizeObserver: ResizeObserver;

        if (typeof ResizeObserver !== "undefined" && buttons.current) {
            resizeObserver = new ResizeObserver(handleResize);
            Object.values(buttons.current).forEach((child) => {
                resizeObserver.observe(child);
            });
        }
        return () => {
            if (resizeObserver) resizeObserver.disconnect();
        };
    }, [selectedValue?.id]);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className={s.container}>
            {label && (
                <p className="text-xs text-grey-40 ml-[6px] mb-[6px] leading-3">
                    {label}
                </p>
            )}
            <div
                className={classNames(
                    "inline-block",
                    className,
                    s.container
                )}
            >
                {   //@ts-ignore
                    width >= 1176 ? <div
                            className={classNames(`relative flex`/*, s.select*/)}
                            ref={sliderParentRef}
                        >
                            {mounted && values.length === 4 ? (
                                    <div
                                        style={{
                                            backgroundColor: 'rgba(37,37,37, 1)',
                                            left: -25,
                                            top: sliderY,
                                            //@ts-ignore
                                            width: sliderWidthToParent + sliderXToParent,
                                            height: sliderHeight,
                                            borderBottomLeftRadius: values.length === 4 ? 0 : 13,
                                            borderTopLeftRadius: values.length === 4 ? 0 : 13,
                                            borderBottomRightRadius: values.length === 4 ? 13 : 0,
                                            borderTopRightRadius: values.length === 4 ? 13 : 0,
                                        }}
                                        className={classNames(
                                            "absolute top-0 h-full w-[400px] transition-all rounded-[20px] shadow z-0"
                                        )}
                                    />
                                ) :
                                (
                                    <div
                                        style={{
                                            backgroundColor: 'rgba(37,37,37, 1)',
                                            //right: -sliderX + 80,

                                            //left: sliderX,
                                            right: -40,
                                            top: sliderY,
                                            //width: sliderX < 0 ? sliderWidth + 148 : -sliderWidth,
                                            width: selectedValue?.id === 1 ? sliderWidth + 140 : sliderWidth - 6,
                                            height: sliderHeight,
                                            borderBottomLeftRadius: values.length === 4 ? 0 : 13,
                                            borderTopLeftRadius: values.length === 4 ? 0 : 13,
                                            borderBottomRightRadius: values.length === 4 ? 13 : 0,
                                            borderTopRightRadius: values.length === 4 ? 13 : 0,
                                        }}
                                        className={classNames(
                                            "absolute left top-0 h-full w-[400px] transition-all rounded-[20px] shadow z-0"
                                        )}
                                    />
                                )
                            }

                            {values.map((value) => (
                                <span>
              <button
                  key={value.id}
                  //className="px-[10px]"
                  className={s.button}
                  onClick={() => onSelect(value)}
                  ref={(r) => {
                      if (r) {
                          buttons.current = {
                              ...buttons.current,
                              [value.id]: r,
                          };
                      }
                  }}
                  type="button"
              >
                <span className="relative z-10 text-[15px]" style={{color: 'white', bottom: '4px'}}>{value.label}
                </span>

              </button>
                                    {!win && values[values.length - 1]?.id !== value?.id ?
                                        <span className={s.separator}>|</span> : ''}
                </span>
                            ))}
                        </div> :
                        <div
                            className={classNames(`relative flex`, /*s.select*/)}
                            ref={sliderParentRef}
                        >
                            {mounted && (
                                <div
                                    style={{
                                        backgroundColor: 'rgba(37,37,37, 1)',
                                        left: 0,
                                        top: sliderY,
                                        width: '100%',
                                        height: sliderHeight,
                                    }}
                                    className={classNames(
                                        "absolute top-0 h-full w-[400px] transition-all rounded-[20px] shadow z-0"
                                    )}
                                />
                            )
                            }

                            {values.map((value) => (
                                <span>
              <button
                  key={value.id}
                  //className="px-[10px]"
                  className={s.button}
                  onClick={() => onSelect(value)}
                  ref={(r) => {
                      if (r) {
                          buttons.current = {
                              ...buttons.current,
                              [value.id]: r,
                          };
                      }
                  }}
                  type="button"
              >
                <span className="relative z-10 text-[15px]" style={{color: 'white'}}>{value.label}
                </span>
              </button>
                </span>
                            ))}
                        </div>}
            </div>
        </div>
    );
};
