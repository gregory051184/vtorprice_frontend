import {IWithClass, IWithSx} from '@types';
import {IAppInput} from '@box/shared/ui/input';

export interface ISelectValue<T = any> {
    id: number | string
    label: string
    value: T,
    selectable?: boolean,
    isHeader?: boolean,
    disabled?: boolean
    children?: Array<ISelectValue<T>>

    [key: string]: any
}

export interface IAppSelect<T = any> extends IWithClass, IWithSx {

    defaultValue?: string,
    wide?: boolean,
    columnCount?: number,
    withClearButton?: boolean
    withSpecialWideAndCloseButton?: boolean
    additionFuncOnClearClick?: (() => void)

    data: Array<ISelectValue<T>>,
    value?: ISelectValue<T> | null,

    onSelect?: (val: ISelectValue<T> | null) => void
    onInput?: (val: string) => void
    inputValue?: string

    placeholder?: string
    error?: boolean
    required?: boolean

    inputProps?: Omit<IAppInput, 'iconLeft' | 'iconRight' | 'placeholder' | 'onClick' | 'onChange' | 'value'>
    withSearch?: boolean,
    selectFirstValue?: boolean,
    selectFirstOfFirstValue?: boolean,

    containerSize?: number
}

export interface IWideSelectDrawer<T = any> {
    closeFunc?: (() => void)
    columnCount: number,
    data: Array<ISelectValue<T>>,
    onSelect: (val: ISelectValue<T>) => void
}

export interface ISelectValueField {
    value: ISelectValue
    disabled?: boolean
    selected?: boolean
    onClick: () => void
}

export type IPillValue<T = any> = Pick<ISelectValue<T>, 'id' | 'label' | 'value'>;

export interface IPillSelect<T = any> extends IWithClass {
    onChange: (val: Array<IPillValue<T>>) => void
    values: Array<IPillValue<T>>
    value: Array<IPillValue<T>>
}

export type ITabSelectValue<T = any> = Pick<ISelectValue<T>, 'id' | 'label' | 'value'>;

export interface ITabSelect<T = any> extends IWithClass {
    onChange?: (val: ITabSelectValue<T>) => void,
    values: Array<ITabSelectValue<T>>,
    value: ITabSelectValue<T> | null,

    propWidth?: (width: number) => number

    label?: string
}
