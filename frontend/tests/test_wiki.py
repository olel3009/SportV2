from time import sleep
import unittest
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoAlertPresentException

class WikiPageTest(unittest.TestCase):

    
    def setUpClass(self):
        # Set Chrome options and preferences
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--headless")  # Run in headless mode
        chrome_options.add_argument("--disable-gpu")
        
        # Initialize the WebDriver with the options
        self.driver = webdriver.Chrome(options=chrome_options)

        # Navigate to your target URL but fail the test if it takes too long
        self.driver.set_page_load_timeout(10)
        self.driver.get("http://localhost:3000/wiki_page")



def test_navigation_to_leistungen_ergebnisse_athlet_diziplin(self):
        link = self.driver.find_element(By.LINK_TEXT, "Ansicht von Leistungen und Ergebnissen pro Athlet und Disziplin")
        link.click()
        sleep(1)  # Warte, bis die Seite scrollt
        section = self.driver.find_element(By.ID, "leistungen_ergebnisse_athlet_diziplin")
        self.assertTrue(section.is_displayed())

def test_navigation_to_detailansicht_athleten(self):
        link = self.driver.find_element(By.LINK_TEXT, "Detailansicht eines Athleten")
        link.click()
        sleep(1)  # Warte, bis die Seite scrollt
        section = self.driver.find_element(By.ID, "detailansicht_athleten")
        self.assertTrue(section.is_displayed())

def test_navigation_to_eintragsmodus_leistungen(self):
        link = self.driver.find_element(By.LINK_TEXT, "Eintragsmodus für Leistungswerte")
        link.click()
        sleep(1)  # Warte, bis die Seite scrollt
        section = self.driver.find_element(By.ID, "eintragsmodus_leistungen")
        self.assertTrue(section.is_displayed())

def test_navigation_to_erstellen_ändern_von_reglungen(self):
        link = self.driver.find_element(By.LINK_TEXT, "Erstellen oder Ändern von Reglungen")
        link.click()
        sleep(1)  # Warte, bis die Seite scrollt
        section = self.driver.find_element(By.ID, "erstellen_ändern_von_reglungen")
        self.assertTrue(section.is_displayed())

def test_navigation_to_export_eines_athleten(self):
        link = self.driver.find_element(By.LINK_TEXT, "Export eines Athleten")
        link.click()
        sleep(1)  # Warte, bis die Seite scrollt
        section = self.driver.find_element(By.ID, "export_eines_athleten")
        self.assertTrue(section.is_displayed())

def test_navigation_to_export_mehrer_athlethen(self):
        link = self.driver.find_element(By.LINK_TEXT, "Export mehrerer Athleten als CSV")
        link.click()
        sleep(1)  # Warte, bis die Seite scrollt
        section = self.driver.find_element(By.ID, "export_mehrer_athlethen")
        self.assertTrue(section.is_displayed())

def test_navigation_to_liste_athlethen(self):
        link = self.driver.find_element(By.LINK_TEXT, "Liste aller Athleten")
        link.click()
        sleep(1)  # Warte, bis die Seite scrollt
        section = self.driver.find_element(By.ID, "liste_athlethen")
        self.assertTrue(section.is_displayed())

def test_navigation_to_knopf_reglungsaktualisierung(self):
        link = self.driver.find_element(By.LINK_TEXT, "Manuelle Aktualisierung der Reglungen durch Knopfdruck")
        link.click()
        sleep(1)  # Warte, bis die Seite scrollt
        section = self.driver.find_element(By.ID, "knopf_reglungsaktualisierung")
        self.assertTrue(section.is_displayed())

def test_navigation_to_medaillen_ansicht(self):
        link = self.driver.find_element(By.LINK_TEXT, "Medaillen Ansicht")
        link.click()
        sleep(1)  # Warte, bis die Seite scrollt
        section = self.driver.find_element(By.ID, "medaillen_ansicht")
        self.assertTrue(section.is_displayed())

def test_navigation_to_regelungsverwaltung(self):
        link = self.driver.find_element(By.LINK_TEXT, "Regelungsverwaltung")
        link.click()
        sleep(1)  # Warte, bis die Seite scrollt
        section = self.driver.find_element(By.ID, "regelungsverwaltung")
        self.assertTrue(section.is_displayed())

def test_navigation_to_visuelle_darstellung_entwicklung(self):
        link = self.driver.find_element(By.LINK_TEXT, "Visuelle Darstellung der Entwicklung eines Athleten")
        link.click()
        sleep(1)  # Warte, bis die Seite scrollt
        section = self.driver.find_element(By.ID, "visuelle_darstellung_entwicklung")
        self.assertTrue(section.is_displayed())






def tearDown(self):
        # Close the browser
        self.driver.quit()
        print("Test Wiki Success!")


if __name__ == "__main__":
    unittest.main()