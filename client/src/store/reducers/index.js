import { combineReducers } from 'redux';
import authenticationReducer from './authentication';

const RootReducer = combineReducers({
  authenticated: authenticationReducer,
});

export default RootReducer;