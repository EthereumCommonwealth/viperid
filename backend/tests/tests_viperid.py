from viperid import app
import unittest


class ViperidTestCase(unittest.TestCase):
    contract_1 = {
        'code': 'def foo(x: num) -> num:\n    return x * 2'
    }

    def setUp(self):
        app.testing = True

    def test_compile_to_abi(self):
        result = {'result': [{'constant': False, 'inputs': [{'name': 'x', 'type': 'int128'}], 'name': 'foo(int128)', 'outputs': [{'name': 'out', 'type': 'int128'}], 'payable': False, 'type': 'function'}]}
        with app.test_client() as c:
            rv = c.post('/abi/', json=self.contract_1)
            assert rv.status_code == 200
            assert rv.is_json
            assert rv.get_json() == result

    def test_compile_to_ir(self):
        result = {'result': '[seq,\n  [return,\n    0,\n    [lll,\n      [seq,\n        [mstore, 28, [calldataload, 0]],\n        [mstore, 32, 1461501637330902918203684832716283019655932542976],\n        [mstore, 64, 340282366920938463463374607431768211455],\n        [mstore, 96, -340282366920938463463374607431768211455],\n        [mstore, 128, 3402823669209384634633746074317682114550000000000],\n        [mstore, 160, -3402823669209384634633746074317682114550000000000],\n        # Line 1\n        [if,\n          [eq, [mload, 0], 3650092561 <foo>],\n          [seq,\n            [calldatacopy, 320, 4, 32],\n            [assert, [iszero, callvalue]],\n            /* checking num input */ [clamp, [mload, 96], [calldataload, 4], [mload, 64]],\n            # Line 2\n            [mstore, 0, [mul, [mload, 320 <x>], 2]],\n            [return, 0, 32],\n            # Line 1\n            stop]]],\n      0]]]'}
        with app.test_client() as c:
            rv = c.post('/ir/', json=self.contract_1)
            assert rv.status_code == 200
            assert rv.is_json
            assert rv.get_json() == result

    def test_compile_to_bytecode(self):
        result = {'result': '0x6100d956600035601c52740100000000000000000000000000000000000000006020526fffffffffffffffffffffffffffffffff6040527fffffffffffffffffffffffffffffffff000000000000000000000000000000016060527402540be3fffffffffffffffffffffffffdabf41c006080527ffffffffffffffffffffffffdabf41c00000000000000000000000002540be40060a05263d98ffe1160005114156100d457602060046101403734151558576060516004358060405190135857809190125857506002610140510260005260206000f3005b5b6100046100d9036100046000396100046100d9036000f3'}
        with app.test_client() as c:
            rv = c.post('/bytecode/', json=self.contract_1)
            assert rv.status_code == 200
            assert rv.is_json
            assert rv.get_json() == result

if __name__ == '__main__':
    unittest.main()