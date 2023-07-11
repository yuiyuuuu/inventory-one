import React, { useState, useCallback, useEffect } from "react";

import { makePostRequest } from "../../requests/requestFunctions";

import "./mass.scss";

import $ from "jquery";

import MassEditMap from "./MassEditMap";
import XIcon from "../../global/XIcon";

const MassAddOverlay = ({
  setShowMassOverlay,
  showMassOverlay,
  setAllProducts,
  currentList,
}) => {
  const [result, setResult] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [noCategory, setNoCategory] = useState(false);

  async function handleSubmit() {
    setNoCategory(false);
    if (!result.length) return;

    if (!selectedCategory?.id) {
      setNoCategory(true);
      return;
    }

    const obj = {
      listid: currentList.id,
      result: result,
      category: selectedCategory,
    };

    setLoading(true);

    await makePostRequest(
      `/item/create/mass/${import.meta.env.VITE_ROUTEPASS}`,
      obj
    )
      .then((res) => {
        alert("Products Added");

        setShowMassOverlay(false);
        setAllProducts(res.item);
        setLoading(false);
        document.querySelector("html").style.overflow = "";
      })
      .catch(() => {
        alert("Something went wrong, try again");
        setLoading(false);
        document.querySelector("html").style.overflow = "";
      });
  }

  const clickout = useCallback(() => {
    const $target = $(event.target);

    if (
      !$target.closest("#co-select").length &&
      !$target.closest("#co-selectc").length &&
      $("#co-selectc").is(":visible")
    ) {
      setShowAddWhat(false);
    }

    if (
      !$target.closest("#co-selcate").length &&
      !$target.closest("#co-selcatec").length &&
      $("#co-selcatec").is(":visible")
    ) {
      setShowCategories(false);
    }
  }, []);

  $("#massaddoverlay").off("click", "#createoverlay", clickout).click(clickout);

  useEffect(() => {
    $("#co-selcatec").css("top", $("#co-selcate").outerHeight() + 9); //10 for margin minus 1px for border so we dont see border twice
  }, [showCategories]);

  return (
    <div
      className="home-createoverlay"
      id="massaddoverlay"
      style={{ display: !showMassOverlay && "none" }}
    >
      <div className="homec-inner">
        <div className="homec-l" style={{ padding: "10px" }}>
          Mass Add
        </div>

        {noCategory && (
          <div
            className="home-error"
            style={{ alignSelf: "start", marginBottom: "-10px" }}
          >
            Select a category!
          </div>
        )}

        <div className="pio-rel">
          <div
            className="pio-select"
            onClick={() => setShowCategories((prev) => !prev)}
            id="co-selcate"
          >
            {selectedCategory?.name || "Select a category"}
            <div className="grow" />
            <div className="mitem-caret" />
          </div>

          {showCategories && (
            <div className="pio-selch" id="co-selcatec">
              {currentList?.category?.map((category, i, a) => (
                <div
                  className="pio-ch"
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowCategories(false);
                  }}
                  style={{ borderBottom: i === a.length - 1 && "none" }}
                >
                  {category.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mass-con">
          {result.map((item, i) => (
            <MassEditMap
              item={item}
              result={result}
              setResult={setResult}
              index={i}
            />
          ))}
        </div>

        <button
          className="mass-add mass-but"
          onClick={() =>
            setResult((prev) => [
              ...prev,
              { name: "", quantity: 0, image: null, units: null },
            ])
          }
        >
          Add Product
        </button>

        <button
          className="mass-add mass-but homec-but"
          onClick={() => handleSubmit()}
        >
          Submit
        </button>

        <XIcon
          top={"21px"}
          right={"30px"}
          func={function () {
            setShowMassOverlay(false);
            document.querySelector("html").style.overflow = "";
          }}
        />
      </div>

      <div
        className="homec-clickback"
        onClick={() => {
          setShowMassOverlay(false);
          document.querySelector("html").style.overflow = "";
        }}
      />

      {loading && (
        <div className="submit-loading">
          <div className="lds-ring" id="spinner-form">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MassAddOverlay;
