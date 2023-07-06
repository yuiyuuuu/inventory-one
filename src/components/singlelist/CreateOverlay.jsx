import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";

import $ from "jquery";

import XIcon from "../global/XIcon";
import { makePostRequest } from "../requests/requestFunctions";

const CreateOverlay = ({
  setShowCreateOverlay,
  handleImageUpload,
  setProductInfo,
  productInfo,
  imagePreview,
  setImagePreview,
  createLoading,
  setCreateLoading,
  currentList,
  fetchProducts,
  setCurrentList,
}) => {
  const params = useParams();

  const [addWhat, setAddWhat] = useState("Product");

  const [showAddWhat, setShowAddWhat] = useState(false);

  const [categoryName, setCategoryName] = useState("");

  //select categories
  const [showCategories, setShowCategories] = useState(false);

  //create error states
  const [createNoName, setCreateNoName] = useState(false);
  const [createNoCategory, setCreateNoCategory] = useState(false);

  async function handleSubmit() {
    //set error states to false
    setCreateNoName(false);
    setCreateNoCategory(false);

    let bad = false;

    if (!productInfo.name) {
      setCreateNoName(true);
      bad = true;
    }

    if (!productInfo?.category?.id) {
      setCreateNoCategory(true);
      bad = true;
    }

    if (bad) return;

    const obj = {
      name: productInfo.name,
      quantity: Number(productInfo.quantity),
      image: productInfo.image,
      units: productInfo.units,
      listid: currentList.id,
      categoryId: productInfo.category.id,
    };

    setCreateLoading(true);

    await makePostRequest("item/create", obj)
      .then((res) => {
        setProductInfo({
          name: "",
          quantity: 0,
          image: null,
        });

        fetchProducts(params.id);
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

  async function addCategory() {
    if (!categoryName) return;

    setCreateLoading(true);

    await makePostRequest("/list/category/create", {
      listid: currentList.id,
      name: categoryName,
    }).then((res) => {
      if (res.id) {
        setCreateLoading(false);
        setShowCreateOverlay(false);
        setCurrentList(res);
        alert("Category Added");
      }
    });
  }

  useEffect(() => {
    $("#create-name").focus(() => {
      $("#create-name")
        .parent()
        .css("border-bottom", "1px solid rgba(0, 255,255)");
    });

    $("#create-name").focusout(() => {
      $("#create-name").parent().css("border-bottom", "1px solid red");
    });

    $("#create-qty").focus(() => {
      $("#create-qty")
        .parent()
        .css("border-bottom", "1px solid rgba(0, 255,255)");
    });

    $("#create-qty").focusout(() => {
      $("#create-qty").parent().css("border-bottom", "1px solid red");
    });

    $("#create-units").focus(() => {
      $("#create-units")
        .parent()
        .css("border-bottom", "1px solid rgba(0, 255,255)");
    });

    $("#create-units").focusout(() => {
      $("#create-units").parent().css("border-bottom", "1px solid red");
    });
  }, []);

  useEffect(() => {
    $("#co-selectc").css("top", $("#co-select").outerHeight() + 9); //10 for margin minus 1px for border so we dont see border twice
  }, [showAddWhat]);

  useEffect(() => {
    $("#co-selcatec").css("top", $("#co-selcate").outerHeight() + 9); //10 for margin minus 1px for border so we dont see border twice
  }, [showCategories]);

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

  $("#createoverlay").off("click", "#createoverlay", clickout).click(clickout);

  return (
    <div className="home-createoverlay" id="createoverlay">
      <div className="homec-inner">
        <div className="homec-l">Add</div>

        <div className="pio-rel">
          <div
            className="pio-select"
            onClick={() => setShowAddWhat((prev) => !prev)}
            id="co-select"
          >
            {addWhat}
            <div className="grow" />
            <div className="mitem-caret" />
          </div>

          {showAddWhat && (
            <div className="pio-selch" id="co-selectc">
              <div
                className="pio-ch"
                onClick={() => {
                  setAddWhat("Product");
                  setShowAddWhat(false);
                }}
              >
                Product
              </div>
              <div
                className="pio-ch"
                onClick={() => {
                  setAddWhat("Category");
                  setShowAddWhat(false);
                }}
                style={{ borderBottom: "none" }}
              >
                Category
              </div>
            </div>
          )}
        </div>

        {addWhat === "Product" ? (
          <div className="home-uf">
            <div className="homec-inputcontainer">
              {createNoName && (
                <div className="home-error">Name is required!</div>
              )}
              <input
                placeholder="Name"
                className="homec-input"
                id="create-name"
                value={productInfo.name}
                onChange={(e) =>
                  setProductInfo((prev) => {
                    return { ...prev, name: e.target.value };
                  })
                }
              />
            </div>

            <div className="homec-inputcontainer">
              <input
                placeholder="Quantity"
                className="homec-input"
                id="create-qty"
                value={productInfo.quantity}
                type="number"
                onChange={(e) =>
                  setProductInfo((prev) => {
                    return { ...prev, quantity: e.target.value };
                  })
                }
              />
            </div>

            <div className="homec-inputcontainer">
              <input
                placeholder="Units"
                className="homec-input"
                id="create-units"
                value={productInfo.units}
                onChange={(e) =>
                  setProductInfo((prev) => {
                    return { ...prev, units: e.target.value };
                  })
                }
              />
            </div>

            {createNoCategory && (
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
                {productInfo?.category?.name || "Select a category"}
                <div className="grow" />
                <div className="mitem-caret" />
              </div>

              {showCategories && (
                <div className="pio-selch" id="co-selcatec">
                  {currentList?.category?.map((category, i, a) => (
                    <div
                      className="pio-ch"
                      onClick={() => {
                        setProductInfo((prev) => {
                          return { ...prev, category: category };
                        });
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
            {!productInfo?.image && (
              <button
                className="homec-upload"
                onClick={() => handleImageUpload()}
              >
                Upload Image
              </button>
            )}

            {productInfo.image && (
              <div className="flexcol-aligncenter">
                <img src={imagePreview} className="homec-imgpre" />
                <button
                  className="homec-but homec-remove"
                  onClick={() => {
                    setProductInfo((prev) => {
                      return { ...prev, image: null };
                    });

                    setImagePreview(null);
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="home-uf">
            <div className="homec-inputcontainer">
              <input
                placeholder="Name"
                className="homec-input"
                id="create-category"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
          </div>
        )}

        <button
          className="homec-submit homec-but"
          onClick={() => {
            if (addWhat === "Product") {
              handleSubmit();
            } else {
              addCategory();
            }
          }}
        >
          Submit
        </button>

        <XIcon
          top={"21px"}
          right={"30px"}
          func={function () {
            setShowCreateOverlay(false);
            document.querySelector("html").style.overflow = "";
          }}
        />
      </div>

      <div
        className="homec-clickback"
        onClick={() => {
          setShowCreateOverlay(false);
          setProductInfo({ name: "", qty: 0, image: null });
          document.querySelector("html").style.overflow = "";
        }}
      />

      {createLoading && (
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

export default CreateOverlay;
