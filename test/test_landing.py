from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

base_url = "http://localhost:3000/"
expected_title = "React App"

driver = webdriver.Chrome()

try:
    driver.get(base_url)
    WebDriverWait(driver, 10).until(EC.title_contains(expected_title)) # Wait for the page to load

    '''
    Test 1: Check the page is up and running and its title 
    '''
    assert expected_title in driver.title

    '''
    Test 2: Check the first CircleMission is present and has the right text 
    '''
    first_circle_mission = driver.find_element(By.XPATH, "/html/body/div/div/div[2]/div[1]/button")
    assert first_circle_mission.text == "Path Traversal"
    
    '''
    Test 3: Check for accessing to the first learning page
    '''
    first_circle_mission.click()
    assert driver.find_element(By.XPATH, "//*[@id=\"root\"]/div/div[2]/div/div[2]/button[1]").text == "Go back to main page"

finally:
    print("All the tests are successful!")
    driver.quit()