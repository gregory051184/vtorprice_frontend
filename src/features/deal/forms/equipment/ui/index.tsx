import React from 'react';
import { useForm } from '@box/shared/effector-forms';
import { ROLE } from '@types';
import {
  AsyncSelect, BaseInput, Button, Checkbox, DatePicker, DisabledView, Select, TabSelect
} from '@box/shared/ui';
import { existingCompanySelectApi } from '@box/entities/company';
import classNames from 'classnames';
import { dealPaymentTerms } from '@box/entities/deal';
import { form } from '../model';
import { IGeocode } from "@box/shared/ui/select/geo-select/types";
import dynamic from "next/dynamic";
import { useStore } from "effector-react";
import { $authStore } from "@box/entities/auth";
import { useScreenSize } from "@box/shared/hooks";
import { IEquipmentDealCreateForm } from "./types";
import s from './style.module.scss'
import { Collapse } from "@mantine/core";

const DynamicGeoSelect = dynamic(
  () => import('@box/shared/ui').then(module => module.GeoSelect),
  { ssr: false }
)

export const EquipmentDealCreateForm: React.FC<IEquipmentDealCreateForm> = ({
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

  const date = () => {
    if (fields.manufactureDate.value) {
      return new Date(fields.manufactureDate.value);
    }
    return null;
  };

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
      <div className={classNames('flex gap-[16px]', s.inputs)}>
        <DisabledView disabled className="grow">
          <BaseInput error={hasError('type')} className="grow" placeholder="Тип оборудования" value={fields.type.value} onChange={fields.type.onChange} />
        </DisabledView>
        <BaseInput error={hasError('price')} required type="number" className="grow" placeholder="Цена за 1 шт, ₽" value={fields.price.value} onChange={fields.price.onChange} />
        <BaseInput error={hasError('count')} required className="grow" placeholder="Кол-во" value={fields.count.value} onChange={fields.count.onChange} />
      </div>
      <div className={classNames('flex items-center gap-[16px]', s.long)}>
          <div className='flex gap-[16px]'>
            <DisabledView disabled className='grow'>
              <div className="grow px-[16px] h-[56px] self-stretch bg-white rounded-[10px] shadow flex justify-between items-center">
                <span className="text-sm mr-[10px] whitespace-nowrap">С НДС</span>
                <Checkbox checked={fields.withNds.value} onChange={fields.withNds.onChange} />
              </div>
            </DisabledView>
            <DisabledView disabled className='grow'>
              <div className="grow px-[16px] h-[56px] self-stretch bg-white rounded-[10px] shadow flex justify-between items-center">
                <span className="text-sm mr-[10px] whitespace-nowrap">Продажа по частям</span>
                <Checkbox checked={fields.saleByParts.value} onChange={fields.saleByParts.onChange} />
              </div>
            </DisabledView>
          </div>
        <div className='flex gap-[16px]'>
          <DisabledView disabled className='grow'>
          <div className={s.tab}>
              <TabSelect
                label="Состояние"
                onChange={(v) => fields.wasInUse.onChange(v)}
                values={[
                  {
                    id: 1,
                    label: 'Новое',
                    value: false
                  },
                  {
                    id: 2,
                    label: 'Б/У',
                    value: true
                  },
                ]}
                value={fields.wasInUse.value}
                className={s.tab}
              />
            </div>
          </DisabledView>
          <DisabledView disabled className='grow'>
            <DatePicker
              placeholder="Дата производства"
              className="h-[56px] grow"
              value={[date(), null]}
              onChange={(date) => fields.manufactureDate.onChange(date[0])}
              error={hasError('manufactureDate')}
              required
              amountOfMonths={1}
            />
          </DisabledView>
        </div>
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
        required
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
        required
      />
      <div className={classNames('flex justify-between gap-[16px]', isMobile && "flex-col")}>
        <DynamicGeoSelect
          inputValue={fields.addressBuyer.value}
          placeholder="Адрес доставки"
          error={hasError('addressBuyer') || hasError('latitudeBuyer') || hasError('longitudeBuyer')}
          onInput={fields.addressBuyer.onChange}
          onSelect={handleSelectBuyerAddress}
          className="grow"
          required
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
      <div className={classNames('flex gap-[24px]', s.footer)}>
        <Button htmlType="submit" className='w-full'>
          Создать сделку
        </Button>
        <div className='flex flex-col max-w-[230px] w-full'>
          <span className='text-[12px] text-grey-40 gap-[4px]]'>
            Общая стоимость, без учета доставки
          </span>
          <span className='text-[18px] text-black font-semibold'>
            {
              !!+fields.count.value && !!+fields.price.value ? +fields.count.value * +fields.price.value : '-'
            }
            {' '}
            ₽
          </span>
        </div>
      </div>
    </form>
  );
};
