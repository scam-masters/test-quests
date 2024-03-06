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
    driver.get(base_url + "/exercise/12")

def get_choices(driver):
    return [
        driver.find_element(By.ID, f"id_{i}")
        for i in range(0, 9)
    ]

# as the order of the choices is randomized, we need to retrieve the correct indexes of the choices that contain the correct text
def get_choice_indexes(choices, text):
    correct_indexes = []
    for i, choice in enumerate(choices):
        if text == choice.text:
            correct_indexes.append(i)
    return correct_indexes
    
class TestMultipleChoicesExercise:
    def test_all_correct_answers(self, driver):
        choices = get_choices(driver)

        # i need to retrieve the correct answers by checking the test becuase id change every time cause of the randomize
        # so I need to retrieve th indexes of only the correct ones that are those containig the text by going inside choices:
        correct_answers = [
            "WebDriverWait(self.driver, 6).until(EC.text_to_be_present_in_element(result, '10'))",
            "sleep(6); assert result.text == 10",
            "assert wait_until(lambda: result.text == '10', timeout=6)",
            "driver.implicitly_wait(2)",
            "driver.find_element(By.CLASS_NAME, 'screen')",
            "self.driver.findElement(By.xpath('//*[@id='calculator']/div[1]/div'))",
            "self.driver.findElement(By.xpath('/html/body/main/div/div[4]/div/div/div[1]/div’))"
        ]
        
        for text in correct_answers:
            correct_indexes = get_choice_indexes(choices, text)
            for i in correct_indexes:
                choices[i].click()


        submit_button = get_exercise_submit_button(driver)
        submit_button.click()
        popup = get_exercise_popup(driver)
        assert "100%" in popup.text
    
    def test_zero_correct_answers(self, driver):
        choices = get_choices(driver)
        
        wrong_choices = [
            "driver.find_element(By.ID, 'screen')",
            "assert result.text == 10",
        ]
        
        for text in wrong_choices:
            wrong_indexes = get_choice_indexes(choices, text)
            for i in wrong_indexes:
                choices[i].click()
                print(i)
        
        submit_button = get_exercise_submit_button(driver)
        submit_button.click()
        popup = get_exercise_popup(driver)
        assert "0%" in popup.text

    def test_half_correct_answers(self, driver):
        choices = get_choices(driver)

        for i in range(0, 4):
            choices[i].click()

        submit_button = get_exercise_submit_button(driver)
        submit_button.click()

        popup = get_exercise_popup(driver)
        assert "44%" in popup.text or "67" in popup.text

    def test_no_clicked(self, driver):
        submit_button = get_exercise_submit_button(driver)
        submit_button.click()
        popup = get_exercise_popup(driver)
        assert "22%" in popup.text
        
    def test_all_clicked(self, driver):
        choices = get_choices(driver)

        for i in range(0, 9):
            choices[i].click()

        submit_button = get_exercise_submit_button(driver)
        submit_button.click()
        popup = get_exercise_popup(driver)
        assert "78%" in popup.text