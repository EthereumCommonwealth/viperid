import React from 'react';
import NoSSR from 'react-no-ssr';
import dynamic from 'next/dynamic';
import Loading from './loading';

const CodeMirror = dynamic(import('react-codemirror2'), {
  loading: () => <Loading />,
  ssr: false
});

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
  state = {
    code: ''
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

  handleSubmit(event) {
    event.preventDefault();
    fetch('https://api.viperid.online/abi/', {
      method: 'POST',
      body: JSON.stringify({ code: this.state.code })
    })
      .then(response => response.json())
      .then(responseData => {
        console.log(JSON.stringify(responseData['result'], undefined, 2));
      });

    return false;
  }

  onValueChange(editor, metadata, event) {
    if (timerClick) {
      clearTimeout(timerClick);
    }
    this.setState({
      code: editor.getValue()
    });
    timerClick = setTimeout(() => {
      this.refs.submitButton.click();
      timerClick = null;
    }, 2000);
  }

  editorDidMount(editor, next) {
    this.setState({ code: editor.getValue() });
  }

  render() {
    return (
      <div>
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
