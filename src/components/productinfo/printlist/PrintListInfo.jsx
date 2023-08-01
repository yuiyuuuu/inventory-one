import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { makeGetRequest } from "../../../requests/helperFunctions";
import PrintListMap from "./PrintListMap";

const PrintListInfo = () => {
  const params = useParams();

  const authState = useSelector((state) => state.auth);

  const [list, setList] = useState(null);

  const [listNotFound, setListNotFound] = useState(false);

  useEffect(() => {
    if (!authState.id) return;

    const id = params.id;

    const f = async () => {
      await makeGetRequest(`list/${id}/${import.meta.env.VITE_ROUTEPASS}`).then(
        (res) => {
          if (res === "access denied") return;

          if (res === "not found") {
            setListNotFound(true);
            return;
          }

          console.log(res);

          setList(res);
        }
      );
    };

    f();
  }, [authState]);

  if (!authState?.id && (!authState.loading || authState.loading === "false")) {
    return <div className='ppi-b'>Login to print</div>;
  }

  if (listNotFound) {
    return <div className='home-krink'>Item not found</div>;
  }

  return (
    <div>
      {list?.category?.map((category) => (
        <PrintListMap category={category} />
      ))}
    </div>
  );
};

export default PrintListInfo;
