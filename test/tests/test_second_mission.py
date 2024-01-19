import os
import pytest

from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select

from utils import login, get_exercise_submit_button, get_exercise_popup


@pytest.fixture(scope="module")
def base_url():
    return os.environ.get("API_URL", "http://localhost:3000/Login")


@pytest.fixture(scope="module")
def exercise_url():
    return os.environ.get("API_URL", "http://localhost:3000/exercise/2")


@pytest.fixture(scope="module")
def expected_title():
    return "test quests"


@pytest.fixture(scope="class")
def user_tests():
    return ("tests@gmail.com", "testtest")


@pytest.fixture(scope="class")
def driver():
    _options = webdriver.ChromeOptions()
    _options.add_argument("--no-sandbox")
    _options.add_argument("--disable-dev-shm-usage")
    _options.add_argument("--headless")
    _driver = webdriver.Chrome(
        options=_options, service=ChromeService(ChromeDriverManager().install())
    )
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
    def get_dropdowns(self, driver):
        return [
            Select(
                driver.find_element(By.XPATH, f'//*[@id="exercise-form"]/p/select[{i}]')
            )
            for i in range(1, 4)
        ]

    def test_dropdown_selection(self, driver):
        dropdowns = self.get_dropdowns(driver)
        dropdowns[0].select_by_index(3)
        assert dropdowns[0].first_selected_option.text == "' OR 1=1 --"

    def test_wrong_answer(self, driver):
        submit_button = get_exercise_submit_button(driver)
        dropdowns = self.get_dropdowns(driver)
        choices = [1, 1, 1]

        for i, choice in enumerate(choices):
            dropdowns[i].select_by_index(choice)

        submit_button.click()
        popup = get_exercise_popup(driver)
        assert "33%" in popup.text
        driver.find_element(
            By.XPATH, '//*[@id="popup_content"]/div/div[2]/button'
        ).click()

    def test_all_correct_answers(self, driver):
        submit_button = get_exercise_submit_button(driver)
        dropdowns = self.get_dropdowns(driver)
        choices = [3, 1, 2]

        for i, choice in enumerate(choices):
            dropdowns[i].select_by_index(choice)

        submit_button.click()
        popup = get_exercise_popup(driver)
        assert "100%" in popup.text
