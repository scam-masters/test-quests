import pytest
import os
from selenium import webdriver
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service as FirefoxService


@pytest.fixture(scope="session")
def driver():
    _options = webdriver.FirefoxOptions()
    _options.add_argument("--no-sandbox")
    _options.add_argument("--disable-dev-shm-usage")
    _options.add_argument("--headless")
    _driver = webdriver.Firefox(
        options=_options, service=FirefoxService(GeckoDriverManager().install())
    )
    _driver.implicitly_wait(5)
    yield _driver
    _driver.quit()


@pytest.fixture(scope="session")
def base_url():
    return os.environ.get("API_URL", "http://localhost:3000")


@pytest.fixture(scope="session")
def expected_title():
    return "test quests"

@pytest.fixture(scope="function")
def submit_exercise_button(driver):
    return driver.find_element(By.ID, "submit_button")


# ----------------------- USERS -----------------------
@pytest.fixture(scope="session")
def user_new():
    return ("test_new_user@gmail.com", "test_new_user")


@pytest.fixture(scope="session")
def user_0_points():
    return ("test_0_points_user@gmail.com", "test_0_points_user")


@pytest.fixture(scope="session")
def user_50_points():
    return ("test_50_points_user@gmail.com", "test_50_points_user")


@pytest.fixture(scope="session")
def user_tests():
    return ("tests@gmail.com", "testtest")


@pytest.fixture(scope="session")
def user_non_existent():
    return ("non_existent@gmail.com", "non_existent")


@pytest.fixture(scope="session")
def user_all_unlocked():
    return ("test_all_unlocked@gmail.com", "test_all_unlocked")

@pytest.fixture(scope="session")
def user_all_unlocked2():
    return ("test_all_unlocked2@gmail.com", "test_all_unlocked2")


@pytest.fixture(scope="class", autouse=True)
def load_login_page(base_url, expected_title, driver):
    driver.get(base_url + "/Login")
    assert expected_title in driver.title
