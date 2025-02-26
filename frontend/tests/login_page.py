from time import sleep
import unittest
import os 
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoAlertPresentException


class BasicSeleniumTest(unittest.TestCase):
    def setUp(self):
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--headless")  # Run in headless mode
        chrome_options.add_argument("--disable-gpu")
    
        # Initialize the WebDriver with the options
        self.driver = webdriver.Chrome(options=chrome_options)
        

        # Navigate to your target URL but fail the test if it takes too long
        self.driver.set_page_load_timeout(20)
        self.driver.get("http://localhost:3000")



    def test_login_page(self):
        driver = self.driver
        driver.get("http://localhost:3000")
        driver.find_element(By.ID, "email").send_keys("test@test.com")
        driver.find_element(By.ID, "password").send_keys("testpassword*1")
        driver.find_element(By.ID, "loginbutton").click()
        sleep(1)

        # Überprüfen, ob die Weiterleitung zur Startseite erfolgt ist
        self.assertIn("startpage", driver.current_url, "Weiterleitung nicht erfolgreich")

    def test_login_page_wrong_password(self):
        driver = self.driver
        driver.get("http://localhost:3000")
        driver.find_element(By.ID, "email").send_keys("test@test.com")
        driver.find_element(By.ID, "password").send_keys("wrongpassword*1")
        driver.find_element(By.ID, "loginbutton").click()
        sleep(1)
        
        # Überprüfen, ob die Weiterleitung zur Startseite nicht erfolgt ist
        self.assertNotIn("startpage", driver.current_url, "Es wurde weitergeleitet auf die Startpage")
        

    def test_login_page_wrong_email(self):
        driver = self.driver
        driver.get("http://localhost:3000")
        driver.find_element(By.ID, "email").send_keys("wrong@test.com")
        driver.find_element(By.ID, "password").send_keys("testpassword*1")
        driver.find_element(By.ID, "loginbutton").click()
        sleep(1)
        
        # Überprüfen, ob die Weiterleitung zur Startseite nicht erfolgt ist
        self.assertNotIn("startpage", driver.current_url, "Es wurde weitergeleitet auf die Startpage")
        




    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()        