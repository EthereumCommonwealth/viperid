import { COMPILE_ALL, RECEIVE_COMPILED_CODE, RECEIVE_ERROR } from '../actions';

function compile(
  state = { isCompiling: false, result: {}, error: false },
  action
) {
  switch (action.type) {
    case RECEIVE_ERROR:
      return Object.assign({}, state, {
        isCompiling: false,
        error: true,
        result: action.result.error,
        lastCompilation: action.receivedAt
      });
    case COMPILE_ALL:
      return Object.assign({}, state, {
        isCompiling: true,
        error: false
      });
    case RECEIVE_COMPILED_CODE:
      return Object.assign({}, state, {
        isCompiling: false,
        error: false,
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
    case RECEIVE_ERROR:
    case RECEIVE_COMPILED_CODE:
      return Object.assign({}, state, {
        ...compile(state[action.code], action)
      });
    default:
      return state;
  }
}
