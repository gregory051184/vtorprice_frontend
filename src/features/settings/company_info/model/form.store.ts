import {combine, sample, createEffect, createStore} from 'effector';
import {AxiosError} from 'axios';
import {
    validationPipe,
    isNotEmptyString,
    isNotEmptyNumber,
    isNotNull, correctEmail, telephoneNumber
} from '@box/shared/effector-form-controller/validator';
import {createLoaderStore} from '@box/shared/lib/helpers';
import {$authStore, $usersCompany, getMeFx} from '@box/entities/auth';
import {createField, createForm} from '@box/shared/effector-form-controller';
import {companyApi} from '@box/entities/company';
import {ICity} from '@box/entities/city/model';
import {ISelectValue} from '@box/shared/ui';

const withNdsField = createField<boolean>({
    initialValue: false,
});

withNdsField.$value.on($usersCompany, (store, val) => val?.withNds || store);

const avatarField = createField<File | null | string>({
    initialValue: null,
});

avatarField.$value.on($usersCompany, (_, val) => val?.image || null);

const nameField = createField<string>({
    initialValue: '',
    validateFn: (val) => validationPipe(val, isNotEmptyString()),
});

nameField.$value.on($usersCompany, (store, val) => val?.name || store);

const innField = createField<string>({
    initialValue: '',
    validateFn: (val) => validationPipe(val, isNotEmptyString()),
});

innField.$value.on($usersCompany, (store, val) => val?.inn || store);

const addressField = createField<string>({
    initialValue: '',
    validateFn: (val) => validationPipe(val, isNotEmptyString()),
});

addressField.$value.on($usersCompany, (store, val) => val?.address || store);

const latitudeField = createField<number>({
    initialValue: 0,
    validateFn: (val) => validationPipe(val, isNotEmptyNumber()),
});

latitudeField.$value.on($usersCompany, (store, val) => val?.latitude || store);

const longitudeField = createField<number>({
    initialValue: 0,
    validateFn: (val) => validationPipe(val, isNotEmptyNumber()),
});

longitudeField.$value.on($usersCompany, (store, val) => val?.longitude || store);

const descriptionField = createField<string>({
    initialValue: ''
});

descriptionField.$value.on($usersCompany, (store, val) => val?.description || store);

const bicField = createField<string>({
    initialValue: ''
});

bicField.$value.on($usersCompany, (store, val) => val?.bic || store);

const paymentAccountField = createField<string>({
    initialValue: ''
});

paymentAccountField.$value.on($usersCompany, (store, val) => val?.paymentAccount || store);

const correctionAccountField = createField<string>({
    initialValue: ''
});

correctionAccountField.$value.on($usersCompany, (store, val) => val?.correctionAccount || store);

const bankNameField = createField<string>({
    initialValue: ''
});

bankNameField.$value.on($usersCompany, (store, val) => val?.bankName || store);

const headFullNameField = createField<string>({
    initialValue: ''
});

headFullNameField.$value.on($usersCompany, (store, val) => val?.headFullName || store);

const phoneField = createField<string>({
    initialValue: '',
    validateFn: (val) => validationPipe(val, isNotEmptyString(), telephoneNumber()),
});

phoneField.$value.on($usersCompany, (store, val) => val?.phone || store);

const emailUserField = createField<string>({
    initialValue: '',
    validateFn: (val) => validationPipe(val, correctEmail()),
});

emailUserField.$value.on($usersCompany, (store, val) => val?.email || store);

const cityField = createField<ISelectValue<ICity> | null>({
    initialValue: null,
    validateFn: (val) => validationPipe(val, isNotNull()),
});

cityField.$value.on($usersCompany, (store, val) => {
    const selectValue: ISelectValue = {
        id: val?.city.id || 0,
        label: val?.city.name || "",
        value: val?.city || null
    }
    return selectValue
});

const companyInfoForm = createForm(
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
    emailUserField,
);

const loading = createLoaderStore(false, getMeFx);


const updateCompanyInfoFx = createEffect<{
    id: number,
    name: string,
    inn: string,
    image: File | string | null,
    address: string,
    description: string,
    withNds: boolean,
    bic: string,
    payment_account: string,
    correction_account: string,
    bank_name: string,
    head_full_name: string,
    phone: string,
    city: number | string,
    email: string,
}, unknown, AxiosError>({
    handler: async (fields) => {
        companyApi.setCompany(fields)
    },
});

const $nullStore = createStore(null)

sample({
    //payment_account: paymentAccountField.$value.getState() === "" ?  $nullStore : paymentAccountField.$value,
    // @ts-ignore

    clock: companyInfoForm.formValid,
    source: combine({
        id: $authStore.map((val) => val.user?.company?.id || 0),
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
        email: emailUserField.$value
    }),
    target: updateCompanyInfoFx,
});


export {
    companyInfoForm,
    nameField,
    withNdsField,
    innField,
    addressField,
    descriptionField,
    loading,
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
    emailUserField,
};
