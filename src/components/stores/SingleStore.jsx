import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeGetRequest } from "../requests/requestFunctions";

const SingleStore = () => {
  const params = useParams();

  const [selectedStore, setSelectedStore] = useState({});

  useEffect(() => {
    const id = params.id;

    const fetch = async () => {
      const store = await makeGetRequest(`/stores/fetch/${id}`)
        .then((res) => {
          setSelectedStore(res);
        })
        .catch(() => {
          alert("Something went wrong, please refresh");
        });
    };

    fetch();
  }, []);

  console.log(selectedStore);

  return (
    <div>
      <div>{selectedStore?.name}</div>
    </div>
  );
};

export default SingleStore;
