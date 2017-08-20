import { UPDATE_CODE } from '../actions';

export function currentSourceCode(state = '', action) {
  switch (action.type) {
    case UPDATE_CODE:
      return action.code;
    default:
      return state;
  }
}
