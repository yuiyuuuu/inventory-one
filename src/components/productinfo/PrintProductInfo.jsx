import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

import {
  makeGetRequest,
  makeGetRequestWithAuth,
} from "../../requests/helperFunctions";

import Chart from "chart.js/auto";

const months = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

const PrintProductInfo = () => {
  const params = useParams();
  const chartRef = useRef(null);

  const authState = useSelector((state) => state.auth);

  const [chartType, setChartType] = useState(null);

  const [item, setItem] = useState(null);
  const [resultsSortedByDate, setResultsSortedByDate] = useState(null);

  //result 2, sorted by month, usage result
  const [result2, setResult2] = useState(null);

  //result 3, keys are full month name + space + qty, eg. Feburary 2023, usage result
  const [result3, setResult3] = useState(null);

  //quantity results
  const [quantityResult, setQuantityResult] = useState(null);

  //prediction info states
  const [average180, setAverage180] = useState(null);
  const [oosDays, setOosDays] = useState(null);

  const [noHistory, setNoHistory] = useState(false);

  const [itemNotFound, setItemNotFound] = useState(false);

  useEffect(() => {
    const id = params.id;

    async function f() {
      await makeGetRequestWithAuth(
        `item/fetch/${id}`,
        import.meta.env.VITE_ROUTEPASS
      ).then((res) => {
        if (res.id) {
          setItem(res);
        } else {
          setItemNotFound(true);
        }
      });
    }

    f();
  }, []);

  function find180Average() {
    let total = 0;

    const today = new Date();

    const priorDate = new Date(
      new Date().setDate(today.getDate() - 180)
    ).getTime();

    item.orders.forEach((t) => {
      if (new Date(t.completedAt) > priorDate) {
        total += t.quantity;
      }
    });

    setAverage180((total / 180).toFixed(2));
  }

  function findEstimateOOSDate() {
    if (item.quantity === 0) return;

    const curQty = item.quantity;
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
    if (!item) return;

    find180Average();
  }, [item]);

  useEffect(() => {
    if (!average180) return;
    findEstimateOOSDate();
  }, [average180]);

  function sortOrdersByDate() {
    const sort = {};
    item.orders.forEach((v) => {
      const d = new Date(v.completedAt);
      const str = `${
        d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
      }/${d.getDate()}/${d.getFullYear()}`;

      sort[str] ||= [];
      sort[str].push(v);
    });

    setResultsSortedByDate(sort);
  }

  useEffect(() => {
    if (!item?.orders?.length) return;
    sortOrdersByDate();
  }, [item]);

  useEffect(() => {
    if (!item?.orders) return;
    if (!resultsSortedByDate) return;
    if (!item?.orders?.length) {
      setNoHistory(true);
      return;
    }

    if (!authState?.id) return;

    if (!Object.keys(resultsSortedByDate).length) return;

    //not first time running, destroy previous chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const url = new URL(window.location.href);
    const type = new URLSearchParams(url.search).get("type");
    setChartType(type);

    if (!type || type === "usage") {
      const result = {};

      function combineDates() {
        let orders = [];
        let filterResultInformation = {};

        //if this function call is not for filtering, set orders as all orders
        orders = item.orders;

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

        //set the results to display, only will be used if filter is active
      }

      combineDates();

      //sort result object by date
      const re = {};
      const re2 = {};
      const re3 = {};

      //get all keys of result, then sort the keys based on date
      Object.keys(result)
        .sort(function (a, b) {
          const adate = new Date(a);
          const bdate = new Date(b);

          if (adate < bdate) return -1;
          if (adate > bdate) return 1;
          return 0;
        })
        .map((obj) => {
          //reinstate object but in sorted order
          re[obj] = result[obj];
        });

      const last8months = [];
      const today = new Date();

      for (var i = 7; i >= 0; i -= 1) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);

        last8months.push(
          `${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`
        );

        re3[months[d.getMonth() + 1] + " " + d.getFullYear()] ||= 0;
      }

      for (let i = 0; i < last8months.length; i++) {
        re2[last8months[i]] ||= 0;
      }

      for (let i = 0; i < Object.keys(result).length; i++) {
        const d = new Date(Object.keys(result)[i]);

        if (
          re2[`${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`] >= 0
        ) {
          re2[`${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`] +=
            Object.values(result)[i].quantity;
        }

        if (
          re3[`${months[d.getMonth() + 1]} ${String(d.getFullYear())}`] >= 0
        ) {
          re3[`${months[d.getMonth() + 1]} ${String(d.getFullYear())}`] +=
            Object.values(result)[i].quantity;
        }
      }

      setResult2(re2);
      setResult3(re3);

      const chart = new Chart(document.getElementById("pi-parent"), {
        type: "line",
        options: {
          plugins: {
            legend: {
              labels: {
                boxWidth: 60,
                boxHeight: 18,
                font: {
                  size: 22,
                },
                textAlign: "center",
              },
            },
          },
          color: "black",
          scales: {
            x: {
              ticks: {
                color: "black",
                font: {
                  weight: "bold",
                  size: 15,
                },
              },
            },

            y: {
              ticks: {
                color: "black",
                font: {
                  weight: "bold",
                  size: 15,
                },
              },
              grace: "12%",
              beginAtZero: true,
            },
          },

          responsive: true,
        },
        data: {
          labels: Object.keys(re2),
          datasets: [
            {
              data: Object.values(re2).map((v) => v),
              hoverBackgroundColor: "rgba(0, 255, 255)",
              label: " Usage by Month",
            },
          ],
        },
      });

      chartRef.current = chart;
    } else {
      const re = {};
      const final = {};
      const shipmentResult = {};

      const today = new Date();

      const last8months = [];

      for (var i = 7; i >= 0; i -= 1) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);

        last8months.push(
          `${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`
        );
      }

      for (let i = 0; i < last8months.length; i++) {
        re[last8months[i]] ||= 0;

        final[last8months[i]] ||= 0;
      }

      item.orders.forEach((order) => {
        const d = new Date(order.completedAt);

        if (
          re[`${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`] >= 0
        ) {
          re[`${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`] +=
            order.quantity;
        }
      });

      const allShipments = item.shipments;

      allShipments.forEach((shipment) => {
        const d = new Date(shipment.shipmentDate);

        const key = `${d.getMonth()}/${String(d.getFullYear()).slice(2)}`;

        shipmentResult[key] ||= [];
        shipmentResult[key].push(shipment);
      });

      //recursion should do the trick here
      //making an order wont change this month's quantity
      //because the order still exists and we still add it to the current month. Only at the beginning of the month will it change
      function set(date, prev, index) {
        final[date] += prev;
        final[date] += re[date];

        if (shipmentResult[date]) {
          shipmentResult[date].forEach((sh) => {
            final[date] -= sh.quantity;
          });
        }

        if (index !== 0) {
          set(Object.keys(re)[index - 1], final[date], index - 1);
        }
      }

      const c = Object.keys(re);
      set(c[c.length - 1], item.quantity, c.length - 1);

      const chart = new Chart(document.getElementById("pi-parent"), {
        type: "line",
        options: {
          plugins: {
            legend: {
              labels: {
                color: "black",
              },
            },
          },
          color: "white",
          scales: {
            x: {
              ticks: {
                color: "black",
              },

              grid: {
                color: "black",
              },
            },

            y: {
              ticks: {
                color: "black",
              },
              grid: {
                color: "black",
              },

              grace: "10%",
            },
          },

          responsive: true,
          borderColor: "black",
          borderWidth: 2,
        },
        data: {
          labels: Object.keys(final),
          datasets: [
            {
              label: "Quantity by Month",
              data: Object.values(final).map((v) => v),
              backgroundColor: "#B41717",
              // hoverBackgroundColor: "rgba(0, 255, 255)",
              pointRadius: 4,
            },
          ],
        },
      });

      chartRef.current = chart;

      setQuantityResult(final);
    }
  }, [item, resultsSortedByDate, authState]);

  useEffect(() => {
    if ((item?.quantity !== 0 && !oosDays) || !average180 || !chartRef.current)
      return;
    if (itemNotFound) return;

    var beforePrint = function () {};
    var afterPrint = function () {
      setTimeout(() => {
        window.close();
      }, 500);
    };

    if (window.matchMedia) {
      var mediaQueryList = window.matchMedia("print");
      mediaQueryList.addListener(function (mql) {
        if (mql.matches) {
          beforePrint();
        } else {
          afterPrint();
        }
      });
    }

    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;

    setTimeout(() => {
      window.print();
    }, 1700);
  }, [chartRef, average180, oosDays, itemNotFound, item]);

  if (!authState?.id && (!authState.loading || authState.loading === "false")) {
    return <div className="ppi-b">Login to print</div>;
  }

  if (itemNotFound) {
    return <div className="home-krink">Item not found</div>;
  }

  return (
    <div className="ppi-parent">
      <div className="home-krink ppi-martop">Inventory Reports</div>
      <div className="ppi-can">
        <canvas className="pi-parent ppi-print" id="pi-parent"></canvas>
      </div>

      <div className="ppi-bot">
        <div className="ppi-name">{item?.name}</div>
        <div
          className="pi-octoggle ppi-b ppi-c"
          style={{ marginTop: "10.5px" }}
        >
          Statistics
        </div>

        <div style={{ paddingLeft: "3px" }}>
          <div className="pi-w">
            <div className="pi-sub ppi-b">Category: {item?.category?.name}</div>

            <div className="pi-sub ppi-b">
              Current Quantity: {item?.quantity}
            </div>
            <div className="pi-sub ppi-b">
              History Quantity: {item?.historyQTY}
            </div>
            <div className="pi-sub ppi-b">
              Average per day (last 180 days): {average180}
            </div>
            <div className="pi-sub ppi-b">
              Predicted OOS day:{" "}
              {item?.quantity === 0
                ? "Out of Stock"
                : item?.historyQTY === 0
                ? "No History"
                : `${
                    oosDays?.month < 10 ? "0" + oosDays?.month : oosDays?.month
                  }/${oosDays?.day < 10 ? "0" + oosDays?.day : oosDays?.day}/${
                    oosDays?.year
                  }`}
            </div>
          </div>
        </div>

        <div
          className="pi-octoggle ppi-b ppi-c"
          style={{ marginTop: "10.5px" }}
        >
          {!chartType || chartType === "usage"
            ? "Usage by Month"
            : "Quantity by Month"}
        </div>

        <div style={{ paddingLeft: "3px" }}>
          {chartType === "usage" || !chartType
            ? result2 &&
              Object.keys(result3).map((value, i) => (
                <div className="pi-sub ppi-b">
                  {value}: {Object.values(result3)[i]}
                </div>
              ))
            : quantityResult &&
              Object.keys(quantityResult).map((value, i) => (
                <div className="pi-sub ppi-b">
                  {months[new Date(value).getMonth() + 1]}:{" "}
                  {Object.values(quantityResult)[i]}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default PrintProductInfo;
