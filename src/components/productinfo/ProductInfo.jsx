import React, { useEffect, useRef, useState, useCallback } from "react";

import "./pi.scss";

import Chart from "chart.js/auto";

import { monthDiff } from "../../requests/helperFunctions";

import $ from "jquery";

import Filtericon from "./svg/Filtericon";
import FilterElement from "./FilterElement";
import PiOrders from "./orders/PiOrders";
import OrderChildStore from "./orderChildStore/OrderChildStore";
import PiShipments from "./shipments/PiShipments";

const ProductInfo = ({ data, setShowSingleProduct }) => {
  //reference to chart so we can destroy
  const chartRef = useRef(null);

  const [resultsSortedByDate, setResultsSortedByDate] = useState({});

  const [noHistory, setNoHistory] = useState(false);

  //SHOW HEIGHT STATES
  const [showStats, setShowStats] = useState(true);
  const [showOrders, setShowOrders] = useState(false);
  const [showShipments, setShowShipments] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showChartTypeSelect, setShowChartTypeSelect] = useState(false);

  //prediction info states
  const [average180, setAverage180] = useState(null);
  const [oosDays, setOosDays] = useState(null);

  //filter states
  const [filterActive, setFilterActive] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [dateRangeFilter, setDateRangeFilter] = useState({
    start: null,
    end: null,
  });
  const [storeFilter, setStoreFilter] = useState([]);

  //chart type
  const [chartType, setChartType] = useState("orders"); //orders or quantity

  const [showFilterDropDown, setShowFilterDropDown] = useState(false);
  const [filterResults, setFilterResults] = useState([]);

  //print chart type
  const [printChartType, setPrintChartType] = useState(null);
  const [showPrintChartType, setShowPrintChartType] = useState(false);

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

  function handleApplyFilter() {
    if (!dateRangeFilter.start && !storeFilter) return; //no start date and no store = no filter

    if (!showFilterDropDown) {
      setShowFilterDropDown(true);
    }
    //make filteractive a truthy value, but change it everytime so the useeffect below will run
    //if we just set it to true, it will only run once and if the user sets a new filter without clearing, the useeffect wont run again
    setFilterActive((prev) => (!prev ? 1 : prev + 1));
  }

  function clearFilter() {
    setFilterActive(false);
    setDateRangeFilter({ start: null, end: null });
    setStoreFilter([]);
  }

  function sortOrdersByDate() {
    const sort = {};
    data.orders.forEach((v) => {
      const d = new Date(v.completedAt);
      const str = `${
        d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
      }/${d.getDate()}/${d.getFullYear()}`;

      sort[str] ||= [];
      sort[str].push(v);
    });

    setResultsSortedByDate(sort);
  }

  function clickout() {
    const $target = $(event.target);

    if (
      !$target.closest("#select-charttype").length &&
      !$target.closest("#select-charttypech").length &&
      $("#select-charttypech").is(":visible")
    ) {
      setShowChartTypeSelect(false);
    }
  }

  $(".pi-container").off(".pi-container", "click", clickout).click(clickout);

  useEffect(() => {
    if (!data.orders.length) return;
    sortOrdersByDate();
  }, [data]);

  useEffect(() => {
    find180Average();
  }, []);

  useEffect(() => {
    if (!average180) return;
    findEstimateOOSDate();
  }, [average180]);

  useEffect(() => {
    $("#printtypech").css("top", $("#printtype").outerHeight() - 6);
  }, [showPrintChartType]);

  useEffect(() => {
    $(window).resize(() => {
      setShowPrintChartType(false);
    });
  }, []);

  //orders chart type
  useEffect(() => {
    if (!data.orders) return;
    if (!data.orders.length) {
      setNoHistory(true);
      return;
    }

    if (!Object.keys(resultsSortedByDate).length) return;

    //not first time running, destroy previous chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    if (chartType === "orders") {
      const result = {};

      function combineDates() {
        let orders = [];
        let filterResultInformation = {};

        if (filterActive) {
          //make copy of orders
          const slice = data.orders.slice();

          slice.forEach((order) => {
            let bad = false; //bad = true means this one doesnt fit the filters

            //check if store matches filter, if store filter exists
            if (storeFilter.length > 0) {
              // if (order.store.name !== storeFilter.name) bad = true;

              const filtermap = storeFilter.map((v) => v.id);

              if (!filtermap.find((v) => v === order.store.id)) bad = true;
            }

            //checks if date range fits, if the filter exists
            if (dateRangeFilter.start) {
              const filterTimestampStart = new Date(
                dateRangeFilter.start
              ).getTime();
              const filterTimestampEnd = dateRangeFilter.end
                ? new Date(dateRangeFilter.end).getTime()
                : null;

              const d = new Date(order.completedAt);
              const str = `${
                d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
              }/${d.getDate()}/${d.getFullYear()}`;

              const orderTimeStamp = new Date(str).getTime();

              if (dateRangeFilter.start && dateRangeFilter.end) {
                //set the date range
                filterResultInformation["dateRange"] ||= `${
                  dateRangeFilter.start
                    ? dateRangeFilter.start
                    : Object.keys(resultsSortedByDate)[0]
                } - ${
                  dateRangeFilter.end
                    ? dateRangeFilter.end
                    : Object.keys(resultsSortedByDate)[
                        Object.keys(resultsSortedByDate).length - 1
                      ]
                }`;

                if (orderTimeStamp < filterTimestampStart) {
                  bad = true;
                }

                if (orderTimeStamp > filterTimestampEnd) {
                  bad = true;
                }
              } else if (dateRangeFilter.start) {
                //set the date range
                filterResultInformation["dateRange"] ||= `${
                  dateRangeFilter.start
                    ? dateRangeFilter.start
                    : Object.keys(resultsSortedByDate)[0]
                } - ${
                  dateRangeFilter.end
                    ? dateRangeFilter.end
                    : // : Object.keys(resultsSortedByDate)[
                      //     Object.keys(resultsSortedByDate).length - 1
                      //   ]
                      "-"
                }`;

                if (orderTimeStamp < filterTimestampStart) {
                  bad = true;
                }
              }
            }

            //if the bad var flag was never changed to true, then this fits our criterias and we can push it to results
            if (!bad) {
              orders.push(order);
            }
          });
        } else {
          //if this function call is not for filtering, set orders as all orders
          orders = data.orders;
        }

        filterResultInformation["orders"] ||= {};
        filterResultInformation["quantity"] ||= 0;

        orders.forEach((v) => {
          const d = new Date(v.completedAt);

          if (monthDiff(d, new Date()) > 7) {
            return;
          }

          const str = `${
            d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
          }/${d.getDate()}/${d.getFullYear()}`;

          result[str] ||= { store: [], user: [], quantity: 0 };
          result[str] = {
            store: [...new Set([...result[str].store, v.store.name])],
            user: [...new Set([...result[str].user, v.user.name])],
            quantity: result[str].quantity + v.quantity,
          };

          //change this part if we need individual qty of every store
          filterResultInformation["orders"][str] ||= [];
          filterResultInformation["orders"][str].push(v);

          filterResultInformation["quantity"] += v.quantity;
        });

        //set the results to display, only will be used if filter is active
        setFilterResults({
          ...filterResultInformation,
          storeFilter: storeFilter,
        });
      }

      combineDates();

      //sort result object by date
      const re = {};

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

      const chart = new Chart(document.getElementById("pi-parent"), {
        type: "bar",
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                footer: (v) => {
                  return `Completed By ${Object.values(re)[
                    v[0].dataIndex
                  ].user.join(", ")}
Stores: ${
                    Object.values(re)[v[0].dataIndex].store?.length
                      ? Object.values(re)[v[0].dataIndex].store.join(", ")
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

              grid: {
                color: "white",
              },
            },

            y: {
              ticks: {
                color: "white",
              },

              grid: {
                color: "white",
              },
            },
          },

          onClick: (e, a) => {
            setSelectedDate((prev) =>
              a[0]?.index >= 0 ? Object.keys(re)[a[0]?.index] : prev
            );

            setShowOrders(true);
          },

          responsive: true,
        },
        data: {
          labels: Object.keys(re),
          datasets: [
            {
              label: " # Completed by Date",
              data: Object.values(re).map((v) => v.quantity),
              backgroundColor: "#B41717",
              hoverBackgroundColor: "rgba(0, 255, 255)",
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

      data.orders.forEach((order) => {
        const d = new Date(order.completedAt);

        if (
          re[`${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`] >= 0
        ) {
          re[`${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`] +=
            order.quantity;
        }
      });

      const allShipments = data.shipments;

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
      set(c[c.length - 1], data.quantity, c.length - 1);

      const chart = new Chart(document.getElementById("pi-parent"), {
        type: "line",
        options: {
          plugins: {
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

              grid: {
                color: "white",
              },
            },

            y: {
              ticks: {
                color: "white",
              },
              grid: {
                color: "white",
              },

              grace: "10%",
            },
          },

          responsive: true,
          borderColor: "white",
          borderWidth: 2,
        },
        data: {
          labels: Object.keys(final),
          datasets: [
            {
              label: "Quantity by Month",
              data: Object.values(final).map((v) => v),
              backgroundColor: "#B41717",
              hoverBackgroundColor: "rgba(0, 255, 255)",
              pointRadius: 4,
            },

            // {
            //   label: "Orders",
            //   showLine: false,
            //   pointRadius:
            // },
          ],
        },
      });

      chartRef.current = chart;
    }
  }, [data, filterActive, resultsSortedByDate, chartType]);

  useEffect(() => {
    if (showOrders) {
      $("#pi-orders").css("max-height", $(".pio-parent").outerHeight());
    } else {
      $("#pi-orders").css("max-height", 0);
    }
  }, [showOrders, selectedDate]);

  return (
    <div
      className="pi-container"
      onClick={() => {
        setShowSingleProduct(false);
        document.querySelector("html").style.overflow = "";
      }}
    >
      <div className="pi-canvascontainer" onClick={(e) => e.stopPropagation()}>
        {!noHistory && (
          <div
            className="pio-select"
            style={{ maxWidth: "40%", margin: "0 auto 20px" }}
            id="select-charttype"
            onClick={() => setShowChartTypeSelect((prev) => !prev)}
          >
            {chartType[0].toUpperCase() + chartType.slice(1)}
            <div className="grow" />
            <div className="mitem-caret" />

            {showChartTypeSelect && (
              <div
                className="pio-selch"
                style={{
                  top: $("#select-charttype").outerHeight() - 2,
                  width: "calc(100% + 2px)",
                  margin: 0,
                  left: "-1px",
                }}
                onClick={(e) => e.stopPropagation()}
                id="select-charttypech"
              >
                <div
                  className="pio-ch"
                  onClick={() => {
                    setChartType("orders");
                    setShowChartTypeSelect(false);
                  }}
                >
                  Orders
                </div>
                <div
                  className="pio-ch"
                  style={{ border: "none" }}
                  onClick={() => {
                    setChartType("quantity");
                    setShowChartTypeSelect(false);
                  }}
                >
                  Quantity
                </div>
              </div>
            )}
          </div>
        )}

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

          <div className="pi-sec pi-mar30l">
            <div className="pi-ti">
              {data.name} <div className="grow" />
              {showFilter && (
                <div className="pi-cf" onClick={() => clearFilter()}>
                  Clear Filter
                </div>
              )}
              <Filtericon
                size={26}
                oc={function () {
                  setShowFilter((prev) => !prev);
                }}
              />
            </div>

            <FilterElement
              dateRangeFilter={dateRangeFilter}
              setDateRangeFilter={setDateRangeFilter}
              setStoreFilter={setStoreFilter}
              storeFilter={storeFilter}
              results={resultsSortedByDate}
              showFilter={showFilter}
              handleApplyFilter={handleApplyFilter}
              filterActive={filterActive}
              filterResults={filterResults}
            />

            {filterResults?.orders &&
              Object.keys(filterResults.orders)?.length > 0 &&
              filterActive && (
                <div
                  className="pi-octoggle"
                  onClick={() => setShowFilterDropDown((prev) => !prev)}
                >
                  Filter Results <div className="grow" />
                  <div
                    className="mitem-caret"
                    style={{
                      transform: !showFilterDropDown && "rotate(-90deg)",
                    }}
                  />
                </div>
              )}

            {filterResults?.orders &&
              Object.keys(filterResults.orders)?.length > 0 &&
              filterActive && (
                <div
                  style={{
                    maxHeight: showFilterDropDown ? "450px" : 0,
                    marginBottom: showFilterDropDown && "30px",
                    overflowY: showFilterDropDown && "scroll",
                  }}
                  className="pi-w"
                >
                  <div className="pi-sub">
                    Date Range:{" "}
                    {filterResults.dateRange
                      ? filterResults.dateRange
                      : "No Dates Selected"}
                  </div>
                  <div className="pi-sub">
                    Stores:{" "}
                    {filterResults.storeFilter.length > 0
                      ? filterResults.storeFilter
                          .map((v, i) => (i !== 0 ? " " + v?.name : v?.name))
                          ?.toString()
                      : "Any"}
                  </div>
                  <div className="pi-sub">
                    Total Quantity: {filterResults.quantity}
                  </div>
                  {Object.keys(filterResults.orders)
                    .sort(function (a, b) {
                      const adate = new Date(a);
                      const bdate = new Date(b);

                      if (adate < bdate) return -1;
                      if (adate > bdate) return 1;
                      return 0;
                    })
                    ?.map((date, i) => (
                      <OrderChildStore
                        date={date}
                        order={Object.values(filterResults.orders)[i]}
                      />
                    ))}
                </div>
              )}

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
              <div className="pi-sub">Category: {data.category.name}</div>

              <div className="pi-sub">Current Quantity: {data.quantity}</div>
              <div className="pi-sub">History Quantity: {data.historyQTY}</div>
              <div className="pi-sub">
                Average per day (last 180 days): {average180}
              </div>
              <div className="pi-sub">
                Predicted OOS day:{" "}
                {data.quantity === 0
                  ? "Out of Stock"
                  : data.historyQTY === 0
                  ? "No History"
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
              className="pi-octoggle"
              onClick={() => setShowShipments((prev) => !prev)}
              style={{ marginTop: "5px", marginBottom: "8px" }}
            >
              Shipments <div className="grow" />
              <div
                className="mitem-caret"
                style={{ transform: !showShipments && "rotate(-90deg)" }}
              />
            </div>

            <div
              style={{
                maxHeight:
                  data?.shipments?.length < 1
                    ? showShipments
                      ? "50px"
                      : 0
                    : showShipments
                    ? data?.shipments?.length * 200 + "px"
                    : 0,
              }}
              className="pi-w"
            >
              {data?.shipments?.length < 1 ? (
                <div className="pi-sub">No shipments for this item</div>
              ) : (
                data?.shipments
                  ?.sort(function (a, b) {
                    //sort by most recent to oldest
                    const ad = new Date(a.shipmentDate).getTime();
                    const bd = new Date(b.shipmentDate).getTime();

                    return bd - ad;
                  })
                  ?.map((item) => <PiShipments data={item} />)
              )}
            </div>

            <div
              className="pi-octoggle"
              onClick={() => {
                setShowOrders((prev) => !prev);
              }}
              style={{ marginBottom: "8px", marginTop: "5px" }}
            >
              Orders <div className="grow" />
              <div
                className="mitem-caret"
                style={{ transform: !showOrders && "rotate(-90deg)" }}
              />
            </div>

            <div
              style={{
                overflowY: "unset",
                minHeight: "30vh",
              }}
              className="pi-w"
              id="pi-orders"
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

        <div
          className="flex-justcenter"
          style={{
            marginTop: "20px",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div className="pio-rel" id="printtype">
            <div
              className="pio-select"
              onClick={() => setShowPrintChartType((prev) => !prev)}
            >
              {printChartType || "Chart Type to Print"}

              <div className="grow" />

              <div
                className="mitem-caret"
                style={{ transform: !showPrintChartType && "rotate(-90deg)" }}
              />
            </div>

            {showPrintChartType && (
              <div className="pio-selch" id="printtypech">
                <div
                  className="pio-ch"
                  onClick={() => {
                    setPrintChartType("History Usage");
                    setShowPrintChartType(false);
                  }}
                >
                  History Usage
                </div>
                <div
                  className="pio-ch"
                  onClick={() => {
                    setPrintChartType("History Quantity");
                    setShowPrintChartType(false);
                  }}
                >
                  History Quantity
                </div>
              </div>
            )}
          </div>

          <div
            className="pi-print"
            target="_blank"
            onClick={() => {
              if (!printChartType) return;

              const a = document.createElement("a");
              a.href = `/lists/print/${data.id}/?type=${
                printChartType === "History Usage" ? "usage" : "quantity"
              }`;
              a.rel = "noreferrer";
              a.target = "_blank";
              window.open(a);
            }}
          >
            Print
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
