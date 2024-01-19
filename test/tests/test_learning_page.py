import pytest
from selenium.webdriver.common.by import By

from utils import login, assert_to_be_on_landing, assert_to_be_on_exercise


@pytest.fixture(scope="class", autouse=True)
def load_page(base_url, expected_title, driver):
    driver.get(base_url + "/Login")
    assert expected_title in driver.title


@pytest.fixture(scope="class", autouse=True)
def login_user_tests(driver, user_tests):
    login(driver, user_tests[0], user_tests[1])


class TestLearningPages:
    def get_buttons(self, driver):
        return [
            driver.find_element(By.ID, id)
            for id in ["back_to_main", "learn_more", "start_exercise"]
        ]

    @pytest.mark.parametrize("learning_url", [f"/learning/{i}" for i in range(1, 3)])
    def test_learning_pages(self, driver, base_url, learning_url):
        driver.get(base_url + learning_url)
        self.get_buttons(driver)[0].click()
        assert_to_be_on_landing(driver)

        driver.get(base_url + learning_url)
        self.get_buttons(driver)[2].click()
        assert_to_be_on_exercise(driver)
