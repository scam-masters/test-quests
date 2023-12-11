# Tests
Tests are under the ```test/``` directory and are run with selenium and pytest.

To set up tests:
```
pip install -r requirements.txt
```

And then run tests:
```
python test_<test name>
```

## Implemented Tests

Given that we are on landing page
When user click on "Path Traversal" button
Then user will be directed to the next page

Given that we are the Mission story page
When user click on Go Back to main page button
Then user should be redirected to main page
