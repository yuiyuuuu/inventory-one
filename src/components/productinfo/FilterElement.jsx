import React, { useCallback, useEffect, useState } from "react";

import $ from "jquery";
import { useSelector } from "react-redux";
import CheckMark from "../keys/singlekeys/svg/CheckMark";

const FilterElement = ({
  dateRangeFilter,
  setDateRangeFilter,
  storeFilter,
  setStoreFilter,
  results,
  showFilter,
  handleApplyFilter,
  filterActive,
  filterResults,
}) => {
  const allStores = useSelector((state) => state.allStores);

  //show states
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [showStore, setShowStore] = useState(false);

  //show only dates AFTER the selected start date
  const [afterStartDate, setAfterStartDate] = useState([]);

  useEffect(() => {
    if (!dateRangeFilter?.start) return;

    const re = Object.keys(results).filter(
      (v) => new Date(v) > new Date(dateRangeFilter.start)
    );

    setAfterStartDate(re);
  }, [dateRangeFilter]);

  const startClickout = useCallback(() => {
    const $target = $(event.target);

    if (
      !$target.closest("#fe-start").length &&
      !$target.closest("#fe-startc").length &&
      $("#fe-startc").is(":visible")
    ) {
      setShowStart(false);
    }

    if (
      !$target.closest("#fe-end").length &&
      !$target.closest("#fe-endc").length &&
      $("#fe-endc").is(":visible")
    ) {
      setShowEnd(false);
    }

    if (
      !$target.closest("#fe-store").length &&
      !$target.closest("#fe-storec").length &&
      $("#fe-storec").is(":visible")
    ) {
      setShowStore(false);
    }
  }, []);

  //clickout event listener
  $(".pi-container")
    .off("click", ".pi-container", startClickout)
    .click(startClickout);

  useEffect(() => {
    $("#fe-startc").css("top", $("#fe-start").outerHeight() - 1);
  }, [showStart]);

  useEffect(() => {
    $("#fe-endc").css("top", $("#fe-end").outerHeight() - 1);
  }, [showEnd]);

  useEffect(() => {
    $("#fe-storec").css("top", $("#fe-store").outerHeight() - 1);
  }, [showStore]);

  return (
    <div
      className="pio-rel fe-parent"
      style={{
        maxHeight: showFilter ? "250px" : 0,
        overflow: !showFilter && "hidden",
        margin: !showFilter && 0,
      }}
    >
      {filterActive && Object.keys(filterResults.orders).length < 1 && (
        <div className="fe-nore">No Results from Query</div>
      )}
      <div className="pi-flexr">
        <div className="pi-b">
          <div className="pio-rel">
            <div
              className="pio-select"
              style={{ margin: "0 0 10px 0" }}
              id="fe-start"
              onClick={() => setShowStart((prev) => !prev)}
            >
              {dateRangeFilter?.start || "Start Date"}
              <div className="grow" />
              <div className="mitem-caret" />
            </div>

            {showStart && (
              <div className="pio-selch pi-qpa" id="fe-startc">
                <div
                  className="pio-ch"
                  onClick={() =>
                    setDateRangeFilter((prev) => {
                      setShowStart(false);
                      return { start: null, end: null };
                    })
                  }
                >
                  Unselect Date
                </div>
                {Object.keys(results).map((date, i, a) => (
                  <div
                    className="pio-ch"
                    style={{ borderBottom: i === a.length - 1 && "none" }}
                    onClick={() =>
                      setDateRangeFilter((prev) => {
                        setShowStart(false);
                        return { start: date, end: null };
                      })
                    }
                  >
                    {date}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pio-rel">
            <div
              className="pio-select"
              style={{ margin: 0 }}
              onClick={() => {
                if (!dateRangeFilter.start) return;
                setShowEnd((prev) => !prev);
              }}
              id="fe-end"
            >
              {dateRangeFilter?.end || "End Date"}

              <div className="grow" />
              <div className="mitem-caret" />
            </div>

            {dateRangeFilter?.start && showEnd && (
              <div className="pio-selch pi-qpa" id="fe-endc">
                <div
                  className="pio-ch"
                  onClick={() =>
                    setDateRangeFilter((prev) => {
                      setShowEnd(false);
                      return { ...prev, end: null };
                    })
                  }
                >
                  Unselect Date
                </div>
                {afterStartDate.map((date, i, a) => (
                  <div
                    className="pio-ch"
                    style={{ borderBottom: i === a.length - 1 && "none" }}
                    onClick={() =>
                      setDateRangeFilter((prev) => {
                        setShowEnd(false);
                        return { ...prev, end: date };
                      })
                    }
                  >
                    {date}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pi-divider" />

        <div className="pi-b">
          <div className="pio-rel">
            <div
              className="pio-select"
              style={{ margin: 0 }}
              id="fe-store"
              onClick={() => setShowStore((prev) => !prev)}
            >
              <div className="ellipsis">
                {storeFilter
                  .map((v, i) => (i !== 0 ? " " + v?.name : v?.name))
                  ?.toString() || "Select Store"}
              </div>

              <div className="grow" />
              <div className="mitem-caret" />
            </div>

            {showStore && (
              <div className="pio-selch pi-qpa" id="fe-storec">
                {/* <div
                  className="pio-ch"
                  onClick={() => {
                    setStoreFilter(null);
                    setShowStore(false);
                  }}
                >
                  Unselect Stores
                </div> */}
                {allStores.map((store, i, a) => (
                  <div
                    className="pio-ch"
                    style={{
                      borderBottom:
                        i === a.length - 1
                          ? "none"
                          : storeFilter.find((v) => v.id === store.id)?.id
                          ? "1px solid black"
                          : "",
                      backgroundColor: storeFilter.find(
                        (v) => v.id === store.id
                      )?.id
                        ? "white"
                        : "",
                      color: storeFilter.find((v) => v.id === store.id)?.id
                        ? "black"
                        : "",
                      display: "flex",
                    }}
                    onClick={() => {
                      setStoreFilter((prev) => {
                        if (prev.map((v) => v.id).includes(store.id)) {
                          return prev.filter((v) => v.id !== store.id);
                        } else {
                          return [...prev, store];
                        }
                      });
                    }}
                  >
                    {store.name}

                    <div className="grow" />
                    {storeFilter.find((v) => v.id === store.id)?.id && (
                      <CheckMark />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        className="fe-apply home-add"
        style={{ padding: 0 }}
        onClick={() => handleApplyFilter()}
      >
        Apply
      </button>
    </div>
  );
};

export default FilterElement;
