import React, { ReactNode } from 'react';
import { IWithClass, IWithChildren } from '@types';

export interface ITableHead extends IWithClass {
  children?: ReactNode
  headers?: {
    label: string,
    ordering?: string
  }[],

  onOrderingChange?:(ordering: string | null)=>void
  ordering?: string | null
}

export interface ITableBody extends IWithClass, IWithChildren {}

export interface ITableRow extends IWithClass, IWithChildren {
  onClick?: ()=>void,
  isHover?: boolean
}

export interface ITableCell extends IWithClass, IWithChildren, React.TdHTMLAttributes<HTMLTableCellElement> {
  onClick?: ()=>void
  colspan?:number
}

export interface ITable extends IWithClass, IWithChildren {
  loading?:boolean,
  empty?: boolean
  separate?: boolean;
  pagination?:ReactNode
}
