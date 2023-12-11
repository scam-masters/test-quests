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

Given i'm in the first exercise page
When i drag and drop a piece of code from the possible answers to the empty spaces
Then the empty spaces should be replaced by the code

Given i'm in the first exercise page
When i click on the submit button
Then my answers should be evaluated and the result should be displayed