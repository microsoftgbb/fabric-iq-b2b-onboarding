# Post-run reflection

## Review the workflow

After a multi-step workflow, recovery, or user correction, identify reusable
improvements without retaining private tenant evidence.

Silently consider:

1. Did the trigger description miss this B2B onboarding or recovery scenario?
2. Was a tool/schema/version assumption unsupported by the actual client?
3. Did the workflow confuse OAuth, MCP connection, artifact access or data proof?
4. Did an error branch encourage excessive retries or permission escalation?
5. Was evidence missing, overclaimed, secret-bearing, or too tenant-specific?
6. Did a required local reference fail to resolve in the standalone package?
7. Did a supported newer client change the setup or troubleshooting steps?

If no gap exists, finish without extra output.
For a material gap, record a concise proposed correction only if requested.
Apply changes to the skill or create/publish issues only with the user's
approval. Never attach credentials, private diagnostic logs, actual account
details or business records to a shared issue or package.

Keep observed behavior separate from inference. Do not generalize one user's
result into a guarantee for every tenant, client, or model.
