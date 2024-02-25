from selenium.webdriver.common.by import By
from utils import registration, wait_landing_render
import time
import random
import string

class TestRegistrationSuccessful:

    def test_registration_success(self, base_url, driver, user_registration_correct):
        
        def random_string(length=10):
            """Generate a random string of fixed length """
            
            letters = string.ascii_lowercase
            return ''.join(random.choice(letters) for _ in range(length))
        
        random_suffix = random_string()
        '''
        This is to avoid the user already exists error, because the user is already registered in the database.
        So, we add a random suffix to the username and email to avoid this error. Less problem with CI/CD.
        '''
        registration(
            driver,
            user_registration_correct[1] + random_suffix, 
            user_registration_correct[0] + random_suffix, 
            user_registration_correct[2], 
            user_registration_correct[3],
            base_url
        )      
            
        wait_landing_render(driver)
        time.sleep(1)
            
        username = driver.find_element(By.XPATH, "/html/body/header/div[2]/div/a")
        assert username.text == user_registration_correct[1] + random_suffix


class TestRegistrationUnsuccessful:
    def test_registration_invalid_password_short(self, base_url, driver, user_registration_wrong_password_short):
        registration(
            driver,
            user_registration_wrong_password_short[1],
            user_registration_wrong_password_short[0],
            user_registration_wrong_password_short[2],
            user_registration_wrong_password_short[3],
            base_url, 
            wait_for_landing=False
        )
        
        expected_url = base_url + "/Registration"        
        assert driver.current_url == expected_url
        
    def test_registration_invalid_password_not_match(self, base_url, driver, user_registration_wrong_password_not_match):
        registration(
            driver,
            user_registration_wrong_password_not_match[1],
            user_registration_wrong_password_not_match[0],
            user_registration_wrong_password_not_match[2],
            user_registration_wrong_password_not_match[3],
            base_url, 
            wait_for_landing=False
        )
        
        expected_url = base_url + "/Registration"        
        assert driver.current_url == expected_url
        
        message_error = driver.find_element(By.XPATH, "/html/body/div[1]/div/form/div[5]")
        
        assert message_error.text == "Passwords do not match"
        
    def test_registration_user_already_exists(self, base_url, driver, user_registration_wrong_user_already_existent):
        registration(
            driver,
            user_registration_wrong_user_already_existent[1],
            user_registration_wrong_user_already_existent[0],
            user_registration_wrong_user_already_existent[2],
            user_registration_wrong_user_already_existent[3],
            base_url, 
            wait_for_landing=False
        )
        
        expected_url = base_url + "/Registration"        
        assert driver.current_url == expected_url
        time.sleep(1)
        
        message_error = driver.find_element(By.XPATH, "/html/body/div[1]/div/form/div[5]")
        
        assert message_error.text == "An account is already associated with this email or this username"
        
    def test_registration_empty(self, driver, base_url, user_registration_empty):
        registration(
            driver,
            user_registration_empty[1],
            user_registration_empty[0],
            user_registration_empty[2],
            user_registration_empty[3],
            base_url, 
            wait_for_landing=False
        )
        
        expected_url = base_url + "/Registration"        
        assert driver.current_url == expected_url