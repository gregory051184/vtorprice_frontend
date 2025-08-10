import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper";
import s from "@box/pages/recyclables/ui/style.module.scss";
import classNames from "classnames";
import React, {useState} from "react";
import {
    ICompaniesRecyclableStatisticsSwiper
} from "@box/widgets/companies/companiesRecyclableStatisticsSwiper/ui/types";
import {ICompanyShortForAll} from "@box/entities/company/model";
import {
    RecyclableApplicationsForStatistics
} from "@box/widgets/statistics/statisticsBasedOnRecyclableApplications/recyclableFractionsForStatistics";

export const CompaniesRecyclableStatisticsSwiper: React.FC<ICompaniesRecyclableStatisticsSwiper> = ({
                                                                                                        recyclableCategories,
                                                                                                        currentCategory,
                                                                                                        currentCompaniesCategory,
                                                                                                        applications
                                                                                                    }) => {
    const [category, setCategory] = useState<number>(0);
    const [companyCategory, setCompanyCategory] = useState<number>(0);


    const uniqCompanies = (categoryId: number) => {
        const uniqCompaniesList = applications
            .filter(app => app.recyclables.category?.id === categoryId)
            .map(app => app.company)
        const list: ICompanyShortForAll[] = []
        for (let i = 0; i < uniqCompaniesList.length; i++) {
            if (!list.map(company => company.id).includes(uniqCompaniesList[i].id)) {
                list.push(uniqCompaniesList[i])
            }
        }
        return list;
    }

    const applicationsCount = (categoryId: number) => {
        return applications.filter(app => app.recyclables.category?.id === categoryId).length;
    }

    const currentCategoryOnchangeHandler = (categoryId: number) => {
        setCategory(categoryId)
        return currentCategory(categoryId)
    }

    const currentCompaniesCategoryOnchangeHandler = (categoryId: number) => {
        return currentCompaniesCategory(categoryId)
    }
    return (
        <div className="mt-6">
            <Swiper
                slidesPerView={1}
                spaceBetween={15}
                pagination={{
                    el: ".swiper-pagination",
                    type: "bullets"
                }}
                modules={[Pagination]}
            >
                {recyclableCategories().map(recyclableCategory =>
                    <SwiperSlide
                        key={recyclableCategory.recyclableCategory?.id}
                        onClick={() => {
                        }}
                        className={s.category_main_page_slider}>
                        <div>
                            <div
                                onClick={() => {
                                    currentCategoryOnchangeHandler(recyclableCategory.recyclableCategory.id )
                                    currentCompaniesCategoryOnchangeHandler(0)
                                }}
                                className={classNames(s.category_title_statistics, recyclableCategory?.recyclableCategory?.id === category ?
                                    "bg-black text-white p-2 rounded-[10px]" : "")}>
                                {recyclableCategory?.recyclableCategory?.name}
                            </div>
                            <div
                                onClick={() => {
                                    currentCompaniesCategoryOnchangeHandler(recyclableCategory.recyclableCategory.id)
                                    currentCategoryOnchangeHandler(0)
                                }}
                                className={classNames(s.category_title_statistics, recyclableCategory?.recyclableCategory?.id === companyCategory ?
                                    "bg-black text-white p-2 rounded-[10px] w-full" : "w-full")}>
                                {`Компаний - ${uniqCompanies}`}
                            </div>
                            <div className="inline-flex w-full">
                                <div className="text-lg mt-2 w-28">
                                    <p>Покупка</p>
                                    <p>{`${recyclableCategory?.totalVolume.buyVolume} т`}</p>
                                </div>
                                <div className="text-lg mt-2 w-28">
                                    <p>Продажа</p>
                                    <p>{`${recyclableCategory?.totalVolume.sellVolume} т`}</p>
                                </div>
                                <div className="text-lg mt-2 w-28">
                                    <p>Общий</p>
                                    <p>{`${recyclableCategory?.totalVolume.totalVolume} т`}</p>
                                </div>
                            </div>
                            <div className="text-lg mt-2 w-full">
                                {`Контрактов на поставку - ${applicationsCount}`}
                            </div>
                        </div>
                    </SwiperSlide>
                )}
            </Swiper>
            <div className='swiper-pagination flex mt-[22px] justify-center gap-[15px]'></div>
        </div>
    )
}