"""
I need to perform several tests, we are in the profile page, so try the functionalities of the profile page.
- Check the presence of the profile page
- Check the presence of the user's email
- Check the presence of the user's points
- Check change avatar
- Check change username
- Check logout
"""

from time import sleep
import pytest
from selenium.webdriver.common.by import By
from utils import login


@pytest.fixture(scope="class", autouse=True)
def login_user_tests(driver, user_50_points):
    login(driver, user_50_points[0], user_50_points[1])


@pytest.fixture(scope="function", autouse=True)
def navigate_to_profile_page_by_clicking_on_the_username(driver):
    driver.find_element(By.XPATH, "/html/body/header/div[2]/div/a").click()


class TestProfile:
    def test_profile_page(self, driver, base_url, user_50_points):
        assert driver.current_url == base_url + "/profile/" + user_50_points[1]

    def test_user_email(self, driver, user_50_points):
        email = driver.find_element(By.ID, "email")
        assert user_50_points[0] in email.text

    def test_user_points(self, driver):
        points = driver.find_element(By.ID, "score")
        assert "50" in points.text

    def test_change_avatar(self, driver, user_50_points):
        avatar = driver.find_element(By.ID, "change-avatar")
        avatar.click()

        arrow_right = driver.find_element(
            By.XPATH, "/html/body/div[1]/div/div/div[2]/button[3]"
        )
        arrow_right.click()

        submit_button = driver.find_element(
            By.XPATH, "/html/body/div[1]/div/div/div[2]/button[2]"
        )
        submit_button.click()

        # Check if the redirect is correct by checking the presence of the username field
        driver.find_element(By.XPATH, f"//*[contains(text(), {user_50_points[1]})]")

    def test_change_username(self, driver, user_50_points):
        change_username = driver.find_element(By.ID, "change-username")
        change_username.click()

        username = driver.find_element(By.ID, "username-input")
        username.clear()
        username.send_keys("new-username")

        submit = driver.find_element(By.XPATH, "/html/body/div[1]/div/form/button")
        submit.click()

        # Check the presence of the new username in the profile page
        driver.find_element(By.XPATH, f"//*[contains(text(), new-username)]")

        # rechange to the previous one
        change_username = driver.find_element(By.ID, "change-username")
        change_username.click()

        username_input = driver.find_element(By.ID, "username-input")
        username_input.clear()
        username_input.send_keys(user_50_points[1])

        submit = driver.find_element(By.XPATH, "/html/body/div[1]/div/form/button")
        submit.click()

        sleep(2)
        # Check the presence of the new username in the profile page
        driver.find_element(By.XPATH, f"//*[contains(text(), {user_50_points[1]})]")

    def test_friends(self, driver):
        friends = driver.find_element(By.ID, "find-friends")
        friends.click()

        search_bar = driver.find_element(
            By.XPATH, "/html/body/div[1]/div/form/div/input"
        )
        search_submit = driver.find_element(
            By.XPATH, "/html/body/div[1]/div/form/div/button"
        )

        search_bar.clear()
        search_bar.send_keys("test")

        search_submit.click()

        first_user = driver.find_element(
            By.XPATH, "/html/body/div[1]/div[2]/div/table/tbody/tr[1]/td[1]/a"
        )
        user = first_user.text
        first_user.click()

        driver.find_element(By.XPATH, f"//*[contains(text(), {user})]")

    def test_logout(self, driver):
        logout = driver.find_element(By.ID, "logout")
        logout.click()
        driver.find_element(By.ID, "password")
