import React, {useEffect, useState} from "react";
import {useScreenSize} from "@box/shared/hooks";
import {BackButton, Container, ITabSelectValue, TabSelect} from "@box/shared/ui";
import {ExchangeFractionFilters} from "@box/features/application/filters/stockGlass/ui";
import {useRouter} from "next/router";
import {IWithChildren} from "@types";
import classNames from "classnames";
import s from "@box/layouts/filters_layout/ui/style.module.scss";
import {dealTypeSelectValues} from "@box/entities/application";


export const ExchangeFiltersLayout: React.FC<IWithChildren & { active: (num: number) => number }> = ({
                                                                                                         children,
                                                                                                         active
                                                                                                     }) => {
    const [filters, setFilters] = useState<boolean>(false);
    const [dealTypes, setDealTypes] = useState<ITabSelectValue<number>>(dealTypeSelectValues[0]);
    const [screenSize, satisfies] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';
    const router = useRouter();
    const urgencyType = router.query.type;


    const activeHandler = (num: ITabSelectValue<number>) => {
        active(num.value);
        setDealTypes(num)
    }
    useEffect(() => {
    }, [active, dealTypes]);
    return (
        <Container>
            <BackButton/>
            <div className={classNames('pt-8 flex gap-16 mt-[-30px]', s.layout)}>

                <div className={classNames("fixed", s.sidebar)}>
                    <TabSelect
                        className="mt-5"
                        onChange={activeHandler}
                        values={dealTypeSelectValues}
                        value={dealTypes}
                    />
                    <div className="mt-8">
                        <ExchangeFractionFilters
                            className={classNames('sticky top-[112px] left-0', s.sidebar_inner)}
                            urgencyType={urgencyType as any}/>
                    </div>
                </div>
                <div className="grow overflow-hidden ml-[280px]">
                    {children}
                </div>
            </div>
        </Container>
    )
}