from time import sleep
import unittest
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoAlertPresentException


class nav_menu_test(unittest.TestCase):   
    
    def setUp(self):
        self.driver = webdriver.Chrome()
        
        # Navigate to your target URL but fail the test if it takes too long
        self.driver.set_page_load_timeout(10)
        self.driver.get("http://localhost:3000")
        self.sites =[["Startseite", "/"], ["Testseite", "/test_page"]]
    
    def test_nav_menu(self):

        for thing in self.sites:
            # Find the link to the page
            link = self.driver.find_element(By.LINK_TEXT, thing[0])
            link.click()
            sleep(1)
            self.assertEqual(self.driver.current_url, "http://localhost:3000"+thing[1], "The link did not lead to the right page!")
            print("Navigated to "+thing[0]+"!")
    
    def tearDown(self):
        # Close the browser
        self.driver.quit()
        print("Test Nav Menu Success!")
        

if __name__ == "__main__":
    unittest.main()
    