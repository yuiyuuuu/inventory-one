import React, { useState } from "react";
import { useSelector } from "react-redux";
import CheckMark from "../keys/singlekeys/svg/CheckMark";

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
  "First Name",
  "Last Name",
  "Email",
  "Phone Number",
  "Address",
  "Role",
  "Start Date",
  "End Date",
];

const ExportOverlay = ({ set }) => {
  const stores = useSelector((state) => state.allStores);

  const [selectedStores, setSelectedStores] = useState([]);
  const [showStores, setShowStores] = useState(false);

  const [selectedRoles, setSelectedRoles] = useState([]);

  const [selectedInfo, setSelectedInfo] = useState([]);

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
                  checked={selectedInfo.includes(inf)}
                  id={inf}
                  onClick={() => {
                    if (selectedInfo.includes(inf)) {
                      setSelectedInfo((prev) => prev.filter((t) => t !== inf));
                    } else {
                      setSelectedInfo((prev) => [...prev, inf]);
                    }
                  }}
                />
                <label htmlFor={inf} style={{ marginLeft: "10px" }}>
                  {inf}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button className="homec-submit homec-but ov-submut emp-submit">
          Submit
        </button>
      </div>
    </div>
  );
};

export default ExportOverlay;
