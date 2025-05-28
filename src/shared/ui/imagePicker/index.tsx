import React, {memo} from 'react';
import classNames from 'classnames';
import EmptyPicture from '@assets/icons/empty_picture.svg';
import {FileButton} from '@box/shared/ui';
import Delete from '@assets/icons/image_picker_delete.svg';
import {IImagePicker} from './types';

export const ImagePicker = memo(({
                                     className,
                                     image = null,
                                     onChange = () => null
                                 }: IImagePicker) => {
        const imageURL = () => {
            if (image != null && typeof image === 'string' && process.env.NEXT_PUBLIC_API_URL) {
                const url = process.env.NEXT_PUBLIC_API_URL;
                //if (process.env.NEXT_PUBLIC_API_URL.indexOf(':')) {
                //  url = process.env.NEXT_PUBLIC_API_URL.split(':')[0]
                //} else {
                //  url = process.env.NEXT_PUBLIC_API_URL;
                //}
                //const have = image.indexOf(url) >= 0;
                //if (have) {
                //  return image;
                //}

                if (image.includes('http')) {
                    const modifiedLink = image.split("/").splice(3).join("/");
                    const newImage = "/" + modifiedLink;
                    return process.env.NEXT_PUBLIC_API_URL + newImage;
                }
                return process.env.NEXT_PUBLIC_API_URL + image;
            }
            if (image != null && typeof image === 'object') {
                return URL.createObjectURL(image);
            }
        };

        return (
            <>
                {image == null ? (
                        <FileButton onChange={onChange} mimes="image/png, image/jpeg" className={classNames('relative overflow-hidden cursor-pointer h-[103px] border-dashed border border-primaryGreen-main rounded-[10px] flex justify-center items-center', className)}>

                            < div className="w-full flex flex-col items-center">
                                <EmptyPicture/>
                                <p className="text-sm  text-primaryGreen-main text-center">Добавить фото</p>
                            </div>

                        </FileButton>
                    )
                    : (
                        <div className={classNames('relative overflow-hidden cursor-pointer h-[103px] border-dashed border border-primaryGreen-main rounded-[10px] flex justify-center items-center', className)}>
                            <Delete onClick={() => onChange(null)} className="absolute z-10 top-[8px] right-[8px]"/>
                            <img className="w-full h-full absolute object-cover" src={imageURL()} alt=""/>

                        </div>
                    )}

            </>
        )
            ;
    })
;
