export type UserProfile = {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
};

export type PaymentDetails = {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
};

export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

/** Builds a unique user so registration stays idempotent across parallel runs. */
export function createUniqueUser(overrides: Partial<UserProfile> = {}): UserProfile {
  const stamp = Date.now();
  const random = Math.floor(Math.random() * 10_000);
  const firstName = overrides.firstName ?? 'John';
  const lastName = overrides.lastName ?? 'Tester';

  return {
    name: overrides.name ?? `${firstName} ${lastName}`,
    email: overrides.email ?? `qa.auto.${stamp}.${random}@example.com`,
    password: overrides.password ?? 'SecurePass123!',
    title: overrides.title ?? 'Mr',
    birthDay: overrides.birthDay ?? '15',
    birthMonth: overrides.birthMonth ?? '5',
    birthYear: overrides.birthYear ?? '1990',
    firstName,
    lastName,
    company: overrides.company ?? 'Perficient',
    address1: overrides.address1 ?? '555 Maryville University Dr',
    address2: overrides.address2 ?? 'Suite 500',
    country: overrides.country ?? 'United States',
    state: overrides.state ?? 'Missouri',
    city: overrides.city ?? 'St Louis',
    zipcode: overrides.zipcode ?? '63141',
    mobileNumber: overrides.mobileNumber ?? '3145550199',
  };
}

export function createUser(overrides: Partial<UserProfile> = {}): UserProfile {
  const firstName = overrides.firstName ?? 'Rahul';
  const lastName = overrides.lastName ?? 'Tester';

  return {
    name: overrides.name ?? `${firstName} ${lastName}`,
    email: overrides.email ?? `qa.automation.@example.com`,
    password: overrides.password ?? 'SecurePass123!',
    title: overrides.title ?? 'Mr',
    birthDay: overrides.birthDay ?? '15',
    birthMonth: overrides.birthMonth ?? '5',
    birthYear: overrides.birthYear ?? '1990',
    firstName,
    lastName,
    company: overrides.company ?? 'Perficient',
    address1: overrides.address1 ?? '555 Maryville University Dr',
    address2: overrides.address2 ?? 'Suite 500',
    country: overrides.country ?? 'United States',
    state: overrides.state ?? 'Missouri',
    city: overrides.city ?? 'St Louis',
    zipcode: overrides.zipcode ?? '63141',
    mobileNumber: overrides.mobileNumber ?? '3145550199',
  };
}

export function createPaymentDetails(overrides: Partial<PaymentDetails> = {}): PaymentDetails {
  return {
    nameOnCard: overrides.nameOnCard ?? 'Alex QA',
    cardNumber: overrides.cardNumber ?? '4111111111111111',
    cvc: overrides.cvc ?? '123',
    expiryMonth: overrides.expiryMonth ?? '12',
    expiryYear: overrides.expiryYear ?? '2030',
  };
}

export function createContactFormData(overrides: Partial<ContactFormData> = {}): ContactFormData {
  const stamp = Date.now();
  return {
    name: overrides.name ?? 'Alex QA',
    email: overrides.email ?? `contact.${stamp}@example.com`,
    subject: overrides.subject ?? 'Automation framework validation',
    message:
      overrides.message ??
      'This message was submitted by the Playwright enterprise automation suite.',
  };
}
