import { IWithClass, IWithChildren } from '@types';

export interface IStepper extends IWithClass, IWithChildren {
  currentStep: number
}

export interface IStep extends IWithClass, IWithChildren {}
