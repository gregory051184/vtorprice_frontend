import React, { FormEventHandler } from 'react';
import { useForm } from '@box/shared/effector-forms';
import { useEvent, useStore } from 'effector-react';
import classNames from 'classnames';
import {
  AsyncSelect, BaseInput, Button, Checkbox, Collapse, ImagePicker, TabSelect
} from '@box/shared/ui';
import { dealTypeSelectValues, packingSelectValues, packingTaxSelectValues } from '@box/entities/application';
import { existingCompanySelectApi, recyclablesSelectApi } from '@box/entities/company';
import { IWithClass } from '@types';
import {
  readyForShipmentForm, $totalPrice, $totalWeight, $images, addImage, removeImage
} from '../model';
import s from './style.module.scss';
import { IGeocode } from "@box/shared/ui/select/geo-select/types";
import dynamic from "next/dynamic";

const DynamicGeoSelect = dynamic(
  () => import('@box/shared/ui').then(module => module.GeoSelect),
  { ssr: false }
)

export const UpdateReadyForShipmentApplicationForm: React.FC<IWithClass> = ({
  className,
}) => {
  const {
    fields, submit, isValid,
    hasError,
  } = useForm(readyForShipmentForm);

  const totalWeight = useStore($totalWeight);
  const totalPrice = useStore($totalPrice);
  const images = useStore($images);
  const addImg = useEvent(addImage);
  const rmImage = useEvent(removeImage);
  const onSubmit: FormEventHandler = (ev) => {
    ev.preventDefault();
    submit();
  };

  const handleSelectAddress = (data: IGeocode) => {
    fields.address.onChange(data.address);
    fields.latitude.onChange(data.latitude);
    fields.longitude.onChange(data.longitude);
    fields.city.onChange(data.city || '');
  };

  return (
    <form onSubmit={onSubmit} className={classNames('flex flex-col gap-[20px]', className)}>
      <div className={classNames(s.images)}>
        {/* TODO: fix rerender */}
        {images.map((image, num: number) => (
          <ImagePicker
            /* eslint-disable-next-line react/no-array-index-key */
            key={num}
            onChange={(file) => {
              if (file) {
                addImg({
                  index: num,
                  file
                });
                return;
              }
              rmImage({
                index: num,
                imageId: image?.id as number
              });
            }}
            className={s.images_image}
            image={image?.image || null}
          />
        ))}

      </div>
      <div className={classNames('flex gap-[20px]', s.block)}>
        <TabSelect
          label="Тип сделки"
          onChange={fields.dealType.onChange}
          values={dealTypeSelectValues}
          value={fields.dealType.value}
        />
        <AsyncSelect
          className={classNames('grow self-end', s.block_input)}
          placeholder="Название компании или ИНН"
          inputProps={{
            required: true,
            error: hasError('company'),
          }}
          loadData={existingCompanySelectApi}
          value={fields.company.value}
          onSelect={(val) => fields.company.onChange(val)}
        />
      </div>

      <div className={classNames('flex gap-[20px]', s.block)}>
        <BaseInput type="number" error={hasError('price')} className="grow" placeholder="Цена за единицу веса, ₽/кг" required value={fields.price.value} onChange={fields.price.onChange} />
        <div className={classNames('flex gap-[20px] grow-[2]', s.block_nds)}>          
        <BaseInput 
          type="number" 
          error={hasError('allVolume')} 
          className="grow" 
          placeholder="Общее кол-во товара, т" 
          value={fields.allVolume?.value} 
          onChange={fields.allVolume.onChange}
          inputAfterFloat={1}
          required
        />
          <div className="grow px-[16px] h-[56px] self-stretch bg-white rounded-[10px] shadow flex justify-between items-center">
            <span className="text-sm">С НДС</span>
            <Checkbox checked={fields.withNds.value} onChange={fields.withNds.onChange} />
          </div>
        </div>

      </div>
      <div className={classNames('flex gap-[20px]', s.block)}>
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
        <BaseInput type="number" error={hasError('preferential')} className="grow" placeholder="Мин. вес фуры, т" required value={fields.preferential.value} onChange={fields.preferential.onChange} inputAfterFloat={1}/>
      </div>
      <DynamicGeoSelect
          inputValue={fields.address.value}
          className="grow"
          placeholder="Адрес"
          error={hasError('address') || hasError('latitude') || hasError('longitude')}
          onInput={fields.address.onChange}
          onSelect={handleSelectAddress}
          required
        />
      <div className={classNames('flex gap-[20px]', s.block)}>
        <BaseInput type="number" error={hasError('kipVolume')} className="grow" placeholder="Кол–во кип, шт" value={fields.kipVolume.value} onChange={fields.kipVolume.onChange} />
        <BaseInput type="number" error={hasError('kipWeight')} className="grow" placeholder="Вес одной кипы, т" value={fields.kipWeight.value} onChange={fields.kipWeight.onChange} inputAfterFloat={1}/>
      </div>
      <Collapse opened={fields.recyclableType.value !== null}>
        <ul className="list-inside list-disc">
          <li>
            {fields.recyclableType.value?.value?.description}
          </li>
        </ul>
      </Collapse>
      <div className="">
        <BaseInput className="grow" placeholder="Комментарий" value={fields.comment.value} onChange={fields.comment.onChange} />
      </div>
      <div className={classNames('flex gap-[20px]', s.block)}>
        <TabSelect
          label="Упаковка"
          onChange={(val) => {
            fields.packing.onChange(val);
          }}
          values={packingSelectValues}
          value={fields.packing.value}
        />
        { fields.packing.value.id === 2 && (
          <>
            <TabSelect
              label="Вычет"
              onChange={fields.packingTax.onChange}
              values={packingTaxSelectValues}
              value={fields.packingTax.value}
            />
            <BaseInput
              error={hasError('packingTaxVolume')}
              type="number"
              className={classNames('grow self-end', s.block_input)}
              placeholder={`Значение, ${fields.packingTax.value.value === 2 ? '%' : 'т'}`}
              value={fields.packingTaxVolume.value}
              onChange={fields.packingTaxVolume.onChange}
              inputAfterFloat={1}
              required
            />
          </>
        ) }
      </div>
      <div className={classNames('mt-[4px] flex gap-[24px] items-center ', s.block, s.footer)}>
        <Button disabled={!isValid} className={classNames('w-1/2', s.block_input)} htmlType="submit">
          Сохранить изменения
        </Button>
        <div className={classNames('flex gap-[24px]', s.footer_price)}>
          {/* Временно убрано */}
          {/*{totalWeight !== 0 && (
            <div className="">
              <p className="text-sm text-grey-40">Общий вес, т</p>
              <p className="text-xl text-black font-semibold mt-[4px]">{totalWeight.toLocaleString()}</p>
            </div>
          )}*/}
          {totalPrice[0] !== 0 && (
            <div className="">
              <p className="text-sm text-grey-40">Общая стоимость</p>
              <p className="text-xl text-black font-semibold mt-[4px]">
                {totalPrice[0].toLocaleString()}
                {' '}
                ₽
                {' '}
                <span className="text-sm text-grey-70 font-normal">
                  {/* Временно убрано */}
                  {/*`(включая НДС ${totalPrice[1].toLocaleString()} ₽)`*/}
                </span>

              </p>
            </div>
          )}

        </div>
      </div>

    </form>
  );
};
