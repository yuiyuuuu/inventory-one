import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { read, utils, writeFileXLSX } from "xlsx";

import "../item/addsub/ov.scss";

import $ from "jquery";

import { makeGetRequest } from "../requests/requestFunctions";
import { Buffer } from "buffer";

import SearchSvg from "./svg/SearchSvg";
import Item from "../item/Item";
import CreateOverlay from "./CreateOverlay";

import EditOverlay from "./EditOverlay";
import MassAddOverlay from "./massAdd/MassAddOverlay";
import ProductInfo from "../productinfo/ProductInfo";
import AddOverlay from "../item/addsub/AddOverlay";
import SubtractOverlay from "../item/addsub/SubtractOverlay";
import ShareOverlay from "./ShareOverlay";

//css for this will be in home.scss

const SingleList = () => {
  const params = useParams();

  const allStores = useSelector((state) => state.allStores);
  const authState = useSelector((state) => state.auth);

  const [allProducts, setAllProducts] = useState([]);

  const [currentList, setCurrentList] = useState({});
  const [listNotFound, setListNotFound] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [queryResults, setQueryResults] = useState([]);
  const [searchActive, setSearchActive] = useState(false);

  //create overlay
  const [showCreateOverlay, setShowCreateOverlay] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  //edit overlay
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  //mass edit
  const [showMassOverlay, setShowMassOverlay] = useState(false);

  //show single product info
  const [showSingleProduct, setShowSingleProduct] = useState(false);
  const [singleProductData, setSingleProductData] = useState({});

  //show add and sub overlays
  const [overlayData, setOverlayData] = useState({});

  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showSubtractOverlay, setShowSubtractOverlay] = useState(false);

  const [showShareOverlay, setShowShareOverlay] = useState(false);

  //product info
  const [productInfo, setProductInfo] = useState({
    name: "",
    quantity: 0,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  //loading
  const [loading, setLoading] = useState(true);

  //access not allowed
  const [noAccess, setNoAccess] = useState(false);

  async function fetchProducts(id) {
    if (!id) return;

    const data = await makeGetRequest(
      `list/${id}/${import.meta.env.VITE_ROUTEPASS}`
    )
      .then((res) => {
        if (res.id) {
          setCurrentList(res);
          setAllProducts(res.item.sort((a, b) => a.name.localeCompare(b.name)));
        } else {
          setListNotFound(true);
          setLoading(false);
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
        setLoading(false);
      });
  }

  function handleImageUpload(e) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png, image/jpeg";
    input.onchange = onSelectFile;
    input.hidden = true;
    input.click();
  }

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const objecturl = URL.createObjectURL(e.target.files[0]);
    setImagePreview(objecturl);

    async function getBase64Image(img) {
      const arrayBuffer = await (await fetch(img)).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer).toString("base64");

      setProductInfo((prev) => {
        return { ...prev, image: buffer };
      });
    }

    getBase64Image(objecturl);
  };

  function handleExportExcel() {
    const c = [...allProducts];

    const re = [];

    c.forEach((v) => {
      //prevents mutation to the allproducts array
      re.push({
        name: v.name,
        quantity: v.quantity,
        units: v.units || "pieces",
      });
    });

    const sheet = utils.json_to_sheet(re);
    const newBook = utils.book_new();
    utils.book_append_sheet(newBook, sheet, "Data");

    writeFileXLSX(newBook, "SheetJSReactAoO.xlsx");
  }

  useEffect(() => {
    if (!currentList?.id) return;
    if (!authState?.id) return;

    if (
      authState?.id !== currentList.owner.id &&
      !currentList.sharedUsers.map((v) => v.id).includes(authState?.id)
    ) {
      setNoAccess(true);
    }

    setLoading(false);
  }, [authState, currentList]);

  useEffect(() => {
    const id = params.id;
    if (authState.loading === "false" || !authState.loading) {
      if (authState.id) {
        fetchProducts(id);
      } else {
        setLoading(false);
      }
    }
  }, [authState]);

  useEffect(() => {
    //timer for username input
    var typingTimer; //timer identifier
    var doneTypingInterval = 500; //time in ms, 5 seconds for example
    var $input = $("#home-search");

    //on keyup, start the countdown
    $input.on("keyup", function () {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    //on keydown, clear the countdown
    $input.on("keydown", function () {
      clearTimeout(typingTimer);
    });

    function doneTyping() {
      if ($("#home-search").val() === "" || !$("#home-search").val()) {
        setSearchActive(false);
        setQueryResults([]);
      }

      const result = [];

      allProducts.slice().forEach((v) => {
        if (
          v.name.toLowerCase().includes($("#home-search").val().toLowerCase())
        ) {
          result.push(v);
        }
      });

      setQueryResults(result.sort((a, b) => a.name.localeCompare(b.name)));
      setSearchActive(true);
    }
  }, [$("#home-search")]);

  //reruns query when products gets updated. this will allow us to see updates without refreshing page when search is active
  useEffect(() => {
    if (!searchActive) return;

    const result = [];

    allProducts.slice().forEach((v) => {
      if (
        v.name.toLowerCase().includes($("#home-search").val().toLowerCase())
      ) {
        result.push(v);
      }
    });

    setQueryResults(result.sort((a, b) => a.name.localeCompare(b.name)));
  }, [allProducts]);

  const inputBoxShadow = useCallback(() => {
    $(".home-searchq").focus(() => {
      $(".home-inparent").css(
        "box-shadow",
        `0px 0px 12px 0px rgba(0, 255, 255, 1)`
      );
    });

    $(".home-searchq").focusout(() => {
      $(".home-inparent").css("box-shadow", `0px 0px 12px 0px red`);
    });
  }, []);

  $(document).ready(() => {
    inputBoxShadow();
  });

  if (loading) {
    return (
      <div className="lds-ring lds-co" id="spinner-form">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }

  if (
    noAccess ||
    ((authState.loading === "false" || !authState?.loading) && !authState?.id)
  ) {
    return (
      <div className="home-parent">
        <img
          className="home-logo"
          src="/assets/logo.jpeg"
          onClick={() => (window.location.href = "/")}
          style={{ cursor: "pointer" }}
        />

        <div className="home-krink">{currentList?.name}</div>

        <div>You do not have access to this list</div>
      </div>
    );
  }

  if (listNotFound) {
    return (
      <div className="home-parent">
        <img
          className="home-logo"
          src="/assets/logo.jpeg"
          onClick={() => (window.location.href = "/")}
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
        onClick={() => (window.location.href = "/")}
        style={{ cursor: "pointer" }}
      />
      <div className="home-krink">{currentList?.name}</div>
      <div className="home-q">
        <div className="home-k">
          <div className="home-inparent">
            <SearchSvg />
            <input
              className="home-searchq"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search"
              id="home-search"
            />
          </div>
        </div>
      </div>

      <div className="home-q home-t">
        <button
          className="home-add"
          onClick={() => {
            setShowCreateOverlay(true);
            document.querySelector("html").style.overflow = "hidden";
          }}
        >
          Add
        </button>

        <button
          className="home-add"
          style={{ marginLeft: "20px" }}
          onClick={() => {
            setShowMassOverlay(true);
            document.querySelector("html").style.overflow = "hidden";
          }}
        >
          Mass Add
        </button>

        <button
          className="home-add home-export"
          style={{ marginLeft: "20px" }}
          onClick={() => handleExportExcel()}
        >
          Export
        </button>

        {authState?.id === currentList?.owner?.id && (
          <button
            className="home-add"
            style={{ marginLeft: "20px" }}
            onClick={() => setShowShareOverlay(true)}
          >
            Share
          </button>
        )}
      </div>

      {searchActive && !queryResults?.length ? (
        <div className="home-no">No products found</div>
      ) : queryResults.length ? (
        <div className="home-itemmap">
          {queryResults?.map((item) => (
            <Item
              item={item}
              setSelectedProduct={setSelectedProduct}
              setShowEditOverlay={setShowEditOverlay}
              setShowSingleProduct={setShowSingleProduct}
              setSingleProductData={setSingleProductData}
              setShowAddOverlay={setShowAddOverlay}
              setShowSubtractOverlay={setShowSubtractOverlay}
              setOverlayData={setOverlayData}
              currentList={currentList}
            />
          ))}
        </div>
      ) : allProducts.length ? (
        <div className="home-itemmap">
          {allProducts?.map((item) => (
            <Item
              item={item}
              setSelectedProduct={setSelectedProduct}
              setShowEditOverlay={setShowEditOverlay}
              setShowSingleProduct={setShowSingleProduct}
              setSingleProductData={setSingleProductData}
              setShowAddOverlay={setShowAddOverlay}
              setShowSubtractOverlay={setShowSubtractOverlay}
              setOverlayData={setOverlayData}
              currentList={currentList}
            />
          ))}
        </div>
      ) : (
        !loading && <div className="home-n">No Products</div>
      )}

      {showCreateOverlay && (
        <CreateOverlay
          setShowCreateOverlay={setShowCreateOverlay}
          handleImageUpload={handleImageUpload}
          setProductInfo={setProductInfo}
          productInfo={productInfo}
          onSelectFile={onSelectFile}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          createLoading={createLoading}
          setCreateLoading={setCreateLoading}
          currentList={currentList}
          fetchProducts={fetchProducts}
          setCurrentList={setCurrentList}
        />
      )}

      {showEditOverlay && (
        <EditOverlay
          selectedProduct={selectedProduct}
          setShowEditOverlay={setShowEditOverlay}
          setSelectedProduct={setSelectedProduct}
          setAllProducts={setAllProducts}
          setQueryResults={setQueryResults}
          allProducts={allProducts}
          queryResults={queryResults}
          editLoading={editLoading}
          currentList={currentList}
        />
      )}

      {showMassOverlay && (
        <MassAddOverlay
          setShowMassOverlay={setShowMassOverlay}
          showMassOverlay={showMassOverlay}
          fetchProducts={fetchProducts}
          currentList={currentList}
          setAllProducts={setAllProducts}
        />
      )}

      {showSingleProduct && (
        <ProductInfo
          data={singleProductData}
          setShowSingleProduct={setShowSingleProduct}
        />
      )}

      {showAddOverlay && (
        <AddOverlay
          setShowAddOverlay={setShowAddOverlay}
          setOverlayData={setOverlayData}
          overlayData={overlayData}
          setAllProducts={setAllProducts}
        />
      )}

      {showSubtractOverlay && (
        <SubtractOverlay
          setShowSubtractOverlay={setShowSubtractOverlay}
          setOverlayData={setOverlayData}
          overlayData={overlayData}
          allStores={allStores}
          setAllProducts={setAllProducts}
          currentList={currentList}
        />
      )}

      {showShareOverlay && (
        <ShareOverlay
          currentList={currentList}
          setShowShareOverlay={setShowShareOverlay}
        />
      )}
    </div>
  );
};

export default SingleList;
