from selenium.webdriver.common.by import By
from utils import login, assert_to_be_on_landing


class TestLoginSuccessful:
    def test_login_success(self, driver, user_50_points):
        login(driver, user_50_points[0], user_50_points[1])
        assert_to_be_on_landing(driver)


class TestLoginUnsuccessful:
    def test_login_invalid(self, driver, user_non_existent):
        login(
            driver, user_non_existent[0], user_non_existent[1], wait_for_landing=False
        )
        error_msg = driver.find_element(By.ID, "error_msg")
        assert error_msg.text == "Invalid e-mail or password."

    def test_login_empty(self, driver):
        login(driver, "", "", wait_for_landing=False)
        error_msg = driver.find_element(By.ID, "error_msg")
        assert error_msg.text == "Please fill all the fields."
