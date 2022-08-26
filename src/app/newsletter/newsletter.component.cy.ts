import { NewsletterComponent } from './newsletter.component';
import { NewsletterComponentModule } from './newsletter.component.module';

it('should test the newsletter', () => {
  cy.mount(NewsletterComponent, { imports: [NewsletterComponentModule] });
});
