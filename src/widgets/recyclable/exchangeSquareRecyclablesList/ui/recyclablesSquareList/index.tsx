import React, {useEffect, useState} from "react";
import {useGate, useStore} from "effector-react";
import {$exchangeRecyclablesByCategory, gate, IExchangeRecyclable} from "@box/entities/exchangeRecyclable/model";
import classNames from "classnames";
import s from "@box/widgets/recyclable/exchangeSquareRecyclablesList/ui/styles.module.scss";
import {urgencyTypeSelectValues} from "@box/entities/application";
import {AsyncSelect, Loader, TabSelect} from "@box/shared/ui";
import {useForm} from "@box/shared/effector-forms";
import {exchangeRecyclablesListFiltersModel} from "@box/features/recyclable";
import {ExchangeSquareRow} from "@box/entities/recyclable";
import {districtSelectApi} from "@box/entities/district";
import {ICategoriesWithStatistics} from "@box/entities/recyclable/model";
import {regionSelectApi} from "@box/entities/region";


export const RecyclablesSquareList: React.FC<{
    category: ICategoriesWithStatistics//ICategoryForExchangeRow
}> = ({
          category,

      }) => {
    const recyclables = useStore($exchangeRecyclablesByCategory);
    const {fields} = useForm(exchangeRecyclablesListFiltersModel.filters);
    const [urgencyType, setUrgencyType] = useState<number>(2);
    const [district, setDistrict] = useState<string | null>(null);
    const [region, setRegion] = useState<string | null>(null);
    const [regionId, setRegionId] = useState<number>(0);
    const [distinctId, setDistinctId] = useState<number>(0);

    const urgencyTypeHandler = (urgencyTypeId: number) => {
        setUrgencyType(urgencyTypeId);
    };

    const districtHandler = (dist: string | null) => {
        setDistrict(dist);
    };

    const districtIdHandler = (id: number) => {
        setDistinctId(id);
    };

    const regionHandler = (reg: string | null) => {
        setRegion(reg);
    };

    const regionIdHandler = (id: number) => {
        setRegionId(id);
    };

    const countCategoryVolumeByDistrict = () => {
        // const purchaseRegionList = regionId > 0 ? category.purchaseContractsVolumeList
        //     .filter(item => item.region === regionId).length : 0
        // const saleRegionList = regionId > 0 ? category.salesContractsVolumeList
        //     .filter(item => item.region === regionId).length : 0
        const purchaseRegion = regionId > 0 ? category.purchaseContractsVolumeList
                .filter(item => item.region === regionId)
                .map(item => item.volume)
                .reduce((a, b) => a + b) :
            category.purchaseTotalVolume
        const saleRegion = regionId > 0 ? category.salesContractsVolumeList
                .filter(item => item.region === regionId)
                .map(item => item.volume)
                .reduce((a, b) => a + b) :
            category.salesTotalVolume
        const purchaseDistrict = distinctId > 0 ? category.purchaseContractsVolumeList
                .filter(item => item.district === distinctId)
                .map(item => item.volume)
                .reduce((a, b) => a + b) :
            category.purchaseTotalVolume
        const saleDistrict = distinctId > 0 ? category.salesContractsVolumeList
                .filter(item => item.district === distinctId)
                .map(item => item.volume)
                .reduce((a, b) => a + b) :
            category.salesTotalVolume
        return {purchaseDistrict, saleDistrict, purchaseRegion, saleRegion}
    }

    const sortedCategoriesList = (urgencyType: number) => {
        return urgencyType === 1 ? recyclables
                .sort((a, b) => b.purchaseReadyForShipmentTotalVolume - a.purchaseReadyForShipmentTotalVolume) :
            recyclables
                .sort((a, b) => b.purchaseSupplyContractTotalVolume - a.purchaseSupplyContractTotalVolume)
    };

    const recyclableNumber = (recyclable: IExchangeRecyclable/*, urgencyType: number*/) => {
        const percentage = (recyclable.purchaseSupplyContractTotalVolume - recyclable.salesSupplyContractTotalVolume) /
            recyclable.purchaseSupplyContractTotalVolume * 100;
        if (percentage > 0) {
            return +(percentage).toFixed(0)
        }
        if (percentage < 0) {
            return +(percentage).toFixed(0)
        }
        return 0
    };

    useGate(gate);

    useEffect(() => {
    }, [recyclables, category, urgencyType, distinctId, district, region, regionId]);

    if (recyclables.length === 0) {
        return (
            <div>
                <Loader center className="my-[100px]"/>
            </div>
        )
    }
    return (
        <div>
            <div className="inline-flex mt-5">
                <div className="bg-[#439E7E] p-3 rounded-[10px]">
                    <h3 className="font-bold text-white">{category.name}</h3>
                </div>
                <div className="bg-[#439E7E] p-3 ml-96 shrink-0 inline-flex rounded-[10px]">
                    <h3 className="text-white"/*"ml-14 text-[#EC5D5D]"*/>{`Продажа - ${regionId === 0 ? countCategoryVolumeByDistrict().saleDistrict :
                        countCategoryVolumeByDistrict().saleRegion} т`}</h3>
                    <h3 className="ml-7 text-white"/*className="ml-7 text-[#89DB89]*/>{`Покупка - ${regionId === 0 ? countCategoryVolumeByDistrict().purchaseDistrict :
                        countCategoryVolumeByDistrict().purchaseRegion} т`}</h3>
                </div>
            </div>
            <div className="inline-flex">
                <TabSelect
                    className="mt-9"
                    onChange={(e) => {
                        fields.urgency_type.onChange(e)
                        urgencyTypeHandler(e.value)
                    }}
                    values={urgencyTypeSelectValues}
                    value={fields.urgency_type.value}
                />
                <AsyncSelect
                    withClearButton
                    onSelect={(e) => {
                        fields.region.onChange(e)
                        fields.district.onChange(null)
                        districtHandler(null);
                        districtIdHandler(0);
                        if (e) {
                            regionHandler(e?.label);
                            regionIdHandler(+e.id);
                        }
                        if (e === null) {
                            regionHandler(null);
                            regionIdHandler(0);
                        }
                    }}
                    inputProps={{mode: 'stroke'}}
                    value={fields.region.value}
                    loadData={regionSelectApi}
                    className='w-[370px] shrink-0 ml-6 mt-6'
                    placeholder="Регион"
                />
                <AsyncSelect
                    withClearButton
                    onSelect={(e) => {
                        fields.district.onChange(e)
                        fields.region.onChange(null)
                        regionHandler(null);
                        regionIdHandler(0);
                        if (e) {
                            districtHandler(e?.label);
                            districtIdHandler(+e.id);
                        }
                        if (e === null) {
                            districtHandler(null);
                            districtIdHandler(0);
                        }
                    }}
                    inputProps={{mode: 'stroke'}}
                    value={fields.district.value}
                    loadData={districtSelectApi}
                    className='w-[370px] shrink-0 ml-6 mt-6'
                    placeholder="Федеральный округ"
                />
            </div>
            {regionId === 0 && distinctId > 0 && <h3 className="font-bold ml-3 mt-5">{district}</h3>}
            {distinctId === 0 && regionId > 0 && <h3 className="font-bold ml-3 mt-5">{region}</h3>}
            <div className="mt-10">
                <div className="inline-flex">
                    {recyclables.length >= 4 && sortedCategoriesList(urgencyType).slice(0, 4).map(recyclable => (
                        <div
                            key={category.id}
                            className={recyclableNumber(recyclable) < 0 &&
                            recyclableNumber(recyclable) > -10 ?
                                classNames(s.category_block_1, "bg-[#FF8B8B]") :
                                recyclableNumber(recyclable) < -10 ?
                                    classNames(s.category_block_1, "bg-[#EC5D5D]") :
                                    recyclableNumber(recyclable) >= 0 &&
                                    recyclableNumber(recyclable) < 10 ?
                                        classNames(s.category_block_1, "bg-[#5EDBB1]"/*"bg-[#CDFFBD]"*/) :
                                        classNames(s.category_block_1, "bg-[#439E7E]"/*"bg-[#89DB89]"*/)}>
                            <ExchangeSquareRow recyclable={recyclable} urgencyType={urgencyType} currentBlock={1}/>
                        </div>
                    ))}
                </div>
                <div className="inline-flex mt-1">
                    {recyclables.length >= 8 && sortedCategoriesList(urgencyType).slice(4, 9).map(recyclable => (
                        <div
                            key={category.id}
                            className={recyclableNumber(recyclable) < 0 &&
                            recyclableNumber(recyclable) > -10 ?
                                classNames(s.category_block_2, "bg-[#FF8B8B]") :
                                recyclableNumber(recyclable) < -10 ?
                                    classNames(s.category_block_2, "bg-[#EC5D5D]") :
                                    recyclableNumber(recyclable) >= 0 &&
                                    recyclableNumber(recyclable) < 10 ?
                                        classNames(s.category_block_2, "bg-[#5EDBB1]"/*"bg-[#CDFFBD]"*/) :
                                        classNames(s.category_block_2, "bg-[#439E7E]"/*"bg-[#89DB89]"*/)}>
                            <ExchangeSquareRow recyclable={recyclable} urgencyType={urgencyType} currentBlock={2}/>
                        </div>
                    ))}
                </div>
                <div className="inline-flex mt-1">
                    {recyclables.length >= 14 && sortedCategoriesList(urgencyType).slice(9, 15).map(recyclable => (
                        <div
                            key={category.id}
                            className={recyclableNumber(recyclable) < 0 &&
                            recyclableNumber(recyclable) > -10 ?
                                classNames(s.category_block_3, "bg-[#FF8B8B]") :
                                recyclableNumber(recyclable) < -10 ?
                                    classNames(s.category_block_3, "bg-[#EC5D5D]") :
                                    recyclableNumber(recyclable) >= 0 &&
                                    recyclableNumber(recyclable) < 10 ?
                                        classNames(s.category_block_3, "bg-[#5EDBB1]"/*"bg-[#CDFFBD]"*/) :
                                        classNames(s.category_block_3, "bg-[#439E7E]"/*"bg-[#89DB89]"*/)}>
                            <ExchangeSquareRow recyclable={recyclable} urgencyType={urgencyType} currentBlock={3}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}