import { combineReducers } from 'redux';
import { compileCode } from './compile';
import { currentSourceCode } from './code';

const rootReducer = combineReducers({
  compileCode,
  currentSourceCode
});

export default rootReducer;
