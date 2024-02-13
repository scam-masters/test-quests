import pytest
from selenium.webdriver.common.by import By


from utils import login
from utils import wait_chapter2_landing_render


@pytest.fixture(scope="class", autouse=True)
def login_user_all_unlocked2(driver, user_all_unlocked2):
    login(driver, user_all_unlocked2[0], user_all_unlocked2[1])


# before each method we need to navigate to the correct page!!!!
@pytest.fixture(scope="function", autouse=True)
def navigate_to_hard_chapter(driver, base_url):
    driver.get(base_url + "/chapter/hard")
    print("Current url: ", driver.current_url)
    

class TestChapterPageSuccess:
    def test_first_mission_unlocked(self, driver):
        first_circle_mission = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[1]/a/button"
        )

        """ Check for accessing to the first learning page """
        first_circle_mission.click()
        driver.implicitly_wait()
        go_back_button_xpath = driver.find_element(
            By.ID, 'back_to_main'
        )
        print(go_back_button_xpath.text)
        assert go_back_button_xpath.text == "Go back to chapter page"
        go_back_button_xpath.click()
        wait_chapter2_landing_render(driver)