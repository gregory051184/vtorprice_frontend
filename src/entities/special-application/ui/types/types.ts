import {ISpecialApplication} from "@box/entities/special-application";

export type SpecialApplicationsListType = {
    specApp:  ISpecialApplication;
    specialApplications: ISpecialApplication[];
}

export type SpecialApplicationType = {
    application: ISpecialApplication;
}