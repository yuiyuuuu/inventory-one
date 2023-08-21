import React, { useEffect, useState } from "react";
import {
  makeGetRequest,
  makeGetRequestWithAuth,
  makePutRequest,
  makePutRequestWithAuth,
} from "../../requests/helperFunctions";

const ReturnKeyOverlay = ({ setShowReturnOverlay }) => {
  const [activeKeyLogs, setActiveKeyLogs] = useState([]);

  const [sortedLogs, setSortedLogs] = useState({});

  async function returnKey(logid, name) {
    const obj = {
      keyLogId: logid,
      returnTime: new Date(),
    };

    const c = await makePutRequestWithAuth(
      `keys/returnfromoverlay`,
      obj,
      import.meta.env.VITE_ROUTEPASS
    )
      .then((res) => {
        if (res === "access denied") throw new Error("access denied");

        if (res) {
          setActiveKeyLogs(res);
          alert("Returned for " + name);
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

  useEffect(() => {
    async function fetch() {
      const c = await makeGetRequestWithAuth(
        `keys/fetch/active`,
        import.meta.env.VITE_ROUTEPASS
      ).then((res) => {
        if (res.length > 0) {
          setActiveKeyLogs(res);
        }
      });
    }

    fetch();
  }, []);

  useEffect(() => {
    if (activeKeyLogs.length < 1) return;

    const result = {};

    activeKeyLogs.forEach((log) => {
      result[log.store.name] ||= [];

      result[log.store.name].push(log);
    });

    setSortedLogs(result);
  }, [activeKeyLogs]);

  return (
    <div
      className="home-createoverlay"
      onClick={() => {
        document.querySelector("html").style.overflow = "";
        setShowReturnOverlay(false);
      }}
    >
      <div className="homec-inner kh-rko" onClick={(e) => e.stopPropagation()}>
        <div className="homec-l">Return Key</div>

        {activeKeyLogs?.length > 0 ? (
          <div className="kh-start">
            {Object.keys(sortedLogs)
              .sort(function (a, b) {
                const num1 = Number(a.slice(0, 2));
                const num2 = Number(b.slice(0, 2));

                if (num1 > num2) return 1;
                if (num1 < num2) return -1;
                return 0;
              })
              ?.map((key) => (
                <div className="pio-inner">
                  <div
                    className="pio-bbot pi-fs"
                    style={{ borderBottomColor: "red" }}
                  >
                    {key}
                  </div>

                  <div className="kh-j">
                    {sortedLogs[key].map((log) => (
                      <div
                        className="kh-mapch"
                        style={{ width: "100%" }}
                        onClick={() =>
                          (window.location.href = `/keys/${log.store.id}`)
                        }
                      >
                        <div className="kh-b">
                          <div className="kh-bord2 kh-bordfont">
                            <span className="kh-wp ellipsis">
                              {log.name.toUpperCase()} &nbsp;-&nbsp;
                            </span>{" "}
                            <span className="kp-wpi">
                              {" "}
                              {new Date(new Date(log.takeTime)).toLocaleString(
                                "en-US",
                                {
                                  timeZone: "America/Chicago",
                                }
                              )}
                            </span>
                            <div className="grow" />{" "}
                            <button
                              className="home-add kh-return"
                              onClick={(e) => {
                                e.stopPropagation();
                                returnKey(log.id, log.name);
                              }}
                            >
                              Return
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="kh-no">No active key logs</div>
        )}
      </div>
    </div>
  );
};

export default ReturnKeyOverlay;
