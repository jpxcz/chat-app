import { AUTHENTICATED, SET_USERNAME } from './action_types';

export function reduxSetAuthenticated(payload) {
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATED,
      payload
    });
  }
}

export function reduxSetUser(payload) {
  return (dispatch) => {
    dispatch({
      type: SET_USERNAME,
      payload
    });
  }
}