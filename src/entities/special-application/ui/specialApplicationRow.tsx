import {SpecialApplicationType, updateSpecialApplicationFx} from "@box/entities/special-application";
import {Rating} from "@box/shared/ui";
import TrashIcon from "@assets/icons/24_delete.svg";
import React from "react";
import {useRouter} from "next/router";
import {useUnit} from "effector-react";

export const SpecialApplicationRows: React.FC<SpecialApplicationType> = ({
                                                                             application,
                                                                         }) => {
    const router = useRouter();
    const updateSpecialApplication = useUnit(updateSpecialApplicationFx)
    const removeSpecialApplicationHandler = async (specAppId: number) => {
        await updateSpecialApplication({
            is_deleted: true,
            id: specAppId,
        });
    }
    return (
        <div className="inline-flex mt-6">
            <div>
                <div
                    onClick={() => router.push(`/profile/special-applications/${application.id}`)}>
                    <img
                        className="rounded-[10px] w-[250px] h-[250px] object-cover cursor-pointer"
                        src={
                            application?.specialApplication?.images[0] ? application?.specialApplication?.images[0].image
                                : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
                        }
                        alt=""
                    />
                </div>
            </div>
            <div
                className="cursor-pointer ml-20 mt-20"
                onClick={() => router.push(`/profile/special-applications/${application.id}}`)}>
                <p className="text-primaryGreen-main font-semibold mt-[10px]">
                    {application?.specialApplication?.price}
                    {' '}
                    ₽
                </p>
                <p className="text-xs text-grey-40 mt-[6px]">
                    {application?.specialApplication?.address}
                </p>
                <p className="text-xs text-grey-40 mt-[6px]"
                    //@ts-ignore
                   style={application?.withNds === true ? {color: 'green'} : {color: 'red'}}>
                    {
                        //@ts-ignore
                        `Налогообложение: ${application?.specialApplication?.withNds === true ? 'НДС' : 'Без НДС'}`
                    }</p>
                <p className="text-xs mt-[6px]">
                    <Rating
                        className="ml-2"
                        rating={
                            //@ts-ignore
                            application?.specialApplication?.companies[0].averageReviewRate}
                        total={
                            //@ts-ignore
                            application?.specialApplication?.companies[0].dealsCount || 0}
                    />
                </p>
            </div>
            <div
                onClick={() => removeSpecialApplicationHandler(application?.specialApplication?.id)}
                className="ml-8">
                <TrashIcon className="cursor-pointer" width={30} height={30}/>
            </div>
        </div>
    )
}