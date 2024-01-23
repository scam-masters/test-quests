import pytest
import os
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService


@pytest.fixture(scope="session")
def driver():
    _options = webdriver.ChromeOptions()
    _options.add_argument("--no-sandbox")
    _options.add_argument("--disable-dev-shm-usage")
    _options.add_argument("--headless")
    _driver = webdriver.Chrome(
        options=_options, service=ChromeService(ChromeDriverManager().install())
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


@pytest.fixture(scope="class", autouse=True)
def load_login_page(base_url, expected_title, driver):
    driver.get(base_url + "/Login")
    assert expected_title in driver.title
