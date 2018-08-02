import types from "../actions/types";

const DEFAULT_STATE = {
  location: "",
  board: {},
  modalDisplayed: false,
  modalData: {}
};

export default function(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case types.SET_LOCATION:
      return {
        ...state,
        location: action.payload
      };
    case types.SET_BOARD:
      return {
        ...state,
        board: action.payload
      };
    case types.TOGGLE_MODAL:
      if (!state.modalDisplayed) {
        var payload = action.payload;
      } else {
        payload = {};
      }
      return {
        ...state,
        modalDisplayed: !state.modalDisplayed,
        modalData: payload
      };

    default:
      return state;
  }
}
