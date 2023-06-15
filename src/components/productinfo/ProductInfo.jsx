import React, { useEffect, useState } from "react";

import "./pi.scss";

import Chart from "chart.js/auto";

const ProductInfo = ({ data, setShowSingleProduct }) => {
  const [noHistory, setNoHistory] = useState(false);

  const [showStats, setShowStats] = useState(true);

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

        <div className="pi-info">
          <div className="pi-sec pi-fl">
            <img
              src={
                data?.image
                  ? `data:image/png;base64,${data?.image}`
                  : "/assets/soap.jpeg"
              }
              className="pi-img"
            />
          </div>

          <div className="pi-sec" style={{ marginLeft: "30px" }}>
            <div className="pi-ti">{data.name}</div>

            <div
              className="pi-octoggle"
              onClick={() => setShowStats((prev) => !prev)}
            >
              Statistics <div className="grow" />
              <div
                className="mitem-caret"
                style={{ transform: !showStats && "rotate(-90deg)" }}
              />
            </div>

            <div
              style={{ maxHeight: showStats ? "300px" : 0 }}
              className="pi-w"
            >
              <div className="pi-sub">Current Quantity: {data.quantity}</div>
              <div className="pi-sub">History Quantity: {data.historyQTY}</div>
              <div className="pi-sub">Average per day (last 180 days): 0 </div>
              <div className="pi-sub">Predicted OOS day: 6/12/23</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
