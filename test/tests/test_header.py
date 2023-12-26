import os
import pytest

from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException


@pytest.fixture(scope="module")
def base_url():
    return os.environ.get("API_URL", "http://localhost:3000/Login")


@pytest.fixture(scope="module")
def expected_title():
    return "test quests"


@pytest.fixture(scope="module")
def user_new():
    return ("test_new_user@gmail.com", "test_new_user")


@pytest.fixture(scope="module")
def user_0_points():
    return ("test_0_points_user@gmail.com", "test_0_points_user")


@pytest.fixture(scope="module")
def user_50_points():
    return ("test_50_points_user@gmail.com", "test_50_points_user")


@pytest.fixture(scope="class")
def driver():
    _driver = webdriver.Chrome(ChromeDriverManager().install())
    yield _driver
    _driver.quit()


@pytest.fixture(scope="class", autouse=True)
def load_page(base_url, expected_title, driver):
    driver.get(base_url)
    WebDriverWait(driver, 10).until(EC.title_contains(expected_title))


def wait_landing_render(driver):
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[1]/a/button")))


def login(driver, email, password):
    driver.find_element(By.XPATH, "//*[@id=\"email\"]").send_keys(email)
    driver.find_element(By.XPATH, "//*[@id=\"password\"]").send_keys(password)
    driver.find_element(By.XPATH, "/html/body/div[1]/div/form/button").click()
    wait_landing_render(driver)


class TestHeaderUserNew:
    def test_working_page(self, driver, expected_title, user_new):
        login(driver, user_new[0], user_new[1])
        assert expected_title in driver.title

    def test_header_points(self, driver):
        header_points = driver.find_element(
            By.XPATH, "/html/body/header/div[1]/div/span[2]"
        )
        assert header_points.text == "-"


class TestHeaderUser0Points:
    def test_working_page(self, driver, expected_title, user_0_points):
        login(driver, user_0_points[0], user_0_points[1])
        assert expected_title in driver.title

    def test_header_points(self, driver):
        header_points = driver.find_element(
            By.XPATH, "/html/body/header/div[1]/div/span[2]"
        )
        assert header_points.text == "0"


class TestHeaderUser50Points:
    def test_working_page(self, driver, expected_title, user_50_points):
        login(driver, user_50_points[0], user_50_points[1])
        assert expected_title in driver.title

    def test_header_points(self, driver):
        header_points = driver.find_element(
            By.XPATH, "/html/body/header/div[1]/div/span[2]"
        )
        assert header_points.text == "50"