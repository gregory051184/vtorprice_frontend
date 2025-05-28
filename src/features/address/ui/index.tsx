import { FC, useState } from "react";
import { Clusterer, Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { YMapsApi } from "@pbe/react-yandex-maps/typings/util/typing";
import s from "./style.module.scss";

const Address: FC<{latitude: number, longitude: number}> = ({ longitude, latitude }) => {
  const [apiInstance, setApiInstance] = useState<YMapsApi | null>(null);

  return  (
    <div className={s.mapBox}>
      <div className={s.map}>
        <YMaps>
          <Map
            instanceRef={(map) => {
              map?.events.add("mousedown", function (e) {
                if (e.get("altKey") && apiInstance) {
                  apiInstance.modules.require(["ext.paintOnMap"]);
                }
              });
            }}
            onLoad={(yamaps) => {
              yamaps.modules.define("ext.paintOnMap", () => {
                console.log("hello");
              });
              setApiInstance(yamaps);
            }}
            defaultState={{ center: [latitude, longitude], zoom: 18 }}
            width="100%"
            height="100%"
          >
            <Clusterer
              options={{
                groupByCoordinates: false,
                clusterDisableClickZoom: true,
                clusterHideIconOnBalloonOpen: false,
                geoObjectHideIconOnBalloonOpen: false,
                preset: "islands#circleIcon",
                clusterIconColor: "#399977",
              }}
            >
              <Placemark
                geometry={[latitude, longitude]}
                options={{
                  preset: "islands#circleIcon",
                  iconColor: "#399977",
                }}
                properties={{
                  iconCaption: 'Втор Прайс'
                }}
              />
            </Clusterer>
          </Map>
        </YMaps>
      </div>
    </div>
  )
}

export { Address }
