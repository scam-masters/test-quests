import time
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver import ActionChains

base_url = "http://localhost:3000/"
expected_title = "React App"

driver = webdriver.Chrome(ChromeDriverManager().install())


def goto_first_mission():
    driver.get(base_url)
    """
    Wait for the page to load
    """
    WebDriverWait(driver, 10).until(EC.title_contains(expected_title))
    """
    Click on the first mission button
    """
    driver.find_element(By.XPATH, '//*[@id="root"]/div/div[2]/div[1]/button').click()
    """
    Click on "Start Exercise" button
    """
    driver.find_element(
        By.XPATH, '//*[@id="root"]/div/div[2]/div/div[2]/button[2]'
    ).click()


try:
    goto_first_mission()
    """
    Get all the elements and targets
    """
    target1 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[1]')
    target2 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[2]')
    target3 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[3]')
    target4 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[4]')
    target5 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[5]')
    target6 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[6]')
    target7 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[7]')

    element1 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[1]')
    element2 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[2]')
    element3 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[3]')
    element4 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[4]')
    element5 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[5]')
    element6 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[6]')
    element7 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[7]')
    """
    Get the button for submitting the exercise
    """
    submit_button = driver.find_element(
        By.XPATH, '//*[@id="root"]/div/div[3]/button[2]'
    )
    """
    Popup button 
    """
    popup_button = '//*[@id="pr_id_6_content"]/div/div[2]/button'
    """
    Case 1: everything placed correctly (if you submit and click the popup button you will return to page)
    """
    action_chains = ActionChains(driver)
    action_chains.drag_and_drop(element1, target2).perform()
    action_chains.drag_and_drop(element2, target4).perform()
    action_chains.drag_and_drop(element3, target7).perform()
    action_chains.drag_and_drop(element4, target3).perform()
    action_chains.drag_and_drop(element5, target5).perform()
    action_chains.drag_and_drop(element6, target1).perform()
    action_chains.drag_and_drop(element7, target6).perform()
    """
    Submit the exercise
    """
    submit_button.click()
    """
    Press the button on the popup
    """
    driver.find_element(By.XPATH, popup_button).click()
    """
    We should be in the home page
    """
    assert driver.find_element(
        By.XPATH, '//*[@id="root"]/div/div[2]/div[1]/button'
    ).is_displayed(), "You are still in the exercise page"

    """
    Return to the exercise page
    """
    goto_first_mission()
    """
    Get again all the elements and targets
    """
    target1 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[1]')
    target2 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[2]')
    target3 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[3]')
    target4 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[4]')
    target5 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[5]')
    target6 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[6]')
    target7 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[7]')

    element1 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[1]')
    element2 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[2]')
    element3 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[3]')
    element4 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[4]')
    element5 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[5]')
    element6 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[6]')
    element7 = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[7]')
    """
    Get the button for submitting the exercise
    """
    submit_button = driver.find_element(
        By.XPATH, '//*[@id="root"]/div/div[3]/button[2]'
    )
    """
    Case 2: nothing placed correctly or not all the blanks filled (if you submit and click the popup button you remain in the same exercise page)
    """
    # action_chains = ActionChains(driver)
    action_chains.drag_and_drop(element1, target4).perform()
    action_chains.drag_and_drop(element2, target2).perform()
    action_chains.drag_and_drop(element3, target3).perform()
    action_chains.drag_and_drop(element4, target7).perform()
    action_chains.drag_and_drop(element5, target1).perform()
    action_chains.drag_and_drop(element6, target6).perform()
    action_chains.drag_and_drop(element7, target5).perform()
    """
    Submit the exercise
    """
    submit_button.click()
    """
    Press the button on the popup
    """
    driver.find_element(By.XPATH, popup_button).click()
    """
    We should be in the home page
    """
    assert element1.is_displayed(), "You are no more in the exercise page"
    # time.sleep(100)


finally:
    print("All the tests are successful!")
    driver.quit()
