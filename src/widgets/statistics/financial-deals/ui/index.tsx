import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useGate, useStore } from "effector-react";
import classNames from "classnames";

import { $graphData, gate } from "../model";
import { getGraphDealOptions } from "../model/config";

import s from "./style.module.scss";

const FinancialDealsChart = () => {
  useGate(gate);
  const graphData = useStore($graphData);
  const validGraphConfig = useMemo(
    () => getGraphDealOptions(graphData?.graph?.points),
    [graphData]
  );

  return (
    <div>
      <ReactECharts option={validGraphConfig} />
      <div className={classNames("flex gap-4 justify-end mt-7", s.info)}>
        <div className={classNames("flex items-center gap-2", s.price)}>
          <p className="text-grey-40">Доход VtorPrice с совершенных сделок: </p>
          <span className="font-medium text-2xl text-black">
            {graphData?.totalVtorpriceEarnings} ₽
          </span>
        </div>
        <div className={classNames("flex items-center gap-2", s.price)}>
          <p className="text-grey-40">Общая сумма продаж: </p>
          <span className="font-medium text-2xl text-black">
            {graphData?.totalSumOfSells} ₽
          </span>
        </div>
      </div>
    </div>
  );
};

export default FinancialDealsChart;
