import {useGate, useStore} from "effector-react";
import {recyclablesApplicationsPricesModel} from '@box/entities/statistics';
import React, {useEffect, useState} from "react";
import {Loader, Running, TabSelectStatisticsRunningText} from "@box/shared/ui";
import {gate} from "@box/widgets/statistics/recyclables-applications-prices";
import Marquee from "react-fast-marquee";
import c from "@box/shared/ui/running/style.module.scss";
import {dealTypeSelectValues, TimeframeTypes} from "@box/entities/application";
import {useForm} from "@box/shared/effector-forms";
import {appFilters} from "@box/features/statistics/filters/recyclableApplicationPriceFilter/model";
import {AnimatePresence} from "motion/react"
import {getAllCompanyApplicationsLoading} from "./model/store";
import {useBoolean, useScreenSize, useWindowSize} from "@box/shared/hooks";
import {marketLinks} from "@box/widgets/header/lib";
import Link from "next/link";
import classNames from "classnames";
import {useRouter} from "next/router";


export const RunningText = () => {
    const {width, height} = useWindowSize();
    const [widthW, setWidthW] = useState(0);

    const [currentPanelWidth, setCurrentPanelWidth] = useState(0);
    const [load, setLoad] = useState(false);

    const router = useRouter();

    const [showMarket, setShowMarket] = useState<boolean>(false);

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const {fields} = useForm(appFilters);
    const [drop, setDrop] = useState(false)
    const [hiddenButton, setHiddenButton] = useState(false)
    const {value: menuOpened, toggle: toggleMenu} = useBoolean(false);
    //useGate(gate);
    useGate(gate)
    const recyclablesApplicationsPrices = useStore(recyclablesApplicationsPricesModel
        .$recyclablesApplicationsPrices);
    const loading = useStore(getAllCompanyApplicationsLoading.$loaderStore);


    //Нужно решить надо ли узнавать, когда прогрузилась вся страничка
    useEffect(() => {
        if (document.readyState === 'complete') {
            setLoad(true)
        }
    }, [load])


    useEffect(() => {
        if (menuOpened) {
            document.body.style.height = 'calc(var(--vh, 1vh) * 100)';
            document.body.style.overflowY = 'hidden';
            return;
        }
        document.body.style.height = 'auto';
        document.body.style.overflowY = 'auto';
    }, [menuOpened]);

    useEffect(() => {
        setCurrentPanelWidth(
            //@ts-ignore
            width >= 2560 ? Math.round(((100 - Math.round(((490 + 300) / width * 100))) - 11) / 100 * width) + Math.round(widthW) :
                //@ts-ignore
                width > 1176 && width < 2560 ? Math.round(((100 - (((490 + 300) / width) * 100)) - 11) / 100 * width) + widthW +
                    //@ts-ignore
                    kef((Math.round(((100 - (((490 + 300) / width) * 100)) - 11) * 10) + Math.round((widthW / width * 100) * 10)) / 10) : 100)
    }, [widthW, width, currentPanelWidth])


    const super_spec_kef = () => {
        //@ts-ignore
        const num = +(Math.round(((100 - (((490 + 300) / width) * 100)) - 11) * 10) + Math.round((widthW / width * 100) * 10)) / 10
        //@ts-ignore
        const decimal = num.toString().split('.')[1];

        //Для НЕДЕЛИ
        if (+num >= 30 && +num <= 40 && fields.period.value?.id === 1) {
            return +decimal === 1 ?
                0.028 : +decimal === 2 ?
                    0.027 : +decimal === 3 ?
                        0.023 : +decimal === 4 ?
                            0.02 : +decimal === 5 ?
                                0.018 : +decimal === 6 ?
                                    0.016 : +decimal === 7 ?
                                        0.012 : +decimal === 8 ?
                                            0.01 : +decimal === 9 ?
                                                0.01 : 0.027
        }
        if (+num >= 40 && +num <= 50 && fields.period.value?.id === 1) {
            return +decimal === 1 ?
                0.028 : +decimal === 2 ?
                    0.025 : +decimal === 3 ?
                        0.023 : +decimal === 4 ?
                            0.02 : +decimal === 5 ?
                                0.018 : +decimal === 6 ?
                                    0.016 : +decimal === 7 ?
                                        0.012 : +decimal === 8 ?
                                            0.01 : +decimal === 9 ?
                                                0.01 : 0.027
        }
        if (+num >= 57 && +num <= 60 && fields.period.value?.id === 1) {
            return +decimal === 1 ?
                0.024 : +decimal === 2 ?
                    0.019 : +decimal === 3 ?
                        0.012 : +decimal === 4 ?
                            0 : +decimal === 5 ?
                                0.008 : +decimal === 6 ?
                                    0.006 : +decimal === 7 ?
                                        -0.02 : +decimal === 8 ?
                                            -0.02 : +decimal === 9 ?
                                                -0.03 : 0.024
        }

        if (+num >= 50 && +num < 57 && fields.period.value?.id === 1) {
            return +decimal === 1 ?
                0.024 : +decimal === 2 ?
                    0.019 : +decimal === 3 ?
                        0.012 : +decimal === 4 ?
                            0.01 : +decimal === 5 ?
                                0.008 : +decimal === 6 ?
                                    0.006 : +decimal === 7 ?
                                        -0.01 : +decimal === 8 ?
                                            -0.01 : +decimal === 9 ?
                                                -0.01 : 0.024
        }


        if (+num >= 60 && +num <= 70 && fields.period.value?.id === 1) {
            return +decimal === 1 ?
                0.028 : +decimal === 2 ?
                    0.025 : +decimal === 3 ?
                        0.023 : +decimal === 4 ?
                            0.02 : +decimal === 5 ?
                                0.018 : +decimal === 6 ?
                                    0.006 : +decimal === 7 ?
                                        0.005 : +decimal === 8 ?
                                            0 : +decimal === 9 ?
                                                -0.004 : 0.03
        }
        //__________________________________________________________________________________

        //Для МЕСЯЦА
        if (+num >= 60 && +num <= 70 && fields.period.value?.id === 2) {
            return +decimal === 1 ?
                0.022 : +decimal === 2 ?
                    0.020 : +decimal === 3 ?
                        0.018 : +decimal === 4 ?
                            0.016 : +decimal === 5 ?
                                0.008 : +decimal === 6 ?
                                    0.009 : +decimal === 7 ?
                                        0.005 : +decimal === 8 ?
                                            0 : +decimal === 9 ?
                                                -0.002 : 0.03
        }

        if (+num >= 50 && +num < 60 && fields.period.value?.id === 2) {
            return +decimal === 1 ?
                0.015 : +decimal === 2 ?
                    0.014 : +decimal === 3 ?
                        0.009 : +decimal === 4 ?
                            0.007 : +decimal === 5 ?
                                0.005 : +decimal === 6 ?
                                    0.004 : +decimal === 7 ?
                                        -0.003 : +decimal === 8 ?
                                            -0.004 : +decimal === 9 ?
                                                -0.004 : 0.02
        }

        if (+num >= 40 && +num < 50 && fields.period.value?.id === 2) {
            return +decimal === 1 ?
                0.014 : +decimal === 2 ?
                    0.013 : +decimal === 3 ?
                        0.012 : +decimal === 4 ?
                            0.008 : +decimal === 5 ?
                                0.004 : +decimal === 6 ?
                                    0.004 : +decimal === 7 ?
                                        0.003 : +decimal === 8 ?
                                            0.0025 : +decimal === 9 ?
                                                0.001 : 0.017
        }
        //__________________________________________________________________________________

        //Для ГОДА
        if (+num >= 60 && +num <= 66 && fields.period.value?.id === 3) {
            return +decimal === 1 ?
                0.0205 : +decimal === 2 ?
                    0.0185 : +decimal === 3 ?
                        0.0155 : +decimal === 4 ?
                            0.0115 : +decimal === 5 ?
                                0.0105 : +decimal === 6 ?
                                    0.006 : +decimal === 7 ?
                                        0.0055 : +decimal === 8 ?
                                            0.002 : +decimal === 9 ?
                                                -0.0007 : 0.022
        }

        if (+num >= 66 && +num <= 70 && fields.period.value?.id === 3) {
            return +decimal === 1 ?
                0.027 : +decimal === 2 ?
                    0.025 : +decimal === 3 ?
                        0.023 : +decimal === 4 ?
                            0.016 : +decimal === 5 ?
                                0.015 : +decimal === 6 ?
                                    0.012 : +decimal === 7 ?
                                        0.01 : +decimal === 8 ?
                                            0.006 : +decimal === 9 ?
                                                0 : 0.027
        }

        if (+num >= 50 && +num < 60 && fields.period.value?.id === 3) {
            return +decimal === 1 ?
                0.009 : +decimal === 2 ?
                    0.008 : +decimal === 3 ?
                        0.006 : +decimal === 4 ?
                            0.003 : +decimal === 5 ?
                                0.002 : +decimal === 6 ?
                                    0.001 : +decimal === 7 ?
                                        0 : +decimal === 8 ?
                                            -0.0005 : +decimal === 9 ?
                                                -0.002 : 0.012
        }

        return decimal

    }

    const kef = (someWidth: number) => {
        let k: number


        if (fields.period.value?.id === 4) {
            //@ts-ignore
            return widthW / width * 100
        }

        const resizes = [2176, 1969, 1920, 1707, 1680, 1600, 1506, 1440, 1366]

        //Для стандартных разрешений
        for (let i = 0; i < resizes.length; ++i) {
            if (width === 2176) {
                k = fields.period.value?.id === 1 ? widthW * 0.285 :
                    fields.period.value?.id === 2 ? widthW * 0.143 :
                        fields.period.value?.id === 3 ? widthW * 0.1 :
                            widthW
                return k
            }
            if (width === 1969) {
                k = fields.period.value?.id === 1 ? widthW * 0.46 :
                    fields.period.value?.id === 2 ? widthW * 0.234 :
                        fields.period.value?.id === 3 ? widthW * 0.169 :
                            widthW
                return k
            }
            if (width === 1920) {
                k = fields.period.value?.id === 1 ? widthW * 0.5 :
                    fields.period.value?.id === 2 ? widthW * 0.249 :
                        fields.period.value?.id === 3 ? widthW * 0.179 :
                            widthW
                return k
            }
            if (width === 1707) {
                k = fields.period.value?.id === 1 ? widthW * 0.67 :
                    fields.period.value?.id === 2 ? widthW * 0.345 :
                        fields.period.value?.id === 3 ? widthW * 0.245 :
                            widthW
                return k
            }
            if (width === 1680) {
                k = fields.period.value?.id === 1 ? widthW * 0.703 :
                    fields.period.value?.id === 2 ? widthW * 0.355 :
                        fields.period.value?.id === 3 ? widthW * 0.256 :
                            widthW
                return k
            }
            if (width === 1600) {
                k = fields.period.value?.id === 1 ? widthW * 0.758 :
                    fields.period.value?.id === 2 ? widthW * 0.389 :
                        fields.period.value?.id === 3 ? widthW * 0.279 :
                            widthW
                return k
            }
            if (width === 1536) {
                k = fields.period.value?.id === 1 ? widthW * 0.828 :
                    fields.period.value?.id === 2 ? widthW * 0.418 :
                        fields.period.value?.id === 3 ? widthW * 0.298 :
                            widthW
                return k
            }
            if (width === 1506) {
                k = fields.period.value?.id === 1 ? widthW * 0.85 :
                    fields.period.value?.id === 2 ? widthW * 0.43 :
                        fields.period.value?.id === 3 ? widthW * 0.305 :
                            widthW
                return k
            }
            if (width === 1440) {
                k = fields.period.value?.id === 1 ? widthW * 0.89 :
                    fields.period.value?.id === 2 ? widthW * 0.457 :
                        fields.period.value?.id === 3 ? widthW * 0.324 :
                            widthW
                return k
            }
            if (width === 1366) {
                k = fields.period.value?.id === 1 ? widthW * 0.962 :
                    fields.period.value?.id === 2 ? widthW * 0.485 :
                        fields.period.value?.id === 3 ? widthW * 0.347 :
                            widthW
                return k
            }
            if (width === 1360) {
                k = fields.period.value?.id === 1 ? widthW * 0.962 :
                    fields.period.value?.id === 2 ? widthW * 0.485 :
                        fields.period.value?.id === 3 ? widthW * 0.354 :
                            widthW
                return k
            }
            if (width === 1280) {
                k = fields.period.value?.id === 1 ? widthW * 1.041 :
                    fields.period.value?.id === 2 ? widthW * 0.531 :
                        fields.period.value?.id === 3 ? widthW * 0.375 :
                            widthW
                return k
            }
            if (width === 1176) {
                k = fields.period.value?.id === 1 ? widthW * 1.128 :
                    fields.period.value?.id === 2 ? widthW * 0.57 :
                        fields.period.value?.id === 3 ? widthW * 0.407 :
                            widthW
                return k
            }
        }

        if (someWidth >= 60 && someWidth < 70) {
            //готово!
            if (fields.period.value?.id === 1) {
                k = someWidth >= 60 && someWidth < 61 ?
                    widthW * (0.16 + +super_spec_kef()) : widthW //0.17
                return k
            }
            if (fields.period.value?.id === 2) {
                //готово!
                k = someWidth >= 66 && someWidth < 67 ?
                    widthW * (0.088 + +super_spec_kef()) : someWidth >= 65 && someWidth < 66 ?
                        widthW * (0.076 + +super_spec_kef()) : someWidth >= 64 && someWidth < 65 ? //0.1
                            widthW * (0.116 + +super_spec_kef()) : someWidth >= 63 && someWidth < 64 ? //0.124
                                widthW * (0.152 + +super_spec_kef()) : someWidth >= 62 && someWidth < 63 ?
                                    widthW * (0.188 + +super_spec_kef()) : someWidth >= 61 && someWidth < 62 ?
                                        widthW * (0.218 + +super_spec_kef()) : someWidth >= 60 && someWidth < 61 ?
                                            widthW * (0.249 + +super_spec_kef()) : widthW
                return k
            }
            if (fields.period.value?.id === 3) {
                //готово!
                k = someWidth >= 69 && someWidth < 70 ?
                    widthW * (0.0619 + +super_spec_kef()) : someWidth >= 68 && someWidth < 69 ?
                        widthW * (0.098 + +super_spec_kef()) : someWidth >= 67 && someWidth < 68 ?
                            widthW * (0.128 + +super_spec_kef()) : someWidth >= 66 && someWidth < 67 ?
                                widthW * (0.15 + +super_spec_kef()) : someWidth >= 65 && someWidth < 66 ?
                                    widthW * (0.181 + +super_spec_kef()) : someWidth >= 64 && someWidth < 65 ?
                                        widthW * (0.206 + +super_spec_kef()) : someWidth >= 63 && someWidth < 64 ?
                                            widthW * (0.227 + +super_spec_kef()) : someWidth >= 62 && someWidth < 63 ?
                                                widthW * (0.246 + +super_spec_kef()) : someWidth >= 61 && someWidth < 62 ?
                                                    widthW * (0.265 + +super_spec_kef()) : someWidth >= 60 && someWidth < 61 ?
                                                        widthW * (0.281 + +super_spec_kef()) : widthW
                return k
            }
        }
        if (someWidth >= 50 && someWidth < 60) {
            if (fields.period.value?.id === 1) {
                //готово!
                k = someWidth >= 59 && someWidth < 60 ?
                    widthW * (0.235 + +super_spec_kef()) : someWidth >= 58 && someWidth < 59 ? //0.256
                        widthW * (0.284 + +super_spec_kef()) : someWidth >= 57 && someWidth < 58 ? //0.3
                            widthW * (0.349 + +super_spec_kef()) : someWidth >= 56 && someWidth < 57 ? //0.351
                                widthW * (0.39 + +super_spec_kef()) : someWidth >= 55 && someWidth < 56 ?
                                    widthW * (0.441 + +super_spec_kef()) : someWidth >= 54 && someWidth < 55 ?
                                        widthW * (0.487 + +super_spec_kef()) : someWidth >= 53 && someWidth < 54 ? //0.463
                                            widthW * (0.54 + +super_spec_kef()) : someWidth >= 52 && someWidth < 53 ? //0.555
                                                widthW * (0.58 + +super_spec_kef()) : someWidth >= 51 && someWidth < 52 ? //0.589
                                                    widthW * (0.62 + +super_spec_kef()) : someWidth >= 50 && someWidth < 51 ? //0.62
                                                        widthW * (0.657 + +super_spec_kef()) : widthW //0.657
                return k
            }
            if (fields.period.value?.id === 2) {
                //готово!
                k = someWidth >= 59 && someWidth < 60 ?
                    widthW * (0.285 + +super_spec_kef()) : someWidth >= 58 && someWidth < 59 ?
                        widthW * (0.31 + +super_spec_kef()) : someWidth >= 57 && someWidth < 58 ?
                            widthW * (0.33 + +super_spec_kef()) : someWidth >= 56 && someWidth < 57 ?
                                widthW * (0.355 + +super_spec_kef()) : someWidth >= 55 && someWidth < 56 ?
                                    widthW * (0.3765 + +super_spec_kef()) : someWidth >= 54 && someWidth < 55 ?
                                        widthW * (0.395 + +super_spec_kef()) : someWidth >= 53 && someWidth < 54 ?
                                            widthW * (0.415 + +super_spec_kef()) : someWidth >= 52 && someWidth < 53 ?
                                                widthW * (0.432 + +super_spec_kef()) : someWidth >= 51 && someWidth < 52 ?
                                                    widthW * (0.449 + +super_spec_kef()) : someWidth >= 50 && someWidth < 51 ?
                                                        widthW * (0.468 + +super_spec_kef()) : widthW
                return k
            }
            if (fields.period.value?.id === 3) {
                //готово!
                k = someWidth >= 59 && someWidth < 60 ?
                    widthW * (0.304 + +super_spec_kef()) : someWidth >= 58 && someWidth < 59 ?
                        widthW * (0.32 + +super_spec_kef()) : someWidth >= 57 && someWidth < 58 ?
                            widthW * (0.332 + +super_spec_kef()) : someWidth >= 56 && someWidth < 57 ?
                                widthW * (0.348 + +super_spec_kef()) : someWidth >= 55 && someWidth < 56 ?
                                    widthW * (0.358 + +super_spec_kef()) : someWidth >= 54 && someWidth < 55 ?
                                        widthW * (0.37 + +super_spec_kef()) : someWidth >= 53 && someWidth < 54 ?
                                            widthW * (0.382 + +super_spec_kef()) : someWidth >= 52 && someWidth < 53 ?
                                                widthW * (0.392 + +super_spec_kef()) : someWidth >= 51 && someWidth < 52 ?
                                                    widthW * (0.402 + +super_spec_kef()) : someWidth >= 50 && someWidth < 51 ?
                                                        widthW * (0.412 + +super_spec_kef()) : widthW
                return k
            }
        }
        if (someWidth >= 40 && someWidth < 50) {
            if (fields.period.value?.id === 1) {
                //готово!
                k = someWidth >= 49 && someWidth < 50 ?
                    widthW * (0.68 + +super_spec_kef()) : someWidth >= 48 && someWidth < 49 ?
                        widthW * (0.71 + +super_spec_kef()) : someWidth >= 47 && someWidth < 48 ? //0.745
                            widthW * (0.75 + +super_spec_kef()) : someWidth >= 46 && someWidth < 47 ? //0.77
                                widthW * (0.77 + +super_spec_kef()) : someWidth >= 45 && someWidth < 46 ? //0.805
                                    widthW * (0.81 + +super_spec_kef()) : someWidth >= 44 && someWidth < 45 ? //0.837
                                        widthW * (0.84 + +super_spec_kef()) : someWidth >= 43 && someWidth < 44 ? //0.85
                                            widthW * (0.865 + +super_spec_kef()) : someWidth >= 42 && someWidth < 43 ? //0.89
                                                widthW * (0.89 + +super_spec_kef()) : someWidth >= 41 && someWidth < 42 ? //0.919
                                                    widthW * (0.915 + +super_spec_kef()) : someWidth >= 40 && someWidth < 41 ? //0.936
                                                        widthW * (0.945 + +super_spec_kef()) :  //0.967
                                                        widthW
                return k
            }
            if (fields.period.value?.id === 2) {
                //готово!
                k = someWidth >= 49 && someWidth < 50 ?
                    widthW * (0.48 + +super_spec_kef()) : someWidth >= 48 && someWidth < 49 ?
                        widthW * (0.495 + +super_spec_kef()) : someWidth >= 47 && someWidth < 48 ?
                            widthW * (0.507 + +super_spec_kef()) : someWidth >= 46 && someWidth < 47 ?
                                widthW * (0.519 + +super_spec_kef()) : someWidth >= 45 && someWidth < 46 ?
                                    widthW * (0.534 + +super_spec_kef()) : someWidth >= 44 && someWidth < 45 ?
                                        widthW * (0.542 + +super_spec_kef()) : someWidth >= 43 && someWidth < 44 ?
                                            widthW * (0.557 + +super_spec_kef()) : someWidth >= 42 && someWidth < 43 ?
                                                widthW * (0.567 + +super_spec_kef()) : someWidth >= 41 && someWidth < 42 ?
                                                    widthW * (0.579 + +super_spec_kef()) : someWidth >= 40 && someWidth < 41 ?
                                                        widthW * (0.588 + +super_spec_kef()) : widthW
                return k
            }
        }
        if (someWidth >= 30 && someWidth < 40) {
            if (fields.period.value?.id === 1) {
                k = someWidth >= 39 && someWidth < 40 ?
                    widthW * (0.965 + +super_spec_kef()) : someWidth >= 38 && someWidth < 39 ?
                        widthW * (0.985 + +super_spec_kef()) : someWidth >= 37 && someWidth < 38 ?
                            widthW * (1 + +super_spec_kef()) : someWidth >= 36 && someWidth < 37 ?
                                widthW * (1.03 + +super_spec_kef()) : someWidth >= 35 && someWidth < 36 ?
                                    widthW * (1.0485 + +super_spec_kef()) : someWidth >= 34 && someWidth < 35 ?
                                        widthW * (1.068 + +super_spec_kef()) : someWidth >= 33 && someWidth < 34 ?
                                            widthW * (1.083 + +super_spec_kef()) : someWidth >= 32 && someWidth < 33 ?
                                                widthW * (1.099 + +super_spec_kef()) : someWidth >= 31 && someWidth < 32 ?
                                                    widthW * (1.125 + +super_spec_kef()) : someWidth >= 30 && someWidth < 31 ?
                                                        widthW * (1.132 + +super_spec_kef())
                                                        : widthW
                return k
            }
        }

    }

    if (loading) {
        return <Loader center className="my-[50px]"/>;
    }
    return (
        <div className={c.container} onMouseEnter={() => setHiddenButton(true)}
             onMouseLeave={() => setHiddenButton(false)}>
            {!isMobile && <span className={c.date}>
            <TabSelectStatisticsRunningText
                propWidth={(width: number): number => {
                    setWidthW(width)
                    return widthW
                }}
                onChange={fields.deal_type.onChange}
                values={dealTypeSelectValues}
                value={fields.deal_type.value}
            />
            </span>}

            <AnimatePresence>
                {!drop &&
                    <div className={c.string} onClick={() => setDrop(true)} style={{
                        height: '36px',
                        //@ts-ignore
                        width: `${width >= 2166 ? Math.round(((100 - Math.round(((490 + 300) / width * 100))) - 11) / 100 * width) + Math.round(widthW) :
                            //@ts-ignore
                            width >= 1176 ? Math.round(((100 - (((490 + 300) / width) * 100)) - 11) / 100 * width) + widthW : 100//+
                            //@ts-ignore
                        }${width >= 1176 ? 'px' : '%'}`,
                        //@ts-ignore
                        left: `${width >= 1450 && width <= 2560 ? 16 : width < 1450 && width >= 1176 ? 16 + (10 * currentPanelWidth / width) : 0}%`
                    }}>
                        <Marquee direction={"left"} speed={30} loop={0} pauseOnHover={!drop} style={{top: '5px'}}>
                            {
                                recyclablesApplicationsPrices.sort(function (a, b) {
                                    return (a.category - b.category)
                                }).map((recyclable) =>
                                    <Running recyclableApplicationPriceData={recyclable}/>
                                )
                            }
                        </Marquee>

                        {
                            //@ts-ignore
                            width < 1176 && <button className={c.arrow_button_string}
                                //@ts-ignore
                                                    style={width >= 1176 ? {left: `${50 - (15 / currentPanelWidth * 100) + 2}%`} : {}}
                                                    onClick={() => setDrop(!drop)}>
                            </button>
                        }
                    </div>}
            </AnimatePresence>

            {!isMobile && <span className={c.date_1}>
            <TabSelectStatisticsRunningText
                propWidth={(width: number): number => {
                    setWidthW(width)
                    return widthW
                }}
                onChange={fields.period.onChange}
                values={TimeframeTypes}
                value={fields.period.value}
            />
            </span>}
            {!isMobile && <div className={!showMarket ? c.market : c.market_open}
            >
                {showMarket && <p
                    className='text-sm font-medium'
                    style={{
                        color: 'rgba(67, 158, 126)',
                        cursor: 'pointer'
                    }}
                    onClick={() => setShowMarket(false)}
                >Скрыть</p>}
                {showMarket ? marketLinks.map((link) => (
                        <div
                            key={link.id}
                            style={{
                                color: 'white',
                                padding: '5px 0 5px 0'
                            }}
                            className="">
                            <Link href={link.href}>
                                <p
                                    className={classNames('text-sm font-medium', {'text-grey-40': router.asPath === link.href})}
                                    style={{marginTop: '6px'}}>{link.title}</p>
                            </Link>
                        </div>
                    )) :
                    <div style={{
                        borderRadius: '5px',
                        borderWidth: '1px',
                        borderColor: 'white',
                        padding: '4px, 4px, 4px, 4px'
                    }}
                         onClick={() => setShowMarket(true)}
                    >
                        ВторПрайсМаг
                    </div>
                }
            </div>}
        </div>
    )
}

