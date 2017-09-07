import React from 'react';
import dynamic from 'next/dynamic';
import AlertContainer from 'react-alert';
import Loading from './loading';
import { updateCode, compileAll } from '../actions';

const CodeMirror = dynamic(import('react-codemirror2'), {
  loading: () => <Loading />,
  ssr: false
});

let widgets = [];

const sourceCodeDemo = `funders: {sender: address, value: wei_value}[num]
nextFunderIndex: num
beneficiary: address
deadline: timestamp
goal: wei_value
refundIndex: num
timelimit: timedelta

# Setup global variables
def __init__(_beneficiary: address, _goal: wei_value, _timelimit: timedelta):
  self.beneficiary = _beneficiary
  self.deadline = block.timestamp + _timelimit
  self.timelimit = _timelimit
  self.goal = _goal

# Participate in this crowdfunding campaign
@payable
def participate():
  assert block.timestamp < self.deadline
  nfi = self.nextFunderIndex
  self.funders[nfi] = {sender: msg.sender, value: msg.value}
  self.nextFunderIndex = nfi + 1

# Enough money was raised! Send funds to the beneficiary
def finalize():
  assert block.timestamp >= self.deadline and self.balance >= self.goal
  selfdestruct(self.beneficiary)

# Not enough money was raised! Refund everyone (max 30 people at a time
# to avoid gas limit issues)
def refund():
  assert block.timestamp >= self.deadline and self.balance < self.goal
  ind = self.refundIndex
  for i in range(ind, ind + 30):
      if i >= self.nextFunderIndex:
          self.refundIndex = self.nextFunderIndex
          return
      send(self.funders[i].sender, self.funders[i].value)
      self.funders[i] = None
  self.refundIndex = ind + 30
`;
let timerClick;

export default class extends React.Component {
  alertOptions = {
    offset: 14,
    position: 'bottom left',
    theme: 'light',
    time: 3000,
    transition: 'scale'
  };

  showAlert = () => {
    this.msg.show('Code Compiled', {
      time: 2000,
      type: 'success'
    });
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.editorDidMount = this.editorDidMount.bind(this);
  }

  componentDidMount() {
    require('codemirror/lib/codemirror.css');
    require('codemirror/theme/monokai.css');
    require('../static/codemirror.css');
    require('../mode/viper');
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevProps.error !== this.props.error) {
    //   console.log('no error');
    //   return;
    // }
    for (var i = 0; i < widgets.length; ++i) {
      this.editor.removeLineWidget(widgets[i]);
    }

    if (this.props.result && this.props.result.message) {
      var msg = document.createElement('div');
      var icon = msg.appendChild(document.createElement('span'));
      icon.innerHTML = '!!';
      icon.className = 'lint-error-icon';
      msg.appendChild(document.createTextNode(this.props.result.message));
      msg.className = 'lint-error';
      widgets.push(
        this.editor.addLineWidget(this.props.result.line_no - 1, msg, {
          coverGutter: false,
          noHScroll: true
        })
      );
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { dispatch, currentSourceCode } = this.props;
    dispatch(compileAll(currentSourceCode));
    this.showAlert();
    return false;
  }

  onValueChange(editor, metadata, event) {
    if (timerClick) {
      clearTimeout(timerClick);
    }
    this.props.dispatch(updateCode(editor.getValue()));
    timerClick = setTimeout(() => {
      this.refs.submitButton.click();
      timerClick = null;
    }, 1000);
  }

  editorDidMount(editor, next) {
    this.editor = editor;
    this.editor.getWrapperElement().style.fontSize = '16px';
    this.editor.refresh();
    this.props.dispatch(updateCode(editor.getValue()));
  }

  render() {
    const { result } = this.props;
    console.log(this.props);
    return (
      <div>
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
        <form onSubmit={this.handleSubmit}>
          <CodeMirror
            value={sourceCodeDemo}
            options={{
              mode: 'python',
              theme: 'monokai',
              lineNumbers: true
            }}
            onValueChange={this.onValueChange}
            editorDidMount={this.editorDidMount}
          />
          <div className="submitButton">
            <input
              onClick={e => {
                return false;
              }}
              ref="submitButton"
              type="submit"
            />
          </div>
        </form>
      </div>
    );
  }
}
