import {Button, Container} from '@box/shared/ui';
import {IWithChildren} from '@box/types';
import React, {useState} from 'react';
import classNames from 'classnames';
import {useBoolean, useScreenSize} from '@box/shared/hooks';
import s from './style.module.scss';
import {ApplicationsSideBarFilters} from "@box/widgets/mainFiltersSideBar";


export const ApplicationsFiltersLayout: React.FC<IWithChildren> = ({
                                                                       children,
                                                                   }) => {
    const {value, toggle} = useBoolean(false);
    const showDropdown = typeof window !== 'undefined' ? window.innerWidth < 1023 : false;
    const [filters, setFilters] = useState<boolean>(false);

    const [screenSize, satisfies] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    if (isLaptop || isMobile) {
        return (
            <Container>
                <Button
                    fullWidth={true}
                    mode="light"
                    onClick={() => setFilters(!filters)}>
                    {!filters ? "Открыть фильтры" : "Скрыть фильтры"}
                </Button>
                <div>
                    {filters && <div className={s.sidebar}>
                        <ApplicationsSideBarFilters/>
                    </div>}
                    <div className="grow overflow-hidden">
                        {children}
                    </div>
                </div>
            </Container>
        );
    } else {
        return (
            <Container>
                <div className={classNames('pt-8 flex gap-16 mt-[-30px]', s.layout)}>
                    <div className={s.sidebar}>
                        <ApplicationsSideBarFilters
                            className={classNames('sticky top-[112px] left-0', s.sidebar_inner)}/>
                    </div>
                    <div className="grow overflow-hidden">
                        {children}
                    </div>
                </div>
            </Container>
        );
    }
};
