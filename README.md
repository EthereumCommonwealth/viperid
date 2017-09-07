# viperid

[![Build Status](https://travis-ci.org/yograterol/viperid.svg?branch=master)](https://travis-ci.org/yograterol/viperid)

Online compiler for Viper language

## Requirements

Python 3.6 or higher

## Usage

Production endpoint: `https://api.viperid.online`

### Compile Viper code

You **must** send a request to the API with a JSON data and a key called `code`.
In code you add the Viper code preserving the spaces and break-lines.

The next examples compile the next Viper code https://github.com/ethereum/viper#code-example

### Compile to Bytecode

With Curl:

```bash
$ curl 'https://api.viperid.online/bytecode/' --data-binary '{"code":"funders: {sender: address, value: wei_value}[num]\r\nnextFunderIndex: num\r\nbeneficiary: address\r\ndeadline: timestamp\r\ngoal: wei_value\r\nrefundIndex: num\r\ntimelimit: timedelta\r\n    \r\n# Setup global variables\r\ndef __init__(_beneficiary: address, _goal: wei_value, _timelimit: timedelta):\r\n    self.beneficiary = _beneficiary\r\n    self.deadline = block.timestamp + _timelimit\r\n    self.timelimit = _timelimit\r\n    self.goal = _goal\r\n    \r\n# Participate in this crowdfunding campaign\r\n@payable\r\ndef participate():\r\n    assert block.timestamp < self.deadline\r\n    nfi = self.nextFunderIndex\r\n    self.funders[nfi] = {sender: msg.sender, value: msg.value}\r\n    self.nextFunderIndex = nfi + 1\r\n    \r\n# Enough money was raised! Send funds to the beneficiary\r\ndef finalize():\r\n    assert block.timestamp >= self.deadline and self.balance >= self.goal\r\n    selfdestruct(self.beneficiary)\r\n    \r\n# Not enough money was raised! Refund everyone (max 30 people at a time\r\n# to avoid gas limit issues)\r\ndef refund():\r\n    assert block.timestamp >= self.deadline and self.balance < self.goal\r\n    ind = self.refundIndex\r\n    for i in range(ind, ind + 30):\r\n        if i >= self.nextFunderIndex:\r\n            self.refundIndex = self.nextFunderIndex\r\n            return\r\n        send(self.funders[i].sender, self.funders[i].value)\r\n        self.funders[i] = None\r\n    self.refundIndex = ind + 30"}' --compressed

{"result":"0x600035601c52740100000000000000000000000000000000000000006020526fffffffffffffffffffffffffffffffff6040527fffffffffffffffffffffffffffffffff000000000000000000000000000000016060527402540be3fffffffffffffffffffffffffdabf41c006080527ffffffffffffffffffffffffdabf41c00000000000000000000000002540be40060a052606061033f610140393415155857602061033f60c03960c0516020518110155857506060516020602061033f0160c03960c0518060405190135857809190125857506060516020604061033f0160c03960c051806040519013585780919012585750610140516002556060516101805142018060405190135857809190125857600355610180516006556101605160045561032756600035601c52740100000000000000000000000000000000000000006020526fffffffffffffffffffffffffffffffff6040527fffffffffffffffffffffffffffffffff000000000000000000000000000000016060527402540be3fffffffffffffffffffffffffdabf41c006080527ffffffffffffffffffffffffdabf41c00000000000000000000000002540be40060a05263d11711a260005114156100ee5760035442121558576001546101405261014051600060c05260c06020200160c05260c060202033815534600182015550606051600161014051018060405190135857809190125857600155005b634bb278f360005114156101185734151558576004543031121560035442121516155857600254ff005b63590e1ae360005114156101fd573415155857600454303112600354421215161558576005546101405261016061014051601e818352015b6001546101605112151561016a5760015460055560006000f35b6000600060006000600161016051600060c05260c06020200160c05260c0602020015461016051600060c05260c06020200160c05260c0602020546000f115585761016051600060c05260c06020200160c05260c06020206000815560006001820155508151600101808352811415610150575b5050606051601e61014051018060405190135857809190125857600555005b5b61012961032703610129600039610129610327036000f3"}
```

**NOTE: We don't storage any info about.**

## Test

`python tests/tests_viperid.py`
