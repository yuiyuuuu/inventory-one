import React, { useState } from "react";
import XIcon from "../../global/XIcon";
import { makePostRequest } from "../../requests/requestFunctions";

import "./mass.scss";

import MassEditMap from "./MassEditMap";

const MassAddOverlay = ({
  setShowMassOverlay,
  showMassOverlay,
  setAllProducts,
  fetchProducts,
}) => {
  const [result, setResult] = useState([]);

  async function handleSubmit() {
    const obj = result;

    await makePostRequest("/item/create/mass", obj).then(() => {
      setShowMassOverlay(false);

      fetchProducts();
    });
  }

  return (
    <div
      className='home-createoverlay'
      style={{ display: !showMassOverlay && "none" }}
    >
      <div className='homec-inner' style={{ padding: "6px" }}>
        <div className='homec-l' style={{ padding: "10px" }}>
          Mass Add
        </div>

        <div className='mass-con'>
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
          className='mass-add mass-but'
          onClick={() =>
            setResult((prev) => [
              ...prev,
              { name: "", quantity: 0, image: null },
            ])
          }
        >
          Add Product
        </button>

        <button
          className='mass-add mass-but homec-but'
          onClick={() => handleSubmit()}
        >
          Submit
        </button>

        <XIcon
          top={"21px"}
          right={"30px"}
          func={function () {
            return setShowMassOverlay(false);
          }}
        />
      </div>

      <div
        className='homec-clickback'
        onClick={() => {
          setShowMassOverlay(false);
        }}
      />
    </div>
  );
};

export default MassAddOverlay;
