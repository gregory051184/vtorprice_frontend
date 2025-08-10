import classNames from 'classnames';
import React, {ChangeEventHandler, useId} from 'react';
import {IFileButton} from './types';

export const FileButton: React.FC<IFileButton> = ({
                                                      children,
                                                      className,
                                                      onChange,
                                                      mimes = '',
                                                      multiple,
                                                      accept
                                                  }) => {
        const id = useId();

        const makeName = (length: number) => {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        const handleFileSelect: ChangeEventHandler<HTMLInputElement> = (ev) => {
            const file = ev.target?.files?.[0];
            if (file) {
                const fileName = makeName(25) + '.' + file.name.split('.')[file.name.split('.').length - 1] //file.name.slice(0, -12) + '.' + file.name.split('.')[file.name.split('.').length - 1]
                const newFile = new File([file], fileName, {type: file.type})
                const dt = new DataTransfer()
                const namedFile = dt.items.add(newFile)
                //@ts-ignore
                onChange(namedFile.getAsFile())
                return;
            }
            // if (file) {
            //   onChange(file);
            //   return;
            // }
            onChange(null);
        };

        return (
            <label htmlFor={id} className={classNames('block cursor-pointer w-full', className)}>
                <input id={id} onChange={handleFileSelect} accept={mimes} type="file" className="hidden"
                       multiple={multiple} {...(!!accept && {accept})} />
                {children}
            </label>
        );
    }
;
