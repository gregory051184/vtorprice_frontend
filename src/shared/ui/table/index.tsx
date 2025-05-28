import React from 'react';
import classNames from 'classnames';
import Empty from '@assets/icons/32_empty.svg';
import OrderingDisabled from '@assets/icons/ordering_disabled.svg';
import OrderingEnabled from '@assets/icons/oredring_enabled.svg';
import {
    ITable, ITableBody, ITableCell, ITableHead, ITableRow,
} from './types';
import s from './style.module.scss';
import {Loader} from '../loader';

type ISvgView = {
    header: {
        ordering?: string;
        label: string;
    };
    // eslint-disable-next-line react/require-default-props
    curOrd?: string | null;
};

const SvgView: React.FC<ISvgView> = ({header, curOrd}) => {
    const {ordering} = header;
    if (!ordering) {
        return null;
    }
    if (ordering === curOrd) {
        return <OrderingEnabled/>;
    }
    if (`-${ordering}` === curOrd) {
        return <div className="rotate-180"><OrderingEnabled/></div>;
    }
    if (ordering !== curOrd) {
        return <OrderingDisabled/>;
    }
    return null;
};

export function Table({
                          className,
                          children,
                          loading = false,
                          pagination,
                          empty = false,
                          separate
                      }: ITable) {
    if (loading) {
        return <Loader center className="my-[80px]"/>;
    }
    return (
        <div className={className}>
            <table className={classNames('w-full', separate && s.table_separate, className)}>
                {children}
            </table>
            {empty
                ? (
                    <div className="flex justify-center my-[80px]">
                        <div className="flex flex-col items-center">
                            <Empty/>
                            <p className="mt-[20px] text-grey-50 text-sm">По вашему фильтру ничего не найдено</p>
                        </div>
                    </div>
                )
                : (
                    <div className="mt-[10px]">
                        {pagination}
                    </div>
                )}
        </div>

    );
}

const Head: React.FC<ITableHead> = ({
                                        className,
                                        children,
                                        ordering,
                                        onOrderingChange = () => null,
                                        headers = []
                                    }) => {
    const onOrderingPick = (new_ordering: string | undefined) => {
        if (new_ordering === ordering) {
            onOrderingChange(`-${new_ordering}`);
            return;
        }
        if (ordering === `-${new_ordering}`) {
            onOrderingChange(null);
            return;
        }
        onOrderingChange(new_ordering!);
    };

    return (
        <thead className={classNames(s.header, className)}>
        {children}
        <Table.Row>
            {headers?.map((header) => (
                <Table.Cell key={header.label}>
                    <div className="flex items-center gap-[10px] whitespace-nowrap"
                         onClick={() => onOrderingPick(header.ordering)}>
                        {header.label}
                        <SvgView header={header} curOrd={ordering}/>
                    </div>
                </Table.Cell>
            ))}
        </Table.Row>
        </thead>
    );
};


const List: React.FC<ITableHead> = ({
                                        className,
                                        children,
                                        ordering,
                                        onOrderingChange = () => null,
                                        headers = []
                                    }) => {
    const onOrderingPick = (new_ordering: string | undefined) => {
        if (new_ordering === ordering) {
            onOrderingChange(`-${new_ordering}`);
            return;
        }
        if (ordering === `-${new_ordering}`) {
            onOrderingChange(null);
            return;
        }
        onOrderingChange(new_ordering!);
    };
    return (
        <thead className={classNames(s.header, className)}>
        {children}
        {headers?.map((header) => (
            /*<Table.Cell key={header.label}>*/
            <div className="flex items-center gap-[10px] whitespace-nowrap"
                 style={{color: "white", marginTop: '10px'}}
                 onClick={() => onOrderingPick(header.ordering)}>
                {header.label}
                <SvgView header={header} curOrd={ordering}/>
            </div>
            /*</Table.Cell>*/
        ))}
        </thead>
    );
};

const Body: React.FC<ITableBody> = ({
                                        className,
                                        children,
                                    }) => (
    <tbody className={classNames(s.tbody, className)}>
    {children}
    </tbody>
);

const Row: React.FC<ITableRow> = ({
                                      className,
                                      children,
                                      onClick = () => null,
                                      isHover = true,
                                  }) => (
    <tr onClick={onClick} className={classNames({'hover:bg-grey-10': isHover}, className)}>
        {children}
    </tr>
);

const Cell: React.FC<ITableCell> = ({
                                        className,
                                        children,
                                        onClick = () => null,
                                        colspan = 1,
                                        ...props
                                    }) => (
    <td colSpan={colspan} onClick={onClick} className={classNames('py-[16px]  px-[14px]', className)} {...props}>
        {children}
    </td>
);

Table.Head = Head;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;

Table.List = List;
