import types from "../actions/types";

const DEFAULT_STATE = {
  currentLocation: "",
  locations: [],
  boards: {},
  currentBoardLocation: "",
  display: {},
  modalDisplayed: false,
  modalData: {}
};

export default function(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case types.SET_CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: action.payload
      };
    case types.SET_LOCATIONS:
      return {
        ...state,
        locations: action.payload
      };
    case types.SET_BOARD:
      return {
        ...state,
        boards: action.payload
      };
    case types.SET_BOARD_LOCATION:
      return {
        ...state,
        currentBoardLocation: action.payload
      };
    case types.SET_DISPLAY:
      return {
        ...state,
        display: action.payload
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
