import React, { FormEventHandler, useEffect } from 'react';
import { useForm } from '@box/shared/effector-forms';
import { useStore } from 'effector-react';
import classNames from 'classnames';
import {
  AsyncSelect, BaseInput, Button, Checkbox, Collapse, DisabledView, TabSelect, Tooltip
} from '@box/shared/ui';
import {applicationRecyclableStatusSelectValues, dealTypeSelectValues} from '@box/entities/application';
import { existingCompanySelectApi, recyclablesSelectApi } from '@box/entities/company';
import { $authStore } from '@box/entities/auth';
import { ROLE } from '@box/types';
import { ISupplyContractForm } from './types';
import s from './style.module.scss';
import { IGeocode } from "@box/shared/ui/select/geo-select/types";
import dynamic from "next/dynamic";

const DynamicGeoSelect = dynamic(
  () => import('@box/shared/ui').then(module => module.GeoSelect),
  { ssr: false }
)

export const SupplyContractFormTemplate: React.FC<ISupplyContractForm> = ({
  className,
  form,
  totalPrice: tp,
  isUpdate
}) => {
  const {
    fields, submit, isValid,
    hasError, reset
  } = useForm(form);

  const onSubmit: FormEventHandler = (ev) => {
    ev.preventDefault();
    submit();
  };

  const { user } = useStore($authStore);

  const totalPrice = useStore(tp);

  const handleSelectAddress = (data: IGeocode) => {
    fields.address.onChange(data.address);
    fields.latitude.onChange(data.latitude);
    fields.longitude.onChange(data.longitude);
    fields.city.onChange(data.city);
  };

  const loadData = async (val: string) => {
    return await existingCompanySelectApi(val, user?.role.id === ROLE.MANAGER ? user?.id : undefined);
  }

  useEffect(() => {
    return () => {
      if (!isUpdate) {
        reset();
        fields.company.onChange(user?.company ? {label: user?.company?.name, id: user?.company?.id, value: user.company} : null);
        fields.address.onChange(user?.company?.address || "");
        fields.longitude.onChange(user?.company?.longitude || "");
        fields.latitude.onChange(user?.company?.latitude || "");
        fields.city.onChange(user?.company?.city?.id || "");
      }
    }
  }, []);

  return (
    <form onSubmit={onSubmit} className={classNames('flex flex-col gap-[20px]', className)}>
      <div className={classNames('flex gap-[20px] items-center', s.block)}>
        <TabSelect
          label="Тип сделки"
          onChange={fields.dealType.onChange}
          values={dealTypeSelectValues}
          value={fields.dealType.value}
        />
        <TabSelect
            label="Тип сырья"
            values={applicationRecyclableStatusSelectValues}
            onChange={fields.applicationRecyclableStatus.onChange}
            value={fields.applicationRecyclableStatus.value}
        />
        <DisabledView className="w-full" disabled={user?.role.id !== ROLE.ADMIN && user?.role.id !== ROLE.MANAGER}>
          <AsyncSelect
            placeholder="Название компании или ИНН"
            inputProps={{
              required: true,
              error: hasError('company'),
            }}
            className={classNames('grow self-end', s.block_input)}
            loadData={loadData}
            value={fields.company.value}
            onSelect={(val) => fields.company.onChange(val)}
          />
        </DisabledView>
      </div>

      <div className={classNames('flex gap-[20px]', s.block_nds)}>
        <DynamicGeoSelect
          inputValue={fields.address.value}
          className="grow"
          placeholder="Адрес"
          error={hasError('address') || hasError('latitude') || hasError('longitude')}
          onInput={fields.address.onChange}
          onSelect={handleSelectAddress}
          required
        />
        <div className="grow h-[56px] px-[16px] self-stretch bg-white rounded-[10px] shadow flex justify-between items-center">
          <span className="text-sm">С НДС</span>
          <Checkbox checked={fields.withNds.value} onChange={fields.withNds.onChange} />
        </div>
      </div>
      <div className={classNames('flex gap-[20px]', s.block_bottom)}>
        <AsyncSelect
          placeholder="Тип вторсырья"
          inputProps={{
            required: true,
            error: hasError('recyclableType'),
          }}
          className="grow"
          onSelect={fields.recyclableType.onChange}
          value={fields.recyclableType.value}
          loadData={recyclablesSelectApi}
        />
        <BaseInput type="number" error={hasError('price')} className="grow" placeholder="Цена за единицу веса, кг" required value={fields.price.value} onChange={fields.price.onChange} />
        <BaseInput type="number" error={hasError('volume')} className="grow" placeholder="Объем, т" required value={fields.volume.value} onChange={fields.volume.onChange} inputAfterFloat={1}/>
      </div>

      {
        fields.recyclableType.value !== null &&
        <Tooltip content="Можете указать характер материала, его загрязнение, условия оплаты и отгрузки, возможность доставки собственным транспортом или другие важные параметры...">
          <Collapse opened>
            <ul className="list-inside list-disc">
              <li>
                {fields.recyclableType.value?.value?.description}
              </li>
            </ul>
          </Collapse>
        </Tooltip>
      }
      <div className={classNames('mt-[4px] flex gap-[24px] items-center', s.block, s.footer)}>
        <Button disabled={!isValid} className={classNames('w-1/2', s.block_input)} htmlType="submit">
          Опубликовать
        </Button>
        <div className="flex gap-[24px]">
          {totalPrice[0] !== 0 && (
            <div className="">
              <p className="text-sm text-grey-40">Общая стоимость</p>
              <p className="text-xl text-black font-semibold mt-[4px]">
                {totalPrice[0]}
                {' '}
                ₽
                {' '}
                {/*Временно убранная часть в связи в решениями заказчика*/}
                {/*<span className="text-sm text-grey-70 font-normal">{`(включая НДС ${totalPrice[1]} ₽)`}</span>*/}
              </p>
            </div>
          )}

        </div>
      </div>

    </form>
  );
};
