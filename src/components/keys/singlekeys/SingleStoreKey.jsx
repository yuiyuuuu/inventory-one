import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  makeDeleteRequestWithAuth,
  makeGetRequest,
  makeGetRequestWithAuth,
} from "../../../requests/helperFunctions";

import TakeKeyOverlay from "./TakeKeyOverlay";
import KeyLogMap from "./KeyLogMap";
import KeyLogMapArchived from "./KeyLongMapArchived";
import AddImageOverlay from "./AddImageOverlay";
import TrashCanSvg from "../../print/svg/TrashCanSvg";
import { useSelector } from "react-redux";

const SingleKey = () => {
  const params = useParams();
  const authState = useSelector((state) => state.auth);

  const [selectedStore, setSelectedStore] = useState({});

  const [noStore, setNoStore] = useState({ loading: true, notfound: false });

  const [showTakeOverlay, setShowTakeOverlay] = useState(false);
  const [showAddImage, setShowAddImage] = useState(false);

  const [showActiveKeylogs, setShowActiveKeylogs] = useState(true);
  const [showArchivedKeylogs, setShowArchivedKeylogs] = useState(false);
  const [showImages, setShowImages] = useState(false);

  async function handleDeleteImage(img, i) {
    const c = confirm(`Confirm delete image number ${i}`);

    if (!c) return;

    await makeDeleteRequestWithAuth(
      `keys/deleteimage/${img.id}/${selectedStore.id}`,
      // {
      //   storeId: selectedStore?.id,
      //   id: img.id,
      // },
      import.meta.env.VITE_ROUTEPASS
    )
      .then((res) => {
        if (res?.id) {
          alert("Image Deleted");
          setSelectedStore(res);
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

  useEffect(() => {
    const id = params.id;

    if (!authState.id) {
      if (authState.loading === "false") {
        setNoStore({ loading: false, notfound: false });
        return;
      }
    }

    async function fetch() {
      const store = await makeGetRequestWithAuth(
        `/stores/fetch/${id}`,
        import.meta.env.VITE_ROUTEPASS
      )
        .then((res) => {
          if (res.id) {
            setSelectedStore(res);
            setNoStore({ loading: false, notfound: false });
          } else {
            setNoStore({ loading: false, notfound: true });
          }
        })
        .catch(() => {
          alert("Something went wrong, please refresh");
        });
    }

    fetch();
  }, [authState]);

  if (authState.loading === "false" && !authState.id) {
    return (
      // <div className="home-parent">
      //   <img
      //     className="home-logo"
      //     src="/assets/logo.jpeg"
      //     onClick={() => (window.location.href = "/keys")}
      //     style={{ cursor: "pointer" }}
      //   />

      //   <div className="home-krink">Keys</div>

      //   <div className="home-none">
      //     <a className="home-siredir" href="/login">
      //       Log in
      //     </a>{" "}
      //     to see keylogs
      //   </div>
      // </div>

      <div>
        {/*if user is not logged in, then force go to login page
        
        this is an edge case because since we use usenavigate, the app component wont rerender when we click on a store from /keys. /keys is the only page that any user can access without a login

        this will check and ensure user is not on this page if they are not logged in
        */}
        {(function () {
          window.location.href = "/login";
        })()}
      </div>
    );
  }

  if (noStore.loading) {
    return (
      <div className="home-parent">
        <img className="home-logo" src="/assets/logo.jpeg" />
        <div className="home-krink">Loading</div>
      </div>
    );
  }

  if (!noStore.loading && noStore.notfound) {
    return (
      <div className="home-parent">
        <img
          className="home-logo"
          src="/assets/logo.jpeg"
          onClick={() => (window.location.href = "/keys")}
          style={{ cursor: "pointer" }}
        />
        <div className="home-krink">No Store Found</div>
      </div>
    );
  }

  return (
    <div className="home-parent">
      <img
        className="home-logo"
        src="/assets/logo.jpeg"
        onClick={() => (window.location.href = "/keys")}
        style={{ cursor: "pointer" }}
      />
      <div className="home-krink">Keys - {selectedStore?.name}</div>

      <div className="home-t home-q">
        <button
          className="home-add kh-take"
          onClick={() => setShowTakeOverlay(true)}
        >
          Take Key
        </button>
      </div>

      <div
        className="pi-octoggle"
        style={{ marginTop: "30px" }}
        onClick={() => setShowActiveKeylogs((prev) => !prev)}
      >
        Active Key Logs
        <div className="grow" />
        <div
          className="mitem-caret"
          style={{ transform: !showActiveKeylogs && "rotate(-90deg)" }}
        />
      </div>

      {selectedStore?.keyLog.filter((v) => !v.returnTime).length > 0 ? (
        <div
          className="kh-keylogmap"
          style={{
            maxHeight: showActiveKeylogs
              ? selectedStore?.keyLog.filter((v) => !v.returnTime).length *
                  170 +
                40 +
                "px"
              : 0,
          }}
        >
          {selectedStore?.keyLog
            .filter((v) => !v.returnTime)
            .reverse()
            .map((keylog) => (
              <KeyLogMap keylog={keylog} setSelectedStore={setSelectedStore} />
            ))}
        </div>
      ) : (
        <div
          style={{
            maxHeight: showActiveKeylogs ? "35px" : 0,
            padding: 0,
          }}
          className="kh-keylogmap"
        >
          No Active Keylogs for this store
        </div>
      )}

      <div
        className="pi-octoggle"
        style={{ marginTop: "30px" }}
        onClick={() => setShowArchivedKeylogs((prev) => !prev)}
      >
        Archived Key Logs
        <div className="grow" />
        <div
          className="mitem-caret"
          style={{ transform: !showArchivedKeylogs && "rotate(-90deg)" }}
        />
      </div>

      {selectedStore?.keyLog.filter((v) => v.returnTime).length > 0 ? (
        <div
          className="kh-keylogmap"
          style={{
            maxHeight: showArchivedKeylogs
              ? selectedStore?.keyLog.filter((v) => v.returnTime).length * 170 +
                40 +
                "px"
              : 0,
          }}
        >
          {selectedStore?.keyLog
            .filter((v) => v.returnTime)
            .reverse()
            .map((keylog) => (
              <KeyLogMapArchived keylog={keylog} />
            ))}
        </div>
      ) : (
        <div
          style={{
            maxHeight: showArchivedKeylogs ? "35px" : 0,
            padding: 0,
          }}
          className="kh-keylogmap"
        >
          No Archived Keylogs for this store
        </div>
      )}

      <div
        className="pi-octoggle"
        style={{ marginTop: "30px" }}
        onClick={() => setShowImages((prev) => !prev)}
      >
        Images
        <div className="grow" />
        <div
          className="home-add home-create"
          style={{ marginRight: "8px" }}
          onClick={(e) => {
            e.stopPropagation();
            setShowAddImage(true);
          }}
        >
          Add
        </div>
        <div
          className="mitem-caret"
          style={{ transform: !showImages && "rotate(-90deg)" }}
        />
      </div>

      {selectedStore?.keyImage?.length > 0 ? (
        <div
          className="kh-keylogmap"
          style={{ maxHeight: showImages ? "75vh" : 0 }}
        >
          <ol className="kh-ol2">
            {selectedStore?.keyImage?.map((im, i) => (
              <div className="kh-licon">
                <div
                  onClick={() => handleDeleteImage(im, i + 1)}
                  className="kh-trashcon"
                >
                  <TrashCanSvg />
                </div>
                <li className="kh-previewli">
                  <img
                    src={`data:image/png;base64,${im?.image}`}
                    className="kh-img"
                  />
                </li>
              </div>
            ))}
          </ol>
        </div>
      ) : (
        <div
          className="kh-keylogmap"
          style={{
            maxHeight: showImages ? "35px" : 0,
            padding: 0,
          }}
        >
          No Key Images for this store
        </div>
      )}

      {showTakeOverlay && (
        <TakeKeyOverlay
          setShowTakeOverlay={setShowTakeOverlay}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
        />
      )}

      {showAddImage && (
        <AddImageOverlay
          setShowAddImage={setShowAddImage}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
        />
      )}
    </div>
  );
};

export default SingleKey;
