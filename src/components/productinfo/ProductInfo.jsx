import React, { useEffect, useState } from "react";

import "./pi.scss";

import Chart from "chart.js/auto";
import PiOrders from "./orders/PiOrders";

import $ from "jquery";

const ProductInfo = ({ data, setShowSingleProduct }) => {
  const [resultsSortedByDate, setResultsSortedByDate] = useState({});

  const [noHistory, setNoHistory] = useState(false);

  //SHOW HEIGHT STATES
  const [showStats, setShowStats] = useState(true);
  const [showOrders, setShowOrders] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [average180, setAverage180] = useState(null);

  const [oosDays, setOosDays] = useState(null);

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
        const d = new Date(v.completedAt);
        const str = `${
          d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
        }/${d.getDate()}/${d.getFullYear()}`;

        result[str] ||= { store: [], user: [], quantity: 0 };
        result[str] = {
          store: [...new Set([...result[str].store, v.store.name])],
          user: [...new Set([...result[str].user, v.user.name])],
          quantity: result[str].quantity + v.quantity,
        };
      });
    }

    function sortOrdersByDate() {
      const sort = {};
      data.orders.forEach((v) => {
        const d = new Date(v.completedAt);
        const str = `${
          d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
        }/${d.getDate()}/${d.getFullYear()}`;

        sort[str] ||= [];
        sort[str].push(v);
      });

      return sort;
    }

    combineDates();
    setResultsSortedByDate(sortOrdersByDate());

    //fix chart here, add results

    new Chart(document.getElementById("pi-parent"), {
      type: "bar",
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              footer: (v) => {
                return `Completed By ${Object.values(result)[
                  v[0].dataIndex
                ].user.join(", ")}
Stores: ${
                  Object.values(result)[v[0].dataIndex].store?.length
                    ? Object.values(result)[v[0].dataIndex].store.join(", ")
                    : "Unknown"
                }
Click to see all orders on this date
                `;
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

        onClick: (e, a) => {
          setSelectedDate((prev) =>
            a[0]?.index >= 0 ? Object.keys(result)[a[0]?.index] : prev
          );

          setShowOrders(true);
        },

        responsive: true,
      },
      data: {
        labels: Object.keys(result),
        datasets: [
          {
            label: " # Completed by Date",
            data: Object.values(result).map((v) => v.quantity),
            backgroundColor: "#B41717",
            hoverBackgroundColor: "rgba(0, 255, 255)",
          },
        ],
      },
    });
  }, [data]);

  useEffect(() => {
    if (showOrders) {
      $("#pi-orders").css("max-height", $(".pio-parent").outerHeight());
    } else {
      $("#pi-orders").css("max-height", 0);
    }
  }, [showOrders, selectedDate]);

  return (
    <div
      className='pi-container'
      onClick={() => {
        setShowSingleProduct(false);
        document.querySelector("html").style.overflow = "";
      }}
    >
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

            <div
              className='pi-octoggle'
              onClick={() => {
                setShowOrders((prev) => !prev);
              }}
              style={{ marginBottom: "8px", marginTop: "5px" }}
            >
              Orders <div className='grow' />
              <div
                className='mitem-caret'
                style={{ transform: !showOrders && "rotate(-90deg)" }}
              />
            </div>

            <div
              style={{
                overflowY: "unset",
                minHeight: "30vh",
              }}
              className='pi-w'
              id='pi-orders'
            >
              <PiOrders
                orders={resultsSortedByDate}
                selectedDate={selectedDate}
                showOrders={showOrders}
                setSelectedDate={setSelectedDate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
