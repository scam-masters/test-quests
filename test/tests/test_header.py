from selenium.webdriver.common.by import By

from test_login import login

def retrieve_the_header_points_text(driver):
        header_points = driver.find_element(
            By.XPATH, "//span[@class='text-white font-bold mr-5']" # this is the xpath of the points in the header in Firefox
            # /html[1]/body[1]/header[1]/div[2]/div[1]/span[1] # this is the xpath of the points in the header in Firefox
        )
        return header_points.text

# expected_title contains test quests
class TestHeaderUserNew:
    def test_working_page(self, driver, expected_title, user_new):
        login(driver, user_new[0], user_new[1])
        assert expected_title in driver.title

    def test_header_points(self, driver):
        assert retrieve_the_header_points_text(driver) == "-"


class TestHeaderUser0Points:
    def test_working_page(self, driver, expected_title, user_0_points):
        login(driver, user_0_points[0], user_0_points[1])
        assert expected_title in driver.title

    def test_header_points(self, driver):
        assert retrieve_the_header_points_text(driver) == "0"


class TestHeaderUser50Points:
    def test_working_page(self, driver, expected_title, user_50_points):
        login(driver, user_50_points[0], user_50_points[1])
        assert expected_title in driver.title

    def test_header_points(self, driver):
        assert retrieve_the_header_points_text(driver) == "50"
