import {IWithChildren} from '@types';
import {ReactElement} from 'react';

export interface IPopover extends IWithChildren {
    width?: 'target' | number

    height?: number | string,

    showOnHover?: boolean
    position?: 'top' | 'bottom',
    center?: boolean,
    opened: boolean,
    close: () => void,
    containerSize?: number
}

export interface IPopoverTarget {
    children: ReactElement
}

export interface IPopoverDropdown extends IWithChildren {
}
