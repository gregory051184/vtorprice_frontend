/* eslint-disable react/prop-types.ts */
import classNames from 'classnames';
import {IEquipmentApplication, IRecyclableApplication} from '@box/entities/application/model';
import CloseIcon from '@assets/icons/20_close.svg';
import {IWithClass} from '@box/types';
import s from './style.module.scss';
import {ApplicationRowForMap} from "@box/features/map/row";

interface IInfoAboutApplication extends IWithClass {
    applications: Array<IRecyclableApplication | IEquipmentApplication>
    cbCloseIconOnClick: () => void
    onClickOnItem: (isEquipment: boolean, id: number) => void
}

export const InfoAboutApplications: React.FC<IInfoAboutApplication> = ({
                                                                           applications,
                                                                           className,
                                                                           cbCloseIconOnClick,
                                                                           onClickOnItem
                                                                       }) => {
    if (applications.length > 0) {
        return (
            <div className={className}>
                <div className="flex gap-4 h-full">
                    <div className={s.closeIcon} onClick={cbCloseIconOnClick}>
                        <CloseIcon/>
                    </div>
                    <div
                        className={classNames('flex gap-[14px] bg-white-80 overflow-y-auto h-full', s.listOfApplication)}>
                        {applications.map((application) => (
                            <ApplicationRowForMap application={application} onClickOnItem={onClickOnItem} key={application.id} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    return null;
};
