import { AUTHENTICATED } from '../actions/action_types';

export default function (state = false, action) {
  switch (action.type) {
    case AUTHENTICATED:
      return action.payload
    default:
      return state
  }
}