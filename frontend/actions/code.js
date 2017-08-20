export const UPDATE_CODE = 'UPDATE_CODE';

export function updateCode(sourceCode) {
  return {
    type: UPDATE_CODE,
    code: sourceCode
  };
}
