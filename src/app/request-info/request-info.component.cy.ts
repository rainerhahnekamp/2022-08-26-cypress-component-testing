import {RequestInfoComponent} from "./request-info.component";

it("should just work", () => {
cy.mount("<app-request-info></app-request-info>", {imports: [RequestInfoComponent]})
})
