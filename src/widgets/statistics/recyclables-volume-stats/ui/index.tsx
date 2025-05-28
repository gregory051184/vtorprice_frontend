import { IWithClass } from "@box/types";
import s from "./style.module.scss";
import classNames from "classnames";
import { gate } from "../model";
import { useGate, useStore } from "effector-react";
import { recyclablesVolumeStatsModel } from "@box/entities/statistics";
import ReactECharts from "echarts-for-react";
import { RecyclablesVolumeStatsFilters } from "@box/features/statistics/filters/recyclablesVolumeStatsFilter";
import { useScreenSize } from "@box/shared/hooks";

export const RecyclablesVolumeStats: React.FC<IWithClass> = ({ className }) => {
  useGate(gate);
  const recyclablesVolumeStats = useStore(
    recyclablesVolumeStatsModel.$recyclablesVolumeStats
  );

  const data = recyclablesVolumeStats?.map((point) => [
    point.recyclables,
    parseFloat((point.totalWeightSum / 1000).toFixed(1)),
  ]);

  const totalWeightKg = recyclablesVolumeStats?.reduce(
    (acc, item) => acc + item.totalWeightSum,
    0
  );

  let adaptiveLeft = "5%";
  const [, satisfies] = useScreenSize();
  if (!satisfies("xsm")) {
    adaptiveLeft = "10%";
  }

  const options = {
    legend: {},
    tooltip: {},
    xAxis: {
      type: "category",
      axisLabel: { interval: 0, rotate: 45 },
    },
    grid: {
      left: adaptiveLeft,
      right: "5%",
      bottom: "5%",
      top: "5%",
      containLabel: true,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "bar",
        data,
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
        itemStyle: {
          color: "rgba(57, 153, 119, 0.6)",
        },
      },
    ],
  };

  return (
    <div className={classNames("h-[600px]", s.recVolumeHolder, className)}>
      <div
        className={classNames(
          "flex items-center mt-[30px] gap-6",
          s.adaptiveHidden
        )}
      >
        <h1 className="font-normal text-2xl">
          Объём вторсырья: {(totalWeightKg / 1000).toFixed(1)} т
        </h1>
      </div>
      <RecyclablesVolumeStatsFilters />
      <div className={"w-full h-full mt-[60px]"}>
        <ReactECharts
          option={options}
          style={{ width: "100%", height: "71%" }}
        />
      </div>
    </div>
  );
};
