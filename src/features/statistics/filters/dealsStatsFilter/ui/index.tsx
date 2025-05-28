import { useForm } from "@box/shared/effector-forms";
import { IWithClass } from "@box/types";
import { filters } from '../model';
import { TimeframeTypes } from "@box/entities/application";
import { AsyncSelect, TabSelect } from "@box/shared/ui";
import { recyclablesSelectApi } from "@box/entities/company";
import s from './style.module.scss';
import classNames from "classnames";

  export const DealsStatsFilters: React.FC<IWithClass> = ({
    className
  }) => {
    const { fields } = useForm(filters);


    return (
        <div className={classNames("flex items-end mt-[16px] justify-between ", s.adaptive, className)}>
          <div className={classNames("flex w-1/2 gap-[10px]", s.tab)}>

              <TabSelect 
              onChange={fields.period.onChange}
              values={TimeframeTypes}
              value={fields.period.value}
              />

          </div>
          <div className={classNames("flex gap-[10px]", s.tab)}>
              <AsyncSelect
              className={s.adaptive_category}
              placeholder="Вторсырье"
              inputProps={{ mode: 'stroke' }}
              withClearButton
              onSelect={fields.application__recyclables.onChange}
              value={fields.application__recyclables.value}
              loadData={recyclablesSelectApi} />
          </div>
        </div>
      
    );
  };