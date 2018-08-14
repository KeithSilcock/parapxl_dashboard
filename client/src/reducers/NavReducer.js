import types from "../actions/types";
import { startTab1 } from "../actions";

const DEFAULT_STATE = {
  tab1Open: false,
  tab2Open: false,
  activeTabDistance: 0
};

export default function(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case types.TOGGLE_NAV_TAB_1:
      return {
        ...state,
        tab1Open: !state.tab1Open
      };

    case types.TOGGLE_NAV_TAB_2:
      return {
        ...state,
        tab2Open: !state.tab2Open
      };

    case types.SET_DISTANCE_DOWN_NAV:
      return {
        ...state,
        activeTabDistance: action.payload
      };

    default:
      return state;
  }
}
