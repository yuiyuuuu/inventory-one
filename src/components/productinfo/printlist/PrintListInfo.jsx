import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { makeGetRequestWithAuth } from "../../../requests/helperFunctions";
import PrintListMap from "./PrintListMap";

const PrintListInfo = () => {
  const params = useParams();

  const authState = useSelector((state) => state.auth);

  const [list, setList] = useState(null);

  const [listNotFound, setListNotFound] = useState(false);

  const [ready, setReady] = useState([]);

  useEffect(() => {
    if (!authState.id) return;

    const id = params.id;

    const f = async () => {
      await makeGetRequestWithAuth(
        `list/${id}`,
        import.meta.env.VITE_ROUTEPASS
      ).then((res) => {
        if (res === "access denied") return;

        if (res === "not found") {
          setListNotFound(true);
          return;
        }

        setList(res);
      });
    };

    f();
  }, [authState]);

  useEffect(() => {
    if (!list) return;
    if (ready.length < list?.category?.length) return;

    var beforePrint = function () {};
    var afterPrint = function () {
      setTimeout(() => {
        window.close();
      }, 500);
    };

    if (window.matchMedia) {
      var mediaQueryList = window.matchMedia("print");
      mediaQueryList.addListener(function (mql) {
        if (mql.matches) {
          beforePrint();
        } else {
          afterPrint();
        }
      });
    }

    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;

    setTimeout(() => {
      window.print();
    }, 2300);
  }, [ready, list]);

  if (!authState?.id && (!authState.loading || authState.loading === "false")) {
    return <div className='ppi-b'>Login to print</div>;
  }

  if (listNotFound) {
    return <div className='home-krink'>List not found</div>;
  }

  return (
    <div className='ppi-parent'>
      {list?.category?.map((category) => (
        <PrintListMap category={category} setReady={setReady} />
      ))}
    </div>
  );
};

export default PrintListInfo;
