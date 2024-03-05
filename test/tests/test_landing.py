import time
import pytest
from selenium.webdriver.common.by import By


from utils import login, wait_landing_render, wait_storyline1_render, wait_storyline2_render, wait_chapter1_landing_render


@pytest.fixture(scope="class", autouse=True)
def login_user_50_points(driver, user_freshly_registered):
    login(driver, user_freshly_registered[0], user_freshly_registered[1])
    
# before each method we need to navigate to the correct page!!!!
@pytest.fixture(scope="function", autouse=True)
def navigate_to_landing(driver, base_url):
    driver.get(base_url)


class TestLandingPage:
    def test_first_storyline(self, driver):
        wait_landing_render(driver)

        first_storyline = driver.find_element(
            By.ID, "storyline_0"
        )
        
        first_storyline.click()
        time.sleep(1)

        """ Check for accessing to the first storyline page and verify the first chapter is accessible"""
        
        wait_storyline1_render(driver)

        first_chapter_inside_storyline = driver.find_element(
            By.ID, 'chapter_1'
        )
        
        first_chapter_inside_storyline.click()
        
        wait_chapter1_landing_render(driver)
        time.sleep(1)
        
        # go inside the first chapter
        go_back_button_xpath = driver.find_element(By.ID, "back_to_main")
        assert go_back_button_xpath.text == "Go back to storyline"
        go_back_button_xpath.click()
        time.sleep(1)
        # then turn back to the storyline page
        go_back_button_xpath = driver.find_element(By.ID, "back_to_main")
        assert go_back_button_xpath.text == "Go back to the main page"
        go_back_button_xpath.click()
        time.sleep(1)
        
        wait_landing_render(driver)

        

    def test_second_storyine(self,driver):
        wait_landing_render(driver)
        
        second_storyline = driver.find_element(
            By.ID, "storyline_1"
        )
        
        second_storyline.click()
        time.sleep(1)

        """ Check for accessing to the second storyline page """
        
        wait_storyline2_render(driver)

        first_chapter_inside_storyline = driver.find_element(
            By.ID, 'chapter_1'
        )
        
        first_chapter_inside_storyline.click()
        
        wait_chapter1_landing_render(driver)
        time.sleep(1)
        # go inside the first chapter
        go_back_button_xpath = driver.find_element(By.ID, "back_to_main")
        assert go_back_button_xpath.text == "Go back to storyline"
        go_back_button_xpath.click()
        time.sleep(1)
        # then turn back to the storyline page
        go_back_button_xpath = driver.find_element(By.ID, "back_to_main")
        assert go_back_button_xpath.text == "Go back to the main page"
        go_back_button_xpath.click()
        time.sleep(1)
        
        wait_landing_render(driver)