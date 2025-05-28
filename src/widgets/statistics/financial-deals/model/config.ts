export const getGraphDealOptions = (
  data?: Array<{ value: number; date: Date }>
) => {
  const axis: {
    x: Array<string>;
    y: Array<number>;
  } = {
    x: [],
    y: [],
  };

  if (data) {
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      const date = Intl.DateTimeFormat("ru-Ru", {
        day: "numeric",
        month: "short",
      }).format(new Date(el.date));
      axis.x.push(date);
      axis.y.push(el.value);
    }
  }

  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
    },
    grid: {
      top: 20,
      right: 40,
      bottom: 20,
      left: 40,
    },
    xAxis: {
      type: "category",
      data: axis.x,
      axisTick: {
        alignWithLabel: true,
      },
      min: "dataMin",
      boundaryGap: false,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: axis.y,
        yAxisIndex: 0,
        type: "line",
        areaStyle: {
          color: "rgba(57,153,119,0.5)",
        },
        lineStyle: {
          color: "rgb(57,153,119)",
        },
        itemStyle: {
          color: "rgb(57,153,119)",
        },
      },
    ],
  };
};
