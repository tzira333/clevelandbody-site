
  ▲ Next.js 14.2.18
  - Environments: .env.local
  - Experiments (use with caution):
    · missingSuspenseWithCSRBailout

   Creating an optimized production build ...
 ✓ Compiled successfully
   Linting and checking validity of types  ..Failed to compile.

   Linting and checking validity of types  ..../app/api/appointments/route.ts:29:46
Type error: Cannot find name 'phone'.

  27 |
  28 | // In POST handler, use:
> 29 | const normalizedPhone = normalizePhoneNumber(phone)
     |                                              ^
  30 | const normalizedEmail = email ? normalizeEmail(email) : null
  31 |
  32 |
