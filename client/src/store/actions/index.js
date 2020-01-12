import { AUTHENTICATED } from './action_types';

export function reduxSetAuthenticated(payload) {
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATED,
      payload
    });
  }
}