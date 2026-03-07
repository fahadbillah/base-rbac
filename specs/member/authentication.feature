Feature: Member Portal - Authentication

  @e2e @member
  Scenario: Member sees the login page on first visit
    Given I visit the member portal
    Then I should see the heading "Member Portal"
    And I should see a "Sign In" button

  @e2e @member
  Scenario: Member is redirected to login when accessing a protected page unauthenticated
    Given I visit the member portal at "/profile"
    Then I should be redirected to "/login"

  @e2e @member
  Scenario: Authenticated member can access the home page
    Given I am logged in as a member
    When I visit the member portal at "/"
    Then I should see the heading "Welcome"
