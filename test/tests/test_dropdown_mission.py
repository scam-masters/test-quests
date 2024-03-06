import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

from utils import login, get_exercise_submit_button, get_exercise_popup


@pytest.fixture(scope="class", autouse=True)
def login_user_tests(driver, user_tests):
    login(driver, user_tests[0], user_tests[1])


# before each method we need to navigate to the correct page!!!!
@pytest.fixture(scope="function", autouse=True)
def navigate_to_second_mission(driver, base_url):
    driver.get(base_url + "/exercise/2")


class TestDropdownExercise:
    def get_dropdowns(self, driver):
        return [
            Select(
                driver.find_element(By.XPATH, f'//*[@id="exercise-form"]/p/select[{i}]')
            )
            for i in range(1, 4)
        ]

    def test_dropdown_selection(self, driver):
        dropdowns = self.get_dropdowns(driver)
        dropdowns[0].select_by_index(3)
        assert dropdowns[0].first_selected_option.text == "' OR 1=1 --"

    def test_wrong_answer(self, driver):
        submit_button = get_exercise_submit_button(driver)
        dropdowns = self.get_dropdowns(driver)
        choices = [1, 1, 1]

        for i, choice in enumerate(choices):
            dropdowns[i].select_by_index(choice)

        submit_button.click()
        popup = get_exercise_popup(driver)
        assert "33%" in popup.text
        driver.find_element(
            By.XPATH,
            "//*[@id=\"popup\"]/div/div[2]/a/button",
        ).click()

    def test_all_correct_answers(self, driver):
        submit_button = get_exercise_submit_button(driver)
        dropdowns = self.get_dropdowns(driver)
        choices = [3, 1, 2]

        for i, choice in enumerate(choices):
            dropdowns[i].select_by_index(choice)

        submit_button.click()
        popup = get_exercise_popup(driver)
        assert "100%" in popup.text
