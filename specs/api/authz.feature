Feature: GraphQL API - Authorization (RBAC)

  @api
  Scenario: Teacher can fetch all users
    Given I am authenticated with role "teacher"
    When I send a GraphQL query "users { id email }"
    Then the response status should be 200

  @api
  Scenario: Student is forbidden from fetching all users
    Given I am authenticated with role "student"
    When I send a GraphQL query "users { id email }"
    Then the response status should be 200
    And the response should contain a GraphQL error "Forbidden: No permission to read /users/*"
