# Troubleshooting

Identify the failing layer before changing anything:

| Layer | Evidence needed | What success does not prove |
| --- | --- | --- |
| OAuth | Native browser flow completed | MCP handshake, correct caller, or model access |
| MCP initialization/discovery | Connected server and current tools | Target artifact permissions or query execution |
| Artifact resolution/metadata | Actual target returned | Successful data/source access |
| Query execution | Fresh native result | All models, security paths, visuals or roles |
| Security expectations | Owner-defined positive/negative probes | Every field or future model changes |

Do not loop indefinitely. After standard setup, use at most one unchanged
reload/restart control and one explicitly approved client-version comparison.
If blocked, report the evidence and the
next owner/service boundary rather than guessing new configuration keys.

## Resource-tenant checks

1. Confirm the resource tenant from the intended report or model and verify
   that the guest invitation is redeemed in that directory.
2. Have the user select their own work/school account and complete applicable
   MFA. Use a supported resource-tenant selector if the current client offers one.
3. Keep one live native authorization flow. Cancel an expired flow through
   the client before starting a new one.
4. After authorization, check native connection status and run a fresh identity
   query on the intended target.

If the client cannot authorize the guest in the required context, stop and
escalate to the identity administrator or client support with sanitized error
details. Do not rewrite authorization URLs, capture callbacks, or invent
`tenant`, `authority`, or `auth` configuration fields.

A browser report URL's tenant context or an account-picker label does not
prove the caller used by native MCP.

## Authentication and callback symptoms

| Symptom | Interpretation and bounded response |
| --- | --- |
| "Account does not exist in tenant" | Check which account, tenant and application produced it; an Azure CLI audit login is not a native Fabric IQ login |
| Host admin rejected by guest's home tenant | Do not invite the admin into the customer's tenant or demand home-admin access; correct the diagnostic scope |
| MFA-required sign-in record | A challenge, not completed authentication; let the guest satisfy actual policy |
| Native callback timeout | Expired flow; start fresh and do not reuse the old page |
| OAuth success, "still requires authentication" | Inspect live MCP state again; asynchronous connection may settle later; prove execution rather than trust the banner |
| Identity mismatch | Stop business queries; obtain the intended guest sign-in, not an admin substitute |
| "No OAuth-capable servers" | A passive-picker/probe result is not proof that the service lacks OAuth; verify the actual configured server/UI |
| Tools missing while server pending | Inspect native details for an already-active browser authorization before launching another |

Credential-cache entry names/hashes and read attempts do not certify identity,
tenant, successful lookup or token content. Do not read/delete credentials
to diagnose those ambiguities.

## Initialization versus model failures

`-32003`, an empty `errorCode`, or "Unable to process the request" during
initialization can occur before any report/model identifier is sent.
Record version, endpoint/contract, UTC time and request/correlation ID.
Do not use report sharing or RLS changes as a fix for this pre-item failure.

After initialization:

- `ArtifactAccessDenied`: confirm the actual report/model and existing guest
  access. Metadata on a candidate is not production-model authorization.
- Missing references/source access: have an authorized owner review the
  model/source configuration. Do not grant guest source ReadAll or enable SSO
  speculatively. MCP does not automatically repair source binding.
- Duplicate relationship keys: record the exact sanitized error and mark
  that table/query inconclusive. It may surface despite other queries working.
  Do not label it zero, an authentication problem, or a fully isolated root
  cause without further owner-approved investigation.
- OLS column not found: expected only against a known, existing protected
  column; client-side schema validation alone is weaker than an actual engine
  denial. Preserve the returned engine and parser messages separately.

## Version and packaging control

Use the currently supported release and check official release notes for
fixes relevant to the error. Obtain approval before installing a prerelease
or replacing the working client. Change one variable at a time and verify
the result with a fresh native query.

If a root npm loader installs but its OS/architecture package is missing,
check package availability and the official platform release assets. Do not
call it a tested upgrade until its entry point actually launches and reports
the expected version. Prefer an approved local control over a global update.
Keep the working version/profile and record how to launch it again.

## Optional administrative diagnostics

Only with appropriate authorization, use the resource tenant's standard
read-only Entra/Fabric/Power BI diagnostics. Filter sign-ins to the actual
native application, guest principal and bounded UTC window; distinguish
interactive and noninteractive records where the API allows.

Account for delayed audit records. Absence is not proof of an account/token
tenant or that a request never reached the service. Power BI activity logs
are not a substitute for the actual native query response.

An administrator's query is not guest proof. Home-tenant audit access can
require roles the guest lacks; a 403 on that diagnostic does not make those
roles prerequisites for using Fabric IQ. Do not ask the customer for home
administrator access as a connection requirement.

## Official sources

- [Fabric IQ MCP](https://learn.microsoft.com/en-us/fabric/iq/connectors/fabric-iq-mcp)
- [Entra authorization code flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)
- [Official CLI releases](https://github.com/github/copilot-cli/releases)
