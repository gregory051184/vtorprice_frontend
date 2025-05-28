import { packingSelectValues, packingTaxSelectValues } from '@box/entities/application';
import { useForm } from '@box/shared/effector-forms';
import {
  BaseInput, Checkbox, Collapse, DisabledView, Select, TabSelect 
} from '@box/shared/ui';
import classNames from 'classnames';
import s from '@box/features/application/forms/update/readyForShipment/ui/style.module.scss';
import { dealPaymentTerms } from '@box/entities/deal';
import { DealStatus } from '@box/entities/deal/model';
import { form } from '../model';
import dynamic from "next/dynamic";
import { TGeoSelectValues } from "@box/shared/ui/select/geo-select/types";
import { IRecyclablesDealForm } from "@box/features/deal/forms/flow/ui/types";

const DynamicGeoSelect = dynamic(
  () => import('@box/shared/ui').then(module => module.GeoSelect),
  { ssr: false }
)

export const RecyclablesDealForm: React.FC<IRecyclablesDealForm> = ({ disabled, totalPrice }) => {
  const {
    fields, hasError
  } = useForm(form);

  const handleSelectDeliveryAddress = (data: TGeoSelectValues) => {
    fields.deliveryAddress.onChange(data.address);
    fields.deliveryLatitude.onChange(data.latitude);
    fields.deliveryLongitude.onChange(data.longitude);
  }

  const handleSelectShippingAddress = (data: TGeoSelectValues) => {
    fields.shippingAddress.onChange(data.address);
    fields.shippingLatitude.onChange(data.latitude);
    fields.shippingLongitude.onChange(data.longitude);
  }

  return (
    <>
      <DisabledView disabled={disabled as boolean}>
        <BaseInput
          error={hasError('weediness')}
          className="grow"
          placeholder="Сорность, допустимые значения, %"
          value={fields.weediness.value as string}
          onChange={fields.weediness.onChange}
        />
      </DisabledView>

      <DisabledView disabled={disabled as boolean}>
        <BaseInput
          error={hasError('moisture')}
          className="grow"
          placeholder="Влага/посторонние включения, %"
          value={fields.moisture.value as string}
          onChange={fields.moisture.onChange}
        />
      </DisabledView>

      <DisabledView disabled={disabled as boolean}>
        <BaseInput
          error={hasError('price')}
          className="grow"
          placeholder="Цена за 1 кг, руб"
          value={fields.price.value as string}
          onChange={fields.price.onChange}
          inputAfterFloat={1}
        />
      </DisabledView>

      <DisabledView disabled={disabled as boolean}>
        <BaseInput
          error={hasError('weight')}
          type="number"
          className="grow"
          placeholder="Вес партии, т"
          value={fields.weight.value as string}
          onChange={fields.weight.onChange}
          inputAfterFloat={1}
        />
      </DisabledView>

      <DisabledView disabled={disabled as boolean}>
        <div
          className="grow px-[16px] h-[56px] self-stretch bg-white rounded-[10px] shadow flex justify-between items-center"
        >
          <span className="text-sm">С НДС</span>
          <Checkbox checked={fields.withNds.value} onChange={fields.withNds.onChange} />
        </div>
      </DisabledView>

      <DisabledView disabled={disabled as boolean}>
        <TabSelect
          label="Упаковка"
          onChange={(val) => {
            fields.packing.onChange(val);
          }}
          values={packingSelectValues}
          value={fields.packing.value}
        />
      </DisabledView>
          
      { fields.packing.value.id === 2 && (
        <DisabledView disabled={disabled as boolean}>
          <div className="flex gap-[20px] flex-col">
            <TabSelect
              label="Вычет"
              onChange={fields.packingTax.onChange}
              values={packingTaxSelectValues}
              value={fields.packingTax.value}
            />
            <BaseInput
              error={hasError('packingTaxVolume')}
              type="number"
              className={classNames('grow', s.block_input)}
              placeholder={`Значение, ${fields.packingTax.value.value === 2 ? '%' : 'т'}`}
              value={fields.packingTaxVolume.value}
              onChange={fields.packingTaxVolume.onChange}
              required
            />

          </div>
        </DisabledView>
      ) }

      <DisabledView disabled={disabled as boolean}>
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
      </DisabledView>

      <Collapse opened={fields.payment_term.value?.value === 3}>
        <BaseInput 
          error={hasError('other_payment_term')} 
          className="grow" 
          placeholder="Другие условия оплаты" 
          value={fields.other_payment_term.value} 
          onChange={fields.other_payment_term.onChange}
          disabled={disabled}
        />
      </Collapse>

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

      {(fields.price.value !== "" && fields.weight.value !== "" && fields.weight.value && fields.price.value) 
      && <div className="">
          <div className='text-[12px] text-grey-40'>Общая стоимость, без учета доставки</div>
          <div className='text-[18px] mt-[4px]'>{`${+fields.price.value * +fields.weight.value * 1000}`} ₽</div>
      </div>}
    </>
  );
};
