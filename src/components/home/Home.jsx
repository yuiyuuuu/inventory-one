import React, { useState, useEffect } from "react";

import { read, utils, writeFileXLSX } from "xlsx";

import "./home.scss";

import {
  makeGetRequest,
  makePostRequest,
  makePutRequest,
} from "../requests/requestFunctions";
import { Buffer } from "buffer";

import SearchSvg from "./svg/SearchSvg";
import Item from "../item/Item";
import CreateOverlay from "./CreateOverlay";

import $ from "jquery";
import EditOverlay from "./EditOverlay";
import MassAddOverlay from "./massAdd/MassAddOverlay";

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);

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

  //product info
  const [productInfo, setProductInfo] = useState({
    name: "",
    quantity: 0,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  //loading
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    const data = await makeGetRequest("/item/fetchall");
    setAllProducts(data.sort((a, b) => a.name.localeCompare(b.name)));
  }

  async function handleSubmit() {
    const obj = {
      name: productInfo.name,
      quantity: Number(productInfo.quantity),
      image: productInfo.image,
      units: productInfo.units,
    };

    setCreateLoading(true);

    await makePostRequest("/item/create", obj)
      .then(() => {
        setProductInfo({
          name: "",
          quantity: 0,
          image: null,
        });

        fetchProducts();
        alert("Product Added");
        setShowCreateOverlay(false);
        setCreateLoading(false);
        document.querySelector("html").style.overflow = "";
      })
      .catch(() => {
        alert("Something went wrong, try again");
        setCreateLoading(false);
        document.querySelector("html").style.overflow = "";
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

  async function addSubtractOne(which, productInfo) {
    let obj = { id: productInfo.id };
    if (which === "add") {
      obj = {
        id: productInfo.id,
        which: which,
      };
    } else {
      obj = {
        id: productInfo.id,
        which: which,
      };
    }

    const data = await makePutRequest("/item/editqty/one", obj).then((res) => {
      const d = allProducts.map((v) => (v.id === res.id ? res : v));
      setAllProducts(d);

      if (queryResults.length) {
        const q = queryResults.map((v) => (v.id === res.id ? res : v));
        setQueryResults(q);
      }
    });
  }

  useEffect(() => {
    fetchProducts()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        alert("Something went wrong, refresh page");
      });
  }, []);

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

  if (loading) {
    return (
      <div className='lds-ring lds-co' id='spinner-form'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }

  return (
    <div className='home-parent'>
      <div className='home-q'>
        <div className='home-inparent'>
          <SearchSvg />
          <input
            className='home-searchq'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Search'
            id='home-search'
          />
        </div>
      </div>

      <div className='home-q home-t'>
        <button
          className='home-add'
          onClick={() => {
            setShowCreateOverlay(true);
            document.querySelector("html").style.overflow = "hidden";
          }}
        >
          Add Product
        </button>

        <button
          className='home-add'
          style={{ marginLeft: "20px" }}
          onClick={() => {
            setShowMassOverlay(true);
            document.querySelector("html").style.overflow = "hidden";
          }}
        >
          Mass Add
        </button>

        <button
          className='home-add home-export'
          style={{ marginLeft: "20px" }}
          onClick={() => handleExportExcel()}
        >
          Export xlsx
        </button>
      </div>

      {searchActive && !queryResults?.length ? (
        <div className='home-no'>No products found</div>
      ) : queryResults.length ? (
        <div className='home-itemmap'>
          {queryResults?.map((item) => (
            <Item
              item={item}
              addSubtractOne={addSubtractOne}
              setSelectedProduct={setSelectedProduct}
              setShowEditOverlay={setShowEditOverlay}
            />
          ))}
        </div>
      ) : allProducts.length ? (
        <div className='home-itemmap'>
          {allProducts?.map((item) => (
            <Item
              item={item}
              addSubtractOne={addSubtractOne}
              setSelectedProduct={setSelectedProduct}
              setShowEditOverlay={setShowEditOverlay}
            />
          ))}
        </div>
      ) : (
        !loading && <div className='home-n'>No Products</div>
      )}

      {showCreateOverlay && (
        <CreateOverlay
          setShowCreateOverlay={setShowCreateOverlay}
          handleImageUpload={handleImageUpload}
          setProductInfo={setProductInfo}
          productInfo={productInfo}
          onSelectFile={onSelectFile}
          imagePreview={imagePreview}
          handleSubmit={handleSubmit}
          setImagePreview={setImagePreview}
          createLoading={createLoading}
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
        />
      )}

      {showMassOverlay && (
        <MassAddOverlay
          setShowMassOverlay={setShowMassOverlay}
          showMassOverlay={showMassOverlay}
          fetchProducts={fetchProducts}
          setAllProducts={setAllProducts}
        />
      )}
    </div>
  );
};

export default Home;
