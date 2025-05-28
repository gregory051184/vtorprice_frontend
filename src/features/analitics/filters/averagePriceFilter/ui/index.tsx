import { useForm } from "@box/shared/effector-forms";
import { IWithClass } from "@box/types";
import { filters } from '../model';
import { AsyncSelect } from "@box/shared/ui";
import { citySelectApi } from "@box/entities/city";
import s from './style.module.scss';
import classNames from "classnames";
import Swap from '@assets/icons/swap.svg';

  export const AveragePriceFilters: React.FC<IWithClass> = ({
    className
  }) => {
    const { fields } = useForm(filters);

    const swapFn = () => {
      const varToSwap = fields.delivery_city.value;
      fields.delivery_city.value = fields.shipping_city.value;
      fields.delivery_city.onChange(fields.shipping_city.value);
      fields.shipping_city.value = varToSwap;
      fields.shipping_city.onChange(fields.shipping_city.value);
    };

    return (
        <div className={classNames("flex items-center mt-[30px] w-2/3 justify-between gap-[5px]", s.adaptive, className)}>
            <div className={classNames("w-5/12", s.filters)}>
              <AsyncSelect
              placeholder="Откуда"
              inputProps={{ mode: 'stroke' }}
              onSelect={fields.shipping_city.onChange}
              value={fields.shipping_city.value}
              loadData={citySelectApi}
              />
            </div>
              <Swap onClick={swapFn} className={classNames("cursor-pointer", s.rotate)}/>
            <div className={classNames("w-5/12", s.filters)}>
              <AsyncSelect
              placeholder="Куда"
              inputProps={{ mode: 'stroke' }}
              onSelect={fields.delivery_city.onChange}
              value={fields.delivery_city.value}
              loadData={citySelectApi}/>
            </div>
        </div>
      
    );
  };
  
