import types from "./types";

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

export function setCurrentLocation(location) {
  return {
    type: types.SET_CURRENT_LOCATION,
    payload: location
  };
}
export function setLocations(locations) {
  return {
    type: types.SET_LOCATIONS,
    payload: locations
  };
}
export function setBoards(board) {
  return {
    type: types.SET_BOARD,
    payload: board
  };
}
export function setBoardLocation(loc) {
  return {
    type: types.SET_BOARD_LOCATION,
    payload: loc
  };
}
export function setDisplay(display) {
  return {
    type: types.SET_DISPLAY,
    payload: display
  };
}
export function toggleModal(modalData) {
  return {
    type: types.TOGGLE_MODAL,
    payload: modalData
  };
}
