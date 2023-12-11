from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

base_url = "http://localhost:3001/"
expected_title = "React App"

driver = webdriver.Firefox()

try:
    driver.get(base_url)
    WebDriverWait(driver, 10).until(EC.title_contains(expected_title))  # Wait for the page to load

    # Click on the first mission button
    driver.find_element(By.XPATH, '//*[@id="root"]/div/div[2]/div[1]/button').click()

    # Click on "Start Exercise" button
    driver.find_element(By.XPATH, '//*[@id="root"]/div/div[2]/div/div[2]/button[2]').click()

    # Drag and drop the first element (assuming you have the necessary code here)

    # Click on the submit button
    submit_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[@class='bg-tq-red hover:bg-tq-red-500 text-tq-white font-bold py-2 px-4 rounded-full transition duration-200 ease-in-out hover:shadow-lg hover:scale-105 active:scale-95 active:shadow-md']"))
    )
    submit_button.click()

    # Wait for the popup to be displayed
    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "/html[1]/body[1]/div[2]/div[1]"))
    )

    # Assert that the popup is shown
    assert driver.find_element(By.XPATH, "/html[1]/body[1]/div[2]/div[1]").is_displayed(), "Popup not displayed"
    
    # now I need to close the popup and try to check the different messages that the user can recieve depending on the score he gets
    popup_button = "/html[1]/body[1]/div[2]/div[1]/div[2]/div[1]/div[2]/button[1]"
    
    driver.find_element(By.XPATH, popup_button).click()
    
    # null_element = "/html[1]/body[1]/div[1]/div[1]/div[2]/div[3]/div[1]/div[1]/div[2]/span[2]"
    # question_mark_element = "/html[1]/body[1]/div[1]/div[1]/div[2]/div[3]/div[1]/div[1]/div[2]/span[1]"
    
    # WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, null_element)))  # Wait for the page to load
    
    # from selenium.webdriver import ActionChains
    # action_chains = ActionChains(driver)
    # action_chains.drag_and_drop(null_element, question_mark_element).perform()

    # wait = WebDriverWait(driver, 10000)
    
    element = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[1]')
    target = driver.find_element(By.XPATH, '/html[1]/body[1]/div[1]/div[1]/div[2]/div[3]/div[1]/div[1]/p[2]/span[1]') # can't find the blank target

    from selenium.webdriver import ActionChains
    action_chains = ActionChains(driver)
    action_chains.drag_and_drop(element, target).perform()

    wait = WebDriverWait(driver, 10000)
    
    '''
    Assert that the first element has been moved
    '''
    assert driver.find_element(By.XPATH, '/html[1]/body[1]/div[1]/div[1]/div[2]/div[3]/div[1]/div[1]/p[2]/span[1]').text == "?", "Not performed the swap"

    

finally:
    print("All the tests are successful!")
    driver.quit()
