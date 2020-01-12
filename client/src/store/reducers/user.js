import { SET_USERNAME } from '../actions/action_types';

export default function (state = '', action) {
  switch (action.type) {
    case SET_USERNAME:
      return action.payload
    default:
      return state
  }
}