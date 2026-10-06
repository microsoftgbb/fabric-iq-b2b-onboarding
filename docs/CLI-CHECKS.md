# Read-only Azure CLI checks for the B2B procedure

These commands use supported Microsoft Graph, Power BI, and ARM endpoints
through `az rest`. They do not invite users, grant access, edit RLS, resize
capacity, or authenticate native MCP. Run one block at a time and inspect
errors. No command prints a bearer token.

Requirements: Azure CLI, `jq`, and an **already authorized operator account**
in the resource tenant. API-specific delegated permissions and roles must
already be present. A 403/unsupported query is a blocked diagnostic, not
evidence of no access. Use the portal fallback instead of elevating the
guest or granting new consent merely to run these checks.

Azure CLI's session is independent of native Copilot OAuth. Administrator
metadata and consent reads do not prove the guest's actual query identity.
Do not turn these examples into a token bridge or impersonation workflow.

## 1. Set your environment and verify the operator's directory

All values below are placeholders. Replace them before use. If a sign-in
is necessary, use your organization's approved `az login --tenant <ID>`
process; this may change the shared Azure CLI context.

```sh
RESOURCE_TENANT_ID='<resource-tenant-guid>'
WORKSPACE_ID='<workspace-guid>'
REPORT_ID='<report-guid>'
MODEL_ID='<linked-semantic-model-guid>'
GUEST_OBJECT_ID='<resource-tenant-guest-object-guid>'

az account show --query '{tenantId:tenantId,operator:user.name}' -o json
test "$(az account show --query tenantId -o tsv)" = "$RESOURCE_TENANT_ID" ||
  { printf '%s\n' 'Wrong Azure CLI tenant; stop.' >&2; return 1 2>/dev/null || exit 1; }
```

The directory check is a preflight, not decoded per-request identity/scope
proof. Do not change a subscription default merely to query Power BI.

## 2. Confirm the resource-tenant guest

Requires Graph permission to read the target user (for example, appropriately
authorized `User.Read.All`; not a permission needed by the consuming guest).

```sh
az rest --method GET --resource https://graph.microsoft.com \
  --url "https://graph.microsoft.com/v1.0/users/${GUEST_OBJECT_ID}?\$select=id,userPrincipalName,userType,accountEnabled,externalUserState,mail" \
  -o json
```

Expected: exact object ID, `userType: Guest`, `accountEnabled: true`,
and `externalUserState: Accepted` for an invitation-created guest.
If properties are absent, investigate their applicability; do not infer
acceptance from a missing field.

## 3. Verify the report's linked semantic model

Requires the operator's appropriate report access and delegated API scope.

```sh
az rest --method GET --resource https://analysis.windows.net/powerbi/api \
  --url "https://api.powerbi.com/v1.0/myorg/groups/${WORKSPACE_ID}/reports/${REPORT_ID}" \
  --query '{id:id,name:name,datasetId:datasetId,webUrl:webUrl}' -o json
```

Compare `datasetId` to `MODEL_ID`. Stop if they differ.
This is owner metadata, not proof of guest execution.

## 4. Inspect report and model grants (optionally)

These **admin** endpoints require a Fabric administrator with delegated
`Tenant.Read.All` or `Tenant.ReadWrite.All`. They are not normal guest calls.
If unavailable, use report/model **Manage permissions** in the portal.
Do not assign an administrator role to the guest.

Filter by `graphId` rather than a potentially ambiguous display name:

```sh
set -o pipefail
az rest --method GET --resource https://analysis.windows.net/powerbi/api \
  --url "https://api.powerbi.com/v1.0/myorg/admin/reports/${REPORT_ID}/users" -o json |
  jq --arg guest "$GUEST_OBJECT_ID" \
    '{directGuestEntries: [.value[] | select(.graphId == $guest) |
      {graphId, principalType, reportUserAccessRight}],
      groupEntriesToReview: [.value[] | select(.principalType == "Group") |
      {graphId, identifier, reportUserAccessRight}]}'

az rest --method GET --resource https://analysis.windows.net/powerbi/api \
  --url "https://api.powerbi.com/v1.0/myorg/admin/datasets/${MODEL_ID}/users" -o json |
  jq --arg guest "$GUEST_OBJECT_ID" \
    '{directGuestEntries: [.value[] | select(.graphId == $guest) |
      {graphId, principalType, datasetUserAccessRight}],
      groupEntriesToReview: [.value[] | select(.principalType == "Group") |
      {graphId, identifier, datasetUserAccessRight}]}'
```

Direct entries should be plain `Read` for this procedure. Inspect **all**
matching entries, not only the first. `Explore` corresponds to Build.
Empty matches are inconclusive: review link, app, group, and workspace
inheritance. These APIs are not a complete transitive effective-access
calculator, and they do not return RLS role definitions/membership.

## 5. Check licenses assigned by the resource tenant

Requires existing Graph authorization for license details (for example,
`LicenseAssignment.Read.All`) and an appropriate operator role.

```sh
az rest --method GET --resource https://graph.microsoft.com \
  --url "https://graph.microsoft.com/v1.0/users/${GUEST_OBJECT_ID}/licenseDetails?\$select=skuPartNumber,servicePlans" \
  --query 'value[].{sku:skuPartNumber,plans:servicePlans[].{name:servicePlanName,status:provisioningStatus}}' \
  -o json
```

An empty list only describes licenses assigned to this object in this
tenant. It does **not** rule out a home-tenant license or in-product trial.
Use the guest's Power BI profile and trial dialog as described in the
[procedure](B2B-PROCEDURE.md#8-establish-effective-licensing-then-test-browser-access).
Home-tenant administrative inspection requires separate authorization.

## 6. Inspect native-client consent (optionally)

Identify the native client's application ID in the resource tenant's current
consent or sign-in records. Do not assume the display name or application ID
is identical across clients.

With already authorized Graph application/grant-read permissions:

```sh
NATIVE_CLIENT_APP_ID='<actual-native-client-application-guid>'
az rest --method GET --resource https://graph.microsoft.com \
  --url "https://graph.microsoft.com/v1.0/servicePrincipals?\$filter=appId%20eq%20'${NATIVE_CLIENT_APP_ID}'&\$select=id,appId,displayName" \
  -o json

az rest --method GET --resource https://graph.microsoft.com \
  --url "https://graph.microsoft.com/v1.0/servicePrincipals?\$filter=appId%20eq%20'00000009-0000-0000-c000-000000000000'&\$select=id,appId,displayName" \
  -o json
```

Copy the **resource-tenant service principal object IDs** from the returned
entries, not the app IDs:

```sh
NATIVE_CLIENT_SP_ID='<native-client-service-principal-object-guid>'
POWERBI_SP_ID='<power-bi-service-principal-object-guid>'
az rest --method GET --resource https://graph.microsoft.com \
  --url "https://graph.microsoft.com/v1.0/oauth2PermissionGrants?\$filter=clientId%20eq%20'${NATIVE_CLIENT_SP_ID}'%20and%20resourceId%20eq%20'${POWERBI_SP_ID}'&\$select=consentType,principalId,scope&\$top=100" \
  -o json
```

Review a `Principal` grant for the exact guest object, or an applicable
`AllPrincipals` grant. Check `Item.Read.All`, `Item.Execute.All`,
`Dataset.Read.All`. Check `@odata.nextLink` before declaring a collection
complete; follow it with another authorized `az rest` GET if needed.

This checks stored grants, **not the scopes of the runtime MCP token**.
An absent grant is inconclusive; ask the tenant administrator to review the
applicable consent policy. Do not POST new grants or inspect tokens to force
a result.

## 7. Read bounded sign-in evidence after a failure (optionally)

Requires existing `AuditLog.Read.All`, an authorized sign-in-reader role,
and applicable tenant licensing. Set an explicit recent UTC time window
around the attempted sign-in. Never export the tenant's whole sign-in log.

```sh
SINCE_UTC='<YYYY-MM-DDTHH:MM:SSZ>'
UNTIL_UTC='<YYYY-MM-DDTHH:MM:SSZ>'
az rest --method GET --resource https://graph.microsoft.com \
  --url "https://graph.microsoft.com/beta/auditLogs/signIns?\$filter=userId%20eq%20'${GUEST_OBJECT_ID}'%20and%20createdDateTime%20ge%20${SINCE_UTC}%20and%20createdDateTime%20le%20${UNTIL_UTC}&\$select=createdDateTime,userId,appId,resourceDisplayName,homeTenantId,resourceTenantId,crossTenantAccessType,status,conditionalAccessStatus,correlationId&\$top=20" \
  -o json
```

This optional diagnostic uses Graph **beta**, whose query support can vary.
If rejected, use **Entra > Monitoring & health > Sign-in logs**; do not
silently remove fields and claim an equivalent check succeeded.
For the event matching the current native client, inspect home/resource
tenant IDs, guest object, resource **Power BI Service**, status, and time.
Follow pagination if it affects the selected window and record ingestion
delay. No event yet does not mean no authentication occurred.

Error `50074` indicates that strong authentication was required; it does not
identify the enforcing policy by itself. Review the matching event's policy
details with the identity administrator. A sign-in event does not prove the
caller or scopes used by a later MCP request.

## 8. Check capacity without changing it (optional)

Use the ARM ID copied from actual resource discovery. Requires existing
Azure read access for the operator, **not the guest**:

```sh
CAPACITY_ARM_ID='<actual-full-capacity-ARM-resource-ID>'
az rest --method GET \
  --url "https://management.azure.com${CAPACITY_ARM_ID}?api-version=2023-11-01" \
  --query '{id:id,sku:sku.name,state:properties.state,provisioningState:properties.provisioningState}' \
  -o json
```

Recheck the report/model workspaces' capacity bindings in the service.
A successful capacity GET alone does not prove the intended workspace
uses it. Do not run PATCH, resize, or resume operations during onboarding.

## What these commands intentionally do not automate

| Operation | Supported route in this procedure |
| --- | --- |
| Invitation and redemption | Entra approved invitation workflow plus actual user redemption |
| Specific-person report sharing | Owner's Power BI Share/Manage permissions UI |
| Semantic model Read | Model owner's Manage permissions UI |
| RLS membership | Model Security UI |
| RLS/OLS definition changes | Separately reviewed model deployment with supported tooling |
| Source connection/SSO changes | Model/connection owner's separately approved configuration |
| Native OAuth and MFA | Copilot-managed browser flow and actual user's interaction |
| Actual caller and security proof | Fresh native MCP ExecuteQuery under the guest |

Do not use undocumented browser endpoints to automate these gaps.
Azure CLI can verify substantial metadata, but it cannot replace native
delegated authentication or prove RLS as the guest from an administrator
session.

## API references

- [Graph: Get user](https://learn.microsoft.com/en-us/graph/api/user-get)
- [Graph: List license details](https://learn.microsoft.com/en-us/graph/api/user-list-licensedetails)
- [Graph: List delegated grants](https://learn.microsoft.com/en-us/graph/api/oauth2permissiongrant-list)
- [Graph beta: List sign-ins](https://learn.microsoft.com/en-us/graph/api/signin-list?view=graph-rest-beta)
- [Power BI: Get report in group](https://learn.microsoft.com/en-us/rest/api/power-bi/reports/get-report-in-group)
- [Power BI admin: Report users](https://learn.microsoft.com/en-us/rest/api/power-bi/admin/reports-get-report-users-as-admin)
- [Power BI admin: Dataset users](https://learn.microsoft.com/en-us/rest/api/power-bi/admin/datasets-get-dataset-users-as-admin)
