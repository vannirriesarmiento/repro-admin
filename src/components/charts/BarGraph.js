import React from "react";

import "chart.js/auto";

import { Bar } from "react-chartjs-2";

const BarChart = (props) => {
    const labels = props.labels;
    const data = {
        labels: labels,
        datasets: [
            {
                label: " Number of Clients",
                backgroundColor: [
                    '#9fe3b8',
                    '#6E8D77',
                    "#405e49",
                    "#48785a"
                ],
                borderColor: "rgb(255, 99, 132)",
                data: props.results,
            },
        ],
    };
    return (
        <div>
            <Bar data={data} />
        </div>
    );
};

export default BarChart;
