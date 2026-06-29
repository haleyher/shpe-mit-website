# SHPE MIT Points — backend setup (Phase 1)

This sets up the **database (Google Sheet)** + **server (Apps Script)** + **login
(Sign in with Slack)**. The website front-end gets wired up after this is live.

> You only do this once. Future boards just keep using the same Sheet + script.

---

## 0. Use a dedicated Google account (important)
Create or pick a **dedicated SHPE Google account** (e.g. `shpemit.tech@gmail.com`)
to own the Apps Script. This is required because the script must be deployable to
**"Anyone, even anonymous"** (Slack and the website call it without a Google
login), which MIT Workspace accounts can't do. Your spreadsheet can still live in
the **exec MIT Drive** — you'll just share it to this account.

---

## 1. Create the database (Google Sheet)
1. Create a Google Sheet named e.g. **"SHPE MIT Points"** (keep it in the exec Drive).
2. **Share** it as **Editor** with the dedicated account from step 0.
3. Copy its **Sheet ID** — the long string in the URL between `/d/` and `/edit`:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

> You don't need to build the tabs by hand — running `setup()` in step 4 creates
> them. If you'd like to see/seed the structure with example rows, the
> **`sheet-template/`** folder here has `Members.csv`, `Events.csv`, and
> `Entries.csv`. To use them: in the Sheet, **File → Import → Upload** a CSV →
> **Insert new sheet(s)**, then rename the tab to match (Members/Events/Entries).
> The sample rows are just examples — delete them before going live.

## 2. Create the Apps Script project
1. Signed in as the **dedicated account**, go to <https://script.google.com> → **New project**.
2. Delete the sample code, paste in everything from **`Code.gs`** (in this folder).
3. Save.

## 3. Add the secrets (Script Properties)
Project Settings (gear icon) → **Script Properties** → add these rows:

| Property | Value |
|---|---|
| `SHEET_ID` | the Sheet ID from step 1 |
| `SLACK_CLIENT_ID` | from step 5 |
| `SLACK_CLIENT_SECRET` | from step 5 |
| `SESSION_SECRET` | any long random string you make up (e.g. 40+ random characters) |
| `SITE_URL` | your live site, e.g. `https://shpe.mit.edu/` — this is also the Slack Redirect URL. Must match **exactly** (including the trailing `/`). |
| `SLACK_TEAM_ID` | *(optional but recommended)* your Slack workspace ID (starts with `T…`) — restricts login to SHPE Slack members. Find it at <https://api.slack.com/methods/auth.test/test> or in a Slack URL. |

(You'll fill `SLACK_*` after step 5, then come back.)

> **Heads-up:** `SITE_URL` is the single source of truth for where Slack sends
> members back. It must be **identical** in three places: this property, the
> Slack Redirect URL (step 5), and the website's address. Mismatches cause a
> "redirect_uri did not match" error.

## 4. Create the tables + deploy
1. In the editor, choose the function **`setup`** in the toolbar dropdown → **Run**.
   Approve the permission prompt. This creates the **Members / Events / Entries** tabs.
2. **Deploy → New deployment → type: Web app.**
   - **Execute as:** Me (the dedicated account)
   - **Who has access:** **Anyone** *(must be the anonymous one)*
3. Copy the **Web app URL** (ends in `/exec`). This is your API URL (the website
   already has it in `src/config.ts`).

> **After any later edit to `Code.gs`:** redeploy with **Manage deployments →
> edit (pencil) → Version: New version → Deploy** so the URL stays the same.

## 5. Create the Slack app ("Sign in with Slack")
"Sign in with Slack" is configured entirely on the **OAuth & Permissions** page —
there is no separate "OpenID Connect" page in the current Slack UI.

1. <https://api.slack.com/apps> → **Create New App** → From scratch → pick the SHPE workspace.
2. Left sidebar → **OAuth & Permissions**:
   - **Redirect URLs** → *Add New Redirect URL* → paste your **website URL**
     (the same value as `SITE_URL`, e.g. `https://shpe.mit.edu/`) → **Add** →
     **Save URLs** *(it won't save without that last click)*. Slack requires
     **https** here, so the full login loop only works on the deployed site, not
     `http://localhost`.
   - **Scopes → User Token Scopes** (the *User* list, not Bot) → add: `openid`,
     `email`, `profile`. *(Bot scopes for DMs come later, in Phase 3.)*
3. **Basic Information → App Credentials** → copy the **Client ID** and
   **Client Secret** into Script Properties (step 3). The Client ID also goes in
   the website's `src/config.ts` (already filled in for you).
4. **Install to Workspace** (button on Basic Information / OAuth & Permissions).
   You can configure everything yourself; the *install* may need a workspace
   **admin to approve** — send them the request.

## 6. Test it
On the **deployed website** (Slack login needs https, so not on localhost):
- Click **Member Login → Sign in with Slack** → approve in Slack → you should
  land back on the site, logged in, with the Member Portal open.
- Open the Sheet → your row should appear in **Members** (as `general`).
- To make yourself **exec**, change your row's `role` cell to `exec`, then refresh.
- Add a test row in **Entries** (e.g. `approved`, `10` points) → reload the portal
  → your points + history should update.

Quick backend-only check (no website needed): visit
`YOUR_WEB_APP_URL?action=me&token=anything` — you should get JSON like
`{"ok":false,"error":"Not logged in..."}`. That confirms the script is live.

---

## Notes
- **Re-deploying:** after editing `Code.gs`, use **Manage deployments → edit
  (pencil) → New version → Deploy** so the URL stays the same (a brand-new
  deployment changes the URL).
- **Security:** the script verifies the signed token and the member's `role` on
  every action, so a general member can never approve their own points.
- **Backups:** File → Version history protects the Sheet; you can also duplicate it
  each year for archives.
