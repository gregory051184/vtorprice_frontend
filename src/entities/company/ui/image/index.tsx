import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import { Skeleton, FileButton } from '@box/shared/ui';
import Add from '@assets/icons/16_add.svg';
import { IImage } from './types';

export const ImageBox: React.FC<IImage> = ({
  className,
  image = null,
  loading = false,
  onSelect = () => null,
  onDelete,
  name,
  nameWithImage
}) => {
  const [fileDataURL, setFileDataURL] = useState<string | null>(null);

  const borderColor = classNames({
    'border-primaryGreen-main': !image,
    'border-red-main': image,
  });
  const imageColor = classNames({
    'fill-primaryGreen-main': !image,
    'fill-red-main': image,
  });
  const textColor = classNames({
    'text-primaryGreen-main': !image,
    'text-red-main': image,
  });

  const text = !image ? name : nameWithImage;

  useEffect(() => {
    let fileReader: any;
    let isCancel = false;
    if (image) {
      fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result);
        }
      };
      fileReader.readAsDataURL(image);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [image]);

  const handleOnDelete = () => {
    if (onDelete) {
      onDelete();
      setFileDataURL(null);
    }  
  };

  if (loading) {
    return <Skeleton className={classNames('h-[56px]  rounded-[10px]', className)} />;
  }

  return (
    <div>
      {fileDataURL && (
        <div className="mb-4">
          <div className="relative w-20 h-20 border-[1px] border-solid rounded-xl border-grey-20 overflow-hidden">
            <Image
              className="object-cover"
              fill
              src={fileDataURL}
              alt="img"
            />
            <Add
              className="absolute top-1 right-1 fill-grey-90 rotate-45 cursor-pointer"
              onClick={handleOnDelete} 
            /> 
          </div>
        </div>
      )}
        
      <FileButton onChange={onSelect} className={className} mimes="image/*">
        <div className={classNames('border-2 h-[56px] w-full cursor-pointer rounded-[10px] flex justify-center border-dashed', borderColor)}>
          <div className="flex items-center gap-[16px]">
            <Add className={imageColor} />
            <p className={classNames('text-sm font-medium', textColor)}>{text}</p>
          </div>
        </div>
      </FileButton>   
    </div>
  );
};
