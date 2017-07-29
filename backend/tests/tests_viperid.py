from viperid import app
import unittest


class ViperidTestCase(unittest.TestCase):

    def setUp(self):
        app.testing = True

    def test_compile_to_abi(self):
        json_data = {
            'code': 'def foo(x: num) -> num:\n    return x * 2'
        }
        result = {'result': [{'constant': False, 'inputs': [{'name': 'x', 'type': 'int128'}], 'name': 'foo(int128)', 'outputs': [{'name': 'out', 'type': 'int128'}], 'payable': False, 'type': 'function'}]}
        with app.test_client() as c:
            rv = c.post('/abi/', json=json_data)
            assert rv.status_code == 200
            assert rv.is_json
            assert rv.get_json() == result

if __name__ == '__main__':
    unittest.main()