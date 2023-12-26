from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

def wait_landing_render(driver):
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[1]/a/button")))


def login(driver, email, password):
    driver.find_element(By.XPATH, "//*[@id=\"email\"]").send_keys(email)
    driver.find_element(By.XPATH, "//*[@id=\"password\"]").send_keys(password)
    driver.find_element(By.XPATH, "/html/body/div[1]/div/form/button").click()
    wait_landing_render(driver)