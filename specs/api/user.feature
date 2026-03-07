Feature: GraphQL API - User

  @api
  Scenario: Authenticated user can fetch their own profile
    Given I am authenticated as a member
    When I send a GraphQL query "me { id email name role }"
    Then the response status should be 200
    And the response should contain a user with my email

  @api
  Scenario: Unauthenticated request is rejected
    Given I am not authenticated
    When I send a GraphQL query "me { id email }"
    Then the response status should be 401

  @api
  Scenario: Authenticated user can update their profile name
    Given I am authenticated as a member
    When I send a GraphQL mutation "updateProfile(input: { name: \"Jane Doe\" }) { id name }"
    Then the response status should be 200
    And the response should contain name "Jane Doe"
