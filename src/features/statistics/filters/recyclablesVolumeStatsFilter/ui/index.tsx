import { useForm } from "@box/shared/effector-forms";
import { IWithClass } from "@box/types";
import { filters } from '../model';
import { TimeframeTypes, dealTypeSelectValues, urgencyTypeSelectValues } from "@box/entities/application";
import { AsyncSelect, Select, TabSelect } from "@box/shared/ui";
import { recyclablesCategoriesSelectApi } from "@box/entities/company";
import { citySelectApi } from "@box/entities/city";
import s from './style.module.scss';
import classNames from "classnames";

  export const RecyclablesVolumeStatsFilters: React.FC<IWithClass> = ({
    className
  }) => {
    const { fields } = useForm(filters);

    return (
        <div className={classNames("flex items-end mt-[16px] justify-between ", s.adaptive, className)}>
          <div className={classNames("flex w-1/3 gap-[10px]", s.tab)}>

              <TabSelect 
              onChange={fields.period.onChange}
              values={TimeframeTypes}
              value={fields.period.value}
              />

          </div>
          <div className={classNames("flex w-2/3 gap-[10px]", s.tab)}>
            <div className={classNames("flex gap-[10px]", s.tabholder)} >
              <Select
              placeholder="Тип"
              inputProps={{ mode: 'stroke' }}
              withClearButton
              onSelect={fields.deal_type.onChange}
              value={fields.deal_type.value}
              data={dealTypeSelectValues}
              />
              <Select
              placeholder="Срочность"
              inputProps={{ mode: 'stroke' }}
              withClearButton
              onSelect={fields.urgency_type.onChange}
              value={fields.urgency_type.value}
              data={urgencyTypeSelectValues}
              />
            </div>

            <div className={classNames("flex gap-[10px]", s.tabholder)}>
              <AsyncSelect
              placeholder="Город"
              inputProps={{ mode: 'stroke' }}
              withClearButton
              onSelect={fields.city.onChange}
              value={fields.city.value}
              loadData={citySelectApi}
              />
              <AsyncSelect
              placeholder="Категория"
              inputProps={{ mode: 'stroke' }}
              onSelect={fields.category.onChange}
              value={fields.category.value}
              loadData={recyclablesCategoriesSelectApi}
              withClearButton
              />
            </div>
          </div>
        </div>
      
    );
  };
  
