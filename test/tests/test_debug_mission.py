import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver import ActionChains
from selenium.webdriver.support.ui import Select

from utils import login, get_exercise_submit_button, get_exercise_popup

from time import sleep


@pytest.fixture(scope="class", autouse=True)
def login_user_tests(driver, user_tests):
    login(driver, user_tests[0], user_tests[1])


# before each method we need to navigate to the correct page!!!!
@pytest.fixture(scope="function", autouse=True)
def navigate_to_first_mission(driver, base_url):
    driver.get(base_url + "/exercise/8")


class TestDebug:
    def get_clickable_buttons(self, driver):
        return [
            driver.find_element(By.XPATH, f'/html[1]/body[1]/div[1]/div[1]/div[3]/div[1]/div[1]/code[1]/button[{i}]') for i in range(1, 11)
        ]

    def test_buttons_selection(self, driver):
        buttons = self.get_clickable_buttons(driver)
        buttons[0].click()
        assert buttons[0].get_attribute("class") == "bug-selected"

    # def test_wrong_answer(self, driver):
    #     submit_button = get_exercise_submit_button(driver)
    #     buttons = self.get_buttons(driver)
    #     choices = [1, 1, 1]

    #     for i, choice in enumerate(choices):
    #         buttons[i].select_by_index(choice)

    #     submit_button.click()
    #     popup = get_exercise_popup(driver)
    #     assert "33%" in popup.text
    #     driver.find_element(
    #         By.XPATH, '//*[@id="popup_content"]/div/div[2]/button'
    #     ).click()

    # def test_all_correct_answers(self, driver):
    #     submit_button = get_exercise_submit_button(driver)
    #     buttons = self.get_buttons(driver)
    #     choices = [3, 1, 2]

    #     for i, choice in enumerate(choices):
    #         buttons[i].select_by_index(choice)

    #     submit_button.click()
    #     popup = get_exercise_popup(driver)
    #     assert "100%" in popup.text
