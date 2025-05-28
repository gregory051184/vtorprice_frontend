import { useForm } from "@box/shared/effector-forms";
import { IWithClass } from "@box/types";
import {generateListOfOffersfilters} from '../model';
import { TimeframeTypes } from "@box/entities/application";
import { AsyncSelect, TabSelect } from "@box/shared/ui";
import { recyclablesCategoriesSelectApi } from "@box/entities/company";
import s from './style.module.scss';
import classNames from "classnames";

  export const RecyclableForGenerateListOfOffersFilters: React.FC<IWithClass> = ({
    className
  }) => {
    const { fields } = useForm(generateListOfOffersfilters);

    return (
        <div className={classNames("flex items-end mt-[16px] justify-between ", s.adaptive, className)}>
          <div className={classNames("flex w-1/2 gap-[10px]", s.tab)}>

              <TabSelect 
              onChange={fields.period.onChange}
              values={TimeframeTypes}
              value={fields.period.value}
              />

          </div>
          <div className={classNames("flex w-1/2 gap-[10px]", s.tab)}>
              <AsyncSelect
              placeholder="Категория"
              inputProps={{ mode: 'stroke' }}
              withClearButton
              onSelect={fields.category.onChange}
              value={fields.category.value}
              loadData={recyclablesCategoriesSelectApi} 
    />
          </div>
        </div>
      
    );
  };
  
