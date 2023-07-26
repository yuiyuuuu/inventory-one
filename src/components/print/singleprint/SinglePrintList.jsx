import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  makeGetRequest,
  makePutRequest,
} from "../../requests/requestFunctions";
import { useSelector } from "react-redux";

import PrintOverlay from "./PrintOverlay";

const SinglePrintList = () => {
  const params = useParams();

  const authState = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  const [currentPrintList, setCurrentPrintList] = useState({});

  const [showPrintOverlay, setShowPrintOverlay] = useState(false);

  //error states
  const [notFound, setNotFound] = useState(false);

  function handleInputClick() {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = handleFileChange;
    input.accept = "application/pdf";

    input.click();
  }

  async function handleFileChange(e) {
    const files = e.target.files;

    const c = confirm("Confirm add file " + files[0]?.name);

    if (!c) return;

    const toBase64 = () =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    //turn pdf into binary b64
    const b64str = await toBase64();

    await makePutRequest(`print/uploads3/${import.meta.env.VITE_ROUTEPASS}`, {
      printlist: currentPrintList,
      buffer: b64str,
      name: files[0]?.name,
    })
      .then((res) => {
        if (res === "uploaded") {
          const id = params.id;

          fetchList(id);
          location.reload();
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

  async function fetchList(id) {
    await makeGetRequest(
      `print/fetch/${id}/${import.meta.env.VITE_ROUTEPASS}`
    ).then((res) => {
      console.log(res);

      if (!res.id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (res?.id) {
        setCurrentPrintList(res);
        setLoading(false);
      }
    });
  }

  async function handleDownloadClick(file) {
    //when user clicks a file, it should download
    //debating if i should add this, or just use a pdf renderer and display all the pdfs as previews

    const data = await makeGetRequest(
      `print/gets3/${currentPrintList.name}/${file?.pathName.slice(
        currentPrintList?.name?.length + 1
      )}/${import.meta.env.VITE_ROUTEPASS}`
    )
      .then(async (res) => {
        if (res === "error") {
          throw new Error();
        }

        // console.log(atob(res));

        // let str = "data:application/w+;base64," + res;
        // let binaryLen = str.length;
        // let bytes = new Uint8Array(binaryLen);
        // console.log(str);

        // for (let i = 0; i < binaryLen; i++) {
        //   let ascii = str.charCodeAt(i);
        //   bytes[i] = ascii;
        // }

        // let blob = new Blob([bytes.buffer], { type: "application/pdf" });

        // console.log(blob);

        // let link = document.createElement("a");

        // link.href = str;
        // link.download = file?.pathName.slice(
        //   currentPrintList?.name?.length + 1
        // );

        // document.body.append(link);
        // link.click();
        // link.remove();
        // console.log(bytes);

        // let binaryString = window.atob("data:application/w+;base64," + res);
        // let binaryLen = binaryString.length;
        // console.log(binaryString);

        // const base64str = btoa(
        //   new Uint8Array(res.Body.data).reduce(
        //     (data, byte) => data + String.fromCharCode(byte),
        //     ""
        //   )
        // );

        // console.log(base64str, "b64");
        // console.log(res.Body);
        // console.log(res, "responseeeeeeeee");

        // const blob = new Blob([new Int8Array(res.Body.data).buffer], {
        //   type: "application/pdf",
        // });

        // console.log(blob, "blob");
        // console.log(new Int8Array(res.Body));

        // console.log(URL.createObjectURL(blob));

        await fetch("data:application/w+;base64," + atob(res))
          .then((resp) => resp.blob())
          .then((res) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(res);

            link.download = file?.pathName.slice(
              currentPrintList?.name?.length + 1
            );

            document.body.append(link);
            link.click();
            link.remove();
          });

        // const decode = atob(res);
        // console.log(decode);
        // const link = document.createElement("a");
        // link.href = URL.createObjectURL("data:application/w+;base64," + decode);

        // link.download = file?.pathName.slice(
        //   currentPrintList?.name?.length + 1
        // );

        // document.body.append(link);
        // link.click();
        // link.remove();
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong, please try again");
      });
  }

  //printJs(URL.createObjectURL(res));

  async function handleDelete() {}

  useEffect(() => {
    const id = params.id;

    if (!id) return;

    fetchList(id);
  }, []);

  if (authState.loading && authState.loading !== "false" && loading) {
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

  if (notFound) {
    return (
      <div className="home-parent">
        <img
          className="home-logo"
          src="/assets/logo.jpeg"
          onClick={() => (window.location.href = "/print")}
          style={{ cursor: "pointer" }}
        />
        <div className="home-krink">List not found</div>
      </div>
    );
  }

  return (
    <div className="home-parent">
      <img
        className="home-logo"
        src="/assets/logo.jpeg"
        onClick={() => (window.location.href = "/print")}
        style={{ cursor: "pointer" }}
      />
      <div className="home-krink">Print - {currentPrintList?.name}</div>

      <div className="home-t home-q">
        <div
          className="home-add kh-take pointer"
          onClick={() => setShowPrintOverlay(true)}
        >
          Print
        </div>
      </div>

      <div className="home-f home-lp">
        <span>Files</span>

        <div className="grow" />
        {(!authState.loading || authState.loading === "false") &&
          authState?.id && (
            <div
              className="home-add home-create"
              onClick={() => handleInputClick()}
            >
              Add
            </div>
          )}

        {(!authState.loading || authState.loading === "false") &&
          authState?.id && (
            <div
              className="home-add home-create"
              onClick={() => handleDelete()}
              style={{ marginLeft: "15px", backgroundColor: "red" }}
            >
              Delete
            </div>
          )}
      </div>

      <div className="print-filecon">
        <ol>
          {currentPrintList?.printFiles
            ?.sort(function (a, b) {
              const at = a?.pathName
                .slice(currentPrintList?.name?.length + 1)
                .toLowerCase();
              const bt = b?.pathName
                .slice(currentPrintList?.name?.length + 1)
                .toLowerCase();

              if (at < bt) {
                return -1;
              }
              if (at > bt) {
                return 1;
              }
              return 0;
            })
            ?.map((file) => (
              <li className="print-li">
                <span
                  className="print-lich ellipsis"
                  onClick={() => handleDownloadClick(file)}
                >
                  {file?.pathName.slice(currentPrintList?.name?.length + 1)}
                </span>
              </li>
            ))}
        </ol>
      </div>
      {showPrintOverlay && (
        <PrintOverlay
          setShowPrintOverlay={setShowPrintOverlay}
          currentPrintList={currentPrintList}
        />
      )}
    </div>
  );
};

export default SinglePrintList;
