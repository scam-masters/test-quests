import pytest
from selenium.webdriver.common.by import By


from utils import login, wait_landing_render
import time
from utils import get_exercise_popup


@pytest.fixture(scope="class", autouse=True)
def login_user_50_points(driver, user_all_unlocked):
    login(driver, user_all_unlocked[0], user_all_unlocked[1])


# before each method we need to navigate to the correct page!!!!
@pytest.fixture(scope="function", autouse=True)
def get_timer(driver, base_url):
    driver.get(base_url + "/exercise/7")
    timer = driver.find_element(
            By.ID, "timer"
        )
    return timer
    
class Timer:
    def test_timer_visualization(self, get_timer):  # pass the timer element as an argument
        timer = get_timer  # assign the timer element to a variable
        assert timer.is_displayed(), "Timer is not displayed"
        
    def test_timer_countdown(self, get_timer, driver):
        timer = get_timer
        #assert timer.text == "00:00", "Timer is not counting down"
        
        # wait for 1 minute to make the timer expire and check if the popup arises
        time.sleep(61)
        
        popup = get_exercise_popup(driver)

        assert "CHEATER" in popup.text
