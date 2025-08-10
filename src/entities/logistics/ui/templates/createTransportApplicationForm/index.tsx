import React, {FormEventHandler, useEffect} from 'react';
import { useForm } from '@box/shared/effector-forms';
import classNames from 'classnames';
import {
  AsyncSelect,
  BaseInput, Button, Checkbox, TabSelect
} from '@box/shared/ui';
import VMasker from 'vanilla-masker';
import { loadingFormatSelectValues } from '@box/entities/logistics/lib/selects';
import s from './style.module.scss';
import { ICreateTransportApplicationForm } from './types';
import dynamic from "next/dynamic";
import { IGeocode } from "@box/shared/ui/select/geo-select/types";
import { companySelectApi } from "@box/entities/company";
import { useStore } from "effector-react";
import { $authStore } from "@box/entities/auth";
import { $totalPrice } from "@box/features/delivery_calculator/model";
import {useRouter} from "next/router";

const DynamicGeoSelect = dynamic(
  () => import('@box/shared/ui').then(module => module.GeoSelect),
  { ssr: false }
)

export const CreateTransportApplicationTemplate: React.FC<ICreateTransportApplicationForm> = ({
  className,
  form,
  buttonText = 'Отправить заявку'
}) => {
  const router = useRouter();
  const {
    fields, submit, isValid,
    hasError
  } = useForm(form);
  const { user } = useStore($authStore);
  const totalPrice = useStore($totalPrice);

  const onSubmit: FormEventHandler = (ev) => {
    ev.preventDefault();
    submit();
  };

  const handleSelectDeliveryAddress = (data: IGeocode) => {
    fields.unloadingAddress.onChange(data.address);
    fields.unloadingLatitude.onChange(data.latitude);
    fields.unloadingLongitude.onChange(data.longitude);
    fields.unloadingCity.onChange(data.city);
  }

  const handleSelectShippingAddress = (data: IGeocode) => {
    fields.loadingAddress.onChange(data.address);
    fields.loadingLatitude.onChange(data.latitude);
    fields.loadingLongitude.onChange(data.longitude);
    fields.loadingCity.onChange(data.city);
  }

  const loadData = async (val: string) => {
    return await companySelectApi(val);
  }

  return (
    <form onSubmit={onSubmit} className={classNames('flex flex-col gap-[16px]', className)}>
      <div className={classNames('flex gap-[16px]', s.block)}>
        <AsyncSelect
          inputProps={{
            error: hasError('sender')
          }}
          placeholder="Отправитель"
          className={classNames("grow", s.input)}
          loadData={loadData}
          value={fields.sender.value}
          required
          onSelect={val => {
            fields.sender.onChange(val);
            if (val?.id !== user?.company.id) {
              fields.getter.onChange({id: user?.company.id, label: user?.company.name, value: user?.company});
            }
          }}
          onInput={val => {
            fields.sender.onChange({id: val, label: val, value: val});
            if (val !== user?.company.name) {
              fields.getter.onChange({id: user?.company.id, label: user?.company.name, value: user?.company});
            }
          }}
          notNull
        />
        <AsyncSelect
          inputProps={{
            error: hasError('getter')
          }}
          placeholder="Получатель"
          className={classNames("grow", s.input)}
          loadData={loadData}
          value={fields.getter.value}
          required
          onSelect={val => {
            fields.getter.onChange(val);
            if (val?.id !== user?.company.id) {
              fields.sender.onChange({id: user?.company.id, label: user?.company.name, value: user?.company});
            }
          }}
          onInput={val => {
            fields.getter.onChange({id: val, label: val, value: val});
            if (val !== user?.company.name) {
              fields.sender.onChange({id: user?.company.id, label: user?.company.name, value: user?.company});
            }
          }}
          notNull
        />
        <BaseInput type="text" error={hasError('phone')} className={classNames("grow", s.input)} placeholder="Номер телефона" required value={fields.phone.value} onChange={(val) => fields.phone.onChange(VMasker.toPattern(val, '(999)999-99-99'))} />
      </div>

      <div className={classNames('flex gap-[16px]', s.block)}>
        <DynamicGeoSelect
          inputValue={fields.loadingAddress.value}
          placeholder="Адрес погрузки"
          error={hasError('loadingAddress') || hasError('loadingLatitude') || hasError('loadingLongitude')}
          onInput={fields.loadingAddress.onChange}
          onSelect={handleSelectShippingAddress}
          required
          className={classNames("grow", s.input)}
        />
        <DynamicGeoSelect
          inputValue={fields.unloadingAddress.value}
          placeholder="Адрес выгрузки"
          error={hasError('unloadingAddress') || hasError('unloadingLatitude') || hasError('unloadingLongitude')}
          onInput={fields.unloadingAddress.onChange}
          onSelect={handleSelectDeliveryAddress}
          required
          className={classNames("grow", s.input)}
        />
      </div>

      <div className={classNames('flex gap-[16px] items-end', s.block_long)}>
        <div className={classNames('flex gap-[16px]', s.inputs)}>
          <BaseInput type="text" error={hasError('cargoType')} className={classNames("grow h-[58px]", s.input)} placeholder="Характер груза" required value={fields.cargoType.value} onChange={fields.cargoType.onChange} />
          <BaseInput type="number" error={hasError('weight')} className={classNames("grow h-[58px]", s.input)} placeholder="Вес, т" required value={fields.weight.value} onChange={fields.weight.onChange} inputAfterFloat={1}/>
        </div>
        <div className={classNames('flex gap-[16px] items-end', s.inputs)}>
          <div className="grow px-[16px] h-[58px] bg-white rounded-[10px] shadow flex justify-between items-center">
            <span className="text-sm mr-2">Работа в выходные</span>
            <Checkbox checked={fields.weekendWork.value} onChange={fields.weekendWork.onChange} className={s.checkbox}/>
          </div>
          <BaseInput type="text" error={hasError('hoursLoading')} className={classNames("grow h-[58px]", s.input)} placeholder="Часы погрузки" value={fields.hoursLoading.value} onChange={(val) => fields.hoursLoading.onChange(VMasker.toPattern(val, '99:99-99:99'))} />

          <TabSelect
            label="Формат погрузки"
            onChange={fields.loadingFormat.onChange}
            values={loadingFormatSelectValues}
            value={fields.loadingFormat.value}
          />
        </div>
      </div>

      <div className="">
        <BaseInput className="grow" placeholder="Комментарий" value={fields.comment.value} onChange={fields.comment.onChange} />
      </div>
      <div className={classNames('mt-[4px] flex gap-[24px] items-center ', s.block, s.footer)}>
        <Button
            disabled={!isValid}
            className={classNames('w-1/2', s.block_input)}
            htmlType="submit">
          {buttonText}
        </Button>
        {!!totalPrice &&
          <div className='flex flex-col'>
            <span className='text-[12px] text-grey-40 mb-[4px]'>Примерная стоимость</span>
            <div>
              <span className='text-[18px] font-semibold text-black'>{totalPrice} ₽</span>
              {' '}
              <span className='text-[12px] text-grey-70'>(Точная стоимость будет рассчитана после отправки заявки)</span>
            </div>
          </div>
        }
      </div>
    </form>
  );
};
