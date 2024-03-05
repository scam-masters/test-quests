# Tests
Tests modules are contained in files under the ```test/tests``` directory and are ran with selenium and pytest.

## Setup and run
To set up tests, run the following commands:
```bash
cd test
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Then, to run tests use the command:
```bash
pytest tests/
```

Note that to make tests work, the local development server for the website must be running at [localhost:3000](localhost:3000). For more information see the [Frontend Documentation](https://github.com/scam-masters/test-quests/blob/main/documentation/frontend.md)

## Tests Structure
To simplify tests we decided to use pytest fixtures to initialize the driver used to execute tests and other parameters that are frequently passed to functions (e.g., credentials to perform login). 
These fixtures are contained into the `conftest.py` file, which is accessible by all the different test modules, and are created when first requested by a test. 

Then, they are destroyed based on their scope:
- `scope="function"`: the default scope, the fixture is destroyed at the end of the test.
- `scope="class"`: the fixture is destroyed during teardown of the last test in the class.
- `scope="module"`: the fixture is destroyed during teardown of the last test in the module.
- `scope="package"`: the fixture is destroyed during teardown of the last test in the package.
- `scope="session"`: the fixture is destroyed at the end of the test session.

The majority of the fixtures contained in the `conftest.py` file have scope session, meaning that they are created only once per test session. An example is the `driver()` fixture, that creates the selenium webdriver used to perform tests on our website:

```python
@pytest.fixture(scope="session")
def driver():
    _options = webdriver.ChromeOptions()
    _options.add_argument("--no-sandbox")
    _options.add_argument("--disable-dev-shm-usage")
    _options.add_argument("--headless")
    _options.add_argument("--log-level=3")
    _driver = webdriver.Chrome(
        options=_options,
        service=ChromeService(ChromeDriverManager().install()),
    )
    _driver.implicitly_wait(5)
    yield _driver
    _driver.quit()
```

Each test module may contain other specific fixtures used by the functions contained in it. Furthermore, it contains the test class with the test functions that are executed by pytest. 