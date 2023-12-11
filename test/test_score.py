from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

base_url = "http://localhost:3001/"
expected_title = "React App"

driver = webdriver.Chrome()

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
    
    # try to make swaps to check the score correctness
    target1 = '//*[@id="pane2_1"]/div/p[2]/span[1]'
    target2 = '//*[@id="pane2_1"]/div/p[2]/span[2]'
    target3 = '//*[@id="pane2_1"]/div/p[2]/span[3]'
    target4 = '//*[@id="pane2_1"]/div/p[2]/span[4]'
    target5 = '//*[@id="pane2_1"]/div/p[2]/span[5]'
    target6 = '//*[@id="pane2_1"]/div/p[2]/span[6]'
    target7 = '//*[@id="pane2_1"]/div/p[2]/span[7]'
    
    tar1 = driver.find_element(By.XPATH, target1)
    tar2 = driver.find_element(By.XPATH, target2)
    tar3 = driver.find_element(By.XPATH, target3)
    tar4 = driver.find_element(By.XPATH, target4)
    tar5 = driver.find_element(By.XPATH, target5)
    tar6 = driver.find_element(By.XPATH, target6)
    tar7 = driver.find_element(By.XPATH, target7)
    
    starting1 = '//*[@id="pane2_1"]/div/div/span[1]'
    starting2 = '//*[@id="pane2_1"]/div/div/span[2]'
    starting3 = '//*[@id="pane2_1"]/div/div/span[3]'
    starting4 = '//*[@id="pane2_1"]/div/div/span[4]'
    starting5 = '//*[@id="pane2_1"]/div/div/span[5]'
    starting6 = '//*[@id="pane2_1"]/div/div/span[6]'
    starting7 = '//*[@id="pane2_1"]/div/div/span[7]'
    
    star1 = driver.find_element(By.XPATH, starting1)
    star2 = driver.find_element(By.XPATH, starting2)
    star3 = driver.find_element(By.XPATH, starting3)
    star4 = driver.find_element(By.XPATH, starting4)
    star5 = driver.find_element(By.XPATH, starting5)
    star6 = driver.find_element(By.XPATH, starting6)
    star7 = driver.find_element(By.XPATH, starting7)
    
    from selenium.webdriver import ActionChains
    action_chains = ActionChains(driver)
    # case1: nothing placed correctly or not all the blanks filled (if you submit and click the popup button you remain in the same exercise page)
    action_chains.drag_and_drop(star1, tar1).perform()
    action_chains.drag_and_drop(star2, tar2).perform()
    action_chains.drag_and_drop(star3, tar3).perform()
    action_chains.drag_and_drop(star4, tar4).perform()
    action_chains.drag_and_drop(star5, tar5).perform()
    action_chains.drag_and_drop(star6, tar6).perform()
    action_chains.drag_and_drop(star7, tar7).perform()
    
    wait = WebDriverWait(driver, 1000)
    
    '''
    Assert that the first element has been moved
    '''
    assert driver.find_element(By.XPATH, target1).text == "?", "Not performed the swap"
    
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

    # click on the button on the popup    
    driver.find_element(By.XPATH, popup_button).click()
    
    # Assert you are always in the same exercise page, only when the submission is correct you can click and go back to main page
    assert driver.find_element(By.XPATH, target1).is_displayed(), "Maybe you are not in the same page"
    
    # case2: all the swaps performed properly, then the click on the submission button will make me obtain the redirection to the home page from the button of the popup
    driver.refresh()
    
    wait = WebDriverWait(driver, 10000)
    
    action_chains.drag_and_drop(star1, tar2).perform()
    action_chains.drag_and_drop(star2, tar4).perform()
    action_chains.drag_and_drop(star3, tar7).perform()
    action_chains.drag_and_drop(star4, tar3).perform()
    action_chains.drag_and_drop(star5, tar5).perform()
    action_chains.drag_and_drop(star6, tar1).perform()
    action_chains.drag_and_drop(star7, tar6).perform()
    
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
    
    # click on the button on the popup
    driver.find_element(By.XPATH, popup_button).click()
    
    path_traversal = '//*[@id="root"]/div/div[2]/div[1]/button'
    
    # Assert you are always in the same exercise page, only when the submission is correct you can click and go back to main page
    assert driver.find_element(By.XPATH, path_traversal).is_displayed(), "You should be in the landing page"
    
finally:
    print("All the tests are successful!")
    driver.quit()
