import {
    useDynamicForm,
    useField,
} from '@box/shared/effector-form-controller/hooks';
import {
    DynamicForm,
    FormField,
} from '@box/shared/effector-form-controller/types';
import {
    AsyncSelect,
    Button,
    Checkbox,
    DisabledView,
    PillSelect,
} from '@box/shared/ui';
import {IWithClass} from '@box/types';
import React, {useEffect, useRef} from 'react';
import Add from '@assets/icons/16_add.svg';
import Trash from '@assets/icons/trash_can.svg';
import {Event, Store} from 'effector';
import {useEvent, useStore} from 'effector-react';
import {IPillValue} from '@box/shared/ui/select';
import {companyModel, recColTypeSelectApi} from '@box/entities/company';
import classNames from 'classnames';
import s from './style.module.scss';

interface ICompanyActivityTypesFormTemplate extends IWithClass {
    active: FormField<boolean>;
    form: DynamicForm;
    name: string;
    activityId: number;
    advantages: Store<Array<IPillValue<companyModel.IActivityTypeAdvantage>>>;
    selectedAdvantages: FormField<Array<IPillValue<companyModel.IActivityTypeAdvantage>>>;
    onPageLoadEvent: Event<void>;
}

export const CompanyActivityTypesFormTemplate: React.FC<
    ICompanyActivityTypesFormTemplate
> = ({
         className,
         active,
         form,
         name,
         activityId,
         selectedAdvantages,
         advantages,
         onPageLoadEvent
     }) => {
    const formRef = useRef(null);
    const onPageLoad = useEvent(onPageLoadEvent)
    const isActive = useField(active);
    const {
        fields, addField, deleteField, setValue, errors,
    } = useDynamicForm(
        form,
        formRef,
    );
    const allAdvantages = useStore(advantages);
    const formSelectedAdvantages = useField(selectedAdvantages);

    useEffect(() => {
        onPageLoad()
    }, [])

    return (
        <form ref={formRef} className={className}>
            <div className={classNames('flex items-center justify-between', s.block)}>
                <Checkbox
                    checked={isActive.store.$value}
                    onChange={isActive.onChange}
                    description={name}
                />
                <DisabledView disabled={!isActive.store.$value}>
                    <PillSelect
                        className={s.block_pills}
                        value={formSelectedAdvantages.store.$value}
                        values={allAdvantages}
                        onChange={(val) => {
                            formSelectedAdvantages.onChange(val);
                        }}
                    />
                </DisabledView>
            </div>
            <DisabledView disabled={!isActive.store.$value}>
                {fields.map((field) => (
                    <div
                        key={field.id}
                        className="mt-[18px] flex items-center gap-[16px] "
                    >
                        <AsyncSelect
                            withClearButton
                            inputProps={{
                                required: true,
                                error: errors[field.id]?.recColType,
                            }}
                            className="grow"
                            loadData={(val) => recColTypeSelectApi({
                                activityId,
                                search: val,
                            })}
                            onSelect={(val) => setValue({id: field.id, name: 'recColType', value: val})}
                            placeholder="Тип сбора/переработки"
                            value={field.recColType}
                        />
                        {field.removable && (
                            <div
                                onClick={() => deleteField(field.id)}
                                className="cursor-pointer"
                            >
                                <Trash width={25} height={25}/>
                            </div>
                        )}
                    </div>
                ))}

                <Button
                    onClick={addField}
                    className="m-auto mt-[20px]"
                    type="mini"
                    mode="notFilled"
                    iconLeft={<Add/>}
                >
                    Добавить тип сбора/переработки
                </Button>
            </DisabledView>
        </form>
    );
};
