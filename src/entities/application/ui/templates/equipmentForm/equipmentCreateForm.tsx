import classNames from "classnames";
import React, {FormEventHandler} from "react";
import {IWithClass} from "@types";
import s from "@box/entities/application/ui/templates/equipmentForm/style.module.scss";
import {AsyncSelect, BaseInput, Button} from "@box/shared/ui";
import {equipmentSelectApi} from "@box/entities/application/api/selects/equipmentSelect";
import {useForm} from "@box/shared/effector-forms";
import {equipForm} from "@box/features/equipment";


export const EquipmentCreateForm: React.FC<IWithClass> = ({
                                                              className
                                                          }) => {


    const {
        fields, submit, isValid, hasError, reset
    } = useForm(equipForm);

    const onSubmit: FormEventHandler = (ev) => {
        ev.preventDefault();

        submit();
    };

    return (
        <form onSubmit={onSubmit} className={classNames('flex flex-col gap-[20px]', className)}>
            <div className={classNames('flex gap-[20px]', s.block)}>
                <AsyncSelect
                    className={classNames('grow self-end', s.block_input)}
                    placeholder="Тип оборудования"
                    inputProps={{
                        required: true,
                        error: hasError('category'),
                    }}
                    loadData={equipmentSelectApi}
                    //ИЗМЕНИЛ
                    value={fields.category.value}
                    onSelect={(val) => {
                        fields.category.onChange(val)
                    }}
                />
            </div>
            <div className={classNames('flex gap-[20px]', s.block)}>
                <BaseInput
                    required
                    className="grow"
                    placeholder="Название оборудования"
                    value={fields.name.value}
                    onChange={fields.name.onChange}/>
                <BaseInput
                    required
                    className="grow"
                    placeholder="Описание оборудования"
                    value={fields.description.value}
                    onChange={fields.description.onChange}/>
            </div>
            <div className={classNames('mt-[4px] flex gap-[24px] items-center ', s.block, s.footer)}>
                <Button
                    disabled={!isValid}
                    className={classNames('w-1/2', s.block_input)}
                    htmlType="submit">
                    Создать
                </Button>
            </div>
        </form>
    )
}