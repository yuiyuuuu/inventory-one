import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { makeGetRequest } from "../../requests/requestFunctions";

import printJs from "print-js-kiosk-delay";

const PrintList = () => {
  const params = useParams();

  useEffect(() => {
    async function init() {
      const list = await makeGetRequest(
        `print/fetch/${params.id}/${import.meta.env.VITE_ROUTEPASS}`
      )
        .then(async (res) => {
          if (res === "not found") {
            alert("List not found!");
            return;
          }

          if (res === "access denied") {
            alert("Something went wrong");
            return;
          }

          const files = res.printFiles;

          const result = [];

          let outeri = 0;
          async function outerloop() {
            await makeGetRequest(
              `print/gets3/${res.name}/${files[outeri].pathName.slice(
                res?.name?.length + 1
              )}/${import.meta.env.VITE_ROUTEPASS}`
            )
              .then(async (res) => {
                if (res === "error") {
                  throw new Error();
                }
                const base64 = await fetch(
                  "data:application/w+;base64," + atob(res)
                )
                  .then((resp) => resp.blob())
                  .then((response) => {
                    for (let b = 0; b < params.qty; b++) {
                      //push the link into result array, # of times is the set qty
                      result.push(URL.createObjectURL(response));
                    }
                  });
              })
              .catch((err) => {
                alert("Something went wrong, please try again");
              });

            outeri++;

            if (outeri < files.length) {
              //if more files, run again
              outerloop();
            } else {
              function loop(count) {
                setTimeout(() => {
                  printJs(result[count]);

                  if (count < params.qty * files.length - 1) {
                    loop(count + 1);
                  } else {
                    setTimeout(() => {
                      alert("Finished Printing");

                      window.close();
                    }, 2500);
                  }
                }, 1800);
              }

              loop(0);
            }
          }

          await outerloop();
        })
        .catch((err) => {
          console.log(err);
          alert("Something went wrong, please try again");
        });
    }

    init();
  }, []);

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
};

export default PrintList;
