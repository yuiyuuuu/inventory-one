import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { makeGetRequest } from "../requests/requestFunctions";

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

const SingleStore = () => {
  const params = useParams();

  const chartReference = useRef(null);

  const [selectedStore, setSelectedStore] = useState({});
  const [storeOrdersSorted, setStoreOrdersSorted] = useState({});

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const [showMonth, setShowMonth] = useState(false);
  const [showYear, setShowYear] = useState(false);
  const [ordersByQuery, setOrdersByQuery] = useState([]);

  useEffect(() => {
    const id = params.id;

    const fetch = async () => {
      const store = await makeGetRequest(`/stores/fetch/${id}`)
        .then((res) => {
          setSelectedStore(res);
        })
        .catch(() => {
          alert("Something went wrong, please refresh");
        });
    };

    fetch();
  }, []);

  useEffect(() => {
    if (!selectedStore?.id) return;

    const result = {};

    selectedStore.orders.forEach((order) => {
      const completedAt = new Date(order.completedAt);

      result[completedAt.getFullYear()] ||= {};
      result[completedAt.getFullYear()][completedAt.getMonth() + 1] ||= [];
      result[completedAt.getFullYear()][completedAt.getMonth() + 1].push(order);
    });

    setStoreOrdersSorted(result);
  }, [selectedStore]);

  useEffect(() => {
    if (chartReference.current) {
      chartReference.current?.destroy();
    }

    if (!ordersByQuery.length) {
      return;
    }

    const orders = ordersByQuery;
    const result = {};

    orders.forEach((order) => {
      result[order.item.name] ||= 0;
      result[order.item.name] = result[order.item.name] + order.quantity;
    });

    const c = new Chart(document.getElementById("ss-chart"), {
      type: "doughnut",
      data: {
        labels: Object.keys(result).map((v) => v),
        datasets: [
          {
            label: "QTY shipped this month",
            data: Object.values(result).map((v) => v),
          },
        ],
      },
    });

    chartReference.current = c;
  }, [ordersByQuery]);

  useEffect(() => {
    if (!selectedMonth || !selectedYear) {
      setOrdersByQuery([]);
      return;
    }

    setOrdersByQuery(storeOrdersSorted[selectedYear][selectedMonth]);
  }, [selectedMonth, selectedYear]);

  console.log(ordersByQuery);

  return (
    <div className="home-parent">
      <div className="home-krink">{selectedStore?.name}</div>

      <div className="store-selectcontainer">
        <div className="pio-rel store-rel">
          <div
            className="store-select"
            onClick={() => setShowYear((prev) => !prev)}
            id="ss-year"
          >
            {selectedYear || "Select a year"}
            <div className="grow" />
            <div className="mitem-caret" />

            {showYear && (
              <div className="pio-selch store-pelch">
                {Object.keys(storeOrdersSorted).map((v) => (
                  <div
                    className="pio-ch store-ch"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedYear(v);
                      setSelectedMonth(null);
                      setShowYear(false);
                    }}
                  >
                    {v}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="store-wi" />
        <div className="pio-rel store-rel">
          <div
            className="store-select"
            onClick={() => {
              if (selectedYear) {
                setShowMonth((prev) => !prev);
              }
            }}
            id="ss-month"
          >
            {months[selectedMonth] || "Select a Month"}
            <div className="grow" />
            <div className="mitem-caret" />

            {selectedYear && showMonth && (
              <div className="pio-selch store-pelch">
                {Object.keys(storeOrdersSorted[selectedYear]).map((v) => (
                  <div
                    className="pio-ch store-ch"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMonth(v);
                      setShowMonth(false);
                    }}
                  >
                    {months[v]}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <canvas id="ss-chart"></canvas>
      </div>
    </div>
  );
};

export default SingleStore;
