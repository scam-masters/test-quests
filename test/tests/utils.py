from selenium.webdriver.common.by import By
import selenium.webdriver.support.expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

"""Landing"""


def get_first_circle_chapter(driver):
    # check the presence of the first circle mission in the landing page
    # by searching an element with the text "Chapter 1"
    return driver.find_element(By.XPATH, "//*[contains(text(), 'Chapter 1')]")


""" Login """


def wait_landing_render(driver):
    # same as before check the presence of the first circle mission in the
    # landing page by searching an element with the text "Chapter 1"
    driver.find_element(By.XPATH, "/html/body/div[1]/div/div[1]/a/button")


def wait_chapter2_landing_render(driver):
    # same as before check the presence of the first circle mission in the
    # landing page by searching an element with the text "Chapter 1"
    driver.find_element(By.XPATH, "//*[contains(text(), 'Chapter 2')]")


def wait_chapter3_landing_render(driver):
    # same as before check the presence of the first circle mission in the
    # landing page by searching an element with the text "Chapter 1"
    driver.find_element(By.XPATH, "//*[contains(text(), 'Chapter 3')]")


def login(driver, email, password, wait_for_landing=True):

    def wait_for_email_element(driver):
        # added because in some tests doesn't render the email element
        wait = WebDriverWait(driver, 10)
        email_element = wait.until(EC.presence_of_element_located((By.ID, "email")))
        return email_element

    e = wait_for_email_element(driver)
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
    popup = driver.find_element(By.ID, "popup")
    WebDriverWait(driver, 10).until(EC.visibility_of(popup))
    return popup


"""General"""


def assert_to_be_on_landing(driver):
    first_circle_mission = get_first_circle_chapter(driver)
    assert "Chapter 1" in first_circle_mission.text


def assert_to_be_on_exercise(driver):
    exercise_submit_button = get_exercise_submit_button(driver)
    assert "Submit" in exercise_submit_button.text
