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
    driver.get(base_url + "/exercise/5")

class TestFifthMission:

    def position_block_xpath(self, i):
        return f'//*[@id="pane2_1"]/div/table/tbody/tr[{i}]/td[2]/span'

    def answer_block_xpath(self, i):
        return f'//*[@id="pane2_1"]/div/table/tbody//td[2]/span[text()="{i}"]'
    
    def get_targets(self, driver):
        return [
            driver.find_element(By.XPATH, self.position_block_xpath(i)) for i in range(1, 5)
        ]

    def get_elements(self, driver):
        solution = ["Test Case", "Assertion", "Test Suite", "Test Runner", "Test Fixture"]
        elements = [
            driver.find_element(By.XPATH, self.answer_block_xpath(i)) for i in solution
        ]

        for element in elements:
            print(element.text)
        
        return elements

    # def test_drag_and_drop(self, driver):
    #     element = driver.find_element(By.XPATH, "//*[@id='pane2_1']/div/div/span")
    #     target = driver.find_element(By.XPATH, self.empty_block_xpath(1))
    #     expected_text = element.text

    #     action_chains = ActionChains(driver)
    #     action_chains.drag_and_drop(element, target).perform()
    #     assert target.text == expected_text

    def test_score_correct(self, driver):
        driver.get("http://localhost:3000/exercise/5")
        elements = self.get_elements(driver)
        targets = self.get_targets(driver)
        submit_button = get_exercise_submit_button(driver)

        action_chains = ActionChains(driver)
        action_chains.drag_and_drop(elements[0], targets[0]).perform()
        action_chains.drag_and_drop(elements[1], targets[1]).perform()
        action_chains.drag_and_drop(elements[2], targets[2]).perform()
        action_chains.drag_and_drop(elements[3], targets[3]).perform()
        action_chains.drag_and_drop(elements[4], targets[4]).perform()

        submit_button.click()
        popup = get_exercise_popup(driver)

        assert "You" in popup.text

    # def test_score_fail(self, driver):
    #     driver.get("http://localhost:3000/exercise/5")
    #     elements = self.get_elements(driver)
    #     submit_button = get_exercise_submit_button(driver)

    #     action_chains = ActionChains(driver)
    #     action_chains.drag_and_drop(elements[0], targets[6]).perform()
    #     action_chains.drag_and_drop(elements[1], targets[5]).perform()
    #     action_chains.drag_and_drop(elements[2], targets[4]).perform()
    #     action_chains.drag_and_drop(elements[3], targets[3]).perform()
    #     action_chains.drag_and_drop(elements[4], targets[2]).perform()
    #     action_chains.drag_and_drop(elements[5], targets[1]).perform()
    #     action_chains.drag_and_drop(elements[6], targets[0]).perform()

    #     submit_button.click()
    #     popup = get_exercise_popup(driver)

    #     assert "You need more effort!" in popup.text
