import { BackButton, Button, Drawer, Separator, Tip } from '@box/shared/ui';
import { IWithClass } from '@box/types';
import React from 'react';
import { useEvent, useStore } from 'effector-react';
import { useBoolean } from '@box/shared/hooks';
import { REQUIRED_DOCUMENTS } from '../lib';
import { loader, submit } from '../model';
import classNames from "classnames";
import s from './style.module.scss';
import { CompanyInfoFormManagement } from '@box/features/company-management/company_info';
import { CompanyDocumentsFormManagement, CompanyNotRequiredDocumentsFormManagement } from '@box/features/company-management/documents/ui';
import { CompanyRecyclablesTypesBuyManagement } from '@box/features/company-management/recyclables_types/ui/buy';
import { CompanyRecyclablesTypesSellManagement } from '@box/features/company-management/recyclables_types/ui/sell';
import { CompanyActivityTypesSupplierFormManagement } from '@box/features/company-management/company_activity_types/ui/supplier';
import { CompanyActivityTypesProcessorFormManagement } from '@box/features/company-management/company_activity_types/ui/processor';
import { CompanyActivityTypesCustomerFormManagement } from '@box/features/company-management/company_activity_types/ui/customer';

export const CompanyManagement: React.FC<IWithClass> = ({ className }) => {
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
        <BackButton className='text-sm mt-[10px]'>Назад</BackButton>
        <Separator/>
        <CompanyInfoFormManagement />
        <CompanyDocumentsFormManagement className="mt-[16px]" />
        <p className="text-sm my-[26px]  text-grey-60">Типы вторсырья:</p>
        <CompanyRecyclablesTypesBuyManagement />
        <Separator />
        <CompanyRecyclablesTypesSellManagement />
        <Separator />
        <p className="text-sm my-[26px]  text-grey-60">Типы компании:</p>
        <CompanyActivityTypesSupplierFormManagement />
        <Separator />
        <CompanyActivityTypesProcessorFormManagement/>
        <Separator />
        <CompanyActivityTypesCustomerFormManagement />

        <CompanyNotRequiredDocumentsFormManagement className="mt-[26px]" />
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
