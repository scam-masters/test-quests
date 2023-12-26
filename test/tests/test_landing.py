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
def driver():
    _driver = webdriver.Chrome(ChromeDriverManager().install())
    yield _driver
    _driver.quit()


@pytest.fixture(scope="class", autouse=True)
def load_page(base_url, expected_title, driver):
    driver.get(base_url)
    WebDriverWait(driver, 10).until(EC.title_contains(expected_title))


@pytest.fixture(scope="class", autouse=True)
def login(driver):
    driver.find_element(By.XPATH, "//*[@id=\"email\"]").send_keys('tests@gmail.com')
    driver.find_element(By.XPATH, "//*[@id=\"password\"]").send_keys('testtest')
    driver.find_element(By.XPATH, "/html/body/div[1]/div/form/button").click()
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[1]/a/button")))


class TestLandingPageSuccess:
    def test_working_page(self, driver, expected_title):
        assert expected_title in driver.title

    def test_first_mission(self, driver):
        first_circle_mission = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[1]/a/button"
        )
        assert "Path Traversal" in first_circle_mission.text

        """ Check for accessing to the first learning page """
        first_circle_mission.click()

        go_back_button_xpath = '/html/body/div[1]/div/div[2]/a[1]/button'
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, go_back_button_xpath))
        )

        assert driver.find_element(By.XPATH, go_back_button_xpath).text == "Go back to main page"


class TestLandingPageUnsuccess:
    def test_mission_locked(self, driver):
        locked_circle_mission = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[2]/button"
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