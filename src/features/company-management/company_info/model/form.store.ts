import {combine, sample, createEffect, createEvent, createStore} from 'effector';
import {AxiosError} from 'axios';
import {
    validationPipe,
    isNotEmptyString,
    isNotEmptyNumber,
    isNotNull
} from '@box/shared/effector-form-controller/validator';
import {createField, createForm} from '@box/shared/effector-form-controller';
import {companyApi} from '@box/entities/company';
import {$company} from '@box/pages/companies/company/model/company.store';
import {ISelectValue} from '@box/shared/ui';
import {ICity} from '@box/entities/city/model';
import { notificationModel } from '@box/entities/notification';
import {ICompany} from "@box/entities/company/model";
import {IAuthUser} from "@box/entities/auth";
import {IUser} from "@box/entities/user";

const onLoadPageEvent = createEvent();

const withNdsField = createField<boolean>({
    initialValue: false,
});

sample({
    source: $company,
    clock: onLoadPageEvent,
    fn: (company) => company?.withNds || false,
    target: withNdsField.$value,
});


const avatarField = createField<File | null | string>({
    initialValue: null,
});

sample({
    source: $company,
    clock: onLoadPageEvent,
    fn: (company) => {
        return (company?.image || null)
    },
    target: avatarField.$value,
});

const nameField = createField<string>({
    initialValue: '',
    validateFn: (val) => validationPipe(val, isNotEmptyString()),
});

sample({
    source: $company,
    clock: onLoadPageEvent,
    fn: (company) => company?.name || "",
    target: nameField.$value,
});

const innField = createField<string>({
    initialValue: '',
    validateFn: (val) => validationPipe(val, isNotEmptyString()),
});

sample({
    source: $company,
    clock: onLoadPageEvent,
    fn: (company) => company?.inn || "",
    target: innField.$value,
});

const addressField = createField<string>({
    initialValue: '',
    validateFn: (val) => validationPipe(val, isNotEmptyString()),
});

sample({
    source: $company,
    clock: onLoadPageEvent,
    fn: (company) => company?.address || "",
    target: addressField.$value,
});

const latitudeField = createField<number>({
    initialValue: 0,
    validateFn: (val) => validationPipe(val, isNotEmptyNumber()),
});

sample({
    source: $company,
    clock: onLoadPageEvent,
    fn: (company) => company?.latitude || 0,
    target: latitudeField.$value,
});

const longitudeField = createField<number>({
    initialValue: 0,
    validateFn: (val) => validationPipe(val, isNotEmptyNumber()),
});

sample({
    source: $company,
    clock: onLoadPageEvent,
    fn: (company) => company?.longitude || 0,
    target: longitudeField.$value,
});

const descriptionField = createField<string>({
    initialValue: ''
});

sample({
    source: $company,
    clock: onLoadPageEvent,
    fn: (company) => company?.description || "",
    target: descriptionField.$value,
});

const bicField = createField<string>({
    initialValue: ''
});

sample({
    source: $company,
    clock: onLoadPageEvent,
    fn: (company) => company?.bic || "",
    target: bicField.$value,
});

const paymentAccountField = createField<string>({
    initialValue: ''
});

sample({
    source: $company,
    clock: onLoadPageEvent,
    fn: (company) => company?.paymentAccount || "",
    target: paymentAccountField.$value,
});

const correctionAccountField = createField<string>({
    initialValue: ''
});

sample({
    source: $company,
    clock: onLoadPageEvent,
    fn: (company) => company?.correctionAccount || "",
    target: correctionAccountField.$value,
});

const bankNameField = createField<string>({
    initialValue: ''
});

sample({
    source: $company,
    clock: onLoadPageEvent,
    fn: (company) => company?.bankName || "",
    target: bankNameField.$value,
});

const headFullNameField = createField<string>({
    initialValue: ''
});

sample({
    source: $company,
    clock: onLoadPageEvent,
    fn: (company) => company?.headFullName || "",
    target: headFullNameField.$value,
});

const phoneField = createField<string>({
    initialValue: '',
    validateFn: (val) => validationPipe(val, isNotEmptyString()),
});

sample({
    source: $company,
    clock: onLoadPageEvent,
    fn: (company) => company?.phone || "",
    target: phoneField.$value,
});

const cityField = createField<ISelectValue<ICity> | null>({
    initialValue: null,
    validateFn: (val) => validationPipe(val, isNotNull()),
});

sample({
    source: $company,
    clock: onLoadPageEvent,
    fn: (company) => {
        const selectValue: ISelectValue = {
            id: company?.city.id || 0,
            label: company?.city.name || "",
            value: company?.city || null
        }
        return selectValue
    },
    target: cityField.$value,
});

const managerField = createField<ISelectValue<IUser> | null>({
    initialValue: null,
    //validateFn: (val) => validationPipe(val, isNotNull()),
})

sample({
    source: $company,
    clock: onLoadPageEvent,
    fn: (company) => {
        const selectValue: ISelectValue = {
            //@ts-ignore
            id: company?.manager?.id || 0,
            label: `${company?.manager?.lastName} ${company?.manager?.firstName} ${company?.manager?.middleName}` || "",
            value: company?.manager || null
        }
        return selectValue
    },
    target: managerField.$value,
});

const companyInfoFormManagement = createForm(
    nameField,
    innField,
    addressField,
    descriptionField,
    latitudeField,
    longitudeField,
    bicField,
    paymentAccountField,
    correctionAccountField,
    bankNameField,
    headFullNameField,
    phoneField,
    cityField,
    managerField
);

const updateCompanyInfoFx = createEffect<{
    id: number,
    name: string,
    inn: string,
    image: File | string | null,
    address: string,
    description: string,
    withNds: boolean,
    bic: string,
    payment_account: string | null,
    correction_account: string,
    bank_name: string,
    head_full_name: string,
    phone: string,
    city: number | string,
    manager: string,
}, unknown, AxiosError>({
    handler: async (fields) => {
        companyApi.setCompany(fields)
    }
});

const $nullStore = createStore(null)


const patchCompanyStaffFX = createEffect<
    {
        id: number,
        staff?: Array<number>,
        suspend_staff?: Array<number>
    },
    unknown, AxiosError>({
    handler: async (fields) => {
          companyApi.patchCompany(fields)
    }
})

sample({
    // @ts-ignore
    clock: companyInfoFormManagement.formValid,
    source: combine({
        id: $company.map((val) => val?.id || 0),
        image: avatarField.$value,
        name: nameField.$value,
        inn: innField.$value,
        address: addressField.$value,
        latitude: latitudeField.$value,
        longitude: longitudeField.$value,
        description: descriptionField.$value,
        withNds: withNdsField.$value,
        bic: bicField.$value,
        payment_account: paymentAccountField.$value,
        correction_account: correctionAccountField.$value,
        bank_name: bankNameField.$value,
        head_full_name: headFullNameField.$value,
        phone: phoneField.$value,
        city: cityField.$value.map((val) => val?.id || 0),
        manager: managerField.$value.map((val) => val?.id || 0),
    }),
    target: updateCompanyInfoFx,
});

export {
    companyInfoFormManagement,
    nameField,
    withNdsField,
    innField,
    addressField,
    descriptionField,
    onLoadPageEvent,
    avatarField,
    longitudeField,
    latitudeField,
    bicField,
    paymentAccountField,
    correctionAccountField,
    bankNameField,
    headFullNameField,
    phoneField,
    cityField,
    managerField,
    patchCompanyStaffFX
};
