Feature: Searching an keyword in google search engine

  @testCase
  Scenario: search famous personality
    Given I open "http://www.google.com/ncr"
    When I enter "selenium and cucumber" in search box
    And I click search button
    Then I should see the expected results
