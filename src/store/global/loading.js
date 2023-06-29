const SET_LOADING = "SET_LOADING";

export const dispatchSetLoading = (bool) => ({
  type: SET_LOADING,
  bool,
});

export default function (state = false, action) {
  switch (action.type) {
    case SET_LOADING:
      return action.bool;
    default:
      return state;
  }
}
