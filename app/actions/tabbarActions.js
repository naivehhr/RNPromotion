import * as types from './tabbarTypes';

export function show() {
  return {
    type: types.TBA_SHOW
  };
}

export function hide() {
  return {
    type: types.TBA_HIDE
  };
}

export function change() {
  return {
    type: types.TBA_CHANGE
  };
}
