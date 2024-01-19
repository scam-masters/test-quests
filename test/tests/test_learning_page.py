import os
import pytest

from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from utils import login, assert_to_be_on_landing, assert_to_be_on_exercise


@pytest.fixture(scope="module")
def base_url():
    return os.environ.get("API_URL", "http://localhost:3000/Login")


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
def login_user_tests(driver, user_tests):
    driver.implicitly_wait(10)
    login(driver, user_tests[0], user_tests[1])


class TestLearningPages:
    def get_buttons(self, driver):
        return [
            driver.find_element(By.ID, id)
            for id in ["back_to_main", "learn_more", "start_exercise"]
        ]

    @pytest.mark.parametrize(
        "learning_url", [f"http://localhost:3000/learning/{i}" for i in range(1, 3)]
    )
    def test_learning_pages(self, driver, learning_url):
        driver.get(learning_url)
        self.get_buttons(driver)[0].click()
        assert_to_be_on_landing(driver)

        driver.get(learning_url)
        self.get_buttons(driver)[2].click()
        assert_to_be_on_exercise(driver)
