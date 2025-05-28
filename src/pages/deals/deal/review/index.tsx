import { Button, Paper, TextArea } from '@box/shared/ui';
import { IWithClass } from '@box/types';
import classNames from 'classnames';
import React, { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { $authHost } from '@box/shared/api';
import { useAlert } from '@box/entities/notification';
import { useStore } from "effector-react";
import { $deal } from "@box/pages/deals/deal/model";
import { $authStore } from "@box/entities/auth";
import { Avatar } from "@box/entities/user";
import { $equipmentDeal } from "@box/pages/equipment-deals/deal/model";

const StarRating:React.FC<IWithClass & {
  value: number,
  onSelect: (val: number) => void
}> = ({
  value,
  onSelect,
  className
}) => (
  <div className={classNames('star-rating flex gap-[10px]', className)}>
    {[1, 2, 3, 4, 5].map((v) => (
      <span
        className={classNames(v <= value ? 'text-orange-dark' : 'text-grey-20', 'text-4xl cursor-pointer')}
        onClick={() => onSelect(v)}
      >
        &#9733;
      </span>
    ))}
  </div>
);

export const DealReview: FC<{isEquipment?: boolean}> = ({ isEquipment = false }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const router = useRouter();
  const { alert } = useAlert();
  const recyclableDeal = useStore($deal);
  const equipmentDeal = useStore($equipmentDeal);
  const { user } = useStore($authStore);
  const deal = isEquipment ? equipmentDeal : recyclableDeal;

  const company = deal && user?.company && (
    (user?.company.id === deal.buyerCompany.id && {image: deal.supplierCompany.image, name: deal.supplierCompany.name}) ||
    (user?.company.id === deal.supplierCompany.id && {image: deal.buyerCompany.image, name: deal.buyerCompany.name}) ||
    null
  )
  const handleComment = async () => {
    const { id } = router.query;
    const url = isEquipment ? 'equipment_deals' : 'recyclables_deals'
    if (id) {
      try {
        await $authHost.post(`/${url}/${id}/reviews/`, {
          rate: rating,
          comment
        });
        alert({
          title: 'Успешно',
          message: 'Отзыв успешно оставлен'
        });
        router.push('/profile/deals');
      } catch (e) {
        alert({
          title: 'Ошибка',
          message: 'Отзыв уже оставлен'
        });
      }
    }
  };
  return (
      <div className="flex flex-col items-center mt-[24px]">
        {
            !!company &&
            <div className='flex gap-[10px] items-center'>
              <span className='text-[14px] font-bold'>{company.name}</span>
              <Avatar className="shrink-0" size="sm" url={company.image || null}/>
            </div>
        }
        <h1 className="text-[32px] mt-[24px]">Сделка завершена</h1>
        <p className="mt-[8px]">Оставьте отзыв о сотрудничестве</p>
        <StarRating value={rating} onSelect={setRating} className="mt-[30px]"/>

        <Paper className="max-w-[510px] w-full mt-[24px]">
          <TextArea value={comment} onChange={setComment} rows={10} placeholder="Текст отзыва"/>
          <Button onClick={handleComment} disabled={comment.trim().length < 20} fullWidth className="mt-[20px]">
            Опубликовать
          </Button>
        </Paper>
        <div className="fixed bottom-0 py-[30px] px-[10px] border-t border-t-grey-20 w-full flex justify-center">
          <p className="text-grey-30 font-semibold cursor-pointer"
             onClick={() => router.push('/profile/deals')}>Закрыть</p>
        </div>
      </div>
  );
};
