import time
import pytest
from selenium.webdriver.common.by import By


from utils import login, wait_landing_render


@pytest.fixture(scope="class", autouse=True)
def login_user_50_points(driver, user_50_points):
    login(driver, user_50_points[0], user_50_points[1])


# before each method we need to navigate to the correct page!!!!
@pytest.fixture(scope="function", autouse=True)
def navigate_to_easy_chapter(driver, base_url):
    driver.get(base_url + "/storyline/python/chapter/easy")
    driver.find_element(By.XPATH, "//button[contains(text(),'Unit Test: Mastering Basics')]")


class TestChapterPageSuccess:
    def test_first_mission_unlocked(self, driver):
        first_circle_mission = driver.find_element(
            By.XPATH, "//button[contains(@class,'circle-mission-gradient-1')]" # for firefox
            # "/html/body/div[1]/div[1]/a/button" with chrome
        )

        """ Check for accessing to the first learning page """
        first_circle_mission.click()
        time.sleep(2)
        go_back_button_xpath = driver.find_element(
            By.XPATH, "//button[@id='back_to_main']"
        )

        assert go_back_button_xpath.text == "Go back to chapter page"
        go_back_button_xpath.click()
        # # assert the chapter page is loaded
        # time.sleep(1)
        first_circle_mission_again = driver.find_element(
            By.XPATH, "//button[contains(@class,'circle-mission-gradient-1')]" # for firefox
            # "/html/body/div[1]/div[1]/a/button" with chrome
        )
        assert "Unit Test: Mastering Basics" in first_circle_mission_again.text

    def test_mission_points(self, driver):
        first_circle_mission = driver.find_element(
            By.XPATH, "//button[contains(@class,'circle-mission-gradient-1')]"
        )

        second_circle_mission = driver.find_element(
            By.XPATH, "/html/body/div/div[2]/a/button" # the mission locked is not working
            # "/html/body/div[1]/div[2]/a/button" not recognizable in firefox
        )
        
        first_circle_points = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[1]/a/button/span"
        )
        
        second_circle_points = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[2]/a/button/span"
        )

        assert (
            "Unit Test: Mastering Basics" in first_circle_mission.text
            and "Login Bypass" in second_circle_mission.text
        )
        assert (
            "50/50" in first_circle_points.text
            and "0/50" in second_circle_points.text
        )

class TestChapterPageUnsuccess:
    def test_mission_locked(self, driver):
        locked_circle_mission = driver.find_element(
            By.XPATH, #"/html[1]/body[1]/div[1]/div[2]/a[1]/button[1]" # for firefox
            #"/html/body/div[1]/div[3]/button" # previous for Chrome
            #"circle-mission-locked translate-x-[110%]"
            #"/html/body/div[1]/div[3]/button"
            "//button[@class='min-w-[10%] circle-mission-locked translate-x-[110%]']"
        )
        assert "Mission Locked" in locked_circle_mission.text

        """ Check for accessing to the first learning page """
        locked_circle_mission.click()
        popup_element = driver.find_element(
            By.XPATH, "/html/body/div/div[6]/div"
        )
        assert "Mission Locked" in popup_element.text
