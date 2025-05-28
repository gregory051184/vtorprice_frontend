import {IUser} from "@box/entities/user";
import React from "react";

type StaffListRowType = {
    user: IUser
}

export const StaffListRow: React.FC<StaffListRowType> = ({
                                                             user
                                                         }) => {
    return (
        <tbody>
        <tr>
            <td>
                <div className="p-5">
                    <p>{`${user.position}`}</p>
                </div>
            </td>
            <td>
                <div className="p-5">
                    <p>{`${user.lastName} ${user.firstName} ${user.middleName}`}</p>
                </div>
            </td>
        </tr>
        </tbody>
    )
}