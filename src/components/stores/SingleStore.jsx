import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  makeGetRequest,
  makeGetRequestWithAuth,
} from "../../requests/helperFunctions";

import Chart from "chart.js/auto";

import $ from "jquery";

import SingleStoreMap from "./SingleStoreMap";

import { readFile, utils } from "xlsx";

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

  const authState = useSelector((state) => state.auth);

  const [selectedStore, setSelectedStore] = useState({});
  const [storeOrdersSorted, setStoreOrdersSorted] = useState({});

  const [selectedList, setSelectedList] = useState(null);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const [showSelectList, setShowSelectList] = useState(false);
  const [showMonth, setShowMonth] = useState(false);
  const [showYear, setShowYear] = useState(false);

  const [ordersByQuery, setOrdersByQuery] = useState([]);
  const [sortedOrders, setSortedOrders] = useState([]);

  const [noStore, setNoStore] = useState({ loading: true, notfound: false });

  const clickoutList = useCallback((e) => {
    const $target = $(event.target);
    if (
      !$target.closest("#showlist").length &&
      !$target.closest("#ss-list").length &&
      $("#showlist").is(":visible")
    ) {
      setShowSelectList(false);
    }
  }, []);

  const clickoutYear = useCallback((e) => {
    const $target = $(event.target);
    if (
      !$target.closest("#showyear").length &&
      !$target.closest("#ss-year").length &&
      $("#showyear").is(":visible")
    ) {
      setShowYear(false);
    }
  }, []);

  const clickoutMonth = useCallback(() => {
    const $target = $(event.target);

    if (
      !$target.closest("#showmonth").length &&
      !$target.closest("#ss-month").length &&
      $("#showmonth").is(":visible")
    ) {
      setShowMonth(false);
    }
  }, []);

  $(document).off("click", document, clickoutList).click(clickoutList);
  $(document).off("click", document, clickoutYear).click(clickoutYear);
  $(document).off("click", document, clickoutMonth).click(clickoutMonth);

  useEffect(() => {
    const id = params.id;
    if (!authState.id) {
      setNoStore({ loading: false, notfound: false });
      return;
    }

    const fetch = async () => {
      const store = await makeGetRequestWithAuth(
        `/stores/fetch/${id}`,
        import.meta.env.VITE_ROUTEPASS
      )
        .then((res) => {
          if (res.id) {
            setSelectedStore(res);
            setNoStore({ loading: false, notfound: false });
          } else {
            setNoStore({ loading: false, notfound: true });
          }
        })
        .catch(() => {
          alert("Something went wrong, please refresh");
        });
    };

    fetch();
  }, [authState]);

  useEffect(() => {
    if (!selectedStore?.id) return;
    if (!selectedList?.id) return;

    const result = {};

    selectedStore.orders
      .filter((v) => v.listId === selectedList?.id)
      .forEach((order) => {
        const completedAt = new Date(order.completedAt);

        result[completedAt.getFullYear()] ||= {};
        result[completedAt.getFullYear()][completedAt.getMonth() + 1] ||= [];
        result[completedAt.getFullYear()][completedAt.getMonth() + 1].push(
          order
        );
      });

    setStoreOrdersSorted(result);
  }, [selectedStore, selectedList]);

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
      result[order.item.category.name] ||= 0;
      result[order.item.category.name] =
        result[order.item.category.name] + order.quantity;
    });

    const c = new Chart(document.getElementById("ss-chart"), {
      type: "doughnut",
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: "white",
            },
          },
        },
      },
      data: {
        labels: Object.keys(result).map((v) => v),
        datasets: [
          {
            label: " QTY shipped this month",
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

    const r = storeOrdersSorted[selectedYear][selectedMonth];

    setOrdersByQuery(r);

    const sort = {};
    r.forEach((v) => {
      const d = new Date(v.completedAt);

      const str = `${
        d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
      }/${d.getDate()}/${d.getFullYear()}`;

      sort[str] ||= [];
      sort[str].push(v);
    });

    setSortedOrders(sort);
  }, [selectedMonth, selectedYear]);

  if (noStore.loading) {
    return (
      <div className="home-parent">
        <img className="home-logo" src="/assets/logo.jpeg" />
        <div className="home-krink">Loading</div>
      </div>
    );
  }

  if (!noStore.loading && noStore.notfound) {
    return (
      <div className="home-parent">
        <img className="home-logo" src="/assets/logo.jpeg" />
        <div className="home-krink">No Store Found</div>
      </div>
    );
  }

  return (
    <div className="home-parent">
      <img
        className="home-logo"
        src="/assets/logo.jpeg"
        onClick={() => (window.location.href = "/stores")}
        style={{ cursor: "pointer" }}
      />
      {authState.loading === "false" && !authState.id ? (
        <div className="home-krink ss-n">Store Statistics</div>
      ) : (
        <div className="home-krink ss-n">Store - {selectedStore?.name}</div>
      )}

      {authState.loading === "false" && !authState.id ? (
        <div className="home-none">
          <a className="home-siredir" href="/login">
            Log in
          </a>{" "}
          to see store statistics
        </div>
      ) : (
        <div className="store-selectcontainer">
          <div className="pio-rel store-rel">
            <div
              className="store-select"
              onClick={() => setShowSelectList((prev) => !prev)}
              id="ss-list"
            >
              {selectedList?.name || "Select a List"}
              <div className="grow" />
              <div className="mitem-caret" />

              {showSelectList && (
                <div
                  className="pio-selch store-pelch"
                  style={{ top: $("#ss-list").outerHeight() - 1 }}
                  id="showlist"
                >
                  {authState?.lists?.length > 0 ? (
                    authState?.lists.map((v) => (
                      <div
                        className="pio-ch store-ch"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedList(v);
                          setShowSelectList(false);
                          setSelectedYear(null);
                          setSelectedMonth(null);
                          if (chartReference?.current)
                            chartReference.current.destroy();
                        }}
                      >
                        {v?.name}
                      </div>
                    ))
                  ) : (
                    <div className="pio-cha">You have no lists</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="store-wi" />

          <div className="store-right">
            <div
              className="pio-rel store-rel store-wid100"
              style={{ marginBottom: "20px" }}
            >
              <div
                className="store-select"
                onClick={() => {
                  if (!selectedList?.id) return;

                  setShowYear((prev) => !prev);
                }}
                id="ss-year"
              >
                {selectedYear || "Select a year"}
                <div className="grow" />
                <div className="mitem-caret" />

                {showYear && (
                  <div
                    className="pio-selch store-pelch"
                    style={{ top: $("#ss-year").outerHeight() - 1 }}
                    id="showyear"
                  >
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

            <div className="pio-rel store-rel store-wid100">
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
                  <div
                    className="pio-selch store-pelch"
                    style={{ top: $("#ss-month").outerHeight() - 1 }}
                    id="showmonth"
                  >
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
        </div>
      )}

      {selectedList && selectedMonth && selectedYear && (
        <div>
          <div className="ss-canvascontainer">
            <canvas id="ss-chart"></canvas>
          </div>

          <div className="ss-orders">
            <div
              className="home-krink"
              style={{ marginTop: "25px", marginBottom: "0" }}
            >
              Orders
            </div>

            <div className="ss-mapcontainer">
              {Object.keys(sortedOrders)?.map((date) => (
                <SingleStoreMap sortedOrders={sortedOrders} date={date} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleStore;
