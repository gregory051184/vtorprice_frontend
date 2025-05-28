import React, { FC } from "react";
import { IEquipmentDealFlowForm } from "./types";
import { $id, form, gate, updateEquipmentDealFx } from '../model';
import { useForm } from '@box/shared/effector-forms';
import { useConfirm } from '@box/entities/notification';
import { useEvent, useGate, useStore } from "effector-react";
import { useRouter } from "next/router";
import { DealStatus, DealType } from "@box/entities/deal/model";
import classNames from "classnames";
import { tips } from "@box/features/deal/forms/flow/lib";
import { Button, Tip } from "@box/shared/ui";
import Link from "next/link";
import s from "./style.module.scss";
import { EquipmentDealForm } from "./equipmentDealForm";
import { TransportDealForm } from "./transportDealForm";

const EquipmentDealFlowForm: FC<IEquipmentDealFlowForm> = ({
  className,
  whoDelivers,
  isBuyer,
  isSupplier,
  buyerpaysshipping,
  disabled,
  deliveryPrice,
  contractor,
}) => {
  const { fields, submit } = useForm(form);
  const rejectConfirm = useConfirm();
  const router = useRouter();
  const id = useStore($id);
  const updateEquipmentDeal = useEvent(updateEquipmentDealFx);
  useGate(gate);

  const rejectHandler = async () => {
    const data = await rejectConfirm.confirm({
      title: 'Подтверждение',
      message: 'Вы уверены что хотите отменить сделку'
    });

    if (data) {
      await updateEquipmentDeal({
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
      await updateEquipmentDeal({
        id,
        data: {
          // @ts-ignore
          status: DealStatus.ARGUMENT
        }
      });
      router.push('/profile/deals');
    }
  };

  return (
    <div className={classNames(className, 'flex flex-col gap-[16px]')}>
      {tips[fields.status.value as DealStatus].map((tip) => (
        <Tip key={tip}>
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
            <Tip isBlue>Ожидаем выбор логиста { buyerpaysshipping ?'покупателем' : 'продавцом'}</Tip>
          )
        )
      }

      {
        fields.dealType.value === DealType.EQUIPMENT ?
          <EquipmentDealForm disabled={disabled}/> :
          <TransportDealForm deliveryPrice={deliveryPrice} contractor={contractor}/>
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
        {fields.status.value === 1 && <Button
          width={120}
          mode="light"
          type="mini"
          onClick={rejectHandler}
          disabled={disabled}
        >
          Отклонить
        </Button>}
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
  )
}

export { EquipmentDealFlowForm }
