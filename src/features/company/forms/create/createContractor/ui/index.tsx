import React from 'react';
import {useEvent, useStore, useUnit} from 'effector-react';
import {
  BaseInput, Button, Drawer, Select
} from '@box/shared/ui';
import AddIcon from '@assets/icons/16_add.svg';
import { useForm } from '@box/shared/effector-forms';
import { logistContractorCreateForm } from '@box/features/company/forms/create/createContractor';
import { contractorsType } from '@box/entities/contractors';
import { ImageBox } from '@box/entities/company/ui/image';
import { DocumentsBox } from '@box/entities/company/ui/documents';
import { TGeoSelectValues } from "@box/shared/ui/select/geo-select/types";
import dynamic from "next/dynamic";
import {uploadNotRequiredDocument} from "@box/features/company-management/documents/model";

const DynamicGeoSelect = dynamic(
  () => import('@box/shared/ui').then(module => module.GeoSelect),
  { ssr: false }
)

export const LogistContractorCreateForm = () => {
  const formOpen = useStore(logistContractorCreateForm.$formOpen);
  const toggler = useUnit(logistContractorCreateForm.toggle);
  const {
    fields, reset, hasError, isValid, submit,
  } = useForm(logistContractorCreateForm.form);

  const handleOnClose = () => {
    toggler();
    reset();
  };

  const handleAddContractor = () => {
    submit();
  };

  const handleSelectAddress = (data: TGeoSelectValues) => {
    fields.address.onChange(data.address);
    fields.latitude.onChange(data.latitude);
    fields.longitude.onChange(data.longitude);
  };

  const uploadDocumentEvent = useEvent(uploadNotRequiredDocument);

  return (
    <div>
      <Drawer
        bottomActions={(
          <Button
            fullWidth
            onClick={handleAddContractor}
            disabled={!isValid}
          >
            Добавить
          </Button>
        )}
        title="Добавить контрагента"
        visible={formOpen}
        close={handleOnClose}
      >
  
        <div>
          <div className="grid grid-cols-1 auto-rows-auto gap-4 mb-4">
            <Select
              placeholder="Тип"
              value={fields.contractor_type.value}
              onSelect={fields.contractor_type.onChange}
              data={contractorsType}
            />
            <BaseInput
              placeholder="Название компании / ФИО"
              value={fields.name.value}
              required
              error={hasError('name')}
              mode="stroke"
              type="text"
              onChange={fields.name.onChange}
            />
            <DynamicGeoSelect
              inputValue={fields.address.value}
              inputProps={{ mode: 'stroke' }}
              placeholder="Адрес"
              error={hasError('address') || hasError('latitude') || hasError('longitude')}
              onInput={fields.address.onChange}
              onSelect={handleSelectAddress}
              required
            />
            <BaseInput
              placeholder="Сколько собственных ТС"
              value={fields.transport_owns_count.value}
              required
              error={hasError('transport_owns_count')}
              mode="stroke"
              type="number"
              onChange={fields.transport_owns_count.onChange}
            />
          </div>
          <div className="grid grid-cols-1 auto-rows-auto gap-4">
            <ImageBox
                name="Логотип/Фото"
                nameWithImage="Заменить фотографию/логотип"
                image={fields.avatar_or_company_logo.value}
                onSelect={fields.avatar_or_company_logo.onChange}
                onDelete={fields.avatar_or_company_logo.reset}
            />
            <DocumentsBox
              name="Пакет документов"
              documents={fields.document.value}
              onAdd={fields.document.onChange}
            />
          </div>
        </div>
      </Drawer>
      <div className="w-[210px]">
        <Button onClick={toggler} mode="stroke" iconLeft={<AddIcon/>} type="mini">
          Добавить контрагента
        </Button>
      </div>
    </div>
  );
};
