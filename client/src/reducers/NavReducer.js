import types from "../actions/types";

const DEFAULT_STATE = {
  tab1Open: false,
  tab2Open: false,
  activeTabDistance: 0,
  mobileNavOpen: false,
  isMobile: false,
  currentLocation: ""
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
    case types.TOGGLE_MOBILE_NAV:
      return {
        ...state,
        mobileNavOpen: !state.mobileNavOpen
      };
    case types.IS_MOBILE:
      return {
        ...state,
        isMobile: true
      };
    case types.CHANGE_LOCATION:
      return {
        ...state,
        currentLocation: action.payload
      };
    default:
      return state;
  }
}
