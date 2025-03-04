from time import sleep
import unittest
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoAlertPresentException

class wiki_test(unittest.TestCase):


    def scroll_into_view(self, element):
        self.driver.execute_script("arguments[0].scrollIntoView(true);", element)

    def setUp(self):
        # Set Chrome options and preferences
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--headless")  # Run in headless mode
        chrome_options.add_argument("--disable-gpu")
        
        # Initialize the WebDriver with the options
        self.driver = webdriver.Chrome(options=chrome_options)
        
        
        # Navigate to your target URL but fail the test if it takes too long
        self.driver.set_page_load_timeout(100)
        
        
    
    def test_nav_menu(self):
        self.driver.get("http://localhost:3000")
        self.sites =[["Startseite", "/"], ["Testseite", "/test_page"],["Wiki-Seite", "/wiki_page"]]
        for thing in self.sites:
            # Find the link to the page
            link = self.driver.find_element(By.LINK_TEXT, thing[0])
            link.click()
            sleep(1)
            self.assertEqual(self.driver.current_url, "http://localhost:3000"+thing[1], "The link did not lead to the right page!")
            print("Navigated to "+thing[0]+"!")


    def test_wiki_page(self):
     
        # Find the link to the page
        self.driver.get("http://localhost:3000/wiki_page")
        self.sites =[["01. Ansicht von Leistungen und Ergebnissen pro Athlet und Disziplin", "#leistungen_ergebnisse_athlet_diziplin"], ["02. Detailansicht eines Athleten","#detailansicht_athleten"],
                     ["03. Eintragsmodus für Leistungswerte","#eintragsmodus_leistungen"], ["04. Erstellen oder Ändern von Reglungen","#erstellen_aendern_von_reglungen"],
                     ["05. Export eines Athleten","#export_eines_athleten"],["06. Export eines Athleten und seiner Daten als PDF","#export_eines_athleten_pdf"],
                     ["07. Export mehrerer Athleten als CSV","#export_mehrer_athlethen"],["08. Liste aller Athleten","#liste_athlethen"], 
                     ["09. Manuelle Aktualisierung der Reglungen durch Knopfdruck","#knopf_reglungsaktualisierung"],["10. Medaillen Ansicht","#medaillen_ansicht"], ["11. Regelungsverwaltung","#regelungsverwaltung"],
                     ["12. Visuelle Darstellung der Entwicklung eines Athleten","#visuelle_darstellung_entwicklung"]]
        for thing in self.sites:
            # Find the link to the page
            link = self.driver.find_element(By.LINK_TEXT, thing[0])
            sleep(1)
            self.scroll_into_view(link)
            link.click()
            self.assertEqual(self.driver.current_url, "http://localhost:3000/wiki_page"+thing[1], "The link did not lead to the right page!")
            print("Navigated to "+thing[0]+"!")
        
        
        


    def tearDown(self):
        # Close the browser
        self.driver.quit()
        print("Test Wiki Success!")



if __name__ == "__main__":
    unittest.main()