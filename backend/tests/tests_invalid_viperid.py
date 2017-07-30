from viperid import app
import unittest


class ViperidTestCase(unittest.TestCase):
    contract_1 = {
        'code': 'import os\ndef foo(x: num) -> num:\n    return x * 2'
    }
    error = {'error': {'line_no': 1, 'message': 'Invalid top-level statement', 'source_code': ['import os', 'def foo(x: num) -> num:', '    return x * 2'], 'text': ''}}

    def setUp(self):
        app.testing = True

    def test_compile_to_abi(self):
        with app.test_client() as c:
            rv = c.post('/abi/', json=self.contract_1)
            assert rv.status_code == 400
            assert rv.is_json
            assert rv.get_json() == self.error

    def test_compile_to_ir(self):
        with app.test_client() as c:
            rv = c.post('/ir/', json=self.contract_1)
            assert rv.status_code == 400
            assert rv.is_json
            assert rv.get_json() == self.error

    def test_compile_to_bytecode(self):
        with app.test_client() as c:
            rv = c.post('/bytecode/', json=self.contract_1)
            assert rv.status_code == 400
            assert rv.is_json
            assert rv.get_json() == self.error

if __name__ == '__main__':
    unittest.main()