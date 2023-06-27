import React, { useEffect, useState } from "react";

import $ from "jquery";
import { useSelector } from "react-redux";

const FilterElement = ({
  dateRangeFilter,
  setDateRangeFilter,
  storeFilter,
  setStoreFilter,
  results,
  showFilter,
  handleApplyFilter,
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

  useEffect(() => {
    $("#fe-startc").css("top", $("#fe-start").outerHeight() - 1);
  }, [showStart]);

  useEffect(() => {
    $("#fe-endc").css("top", $("#fe-end").outerHeight() - 1);
  }, [showEnd]);

  useEffect(() => {
    $("#fe-storec").css("top", $("#fe-store").outerHeight() - 1);
  }, [showStore]);

  console.log(afterStartDate);

  return (
    <div
      className="pio-rel fe-parent"
      style={{
        maxHeight: showFilter ? "210px" : 0,
        overflow: !showFilter && "hidden",
      }}
    >
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
              {storeFilter?.name || "Select Store"}

              <div className="grow" />
              <div className="mitem-caret" />
            </div>

            {showStore && (
              <div className="pio-selch pi-qpa" id="fe-storec">
                {allStores.map((store, i, a) => (
                  <div
                    className="pio-ch"
                    style={{ borderBottom: i === a.length - 1 && "none" }}
                    onClick={() => {
                      setStoreFilter(store);
                      setShowStore(false);
                    }}
                  >
                    {store.name}
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
