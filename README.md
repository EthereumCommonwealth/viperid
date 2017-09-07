# viperid

[![Build Status](https://travis-ci.org/yograterol/viperid.svg?branch=master)](https://travis-ci.org/yograterol/viperid)

Online compiler for Viper language

## Requirements

Python 3.6 or higher

## Usage

Production endpoint: `https://api.viperid.online`

### Compile Viper code

You **must** send a request to the API with a JSON data and a key called `code`.

In the code key, you add the source code, preserving the spaces and break-lines.

Every endpoint just accept POST method.

The next examples compile the next Viper code https://github.com/ethereum/viper#code-example

### Compile to Bytecode

Endpoint: https://api.viperid.online/bytecode/

```bash
$ curl 'https://api.viperid.online/bytecode/' --data-binary '{"code":"funders: {sender: address, value: wei_value}[num]\r\nnextFunderIndex: num\r\nbeneficiary: address\r\ndeadline: timestamp\r\ngoal: wei_value\r\nrefundIndex: num\r\ntimelimit: timedelta\r\n    \r\n# Setup global variables\r\ndef __init__(_beneficiary: address, _goal: wei_value, _timelimit: timedelta):\r\n    self.beneficiary = _beneficiary\r\n    self.deadline = block.timestamp + _timelimit\r\n    self.timelimit = _timelimit\r\n    self.goal = _goal\r\n    \r\n# Participate in this crowdfunding campaign\r\n@payable\r\ndef participate():\r\n    assert block.timestamp < self.deadline\r\n    nfi = self.nextFunderIndex\r\n    self.funders[nfi] = {sender: msg.sender, value: msg.value}\r\n    self.nextFunderIndex = nfi + 1\r\n    \r\n# Enough money was raised! Send funds to the beneficiary\r\ndef finalize():\r\n    assert block.timestamp >= self.deadline and self.balance >= self.goal\r\n    selfdestruct(self.beneficiary)\r\n    \r\n# Not enough money was raised! Refund everyone (max 30 people at a time\r\n# to avoid gas limit issues)\r\ndef refund():\r\n    assert block.timestamp >= self.deadline and self.balance < self.goal\r\n    ind = self.refundIndex\r\n    for i in range(ind, ind + 30):\r\n        if i >= self.nextFunderIndex:\r\n            self.refundIndex = self.nextFunderIndex\r\n            return\r\n        send(self.funders[i].sender, self.funders[i].value)\r\n        self.funders[i] = None\r\n    self.refundIndex = ind + 30"}' --compressed

{"result":"0x600035601c52740100000000000000000000000000000000000000006020526fffffffffffffffffffffffffffffffff6040527fffffffffffffffffffffffffffffffff000000000000000000000000000000016060527402540be3fffffffffffffffffffffffffdabf41c006080527ffffffffffffffffffffffffdabf41c00000000000000000000000002540be40060a052606061033f610140393415155857602061033f60c03960c0516020518110155857506060516020602061033f0160c03960c0518060405190135857809190125857506060516020604061033f0160c03960c051806040519013585780919012585750610140516002556060516101805142018060405190135857809190125857600355610180516006556101605160045561032756600035601c52740100000000000000000000000000000000000000006020526fffffffffffffffffffffffffffffffff6040527fffffffffffffffffffffffffffffffff000000000000000000000000000000016060527402540be3fffffffffffffffffffffffffdabf41c006080527ffffffffffffffffffffffffdabf41c00000000000000000000000002540be40060a05263d11711a260005114156100ee5760035442121558576001546101405261014051600060c05260c06020200160c05260c060202033815534600182015550606051600161014051018060405190135857809190125857600155005b634bb278f360005114156101185734151558576004543031121560035442121516155857600254ff005b63590e1ae360005114156101fd573415155857600454303112600354421215161558576005546101405261016061014051601e818352015b6001546101605112151561016a5760015460055560006000f35b6000600060006000600161016051600060c05260c06020200160c05260c0602020015461016051600060c05260c06020200160c05260c0602020546000f115585761016051600060c05260c06020200160c05260c06020206000815560006001820155508151600101808352811415610150575b5050606051601e61014051018060405190135857809190125857600555005b5b61012961032703610129600039610129610327036000f3"}
```

### Compile to ABI

Endpoint: https://api.viperid.online/abi/

```bash
$ curl 'https://api.viperid.online/abi/' --data-binary '{"code":"funders: {sender: address, value: wei_value}[num]\r\nnextFunderIndex: num\r\nbeneficiary: address\r\ndeadline: timestamp\r\ngoal: wei_value\r\nrefundIndex: num\r\ntimelimit: timedelta\r\n    \r\n# Setup global variables\r\ndef __init__(_beneficiary: address, _goal: wei_value, _timelimit: timedelta):\r\n    self.beneficiary = _beneficiary\r\n    self.deadline = block.timestamp + _timelimit\r\n    self.timelimit = _timelimit\r\n    self.goal = _goal\r\n    \r\n# Participate in this crowdfunding campaign\r\n@payable\r\ndef participate():\r\n    assert block.timestamp < self.deadline\r\n    nfi = self.nextFunderIndex\r\n    self.funders[nfi] = {sender: msg.sender, value: msg.value}\r\n    self.nextFunderIndex = nfi + 1\r\n    \r\n# Enough money was raised! Send funds to the beneficiary\r\ndef finalize():\r\n    assert block.timestamp >= self.deadline and self.balance >= self.goal\r\n    selfdestruct(self.beneficiary)\r\n    \r\n# Not enough money was raised! Refund everyone (max 30 people at a time\r\n# to avoid gas limit issues)\r\ndef refund():\r\n    assert block.timestamp >= self.deadline and self.balance < self.goal\r\n    ind = self.refundIndex\r\n    for i in range(ind, ind + 30):\r\n        if i >= self.nextFunderIndex:\r\n            self.refundIndex = self.nextFunderIndex\r\n            return\r\n        send(self.funders[i].sender, self.funders[i].value)\r\n        self.funders[i] = None\r\n    self.refundIndex = ind + 30"}' --compressed

{"result":[{"constant":false,"inputs":[{"name":"_beneficiary","type":"address"},{"name":"_goal","type":"int128"},{"name":"_timelimit","type":"int128"}],"name":"__init__(address,int128,int128)","outputs":[],"payable":false,"type":"constructor"},{"constant":false,"inputs":[],"name":"participate()","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[],"name":"finalize()","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"refund()","outputs":[],"payable":false,"type":"function"}]}
```

### Compile to Ir

Endpoint: https://api.viperid.online/ir/

```bash
$ curl 'https://api.viperid.online/ir/' --data-binary '{"code":"funders: {sender: address, value: wei_value}[num]\r\nnextFunderIndex: num\r\nbeneficiary: address\r\ndeadline: timestamp\r\ngoal: wei_value\r\nrefundIndex: num\r\ntimelimit: timedelta\r\n    \r\n# Setup global variables\r\ndef __init__(_beneficiary: address, _goal: wei_value, _timelimit: timedelta):\r\n    self.beneficiary = _beneficiary\r\n    self.deadline = block.timestamp + _timelimit\r\n    self.timelimit = _timelimit\r\n    self.goal = _goal\r\n    \r\n# Participate in this crowdfunding campaign\r\n@payable\r\ndef participate():\r\n    assert block.timestamp < self.deadline\r\n    nfi = self.nextFunderIndex\r\n    self.funders[nfi] = {sender: msg.sender, value: msg.value}\r\n    self.nextFunderIndex = nfi + 1\r\n    \r\n# Enough money was raised! Send funds to the beneficiary\r\ndef finalize():\r\n    assert block.timestamp >= self.deadline and self.balance >= self.goal\r\n    selfdestruct(self.beneficiary)\r\n    \r\n# Not enough money was raised! Refund everyone (max 30 people at a time\r\n# to avoid gas limit issues)\r\ndef refund():\r\n    assert block.timestamp >= self.deadline and self.balance < self.goal\r\n    ind = self.refundIndex\r\n    for i in range(ind, ind + 30):\r\n        if i >= self.nextFunderIndex:\r\n            self.refundIndex = self.nextFunderIndex\r\n            return\r\n        send(self.funders[i].sender, self.funders[i].value)\r\n        self.funders[i] = None\r\n    self.refundIndex = ind + 30"}' --compressed

{"result":"[seq,\n  [mstore, 28, [calldataload, 0]],\n  [mstore, 32, 1461501637330902918203684832716283019655932542976],\n  [mstore, 64, 340282366920938463463374607431768211455],\n  [mstore, 96, -340282366920938463463374607431768211455],\n  [mstore, 128, 3402823669209384634633746074317682114550000000000],\n  [mstore, 160, -3402823669209384634633746074317682114550000000000],\n  # Line 10\n  [codecopy, 320, ~codelen, 96],\n  [assert, [iszero, callvalue]],\n  /* checking address input */ [uclamplt, [codeload, ~codelen], [mload, 32]],\n  /* checking num input */ \n  [clamp,\n    [mload, 96],\n    [codeload, [add, ~codelen, 32]],\n    [mload, 64]],\n  /* checking num input */ \n  [clamp,\n    [mload, 96],\n    [codeload, [add, ~codelen, 64]],\n    [mload, 64]],\n  # Line 11\n  [sstore, 2 <self.beneficiary>, [mload, 320 <_beneficiary>]],\n  # Line 12\n  [sstore,\n    3 <self.deadline>,\n    [clamp, [mload, 96], [add, timestamp, [mload, 384 <_timelimit>]], [mload, 64]]],\n  # Line 13\n  [sstore, 6 <self.timelimit>, [mload, 384 <_timelimit>]],\n  # Line 14\n  [sstore, 4 <self.goal>, [mload, 352 <_goal>]],\n  [return,\n    0,\n    [lll,\n      [seq,\n        [mstore, 28, [calldataload, 0]],\n        [mstore, 32, 1461501637330902918203684832716283019655932542976],\n        [mstore, 64, 340282366920938463463374607431768211455],\n        [mstore, 96, -340282366920938463463374607431768211455],\n        [mstore, 128, 3402823669209384634633746074317682114550000000000],\n        [mstore, 160, -3402823669209384634633746074317682114550000000000],\n        # Line 17\n        [if,\n          [eq, [mload, 0], 3507949986 <participate>],\n          [seq,\n            # Line 19\n            [assert, [slt, timestamp, [sload, 3 <self.deadline>]]],\n            # Line 20\n            [mstore, 320 <nfi>, [sload, 1 <self.nextFunderIndex>]],\n            # Line 21\n            [with,\n              _L,\n              [sha3_32, [add, [sha3_32, 0 <self.funders>], [mload, 320 <nfi>]]],\n              [seq, [sstore, _L, caller], [sstore, [add, _L, 1 <value>], callvalue]]],\n            # Line 22\n            [sstore,\n              1 <self.nextFunderIndex>,\n              [clamp, [mload, 96], [add, [mload, 320 <nfi>], 1], [mload, 64]]],\n            # Line 17\n            stop]],\n        # Line 25\n        [if,\n          [eq, [mload, 0], 1269987571 <finalize>],\n          [seq,\n            [assert, [iszero, callvalue]],\n            # Line 26\n            [assert,\n              [and,\n                [sge, timestamp, [sload, 3 <self.deadline>]],\n                [sge, [balance, address], [sload, 4 <self.goal>]]]],\n            # Line 27\n            [selfdestruct, [sload, 2 <self.beneficiary>]],\n            # Line 25\n            stop]],\n        # Line 31\n        [if,\n          [eq, [mload, 0], 1494096611 <refund>],\n          [seq,\n            [assert, [iszero, callvalue]],\n            # Line 32\n            [assert,\n              [and,\n                [sge, timestamp, [sload, 3 <self.deadline>]],\n                [slt, [balance, address], [sload, 4 <self.goal>]]]],\n            # Line 33\n            [mstore, 320 <ind>, [sload, 5 <self.refundIndex>]],\n            # Line 34\n            [repeat,\n              352,\n              [mload, 320 <ind>],\n              30,\n              [seq,\n                [if,\n                  [sge, [mload, 352 <i>], [sload, 1 <self.nextFunderIndex>]],\n                  # Line 36\n                  [seq,\n                    [sstore, 5 <self.refundIndex>, [sload, 1 <self.nextFunderIndex>]],\n                    # Line 37\n                    [return, 0, 0]]],\n                # Line 38\n                [assert,\n                  [call,\n                    0,\n                    [sload, [sha3_32, [add, [sha3_32, 0 <self.funders>], [mload, 352 <i>]]]],\n                    [sload,\n                      [add,\n                        [sha3_32, [add, [sha3_32, 0 <self.funders>], [mload, 352 <i>]]],\n                        1 <value>]],\n                    0,\n                    0,\n                    0,\n                    0]],\n                # Line 39\n                [with,\n                  _L,\n                  [sha3_32, [add, [sha3_32, 0 <self.funders>], [mload, 352 <i>]]],\n                  [seq, [sstore, _L, 0], [sstore, [add, _L, 1 <value>], 0]]]]],\n            # Line 40\n            [sstore,\n              5 <self.refundIndex>,\n              [clamp, [mload, 96], [add, [mload, 320 <ind>], 30], [mload, 64]]],\n            # Line 31\n            stop]]],\n      0]]]"}
```

## Compile all

Endpoint: https://api.viperid.online/compile/

## Example with JavaScript

You could make a form with a textarea called `code` and with the following JS code compile your source code to ABI.

```js
var formElement = document.getElementById('form');
var formData = new FormData(formElement);
fetch('https://api.viperid.online/abi/', {
  method: "POST",
  body: JSON.stringify({ code: formData.get("code") })
}).then(function (response) {
  return response.json();
}).then(function (responseData) {
  document.getElementById("abi").innerText = JSON.stringify(responseData["result"], undefined, 2);
});
```
## Test

`python tests/tests_viperid.py`

**NOTE: We don't store any data on the servers.**
