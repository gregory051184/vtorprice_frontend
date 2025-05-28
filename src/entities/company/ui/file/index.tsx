import React from 'react';
import classNames from 'classnames';
import { Skeleton, FileButton } from '@box/shared/ui';
import FileIcon from '@assets/icons/24_file.svg';
import Delete from '@assets/icons/input_wipe_icon.svg';
import Add from '@assets/icons/16_add.svg';
import { IFile } from './types';
import dotenv from 'dotenv';

dotenv.config();

export const File: React.FC<IFile> = ({
  className,
  file = null,
  loading = false,
  onSelect = () => null,
  onDelete,
  name,
  accept
}) => {
  if (loading) {
    return <Skeleton className={classNames('h-[56px]  rounded-[10px]', className)} />;
  }

  if (file) {
    return (
      <div className={classNames('shadow border-2 border-white rounded-[10px] p-[16px] bg-white cursor-pointer  flex items-center justify-between', className)}>
        <div className="">
          <a className="flex items-center gap-[14px]" href={process.env.NEXT_PUBLIC_FILE_PATH_LOAD + file.file} target="_blank" rel="noopener noreferrer">
            <div className='min-w-[24px]'>
              <FileIcon className="fill-primaryGreen-main"/>
            </div>
            <p className="text-sm max-w-[250px]" style={{wordBreak: "break-all"}}>{name}</p>
          </a>
        </div>
        {onDelete && <Delete onClick={() => onDelete(file.id)} />}
      </div>
    );
  }
  return (
    <FileButton onChange={onSelect} className={className} accept={accept}>
      <div className={classNames('border-2 h-[56px] w-full cursor-pointer rounded-[10px] flex justify-center border-primaryGreen-main border-dashed')}>
        <div className="flex items-center gap-[16px]">
          <div className='min-w-[24px]'>
            <Add className="fill-primaryGreen-main" />
          </div>
          <p className="text-primaryGreen-main text-sm font-medium max-w-[250px]">{name}</p>
        </div>
      </div>
    </FileButton>    
  );
};
