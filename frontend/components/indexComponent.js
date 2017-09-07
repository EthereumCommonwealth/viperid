import React from 'react';
import { connect } from 'react-redux';
import CodeMirror from './codemirror';
import ViperidPanel from './panel';
import Head from './head';
import configureStore from '../store';

class IndexComponent extends React.Component {
  render() {
    return (
      <div>
        <Head />
        <div className="wrapper">
          <CodeMirror {...this.props} />
          <ViperidPanel {...this.props} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { currentSourceCode, compileCode } = state;
  let { isCompiling, result, error } = compileCode || {
    isCompiling: false,
    result: {}
  };

  if (!currentSourceCode) {
    isCompiling = false;
  }

  return {
    currentSourceCode,
    result,
    isCompiling,
    error
  };
}

export default connect(mapStateToProps)(IndexComponent);
