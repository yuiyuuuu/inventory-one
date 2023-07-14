import React from "react";
import { makePutRequest } from "../../requests/requestFunctions";

const KeyLogMap = ({ keylog, setSelectedStore }) => {
  const time = new Date(keylog.takeTime);

  const c = new Date(time).toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

  async function returnKey() {
    const obj = {
      keyLogId: keylog.id,
      returnTime: new Date(),
      storeId: keylog.storeId,
    };

    const result = confirm(
      `Confirm return key for ${keylog.name.toUpperCase()}?`
    );

    if (result) {
      await makePutRequest(`keys/return/${import.meta.env.VITE_ROUTEPASS}`, obj)
        .then((res) => {
          if (res.id) {
            setSelectedStore(res);
          }
        })
        .catch(() => {
          alert("Something went wrong, please try again");
        });
    }
  }

  return (
    <div className="kh-mapch">
      <div className="kh-b">
        <div className="kh-bord2">
          {keylog.name.toUpperCase()} - {c} <div className="grow" />{" "}
          <button className="home-add kh-return" onClick={() => returnKey()}>
            Return
          </button>
        </div>

        {keylog.memo && <div className="ellipsis">Memo: {keylog.memo}</div>}
      </div>
    </div>
  );
};

export default KeyLogMap;
