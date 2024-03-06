import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver import ActionChains
from selenium.webdriver.support.ui import Select
from time import sleep
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from utils import login, get_exercise_submit_button, get_exercise_popup


@pytest.fixture(scope="class", autouse=True)
def login_user_tests(driver, user_all_unlocked):
    login(driver, user_all_unlocked[0], user_all_unlocked[1])


# before each method we need to navigate to the correct page!!!!
@pytest.fixture(scope="function", autouse=True)
def navigate_to_debug_exercise(driver, base_url):
    driver.get(base_url + "/exercise/8")


def get_choices(driver):
    return [
        driver.find_element(By.XPATH, f"//div[@id='pane2_1']//code//button[{i}]")
        for i in range(1, 11)
    ]

class TestDebugExercise:
    def test_all_correct_answers(self, driver):
        choices = get_choices(driver)

        correct_answers = [2, 3, 4, 6, 9]  # Update the correct_answers list with valid indices
        for i in correct_answers:
            choices[i].click()  # Subtract 1 from the index to match the list index

        submit_button = get_exercise_submit_button(driver)
        submit_button.click()
        popup = get_exercise_popup(driver)
        assert "100%" in popup.text

    def test_half_correct_answers(self, driver):
        choices = get_choices(driver)

        for i in range(1, 6):
            choices[i].click()

        submit_button = get_exercise_submit_button(driver)
        submit_button.click()

        popup = get_exercise_popup(driver)
        assert "60%" in popup.text

    def test_zero_correct_answers(self, driver):
        submit_button = get_exercise_submit_button(driver)
        submit_button.click()
        popup = get_exercise_popup(driver)
        assert "50%" in popup.text
