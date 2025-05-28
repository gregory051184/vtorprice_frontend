import {
    Button, Paper
} from '@box/shared/ui';
import { IWithClass } from '@box/types';
import React from 'react';
import { useEvent } from 'effector-react';
import { submit } from '../model';
import { SpecialUserInfoForm } from '@box/features/settings/special_user_info/ui';


export const LogistSettings: React.FC<IWithClass> = ({ className }) => {
const submitEvent = useEvent(submit);

return (
    <div className={className}>
    <Paper>
        <SpecialUserInfoForm />
        <Button onClick={submitEvent} fullWidth>
        Сохранить
        </Button>
    </Paper>
    </div>
    );
};