import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver import ActionChains

from utils import login, get_exercise_popup, get_exercise_submit_button

from time import sleep


@pytest.fixture(scope="class", autouse=True)
def login_user_tests(driver, user_tests):
    login(driver, user_tests[0], user_tests[1])


# before each method we need to navigate to the correct page!!!!
@pytest.fixture(scope="function", autouse=True)
def navigate_to_mission(driver, base_url):
    driver.get(base_url + "/exercise/5")


class TestDndExercise:
    def empty_block_xpath(self, i):
        return f'//*[@id="pane2_1"]/div/p[2]/span[text() = "___"][{i}]'

    def answer_block_xpath(self, i):
        return f'//*[@id="pane2_1"]/div/div/span[text()="{i}"]'

    def get_targets(self, driver):
        return [
            driver.find_element(By.XPATH, self.empty_block_xpath(i))
            for i in range(1, 8)
        ]

    def get_elements(self, driver):
        solution = ["files.php", "?", "file=", "../", "../", "server/", "flag.txt"]
        elements = [
            driver.find_element(By.XPATH, self.answer_block_xpath(i)) for i in solution
        ]
        # to take the second ../ instead of the first one again
        elements[4] = driver.find_element(
            By.XPATH, '//*[@id="pane2_1"]/div/div/span[text()="../"][2]'
        )

        return elements

    def test_drag_and_drop(self, driver):
        element = driver.find_element(By.XPATH, "//*[@id='pane2_1']/div/div/span")
        target = driver.find_element(By.XPATH, self.empty_block_xpath(1))
        expected_text = element.text

        action_chains = ActionChains(driver)
        action_chains.drag_and_drop(element, target).perform()
        assert target.text == expected_text

    def test_score_correct(self, driver):
        # driver.get("http://localhost:3000/exercise/5")
        elements = self.get_elements(driver)
        targets = self.get_targets(driver)
        submit_button = get_exercise_submit_button(driver)

        action_chains = ActionChains(driver)
        action_chains.drag_and_drop(elements[0], targets[0]).perform()
        action_chains.drag_and_drop(elements[1], targets[1]).perform()
        action_chains.drag_and_drop(elements[2], targets[2]).perform()
        action_chains.drag_and_drop(elements[3], targets[3]).perform()
        action_chains.drag_and_drop(elements[4], targets[4]).perform()
        action_chains.drag_and_drop(elements[5], targets[5]).perform()
        action_chains.drag_and_drop(elements[6], targets[6]).perform()

        submit_button.click()
        popup = get_exercise_popup(driver)

        assert "You have earned 50 points!" in popup.text

    def test_score_fail(self, driver):
        # driver.get("http://localhost:3000/exercise/1")
        elements = self.get_elements(driver)
        targets = self.get_targets(driver)
        submit_button = get_exercise_submit_button(driver)

        action_chains = ActionChains(driver)
        action_chains.drag_and_drop(elements[0], targets[6]).perform()
        action_chains.drag_and_drop(elements[1], targets[5]).perform()
        action_chains.drag_and_drop(elements[2], targets[4]).perform()
        action_chains.drag_and_drop(elements[3], targets[3]).perform()
        action_chains.drag_and_drop(elements[4], targets[2]).perform()
        action_chains.drag_and_drop(elements[5], targets[1]).perform()

        submit_button.click()
        popup = get_exercise_popup(driver)

        assert "You need to fill all the blanks!" in popup.text
