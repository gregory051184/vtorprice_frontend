import classNames from 'classnames';
import React from 'react';
import Check from '@assets/icons/16_checkmark.svg';
import { steps } from './lib';
import { IDealSteps } from './types';

export const DealSteps: React.FC<IDealSteps> = ({ step: currentStep, type }) => (

  <div className="flex flex-col gap-[22px]">
    {/*// @ts-ignore*/}
    {steps[type].map((step, i) => (
      <div className="flex gap-[10px] items-center" key={step.id}>
        {step.id < currentStep
          ? <Check className="w-[24px]" />
          : (
            <div className={classNames(
              'w-[24px] h-[24px] shrink-0 rounded-full text-grey-50 text-xs border-grey-20 border flex justify-center items-center',
              { 'border-primaryGreen-main bg-primaryGreen-main text-white': step.id === currentStep }
            )}
            >
              {i + 1}
            </div>
          )}
        <p className={classNames(
          { 'font-bold text-primaryGreen-main': step.id === currentStep },
          { 'text-grey-20': step.id < currentStep }
        )}
        >
          {step.label}
        </p>
      </div>
    ))}
  </div>
); 
