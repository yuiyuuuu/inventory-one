import React from "react";

const Background = () => {
  return (
    <img
      src="/assets/blob-scene-haikei.jpeg"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: "-1",
        width: "100%",
        height: "100vh",
      }}
    />
  );
};

export default Background;
