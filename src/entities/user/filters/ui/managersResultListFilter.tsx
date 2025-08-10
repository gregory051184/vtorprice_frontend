import {useForm} from "@box/shared/effector-forms";
import {managersFilters} from "@box/entities/user/filters";
import {DatePicker} from "@box/shared/ui";
import React from "react";

export const ManagersResultListFilter = () => {
    const {fields, submit} = useForm(managersFilters)
    return (
        <div>
            <div className="inline-flex">
                <DatePicker
                    inputStyle={"w-auto"}
                    mode="stroke"
                    placeholder="Временной промежуток"
                    value={fields.created_at.value}
                    onChange={fields.created_at.onChange}
                />
            </div>
        </div>
    )
}