import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  makeGetRequest,
  makePutRequest,
} from "../../requests/requestFunctions";
import { useSelector } from "react-redux";

const SinglePrintList = () => {
  const params = useParams();

  const authState = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  const [currentPrintList, setCurrentPrintList] = useState({});

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

  async function handleDownloadClick() {
    //when user clicks a file, it should download
    //debating if i should add this, or just use a pdf renderer and display all the pdfs as previews
  }

  console.log(currentPrintList);

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
      <div className="home-krink">{currentPrintList?.name}</div>

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
                  className="print-lich"
                  onClick={() => handleDownloadClick()}
                >
                  {file?.pathName.slice(currentPrintList?.name?.length + 1)}
                </span>
              </li>
            ))}
        </ol>
      </div>
    </div>
  );
};

export default SinglePrintList;
