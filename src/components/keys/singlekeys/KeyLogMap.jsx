import React from "react";
import { makePutRequest } from "../../requests/requestFunctions";

const KeyLogMap = ({ keylog, setSelectedStore }) => {
  const time = new Date(keylog.takeTime);

  const str = `${
    time.getMonth() < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1
  }/${time.getDate()}/${time.getFullYear()}`;

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
      await makePutRequest("keys/return", obj)
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

  console.log(keylog);

  return (
    <div className="kh-mapch">
      <div className="kh-b">
        <div className="kh-bord2">
          {keylog.name.toUpperCase()} - {str} <div className="grow" />{" "}
          <button className="home-add kh-return" onClick={() => returnKey()}>
            Return
          </button>
        </div>

        {keylog.memo && <div className="">Memo: {keylog.memo}</div>}
      </div>
    </div>
  );
};

export default KeyLogMap;
