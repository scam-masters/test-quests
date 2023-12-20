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
    return "test quests"


@pytest.fixture(scope="class")
def driver():
    _driver = webdriver.Chrome(ChromeDriverManager().install())
    yield _driver
    _driver.quit()


@pytest.fixture(autouse=True)
def load_page(base_url, expected_title, driver):
    driver.get(base_url)
    WebDriverWait(driver, 10).until(EC.title_contains(expected_title))


class TestScore:
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
        WebDriverWait(driver, 10).until(EC.visibility_of(driver.find_element(By.XPATH, "/html/body/div/div/div[3]/button[2]")))


    def get_target(self, driver):
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

    def get_element(self, driver):
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

    def get_submit_button(self, driver):
        return driver.find_element(By.XPATH, '//*[@id="root"]/div/div[3]/button[2]')

    def get_popup(self, driver):
        popup = driver.find_element(By.XPATH, "/html/body/div[2]/div")
        WebDriverWait(driver, 10).until(EC.visibility_of(popup))
        return popup

    def test_drag_and_drop(self, driver):
        self.goto_first_mission(driver)

        element = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[1]')
        target = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[1]')
        expected_text = element.text

        action_chains = ActionChains(driver)
        action_chains.drag_and_drop(element, target).perform()
        assert target.text == expected_text

    def test_score_success(self, driver, expected_title):
        element = self.get_element(driver)
        target = self.get_target(driver)
        submit_button = self.get_submit_button(driver)

        action_chains = ActionChains(driver)
        action_chains.drag_and_drop(element[0], target[1]).perform()
        action_chains.drag_and_drop(element[1], target[3]).perform()
        action_chains.drag_and_drop(element[2], target[6]).perform()
        action_chains.drag_and_drop(element[3], target[2]).perform()
        action_chains.drag_and_drop(element[4], target[4]).perform()
        action_chains.drag_and_drop(element[5], target[0]).perform()
        action_chains.drag_and_drop(element[6], target[5]).perform()

        submit_button.click()
        popup = self.get_popup(driver)
        assert "100%" in popup.text

    def test_score_fail(self, driver):
        element = self.get_element(driver)
        target = self.get_target(driver)
        submit_button = self.get_submit_button(driver)

        action_chains = ActionChains(driver)
        action_chains.drag_and_drop(element[0], target[3]).perform()
        action_chains.drag_and_drop(element[1], target[1]).perform()
        action_chains.drag_and_drop(element[2], target[2]).perform()
        action_chains.drag_and_drop(element[3], target[6]).perform()
        action_chains.drag_and_drop(element[4], target[0]).perform()
        action_chains.drag_and_drop(element[5], target[5]).perform()
        action_chains.drag_and_drop(element[6], target[4]).perform()

        submit_button.click()
        popup = self.get_popup(driver)

        assert "100%" not in popup.text
