from selenium.webdriver.common.by import By
from utils import login, wait_landing_render


class TestLoginSuccessful:
    def test_login_success(self, driver, user_50_points):
        login(driver, user_50_points[0], user_50_points[1])
        wait_landing_render(driver)


class TestLoginUnsuccessful:
    def test_login_invalid(self, driver, user_non_existent):
        login(
            driver, user_non_existent[0], user_non_existent[1], wait_for_landing=False
        )
        error_msg = driver.find_element(By.ID, "error_msg")
        assert "Firebase: Error (auth/invalid-login-credentials)." in error_msg.text

    def test_login_empty(self, driver):
        login(driver, "", "", wait_for_landing=False)
        error_msg = driver.find_element(By.ID, "error_msg")
        assert error_msg.text == "Please fill all the fields."
