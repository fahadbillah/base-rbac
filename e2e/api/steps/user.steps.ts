import { Given, When, Then } from "@cucumber/cucumber";
import request from "supertest";
import assert from "assert";

import type { CustomWorld } from "../../../packages/test-utils/src/world";

import { PrismaClient } from "@prisma/client";

Given("I am authenticated as a member", async function (this: CustomWorld & { isAuthenticated?: boolean }) {
    this.isAuthenticated = true;
    this.lastResponse = undefined;
    const prisma = new PrismaClient();
    await prisma.user.upsert({
        where: { auth0Id: "test-user-id" },
        update: {},
        create: {
            auth0Id: "test-user-id",
            email: "test@example.com",
            name: "Test User",
            role: "MEMBER",
        }
    });
});

Given("I am not authenticated", function (this: CustomWorld & { isAuthenticated?: boolean }) {
    this.isAuthenticated = false;
    this.lastResponse = undefined;
});

When(
    "I send a GraphQL query {string}",
    async function (this: CustomWorld & { isAuthenticated?: boolean }, query: string) {
        const req = request(this.apiUrl)
            .post("/graphql")
            .set("Content-Type", "application/json");

        if (this.isAuthenticated) {
            req.set("Authorization", "Bearer test-user-id");
        }

        const res = await req.send({ query: `{ ${query} }` });
        this.lastResponse = { status: res.status, body: res.body };
    }
);

When(
    "I send a GraphQL mutation {string}",
    async function (this: CustomWorld & { isAuthenticated?: boolean }, mutation: string) {
        const req = request(this.apiUrl)
            .post("/graphql")
            .set("Content-Type", "application/json");

        if (this.isAuthenticated) {
            req.set("Authorization", "Bearer test-user-id");
        }

        const res = await req.send({ query: `mutation { ${mutation} }` });
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
