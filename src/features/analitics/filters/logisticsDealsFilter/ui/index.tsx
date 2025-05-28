import { useForm } from "@box/shared/effector-forms";
import { IWithClass } from "@box/types";
import { filters } from '../model';
import { TimeframeTypes } from "@box/entities/application";
import { AsyncSelect, TabSelect } from "@box/shared/ui";
import { citySelectApi } from "@box/entities/city";
import s from './style.module.scss';
import classNames from "classnames";
import { regionSelectApi } from "@box/entities/region";

  export const LogisticsDealsFilters: React.FC<IWithClass> = ({
    className
  }) => {
    const { fields } = useForm(filters);


    return (
        <div className={classNames("flex items-end mt-[30px] justify-between ", s.adaptive, className)}>
          <div className={classNames("flex jusify-start w-1/2 gap-[10px]", s.tab)}>

              <TabSelect 
              onChange={fields.period.onChange}
              values={TimeframeTypes}
              value={fields.period.value}
              />

          </div>
          <div className={classNames("flex jusify-end w-1/2", s.tab)}>
            <div className={classNames("flex gap-[10px]", s.tabholder)}>
              <AsyncSelect
              placeholder="Регион"
              inputProps={{ mode: 'stroke' }}
              withClearButton
              onSelect={fields.region.onChange}
              value={fields.region.value}
              loadData={regionSelectApi}/>
              <AsyncSelect
              placeholder="Город"
              inputProps={{ mode: 'stroke' }}
              withClearButton
              onSelect={fields.city.onChange}
              value={fields.city.value}
              loadData={citySelectApi}
              />
            </div>
          </div>
        </div>
      
    );
  };
  
