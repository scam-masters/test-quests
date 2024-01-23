import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver import ActionChains

from utils import login, get_exercise_popup, get_exercise_submit_button

@pytest.fixture(scope="class", autouse=True)
def login_user_tests(driver, user_all_unlocked):
    login(driver, user_all_unlocked[0], user_all_unlocked[1])


class TestOpenCloze:
    solutions = ["email", "border rounded px-2 py-1 text-black", "/html/body/form/button"]

    @pytest.fixture(scope="function")
    def input_boxes(self, driver):
        return driver.find_elements(By.XPATH, "//*[@id='pane2_1']//input")

    # before each method we need to navigate to the correct page
    @pytest.fixture(scope="function", autouse=True)
    def navigate_to_first_mission(self, driver, base_url):
        driver.get(base_url + "/exercise/3")

    def test_score_correct(self, driver, input_boxes, submit_exercise_button):
        for box, sol in zip(input_boxes, self.solutions):
            box.clear()
            box.send_keys(sol)

        submit_exercise_button.click()
        popup = get_exercise_popup(driver)

        assert "You have earned 50 points!" in popup.text


    def test_score_fail(self, driver, input_boxes, submit_exercise_button):
        # write 2 correct answers, one wrong
        for box, sol in zip(input_boxes[:2], self.solutions[:2]):
            box.clear()
            box.send_keys(sol)

        input_boxes[2].clear()
        input_boxes[2].send_keys("pippo")

        submit_exercise_button.click()
        popup = get_exercise_popup(driver)

        assert "Give it another chance!" in popup.text
