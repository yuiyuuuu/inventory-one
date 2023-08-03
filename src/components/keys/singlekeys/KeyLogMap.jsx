import React from "react";
import {
  makePutRequest,
  makePutRequestWithAuth,
} from "../../../requests/helperFunctions";

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
      await makePutRequestWithAuth(
        `keys/return`,
        obj,
        import.meta.env.VITE_ROUTEPASS
      )
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
    <div className='kh-mapch'>
      <div className='kh-b'>
        <div className='kh-bord2'>
          <span className='kh-wp ellipsis'>{keylog.name.toUpperCase()}</span> -
          <span className='kh-wpi'>{c}</span> <div className='grow' />{" "}
          <button className='home-add kh-return' onClick={() => returnKey()}>
            Return
          </button>
        </div>

        {keylog.memo && (
          <div className='ellipsis kh-bord2'>Memo: {keylog.memo}</div>
        )}
      </div>
    </div>
  );
};

export default KeyLogMap;
