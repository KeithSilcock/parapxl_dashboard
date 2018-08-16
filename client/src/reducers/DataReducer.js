import types from "../actions/types";

const DEFAULT_STATE = {
  dbData: {},
  locations: [],
  boards: [],
  displayInfo: {},
  currentDisplayData: {},
  modalDisplayed: false,
  modalData: {}
};

export default function(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case types.GET_DATA:
      const locations = Object.keys(action.payload);
      return {
        ...state,
        locations,
        dbData: action.payload
      };

    case types.SET_BOARDS_FOR_LOCATION:
      if (action.payload && state.dbData[action.payload] !== "no data yet") {
        var boards = Object.keys(state.dbData[action.payload]);
      } else {
        boards = [];
      }
      return {
        ...state,
        boards
      };

    case types.SET_DISPLAY_DATA:
      return {
        ...state,
        currentDisplayData: action.payload
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
