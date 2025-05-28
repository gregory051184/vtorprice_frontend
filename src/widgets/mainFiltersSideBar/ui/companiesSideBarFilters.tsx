import React from "react";
import {IWithClass} from "@types";

import {MainMenuCompaniesListFilters} from "@box/features/company/filters/mainMenuCompaniesFilters";

export const CompaniesSideBarFilters: React.FC<IWithClass> = ({
                                                                  className
                                                              }) => {
    return (
        <>
            <MainMenuCompaniesListFilters></MainMenuCompaniesListFilters>
        </>
    );
};