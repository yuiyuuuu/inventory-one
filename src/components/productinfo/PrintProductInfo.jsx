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

  const [item, setItem] = useState(null);
  const [resultsSortedByDate, setResultsSortedByDate] = useState(null);

  //result 2, sorted by month
  const [result2, setResult2] = useState(null);

  //result 3, keys are full month name + space + qty, eg. Feburary 2023
  const [result3, setResult3] = useState(null);

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

      if (re2[`${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`] >= 0) {
        re2[`${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`] +=
          Object.values(result)[i].quantity;
      }

      if (re3[`${months[d.getMonth() + 1]} ${String(d.getFullYear())}`] >= 0) {
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
        <div className="pi-octoggle ppi-b ppi-c">Statistics</div>

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

        <div className="pi-octoggle ppi-b ppi-c">Usage by Month</div>

        <div style={{ paddingLeft: "3px" }}>
          {result2 &&
            Object.keys(result3).map((value, i) => (
              <div className="pi-sub ppi-b">
                {value}: {Object.values(result3)[i]}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PrintProductInfo;
