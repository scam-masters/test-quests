from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

'''Landing'''
def get_first_circle_mission(driver):
    return driver.find_element(By.XPATH, "/html/body/div[1]/div[1]/a/button")
    
''' Login '''
def wait_landing_render(driver):
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[1]/a/button")))

def login(driver, email, password, wait_for_landing=True):
    driver.find_element(By.XPATH, "//*[@id=\"email\"]").send_keys(email)
    driver.find_element(By.XPATH, "//*[@id=\"password\"]").send_keys(password)
    driver.find_element(By.XPATH, "/html/body/div[1]/div/form/button").click()
    if wait_for_landing:
        wait_landing_render(driver)

''' Missions '''
def get_exercise_submit_button(driver):
    return driver.find_element(By.ID, 'submit_button')

def get_exercise_popup(driver):
    popup = driver.find_element(By.ID, 'popup')
    WebDriverWait(driver, 10).until(EC.visibility_of(popup))
    return popup

'''General'''
def assert_to_be_on_landing(driver):
    first_circle_mission = get_first_circle_mission(driver)
    assert "Path Traversal" in first_circle_mission.text

def assert_to_be_on_exercise(driver):
    exercise_submit_button = get_exercise_submit_button(driver)
    assert "Submit" in exercise_submit_button.text
