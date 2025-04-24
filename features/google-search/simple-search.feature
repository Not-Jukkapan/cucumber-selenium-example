Feature: Waffle Game Login

  Scenario: Successful login to Waffle Game
    Given I open the Waffle Game login page
    When I fill in email and password
    And I click the Login button
    Then I should be logged in
