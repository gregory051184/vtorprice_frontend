import React, {useEffect} from "react";
import {ISubscribe} from "@box/entities/subscribe";
import {useRouter} from "next/router";

interface ISubscribeInfo {
    subscribe: ISubscribe
}

export const SubscribeInfo: React.FC<ISubscribeInfo> = ({subscribe}) => {

    const [showDescription, setShowDescription] = React.useState(false);

    const router = useRouter();

    useEffect(() => {

    }, [showDescription]);

    return (
        <div
            style={{
                borderRadius: '10px',
                borderWidth: '1px',
                padding: '10px 10px 10px 10px',
                marginTop: '20px',
                borderColor: "rgb(193, 198, 199, 0.3)"
            }}
            onClick={() => router.push('/subscribes')}>
            <h3 style={{fontWeight: 'bold'}}>Ваша подписка</h3>
            <div style={{marginTop: '20px', display: 'inline-flex'}}>
                <div>
                    <p>{subscribe?.subscribe?.name}</p>
                    {showDescription &&
                        <div
                            onClick={() => setShowDescription(false)}
                            style={{
                                padding: '10px 10px 10px 10px',
                                zIndex: 25,
                                color: 'white',
                                cursor: 'pointer',
                                backgroundColor: 'rgb(193, 198, 199, 1)',
                                marginTop: '5px',
                                borderRadius: '5px',
                            }}
                        >
                            <p>{subscribe?.subscribe.description}</p>
                        </div>}
                    {!showDescription && <div
                            style={{
                                padding: '5px 5px 5px 5px',
                                color: 'white',
                                cursor: 'pointer',
                                backgroundColor: 'rgba(67, 158, 126)',
                                marginTop: '5px',
                                borderRadius: '5px',
                            }}
                            onClick={() => setShowDescription(true)}
                        >
                            <p>Описание...</p>
                        </div>}


                    <p style={{marginTop: '5px'}}>
                        {//@ts-ignore
                            `${new Date(subscribe?.timeBegin).toLocaleDateString()}` + ' ' + '-' + ' ' + `${new Date(subscribe?.timeEnd).toLocaleDateString()}`
                        }
                    </p>
                </div>
                <div style={{marginLeft: '22vw'}}>
                    <p style={{fontSize: '24px', color: 'rgba(67, 158, 126)'}}>{`${subscribe?.subscribe?.price} ₽`}</p>
                </div>
            </div>
        </div>
    )
}