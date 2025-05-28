import React from "react";
import {IWithChildren} from "@types";
import {useBoolean} from "@box/shared/hooks";
import {Container} from "@box/shared/ui";
import classNames from "classnames";
import s from "@box/layouts/filters_layout/ui/style.module.scss";
import {CompaniesSideBarFilters} from "@box/widgets/mainFiltersSideBar/ui/companiesSideBarFilters";

export const CompaniesFiltersLayout: React.FC<IWithChildren> = ({
                                                                    children,
                                                                }) => {
    const {value, toggle} = useBoolean(false);
    const showDropdown = typeof window !== 'undefined' ? window.innerWidth < 1023 : false;

    return (
        <Container>
            <div className={classNames('pt-8 flex gap-16 mt-[-30px]', s.layout)}>
                <div className={s.sidebar}>
                    <CompaniesSideBarFilters className={classNames('sticky top-[112px] left-0', s.sidebar_inner)}/>
                </div>
                <div className="grow overflow-hidden">
                    {children}
                </div>
            </div>
        </Container>
    );
};