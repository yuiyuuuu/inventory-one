import React, { useState } from "react";
import { useSelector } from "react-redux";

import * as Excel from "exceljs";

import CheckMark from "../keys/singlekeys/svg/CheckMark";
import { saveAs } from "file-saver";

const roles = [
  "Senior manager",
  "manager",
  "Assistant manager",
  "Senior associate",
  "Associate",
  "Intern",
  "Ware house",
  "Security",
  "Backup manager",
];

const info = [
  { name: "First Name", prop: "firstName" },
  { name: "Last Name", prop: "lastName" },
  { name: "Email", prop: "email" },
  { name: "Phone Number", prop: "phone" },
  { name: "Address", prop: "address" },
  { name: "Store", prop: "store" },
  { name: "Role", prop: "role" },
  { name: "Start Date", prop: "startDate" },
  { name: "End Date", prop: "endDate" },
];

//so its always in this order
//sometimes when user unselect and reselect, we dont want to add it to end, it would look weird
function sortInfo(a, b) {
  const m = info.map((t) => t.name);

  return m.indexOf(a.name) - m.indexOf(b.name);
}

const ExportOverlay = ({ set }) => {
  const stores = useSelector((state) => state.allStores);

  const [selectedStores, setSelectedStores] = useState([]);
  const [showStores, setShowStores] = useState(false);

  const [selectedRoles, setSelectedRoles] = useState([]);

  const [selectedInfo, setSelectedInfo] = useState([]);

  const [newSheetEachStore, setNewSheetEachStore] = useState(false);

  const [infoError, setInfoError] = useState(false);
  const [storeError, setStoreError] = useState(false);

  // function handleExportExcel() {
  //   const c = [...allProducts];

  //   const re = [];

  //   c.forEach((v) => {
  //     //prevents mutation to the allproducts array
  //     re.push({
  //       name: v.name,
  //       quantity: v.quantity,
  //       units: v.units || "pieces",
  //     });
  //   });

  //   const sheet = utils.json_to_sheet(re);
  //   const newBook = utils.book_new();
  //   utils.book_append_sheet(newBook, sheet, "Data");

  //   writeFileXLSX(newBook, "SheetJSReactAoO.xlsx");
  // }

  async function excelDownload() {
    setInfoError(false);
    setStoreError(false);

    let bad = false;
    if (!selectedInfo.length) {
      bad = true;
      setInfoError(true);
    }

    if (!selectedStores.length) {
      bad = true;
      setStoreError(true);
    }

    if (bad) return;

    function populateSheet(book, sheetname, employees) {
      const sheet = book.addWorksheet(sheetname, {
        views: [{ state: "frozen", ySplit: 1 }],
      });

      sheet.columns = [
        ...selectedInfo.map((v, i) => {
          return { header: v.name, key: v.name };
        }),
      ];

      if (employees.length) {
        employees.forEach((emp) => {
          const obj = {};

          selectedInfo.forEach((v) => {
            obj[v.name] ||=
              v.prop === "store" ? emp[v.prop]?.name : emp[v.prop]; //for each selected info, add onto object with corresponding key
          });

          sheet.addRow(obj); //add the obj
        });
      }
    }

    // const book = Excel.Workbook();
    const book = new Excel.Workbook();

    //if user wants to split each store by sheet
    if (newSheetEachStore) {
      selectedStores.forEach((store) => {
        populateSheet(book, store.name.replace(/\//g, "-"), store.employees);
      });
    } else {
      const all = [];

      //else we combine all employees into one array and populate sheet once, seperating stores by one space
      selectedStores.forEach((store) => {
        if (!store.employees.length) return;

        all.push(...store.employees);
        all.push({}); //space to sep stores?
      });

      populateSheet(book, "CombinedSheet", all);
    }
    const buf = await book.xlsx.writeBuffer();

    saveAs(new Blob([buf]), "SheetJSReactAoO.xlsx");
  }

  return (
    <div className="home-createoverlay" onClick={() => set(false)}>
      <div
        className="homec-inner emp-un"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "90vh", overflowY: "scroll" }}
      >
        <div className="homec-l emp-l">Export Employees</div>

        <div
          className="pio-rel"
          style={{ display: "block", maxHeight: "35vh", overflowY: "scroll" }}
        >
          {storeError && (
            <div className="kh-error" style={{ marginBottom: "12px" }}>
              Select a store!
            </div>
          )}
          <div
            className="pio-select"
            onClick={() => setShowStores((prev) => !prev)}
            style={{ margin: 0, lineHeight: "25px" }}
          >
            {selectedStores?.length > 0
              ? selectedStores.map((v) => " " + v.name).toString(",")
              : "Select Stores"}

            <div className="grow" />
            <div
              className="mitem-caret"
              style={{ transform: !showStores && "rotate(-90deg)" }}
            />
          </div>
          {showStores && (
            <div className="emp-sel">
              <div
                className="emp-selch"
                onClick={() => {
                  if (selectedStores.length !== stores.length) {
                    setSelectedStores(stores);
                  } else {
                    setSelectedStores([]);
                  }
                }}
                style={{
                  backgroundColor:
                    selectedStores.length === stores.length && "white",

                  borderBottom:
                    selectedStores.length === stores.length &&
                    "1px solid black",

                  color: selectedStores.length === stores.length && "black",
                }}
              >
                <input
                  type="checkbox"
                  id="selall"
                  style={{ marginRight: "10px" }}
                  checked={selectedStores.length === stores.length}
                />
                Select All
              </div>
              {stores?.map((store) => (
                <div
                  className="emp-selch"
                  onClick={() => {
                    const m = selectedStores.map((v) => v.id);

                    if (m.includes(store.id)) {
                      setSelectedStores((prev) =>
                        prev.filter((t) => t.id !== store.id)
                      );
                    } else {
                      setSelectedStores((prev) => [...prev, store]);
                    }
                  }}
                  style={{
                    backgroundColor:
                      selectedStores.map((v) => v.id).includes(store.id) &&
                      "white",

                    borderBottom:
                      selectedStores.map((v) => v.id).includes(store.id) &&
                      "1px solid black",

                    color:
                      selectedStores.map((v) => v.id).includes(store.id) &&
                      "black",
                  }}
                >
                  {store?.name}

                  {selectedStores.map((v) => v.id).includes(store.id) && (
                    <div className="grow" />
                  )}
                  {selectedStores.map((v) => v.id).includes(store.id) && (
                    <CheckMark />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="emp-r">
          <input
            type="checkbox"
            id="newsheetstore"
            checked={newSheetEachStore}
            onClick={() => setNewSheetEachStore((prev) => !prev)}
          />
          <label htmlFor="newsheetstore" style={{ marginLeft: "10px" }}>
            New Sheet for Each Store
          </label>
        </div>

        <div style={{ width: "100%", marginTop: "15px" }}>
          <div className="pi-octoggle">Roles</div>

          <div className="emp-optmap">
            <div className="emp-r">
              <input
                type="checkbox"
                checked={selectedRoles.length === roles.length}
                id={"roles-all"}
                onClick={() => {
                  if (selectedRoles.length === roles.length) {
                    setSelectedRoles([]);
                  } else {
                    setSelectedRoles(roles);
                  }
                }}
              />
              <label htmlFor={"roles-all"} style={{ marginLeft: "10px" }}>
                Select All
              </label>
            </div>
            {roles.map((role) => (
              <div className="emp-r">
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role)}
                  id={role}
                  onClick={() => {
                    if (selectedRoles.includes(role)) {
                      setSelectedRoles((prev) =>
                        prev.filter((t) => t !== role)
                      );
                    } else {
                      setSelectedRoles((prev) => [...prev, role]);
                    }
                  }}
                />
                <label htmlFor={role} style={{ marginLeft: "10px" }}>
                  {role}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: "100%", marginTop: "15px" }}>
          <div className="pi-octoggle">Information</div>

          {infoError && (
            <div className="kh-error" style={{ marginBottom: "12px" }}>
              Select Information!
            </div>
          )}

          <div className="emp-optmap">
            <div className="emp-r">
              <input
                type="checkbox"
                checked={selectedInfo.length === info.length}
                id={"info-all"}
                onClick={() => {
                  if (selectedInfo.length === info.length) {
                    setSelectedInfo([]);
                  } else {
                    setSelectedInfo(info);
                  }
                }}
              />
              <label htmlFor={"info-all"} style={{ marginLeft: "10px" }}>
                Select All
              </label>
            </div>
            {info.map((inf) => (
              <div className="emp-r">
                <input
                  type="checkbox"
                  checked={selectedInfo.map((t) => t.name).includes(inf.name)}
                  id={inf.name}
                  onClick={() => {
                    if (selectedInfo.map((t) => t.name).includes(inf.name)) {
                      setSelectedInfo((prev) =>
                        prev.filter((t) => t.name !== inf.name)
                      );
                    } else {
                      setSelectedInfo((prev) => [...prev, inf].sort(sortInfo));
                    }
                  }}
                />
                <label htmlFor={inf.name} style={{ marginLeft: "10px" }}>
                  {inf.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          className="homec-submit homec-but ov-submut emp-submit"
          onClick={() => excelDownload("sheet1")}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ExportOverlay;
