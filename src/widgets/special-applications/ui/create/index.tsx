import {useForm} from "@box/shared/effector-forms";
import {specialApplicationsPeriod} from "@box/entities/special-application";
import classNames from "classnames";
import s from "@box/entities/application/ui/templates/readyForShipmentForm/style.module.scss";
import {
    AsyncSelect,
    BaseInput, Button,
    Checkbox, DisabledView,
    ImagePicker,
    Select,
} from "@box/shared/ui";
import {IWithClass, ROLE} from "@types";
import React, {FormEventHandler, useEffect} from "react";
import {useStore} from "effector-react";
import {$authStore} from "@box/entities/auth";
import dynamic from "next/dynamic";
import {IGeocode} from "@box/shared/ui/select/geo-select/types";
import {existingCompanySelectApi} from "@box/entities/company";
import {specialApplicationForm} from "@box/features";


const DynamicGeoSelect = dynamic(
    () => import('@box/shared/ui').then(module => module.GeoSelect),
    {ssr: false}
)

export const SpecialApplicationCreateForm: React.FC<IWithClass> = ({
                                                                       className

                                                                   }) => {
    //форма для формы специального объявления
    const {fields, submit, hasError, isValid, reset} = useForm(specialApplicationForm);
    const {user} = useStore($authStore);

    const handleSelectAddress = (data: IGeocode) => {
        fields.address.onChange(data.address);
        fields.latitude.onChange(data.latitude);
        fields.longitude.onChange(data.longitude);
        fields.city.onChange(data.city || '');
    };

    const loadData = async (val: string) => {
        return await existingCompanySelectApi(val, user?.role?.id === ROLE.MANAGER ? user?.id : undefined);
    }

    const onSubmit: FormEventHandler = (ev) => {
        ev.preventDefault();
        submit();
    };

    useEffect(() => {
        return () => {
            reset();
            fields.company.onChange(user?.company ? {
                label: user?.company?.name,
                id: user?.company?.id,
                value: user.company
            } : null);
            fields.address.onChange(user?.company?.address || "");
            fields.longitude.onChange(user?.company?.longitude.toString() || "");
            fields.latitude.onChange(user?.company?.latitude.toString() || "");
            fields.city.onChange(user?.company?.city?.id.toString() || "");
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

                <div className={classNames('flex gap-[20px]', s.block)}>
                    <BaseInput type="number" error={hasError('price')} className="grow"
                               placeholder="Цена" required value={fields.price.value}
                               onChange={fields.price.onChange}/>
                    <div className={classNames('flex gap-[20px] grow-[2]', s.block_nds)}>
                        <DisabledView
                            className="w-full"
                            disabled={user?.role?.id !== ROLE.ADMIN && user?.role?.id !== ROLE.MANAGER}
                        >
                            <AsyncSelect
                                className={classNames('grow self-end', s.block_input)}
                                placeholder="Название компании или ИНН"
                                inputProps={{
                                    required: true,
                                    error: hasError('company'),
                                }}
                                loadData={loadData}
                                value={fields?.company?.value}
                                onSelect={(val) => fields?.company.onChange(val)}
                            />
                        </DisabledView>
                    </div>
                    <div
                        className="grow px-[16px] h-[56px] self-stretch bg-white rounded-[10px] shadow flex justify-between items-center">
                        <span className="text-sm">С НДС</span>
                        <Checkbox checked={fields?.withNds?.value} onChange={fields?.withNds.onChange}/>
                    </div>
                </div>

                <div className={classNames('flex gap-[20px]', s.block)}>
                    {// @ts-ignore
                        <Select
                            inputProps={{
                                required: true,
                                error: hasError('period'),
                            }}
                            className="grow"
                            placeholder="Время публикации"
                            onSelect={fields?.period?.onChange}
                            value={fields?.period?.value}
                            data={specialApplicationsPeriod}>
                        </Select>}
                    <DynamicGeoSelect
                        inputValue={fields.address.value}
                        className="grow"
                        placeholder="Адрес"
                        error={hasError('address') || hasError('latitude') || hasError('longitude')}
                        onInput={fields?.address?.onChange}
                        onSelect={handleSelectAddress}
                        required
                    />
                    <div className="">
                        <BaseInput className="grow" placeholder="Комментарий" value={fields?.comment?.value}
                                   onChange={fields?.comment?.onChange}/>
                    </div>
                </div>

                <div className="">
                    <BaseInput className="grow" required placeholder="Описание" value={fields?.description?.value}
                               onChange={fields?.description?.onChange}/>
                </div>

                <div className={classNames('mt-[4px] flex gap-[24px] items-center ', s.block, s.footer)}>
                    <Button
                        disabled={!isValid}
                        className={classNames('w-1/2', s.block_input)}
                        htmlType="submit">
                        Опубликовать
                    </Button>
                </div>
            </form>
    );
}