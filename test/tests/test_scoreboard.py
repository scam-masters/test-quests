import pytest
from selenium.webdriver.common.by import By

@pytest.fixture(scope="function", autouse=True)
def load_scoreboard(driver, base_url):
    driver.get(base_url + '/scoreboard')


class TestScoreboard:
    def test_user_50(self, driver, user_50_points):
        score = driver.find_element(By.XPATH, f"//a[contains(text(),'{user_50_points[1]}')]/../../td[2]") # check this xpath
        assert(score.text == '50')

    def test_user_0(self, driver, user_0_points):
        score = driver.find_element(By.XPATH, f"//a[contains(text(),'{user_0_points[1]}')]/../../td[2]")
        assert(score.text == '0')

    def test_order_scoreboard(self, driver, user_50_points, user_0_points):
        # ensure that user with 0 points is after user with 50 points
        driver.find_element(By.XPATH, f"//tr/td/a[contains(text(),'{user_50_points[1]}')]/../../following-sibling::tr/td/a[contains(text(),'{user_0_points[1]}')]")




