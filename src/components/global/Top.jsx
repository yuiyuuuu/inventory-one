import React from "react";
import { useNavigate } from "react-router";

const Top = ({ text, href }) => {
  const nav = useNavigate();

  return (
    <div
      className='v-topcon'
      onClick={() => href && nav(href)}
      style={{ cursor: href && "pointer" }}
    >
      <img className='home-logo' src='/assets/logo.jpeg' />
      <div className='home-krink'>{text}</div>
    </div>
  );
};

export default Top;
