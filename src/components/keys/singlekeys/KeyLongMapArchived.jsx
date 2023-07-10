import React from "react";
import { makePutRequest } from "../../requests/requestFunctions";

const KeyLogMapArchived = ({ keylog }) => {
  const time = new Date(keylog.takeTime).toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });
  const time2 = new Date(keylog.returnTime).toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

  return (
    <div className="kh-mapch">
      <div className="kh-bord ellipsis">
        {keylog.name.toUpperCase()}
        {keylog.memo && (
          <div className="kh-t ellipsis">Memo: {keylog.memo}</div>
        )}{" "}
        <div className="kh-t">Checked Out: {time}</div>
        <div className="kh-t">Returned: {time2}</div>
      </div>
    </div>
  );
};

export default KeyLogMapArchived;
