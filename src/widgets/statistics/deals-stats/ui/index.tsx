import { IWithClass } from "@box/types";
import s from "./style.module.scss";
import classNames from "classnames";
import { gate } from "../model";
import { useGate, useStore } from "effector-react";
import { dealsStatsModel } from "@box/entities/statistics";
import { DealsStatsFilters } from "@box/features/statistics/filters/dealsStatsFilter";
import ReactECharts from "echarts-for-react";
import { useScreenSize } from "@box/shared/hooks";

export const DealsStats: React.FC<IWithClass> = ({ className }) => {
  useGate(gate);
  const dealsStats = useStore(dealsStatsModel.$dealsStats);

  const filteredPoints = dealsStats?.graph.points.filter(
    (point) => point.date !== null
  );
  const data = filteredPoints?.map((point) => [point.date, point.value]);
  let adaptiveLeft = "5%";
  const [, satisfies] = useScreenSize();
  if (!satisfies("xsm")) {
    adaptiveLeft = "10%";
  }

  const options = {
    tooltip: {},
    xAxis: {
      type: "category",
      boundaryGap: false,
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
        type: "line",
        data,
        itemStyle: {
          color: "#399977",
        },
        areaStyle: {
          color: "rgba(57, 153, 119, 0.3)",
        },
      },
    ],
  };

  return (
    <div className={classNames("", className)}>
      <div
        className={classNames("flex items-center mt-[-50px] gap-6", s.adaptive)}
      >
        <h1 className="font-normal text-2xl">
          Количество совершенных сделок: {dealsStats?.total}
        </h1>
      </div>
      <DealsStatsFilters />
      <div className={"w-full mt-[60px]"}>
        <ReactECharts option={options} style={{ width: "100%" }} />
      </div>
    </div>
  );
};
