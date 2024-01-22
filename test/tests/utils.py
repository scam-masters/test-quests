from selenium.webdriver.common.by import By
import selenium.webdriver.support.expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

"""Landing"""


def get_first_circle_mission(driver):
    return driver.find_element(By.XPATH, "/html/body/div[1]/div[1]/a/button")


""" Login """


def wait_landing_render(driver):
    driver.find_element(By.XPATH, "//button[contains(.,  'Chapter 1')]")


def login(driver, email, password, wait_for_landing=True):
    e = driver.find_element(By.ID, "email")
    p = driver.find_element(By.ID, "password")
    s = driver.find_element(By.XPATH, "//button[@type='submit']")

    e.clear()
    p.clear()

    e.send_keys(email)
    p.send_keys(password)

    s.click()

    if wait_for_landing:
        wait_landing_render(driver)


""" Missions """


def get_exercise_submit_button(driver):
    return driver.find_element(By.ID, "submit_button")


def get_exercise_popup(driver):
    # here we use explicit wait because with the implicit one the element is found 
    # but not yet visible, making tests fail
    popup = driver.find_element(By.ID, 'popup')
    WebDriverWait(driver, 10).until(EC.visibility_of(popup))
    return popup


"""General"""


def assert_to_be_on_landing(driver):
    first_circle_mission = get_first_circle_mission(driver)
    assert "Path Traversal" in first_circle_mission.text


def assert_to_be_on_exercise(driver):
    exercise_submit_button = get_exercise_submit_button(driver)
    assert "Submit" in exercise_submit_button.text
