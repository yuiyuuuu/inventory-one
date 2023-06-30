import React, { useState } from "react";

import { makePostRequest } from "../../requests/requestFunctions";

import "./mass.scss";

import MassEditMap from "./MassEditMap";
import XIcon from "../../global/XIcon";

const MassAddOverlay = ({
  setShowMassOverlay,
  showMassOverlay,
  setAllProducts,
  currentList,
}) => {
  const [result, setResult] = useState([]);

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!result.length) return;

    const obj = {
      listid: currentList.id,
      result: result,
    };

    setLoading(true);

    await makePostRequest("/item/create/mass", obj)
      .then((res) => {
        alert("Products Added");

        setShowMassOverlay(false);
        setAllProducts(res.item);
        setLoading(false);
        document.querySelector("html").style.overflow = "";
      })
      .catch(() => {
        alert("Something went wrong, try again");
        setLoading(false);
        document.querySelector("html").style.overflow = "";
      });
  }

  return (
    <div
      className="home-createoverlay"
      style={{ display: !showMassOverlay && "none" }}
    >
      <div className="homec-inner">
        <div className="homec-l" style={{ padding: "10px" }}>
          Mass Add
        </div>

        <div className="mass-con">
          {result.map((item, i) => (
            <MassEditMap
              item={item}
              result={result}
              setResult={setResult}
              index={i}
            />
          ))}
        </div>

        <button
          className="mass-add mass-but"
          onClick={() =>
            setResult((prev) => [
              ...prev,
              { name: "", quantity: 0, image: null, units: null },
            ])
          }
        >
          Add Product
        </button>

        <button
          className="mass-add mass-but homec-but"
          onClick={() => handleSubmit()}
        >
          Submit
        </button>

        <XIcon
          top={"21px"}
          right={"30px"}
          func={function () {
            setShowMassOverlay(false);
            document.querySelector("html").style.overflow = "";
          }}
        />
      </div>

      <div
        className="homec-clickback"
        onClick={() => {
          setShowMassOverlay(false);
          document.querySelector("html").style.overflow = "";
        }}
      />

      {loading && (
        <div className="submit-loading">
          <div className="lds-ring" id="spinner-form">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MassAddOverlay;
