import React from "react";

const LoadingComponent = () => {
  return (
    <div
      className="abs-loading"
      style={{ position: "fixed", backgroundColor: "black" }}
    >
      <div className="lds-ring" id="spinner-form">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingComponent;
