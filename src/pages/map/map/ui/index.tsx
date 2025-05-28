import React, {useEffect, useRef, useState} from "react";
import {useEvent, useGate, useStore, useUnit} from "effector-react";
import Head from "next/head";
import {useRouter} from "next/router";

import {AppShell} from "@box/layouts";
import {Map, YMaps, Placemark, Clusterer, Polygon} from "@pbe/react-yandex-maps";
import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import {BackButton, Button, Container} from "@box/shared/ui";
import {MapApplicationFilters} from "@box/features/map";
import {InfoAboutApplications} from "@box/features/map/info";
import {
    $applications,
    $infoAboutCity,
    $seachApplication,
    clearApplicationInList,
    findApplicationInList,
    gate,
} from "../model";
import {ApplicationInfo} from "@box/features/map/applicationInfo/ui";
import {NotAuthAlert} from "@box/entities/notAuthAlert/ui";

import s from "./style.module.scss";
import ymaps from "yandex-maps";
import classNames from "classnames";
import Script from "next/script";
import Lasso from "@assets/icons/16_lasso.svg";
import {useScreenSize} from "@box/shared/hooks";
import dynamic from "next/dynamic";
import {setShowSubscribeModalFX, subscribeLevels} from "@box/widgets/subscribeModal";

const DynamicSpecialMap = dynamic(
    () => import('./specialMap').then(module => module.SpecialMap),
    {ssr: false}
)

export type ApplicationCoordinate = {
    coordinates: [number, number];
    id: number;
};

export const Maps = () => {
    useGate(gate);

    const setShowSubscribeFx = useEvent(setShowSubscribeModalFX)

    const applications = useStore($applications);
    const seachApplications = useStore($seachApplication);
    const infoAboutSearchCity = useStore($infoAboutCity);
    const findApplications = useUnit(findApplicationInList);
    const clearSeachApplication = useUnit(clearApplicationInList);
    const [clicked, setClicked] = useState(false);
    const [center, setCenter] = useState([55.75, 37.76]);
    const [zoom, setZoom] = useState(9);
    const [polygonCoordinates, setPolygonCoordinates] = useState([]);
    const [isPolygonVisible, setIsPolygonVisible] = useState(false);
    const [screenSize] = useScreenSize();

    const isMobile = screenSize === 'xxsm';

    const handleClick = () => {
        setCenter(mapRef.current?.getCenter() || [55.75, 37.76]);
        setZoom(mapRef.current?.getZoom() || 9);
        setClicked(true);
        if (isPolygonVisible) {
            setIsPolygonVisible(false);
        }
    };

    const cbCloseIconOnClickHandle = () => {
        clearSeachApplication();
        setIsPolygonVisible(false);
    }

    const mapRef = useRef<ymaps.Map | null>(null);
    const refClusterer = useRef<ymaps.Clusterer | null>(null);
    const router = useRouter();

    const application = router.query;
    const centerCityDeo = infoAboutSearchCity
        ? [infoAboutSearchCity.longitude, infoAboutSearchCity.latitude]
        : undefined;

    const onClickOnItem = (isEquipment: boolean, id: number) => {
        if (isEquipment) {
            router.push(`equipment-applications/${id}`);
            return;
        }
        router.push(`applications/${id}`);
    };

    useEffect(() => {
        setShowSubscribeFx(subscribeLevels.ABSOLUTE);
    }, []);

    useEffect(() => {
        if (refClusterer.current) {
            refClusterer.current.events.add("click", (e) => {
                //@ts-ignore
                const geoObjects = e.get("target").properties.get("geoObjects");
                const placemarkets =
                    geoObjects &&
                    geoObjects.map((item: any) => {
                        const placemarketId = item.properties._data.applicationId;
                        return placemarketId;
                    });
                placemarkets && findApplications(placemarkets as Array<number>);
            });
        }
    }, [refClusterer.current]);

    useEffect(() => {
        if (mapRef.current && centerCityDeo) {
            mapRef.current.setCenter(centerCityDeo);
        }
    }, [infoAboutSearchCity]);

    return (
        <AppShell header={<Header/>} footer={<Footer/>}>
            <Head>
                <title>Карта заявок</title>
            </Head>
            <Container className={classNames("mb-7", s.container, "flex justify-between items-end")}>
                <div>
                    <BackButton/>
                    <h1 className="font-medium width text-2xl mt-2">Карта заявок</h1>
                </div>
                <div>
                    {!isMobile &&
                        <Button iconLeft={<Lasso/>} className={`h-[56px]`} mode="stroke" onClick={handleClick}>Выделить
                            область</Button>}
                </div>
            </Container>
            <Script src="https://api-maps.yandex.ru/2.1/?apikey=9d2b05b3-6950-4049-9a4e-730cb31ec2f6&lang=ru_RU"
                    type="text/javascript"></Script>

            <div className={s.mapBox}>
                <div className={s.map}>
                    <YMaps>
                        <Map
                            instanceRef={(map) => {
                                mapRef.current = map;
                            }}
                            defaultState={{
                                center: application?.showSingleMark
                                    ? [
                                        parseFloat(application?.latitude as string),
                                        parseFloat(application?.longitude as string),
                                    ]
                                    : [55.75, 37.76],
                                zoom: 9,
                            }}
                            width="100%"
                            height="100%"
                        >

                            {isPolygonVisible && <Polygon
                                geometry={[

                                    polygonCoordinates

                                ]}
                                options={{
                                    fillColor: "#39997777",
                                    strokeColor: "#399977",
                                    opacity: 1,
                                    strokeWidth: 3,
                                    strokeStyle: "shortdash",
                                }}
                            />}

                            <Clusterer
                                options={{
                                    groupByCoordinates: false,
                                    clusterDisableClickZoom: true,
                                    clusterHideIconOnBalloonOpen: false,
                                    geoObjectHideIconOnBalloonOpen: false,
                                    preset: "islands#circleIcon",
                                    clusterIconColor: "#399977",
                                }}
                                instanceRef={(ref: ymaps.Clusterer) => {
                                    refClusterer.current = ref;
                                }}
                            >
                                {applications &&
                                    !application?.showSingleMark &&
                                    applications.map((application) => {
                                        if (application.latitude && application.longitude) {
                                            return (
                                                <Placemark
                                                    key={application.id}
                                                    onClick={() => {
                                                        findApplications([application.id]);
                                                    }}
                                                    geometry={[
                                                        application.latitude,
                                                        application.longitude,
                                                    ]}
                                                    options={{
                                                        preset: "islands#circleIcon",
                                                        iconColor: "#399977",
                                                    }}
                                                    properties={{
                                                        applicationId: application.id,
                                                        iconContent: 1,
                                                    }}
                                                />
                                            );
                                        }
                                        return null;
                                    })}

                                {application?.showSingleMark &&
                                    application?.latitude &&
                                    application?.longitude && (
                                        <Placemark
                                            geometry={[application?.latitude, application?.longitude]}
                                            options={{
                                                preset: "islands#circleIcon",
                                                iconColor: "#399977",
                                            }}
                                            properties={{
                                                iconContent: 1,
                                            }}
                                        />
                                    )}
                            </Clusterer>
                        </Map>
                    </YMaps>
                </div>
                <DynamicSpecialMap
                    center={center}
                    zoom={zoom}
                    clicked={clicked}
                    setClicked={setClicked}
                    setPolygonCoordinates={setPolygonCoordinates}
                    setIsPolygonVisible={setIsPolygonVisible}
                    findApplications={findApplications}
                    applications={applications}
                    mobile={isMobile}
                />
                {isMobile &&
                    <Button iconLeft={<Lasso/>} className={`m-auto w-full`} mode="stroke" onClick={handleClick}>Выделить
                        область</Button>}
                {!application?.showSingleMark && (
                    <InfoAboutApplications
                        className={s.infoBox}
                        onClickOnItem={onClickOnItem}
                        applications={seachApplications}
                        cbCloseIconOnClick={cbCloseIconOnClickHandle}
                    />
                )}
                {!application?.showSingleMark && (
                    <MapApplicationFilters className={s.filterBox}/>
                )}
                {application?.showSingleMark && (
                    <ApplicationInfo
                        application={application}
                        className={s.applicationInfoBox}
                    />
                )}
            </div>

            <NotAuthAlert/>
        </AppShell>
    );
};
