# Annotated permission screenshots

These screenshots show an example tenant's permission and connection panels.
Use the numbered callouts to navigate your own environment; do not copy the
example's identities, role names, or source configuration.

These are **actual UI captures**, not recreated permission forms.
Images were cropped and irreversibly masked, then overlaid with red
rectangles, arrows where space permits, and numbered badges. Grey regions
are explicit redactions/omissions, not empty permission entries.
Numbers are local to each image. Captions explain what to configure versus
what to inspect and leave unchanged.

| Image | Callouts | Scope |
| --- | --- | --- |
| [01 Model menu](01-model-menu.png) | 1 Manage permissions; 2 Security; 3 Settings | Navigation only; not a grant |
| [02 Model Read](02-model-read.png) | 1 Direct access; 2 guest Read entries | Example guest Read grants; other principals omitted |
| [03 Report Read](03-report-read.png) | 1 Links; 2 Read | Existing report sharing link; URL and recipients masked |
| [04 Link settings](04-report-link-settings.png) | 1 Reshare/Build off; 2 named recipients | Existing link, not a new invitation or saved change |
| [05 RLS membership](05-rls-membership.png) | 1 role; 2 member-entry/Add area; 3 membership | Existing scenario-specific role; all member identities masked |
| [06 Workspace access](06-workspace-access.png) | 1 elevated roles to avoid; 2 optional Viewer | Existing roles shown for comparison; do not assign elevated roles to restricted guests |
| [07 Source mapping](07-model-cloud-connection.png) | 1 model connection section; 2 Maps to | Existing binding to a source connection; names/IDs masked |
| [08 Source identity/SSO](08-source-identity-sso.png) | 1 Workspace identity; 2 SSO off | Existing owner-approved pattern, not a universal SSO recommendation |

Permission screenshots do not prove the actual MCP caller, RLS filter
propagation, OLS enforcement, MFA policy, or licensing. Run the actual-user
acceptance checks in the [procedure](../docs/B2B-PROCEDURE.md).
RLS membership is not its filter definition; OLS must be verified in the
deployed model. Entra identity/policy/consent and trial checks remain
documented portal/CLI steps; no screenshot substitutes for those checks.

No customer records or report visual values are included. The ZIP includes
only these sanitized PNGs; original capture intermediates are excluded.
