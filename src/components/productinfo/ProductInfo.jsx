import React, { useEffect, useState } from "react";

import "./pi.scss";

import Chart from "chart.js/auto";

const ProductInfo = ({ data, setShowSingleProduct }) => {
  const [noHistory, setNoHistory] = useState(false);

  const [showStats, setShowStats] = useState(true);

  const [average180, setAverage180] = useState(null);

  const [oosDays, setOosDays] = useState(null);

  console.log(data, "dataa");

  function find180Average() {
    let total = 0;

    const today = new Date();

    const priorDate = new Date(
      new Date().setDate(today.getDate() - 180)
    ).getTime();

    data.orders.forEach((t) => {
      if (new Date(t.completedAt) > priorDate) {
        total += t.quantity;
      }
    });

    setAverage180((total / 180).toFixed(2));
  }

  function findEstimateOOSDate() {
    if (data.quantity === 0) return;

    const curQty = data.quantity;
    const averageDays = Math.floor(curQty / average180);

    const oosDateTimeStamp = new Date(
      new Date().setDate(new Date().getDate() + averageDays)
    ).getTime();

    const dateOfOOS = new Date(oosDateTimeStamp);

    setOosDays({
      month: dateOfOOS.getMonth() + 1,
      day: dateOfOOS.getDate(),
      year: dateOfOOS.getFullYear(),
    });
  }

  useEffect(() => {
    find180Average();
  }, []);

  useEffect(() => {
    if (!average180) return;
    findEstimateOOSDate();
  }, [average180]);

  useEffect(() => {
    if (!data.orders) return;
    if (!data.orders.length) {
      setNoHistory(true);
      return;
    }

    const result = {};

    function combineDates() {
      const orders = data.orders;

      orders.forEach((v) => {
        result[v.completedAt] ||= { store: [], user: [] };
        result[v.completedAt] = {
          store: [...new Set([...result[v.completedAt].store, v.store.name])],
          user: [...new Set([...result[v.completedAt].user, v.user.name])],
        };
      });
    }

    combineDates();

    //fix chart here, add results

    console.log(result, "results");

    new Chart(document.getElementById("pi-parent"), {
      type: "bar",
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              footer: (v) =>
                `Completed By ${data.orders[v[0].dataIndex].user.name}`,
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
    <div className='pi-container' onClick={() => setShowSingleProduct(false)}>
      <div className='pi-canvascontainer' onClick={(e) => e.stopPropagation()}>
        {noHistory ? (
          <div>No Product History</div>
        ) : (
          <canvas className='pi-parent' id='pi-parent'></canvas>
        )}

        <div className='pi-info'>
          <div className='pi-sec pi-fl'>
            <img
              src={
                data?.image
                  ? `data:image/png;base64,${data?.image}`
                  : "/assets/soap.jpeg"
              }
              className='pi-img'
            />
          </div>

          <div className='pi-sec' style={{ marginLeft: "30px" }}>
            <div className='pi-ti'>{data.name}</div>

            <div
              className='pi-octoggle'
              onClick={() => setShowStats((prev) => !prev)}
            >
              Statistics <div className='grow' />
              <div
                className='mitem-caret'
                style={{ transform: !showStats && "rotate(-90deg)" }}
              />
            </div>

            <div
              style={{ maxHeight: showStats ? "300px" : 0 }}
              className='pi-w'
            >
              <div className='pi-sub'>Current Quantity: {data.quantity}</div>
              <div className='pi-sub'>History Quantity: {data.historyQTY}</div>
              <div className='pi-sub'>
                Average per day (last 180 days): {average180}
              </div>
              <div className='pi-sub'>
                Predicted OOS day:{" "}
                {data.quantity === 0
                  ? "Out of Stock"
                  : `${
                      oosDays?.month < 10
                        ? "0" + oosDays?.month
                        : oosDays?.month
                    }/${
                      oosDays?.day < 10 ? "0" + oosDays?.day : oosDays?.day
                    }/${oosDays?.year}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
