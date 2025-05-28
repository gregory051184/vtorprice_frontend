import { useEffect, useState } from "react";
import s from "./style.module.scss";
import { ApplicationCoordinate } from ".";

function isPointInsidePolygon(point: Array<number>, polygon: Array<Array<number>>) {
    const x = point[0];
    const y = point[1];
  
    let isInside = false;
  
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];
  
      const intersect =
        yi > y !== yj > y &&
        x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
  
      if (intersect) {
        isInside = !isInside;
      }
    }
  
    return isInside;
}


function sortPointsInsidePolygon(points: ApplicationCoordinate[], polygon: Array<Array<number>>) {
    const pointsInsidePolygon = [];
    for (const point of points) {
        if (isPointInsidePolygon(point.coordinates, polygon)) {
        pointsInsidePolygon.push(point);
        }
    }
    return pointsInsidePolygon
}

export function loadYandexMapsScript(center: any, zoom: any, mapExists: any, setMapExists: any, clicked: any, setClicked: any, setPolygonCoordinates: any, setIsPolygonVisible: any, findApplications: any, applications: any, mobile: any) {
    if (!mapExists && clicked) {
        try {
        ymaps.modules.define('ext.paintOnMap', ['meta', 'util.extend', 'pane.EventsPane', 'Event'], function (provide: any, meta: any, extend: any, EventsPane: any, Event: any) {
            'use strict';

            // zIndex пейна событий карты по умолчанию равен 500.
            // Подробней в документации: https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/map.pane.Manager-docpage/
            var EVENTS_PANE_ZINDEX = 500;

            var DEFAULT_UNWANTED_BEHAVIORS = ['drag', 'scrollZoom'];
            var DEFAULT_STYLE = {strokeColor: '#0000ff', strokeWidth: 1, strokeOpacity: 1};
            var DEFAULT_TOLERANCE = 16;

            var badFinishPaintingCall = function () {
                throw new Error('(ymaps.ext.paintOnMap) некорректный вызов PaintingProcess#finishPaintingAt. Рисование уже завершено.');
            };

            /**
             * @interface ymaps.ext.paintOnMap.PaintingProcess
             */

            /**
             * Отключает режим рисования.
             * @function
             * @name ymaps.ext.paintOnMap.PaintingProcess#finishPaintingAt
             * @param {Number[]|ymaps.Event} [positionOrEvent] Координаты точки, в которой рисование должно закончиться.
             * Координаты задаются в пикселях относительно верхнего левого угла карты.
             * @return {Number[]} Координаты.
             */

            /**
             * Включает режим рисования.
             * @name ymaps.ext.paintOnMap
             * @param {ymaps.Map} map
             * @param {Number[]|ymaps.Event} [positionOrEvent] Координаты точки, в которой рисование должно закончиться.
             * Координаты задаются в пикселях относительно верхнего левого угла карты.
             * @param {Object} [config]
             * @param {String[]|null} [config.unwantedBehaviors] Список поведений карты, которые должны быть выключены во время
             * рисования. Перетаскивание карты и её масштабирование колесом мыши выключены по умолчанию.
             * @param {Object} [config.style] Стили такие же, как в ymaps.Polygon или ymaps.Polyline.
             * @param {String} [config.style.strokeColor='#0000ff'] Цвет линии или обводки.
             * @param {Number} [config.style.strokeWidth=1] Толщина линии или обводки.
             * @param {Number} [config.style.strokeOpacity=1] Прозрачность линии или обводки.
             * @param {Number} [config.tolerance=16] Уровень упрощения координат в пикселях.
             * @returns {ymaps.ext.paintOnMap.PaintingProcess} Процесс рисования.
             */
            function paintOnMap(map: any, positionOrEvent: any, config: any, mobile: any) {
                    config = config || {};                   
                    var style = extend(DEFAULT_STYLE, config.style || {});

                    var unwantedBehaviors = config.unwantedBehaviors === undefined ?
                        DEFAULT_UNWANTED_BEHAVIORS : config.unwantedBehaviors;

                    var pane = new EventsPane(map, {
                        css: {position: 'absolute', width: '100%', height: '100%'},
                        zIndex: EVENTS_PANE_ZINDEX + 50,
                        transparent: true
                    });

                    map.panes.append('ext-paint-on-map', pane);

                    if (unwantedBehaviors) {
                        map.behaviors.disable(unwantedBehaviors);
                    }

                    // Создаём canvas-элемент.
                    var canvas = document.createElement('canvas');
                    var ctx2d = canvas.getContext('2d');
                    var rect = map.container.getParentElement().getBoundingClientRect();
                    canvas.width = rect.width;
                    canvas.height = rect.height;

                    if (ctx2d != null) {
                        ctx2d.globalAlpha = style.strokeOpacity;
                        ctx2d.strokeStyle = style.strokeColor;
                        ctx2d.lineWidth = style.strokeWidth;
                    }

                    canvas.style.width = '100%';
                    canvas.style.height = '100%';

                    pane.getElement().appendChild(canvas);

                    var firstPosition = positionOrEvent && !mobile ? toPosition(positionOrEvent) : null;
                    var coordinates = firstPosition ? [firstPosition] : [];

                    var bounds = map.getBounds();
                    var latDiff = bounds[1][0] - bounds[0][0];
                    var lonDiff = bounds[1][1] - bounds[0][1];

                    canvas.onmousemove = function (e: any) {
                        coordinates.push([e.offsetX, e.offsetY]);

                        ctx2d?.clearRect(0, 0, canvas.width, canvas.height);
                        ctx2d?.beginPath();

                        ctx2d?.moveTo(coordinates[0][0], coordinates[0][1]);
                        for (var i = 1; i < coordinates.length; i++) {
                            ctx2d?.lineTo(coordinates[i][0], coordinates[i][1]);
                        }

                        ctx2d?.stroke();
                        //@ts-ignore
                    }.bind(this);

                    if (mobile) {

                        const coords: any = [];
                        const canvasLeftOffset = canvas.getBoundingClientRect().left;
                        const canvasTopOffset = canvas.getBoundingClientRect().top;

                        map.events.add('mousemove', function (evt: any) {
                                                               
                            var x = evt._sourceEvent._sourceEvent.originalEvent.touches[0].clientX - canvasLeftOffset;
                            var y = evt._sourceEvent._sourceEvent.originalEvent.touches[0].clientY - canvasTopOffset;
                            coordinates.push([x, y]);

                            ctx2d?.clearRect(0, 0, canvas.width, canvas.height);
                            ctx2d?.beginPath()
                            ctx2d?.moveTo(coordinates[0][0], coordinates[0][1]);
                            for (var i = 1; i < coordinates.length-1; i++) {
                                if (ctx2d && coordinates[i]) {
                                    ctx2d.lineTo(coordinates[i][0], coordinates[i][1]);
                                } 
                            }  
                            ctx2d?.stroke();
                        
                        });                       
                    }

                // Создаём косвенное обращение, чтобы не сдерживать сборщик мусора.
                var paintingProcess = {
                    finishPaintingAt: function (positionOrEvent: any) {
                        paintingProcess.finishPaintingAt = badFinishPaintingCall;

                        // Получаем координаты, прежде чем удалить пейн.
                        if (positionOrEvent) {
                            coordinates.push(toPosition(positionOrEvent));
                        }

                        map.panes.remove(pane);
                        if (unwantedBehaviors) {
                            map.behaviors.enable(unwantedBehaviors);
                        }

                        var tolerance = config.tolerance === undefined ? DEFAULT_TOLERANCE : Number(config.tolerance);
                        if (tolerance) {
                            coordinates = simplify(coordinates, tolerance);
                        }
                        // Преобразовываем координаты canvas-элемента в геодезические координаты.
                        return coordinates.map(function (x) {
                            var lon = bounds[0][1] + (x[0] / canvas.width) * lonDiff;
                            var lat = bounds[0][0] + (1 - x[1] / canvas.height) * latDiff;

                            return meta.coordinatesOrder === 'latlong' ? [lat, lon] : [lon, lat];
                        });
                    }
                };

                return paintingProcess;
            }

        function toPosition(positionOrEvent: any) {
            return positionOrEvent instanceof Event ?
                [positionOrEvent.get('offsetX'), positionOrEvent.get('offsetY')] :
                positionOrEvent;
        }

        function simplify(coordinates: any, tolerance: any) {
            var toleranceSquared = tolerance * tolerance;
            var simplified = [coordinates[0]];

            var prev = coordinates[0];
            for (var i = 1; i < coordinates.length; i++) {
                var curr = coordinates[i];
                if (Math.pow(prev[0] - curr[0], 2) + Math.pow(prev[1] - curr[1], 2) > toleranceSquared) {
                    simplified.push(curr);
                    prev = curr;
                }
            }

            return simplified;
        }

        provide(paintOnMap);
    });



            ymaps.ready(['ext.paintOnMap']).then(function () {


                var map = new ymaps.Map('map', {
                    center: center,
                    zoom: zoom,
                    controls: []
                });

                map.behaviors.disable('scrollZoom');

                setMapExists(true);
            
                var paintProcess: any;
            
                var styles = [
                    {strokeColor: '#399977', strokeOpacity: 1, strokeWidth: 3, fillColor: '#399977', fillOpacity: 1},
                ];
            
                var currentIndex = 0;
            
                map.events.add('mousedown', function (e: any) {
                        if (currentIndex == styles.length - 1) {
                            currentIndex = 0;
                        } else {
                            currentIndex += 1;
                        }
                        paintProcess = ymaps.ext.paintOnMap(map, e, {style: styles[0]}, mobile);
                });

                map.events.add('mouseup', function (e: any) {
                    if (paintProcess) {
            
                        // Получаем координаты отрисованного контура.
                        var coordinates = paintProcess.finishPaintingAt(e);
                        paintProcess = null;
                        // В зависимости от состояния кнопки добавляем на карту многоугольник или линию с полученными координатами.
                        var geoObject = new ymaps.Polygon([coordinates], {}, styles[currentIndex]);

                        setPolygonCoordinates(coordinates);
                        
                        map.geoObjects.add(geoObject);

                        map.destroy();
                        setMapExists(false);
                        setClicked(false);

                        const coordinatesList: ApplicationCoordinate[] = applications
                            .filter((application: any) => application.latitude && application.longitude)
                            .map((application: any) => ({
                            coordinates: [application.latitude, application.longitude],
                            id: application.id,
                        }));
                        const pointsInPolygon = sortPointsInsidePolygon(coordinatesList, coordinates)
                        findApplications(pointsInPolygon.map((point)=>point.id))

                        setIsPolygonVisible(true)
                    }
                });
                
            }).catch(console.error);
    
        } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        }
    }
}


export const SpecialMap = ({center, zoom, clicked, setClicked, setPolygonCoordinates, setIsPolygonVisible, findApplications, applications, mobile}: 
    {center: any, zoom: any, clicked: any, setClicked: any, setPolygonCoordinates: any, setIsPolygonVisible: any, findApplications: any, applications: any, mobile: any}) => {

   const [mapExists, setMapExists] = useState(false);

   

   useEffect(() => {
    const bodyElement = document.body;
    if (clicked) {
        bodyElement.style.overflow = 'hidden';
    } else {
        bodyElement.style.overflow = 'auto';
    }
   }, [clicked])

   useEffect(() => {
    loadYandexMapsScript(
        center, 
        zoom, 
        mapExists, 
        (data:any)=>setMapExists(data), 
        clicked, 
        (data:any)=>setClicked(data),
        (data:any)=>setPolygonCoordinates(data), 
        (data:any)=>setIsPolygonVisible(data),
        (data:any)=>findApplications(data),
        applications,
        mobile
    );
  }, [clicked]);

   return (
    <div className={`${s.specialMap} ${s.map} ${clicked ? "block" : "hidden"}`}>
        <div id="map"  style={{ width: '100%', height: '100%', opacity:'0.5', zIndex: "1"}}></div>
        {/* // @ts-ignore */}
        <canvas id="draw-canvas" className={`${s.canvass}`}></canvas>
    </div>
   )
 }