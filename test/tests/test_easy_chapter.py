import pytest
from selenium.webdriver.common.by import By


from utils import login, wait_landing_render


@pytest.fixture(scope="class", autouse=True)
def login_user_50_points(driver, user_50_points):
    login(driver, user_50_points[0], user_50_points[1])


# before each method we need to navigate to the correct page!!!!
@pytest.fixture(scope="function", autouse=True)
def navigate_to_easy_chapter(driver, base_url):
    driver.get(base_url + "/chapter/easy")
    driver.find_element(By.XPATH, "//button[contains(., 'Path Traversal')]")


class TestChapterPageSuccess:
    def test_first_mission_unlocked(self, driver):
        first_circle_mission = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[1]/a/button"
        )

        """ Check for accessing to the first learning page """
        first_circle_mission.click()

        go_back_button_xpath = driver.find_element(
            By.XPATH, "/html/body/div[1]/div/div[2]/a[1]/button"
        )

        assert go_back_button_xpath.text == "Go back to chapter page"
        go_back_button_xpath.click()
        wait_landing_render(driver)

    def test_mission_points(self, driver):
        first_circle_mission = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[1]/a/button"
        )

        second_circle_mission = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[2]/a/button"
        )

        assert (
            "Path Traversal" in first_circle_mission.text
            and "Login Bypass" in second_circle_mission.text
        )
        assert (
            "50/50" in first_circle_mission.text
            and "0/50" in second_circle_mission.text
        )


class TestChapterPageUnsuccess:
    def test_mission_locked(self, driver):
        locked_circle_mission = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[3]/button"
        )
        assert locked_circle_mission.text == "Mission Locked"

        """ Check for accessing to the first learning page """
        locked_circle_mission.click()
        popup_element = driver.find_element(
            By.XPATH, "/html/body/div[3]/div/div[1]/div[1]"
        )
        assert popup_element.text == "Mission Locked"
