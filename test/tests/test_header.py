from selenium.webdriver.common.by import By

from test_login import login


class TestHeaderUserNew:
    def test_working_page(self, driver, expected_title, user_new):
        login(driver, user_new[0], user_new[1])
        assert expected_title in driver.title

    def test_header_points(self, driver):
        header_points = driver.find_element(
            By.XPATH, "/html/body/header/div[2]/div/span[2]"
        )
        assert header_points.text == "-"


class TestHeaderUser0Points:
    def test_working_page(self, driver, expected_title, user_0_points):
        login(driver, user_0_points[0], user_0_points[1])
        assert expected_title in driver.title

    def test_header_points(self, driver):
        header_points = driver.find_element(
            By.XPATH, "/html/body/header/div[2]/div/span[2]"
        )
        assert header_points.text == "0"


class TestHeaderUser50Points:
    def test_working_page(self, driver, expected_title, user_50_points):
        login(driver, user_50_points[0], user_50_points[1])
        assert expected_title in driver.title

    def test_header_points(self, driver):
        header_points = driver.find_element(
            By.XPATH, "/html/body/header/div[2]/div/span[2]"
        )
        assert header_points.text == "50"
