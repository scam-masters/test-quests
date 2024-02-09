import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver import ActionChains

from utils import login, get_exercise_popup, get_exercise_submit_button

@pytest.fixture(scope="class", autouse=True)
def login_user_tests(driver, user_tests):
    login(driver, user_tests[0], user_tests[1])

# before each method we need to navigate to the correct page
@pytest.fixture(scope="function", autouse=True)
def navigate_to_first_mission(driver, base_url):
    driver.get(base_url + "/exercise/1")

class TestFifthMission:
    def answer_block_xpath(self, text):
        return f'//*[@id="pane2_1"]/div/table/tbody/tr/td[2]/span[text()="{text}"]'

    def test_drag_and_drop(self, driver):
        element = driver.find_element(By.XPATH, self.answer_block_xpath("Test Case"))
        target = driver.find_element(By.XPATH, self.answer_block_xpath("Assertion"))
        print(element.text, target.text)

        action_chains = ActionChains(driver)
        action_chains.drag_and_drop(element, target).perform()