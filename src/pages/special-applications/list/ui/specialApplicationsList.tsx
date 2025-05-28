import {BackButton, Container, Rating, Table} from "@box/shared/ui";
import React from "react";
import {useStore} from "effector-react";
import {
    $specialApplications,
    SpecialApplicationRows
} from "@box/entities/special-application";
import {useScreenSize} from "@box/shared/hooks";
import {$authStore} from "@box/entities/auth";
import {useRouter} from "next/router";


export const SpecialApplicationsList = () => {
    const applications = useStore($specialApplications);
    const auth = useStore($authStore);
    const [screenSize, satisfies] = useScreenSize();
    const router = useRouter();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    return (

        <Container className="mt-[28px]">
            <BackButton/>
            {(!isLaptop && !isMobile) &&
                <Table>
                    <div className="inline-flex">
                        <div>
                            {
                                //@ts-ignore
                                applications.filter(app => app.specialApplication.companies[0].id === auth.user?.company?.id && !app.specialApplication.isDeleted).map(application => (
                                <SpecialApplicationRows application={application} key={application.id} />))}
                        </div>
                    </div>
                </Table>}

            {(isLaptop && !isMobile) &&
                <div className="mt-6">
                    <div className={isLaptop ? "inline-flex ml-28" : "inline-flex"}>
                        <div>
                            {applications
                                //@ts-ignore
                                .filter(app => app.specialApplication.companies[0].id === auth.user?.company?.id)
                                .map((application) => (
                                    <div key={application.id} className={isLaptop ? "mt-6 ml-30" : "mt-6"}>
                                        <div>
                                            <div
                                                onClick={() => router.push(`/profile/special-applications/${application.id}}`)}>
                                                <img
                                                    className={"rounded-[10px] w-[400px] h-[250px] object-cover cursor-pointer"}
                                                    src={
                                                        application?.specialApplication?.images[0] ? application?.specialApplication?.images[0].image
                                                            : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="cursor-pointer w-3/4"
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
                                               style={application?.specialApplication?.withNds === true ? {color: 'green'} : {color: 'red'}}>
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

                                    </div>
                                ))}
                        </div>
                    </div>
                </div>}

            {(isMobile && !isLaptop) &&
                <div className="mt-6">
                    <div className="inline-flex">
                        <div>
                            {applications
                                //@ts-ignore
                                .filter(app => app.specialApplication.companies[0].id === auth.user?.company?.id)
                                .map((application) => (
                                    <div key={application.id} className={"mt-6"}>
                                        <div>
                                            <div
                                                onClick={() => router.push(`/profile/special-applications/${application.id}}`)}>
                                                <img
                                                    className="rounded-[10px] w-full h-[250px] object-cover cursor-pointer"
                                                    src={
                                                        application?.specialApplication?.images[0] ? application?.specialApplication?.images[0].image
                                                            : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="cursor-pointer mt-5 w-full"
                                            onClick={() => router.push(`/profile/special-applications/${application.id}}`)}>
                                            {application?.specialApplication?.price}
                                            {' '}
                                            ₽
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

                                    </div>
                                ))}
                        </div>
                    </div>
                </div>}
        </Container>

    )
}