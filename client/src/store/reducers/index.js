import { combineReducers } from 'redux';
import authenticationReducer from './authentication';
import userReducer from './user';

const RootReducer = combineReducers({
  authenticated: authenticationReducer,
  user: userReducer,
});

export default RootReducer;