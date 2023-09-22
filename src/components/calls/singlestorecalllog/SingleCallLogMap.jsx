import React, { useEffect, useState } from "react";

const SingleCallLogMap = ({ info, setShowEdit, setEditInfo }) => {
  const [show, setShow] = useState(false);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight($(`#log-pre-${info.id}`).outerHeight());
  }, [$(`#log-pre-${info.id}`)]);

  return (
    <div className="ss-out" id={`call-${info.id}`}>
      <div
        className="ss-firstmap"
        style={{ borderColor: "white" }}
        onClick={() => {
          setShow((prev) => !prev);
        }}
      >
        {info.name} - {info.title} -{" "}
        {new Date(info?.createdAt).toLocaleString("en-US", {
          timeZone: "America/Chicago",
        })}
        <div className="grow" />
        <div
          className="home-add qr-edit"
          style={{ marginRight: "10px" }}
          onClick={(e) => {
            e.stopPropagation();
            setShowEdit(true);
            setEditInfo(info);
          }}
        >
          Edit
        </div>
        <div
          className="mitem-caret"
          style={{ transform: !show && "rotate(-90deg)" }}
        ></div>
      </div>

      <div
        className="ss-selectedordermap"
        style={{ maxHeight: show ? height : 0 }}
      >
        <pre id={`log-pre-${info.id}`}>{info.body}</pre>
      </div>
    </div>
  );
};

export default SingleCallLogMap;
