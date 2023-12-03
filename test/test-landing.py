from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

base_url = "http://localhost:3000/"
expected_title = "React App"
circle_mission_class = "your-circle-mission-class"

driver = webdriver.Firefox()

try:
    driver.get(base_url)

    # Wait for the page to load
    WebDriverWait(driver, 10).until(EC.title_contains(expected_title))

    # Check if the page is up and running
    assert expected_title in driver.title

    # Check the first CircleMission is clickable
    first_circle_mission = driver.find_element(By.XPATH, "/html/body/div/div/div[2]/div[1]/button")
    assert first_circle_mission.text == "Path Traversal"
    
    #Go to main menu button check
    first_circle_mission.click()
    assert driver.find_element(By.XPATH, "/html/body/div/div/button").text == "Go back to main page"
  

    


finally:
    # Close the WebDriver
    driver.quit()