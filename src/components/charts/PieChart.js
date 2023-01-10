import React from "react";

import "chart.js/auto";

import { Pie } from "react-chartjs-2";

const PieChart = (props) => {

    const data = {
        labels: props.labels,
        datasets: [{
            label: ' Number of Clients',
            data: props.results,
            backgroundColor: [
                '#6E8D77',
                '#93bd9f'
            ],
            hoverOffset: 10
        }]
    };

    return (
        <div>
            <Pie data={data} />
        </div>
    );
};

export default PieChart;
