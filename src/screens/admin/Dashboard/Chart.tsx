import React, { useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Strings } from "src/resources";
import { kFormatter } from "src/utils/users";

function divideByThousand(num: number) {
  return num / 1000;
}

function hasThreeDigits(data){
  const foundData = data?.find(r => {
    const strValue = r.value.toString()
    return strValue.length > 2
    })
    return !!foundData
}

const CustomTooltip = ({ payload, needToFormat }: any) => {
  if (payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p>{needToFormat ? kFormatter(payload[0].value * 1000) : payload[0].value}</p>
      </div>
    );
  }

  return null;
};
const Chart = ({ chartData }: ChartDataTypes) => {
  const needToFormat = useMemo(() => hasThreeDigits(chartData?.RevenueDetails),[chartData])

  const [revenueData, setRevenueData] = useState([{ name: "03", uv: 523 }]);

  useEffect(() => {
    if (chartData?.RevenueDetails) {
      const formattedData = Object?.entries(chartData?.RevenueDetails)?.map(([, uv]) => ({
          name: uv?.key,
          uv: needToFormat ? divideByThousand(uv?.value as number) : uv?.value,
        }));
      setRevenueData(formattedData);
    }
  }, [chartData?.RevenueDetails]);

  return (
    <div className="chart">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="chart-heading d-flex align-items-center gap-2">
          <h2>{kFormatter(chartData?.TotalRevenue)}</h2>
          <h3>{Strings.total_revenue}</h3>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          width={500}
          height={200}
          data={revenueData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" strokeWidth="0" tickMargin={10} fontSize={14} stroke="#8C89A9" fontWeight={700} letterSpacing="0.048px" />
          <YAxis
            strokeWidth="0"
            tickMargin={10}
            fontSize={14}
            stroke="#8C89A9"
            fontWeight={700}
            letterSpacing="0.048px"
            tickFormatter={(value) => (needToFormat ? kFormatter(value * 1000) : value)}
          />
          <Tooltip content={<CustomTooltip needToFormat={needToFormat} />} />
          <Line strokeWidth="4" connectNulls type="monotone" dataKey="uv" stroke="#8278DE" fill="#8278DE" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

type ChartDataTypes = {
  chartData: {
    TotalRevenue: number;
    RevenueDetails: RevenueDetail[];
  };
};
type RevenueDetail = {
  key: string;
  value: number;
};
export default Chart;
