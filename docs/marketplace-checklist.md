# Google Workspace Marketplace & OAuth checklist (status as of 2026-10-29)

## Phase 1 – share with friends (unverified app)
- [ ] Create a Google Cloud project; link it to the Apps Script project (Project Settings → Google Cloud Platform project).
- [ ] OAuth consent screen (Google Auth Platform → Branding/Audience): User type **External**, publishing status **In production** (a "Testing" app limits you to listed test users and tokens expire after 7 days).
- [ ] Scopes: `drive.file` and `userinfo.email` only. Both are **non-sensitive**, so Google does not require verification and the **100-user cap does not apply** (the cap applies to unverified apps requesting *sensitive or restricted* scopes, and counts over the project's whole lifetime, it can't be reset). Verify on the Audience page after setup. Note: Google may still show a lighter "unverified" notice until brand verification is done; friends click *Advanced → Go to app*.
- [ ] Deploy as web app: Execute as **User accessing**, Who has access **Anyone with a Google account**. Share the /exec URL.
Sources: https://support.google.com/cloud/answer/13807380 · https://support.google.com/cloud/answer/15549945 · https://developers.google.com/workspace/guides/configure-oauth-consent

## Phase 2 – Marketplace
- [ ] **Brand verification** (non-sensitive scopes need only basic/brand verification): verified domain in Search Console, home page on that domain, privacy policy URL on that domain, app name matches the listing, support email.
- [ ] Publish `docs/privacy-policy.md` and `docs/terms.md` as web pages on the verified domain.
- [ ] Enable **Google Workspace Marketplace SDK** in the Cloud project. App Configuration: choose **Workspace add-on** (deployment ID from a versioned add-on deployment) and/or **Web app** (the /exec URL). Visibility: Public. Installation: individual + admin.
- [ ] Store listing: app name (≤50 chars, no version, no Google trademarks), short + detailed description (not identical), category, pricing, developer name/website, trader status (EEA), support/privacy/terms URLs.
- [ ] Graphic assets: application icons 32×32 and 128×128 (PNG), card banner 220×140, at least one screenshot 1280×800 (up to 5). Check the current SDK form for exact sizes before upload.
- [ ] Demo video: only required if you request sensitive/restricted scopes (YouTube, unlisted, showing the consent screen and each scope in use). Keep one ready anyway.
- [ ] Review criteria: no obvious bugs, loading indicators, one-time sign-in, working sign-out/revoke, clear button labels, feedback for every action, not a work in progress.
Sources: https://developers.google.com/workspace/marketplace/about-app-review · https://developers.google.com/workspace/marketplace/configure-oauth-consent-screen
