import {IWithClass} from '@box/types';
import React from 'react';
import {useEvent, useStore} from 'effector-react';
import {File} from '@box/entities/company';
import {Tip} from '@box/shared/ui';
import classNames from 'classnames';
import {
    $documents,
    uploadRequiredDocument,
    deleteRequiredDocument,
    $notRequiredDocuments,
    uploadNotRequiredDocument,
    deleteNotRequiredDocument,
} from '../model';
import s from './style.module.scss';

export const CompanyDocumentsFormManagement: React.FC<IWithClass> = ({
                                                                         className,
                                                                     }) => {
    const documentsStore = useStore($documents);
    const uploadDocumentEvent = useEvent(uploadRequiredDocument);
    const deleteDocumentEvent = useEvent(deleteRequiredDocument);

    return (
        <form className={className}>
            <p className="text-sm mb-[26px] text-grey-60">Основные документы:</p>
            <div className={classNames('flex ml-[-20px]', s.documents)}>
                <File
                    accept='application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,text/plain'
                    onSelect={(file) => (file ? uploadDocumentEvent({type: 1, file}) : null)}
                    onDelete={(id) => deleteDocumentEvent({type: 1, id})}
                    file={documentsStore.charter}
                    className={s.fileButton}
                    name="Устав"
                />
                <File onSelect={(file) => (file ? uploadDocumentEvent({type: 3, file}) : null)}
                      onDelete={(id) => deleteDocumentEvent({type: 3, id})} file={documentsStore.inn}
                      className={s.fileButton} name="ИНН"/>
                <File onSelect={(file) => (file ? uploadDocumentEvent({type: 2, file}) : null)}
                      onDelete={(id) => deleteDocumentEvent({type: 2, id})} file={documentsStore.requisites}
                      className={s.fileButton} name="Реквизиты"/>
            </div>
            <Tip className="mt-[16px]">
                Для ИП устав и ИНН прикреплять не требуется
            </Tip>
        </form>
    );
};

export const CompanyNotRequiredDocumentsFormManagement: React.FC<IWithClass> = ({
                                                                                    className,
                                                                                }) => {
    const documentsStore = useStore($notRequiredDocuments);
    const uploadDocumentEvent = useEvent(uploadNotRequiredDocument);
    const deleteDocumentEvent = useEvent(deleteNotRequiredDocument);

    return (
        <form className={className}>
            <div className="">
                {documentsStore.map((document) => <File className="mb-[16px]" file={document}
                                                        name={document.comment || 'Неизвестный файл'}
                                                        onDelete={() => deleteDocumentEvent(document.id)}
                                                        key={document.id} onSelect={() => null}/>)}
            </div>
            <div className="flex">
                <File className="w-full" name="Добавить другие документы" onSelect={(file) => {
                    file ? console.error('---Ошибка: Неправильный формат файла') : null;
                    return (file ? uploadDocumentEvent(file) : null)
                }}/>
            </div>

        </form>
    );
};
