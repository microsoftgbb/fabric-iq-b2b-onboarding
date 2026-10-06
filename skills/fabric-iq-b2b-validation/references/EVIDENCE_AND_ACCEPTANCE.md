# Evidence and acceptance

## Outcome levels

Report the highest level actually established, not a binary blanket success:

1. **Configured**: intended endpoint, contract and client version are recorded.
2. **Connected**: native initialization and current tool discovery succeed.
3. **Guest target access verified**: a new identity-only response on the actual
   target matches the expected caller and fresh marker.
4. **Requested data/security checks verified**: every claimed probe has an
   independently inspected successful result or expected, justified OLS denial.
5. **Cold restart verified**: a new query after restarting returns the expected
   caller without another requested interactive sign-in.

An inconclusive security probe does not erase valid identity/connection proof,
but prevents certifying that probe or exhaustive model security.

## Evidence to keep locally, when requested

- OS/architecture, actual CLI version and approved launch/configuration paths.
- Public endpoint and selected tool-contract header.
- Artifact type/ID, report-to-model binding, expected and actual identity.
- UTC execution time, fresh marker and native tool call/request/correlation ID.
- Actual bounded tool response or a source-event reference checked against it.
- Each probe's scope, result and exact sanitized error.
- Fresh versus resumed session, restart outcome and any additional sign-in.
- Changes actually made, approval boundaries, unknowns and limitations.

Per-probe statuses:

| Status | Meaning |
| --- | --- |
| Pass | The actual expected identity/result or justified OLS denial was observed |
| Fail | Wrong identity, forbidden data/count, or exposed protected value |
| Inconclusive | Execution/schema/source error, no trustworthy baseline, or missing response |
| Not requested | No test was authorized or intended |

A wrapper's `success: true` can mean only that a tool response was delivered.
Inspect its content for query errors. Never convert access errors, source
errors, duplicate-key failures or an omitted result into a zero count.

## Evidence not to share

Do not package native log/session directories wholesale. They can contain
authentication URLs, sensitive prompts and other material beyond the proof.
Extract only the specific approved evidence and review it before sharing.

Exclude tokens, credential-store values/files, cookies, authorization or
callback URLs, codes, state, nonce, PKCE material, private account/tenant IDs
unless sharing them is explicitly approved, and customer-level business data.

For a public example, use placeholders or fictitious Contoso data such as
`alex@contoso.example`. Do not substitute a previous operator's actual tenant,
model, report, UPN, machine path, query counts or source connection.

## Acceptance limits

Never claim:

- Administrator or browser-only execution is native guest MCP proof.
- A validation model proves access to a different intended target.
- One zero count certifies every security path or OLS field.
- A successful restart proves indefinite refresh/token lifetime.
- A configured profile isolates OS credential stores.
- A prerelease is necessary for all B2B users.
- Every OS, sovereign cloud, tenant policy, license or model design was tested.

Do not publish evidence or open a support ticket without the owner's approval.
