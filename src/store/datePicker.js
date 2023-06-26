const SET_DATEPICKER_STATE = "SET_DATEPICKER_STATE";

export const dispatchSetDatePickerState = (value) => ({
  type: SET_DATEPICKER_STATE,
  value,
});

//example
//element id is used for if a user clicks a second element that also toggles date picker. in that case, we wouldnt set the display to none, rather we just move it over to the new element
//{display:true, top: 0, left:0, selectedDate: 06/23/23, setFunction: func(), elementId: 'element123'}
export default function (state = { display: false }, action) {
  switch (action.type) {
    case SET_DATEPICKER_STATE:
      return action.value;
    default:
      return state;
  }
}
