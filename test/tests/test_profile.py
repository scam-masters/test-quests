'''
I need to perform several tests, we are in the profile page, so try the functionalities of the profile page.
- Check the presence of the profile page
- Check the presence of the user's email
- Check the presence of the user's points
- Check change avatar
- Check change username
- Check logout
'''

import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver import ActionChains

from utils import login, get_exercise_popup, get_exercise_submit_button

from time import sleep


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
        email = driver.find_element(By.XPATH, "/html/body/div[1]/div/div[1]/div/div/div[2]/p[1]")
        assert user_50_points[0] in email.text
        
    def test_user_points(self, driver):
        points = driver.find_element(By.XPATH, "/html/body/div[1]/div/div[1]/div/div/div[2]/p[2]")
        assert "50" in points.text
        
    def test_change_avatar(self,base_url, driver, user_50_points):
        avatar = driver.find_element(By.XPATH, "/html/body/div[1]/div/div[1]/div/div/div[1]/a/button")
        avatar.click()
        sleep(1)
        
        assert "changeAvatar" in driver.current_url 
        
        arrow_right = driver.find_element(By.XPATH, "/html/body/div[1]/div/div/div[2]/button[3]")
        arrow_right.click()
        
        submit_button = driver.find_element(By.XPATH, "/html/body/div[1]/div/div/div[2]/button[2]")
        submit_button.click()
        sleep(1)
        
        assert driver.current_url == base_url + "/profile/" + user_50_points[1]
        
    def test_change_username(self,base_url, driver, user_50_points):
        change_username = driver.find_element(By.XPATH, "/html/body/div[1]/div/div[1]/div/div/div[2]/div[1]/a/button")
        
        assert change_username.text == "Change Username"
        change_username.click()
        
        sleep(1)
        
        assert driver.current_url == base_url + "/changeUsername"
        
        username = driver.find_element(By.ID, "username")
        username.clear()
        
        username.send_keys("new_username")
        
        submit = driver.find_element(By.XPATH, "/html/body/div[1]/div/form/button")
        submit.click()
        sleep(2)
        
        assert driver.current_url == base_url + "/profile/" + "new_username"
        sleep(1)
        # rechange to the previous one
        change_username = driver.find_element(By.XPATH, "/html/body/div[1]/div/div[1]/div/div/div[2]/div[1]/a/button")
        change_username.click()
        
        sleep(1)
        
        assert driver.current_url == base_url + "/changeUsername"
        
        username = driver.find_element(By.ID, "username")
        username.clear()
        
        username.send_keys(user_50_points[1])
        
        submit = driver.find_element(By.XPATH, "/html/body/div[1]/div/form/button")
        submit.click()
        sleep(1)
        
        assert driver.current_url == base_url + "/profile/" + user_50_points[1]
        
    def test_friends(self,driver,base_url):
        friends = driver.find_element(By.XPATH, "/html/body/div[1]/div/div[2]/div/a/button")
        friends.click()
        sleep(1)
        
        assert driver.current_url == base_url + "/searchPlayers"
        sleep(1)
        
        search_bar = driver.find_element(By.XPATH, "/html/body/div[1]/div/form/div/input")
        search_submit = driver.find_element(By.XPATH, "/html/body/div[1]/div/form/div/button")
        
        search_bar.clear()
        search_bar.send_keys("test")
        
        search_submit.click()
        
        
        first_user = driver.find_element(By.XPATH, "/html/body/div[1]/div[2]/div/table/tbody/tr[1]/td[1]/a")
        user = first_user.text
        first_user.click()
        
        
        sleep(2)
        assert driver.current_url == base_url + "/profile/" + user
        
    def test_logout(self, driver, base_url):
        logout = driver.find_element(By.XPATH, "/html/body/div[1]/div/div[1]/div/div/div[2]/div[1]/button")
        logout.click()
        
        assert driver.current_url == base_url + "/Login"
        