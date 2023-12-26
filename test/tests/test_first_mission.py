import os
import pytest

from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver import ActionChains

from utils import login, get_exercise_popup, get_exercise_submit_button

@pytest.fixture(scope="module")
def base_url():
    return os.environ.get("API_URL", "http://localhost:3000/Login")


@pytest.fixture(scope="module")
def exercise_url():
    return os.environ.get("API_URL", "http://localhost:3000/exercise/1")


@pytest.fixture(scope="module")
def expected_title():
    return "test quests"


@pytest.fixture(scope="class")
def user_tests():
    return ("tests@gmail.com", "testtest")


@pytest.fixture(scope="class")
def driver():
    _driver = webdriver.Chrome(ChromeDriverManager().install())
    yield _driver
    _driver.quit()


@pytest.fixture(scope="class", autouse=True)
def load_page(base_url, expected_title, driver):
    driver.get(base_url)
    WebDriverWait(driver, 10).until(EC.title_contains(expected_title))


@pytest.fixture(scope="class", autouse=True)
def login_user_tests(driver, user_tests, exercise_url):
    driver.implicitly_wait(10)
    login(driver, user_tests[0], user_tests[1])
    driver.get(exercise_url)

class TestFirstMission:
    def get_targets(self, driver):
        base_xpath = '//*[@id="pane2_1"]/div/p[2]/span[{}]'
        return [driver.find_element(By.XPATH, base_xpath.format(i)) for i in range(1, 8)]

    def get_elements(self, driver):
        base_xpath = '//*[@id="pane2_1"]/div/div/span[{}]'
        return [driver.find_element(By.XPATH, base_xpath.format(i)) for i in range(1, 8)]

    def test_drag_and_drop(self, driver):
        element = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[1]')
        target = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[1]')
        expected_text = element.text

        action_chains = ActionChains(driver)
        action_chains.drag_and_drop(element, target).perform()
        assert target.text == expected_text

    ''' TOFIX: is not working properly '''
    def test_score_fail(self, driver):
        elements = self.get_elements(driver)
        targets = self.get_targets(driver)
        submit_button = get_exercise_submit_button(driver)

        action_chains = ActionChains(driver)
        action_chains.drag_and_drop(elements[0], targets[3]).perform()
        action_chains.drag_and_drop(elements[1], targets[1]).perform()
        action_chains.drag_and_drop(elements[2], targets[2]).perform()
        action_chains.drag_and_drop(elements[3], targets[6]).perform()
        action_chains.drag_and_drop(elements[4], targets[0]).perform()
        action_chains.drag_and_drop(elements[5], targets[5]).perform()
        action_chains.drag_and_drop(elements[6], targets[4]).perform()

        submit_button.click()
        popup = get_exercise_popup(driver)

        assert "100%" not in popup.text

