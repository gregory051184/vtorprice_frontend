import React, {FormEventHandler, useEffect} from 'react';
import {useForm} from '@box/shared/effector-forms';
import {useStore} from 'effector-react';
import classNames from 'classnames';
import {
    AsyncSelect, BaseInput, Button, Checkbox, DatePicker, DisabledView, ImagePicker, TabSelect
} from '@box/shared/ui';
import {dealTypeSelectValues, wasInUseSelectValues} from '@box/entities/application';
//import {equipmentCategorySelectAPi, equipmentSelectApi} from '@box/entities/application/api/selects/equipmentSelect';
import {companySelectApi} from '@box/entities/company';
import {ROLE} from '@box/types';
import {$authStore} from '@box/entities/auth';
import {IEquipmentForm} from './types';
import s from './style.module.scss';
import {IGeocode} from "@box/shared/ui/select/geo-select/types";
import dynamic from "next/dynamic";

const DynamicGeoSelect = dynamic(
    () => import('@box/shared/ui').then(module => module.GeoSelect),
    {ssr: false}
)

export const EquipmentFormTemplate: React.FC<IEquipmentForm> = ({
                                                                    className,
                                                                    form,
                                                                    totalPrice: tp,
                                                                    buttonText = 'Сохранить изменения',
                                                                    //Исправил название кнопки
                                                                    //buttonText = 'Отправить на модерацию',
                                                                    isUpdate = false,

                                                                }) => {
    const {
        fields, submit, isValid, hasError, reset
    } = useForm(form);

    const totalPrice = useStore(tp);
    const onSubmit: FormEventHandler = (ev) => {
        ev.preventDefault();
        submit();
    };

    const {user} = useStore($authStore);

    const date = () => {
        if (fields.manufactureDate.value) {
            return new Date(fields.manufactureDate.value);
        }
        return null;
    };

    const handleSelectAddress = (data: IGeocode) => {
        fields.address.onChange(data.address);
        fields.latitude.onChange(data.latitude);
        fields.longitude.onChange(data.longitude);
        fields.city.onChange(data.city || '')
    };

    const loadData = async (val: string) => {
        return await companySelectApi(val, user?.role.id === ROLE.MANAGER ? user?.id : undefined);
    }

    useEffect(() => {
        return () => {
            if (!isUpdate) {
                reset();
                fields.company.onChange(user?.company ? {
                    label: user?.company?.name,
                    id: user?.company?.id,
                    value: user.company
                } : null);
                fields.address.onChange(user?.company?.address || "");
                // @ts-ignore
                fields.longitude.onChange(user?.company?.longitude || "");
                // @ts-ignore
                fields.latitude.onChange(user?.company?.latitude || "");
                // @ts-ignore
                fields.city.onChange(user?.company?.city?.id || "");
            }
        }
    }, []);

    return (
        <form onSubmit={onSubmit} className={classNames('flex flex-col gap-[20px]', className)}>
            <div className={classNames(s.images)}>
                {/* TODO: fix rerender */}
                {fields.images.value.map((file: any, num: number) => (
                    <ImagePicker
                        /* eslint-disable-next-line react/no-array-index-key */
                        key={num}
                        onChange={(file) => {
                            const arr = [...fields.images.value];
                            arr[num] = file;
                            fields.images.onChange(arr);
                        }}
                        className={s.images_image}
                        image={file}
                    />
                ))}

            </div>

            <div className={classNames('flex gap-[20px] items-center', s.block)}>
                <TabSelect
                    label="Тип сделки"
                    onChange={fields.dealType.onChange}
                    values={dealTypeSelectValues}
                    value={fields.dealType.value}
                />
                <DisabledView className="w-full"
                              disabled={user?.role.id !== ROLE.ADMIN && user?.role.id !== ROLE.MANAGER}>
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

            <div className={classNames('flex gap-[20px]', s.block)}>
                {/*isUpdate ?
                    <AsyncSelect
                    className={classNames('grow self-end', s.block_input)}
                    placeholder="Тип оборудования"
                    inputProps={{
                        required: true,
                        error: hasError('category'),
                    }}
                    loadData={equipmentCategorySelectAPi}
                    //ИЗМЕНИЛ
                    value={fields?.category?.value}
                    onSelect={fields.category.onChange}
                /> :
                    <AsyncSelect
                        className={classNames('grow self-end', s.block_input)}
                        placeholder="Тип оборудования"
                        inputProps={{
                            required: true,
                            error: hasError('category'),
                        }}
                        loadData={equipmentSelectApi}
                        //ИЗМЕНИЛ
                        value={fields?.category_for_create?.value}
                        onSelect={fields.category_for_create.onChange}
                    />
                */}

                {/*ДОБАВИЛ*/}
                <BaseInput
                    className="grow"
                    placeholder="Наименование оборудования"
                           //value={fields?.equipment?.value?.label/*fields.equipment.value*/}
                           required={true}
                    //@ts-ignore
                           onChange={fields.equipment.onChange}/>


                <div className={classNames('flex gap-[20px] grow-[2]', s.block_nds)}>
                    <BaseInput type="number" error={hasError('priceForUnit')} className="grow"
                               placeholder="Цена за 1 шт, ₽" required value={fields.priceForUnit.value}
                               onChange={fields.priceForUnit.onChange}/>
                    <BaseInput type="number" error={hasError('count')} className="grow" placeholder="Кол-во" required
                               value={fields.count.value} onChange={fields.count.onChange}/>
                </div>
            </div>

            <div className={classNames('flex gap-[20px]', s.block)}>
                <div
                    className="grow px-[16px] h-[56px] self-stretch bg-white rounded-[10px] shadow flex justify-between items-center">
                    <span className="text-sm">С НДС</span>
                    <Checkbox checked={fields.withNds.value} onChange={fields.withNds.onChange}/>
                </div>
                <div
                    className="grow px-[16px] h-[56px] self-stretch bg-white rounded-[10px] shadow flex justify-between items-center">
                    <span className="text-sm">Продажа по частям</span>
                    <Checkbox checked={fields.saleByParts.value} onChange={fields.saleByParts.onChange}/>
                </div>
                <TabSelect
                    label="Cостояние"
                    value={fields.wasInUse.value}
                    onChange={fields.wasInUse.onChange}
                    values={wasInUseSelectValues}
                />
                <DatePicker
                    placeholder="Дата производства"
                    className="h-[56px] grow"
                    value={[date(), null]}
                    onChange={(date) => fields.manufactureDate.onChange(date[0])}
                    error={hasError('manufactureDate')}
                    required
                    amountOfMonths={1}
                    maxDate={new Date()}
                />
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

            {/*ДОБАВИЛ*/}
            <BaseInput className="grow" placeholder="Описание оборудования" value={fields.description.value}
                       onChange={fields.description.onChange}/>

            <BaseInput className="grow" placeholder="Комментарий" value={fields.comment.value}
                       onChange={fields.comment.onChange}/>

            <div className={classNames('mt-[4px] flex gap-[24px] items-center ', s.block, s.footer)}>
                <Button disabled={!isValid} className={classNames('w-1/2', s.block_input)} htmlType="submit">
                    {buttonText}
                </Button>
                <div className={classNames('', s.footer_price)}>
                    {totalPrice[0] !== 0 && (
                        <div className="">
                            <p className="text-sm text-grey-40">Общая стоимость</p>
                            <p className="text-xl text-black font-semibold mt-[4px]">
                                {totalPrice[0].toLocaleString()}
                                {' '}
                                ₽
                                {' '}
                                {/*Временно убранная часть в связи в решениями заказчика*/}
                                {/*<span className="text-sm text-grey-70 font-normal">{`(включая НДС ${totalPrice[1].toLocaleString()} ₽)`}</span>*/}
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </form>
    );
};
