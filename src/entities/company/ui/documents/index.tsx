import React from 'react';
import classNames from 'classnames';
import DocIcon from '@assets/icons/24_docx.svg';
import { FilesButton } from '@box/shared/ui/filesButton';
import { Skeleton } from '@box/shared/ui';
import Add from '@assets/icons/16_add.svg';
import { IDocuments } from './types';

import s from './style.module.scss';

export const DocumentsBox: React.FC<IDocuments> = ({
  className,
  documents = null,
  loading = false,
  onAdd = (files) => documents=files,
  name
}) => {
  if (loading) {
    return <Skeleton className={classNames('h-[56px]  rounded-[10px]', className)}/>;
  }

  return (
    <div className="flex flex-col">
      {documents && (
        <div className={classNames('flex flex-col gap-4 overflow-y-auto mb-4 max-h-[300px]', s.scrollbar)}>
          {Array.from(documents).map((document) => (
            <div key={document.name} className="h-[72px] rounded-[20px] p-[25px] bg-background-grey cursor-pointer">
              <div className="flex items-center gap-[12px]">
                <DocIcon className="fill-grey-30" />
                <p className="text-sm border-b-[1px] border-dashed">{document.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <FilesButton onChange={onAdd} className={className} multiple>
        <div className="border-2 h-[56px] w-full cursor-pointer rounded-[10px] flex justify-center border-primaryGreen-main border-dashed">
          <div className="flex items-center gap-[16px]">
            <Add className="fill-primaryGreen-main" />
            <p className="text-primaryGreen-main text-sm font-medium">{name}</p>
          </div>
        </div>
      </FilesButton>   
    </div>
  );
};
