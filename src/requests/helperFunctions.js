import axios from "axios";

//api get
export async function makeGetRequest(url) {
  try {
    const { data } = await axios.get(`/api/${url}`);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function makeGetRequestWithAuth(url, auth) {
  try {
    const { data } = await axios.get(`/api/${url}`, {
      headers: {
        Authorization: auth,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}

//api post
export async function makePostRequest(url, body) {
  try {
    const { data } = await axios.post(`/api/${url}`, body);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function makePutRequest(url, body) {
  try {
    const { data } = await axios.put(`/api/${url}`, body);
    return data;
  } catch (error) {
    console.log(error);
  }
}
