import React, {useEffect, useState} from 'react';
import { IWithClass } from '@box/types';
import classNames from 'classnames';
import { Button, ISelectValue } from '@box/shared/ui';
import { AsyncSelect } from '@box/shared/ui/select';
import Swap from '@assets/icons/swap.svg';
import { useRouter } from 'next/router';
import s from './style.module.scss';
import { citySelectApi } from '@box/entities/city';
import { approximatePriceApi } from "@box/entities/approximate_price/api/ApproximatePriceAPI";
import { setTotalPrice } from '../model'
import { useEvent } from "effector-react";

export const DeliveryCalculator: React.FC<IWithClass> = ({
  className,
}) => {
  const router = useRouter();
  const [cities, setCities] = useState({
    delivery_city: null as ISelectValue | null,
    shipping_city: null as ISelectValue | null,
  });
  const [price, setPrice] = useState(0);
  const setTotalPriceFx = useEvent(setTotalPrice);

  const getPrice = async () => {
    const { data } = await approximatePriceApi.getApproximatePrice({
      // @ts-ignore
      delivery_city_pk: cities.delivery_city?.id,
      // @ts-ignore
      shipping_city_pk: cities.shipping_city?.id,
    })
    // @ts-ignore
    setPrice(data?.totalPrice);
    // @ts-ignore
    setTotalPriceFx(data?.totalPrice);
  }

  const swapFn = () => {
    setCities({ delivery_city: cities.shipping_city, shipping_city: cities.delivery_city })
  };

  useEffect(() => {
    !!cities.delivery_city?.id && !!cities.shipping_city?.id && getPrice();
  }, [cities])

  return (
    <div className={classNames(s.counter, 'bg-grey-10 flex items-center justify-between', s.adaptivePriceCalc, className)}>
      <p className={classNames("font-normal text-lg", s.adaptiveCalcTitle )}>Расчет стоимости</p>
      <div className={classNames('flex gap-[24px] items-center', s.counter_selects, s.adaptivePriceCalc)}>
        <div className={classNames("flex items-center w-2/3 justify-between gap-[5px]", s.adaptiveCalcFilters)}>
            <div className={classNames("w-5/12", s.filters)}>
              <AsyncSelect
              placeholder="Откуда"
              inputProps={{ mode: 'stroke' }}
              withClearButton
              additionFuncOnClearClick = {()=>{setPrice(0);}}
              onSelect={shipping_city => setCities({...cities, shipping_city})}
              value={cities.shipping_city}
              loadData={citySelectApi}
              className={"bg-white rounded-[10px]"}
              />
            </div>
              <Swap onClick={swapFn} className={classNames("cursor-pointer", s.rotate)}/>
            <div className={classNames("w-5/12", s.filters)}>
              <AsyncSelect
              placeholder="Куда"
              inputProps={{ mode: 'stroke' }}
              withClearButton
              additionFuncOnClearClick = {()=>{setPrice(0);}}
              onSelect={delivery_city => setCities({...cities, delivery_city})}
              value={cities.delivery_city}
              loadData={citySelectApi}
              className={"bg-white rounded-[10px]"}/>
            </div>
        </div>
        <div className={classNames('flex gap-[24px] items-center', s.adaptiveCalcButtonHolder)}>
          <div className="flex flex-col justify-between">
            <p className="text-grey-40 text-xs">Предварительная оценка</p>
            <p className="text-primaryGreen-main text-lg font-semibold mt-1">{"~ "}{Math.round(price)}{" "}₽</p>
          </div>
          <Button className={classNames("ml-5", s.adaptiveCalcButton)} onClick={() => router.push('/transport-new-application')}>
            Заказать перевозку
          </Button>
        </div>
      </div>
    </div>
  );
};


export const DeliveryCalculatorVertical: React.FC<IWithClass> = ({
                                                           className,
                                                         }) => {
  const router = useRouter();
  const [cities, setCities] = useState({
    delivery_city: null as ISelectValue | null,
    shipping_city: null as ISelectValue | null,
  });
  const [price, setPrice] = useState(0);
  const setTotalPriceFx = useEvent(setTotalPrice);

  const getPrice = async () => {
    const { data } = await approximatePriceApi.getApproximatePrice({
      // @ts-ignore
      delivery_city_pk: cities.delivery_city?.id,
      // @ts-ignore
      shipping_city_pk: cities.shipping_city?.id,
    })
    // @ts-ignore
    setPrice(data?.totalPrice);
    // @ts-ignore
    setTotalPriceFx(data?.totalPrice);
  }

  const swapFn = () => {
    setCities({ delivery_city: cities.shipping_city, shipping_city: cities.delivery_city })
  };

  useEffect(() => {
    !!cities.delivery_city?.id && !!cities.shipping_city?.id && getPrice();
  }, [cities])

  return (
      <div className={classNames(s.counter, 'items-center justify-between', s.adaptivePriceCalc, className)}>
        <div className={classNames('gap-[24px] items-center', s.counter_selects, s.adaptivePriceCalc)}>
          <div className={classNames("items-center w-auto justify-between gap-[5px]", s.adaptiveCalcFilters)}>
            <div className={classNames("w-auto", s.filters)}>
              <AsyncSelect
                  placeholder="Откуда"
                  inputProps={{ mode: 'stroke' }}
                  withClearButton
                  additionFuncOnClearClick = {()=>{setPrice(0);}}
                  onSelect={shipping_city => setCities({...cities, shipping_city})}
                  value={cities.shipping_city}
                  loadData={citySelectApi}
                  className={"bg-white rounded-[10px]"}
              />
            </div>
            <Swap onClick={swapFn} className={classNames("cursor-pointer rotate-90 ml-16", s.rotate)}/>
            <div className={classNames("w-auto", s.filters)}>
              <AsyncSelect
                  placeholder="Куда"
                  inputProps={{ mode: 'stroke' }}
                  withClearButton
                  additionFuncOnClearClick = {()=>{setPrice(0);}}
                  onSelect={delivery_city => setCities({...cities, delivery_city})}
                  value={cities.delivery_city}
                  loadData={citySelectApi}
                  className={"bg-white rounded-[10px]"}/>
            </div>
          </div>
          <div className={classNames('gap-[24px] items-center', s.adaptiveCalcButtonHolder)}>
            <div className="flex-col justify-between">
              <p className=" mt-1 text-grey-40 text-xs">Предварительная оценка</p>
              <p className="text-primaryGreen-main text-lg font-semibold mt-1">{"~ "}{Math.round(price)}{" "}₽</p>
            </div>
            <Button className={classNames(s.adaptiveCalcButton)} onClick={() => router.push('/transport-new-application')}>
              Заказать перевозку
            </Button>
          </div>
        </div>
      </div>
  );
};