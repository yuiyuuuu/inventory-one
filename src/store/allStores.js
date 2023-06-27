const SET_ALL_STORES = "SET_ALL_STORES";

export const dispatchSetAllStores = (arr) => ({
  type: SET_ALL_STORES,
  arr,
});

export default function (state = [], action) {
  switch (action.type) {
    case SET_ALL_STORES:
      return action.arr;
    default:
      return state;
  }
}
