import React, { useEffect, useState } from "react";

import "./pi.scss";

import Chart from "chart.js/auto";

const ProductInfo = ({ data, setShowSingleProduct }) => {
  const [noHistory, setNoHistory] = useState(false);

  useEffect(() => {
    if (!data.completedTimes) return;
    if (!data.completedTimes.length) {
      setNoHistory(true);
      return;
    }

    new Chart(document.getElementById("pi-parent"), {
      type: "bar",
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              footer: () => {
                let v = "";
                data.completedTimes.forEach((t) => {
                  v = `Completed By ${t.completedBy}`;
                });

                return v;
              },
            },
          },
          legend: {
            labels: {
              color: "white",
            },
          },
        },
        color: "white",
        scales: {
          x: {
            ticks: {
              color: "white",
            },
          },

          y: {
            ticks: {
              color: "white",
            },
          },
        },
      },
      data: {
        labels: data.completedTimes.map((row) => row.completedTime),
        datasets: [
          {
            label: "# Completed by Date",
            data: data.completedTimes.map((row) => row.qty),
            backgroundColor: "#B41717",
            hoverBackgroundColor: "rgba(0, 255, 255)",
          },
        ],
      },
    });
  }, [data]);

  return (
    <div className="pi-container" onClick={() => setShowSingleProduct(false)}>
      <div className="pi-canvascontainer" onClick={(e) => e.stopPropagation()}>
        {noHistory ? (
          <div>No Product History</div>
        ) : (
          <canvas className="pi-parent" id="pi-parent"></canvas>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
