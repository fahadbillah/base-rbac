import { Given, When, Then } from "@cucumber/cucumber";
import request from "supertest";
import assert from "assert";

import type { CustomWorld } from "../../../packages/test-utils/src/world";

Given("I am authenticated as a member", async function (this: CustomWorld) {
    // TODO: exchange a test user token via Auth0 Management API or use a mock
    this.lastResponse = undefined;
});

Given("I am not authenticated", function (this: CustomWorld) {
    this.lastResponse = undefined;
});

When(
    "I send a GraphQL query {string}",
    async function (this: CustomWorld, query: string) {
        const res = await request(this.apiUrl)
            .post("")
            .set("Content-Type", "application/json")
            // Token set in Before hook for authenticated scenarios
            .send({ query: `{ ${query} }` });

        this.lastResponse = { status: res.status, body: res.body };
    }
);

When(
    "I send a GraphQL mutation {string}",
    async function (this: CustomWorld, mutation: string) {
        const res = await request(this.apiUrl)
            .post("")
            .set("Content-Type", "application/json")
            .send({ query: `mutation { ${mutation} }` });

        this.lastResponse = { status: res.status, body: res.body };
    }
);

Then(
    "the response status should be {int}",
    function (this: CustomWorld, expectedStatus: number) {
        assert.equal(
            this.lastResponse?.status,
            expectedStatus,
            `Expected status ${expectedStatus} but got ${this.lastResponse?.status}`
        );
    }
);

Then(
    "the response should contain a user with my email",
    function (this: CustomWorld) {
        const body = this.lastResponse?.body as { data?: { me?: { email: string } } };
        assert.ok(body?.data?.me?.email, "Expected user.email in response");
    }
);

Then(
    "the response should contain name {string}",
    function (this: CustomWorld, name: string) {
        const body = this.lastResponse?.body as { data?: { updateProfile?: { name: string } } };
        assert.equal(body?.data?.updateProfile?.name, name);
    }
);
