import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  makeDeleteRequest,
  makeDeleteRequestWithAuth,
  makeGetRequest,
  makeGetRequestWithAuth,
  makePutRequest,
  makePutRequestWithAuth,
} from "../../../requests/helperFunctions";
import { useSelector } from "react-redux";

import PrintOverlay from "./PrintOverlay";
import TrashCanSvg from "../svg/TrashCanSvg";

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

    await makePutRequestWithAuth(
      `print/uploads3`,
      {
        printlist: currentPrintList,
        buffer: b64str,
        name: files[0]?.name,
      },
      import.meta.env.VITE_ROUTEPASS
    )
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
    await makeGetRequestWithAuth(
      `print/fetch/${id}`,
      import.meta.env.VITE_ROUTEPASS
    ).then((res) => {
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

    const data = await makeGetRequestWithAuth(
      `print/gets3/${currentPrintList.name}/${file?.pathName.slice(
        currentPrintList?.name?.length + 1
      )}`,
      import.meta.env.VITE_ROUTEPASS
    )
      .then(async (res) => {
        if (res === "error") {
          throw new Error();
        }

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
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong, please try again");
      });
  }

  async function handleDelete() {
    const c = confirm(`Confirm delete for ${currentPrintList.name}`);

    if (!c) return;

    await makeDeleteRequestWithAuth(
      `print/deletelist/${currentPrintList.id}/${currentPrintList.name}`,
      import.meta.env.VITE_ROUTEPASS
    )
      .then((res) => {
        if (res === "deleted") {
          window.location.href = "/print";
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

  async function deleteOneFile(file) {
    const c = confirm(
      `Confirm delete ${file.pathName.slice(
        currentPrintList?.name?.length + 1
      )}`
    );

    if (!c) return;

    await makeDeleteRequestWithAuth(
      `print/deleteone/${file.id}/${
        currentPrintList.name
      }/${file.pathName.slice(currentPrintList?.name?.length + 1)}`,
      import.meta.env.VITE_ROUTEPASS
    )
      .then((res) => {
        if (res === "deleted") {
          window.location.reload();
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

  useEffect(() => {
    const id = params.id;

    if (!id) return;

    fetchList(id);
  }, []);

  if ((authState.loading && authState.loading !== "false") || loading) {
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

      {currentPrintList?.printFiles?.length > 0 ? (
        <div className="print-filecon">
          <div className="print-filecon">
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
              ?.map((file, i) => (
                <div className="print-li">
                  <div onClick={() => deleteOneFile(file)}>
                    <TrashCanSvg />
                  </div>

                  <span className="print-q ellipsis print-marker">
                    {i + 1}.&nbsp;
                  </span>
                  <span
                    className="print-lich ellipsis print-q"
                    onClick={() => handleDownloadClick(file)}
                  >
                    {file?.pathName.slice(currentPrintList?.name?.length + 1)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="print-q print-no">No Files in this List</div>
      )}
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
