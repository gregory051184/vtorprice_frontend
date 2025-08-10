import React from 'react';
import {IWithClass} from '@types';
import {equipmentUpdateForm} from '../model';
import {EquipmentUpdateTemplate} from "@box/entities/application/ui/templates/equipmentForm/updateTemplate";

export const UpdateEquipmentForm: React.FC<IWithClass> = ({
                                                                        className,
                                                                    }) => (
    // <EquipmentFormTemplate
    //     form={equipmentForm.form}
    //     className={className}
    //     totalPrice={equipmentForm.$totalPrice}
    //     isUpdate
    // />
    <EquipmentUpdateTemplate
        form={equipmentUpdateForm.form}
        className={className}
        totalPrice={equipmentUpdateForm.$totalPrice}
        isUpdate/>
);
