import React, { useState, useEffect } from "react";

import { Buffer } from "buffer";

import $ from "jquery";

import ImageIconSvg from "./svg/ImageIconSvg";
import XIcon from "../../global/XIcon";

const MassEditMap = ({ result, setResult, item, index }) => {
  const [image, setImage] = useState(null);
  const [fileName, setFilename] = useState(null);

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

    setFilename(e.target.files[0].name);

    const objecturl = URL.createObjectURL(e.target.files[0]);

    async function getBase64Image(img) {
      const arrayBuffer = await (await fetch(img)).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer).toString("base64");

      setResult((prev) =>
        prev.map((v, i) => (i !== index ? v : { ...item, image: buffer }))
      );

      setImage(buffer);
    }

    getBase64Image(objecturl);
  };

  return (
    <div className='masse-parent' key={index}>
      <div className='masse-inner'>
        <XIcon
          color={"red"}
          size={"11px"}
          position={"block"}
          func={function () {
            $(`#masseinput-${index}`).val("");
            $(`#masseinput2-${index}`).val("");

            setImage(null);
            setFilename(null);

            setResult((prev) => {
              const v = prev.slice();
              v.splice(index, 1);
              v[index] = {};
              return v;
            });
          }}
        />
        <div
          style={{ marginBottom: "-4px", marginRight: "4px", minWidth: "15px" }}
        >
          {index + 1 + "."}
        </div>
        <div style={{ marginLeft: "4px" }} className='masse-inputcon'>
          <input
            placeholder='Name'
            className='masse-input'
            id={`masseinput-${index}`}
            value={item.name || null}
            onChange={(e) => {
              setResult((prev) =>
                prev.map((v, i) =>
                  i !== index ? v : { ...item, name: e.target.value }
                )
              );
            }}
          />
        </div>
        <div className='masse-inputcon' style={{ width: "22%" }}>
          <input
            placeholder='Quantity'
            className='masse-input'
            id={`masseinput2-${index}`}
            value={item.quantity || null}
            type='number'
            onChange={(e) => {
              setResult((prev) =>
                prev.map((v, i) =>
                  i !== index
                    ? v
                    : { ...item, quantity: Number(e.target.value) }
                )
              );
            }}
          />
        </div>
        {!image && (
          <div
            className='masse-upload mass-but'
            style={{ margin: 0 }}
            onClick={() => handleImageUpload()}
          >
            <ImageIconSvg />
          </div>
        )}

        {image && <div className='masse-filename'>{fileName}</div>}
      </div>
    </div>
  );
};

export default MassEditMap;
