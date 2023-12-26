const SET_ALL_car_trackers = "SET_ALL_car_trackers";

export const dispatchSetCarTrackers = (arr) => ({
  type: SET_ALL_car_trackers,
  arr,
});

export default function (state = { loading: true }, action) {
  switch (action.type) {
    case SET_ALL_car_trackers:
      return action.arr;
    default:
      return state;
  }
}
