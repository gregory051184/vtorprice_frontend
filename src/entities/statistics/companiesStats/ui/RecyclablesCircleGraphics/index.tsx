import React from 'react';
import ReactECharts from 'echarts-for-react';
import { IAdaptiveData, IRecyclablesCircleGraphics } from './types';
import classNames from 'classnames';
import { useScreenSize } from '@box/shared/hooks';

export const CompaniesStatsCircleGraphics: React.FC<IRecyclablesCircleGraphics> = ({
    className,
    suppliers,
    processors,
    buyers
  }) => {

    const [, satisfies] = useScreenSize();

    const adaptiveData: IAdaptiveData = {
      title: {
        size1: { x: '10%', y: '5%' },
        size2: { x: '50%', y: '5%' },
        size3: { x: '90%', y: '5%' }
      },
      pie: {
        size1: { x: '10%', y: '45%' },
        size2: { x: '50%', y: '45%' },
        size3: { x: '90%', y: '45%' }
      }
    };
    let radius = 100;
    let adaptiveTooltip = {
      trigger: 'item',
      axisPointer: { type: 'cross' }
    };

    if (!satisfies('sm')) {
      adaptiveData.title.size1 = { x: '50%', y: '1%' };
      adaptiveData.title.size2 = { x: '50%', y: '31%' };
      adaptiveData.title.size3 = { x: '50%', y: '61%' };
      adaptiveData.pie.size1 = { x: '50%', y: '17%' };
      adaptiveData.pie.size2 = { x: '50%', y: '47%' };
      adaptiveData.pie.size3 = { x: '50%', y: '77%' };
      radius = 125;
    }
    if (!satisfies('xsm')) {
      adaptiveData.title.size1 = { x: '50%', y: '1%' };
      adaptiveData.title.size2 = { x: '50%', y: '29%' };
      adaptiveData.title.size3 = { x: '50%', y: '57%' };
      adaptiveData.pie.size1 = { x: '50%', y: '15%' };
      adaptiveData.pie.size2 = { x: '50%', y: '43%' };
      adaptiveData.pie.size3 = { x: '50%', y: '71%' };
      radius = 125;
      adaptiveTooltip = {
        trigger: 'item',
        axisPointer: { type: 'cross' },
        // @ts-ignore
        // eslint-disable-next-line
        position: function (pos, params, dom, rect, size) {
        // @ts-ignore
        // eslint-disable-next-line
          return ['10%', pos[1]];
        }
      };
    }

    const options = {
      toolbox: {
      },
      tooltip: adaptiveTooltip,
      title: [
        {
          text: 'Поставщики',
          left: adaptiveData.title.size1.x,
          top: adaptiveData.title.size1.y,
          textAlign: 'center'
        },
        {
          text: 'Переработачики',
          left: adaptiveData.title.size2.x,
          top: adaptiveData.title.size2.y,
          textAlign: 'center'
        },
        {
          text: 'Покупатели',
          left: adaptiveData.title.size3.x,
          top: adaptiveData.title.size3.y,
          textAlign: 'center'
        }
      ],
      series: [
        {
            type: 'pie',
            data: suppliers?.map(item => ({value: item[0], name: item[1]})),
            roseType: 'area',
            radius: [20, radius],
            center: [adaptiveData.pie.size1.x, adaptiveData.pie.size1.y],
            itemStyle: {
                borderRadius: 8
            },
            label: {
              show: false
            }
        },
        {
            type: 'pie',
            data: processors?.map(item => ({value: item[0], name: item[1]})),
            roseType: 'area',
            radius: [20, radius],
            center: [adaptiveData.pie.size2.x, adaptiveData.pie.size2.y],
            itemStyle: {
                borderRadius: 8
            },
            label: {
              show: false
            }
        },
        {
            type: 'pie',
            data: buyers?.map(item => ({value: item[0], name: item[1]})),
            roseType: 'area',
            radius: [20, radius],
            center: [adaptiveData.pie.size3.x, adaptiveData.pie.size3.y],
            itemStyle: {
                borderRadius: 8
            },
            label: {
              show: false
            }
        }
    ]
    };
  
    return (
      <div className={classNames("h-full", className)}>
        <ReactECharts option={options} style={{ width: '100%', height: '100%' }}
        />
      </div>
    );
  };
