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


class TestScore:
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

    @pytest.fixture(scope="class", autouse=True)
    def target(self, driver):
        targets = []
        targets.append(
            driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[1]')
        )
        targets.append(
            driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[2]')
        )
        targets.append(
            driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[3]')
        )
        targets.append(
            driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[4]')
        )
        targets.append(
            driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[5]')
        )
        targets.append(
            driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[6]')
        )
        targets.append(
            driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[7]')
        )

        return targets

    @pytest.fixture(scope="class", autouse=True)
    def element(self, driver):
        elements = []
        elements.append(
            driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[1]')
        )
        elements.append(
            driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[2]')
        )
        elements.append(
            driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[3]')
        )
        elements.append(
            driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[4]')
        )
        elements.append(
            driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[5]')
        )
        elements.append(
            driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[6]')
        )
        elements.append(
            driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[7]')
        )

        return elements

    @pytest.fixture(scope="class", autouse=True)
    def submit_button(self, driver):
        return driver.find_element(By.XPATH, '//*[@id="root"]/div/div[3]/button[2]')

    @pytest.fixture(scope="class", autouse=True)
    def popup_button(self, driver):
        return driver.find_element(By.XPATH, '//*[@id="root"]/div/div[3]/button[2]')

    def test_score_success(
        self, driver, target, element, submit_button, popup_button, expected_title
    ):
        action_chains = ActionChains(driver)
        action_chains.drag_and_drop(element[0], target[1]).perform()
        action_chains.drag_and_drop(element[1], target[3]).perform()
        action_chains.drag_and_drop(element[2], target[6]).perform()
        action_chains.drag_and_drop(element[3], target[2]).perform()
        action_chains.drag_and_drop(element[4], target[4]).perform()
        action_chains.drag_and_drop(element[5], target[0]).perform()
        action_chains.drag_and_drop(element[6], target[5]).perform()

        submit_button.click()
        popup_button.click()

        assert expected_title in driver.title

    def test_score_fail(self, driver, element, target, submit_button, popup_button):
        action_chains = ActionChains(driver)
        action_chains.drag_and_drop(element[0], target[3]).perform()
        action_chains.drag_and_drop(element[1], target[1]).perform()
        action_chains.drag_and_drop(element[2], target[2]).perform()
        action_chains.drag_and_drop(element[3], target[6]).perform()
        action_chains.drag_and_drop(element[4], target[0]).perform()
        action_chains.drag_and_drop(element[5], target[5]).perform()
        action_chains.drag_and_drop(element[6], target[4]).perform()

        submit_button.click()
        popup_button.click()

        assert element[0].is_displayed(), "You are still in the exercise page"
