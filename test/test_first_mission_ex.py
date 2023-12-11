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
    Click on the first mission button
    '''
    driver.find_element(By.XPATH, '//*[@id="root"]/div/div[2]/div[1]/button').click()

    '''
    Click on "Start Exercise" button
    '''

    driver.find_element(By.XPATH, '//*[@id="root"]/div/div[2]/div/div[2]/button[2]').click()

    '''
    Drag and drop the first element
    '''
    wait = WebDriverWait(driver, 10)


    element = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/div/span[1]')
    target = driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[1]')

    from selenium.webdriver import ActionChains
    action_chains = ActionChains(driver)
    action_chains.drag_and_drop(element, target).perform()

    wait = WebDriverWait(driver, 10000)

    '''
    Assert that the first element has been moved
    '''
    assert driver.find_element(By.XPATH, '//*[@id="pane2_1"]/div/p[2]/span[1]').text == "../"

finally:
    print("All the tests are successful!")
    driver.quit()