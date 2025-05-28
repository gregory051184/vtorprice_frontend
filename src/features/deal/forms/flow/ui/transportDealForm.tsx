import { FC } from 'react';
import { loadingFormatSelectValues } from '@box/entities/logistics/lib';
import { useForm } from '@box/shared/effector-forms';
import {
  BaseInput, Checkbox, DisabledView, TabSelect
} from '@box/shared/ui';
import { form } from '../model';
import { IGeocode } from "@box/shared/ui/select/geo-select/types";
import dynamic from "next/dynamic";

const DynamicGeoSelect = dynamic(
  () => import('@box/shared/ui').then(module => module.GeoSelect),
  { ssr: false }
)

export const TransportDealForm: FC<{ deliveryPrice?: number, contractor?: string }> = ({ deliveryPrice, contractor }) => {
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
    fields.shippingCity.onChange(data.city || '')
  }

  return (
    <>
      <DisabledView disabled>
        <BaseInput
          error={hasError('sender')}
          className="grow"
          placeholder="Отправитель"
          value={fields.sender.value}
        />
      </DisabledView>
      <DisabledView disabled>
        <BaseInput
          error={hasError('recipient')}
          className="grow"
          placeholder="Получатель"
          value={fields.recipient.value}
        />
      </DisabledView>

      <BaseInput
        error={hasError('phone')}
        className="grow"
        placeholder="Номер телефона"
        value={fields.phone.value}
      />

      <DynamicGeoSelect
        inputValue={fields.shippingAddress.value}
        placeholder="Адрес погрузки"
        error={hasError('shippingAddress') || hasError('shippingLatitude') || hasError('shippingLongitude')}
        onInput={fields.shippingAddress.onChange}
        onSelect={handleSelectShippingAddress}
        required
      />
      <DynamicGeoSelect
        inputValue={fields.deliveryAddress.value}
        placeholder="Адрес выгрузки"
        error={hasError('deliveryAddress') || hasError('deliveryLatitude') || hasError('deliveryLongitude')}
        onInput={fields.deliveryAddress.onChange}
        onSelect={handleSelectDeliveryAddress}
        required
      />
      <DisabledView disabled>
        <BaseInput
          error={hasError('cargoType')}
          className="grow"
          placeholder="Характер груза"
          value={fields.cargoType.value}
        />
      </DisabledView>
      <BaseInput
        error={hasError('weight')}
        type="number"
        className="grow"
        placeholder="Вес, т"
        value={fields.weight.value}
        onChange={fields.weight.onChange}
        inputAfterFloat={1}
        required
      />
      <div className="grow px-[16px] h-[56px] self-stretch bg-white rounded-[10px] shadow flex justify-between items-center">
        <span className="text-sm">Работа в выходные</span>
        <Checkbox
          checked={fields.weekendWork.value}
          onChange={fields.weekendWork.onChange}
        />
      </div>
      <TabSelect
        label="Формат погрузки"
        onChange={fields.loadingFormat.onChange}
        values={loadingFormatSelectValues}
        value={fields.loadingFormat.value}
      /> 
      <BaseInput
        className="grow"
        placeholder="Комментарий"
        value={fields.comment.value}
        onChange={fields.comment.onChange}
      />
      {(!!deliveryPrice || !!contractor) && <div className="flex gap-[16px] p-[4px]">
        {!!deliveryPrice && <div className="">
          <div className='text-[12px] text-grey-40'>Стоимость доставки</div>
          <div className='text-[18px]'>{deliveryPrice} ₽</div>
        </div>}
        {
          !!contractor && <div className="">
            <div className='text-[12px] text-grey-40'>Контрагент</div>
            <div className='text-[18px]'>{contractor}</div>
          </div>
        }
      </div>}
    </>
  );
};
