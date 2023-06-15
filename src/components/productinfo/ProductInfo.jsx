import React, { useEffect } from "react";

import Chart from "chart.js/auto";

const ProductInfo = () => {
  useEffect(() => {
    const data = [
      { year: 2010, count: 10 },
      { year: 2011, count: 20 },
      { year: 2012, count: 15 },
      { year: 2013, count: 25 },
      { year: 2014, count: 22 },
      { year: 2015, count: 30 },
      { year: 2016, count: 28 },
    ];
    new Chart(document.getElementById("pi-parent"), {
      type: "bar",
      options: {
        animation: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
      data: {
        labels: data.map((row) => row.year),
        datasets: [
          {
            label: "Acquisitions by year",
            data: data.map((row) => row.count),
          },
        ],
      },
    });
  }, []);

  return (
    <div>
      <canvas className='pi-parent' id='pi-parent'></canvas>
    </div>
  );
};

export default ProductInfo;
