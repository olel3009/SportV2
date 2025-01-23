from time import sleep
import unittest
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoAlertPresentException
from time import sleep

class BasicSeleniumTest(unittest.TestCase):    
    
    
    def setUp(self):
        # Initialize the WebDriver (Chrome in this case)
        self.driver = webdriver.Chrome()
        
        # Navigate to python.org
        self.driver.get("http://localhost:3000")
    
    def test_search_python(self):
        download_dir='/test_download_dir'
        exportManyButton = self.driver.find_element(By.NAME, "csvMassExportButt")
        exportManyButton.click()
        try:
            alert=self.driver.switch_to.alert
            self.assertTrue(True, "Alert is present!")
            print("Alert was present!")
            alert.accept()
        except NoAlertPresentException:
            self.fail("No error was thrown when exporting 0 athletes")
        currentDir=os.curdir
        temp_dir='{"download.default_directory"} : "'+currentDir+'/test_download_dir"'
        self.driver.capabilities["prefs"]= temp_dir
        print(temp_dir)
        exportSingleButton = self.driver.find_element(By.NAME, "csvSingleExportButt").click()
        sleep(1)
    
    def tearDown(self):
        # Close the browser
        self.driver.quit()
        

if __name__ == "__main__":
    try:
        unittest.main()
        print("Test CSV Export Success!")
    except SystemExit:
        print("Test CSV Export Failed!")
