import React, { useEffect, useRef, useState } from "react";

import "./pi.scss";

import Chart from "chart.js/auto";

import $ from "jquery";

import Filtericon from "./svg/Filtericon";
import FilterElement from "./FilterElement";
import PiOrders from "./orders/PiOrders";
import OrderChildStore from "./orderChildStore/OrderChildStore";
import PiShipments from "./shipments/PiShipments";

const ProductInfo = ({ data, setShowSingleProduct }) => {
  console.log("data", data);
  //reference to chart so we can destroy
  const chartRef = useRef(null);

  const [resultsSortedByDate, setResultsSortedByDate] = useState({});

  const [noHistory, setNoHistory] = useState(false);

  //SHOW HEIGHT STATES
  const [showStats, setShowStats] = useState(true);
  const [showOrders, setShowOrders] = useState(false);
  const [showShipments, setShowShipments] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

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

  const [showFilterDropDown, setShowFilterDropDown] = useState(false);
  const [filterResults, setFilterResults] = useState([]);

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
        d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
      }/${d.getDate()}/${d.getFullYear()}`;

      sort[str] ||= [];
      sort[str].push(v);
    });

    setResultsSortedByDate(sort);
  }

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
              d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
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
        const str = `${
          d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
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

    //add this later, will show a message
    // if (!Object.keys(re).length) {
    //   setNoHistory(true);
    //   return;
    // }

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
          },

          y: {
            ticks: {
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
  }, [data, filterActive, resultsSortedByDate]);

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

          <div className='pi-sec pi-mar30l'>
            <div className='pi-ti'>
              {data.name} <div className='grow' />
              {showFilter && (
                <div className='pi-cf' onClick={() => clearFilter()}>
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
                  className='pi-octoggle'
                  onClick={() => setShowFilterDropDown((prev) => !prev)}
                >
                  Filter Results <div className='grow' />
                  <div
                    className='mitem-caret'
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
                  className='pi-w'
                >
                  <div className='pi-sub'>
                    Date Range:{" "}
                    {filterResults.dateRange
                      ? filterResults.dateRange
                      : "No Dates Selected"}
                  </div>
                  <div className='pi-sub'>
                    Stores:{" "}
                    {filterResults.storeFilter.length > 0
                      ? filterResults.storeFilter
                          .map((v, i) => (i !== 0 ? " " + v?.name : v?.name))
                          ?.toString()
                      : "Any"}
                  </div>
                  <div className='pi-sub'>
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
              <div className='pi-sub'>Category: {data.category.name}</div>

              <div className='pi-sub'>Current Quantity: {data.quantity}</div>
              <div className='pi-sub'>History Quantity: {data.historyQTY}</div>
              <div className='pi-sub'>
                Average per day (last 180 days): {average180}
              </div>
              <div className='pi-sub'>
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
              className='pi-octoggle'
              onClick={() => setShowShipments((prev) => !prev)}
              style={{ marginTop: "5px", marginBottom: "8px" }}
            >
              Shipments <div className='grow' />
              <div
                className='mitem-caret'
                style={{ transform: !showShipments && "rotate(-90deg)" }}
              />
            </div>

            <div
              style={{
                maxHeight:
                  data?.shipments?.length < 1
                    ? "250px"
                    : showShipments
                    ? data?.shipments?.length * 200 + "px"
                    : 0,
              }}
              className='pi-w'
            >
              {data?.shipments?.length < 1 ? (
                <div className='pi-sub'>No shipments for this item</div>
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

        <div className='flex-justcenter'>
          <div
            className='pi-print'
            target='_blank'
            onClick={() => {
              const a = document.createElement("a");
              a.href = `/lists/print/${data.id}`;
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
