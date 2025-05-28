import React, { Children } from 'react';
import { IStep, IStepper } from './types';

const Step: React.FC<IStep> = ({ children, className }) => (
  <div className={className}>
    {children}
  </div>
);

function Stepper({ currentStep, className, children }: IStepper) {
  const totalSteps = Children.count(children);
  const childrenArr = Children.toArray(children);
  return (
    <div className={className}>
      {(() => {
        if (currentStep <= totalSteps && currentStep > 0) {
          return childrenArr[currentStep - 1];
        }
        return null;
      })()}
    </div>
  );
}

Stepper.Step = Step;

export { Stepper };
