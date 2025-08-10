import React, {useEffect, useState} from "react";
import {IInvoicePayment} from "@box/entities/statistics/api/invoicePaymentsApi";
import {Button, ISelectValue, Select, Table} from "@box/shared/ui";
import {formatAmount} from "@box/shared/lib/helpers/formaters";
import {InvoicePaymentStatus} from "@box/entities/statistics/ui/rows/paymentInvoiceRowForStaff/types";
import {useEvent, useStore, useUnit} from "effector-react";
import {getActFx, getInvoiceBillFx, patchInvoiceStatusFX, updateInvoicesEvent} from "@box/widgets/payment-invoice";
import {IStatus} from "@box/entities/logistics/model";
import {useForm} from "@box/shared/effector-forms";
import {filters} from "@box/features/statistics/filters/financialDataFilters/model";
import {invoiceStatusSelectValues} from "@box/entities/application";
import {$document, addFile, deleteFile, sendPaymentOrderFx} from "@box/features/payment-invoice/paymentBar/model";
import {FileForPayments} from "@box/entities/statistics/ui/file";
import {useBoolean} from "@box/shared/hooks";
import FileIcon from "@assets/icons/24_file.svg";
import Delete from "@assets/icons/input_wipe_icon.svg";


export const PaymentInvoiceRowForStaff: React.FC<{ invoice: IInvoicePayment }> = ({
                                                                                      invoice
                                                                                  }) => {
    const getInvoiceBill = useUnit(getInvoiceBillFx);

    const sendDocumentPayment = useUnit(sendPaymentOrderFx);
    const getAct = useUnit(getActFx);
    const documentFile = useStore($document);
    const addDocument = useUnit(addFile);
    const deleteDocument = useUnit(deleteFile);
    const {value, toggle} = useBoolean(false);

    const updateInvEvent = useEvent(updateInvoicesEvent)

    const {fields} = useForm(filters);
    const [currentStatus, setCurrentStatus] = useState<IStatus>({id: invoice.status.id, label: invoice.status.label})
    const [showPaymentsOrders, setShowPaymentsOrders] = useState<boolean>(false);
    const [currentInvoice, setCurrentInvoice] = useState<number>(0);
    const update = useUnit(patchInvoiceStatusFX)

    const handleGetBill = async (id: number) => {
        return getInvoiceBill({id});

    };

    const updateInvoiceStatus = (invoiceId: number, status: string) => {
        update({
                id: invoiceId,
                status: status
            }
        );
        setCurrentInvoice(0);
    };

    const currentInvoiceHandler = (invoiceId: number) => {
        setCurrentInvoice(invoiceId);
    };

    const updateHandler = (event: ISelectValue<number> | null) => {
        //@ts-ignore
        setCurrentStatus({id: event?.value, label: event?.label})
        //@ts-ignore
        updateInvoiceStatus(invoice.id, `${event.value}`)
        fields.status.onChange(event)
    };

    const handleSendDocument = () => {
        if (documentFile) {
            sendDocumentPayment({
                id: invoice.id,
                invoice_payment: invoice.id,
                name: invoice.company.name,
                document: documentFile,
                total: invoice.amount,
            });
            toggle();
            updateInvEvent()
            setShowPaymentsOrders(false)
            return;
        }
        return;
    };

    useEffect(() => {
    }, [invoice, currentInvoice, currentStatus]);
    return (

        <Table.Row>
            <Table.Cell className="font-medium">
                <p>Платеж за сделку №{invoice.id}</p>
            </Table.Cell>
            <Table.Cell className="font-medium">
                <p>{invoice.company.name}</p>
            </Table.Cell>
            {currentInvoice === 0 &&
                <Table.Cell
                    onClick={() => currentInvoiceHandler(invoice.id)}
                    className={currentStatus.id === InvoicePaymentStatus.PENDING
                        ? "text-orange-dark w-[180px] cursor-pointer font-medium" :
                        currentStatus.id === InvoicePaymentStatus.PAID ?
                            "text-green-dark w-[180px] cursor-pointer font-medium" :
                            currentStatus.id === InvoicePaymentStatus.CANCELED ?
                                "w-[180px] text-blue-2x-dark cursor-pointer font-medium" :
                                currentStatus.id === InvoicePaymentStatus.REFUNDED ?
                                    "w-[180px] text-red-dark cursor-pointer font-medium"
                                    : "w-[180px] cursor-pointer font-medium"}>
                    <p>{currentStatus.label}</p>
                </Table.Cell>}
            {currentInvoice === invoice.id &&
                < Table.Cell className="w-[180px]">
                    <div>
                        <Select
                            value={fields.status.value}
                            onSelect={updateHandler}
                            placeholder={currentStatus.label}
                            data={invoiceStatusSelectValues}></Select>
                    </div>
                </Table.Cell>}
            <Table.Cell
                onClick={() => setShowPaymentsOrders(!showPaymentsOrders)}
                className={invoice.paymentOrder.length > 0 ? "font-medium text-green-dark cursor-pointer" :
                    "font-medium text-red-dark cursor-pointer"}>
                <p>{invoice.paymentOrder.length > 0 ? 'ПП' : "Нет ПП"}</p>
            </Table.Cell>
            <Table.Cell className="font-medium">
                <p>{formatAmount(invoice.amount)} ₽</p>
            </Table.Cell>
            <Table.Cell className="font-medium">
                <Button
                    mode="light"
                    type="micro"
                    onClick={() => handleGetBill(invoice.id)}>
                    Счёт
                </Button>
                <Button
                    className="mt-2"
                    mode="light"
                    type="micro"
                    onClick={() => getAct({id: invoice.id})}>
                    Акт
                </Button>
            </Table.Cell>

            {showPaymentsOrders &&
                <Table.Cell className="font-medium">
                    <div
                        // onClick={() => setShowPaymentsOrders(false)}
                        className="absolute p-3 z-20 rounded-[5px] w-auto bg-[#ECECEC] left-1/2">
                        {
                            invoice.paymentOrder.length === 0 &&
                            <div className="inline-flex">
                                <FileForPayments
                                    name="Прикрепить ПП"
                                    file={documentFile?.name}
                                    onSelect={addDocument}
                                    onDelete={() => {
                                        deleteDocument(invoice?.paymentOrder[0].id)
                                        updateHandler({
                                            id: 1,
                                            label: 'Ожидает оплаты',
                                            value: 1,

                                        })
                                    }}
                                />
                                <Button
                                    disabled={!documentFile}
                                    onClick={handleSendDocument}
                                    className="grow ml-5 w-60"
                                >
                                    Занести ПП
                                </Button>

                            </div>
                        }
                        {invoice.paymentOrder[0] &&
                            <div>
                                <div
                                    className='shadow h-[56px] border-2 border-white rounded-[10px] p-[16px] bg-white cursor-pointer flex items-center justify-between'>
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_API_URL}${invoice.paymentOrder[0].document}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2">
                                        <FileIcon className="fill-primaryGreen-main"/>
                                        <p className="text-sm">
                                            {`ПП по счёту от ${new Intl.DateTimeFormat('ru-RU', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour12: false,
                                        }).format(new Date(invoice.createdAt))}`}
                                        </p>
                                    </a>
                                    {deleteDocument && <Delete
                                        onClick={() => {
                                            deleteDocument(invoice.paymentOrder.length > 0 ? invoice?.paymentOrder[0].id : 0)
                                            updateHandler({
                                                id: 1,
                                                label: 'Ожидает оплаты',
                                                value: 1,

                                            })
                                            updateInvEvent()
                                            setShowPaymentsOrders(false)
                                        }}/>}

                                </div>
                                <div className="inline-flex mt-2">
                                    <p>
                                        {new Intl.DateTimeFormat('ru-RU', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            //second: 'numeric',
                                            hour12: false,
                                        }).format(new Date(invoice.paymentOrder[0].createdAt))}
                                        {' '}
                                    </p>
                                    <p className="ml-10">
                                        {`${invoice.paymentOrder[0].total} ₽`}
                                    </p>
                                </div>
                            </div>
                        }
                    </div>
                </Table.Cell>
            }
        </Table.Row>

    )
}