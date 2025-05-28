import dynamic from "next/dynamic";
import React, { FC } from "react";
import { useForm } from "@box/shared/effector-forms";
import { form } from "@box/features/deal/forms/equipment/flow/model";
import { IGeocode } from "@box/shared/ui/select/geo-select/types";
import { BaseInput, Checkbox, Collapse, DatePicker, DisabledView, Select, TabSelect } from "@box/shared/ui";
import s from "./style.module.scss";
import { dealPaymentTerms } from "@box/entities/deal";
import { DealStatus } from "@box/entities/deal/model";
import classNames  from "classnames";

const DynamicGeoSelect = dynamic(
  () => import('@box/shared/ui').then(module => module.GeoSelect),
  { ssr: false }
)

export const EquipmentDealForm: FC<{disabled?: boolean}> = ({ disabled}) => {
  const { fields, hasError } = useForm(form);

  const handleSelectDeliveryAddress = (data: IGeocode) => {
    fields.deliveryAddress.onChange(data.address);
    fields.deliveryLatitude.onChange(data.latitude);
    fields.deliveryLongitude.onChange(data.longitude);
    fields.deliveryCity.onChange(data.city || '');
  }

  const handleSelectShippingAddress = (data: IGeocode) => {
    fields.shippingAddress.onChange(data.address);
    fields.shippingLatitude.onChange(data.latitude);
    fields.shippingLongitude.onChange(data.longitude);
    fields.shippingCity.onChange(data.city || '');
  }

  const date = () => {
    if (fields.manufactureDate.value) {
      return new Date(fields.manufactureDate.value);
    }
    return null;
  };

  return (
    <>
      <div className={classNames('flex gap-[16px]', s.block)}>
        <DisabledView disabled>
          <BaseInput
            className="grow"
            placeholder="Тип оборудования *"
            value={fields.type.value}
          />
        </DisabledView>
        <DisabledView disabled={disabled as boolean}>
          <BaseInput
            required
            error={hasError('price')}
            className="grow"
            placeholder="Цена за 1 шт, ₽"
            value={fields.price.value}
            onChange={fields.price.onChange}
          />
        </DisabledView>
        <DisabledView disabled={disabled as boolean}>
          <BaseInput
            required
            error={hasError('count')}
            className="grow"
            placeholder="Кол–во"
            value={fields.count.value}
            onChange={fields.count.onChange}
          />
        </DisabledView>
      </div>
      <div className={classNames('flex gap-[16px]', s.block)}>
        <div className={s.tab}>
          <DisabledView disabled={disabled as boolean}>
            <TabSelect
              label="Состояние"
              onChange={(v) => fields.sellerPay.onChange(v)}
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
              value={fields.sellerPay.value}
              className={s.tab}
            />
          </DisabledView>
        </div>
        <DisabledView disabled={disabled as boolean}>
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
      <div className={classNames('flex gap-[16px]', s.block)}>
        <DisabledView disabled={disabled as boolean} className='grow'>
          <div className="grow px-[16px] h-[56px] self-stretch bg-white rounded-[10px] shadow flex justify-between items-center">
            <span className="text-sm">С НДС</span>
            <Checkbox checked={fields.withNds.value} onChange={fields.withNds.onChange} />
          </div>
        </DisabledView>
        <DisabledView disabled={disabled as boolean} className='grow'>
          <div className="grow px-[16px] h-[56px] self-stretch bg-white rounded-[10px] shadow flex justify-between items-center">
            <span className="text-sm">Продажа по частям</span>
            <Checkbox checked={fields.saleByParts.value} onChange={fields.saleByParts.onChange} />
          </div>
        </DisabledView>
      </div>
      <DisabledView disabled={disabled as boolean}>
        <Select
          inputProps={{
            error: hasError('paymentTerm')
          }}
          onSelect={fields.paymentTerm.onChange}
          className="grow"
          placeholder="Условия оплаты"
          value={fields.paymentTerm.value}
          data={dealPaymentTerms}
        />
      </DisabledView>
      <DisabledView disabled={disabled as boolean}>
        <Collapse opened={fields.paymentTerm.value?.value === 3}>
          <BaseInput
            error={hasError('other_payment_term')}
            className="grow"
            placeholder="Другие условия оплаты"
            value={fields.other_payment_term.value}
            onChange={fields.other_payment_term.onChange}
            disabled={disabled}
          />
        </Collapse>
      </DisabledView>
      <DisabledView disabled={disabled as boolean}>
        <DynamicGeoSelect
          inputValue={fields.shippingAddress.value}
          placeholder="Адрес покупки"
          error={hasError('shippingAddress') || hasError('shippingLatitude') || hasError('shippingLongitude')}
          onInput={fields.shippingAddress.onChange}
          onSelect={handleSelectShippingAddress}
          required
          className="grow"
        />
      </DisabledView>
      <DisabledView disabled={disabled as boolean}>
        <DynamicGeoSelect
          inputValue={fields.deliveryAddress.value}
          placeholder="Адрес доставки"
          error={hasError('deliveryAddress') || hasError('deliveryLatitude') || hasError('deliveryLongitude')}
          onInput={fields.deliveryAddress.onChange}
          onSelect={handleSelectDeliveryAddress}
          required
          className="grow"
        />
      </DisabledView>
      <DisabledView disabled={fields.status.value > DealStatus.AGREEMENT || disabled as boolean}>
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
        />
      </DisabledView>
      <BaseInput
        className="grow"
        placeholder="Комментарий"
        value={fields.comment.value}
        onChange={fields.comment.onChange}
        disabled={disabled}
      />
      <div className='flex flex-col'>
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
    </>
  )
}