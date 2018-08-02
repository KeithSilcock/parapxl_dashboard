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

export function setLocation(location) {
  return {
    type: types.SET_LOCATION,
    payload: location
  };
}
export function setBoard(board) {
  return {
    type: types.SET_BOARD,
    payload: board
  };
}
export function toggleModal(modalData) {
  return {
    type: types.TOGGLE_MODAL,
    payload: modalData
  };
}
