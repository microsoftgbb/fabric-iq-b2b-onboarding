# Verify actual access

Use the intended user's native session and the intended target.
Do not substitute owner/admin results, browser rendering, or cached answers.

The placeholders here are not runnable identifiers. Have the owner provide
exact schema names, categories, approved aliases, and expected access.

## 1. Confirm the caller

Run the [procedure's identity prompt](B2B-PROCEDURE.md#10-prove-the-actual-caller-before-reading-business-data)
with a new marker.
Inspect the actual result for:

| Field | Expected |
| --- | --- |
| Marker | The newly supplied marker |
| UPN / Username | Intended user or explicitly approved aliases |
| Linked model | The selected report's intended semantic model |
| Result | Actual one-row execution, not only artifact metadata |

Stop on identity or model mismatch before reading business data.

Some native tool responses contain query rows in text `content` and only
artifact citations in `structuredContent`. Read the actual execution payload.
An overall successful tool delivery can still contain a DAX error.

## 2. Confirm permitted data

After identity verification, enter:

```text
Use native FabricIQ ExecuteQuery on <REPORT_ID>, maxRows 1.
Return a fresh marker, USERPRINCIPALNAME(), and the count of rows
in <OWNER_APPROVED_FACT_TABLE> visible under my existing security.
Guard the aggregate so it is evaluated only for <EXPECTED_UPN>
or the owner's approved aliases. Stop on mismatch or error.
Return the actual response. Do not change report filters or permissions.
```

Compare with an authorized baseline only when it uses the same model,
query scope, and data snapshot. Legitimately empty data needs a known
positive control elsewhere; zero alone is not a complete security proof.

## 3. Check owner-defined RLS/OLS

The skill includes [parameterized DAX templates](../skills/fabric-iq-b2b-validation/references/VALIDATION_QUERIES.md).
For a report, confirm its linked model and use its report ID when supported
by the current native tool schema.

```text
Use the verified user session and native FabricIQ tools on <REPORT_ID>.
The owner's intended role is <RLS_ROLE>.

Run serial, bounded aggregate checks for:
- A known permitted data set.
- Forbidden customer categories on each secured dimension/fact path.
- Each table explicitly denied by the owner.
- Each confirmed existing numeric column explicitly protected by OLS.

Include fresh markers and caller identity where queries can evaluate.
Use maxRows 1 and one query per request to isolate errors.
Inspect the actual payload before proceeding.

ALL/REMOVEFILTERS clear ordinary query filters, not RLS.
They must not expose security-restricted rows.

Stop if the caller/model changes, a forbidden count is nonzero,
or a protected column returns a data row/value.
Record source/schema errors as inconclusive, never as zero or passed.
Do not retry through another identity, measure, API, or permission grant.
```

An OLS error can occur before the query evaluates its UPN projection.
Anchor denied queries to fresh identity checks before/after the suite.
A field-not-found error is expected only when the owner has confirmed that
the exact field exists and is intentionally protected.

## 4. Ask useful questions

These are illustrative utility questions. Check your model's actual schema
and measures, and resolve named values before generating DAX.

| Area | Example |
| --- | --- |
| Billing | Compare permitted billed revenue by month |
| Billing quality | Estimate the share of bills using estimated readings |
| Consumption | Show monthly delivered electricity and regional differences |
| Interruptions | Compare interruption counts and average restoration duration |
| Weather | Compare weather-related versus other interruption duration |
| Distributed energy | Summarize permitted applications by type and status |

Ask for aggregates first. MCP queries do not automatically update report,
page, visual, or local HTML filters. Ordinary query filters and model
security filters are different.

Do not label interruption records as distinct customer counts unless the
chosen measure actually calculates distinct customers.

## 5. Restart check

Only when the CLI is idle, exit it normally. Restart the same approved
executable with the same configuration and run a new identity-only query.
Do not terminate another user's work or replay a previous result.

Record whether another interactive Microsoft sign-in was required.
A successful restart does not guarantee indefinite token refresh.

## Acceptance record

| Check | Result | Evidence to record privately |
| --- | --- | --- |
| Native connection | Pass / blocked | Version, endpoint, runtime tools |
| Target/caller | Pass / fail | Fresh marker, returned UPN, linked model |
| Permitted aggregate | Pass / inconclusive | Actual scope/result and baseline |
| RLS/OLS | Per-probe pass / fail / inconclusive | Counts or exact justified denial |
| Browser report | User-confirmed / independently observed / blocked | Account, permitted visual, license/error |
| Restart | Pass / sign-in required / blocked | New marker and current response |

Keep tokens, OAuth/callback URLs, state, nonce, PKCE, credentials, and
customer records out of shared evidence.

Use the [onboarding acceptance checklist](B2B-PROCEDURE.md#12-record-acceptance-and-handoff)
for handoff. Record results from the current user's environment, not results
from another tenant or a previous run.
