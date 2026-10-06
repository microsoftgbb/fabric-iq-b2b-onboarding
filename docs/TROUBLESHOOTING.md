# Troubleshooting

Find the failing layer before changing permissions.

| Symptom | Check | Do not do |
| --- | --- | --- |
| Browser MFA registration blocked | Resource-tenant policy, registration action, approved network/VPN | Disable MFA/CA or add an unapproved IP exception |
| OAuth succeeded; MCP pending | Current native status, live callback, discovered tools | Launch competing sign-ins or assume the actor |
| Identity mismatch | Intended account and target model | Continue business queries as admin |
| Discovery returns nothing | Supplied report browser URL/ID and direct metadata/query access | Enable guest browsing or widen grants speculatively |
| Direct model ID returns 404 | Confirm report binding; try the supported report-ID query input once | Treat URL parsing as access proof or broaden permissions |
| Report or model denied | Actual host guest object, intended Read grants, role and licensing | Add Build or an editor role as a shortcut |
| `Missing_References` / source failure | Owner-reviewed model/source connection and credentials | Give the guest broad source access automatically |
| Duplicate relationship key | Exact data/model error; affected query marked inconclusive | Turn it into zero or call it an auth failure |
| Protected field not found | Owner-confirmed existing column and intended OLS | Invent a replacement measure to expose it |
| Below-F64 license prompt | User's applicable Pro/PPU/trial entitlement | Claim MCP success proves Free-only report viewing |

## MFA registration and network locations

If MFA registration requires an approved network location, use the
organization's authorized network/VPN and complete registration. Ask the
identity administrator to review a persistent block; do not weaken the policy.
A VPN is not a universal requirement.

## Report-ID query path

When the current tool schema accepts a report or semantic model `artifactId`,
confirm the report's linked model. If direct model lookup returns 404, try
the supported report-ID input once and inspect the returned model and caller.
Stop if either differs from the intended target.

A 404 can mean a missing or inaccessible artifact; changing the input ID does
not grant access or replace identity and permission checks.

## Capacity versus licensing

Fabric IQ MCP itself does not require Fabric/Premium hosting according to
Microsoft's current endpoint documentation. A **Direct Lake model** still
needs appropriate Fabric hosting; its SKU affects compute and memory limits.

For authenticated Power BI report viewing:

| Scenario | Implication |
| --- | --- |
| Eligible Free viewer on F64+ | Viewing can be supported without Pro |
| Viewer on an F SKU below F64 | Generally requires Pro, PPU, or applicable trial |
| User-owns-data HTML embedding | Does not remove per-viewer licensing requirements |
| App-owns-data embedding | Different architecture; not this delegated native MCP setup |

Check the user's Power BI profile, assigned subscriptions, and active trial
status. A Free base-license label or empty resource-tenant license list does
not rule out a home-tenant license or an in-product trial. MCP success alone
does not prove browser-viewing entitlement.

Before an owner resizes a capacity, identify every affected workspace,
review licensing and model limits, obtain approval for the change/rollback,
and record the original SKU. Recheck fresh user queries and browser access
after the new SKU is actually Active. A light functional check is not a load test.

## Bounded client diagnostics

Start with the supported client and normal native configuration.
Use at most one unchanged reload/restart control per investigation cycle.
Stop and report a sanitized failure if it remains blocked.

Check the installed version against official release guidance. Obtain approval
before installing a prerelease or changing the working client.
Use only supported sign-in controls; do not invent OAuth configuration keys.

See the [bundled troubleshooting reference](../skills/fabric-iq-b2b-validation/references/TROUBLESHOOTING.md)
for tenant-context checks, callback failures, and escalation boundaries.

## Sources

- [Fabric IQ MCP requirements and authentication](https://learn.microsoft.com/en-us/fabric/iq/connectors/fabric-iq-mcp)
- [Fabric licenses and embedding scenarios](https://learn.microsoft.com/en-us/fabric/enterprise/licenses)
- [Direct Lake overview](https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-overview)
