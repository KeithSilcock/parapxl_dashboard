import types from "./types";
import db from "../firebase";

export const getData = () => async dispatch => {
  const path = "/boards";
  await db.ref(path).on("value", snapshot => {
    const data = snapshot.val();
    dispatch({
      type: types.GET_DATA,
      payload: data
    });
  });
};
export function setBoardsForLocation(location) {
  return {
    type: types.SET_BOARDS_FOR_LOCATION,
    payload: location
  };
}
export function setDisplayData(data) {
  return {
    type: types.SET_DISPLAY_DATA,
    payload: data
  };
}

export function toggleTab1() {
  return {
    type: types.TOGGLE_NAV_TAB_1
  };
}
export function toggleTab2() {
  return {
    type: types.TOGGLE_NAV_TAB_2
  };
}
export function setTabDistanceDownNav(distance) {
  return {
    type: types.SET_DISTANCE_DOWN_NAV,
    payload: distance
  };
}

// export function setCurrentLocation(location) {
//   return {
//     type: types.SET_CURRENT_LOCATION,
//     payload: location
//   };
// }
// export function setLocations(locations) {
//   return {
//     type: types.SET_LOCATIONS,
//     payload: locations
//   };
// }

// export function setBoardLocation(loc) {
//   return {
//     type: types.SET_BOARD_LOCATION,
//     payload: loc
//   };
// }

export function toggleModal(modalData) {
  return {
    type: types.TOGGLE_MODAL,
    payload: modalData
  };
}
