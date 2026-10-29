# Silent Data Failure Guard (Free) for n8n

Catch n8n runs that "succeed" with empty or incomplete data — inside the workflow, with no external monitoring service or n8n API key.

n8n's Error Workflow tells you when a run **crashes**. It does not tell you when a run **finishes "successfully" with no data**, or with a key field missing. The Guard is one Code node that you place after the node you want to check. When the data is empty or the field is missing, it fails the run on purpose, so your Error Workflow alerts you.

- **Version:** 1.0
- **Tested on:** self-hosted n8n 2.45.5 (Community Edition). Other versions and n8n Cloud have not been tested.
- **Uses only built-in nodes.**
- **Requirements:** n8n 2.x. For email alerts, an SMTP account set up as an n8n credential.

## What the Free version checks

| Check | Example it catches |
|-------|--------------------|
| Empty output | A query returns 0 rows, or an API returns `[{}, {}]` |
| One required field | `id` is missing, `null`, or `""` in some items |

## What's included

| File | What it is |
|------|------------|
| `workflows/free/silent-data-failure-guard-free.json` | Example workflow with the Guard |
| `workflows/free/guard-node-free.js` | The Guard's code, to paste into a new Code node |
| `workflows/free/error-alert-free.json` | Error Workflow set up to send the alert by email |
| `test-data/free/*.json` | The test cases we ran: input items (`runs`) and the expected result (`expect`). To try one, paste its `runs[0]` items into **Your data (example)** as `return [ ... ].map((json) => ({ json }));` |
| `LICENSE-FREE.md` | License terms |

## Setup (5 steps)

1. In n8n, create a new workflow. Open the **...** menu, choose **Import**, then **From file**, and select `workflows/free/silent-data-failure-guard-free.json`. Click the **Execute** button at the bottom of the canvas: all nodes turn green.
2. Copy the node **Silent Data Failure Guard** into your workflow, right after the node you want to check.
3. Open the node **before** the Guard, go to its **Settings** tab, and turn on **Always Output Data**. Without this, n8n skips the Guard when that node returns nothing, and the run still shows success.
4. In the Guard's code, set the field every item must have:
   ```js
   const REQUIRED_FIELD = 'id';
   ```
5. For alerts: import `workflows/free/error-alert-free.json`, set the SMTP credential and recipient in **Send Email**, and **Publish** it (n8n asks for a version name; the default is fine). In n8n 2.45.5, an Error Workflow that is not published does not run. Then, in your workflow's **...** → **Settings**, set **Error Workflow (to notify when this one errors)** to **Silent Data Failure Guard (Free) - Error Alert (Email)**.

Alerts are sent only for runs started by a trigger (schedule, webhook, and so on). In our check on n8n 2.45.5, a run started with the **Execute** button did not send an alert. Sending the email itself has not been tested (it needs your SMTP credential).

## Free and Pro

| | Free | Pro |
|---|------|-----|
| Empty output | ○ | ○ |
| Required fields | 1 field | Any number |
| Minimum item count | — | ○ |
| Sudden drop vs. the last run | — | ○ |
| Type and format rules (number, date, email, regular expression...) | — | ○ |
| Alerts | Email | Email, Slack, Telegram, Guard failures only |
| Install guide | 5-step setup | Full guide with test steps and 9 troubleshooting cases |
| Use in client projects | Not allowed | Agency license |

The Pro version is on Gumroad: https://veloxautomation.gumroad.com/l/n8n-silent-data-failure-guard

## License

See [LICENSE-FREE.md](LICENSE-FREE.md). In short: free to use and change in workflows you run for yourself or a business you own; not for client work (the Pro Agency license covers that); do not resell or republish it. Provided as is.

Not affiliated with n8n GmbH. n8n is a trademark of its owner.
