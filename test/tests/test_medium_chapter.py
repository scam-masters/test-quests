import pytest
from selenium.webdriver.common.by import By


from utils import login
from utils import wait_chapter2_landing_render


@pytest.fixture(scope="class", autouse=True)
def login_user_all_unlocked2(driver, user_all_unlocked2):
    login(driver, user_all_unlocked2[0], user_all_unlocked2[1])


# before each method we need to navigate to the correct page!!!!
@pytest.fixture(scope="function", autouse=True)
def navigate_to_easy_chapter(driver, base_url):
    driver.get(base_url + "/storyline/python/chapter/medium")
    driver.find_element(By.XPATH, "//button[contains(text(),'SQL Injection UNION Attacks')]")

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
        wait_chapter2_landing_render(driver)

    def test_mission_points(self, driver):
        first_circle_mission = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[1]/a/button"
        )

        second_circle_mission = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[2]/a/button" # the mission locked is not working
            # "/html/body/div[1]/div[2]/a/button" not recognizable in firefox
        )
        
        first_circle_points = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[1]/a/button/span"
        )
        
        second_circle_points = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[2]/a/button/span"
        )

        assert (
            "SQL Injection UNION Attacks" in first_circle_mission.text
            and "E2E Testing Exercise" in second_circle_mission.text
        )
        assert (
            "100/100" in first_circle_points.text
            and "0/100" in second_circle_points.text
        )

class TestChapterPageUnsuccess:
    def test_mission_locked(self, driver):
        locked_circle_mission = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[3]/button"
        )
        assert "Mission Locked" in locked_circle_mission.text

        """ Check for accessing to the first learning page """
        locked_circle_mission.click()
        popup_element = driver.find_element(
           By.ID, "mission_locked_popup"
        )
        assert"Mission Locked" in popup_element.text
