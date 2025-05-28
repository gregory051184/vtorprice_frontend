import { applicationTypes, urgencyTypeSelectValues } from '@box/entities/application';
import { ICity } from '@box/entities/city/model';
import { ICompanyRecyclable } from '@box/entities/company/model';
import { createForm } from '@box/shared/effector-forms';
import { ISelectValue, ITabSelectValue } from '@box/shared/ui';
import { createEvent, createStore } from 'effector';
import {IRegion} from "@box/entities/region/model";
import {IDistrict} from "@box/entities/district";

const filters = createForm({
  fields: {
    equipment__category: {
      init: null as ISelectValue | null
    },
    urgency_type: {
      init: urgencyTypeSelectValues[0] as ITabSelectValue | null
    },
    deal_status: {
      init: null as ISelectValue | null
    },
    count: {
      init: ''
    },
    weight: {
      init: ''
    },
    deal_type: {
      init: null as ISelectValue | null
    },
    recyclables__category: {
      init: null as ISelectValue<ICompanyRecyclable['recyclables']> | null
    },
    city: {
      init: null as ISelectValue<ICity> | null
    },
    region: {
      init: null as ISelectValue<IRegion> | null
    },
    district: {
      init: null as ISelectValue<IDistrict> | null
    }
  }
});

const changeApplicationType = createEvent<ISelectValue<number>>();

const applicationType = createStore<ISelectValue<number>>(applicationTypes[1])
  .on(changeApplicationType, (_, data) => data);

const applyMapApplicationFilters = createEvent<number>();
const resetMapApplicationFilters = createEvent<number>();

export {
  filters,
  applicationType,
  changeApplicationType,
  applyMapApplicationFilters,
  resetMapApplicationFilters
};
