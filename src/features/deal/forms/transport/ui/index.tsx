import React, { FC } from "react";
import { DealStatus, TransportApplicationStatus } from "@box/entities/deal/model";
import { TransportWhoDelivers } from "./transportWhoDelivers";
import { TransportCargoLoaded } from "./transportCargoLoaded";
import { TransportCargoUnloaded } from "./transportCargoUnloaded";
import { $id, gate, transportForm, updateTransportFx } from '../model';
import classNames from "classnames";
import { ITransportFlowForm } from "./types";
import { useEvent, useGate, useStore } from "effector-react";
import { useRouter } from "next/router";
import { useForm } from '@box/shared/effector-forms';
import { useConfirm } from "@box/entities/notification";
import { tips } from "@box/features/deal/forms/flow/lib";
import  {
  BaseInput, Button, Checkbox, DisabledView, TabSelect, Tip
} from "@box/shared/ui";
import s from './style.module.scss';
import { IGeocode } from "@box/shared/ui/select/geo-select/types";
import dynamic from "next/dynamic";
import { loadingFormatSelectValues } from "@box/entities/logistics/lib";
import VMasker from "vanilla-masker";

const DynamicGeoSelect = dynamic(
  () => import('@box/shared/ui').then(module => module.GeoSelect),
  { ssr: false }
)

export const statusPops: Record<number, React.FC> = {
  [TransportApplicationStatus.AGREEMENT]: TransportWhoDelivers,
  [TransportApplicationStatus.LOADING]: TransportCargoLoaded,
  [TransportApplicationStatus.UNLOADING]: TransportCargoUnloaded,
  [TransportApplicationStatus.COMPLETED]: TransportCargoUnloaded,
};

export const TransportFlowForm: FC<ITransportFlowForm> = ({
  className,
  contractor,
  deliveryPrice
}) => {
  const { fields, submit, hasError } = useForm(transportForm);
  const rejectConfirm = useConfirm();
  const updateTransport = useEvent(updateTransportFx);
  const id = useStore($id);
  const router = useRouter();

  useGate(gate);

  const rejectHandler = async () => {
    const data = await rejectConfirm.confirm({
      title: 'Подтверждение',
      message: 'Вы уверены что хотите отменить сделку'
    });

    if (data) {
      await updateTransport({
        id,
        data: {
          // @ts-ignore
          status: DealStatus.REJECTED,
          deal: {}
        }
      });
      router.push('/profile/logistics');
    }
  };
  const argumentHandler = async () => {
    const data = await rejectConfirm.confirm({
      title: 'Подтверждение',
      message: 'Вы уверены что хотите открыть спор?'
    });

    if (data) {
      await updateTransport({
        id,
        data: {
          // @ts-ignore
          status: DealStatus.ARGUMENT,
          deal: {}
        }
      });
      router.push('/profile/logistics');
    }
  };

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
    <div  className={classNames(className, 'flex flex-col gap-[16px]')}>
      {
        tips[fields.status.value as DealStatus].map((tip) => (
          <Tip>
            {tip}
          </Tip>
        ))
      }

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
      <BaseInput type="text" error={hasError('phone')} className="grow" placeholder="Номер телефона" required value={fields.phone.value} onChange={(val) => fields.phone.onChange(VMasker.toPattern(val, '(999)999-99-99'))} />
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
      {
        (!!deliveryPrice || !!contractor) &&
          <div className="flex gap-[16px] p-[4px]">
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
          </div>
      }

      <div className={classNames("flex gap-[20px] justify-center flex-wrap", s.buttons)}>
        <Button
          width={120}
          type="mini"
          htmlType="submit"
          onClick={() => submit()}
        >
          Сохранить
        </Button>
        <Button
          width={120}
          mode="light"
          type="mini"
          onClick={rejectHandler}
        >
          Отклонить
        </Button>
        {fields.status.value > TransportApplicationStatus.AGREEMENT && <Button
          width={120}
          mode="light"
          type="mini"
          onClick={argumentHandler}
        >
          Спор
        </Button>}
      </div>
    </div>
  )
}