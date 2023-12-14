import os
import pytest

from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver import ActionChains


@pytest.fixture(scope="module")
def base_url():
    return os.environ.get("API_URL", "http://localhost:3000")


@pytest.fixture(scope="module")
def expected_title():
    return "React App"


@pytest.fixture(scope="class")
def driver():
    _driver = webdriver.Chrome(ChromeDriverManager().install())
    yield _driver
    _driver.quit()


@pytest.fixture(scope="class", autouse=True)
def load_page(base_url, expected_title, driver):
    driver.get(base_url)
    WebDriverWait(driver, 10).until(EC.title_contains(expected_title))


class TestFirstMissionEx:
    @pytest.fixture(scope="class", autouse=True)
    def goto_first_mission(self, driver):
        """
        Click on the first mission button
        """
        driver.find_element(
            By.XPATH, '//*[@id="root"]/div/div[2]/div[1]/button'
        ).click()

        """
        Click on "Start Exercise" button
        """
        driver.find_element(
            By.XPATH, '//*[@id="root"]/div/div[2]/div/div[2]/button[2]'
        ).click()

    def test_first_mission_ex(self, driver):
        element = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[1]')
        target = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[1]')

        action_chains = ActionChains(driver)
        action_chains.drag_and_drop(element, target).perform()
        assert target.text == element.text
