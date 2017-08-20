import { COMPILE_ALL, RECEIVE_COMPILED_CODE } from '../actions';

function compile(state = { isCompiling: false, result: {} }, action) {
  switch (action.type) {
    case COMPILE_ALL:
      return Object.assign({}, state, {
        isCompiling: true
      });
    case RECEIVE_COMPILED_CODE:
      return Object.assign({}, state, {
        isCompiling: false,
        result: action.result,
        lastCompilation: action.receivedAt
      });
    default:
      return state;
  }
}

export function compileCode(state = {}, action) {
  switch (action.type) {
    case COMPILE_ALL:
    case RECEIVE_COMPILED_CODE:
      return Object.assign({}, state, {
        ...compile(state[action.code], action)
      });
    default:
      return state;
  }
}
