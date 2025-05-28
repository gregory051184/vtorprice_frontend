import { createCompanyActivitiesFormState } from '@box/features/settings/company_activity_types/lib';

const customerFormState = createCompanyActivitiesFormState(3, 'COMPANY_TYPE_CUSTOMER_FORM');

export {
  customerFormState,
};
