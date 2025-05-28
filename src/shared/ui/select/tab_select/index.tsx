import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { ITabSelect, ITabSelectValue } from "../types";
import s from "./style.module.scss";

type TabValueRefType = Record<number | string, HTMLButtonElement>;
export const TabSelect = <T,>({
  value: selectedValue,
  values,
  onChange,
  className,
  label,
}: ITabSelect<T>) => {
  const buttons = useRef<TabValueRefType>({});
  const sliderParentRef = useRef<HTMLDivElement>(null);
  const [sliderX, setSliderX] = useState<number>(0);
  const [sliderY, setSliderY] = useState<number>(0);
  const [sliderWidth, setSliderWidth] = useState<number>(0);
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
        const x =
          currentNodeRectData.x -
          sliderParentRef.current.getBoundingClientRect().x;
        setSliderX(x);
        setSliderWidth(currentNodeRectData.width);
        setSliderHeight(currentNodeRectData.height);
        return;
      }
      const y =
        currentNodeRectData.y -
        sliderParentRef.current.getBoundingClientRect().y;
      setSliderX(0);
      setSliderY(y);
      setSliderWidth(currentNodeRectData.width);
      setSliderHeight(currentNodeRectData.height);
    }
  };

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
        <p className="text-xs text-grey-40 ml-[20px] mb-[6px] leading-3">
          {label}
        </p>
      )}
      <div
        className={classNames(
          "border border-grey-20 rounded-[10px] inline-block p-[4px] bg-grey-10",
          className,
          s.container
        )}
      >
        <div
          className={classNames(`relative flex`, s.select)}
          ref={sliderParentRef}
        >
          {mounted && (
            <div
              style={{
                left: sliderX,
                top: sliderY,
                width: sliderWidth,
                height: sliderHeight,
                backgroundColor: 'rgba(67, 158, 126)'
              }}
              className={classNames(
                "absolute top-0 h-full bg-white w-[400px]  transition-all rounded-[8px]  shadow z-0"
              )}
            />
          )}

          {values.map((value) => (
            <button
              key={value.id}
              className="px-[16px] py-[6px]"
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
              <span className="relative z-10 text-sm">{value.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
