import {
  DynamicForm,
  FormField,
} from '@box/shared/effector-form-controller/types';
import {
  AsyncSelect,
  BaseInput,
  Button,
  Checkbox,
  DisabledView,
} from '@box/shared/ui';
import React, { useRef } from 'react';
import Add from '@assets/icons/16_add.svg';
import Trash from '@assets/icons/trash_can.svg';
import { IWithClass } from '@box/types';
import {
  useDynamicForm,
  useField,
} from '@box/shared/effector-form-controller/hooks';
import { recyclablesSelectApi } from '@box/entities/company/api/selects';
import classNames from 'classnames';
import s from './style.module.scss';

interface IRecyclablesTypesFormComponent extends IWithClass {
  active: FormField;
  form: DynamicForm<any>;
  name: string;
}

export const RecyclablesTypesFormComponent: React.FC<
IRecyclablesTypesFormComponent
> = ({
  active, form, className, name,
}) => {
  const checked = useField(active);
  const formRef = useRef(null);

  const {
    fields, setValue, errors, deleteField, addField,
  } = useDynamicForm(
    form,
    formRef,
  );
  return (
    <form className={className} ref={formRef}>
      <Checkbox
        checked={checked.store.$value}
        onChange={checked.onChange}
        description={name}
      />
      <DisabledView disabled={!checked.store.$value} className="">
        {Object.values(fields).map((field) => (
          <div
            key={field.id}
            className={classNames('flex items-center gap-[16px]  mt-[18px]', s.block)}
          >
            <div className={classNames('flex grow gap-[16px]', s.block)}>
              <AsyncSelect
                className={classNames('grow', s.block_select)}
                inputProps={{
                  required: true,
                  error: errors[field.id]?.recyclables,
                }}
                placeholder="Тип вторсырья"
                loadData={recyclablesSelectApi}
                value={field.recyclables}
                onSelect={(val) => setValue({
                  id: field.id,
                  name: 'recyclables',
                  value: val,
                })}
              />
              <BaseInput
                error={errors[field.id]?.monthlyVolume}
                onChange={(val) => setValue({
                  id: field.id,
                  name: 'monthlyVolume',
                  value: val,
                })}
                value={field.monthlyVolume}
                className={classNames('grow', s.block_select)}
                placeholder="~ Ежемес. объем, т"
                inputAfterFloat={1}
                required
              />
              <BaseInput
                error={errors[field.id]?.price}
                onChange={(val) => setValue({
                  id: field.id,
                  name: 'price',
                  value: val,
                })}
                value={field.price}
                className={classNames('grow', s.block_select)}
                placeholder="Цена за единицу веса в кг"
                required
              />
            </div>
            {field.removable && (
              <div
                onClick={() => deleteField(field.id)}
                className="cursor-pointer"
              >
                <Trash width={25} height={25} />
              </div>
            )}
          </div>
        ))}

        <Button
          onClick={() => addField()}
          className="m-auto mt-[20px]"
          type="mini"
          mode="notFilled"
          iconLeft={<Add />}
        >
          Добавить вторсырье
        </Button>
      </DisabledView>
    </form>
  );
};
