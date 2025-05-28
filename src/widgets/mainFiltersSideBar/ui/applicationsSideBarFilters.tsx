import {IWithClass} from '@box/types';
import React from 'react';
import {MainMenuApplicationsListFilters} from "@box/features/application/filters/mainMenuApplicationsFilters";




export const ApplicationsSideBarFilters: React.FC<IWithClass> = ({
                                                             className,
                                                         }) => {
    return (
        <>
            <MainMenuApplicationsListFilters></MainMenuApplicationsListFilters>
        </>
    );
};
