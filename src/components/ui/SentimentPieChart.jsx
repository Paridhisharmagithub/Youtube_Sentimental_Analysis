import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#64C2A6", "#2D87BB", "#F7BB51"]; // green, yellow, red

const SentimentPieChart = ({ positive, neutral, negative }) => {
  const data = [
    { name: "Positive", value: Number(positive) },
    { name: "Neutral", value: Number(neutral) },
    { name: "Negative", value: Number(negative) },
  ];

  return (
    <div className="flex flex-col items-center p-5 bg-white  max-w-xl mx-auto drop-shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Sentiment Pie Chart</h1>

      <PieChart width={490} height={350} className="text-xl font-semibold ">
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({  percent }) => ` ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default SentimentPieChart;
