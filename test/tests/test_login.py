import os
import pytest

from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

from utils import login, assert_to_be_on_landing

@pytest.fixture(scope="module")
def base_url():
    return os.environ.get("API_URL", "http://localhost:3000/Login")

@pytest.fixture(scope="module")
def expected_title():
    return "test quests"


@pytest.fixture(scope="class")
def driver():
    _driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
    yield _driver
    _driver.quit()


@pytest.fixture(autouse=True)
def load_page(base_url, expected_title, driver):
    driver.get(base_url)
    WebDriverWait(driver, 10).until(EC.title_contains(expected_title))


@pytest.fixture(scope="class")
def user_50_points():
    return ("test_50_points_user@gmail.com", "test_50_points_user")


@pytest.fixture(scope="class")
def user_non_existent():
    return ("non_existent@gmail.com", "non_existent")


class TestLoginSuccessful:
    def test_login_success(self, driver, user_50_points):
        login(driver, user_50_points[0], user_50_points[1])
        assert_to_be_on_landing(driver)

class TestLoginUnsuccessful:
    def test_login_invalid(self, driver, user_non_existent):
        login(driver, user_non_existent[0], user_non_existent[1], wait_for_landing=False)
        error_msg_id = "error_msg"
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, error_msg_id)))
        error_msg = driver.find_element(By.ID, error_msg_id)
        assert error_msg.text == "Invalid e-mail or password."

    def test_login_empty(self, driver):
        login(driver, "", "", wait_for_landing=False)
        error_msg_id = "error_msg"
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, error_msg_id)))
        error_msg = driver.find_element(By.ID, error_msg_id)
        assert error_msg.text == "Please fill all the fields."
