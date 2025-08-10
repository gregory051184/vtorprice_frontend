import {
    DynamicForm,
    FormField,
} from '@box/shared/effector-form-controller/types';
import {
    AsyncSelect,
    BaseInput,
    Button,
    Checkbox,
    DisabledView, Select, Tip
} from '@box/shared/ui';
import React, {useEffect, useRef, useState} from 'react';
import Add from '@assets/icons/16_add.svg';
import Trash from '@assets/icons/trash_can.svg';
import {IWithClass} from '@box/types';
import {
    useDynamicForm,
    useField,
} from '@box/shared/effector-form-controller/hooks';
import {recyclablesSelectApi} from '@box/entities/company/api/selects';
import classNames from 'classnames';
import s from './style.module.scss';
import {Event} from 'effector';
import {useEvent, useGate, useStore} from 'effector-react';
import {stokForCompaniesRecyclables} from "@box/entities/application";
import {$allCompanyApplications, gate} from "@box/shared/ui/running/model/store";
import {
    IRecyclableApplication, medianContractsPriceFx,
    updateApplicationInCompanyCardFx
} from "@box/entities/application/model";


interface IRecyclablesTypesFormComponent extends IWithClass {
    active: FormField;
    form: DynamicForm<any>;
    name: string;
    onPageLoadEvent: Event<void>;
}

export const RecyclablesTypesFormComponentManagement: React.FC<
    IRecyclablesTypesFormComponent
> = ({
         active, form, className, name, onPageLoadEvent
     }) => {
    const onPageLoad = useEvent(onPageLoadEvent)
    const checked = useField(active);
    const formRef = useRef(null);
    const [medianPrice, setMedianPrice] = useState<number>(0);
    const [fieldId, setFieldId] = useState<number>(0);
    const [recyclableId, setRecyclableId] = useState<number>(0);
    const [priceSector, setPriceSector] = useState<boolean>(false);
    const medianPriceEvent = useEvent(medianContractsPriceFx)
    const update = useEvent(updateApplicationInCompanyCardFx)
    const {
        fields, setValue, errors, deleteField, addField,
    } = useDynamicForm(
        form,
        formRef,
    );

    const applications = useStore($allCompanyApplications);

    const median = (values: number[]): number => {
        if (values.length === 0) {
            return 0;
        }
        const half = Math.floor(values.length / 2);
        return (values.length % 2
                ? values[half]
                : (values[half - 1] + values[half]) / 2
        );
    }

    const medianPriceHandler = async (deal_type: number, recyclables: number) => {
        const pricesList = await medianPriceEvent({deal_type: deal_type, recyclables: recyclables});
        const list = pricesList.sort((a, b) => a - b)
        const medianP = median(list);
        setMedianPrice(medianP)
        //medianPriceSectorHandler(medianPrice, inputPrice)
        return medianP
    }

    const fieldIdHandler = (fieldId: number) => {
        setFieldId(fieldId)
    }
    const recyclableIdHandler = (recyclableId: number) => {
        setRecyclableId(recyclableId)
    }

    const medianPriceSectorHandler = (price: number, inputPrice: number) => {
        const minusPercents = price * 0.65
        const plusPercents = price * 1.35
        return inputPrice < minusPercents || inputPrice > plusPercents
    }
    

    // const data = (id: string) => {
    //     const list = ['гранула', 'гранулы', "дробленка", "флекс"]
    //     recyclablesSelectApi().then(data => {
    //         if (+id === 1) {
    //             setFractionStatus([...data
    //                 .filter(elem => !data
    //                     .filter((elem => list
    //                         .some(v => elem.label.toLowerCase().includes(v)))).includes(elem))
    //                 //!elem.label
    //                     // .toLowerCase()
    //                     // .split(' ')
    //                     // //@ts-ignore
    //                     // .includes('гранула' || 'гранулы' || "дробленка" || "флекс")))
    //             ])
    //         }
    //         if (+id === 2) {
    //             setFractionStatus([...data
    //                 .filter((elem => list.some(v => elem.label.toLowerCase().includes(v))))
    //                     // elem.label
    //                     // .toLowerCase()
    //                     // .split(' ')
    //                     // //@ts-ignore
    //                     // .includes('гранула' || 'гранулы' || "дробленка" || "флекс")))
    //             ])
    //         }
    //
    //     })
    //
    // }

    const currentApplication = (applications: IRecyclableApplication[], fieldId: string, recyclables?: number, volume?: number, price?: number) => {
        deleteField(fieldId)
        if (recyclables && volume && price) {
            const applicationToDelete = applications
                .filter(app => app.recyclables.id === recyclables && app.volume === volume * 1000 && app.price === price);
            update({
                id: +applicationToDelete[0]?.id,
                status: 5,
                is_deleted: true,
                company: +applicationToDelete[0].company.id,
            })
        }
        return
    }

    useEffect(() => {
        onPageLoad()
    }, [applications, medianPrice, fieldId, recyclableId, priceSector])

    useGate(gate);
    return (
        <form className={className} ref={formRef}>
            <Checkbox
                checked={checked.store.$value}
                onChange={checked.onChange}
                description={name}
            />
            <DisabledView disabled={!checked.store.$value} className="">
                {Object.values(fields).map((field) => (
                    <div key={field.id}>
                        {(field.id === fieldId && field.recyclables.id === recyclableId && priceSector) &&
                            <Tip isBlue className="mt-[18px]">
                                <p>
                                    {name === "Покупаю" ? `Рекомендуемая цена покупки данной фракции ${medianPrice} ₽` :
                                        `Рекомендуемая цена продажи данной фракции ${medianPrice} ₽`}
                                </p>
                            </Tip>
                        }
                        <div
                            className={field.isDeleted.id === 2 ?
                                classNames('flex items-center gap-[16px] mt-[18px] border-orange-dark border-[2px] rounded-[10px] p-2', s.block) :
                                classNames('flex items-center gap-[16px] mt-[18px] ', s.block)}
                        >
                            <div
                                className={classNames('flex grow gap-[16px]', s.block)}>
                                <AsyncSelect
                                    className={classNames('grow', s.block_select)}
                                    inputProps={{
                                        required: true,
                                        error: errors[field.id]?.recyclables,
                                    }}
                                    placeholder="Тип вторсырья"
                                    loadData={recyclablesSelectApi}
                                    value={field.recyclables}
                                    onSelect={(val) =>
                                        setValue({
                                            id: field.id,
                                            name: 'recyclables',
                                            value: val,
                                        })
                                    }
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
                                    onChange={(val) => {
                                        fieldIdHandler(field.id)
                                        recyclableIdHandler(field.recyclables.id)

                                        //@ts-ignore
                                        medianPriceHandler(name === "Покупаю" ? 1 : 2, field.recyclables.id)
                                        setValue({
                                            id: field.id,
                                            name: 'price',
                                            value: val,
                                        })
                                        setPriceSector(medianPriceSectorHandler(medianPrice, +field.price))
                                    }}
                                    value={field.price}
                                    className={classNames('grow', s.block_select)}
                                    placeholder="Цена за единицу веса в тоннах * 1000, рубли"
                                    required
                                />
                                <Select
                                    onSelect={(val) => setValue({
                                        id: field.id,
                                        name: "isDeleted",
                                        value: val
                                    })}
                                    inputProps={{mode: 'stroke'}}
                                    value={field.isDeleted}
                                    data={stokForCompaniesRecyclables}/>
                            </div>
                            {field.removable && (
                                <div
                                    onClick={() => {
                                        currentApplication(applications, field.id, +field.recyclables?.value?.id, +field?.monthlyVolume, +field?.price,)
                                    }}
                                    className="cursor-pointer"
                                >
                                    <Trash width={25} height={25}/>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <Button
                    onClick={() => addField()}
                    className="m-auto mt-[20px]"
                    type="mini"
                    mode="notFilled"
                    iconLeft={<Add/>}
                >
                    Добавить вторсырье
                </Button>
            </DisabledView>
        </form>
    );
};
