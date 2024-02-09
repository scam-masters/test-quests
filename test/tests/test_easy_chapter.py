import pytest
from selenium.webdriver.common.by import By


from utils import login, wait_landing_render


@pytest.fixture(scope="class", autouse=True)
def login_user_50_points(driver, user_0_points):
    login(driver, user_0_points[0], user_0_points[1])


# before each method we need to navigate to the correct page!!!!
@pytest.fixture(scope="function", autouse=True)
def navigate_to_easy_chapter(driver, base_url):
    driver.get(base_url + "/chapter/easy")
    driver.find_element(By.XPATH, "//button[contains(text(),'Unit Test: Mastering Basics')]")


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
            By.CSS_SELECTOR, "/html/body/div[1]/div[1]/a/button"
        )

        second_circle_mission = driver.find_element(
            By.CSS_SELECTOR, "circle-mission-locked translate-x-[110%]" # the mission locked is not working
            # "/html/body/div[1]/div[2]/a/button" not recognizable in firefox
        )

        assert (
            "Unit Test: Mastering Basics" in first_circle_mission.text
            and "Login Bypass" in second_circle_mission.text
        )
        assert (
            "50/50" in first_circle_mission.text
            and "0/50" in second_circle_mission.text
        )

class TestChapterPageUnsuccess:
    def test_mission_locked(self, driver):
        locked_circle_mission = driver.find_element(
            By.CLASS_NAME, #"/html[1]/body[1]/div[1]/div[2]/a[1]/button[1]" # for firefox
            #"/html/body/div[1]/div[3]/button" # previous for Chrome
            "circle-mission-locked translate-x-[110%]"
        )
        assert locked_circle_mission.text == "Mission Locked"

        """ Check for accessing to the first learning page """
        locked_circle_mission.click()
        popup_element = driver.find_element(
            By.XPATH, "/html/body/div[3]/div/div[1]/div[1]"
        )
        assert popup_element.text == "Mission Locked"
