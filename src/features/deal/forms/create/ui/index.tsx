import React, {useEffect} from 'react';
import { useForm } from '@box/shared/effector-forms';
import { ROLE } from '@types';
import {
  AsyncSelect, BaseInput, Button, Checkbox, DisabledView, Select, TabSelect
} from '@box/shared/ui';
import { existingCompanySelectApi } from '@box/entities/company';
import classNames from 'classnames';
import s from '@box/features/application/forms/update/readyForShipment/ui/style.module.scss';
import { packingSelectValues, packingTaxSelectValues } from '@box/entities/application';
import { dealPaymentTerms } from '@box/entities/deal';
import { Collapse } from '@mantine/core';
import { form } from '../model';
import { IGeocode } from "@box/shared/ui/select/geo-select/types";
import dynamic from "next/dynamic";
import { useStore } from "effector-react";
import { $authStore } from "@box/entities/auth";
import { useScreenSize } from "@box/shared/hooks";
import { IDealCreateForm } from "./types";

const DynamicGeoSelect = dynamic(
  () => import('@box/shared/ui').then(module => module.GeoSelect),
  { ssr: false }
)

export const DealCreateForm: React.FC<IDealCreateForm> = ({
  className,
  dealType
}) => {
  const {
    fields, submit, hasError
  } = useForm(form);
  const { user } = useStore($authStore);
  const [screenSize] = useScreenSize();
  const isMobile = screenSize ==='xsm' || screenSize === 'xxsm';
  const hasNotAccess = user?.role.id !== ROLE.ADMIN && user?.role.id !== ROLE.MANAGER;

  const handleSelectSellerAddress = (data: IGeocode) => {
    fields.addressSeller.onChange(data.address);
    fields.latitudeSeller.onChange(data.latitude);
    fields.longitudeSeller.onChange(data.longitude);
    fields.citySeller.onChange(data.city || '');
  }

  const handleSelectBuyerAddress = (data: IGeocode) => {
    fields.addressBuyer.onChange(data.address);
    fields.latitudeBuyer.onChange(data.latitude);
    fields.longitudeBuyer.onChange(data.longitude);
    fields.cityBuyer.onChange(data.city || '')
  }

  const loadData = async (val: string) => {
    return await existingCompanySelectApi(val, user?.role.id === ROLE.MANAGER ? user?.id : undefined);
  }

  useEffect(() => {
    !fields.companySeller.value?.id && fields.companySeller.onChange(null);
    !fields.companyBuyer.value?.id && fields.companyBuyer.onChange(null);
  }, [])

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className={classNames(className, 'flex flex-col gap-[16px]')}
    >
      <div className={classNames("flex gap-[16px]", isMobile && "flex-col")}>
        <DisabledView
          className="grow"
          disabled={hasNotAccess || ((user?.role.id === ROLE.ADMIN || user?.role.id === ROLE.MANAGER) && dealType !== 1)}
        >
          <AsyncSelect
            inputProps={{
              error: hasError('companySeller')
            }}
            placeholder="Компания продавец"
            className="grow"
            loadData={loadData}
            value={fields.companySeller.value}
            onSelect={val => fields.companySeller.onChange(val)}
          />
        </DisabledView>
        <DisabledView
          className="grow"
          disabled={hasNotAccess || ((user?.role.id === ROLE.ADMIN || user?.role.id === ROLE.MANAGER) && dealType !== 2)}
        >
          <AsyncSelect
            inputProps={{
              error: hasError('companyBuyer')
            }}
            placeholder="Компания покупатель"
            loadData={loadData}
            value={fields.companyBuyer.value}
            onSelect={val => fields.companyBuyer.onChange(val)}
          />
        </DisabledView>
      </div>
      <div className={classNames("flex gap-[16px]", isMobile && "flex-col")}>
        <DisabledView disabled className="grow">
          <BaseInput error={hasError('weediness')} className="grow" placeholder="Сорность, допустимые значения, %" value={fields.weediness.value} onChange={fields.weediness.onChange} />
        </DisabledView>
        
        <DisabledView disabled className="grow">
          <BaseInput error={hasError('moisture')} className="grow" placeholder="Влага/посторонние включения, %" value={fields.moisture.value} onChange={fields.moisture.onChange} />
        </DisabledView>
      </div>
      <div className={classNames("flex gap-[16px]", isMobile && "flex-col")}>
        <div className={classNames("flex gap-[16px]", screenSize === 'xxsm' && "flex-col")}>
        <BaseInput error={hasError('price')} type="number" className="grow" placeholder="Цена за 1 кг, руб." value={fields.price.value} onChange={fields.price.onChange} />
        <BaseInput error={hasError('weight')} type="number" className="grow" placeholder="Вес партии, т" value={fields.weight.value} onChange={fields.weight.onChange} inputAfterFloat={1}/>
        </div>
        <div className="grow px-[16px] h-[56px] self-stretch bg-white rounded-[10px] shadow flex justify-between items-center">
          <span className="text-sm mr-[10px] whitespace-nowrap">С НДС</span>
          <Checkbox checked={fields.withNds.value} onChange={fields.withNds.onChange} />
        </div>
      </div>
      <div className={classNames('flex gap-[20px]', s.block)}>
        <DisabledView disabled>
          <TabSelect
            label="Упаковка"
            onChange={(val) => {
              fields.packing.onChange(val);
            }}
            values={packingSelectValues}
            value={fields.packing.value}
            className={s.tab}
          />
          
        </DisabledView>
        { fields.packing.value.id === 2 && (
          <>
            <DisabledView disabled>
              <div className={s.tab}>
                <TabSelect
                  label="Вычет"
                  onChange={fields.packingTax.onChange}
                  values={packingTaxSelectValues}
                  value={fields.packingTax.value}
                  className={s.tab}
                />
              </div>
              <BaseInput
                error={hasError('packingTaxVolume')}
                type="number"
                className={classNames('grow self-end', s.block_input)}
                placeholder={`Значение, ${fields.packingTax.value.value === 2 ? '%' : 'т'}`}
                value={fields.packingTaxVolume.value}
                onChange={fields.packingTaxVolume.onChange}
                inputAfterFloat={1}
                required
              />
            </DisabledView>
          </>
        ) }
      </div>

      <div className="flex gap-[16px]">
        <DisabledView disabled className="grow">
          <BaseInput error={hasError('kipVolume')} className="grow" placeholder="Кол-во кип" value={fields.kipVolume.value} onChange={fields.kipVolume.onChange} />
        </DisabledView>
        
        <DisabledView disabled className="grow">
          <BaseInput error={hasError('kipWeight')} className="grow" placeholder="Вес одной кипы, т" value={fields.kipWeight.value} onChange={fields.kipVolume.onChange} />
        </DisabledView>
      </div>
      <Select
        inputProps={{
          error: hasError('payment_term')
        }} 
        onSelect={fields.payment_term.onChange}
        className="grow"
        placeholder="Условия оплаты" 
        value={fields.payment_term.value} 
        data={dealPaymentTerms}
      /> 
      <Collapse in={fields.payment_term.value?.value === 3}>
        <BaseInput error={hasError('other_payment_term')} className="grow" placeholder="Другие условия оплаты" value={fields.other_payment_term.value} onChange={fields.other_payment_term.onChange} />
      </Collapse>
      <DynamicGeoSelect
        inputValue={fields.addressSeller.value}
        placeholder="Адрес покупки"
        error={hasError('addressSeller') || hasError('latitudeSeller') || hasError('longitudeSeller')}
        onInput={fields.addressSeller.onChange}
        onSelect={handleSelectSellerAddress}
        className="grow"
      />
      <div className={classNames("flex gap-[16px]", !isMobile && "items-center", isMobile && "flex-col items-start")}>
        <DynamicGeoSelect
          inputValue={fields.addressBuyer.value}
          placeholder="Адрес доставки"
          error={hasError('addressBuyer') || hasError('latitudeBuyer') || hasError('longitudeBuyer')}
          onInput={fields.addressBuyer.onChange}
          onSelect={handleSelectBuyerAddress}
          className="grow"
        />
        <div className={s.tab}>
          <TabSelect
            label="Кто платит за доставку"
            onChange={(v) => fields.sellerPay.onChange(v)}
            values={[
              {
                id: 1,
                label: 'Продавец',
                value: true
              },
              {
                id: 2,
                label: 'Покупатель',
                value: false
              },
            ]}
            value={fields.sellerPay.value}
            className={s.tab}
          />
        </div>
      </div>
      <BaseInput className="grow" placeholder="Комментарий" value={fields.comment.value} onChange={fields.comment.onChange} />
      <div className={s.bottom}>
        <Button htmlType="submit">
          Создать сделку
        </Button>
        <div>
          <div className='text-[12px] whitespace-nowrap text-grey-30'>Общая стоимость, без учета доставки</div>
          <div className='text-[18px] font-semibold mt-[4px]'>
            {!!+fields.price.value && !!+fields.weight.value ? +fields.weight.value * +fields.price.value * 1000 : 0} ₽
          </div>
        </div>
      </div>
    </form>
  );
};
