Feature: Admin Portal - User Management

  @e2e @admin
  Scenario: Admin can view the users list
    Given I am logged in as an admin
    When I navigate to "/users"
    Then I should see the heading "Users"

  @e2e @admin
  Scenario: Non-admin is redirected from admin portal login
    Given I visit the admin portal
    Then I should see the heading "Admin Portal"
    And I should see a "Sign In" button

  @e2e @admin
  Scenario: Admin dashboard is accessible after login
    Given I am logged in as an admin
    When I visit the admin portal at "/"
    Then I should see the heading "Dashboard"
