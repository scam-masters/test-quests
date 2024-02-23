import time
import pytest
from selenium.webdriver.common.by import By


from utils import login, wait_landing_render


@pytest.fixture(scope="class", autouse=True)
def login_user_50_points(driver, user_freshly_registered):
    login(driver, user_freshly_registered[0], user_freshly_registered[1])
    
# before each method we need to navigate to the correct page!!!!
@pytest.fixture(scope="function", autouse=True)
def navigate_to_hard_chapter(driver, base_url):
    driver.get(base_url)


class TestLandingPage:
    def test_first_storyline(self, driver):
        wait_landing_render(driver)

        first_storyline = driver.find_element(
            By.id, "storyline_0"
        )
        
        first_storyline.click()
        time.sleep(1)

        """ Check for accessing to the first storyline page"""

        go_back_button_xpath = driver.find_element(By.ID, "back_to_main")

        # print(go_back_button_xpath.text)
        assert go_back_button_xpath.text == "Go back to chapter page"

        # the chapter page has a state which is initialized with an empty string, so 
        # the link does not work without waiting 🤡
        time.sleep(1)
        go_back_button_xpath.click()

        

    def test_second_storyine(self,driver):
        wait_landing_render(driver)
        
        second_storyline = driver.find_element(
            By.id, "storyline_1"
        )
        
        second_storyline.click()
        time.sleep(1)

        """ Check for accessing to the second storyline page """
        
