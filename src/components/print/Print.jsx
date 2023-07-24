import React from "react";
import { useEffect } from "react";
import { makePutRequest } from "../requests/requestFunctions";

import "./print.scss";

const Print = () => {
  async function handleClick() {
    await makePutRequest("print/uploadpdf").then((res) => {
      console.log(res);
    });
  }

  //   useEffect(() => {
  //     const ele = document.querySelector(".home-krink");

  //     if (!ele) return;
  //     console.log(ele);
  //     const newwindow = window.open("", "Print-window");
  //     newwindow.document.open();

  //     newwindow.document.write(
  //       '<html><body onload="window.print()"> <div class = ' +
  //         ele.className +
  //         ">" +
  //         ele.innerHTML +
  //         "</body></html>"
  //     );
  //   }, [document.querySelector(".home-krink")]);

  return (
    <div className='home-parent'>
      <img className='home-logo' src='/assets/logo.jpeg' id='test-mainlogo' />
      <div className='home-krink'>Inventory Print</div>

      <button onClick={() => handleClick()}>Upload Test</button>
    </div>
  );
};

export default Print;
