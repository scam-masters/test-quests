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


@pytest.fixture(scope="class")
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


@pytest.fixture(scope="class", autouse=True)
def login(driver, user_50_points):
    driver.find_element(By.XPATH, "//*[@id=\"email\"]").send_keys(user_50_points[0])
    driver.find_element(By.XPATH, "//*[@id=\"password\"]").send_keys(user_50_points[1])
    driver.find_element(By.XPATH, "/html/body/div[1]/div/form/button").click()
    wait_landing_render(driver)


class TestLandingPageSuccess:
    def test_first_mission_unlocked(self, driver):
        first_circle_mission = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[1]/a/button"
        )

        """ Check for accessing to the first learning page """
        first_circle_mission.click()

        go_back_button_xpath = '/html/body/div[1]/div/div[2]/a[1]/button'
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, go_back_button_xpath))
        )

        assert driver.find_element(By.XPATH, go_back_button_xpath).text == "Go back to main page"
        driver.find_element(By.XPATH, go_back_button_xpath).click()
        wait_landing_render(driver)

    def test_mission_points(self, driver):
        first_circle_mission = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[1]/a/button"
        )

        second_circle_mission = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[2]/a/button"
        )

        assert "Path Traversal" in first_circle_mission.text and "Login Bypass" in second_circle_mission.text
        assert "50/50" in first_circle_mission.text and "0/50" in second_circle_mission.text

    def test_header_points(self, driver):
        header_points = driver.find_element(
            By.XPATH, "/html/body/header/div[1]/div/span[2]"
        )
        assert "50" in header_points.text


class TestLandingPageUnsuccess:
    def test_mission_locked(self, driver):
        locked_circle_mission = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[3]/button"
        )
        assert locked_circle_mission.text == "Mission Locked"

        """ Check for accessing to the first learning page """
        locked_circle_mission.click()

        popup_element_xpath = '/html/body/div[3]/div/div[1]/div[1]'
        try:
            WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.XPATH, popup_element_xpath))
            )
        except TimeoutException:
            raise NoSuchElementException(f"Element with XPath {popup_element_xpath} not found after waiting.")

        popup_element = driver.find_element(By.XPATH, popup_element_xpath)
        assert popup_element.text == "Mission Locked"