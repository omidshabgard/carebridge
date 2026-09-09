# CareBridge feature research and implementation decisions

Audience: CareBridge product and QA team  
Date: September 5, 2026  
Scope: U.S.-oriented patient-portal feature set, application architecture, security baseline, accessibility, and future interoperability.

## Executive answer

The strongest first release is a patient-centered portal that makes frequent tasks obvious: appointments, secure messages, medications and refills, test results, records, billing, insurance, care-team access, documents, and account/privacy settings. These functions are now represented in the frontend navigation, and the backend implements the security-sensitive core resource pattern.

## Evidence-backed decisions

- The ASTP/ONC Patient Engagement Playbook identifies online booking, prescription refills, secure messaging, notes, educational resources, and electronic records requests as high-value portal functions. CareBridge includes the first five task families and leaves education content as a later editorial module. [ASTP/ONC Patient Engagement Playbook](https://playbook.healthit.gov/playbook/pe/chapter-3/)
- ONC describes common patient-portal information and tasks as visits, discharge summaries, medications, immunizations, allergies, lab results, secure messaging, refills, non-urgent appointments, benefits, payments, forms, and educational material. This became the basis for the expanded sidebar and roadmap. [ONC Health IT and HIE FAQs](https://healthit.gov/health-it-basics/hit-hie-faqs/)
- HHS describes access control, audit controls, integrity, authentication, and transmission security as technical safeguards for systems containing electronic protected health information. The demo therefore uses authenticated patient-scoped API queries, short-lived tokens, security headers, rate limiting, bounded JSON payloads, and a future audit-log milestone. This code alone must not be described as HIPAA compliant. [HHS Summary of the HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html)
- WCAG 2.2 is the current W3C Recommendation and emphasizes perceivable, operable, understandable, and robust experiences. CareBridge uses semantic buttons, visible labels, responsive navigation, readable sizing, status text in addition to color, and keyboard-native controls. Formal conformance still requires systematic manual and automated evaluation. [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- HL7 FHIR is a standard for electronic exchange of healthcare information. The backend keeps patients, practitioners, appointments, medications, messages, and records as separate resources so a later FHIR adapter can map them without coupling the UI directly to an EHR. [HL7 FHIR Overview](https://hl7.org/fhir/overview.html)

## Release roadmap

1. Current package: navigable patient dashboard, realistic modules, auth API, patient-scoped resources, and local/live Playwright configuration.
2. Local integration: connect the frontend forms to the API, seed a dedicated test database, and add loading/error/empty states.
3. Security iteration: refresh tokens or secure cookie sessions, role permissions, audit events, password reset, email verification, stronger validation, and security tests.
4. Product iteration: provider availability, true conversations, refill workflow, result trends, statements/payments, benefits/claims, document upload, proxy/caregiver access, and notification preferences.
5. Interoperability: define an explicit FHIR mapping and use a validated SMART on FHIR integration when connecting to an EHR.
6. Delivery: local regression, GitHub Actions, staging, live smoke tests, accessibility review, and only then a public portfolio/LinkedIn launch.

## Limitations

The current data is synthetic. No real patient data should be entered. Billing/payment processing, EHR connectivity, email/SMS, file storage, and clinical decision support are deliberately excluded until their vendors, security model, and legal requirements are selected.
