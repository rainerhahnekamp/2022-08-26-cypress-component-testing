- [1. Cypress Component Testing](#1-cypress-component-testing)
  - [1.1 Mounting](#11-mounting)
  - [1.2 Parameterised test](#12-parameterised-test)
  - [1.3 Testing `@Input()`](#13-testing-input)
  - [1.4 Mocking the network via `cy.intercept`](#14-mocking-the-network-via-cyintercept)
  - [1.5 E2E Component Test](#15-e2e-component-test)

# 1. Cypress Component Testing

## 1.1 Mounting

You write a test for the `RequestInfoComponent` by using Cypress' component runner. That feature allows you to test a component in isolation by using all the capabilities of the Cypress framework.

Create and add following content to the file **/src/app/request-info/request-info.cy.ts**.

```typescript
import { RequestInfoComponent } from "./request-info.component";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { asyncScheduler, scheduled } from "rxjs";
import { AddressLookuper } from "../address-lookuper.service";

describe("Request Info", () => {
  it("should find an address", () => {
    const addressLookuper = { lookup: () => scheduled([true], asyncScheduler) };
    cy.mount(RequestInfoComponent, {
      imports: [RequestInfoComponent, NoopAnimationsModule],
      providers: [{ provide: AddressLookuper, useValue: addressLookuper }],
    });

    cy.testid("address").type("Domgasse 5");
    cy.testid("btn-search").click();
    cy.testid("lookup-result").should("have.text", "Brochure sent");
  });
});
```

Go to Cypress initial screen, click on component testing and run the test. It should be successful.

## 1.2 Parameterised test

Change the existing test that it runs twice. One run should work with a valid address and the second with an invalid.

It must be a paramterised test and the parameters should include the message from the lookup result and the boolean the mocked `AddressLookuper` returns.

Hint: Just wrap the test case in a for loop.

<details>
<summary>Show Solution</summary>
<p>

```typescript
for (const { response, message } of [
  {
    response: true,
    message: "Brochure sent",
  },
  {
    response: false,
    message: "Address not found",
  },
]) {
  it(`should show ${message}`, () => {
    const addressLookuper = {
      lookup: () => scheduled([response], asyncScheduler),
    };
    cy.mount(RequestInfoComponent, {
      imports: [RequestInfoComponent, NoopAnimationsModule],
      providers: [{ provide: AddressLookuper, useValue: addressLookuper }],
    });

    cy.testid("address").type("Domgasse 5");
    cy.testid("btn-search").click();
    cy.testid("lookup-result").should("have.text", message);
  });
}
```

</p>
</details>

## 1.3 Testing `@Input()`

Write a test with a new `TestBedConfig` where you only mount the `RequestInfoComponent` but use the additional `componentProperties` property to set the `address` to "Domgasse 5".

Verify that the input field's value is set.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it("should set the address", () => {
  cy.mount(RequestInfoComponent, {
    imports: [RequestInfoComponent, NoopAnimationsModule, HttpClientModule],
    componentProperties: { address: "Domgasse 5" },
  });
  cy.testid("address").should("have.value", "Domgasse 5");
});
```

</p>
</details>

## 1.4 Mocking the network via `cy.intercept`

Write a parameterised test where you test against a valid and a non-valid address. Use `cy.intercept` to mock the network communication.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it(`should mock the network request`, () => {
  cy.mount(RequestInfoComponent, {
    imports: [RequestInfoComponent, NoopAnimationsModule, HttpClientModule],
  });
  cy.intercept(/nominatim/, { body: [{}] });
  cy.testid("address").type("Domgasse 5");
  cy.testid("btn-search").click();
  cy.testid("lookup-result").should("have.text", "Brochure sent");
});
```

</p>
</details>

## 1.5 E2E Component Test

Finally, write a test where the network request is not mocked at all. You can still use "Domgasse 5" as query. That address does really exist.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it("should not mock the HTTP request", () => {
  cy.mount(RequestInfoComponent, {
    imports: [RequestInfoComponent, NoopAnimationsModule, HttpClientModule],
  });
  cy.testid("address").type("Domgasse 5");
  cy.testid("btn-search").click();
  cy.testid("lookup-result").should("have.text", "Brochure sent");
});
```

</p>
</details>
