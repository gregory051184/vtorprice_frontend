import {
  CompanyDocumentsForm,
  CompanyNotRequiredDocumentsForm,
} from '@box/features/settings/documents';
import { Button, Drawer, Separator, Tip } from '@box/shared/ui';
import { IWithClass } from '@box/types';
import React from 'react';
import { useEvent, useStore } from 'effector-react';
import { useBoolean } from '@box/shared/hooks';
import { CompanyInfoForm } from '@box/features/settings/company_info';
import {
  CompanyActivityTypesCustomerForm,
  CompanyActivityTypesProcessorForm,
  CompanyActivityTypesSupplierForm,
} from '@box/features/settings/company_activity_types';
import {
  CompanyRecyclablesTypesBuy,
  CompanyRecyclablesTypesSell
} from '@box/features/settings/recyclables_types';
import { REQUIRED_DOCUMENTS } from '../lib';
import { loader, submit } from '../model';
import classNames from "classnames";
import s from './style.module.scss';

export const CompanyOwnerSettings: React.FC<IWithClass> = ({ className }) => {
  const loading = useStore(loader.$loaderStore);
  const submitEvent = useEvent(submit);
  const { value, toggle } = useBoolean(false);
  return (
    <div className={className}>
      <Drawer
        title="Список требуемых документов"
        visible={value}
        close={toggle}
      >
        {REQUIRED_DOCUMENTS.map((document, num) => (
          <div
            key={document}
            className="mt-[14px] flex gap-[10px] pb-[14px] border-b border-b-grey-20"
          >
            <div className="w-[30px] shrink-0 h-[30px] rounded-full bg-secondaryGreen-light flex items-center justify-center">
              <span className="text-sm text-primaryGreen-main">
                {num + 1}
              </span>
            </div>
            <p>{document}</p>
          </div>
        ))}
      </Drawer>
      <div className='p-[16px] rounded-[20px] bg-grey-10'>
        <CompanyInfoForm />
        <CompanyDocumentsForm className="mt-[16px]" />
        <p className="text-sm my-[26px]  text-grey-60">Типы вторсырья:</p>
        <CompanyRecyclablesTypesBuy />
        <Separator />
        <CompanyRecyclablesTypesSell />
        <Separator />
        <p className="text-sm my-[26px]  text-grey-60">Типы компании:</p>
        <CompanyActivityTypesSupplierForm />
        <Separator />
        <CompanyActivityTypesProcessorForm />
        <Separator />
        <CompanyActivityTypesCustomerForm />

        <CompanyNotRequiredDocumentsForm className="mt-[26px]" />
        <Tip
          className={classNames("my-[16px]", s.tip)}
          link={{
            onClick: toggle,
            text: 'Посмотреть требуемый список',
          }}
        >
          Не забудьте приложить обязательные документы
        </Tip>
        <Button loading={loading} onClick={submitEvent} fullWidth>
          Сохранить
        </Button>
      </div>
    </div>
  );
};
