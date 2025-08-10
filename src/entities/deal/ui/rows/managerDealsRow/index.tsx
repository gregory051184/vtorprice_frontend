import {Table} from "@box/shared/ui";
import {ManagerDealsRowType} from "@box/entities/deal/ui/rows/managerDealsRow/types";
import React from "react";
import {ColorStatus} from "@box/shared/ui/colorStatus";
import {useRouter} from "next/router";

export const ManagerDealsRow: React.FC<ManagerDealsRowType> = ({
                                                                   deal
                                                               }) => {
    const router = useRouter();
    return (
        <Table.Row onClick={() => router.push(`/deals/${deal.id}`)}>
            <Table.Cell>
                <p>
                    {deal.buyerCompany.name}
                </p>

            </Table.Cell>
            <Table.Cell>
                <p>
                    {deal.supplierCompany.name}
                </p>
            </Table.Cell>
            <Table.Cell>
                <p>
                    {deal.application.recyclables.name}
                </p>
            </Table.Cell>
            <Table.Cell>
                <p>
                    {//@ts-ignore
                        deal?.totalPrice / 1000
                    }
                </p>
            </Table.Cell>
            <Table.Cell>
                <p>
                    {deal.application.dealType.label}
                </p>
            </Table.Cell>
            <Table.Cell>
                {/* @ts-ignore */}
                <ColorStatus status={deal.status}/>
            </Table.Cell>
        </Table.Row>
    )
}