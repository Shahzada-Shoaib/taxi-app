This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# taxi-app

## Contact and booking setup

- Edit `app/site-config.ts` with the client's mobile number (including country code), WhatsApp number and full Facebook page URL. WhatsApp uses the mobile number when its separate setting is empty. Unconfigured channels are hidden; no dummy contact details are published.
- The enquiry form submits to the local `/api/contact` route, which validates input and forwards it to FormSubmit's AJAX endpoint for `shahzada.shoaib011@gmail.com`. This avoids navigating the browser to FormSubmit (and its failing QUIC connection). A Next.js server deployment is required; a static export cannot handle submissions. No API key is needed.
- Before launch, submit from the deployed website, open the FormSubmit activation email in that inbox (check spam), and click its confirmation link. Submit the enquiry form again to verify receipt. Delivery has not been verified until this is done. The AJAX integration uses a honeypot instead of the redirect-based CAPTCHA. A successful API response confirms provider acceptance, not inbox delivery.
- The enquiry form shows sending, accepted and error states in place. Errors preserve the entered details and offer direct email/WhatsApp contact. Run `node --test tests/contact-route.test.mjs` for mocked submission/error tests; these do not send live email.
- The compact hero booking form opens WhatsApp with service, pickup, destination, timing, vehicle and passenger details. It does not call the email API. Its temporary testing destination is `923224971299`, configured separately as `bookingWhatsappNumber` in `app/site-config.ts`. The customer must tap Send in WhatsApp. Booking submissions are requests, not confirmed reservations. Confirm the fare, vehicle capacity and availability directly with the customer.
- Fleet photos are representative Wikimedia Commons images saved in `public/`; credits and CC BY-SA 4.0 links are displayed under the gallery. Replace them with the client's own vehicle photos when available.
