const SET_SIDEBAR_STATE = "SET_SIDEBAR_STATE";

export const dispatchSetSidebarState = (value) => ({
  type: SET_SIDEBAR_STATE,
  value,
});

export default function (state = { display: false }, action) {
  switch (action.type) {
    case SET_SIDEBAR_STATE:
      return action.value;
    default:
      return state;
  }
}
