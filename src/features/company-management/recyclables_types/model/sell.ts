import { createRecyclablesFormStateManagement } from '../lib/createForm';

const sellFormStateManagement = createRecyclablesFormStateManagement(2, 'COMPANY_RECYCLABLES_TYPES_FORM_SELL');

export {
  sellFormStateManagement,
};
