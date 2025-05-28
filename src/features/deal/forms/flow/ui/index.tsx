import React from 'react';
import { useForm } from '@box/shared/effector-forms';
import {
  Button, Tip
} from '@box/shared/ui';
import classNames from 'classnames';
import { useEvent, useGate, useStore } from 'effector-react';
import { DealStatus, DealType, TransportApplicationStatus } from '@box/entities/deal/model';
import { useConfirm } from '@box/entities/notification';
import { useRouter } from 'next/router';
import {
  form, updateDealFx, $id, gate 
} from '../model';
import { tips } from '../lib';
import { WhoDelivers } from './whoDelivers';
import { CargoLoaded } from './cardoLoaded';
import { CargoUnloaded } from './cargoUnloaded';
import { RecyclablesDealForm } from './recyclablesDealForm';
import { TransportDealForm } from './transportDealForm';
import { IDealFlowForm } from "./types";
import s from './style.module.scss';
import Link from 'next/link';
import {$authStore} from "@box/entities/auth";

export const statusPops: Record<number, React.FC> = {
  [TransportApplicationStatus.AGREEMENT]: WhoDelivers,
  [TransportApplicationStatus.LOADING]: CargoLoaded,
  [TransportApplicationStatus.UNLOADING]: CargoUnloaded,
  [TransportApplicationStatus.COMPLETED]: CargoUnloaded,
};

export const DealFlowForm: React.FC<IDealFlowForm> = ({
  className,
  totalPrice,
  contractor,
  whoDelivers,
  isBuyer,
  isSupplier,
  buyerpaysshipping,
  disabled,
  deliveryPrice
}) => {
  const {
    fields,
    submit
  } = useForm(form);
  const rejectConfirm = useConfirm();
  const updateDeal = useEvent(updateDealFx);
  const id = useStore($id);
  const router = useRouter();

  const user = useStore($authStore)

  useGate(gate)

  const rejectHandler = async () => {
    const data = await rejectConfirm.confirm({
      title: 'Подтверждение',
      message: 'Вы уверены что хотите отменить сделку'
    });

    if (data) {
      await updateDeal({
        id,
        data: {
          // @ts-ignore
          status: DealStatus.REJECTED
        }
      });
      router.push('/profile/deals');
    } 
  };

  const argumentHandler = async () => {
    const data = await rejectConfirm.confirm({
      title: 'Подтверждение',
      message: 'Вы уверены что хотите открыть спор?'
    });

    if (data) {
      await updateDeal({
        id,
        data: {
          // @ts-ignore
          status: DealStatus.ARGUMENT,

          comment: `Спор от ${new Date().toLocaleDateString()}, открыл ${user.user?.company.name}`
        }
      });
      router.push('/profile/deals');
    } 
  };
  return (
    <div
      className={classNames(className, 'flex flex-col gap-[16px]')}
    >
      {tips[fields.status.value as DealStatus].map((tip) => (
        <Tip>
          {tip}
        </Tip>
      ))}
      {
        disabled &&
        !!whoDelivers &&
        whoDelivers === 3 &&
        (
          (
            ((isBuyer && buyerpaysshipping) || (isSupplier && !buyerpaysshipping)) &&
            <Tip>
              Обсудите предложения логистов компании VtorPrice и выберите подходящее в разделе <Link className='text-grey-40' href='/profile/logistics'>“Логистика”</Link> Вашего Личного кабинета.
            </Tip>
          ) || (
            <Tip isBlue>Ожидаем выбор логиста { buyerpaysshipping ? 'покупателем' : 'продавцом'}</Tip>
          )
        )
      }

      {
        fields.type.value === DealType.RECYCLABLES ?
          <RecyclablesDealForm disabled={disabled} totalPrice={totalPrice} /> :
          <TransportDealForm deliveryPrice={deliveryPrice} contractor={contractor} />
      }

      <div className={classNames("flex gap-[20px] justify-center flex-wrap", s.buttons)}>
        <Button
          width={120}
          type="mini"
          htmlType="submit"
          onClick={() => submit()}
          disabled={disabled}
        >
          Сохранить
        </Button>
        <Button
          width={120}
          mode="light"
          type="mini"
          onClick={rejectHandler}
          disabled={disabled}
        >
          Отклонить
        </Button>
        {fields.status.value > 2 && <Button
          width={120}
          mode="light"
          type="mini"
          onClick={argumentHandler}
          disabled={disabled}
        >
          Спор
        </Button>}
      </div>
    </div>
  );
}; 
