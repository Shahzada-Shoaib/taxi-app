const deploymentUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const siteUrl = (process.env.SITE_URL || deploymentUrl).replace(/\/+$/, "");