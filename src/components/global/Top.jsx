import React from "react";
import { useNavigate } from "react-router";

const Top = ({ text, href }) => {
  const nav = useNavigate();

  return (
    <div className="v-topcon">
      <img
        className="home-logo"
        style={{ cursor: href && "pointer" }}
        src="/assets/logo.jpeg"
        onClick={() => href && nav(href)}
      />
      <div className="home-krink">{text}</div>
    </div>
  );
};

export default Top;
