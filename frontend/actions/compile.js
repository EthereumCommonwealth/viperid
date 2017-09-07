export const RECEIVE_COMPILED_CODE = 'RECEIVE_COMPILED_CODE';
export const RECEIVE_ERROR = 'RECEIVE_ERROR';
export const COMPILE_ALL = 'COMPILE_ALL';
export const COMPILE_IR = 'COMPILE_IR';
export const COMPILE_ABI = 'COMPILE_ABI';
export const COMPILE_BYTECODE = 'COMPILE_BYTECODE';

function requestAll(code) {
  return {
    type: COMPILE_ALL,
    code
  };
}

function requestIr(code) {
  return {
    type: COMPILE_IR,
    code
  };
}

function requestAbi(code) {
  return {
    type: COMPILE_ABI,
    code
  };
}

function requestBytecode(code) {
  return {
    type: COMPILE_BYTECODE,
    code
  };
}

function receiveCompiledCode(code, json) {
  return {
    type: RECEIVE_COMPILED_CODE,
    code,
    result: json,
    receivedAt: Date.now()
  };
}

function receiveError(code, json) {
  return {
    type: RECEIVE_ERROR,
    code,
    result: json,
    receivedAt: Date.now()
  };
}

function shouldCompile(state, code) {}

function fetchResultAll(sourceCode) {
  return dispatch => {
    dispatch(requestAll(sourceCode));
    return fetch('https://api.viperid.online/compile/', {
      method: 'POST',
      body: JSON.stringify({ code: sourceCode })
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.error) {
          dispatch(receiveError(sourceCode, responseData));
        } else {
          dispatch(receiveCompiledCode(sourceCode, responseData));
        }
      })
      .catch(error => {
        dispatch(receiveError(error));
      });
  };
}

export function compileAll(sourceCode) {
  return (dispatch, getState) => {
    return dispatch(fetchResultAll(sourceCode));
  };
}

function fetchResultAbi() {
  return dispatch => {
    dispatch(requestAbi(code));
    return fetch('http://127.0.0.1:5000/abi/', {
      method: 'POST',
      body: JSON.stringify({ code: this.state.code })
    })
      .then(response => response.json())
      .then(responseData => {
        dispatch(receiveCompiledCode(responseData));
      });
  };
}

function fetchResultIr() {
  return dispatch => {
    dispatch(requestIr(code));
    return fetch('http://127.0.0.1:5000/ir/', {
      method: 'POST',
      body: JSON.stringify({ code: this.state.code })
    })
      .then(response => response.json())
      .then(responseData => {
        dispatch(receiveCompiledCode(responseData));
      });
  };
}

function fetchResultBytecode() {
  return dispatch => {
    dispatch(requestBytecode(code));
    return fetch('http://127.0.0.1:5000/bytecode/', {
      method: 'POST',
      body: JSON.stringify({ code: this.state.code })
    })
      .then(response => response.json())
      .then(responseData => {
        dispatch(receiveCompiledCode(responseData));
      });
  };
}
