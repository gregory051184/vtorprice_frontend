import React from 'react';
import {IWithClass} from '@types';
import {ProposalFormTemplate} from "@box/entities/proposal";


export const CreateProposalForm: React.FC<IWithClass> = ({
                                                             className
                                                         }) => (
        <ProposalFormTemplate></ProposalFormTemplate>
);