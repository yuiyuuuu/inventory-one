import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { makePutRequest } from "../../requests/helperFunctions";

import "./print.scss";

import CreatePrintOverlay from "./CreatePrintOverlay";

const Print = () => {
  const nav = useNavigate();

  const authState = useSelector((state) => state.auth);

  const [showCreatePrint, setShowCreatePrint] = useState(false);

  async function handleClick() {
    await makePutRequest("print/uploadpdf").then((res) => {});
  }

  if (authState.loading && authState.loading !== "false") {
    return (
      <div className="abs-loading2">
        <div className="lds-ring" id="spinner-form">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (!authState.id) {
    return (
      <div className="home-parent">
        <img className="home-logo" src="/assets/logo.jpeg" id="test-mainlogo" />
        <div className="home-krink">Print Forms</div>{" "}
        <div className="home-none">
          <a className="home-siredir" href="/login">
            Log in
          </a>{" "}
          to print
        </div>
      </div>
    );
  }

  return (
    <div className="home-parent">
      <img className="home-logo" src="/assets/logo.jpeg" id="test-mainlogo" />
      <div className="home-krink">Print Forms</div>

      <div className="home-f home-lp">
        <span>Print Lists</span>
        <div className="grow" />
        <div
          className="home-add home-create"
          onClick={() => setShowCreatePrint(true)}
        >
          Create
        </div>

        <div
          className="home-add home-create"
          style={{ marginLeft: "8px", background: "orange" }}
          onClick={() => {
            const a = document.createElement("a");
            a.href =
              "https://docs.google.com/document/d/10eiJwNlS7E7mueOMVcZTGHvDfQTOIYqbd6BnVIdS-2Q/edit?usp=sharing";
            a.target = "_blank";
            a.rel = "noreferrer";
            a.click();
          }}
        >
          Guide
        </div>
      </div>

      {authState?.print?.length > 0 ? (
        <div className="store-mapc">
          {authState?.print?.map((print) => (
            <div
              className="store-map"
              onClick={() => nav(`/print/${print?.id}`)}
            >
              <div className="store-name">
                {print?.name}
                <div className="print-f">{print.printFiles?.length} Files</div>
              </div>
              <div className="grow" />
              <div
                className="mitem-caret"
                style={{ transform: "rotate(-90deg)" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="print-no">You have no print lists</div>
      )}

      {showCreatePrint && (
        <CreatePrintOverlay setShowCreatePrint={setShowCreatePrint} />
      )}
    </div>
  );
};

export default Print;
