import React from 'react';
import { IWithClass } from '@types';
import classNames from 'classnames';
import s from './style.module.scss';
import { steps } from '../lib';

export const StepsCards:React.FC<IWithClass> = ({
  className
}) => (
  <div className={classNames(className)}>
    <h3 className="text-center text-[32px] font-medium mb-[76px]">Этапы работы</h3>
    <div className={classNames('flex flex-wrap', s.steps)}>
      {steps.map((step, num) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={num} className={s.steps_step}>
          <div className={classNames('flex gap-[40px] items-center', s.steps_step_head)}>
            <div
              className={classNames('bg-primaryGreen-main rounded-full flex items-center justify-center', s.steps_bubble)}
            >
              <p className="text-white font-medium text-[32px]">{num + 1}</p>
            </div>
            {num < steps.length - 1 && (
              <div className={classNames('grow h-1 bg-primaryGreen-main', s.steps_dash)}/>
            )}
          </div>
          <div className="">
            <p className="text-[24px] font-medium mt-[38px]">{step.title}</p>
            <p className="text-grey-70 text-[16px] mt-[16px]">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
