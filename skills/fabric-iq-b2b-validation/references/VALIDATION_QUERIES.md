# Validation queries

All placeholders must be replaced with operator-approved inputs. Use the
native client's runtime tool schema, not a custom HTTP caller. Tool prefixes
can differ; `ExecuteQuery` below means the discovered Fabric IQ tool.

## Identity first

On the actual intended semantic model:

```text
ExecuteQuery(
  artifactId = "<MODEL_ID>",
  daxQueries = [
    "EVALUATE ROW(\"Marker\", \"<FRESH_UNIQUE_MARKER>\",
      \"UPN\", USERPRINCIPALNAME(), \"Username\", USERNAME())"
  ],
  maxRows = 1
)
```

That is a conceptual tool invocation. Supply the DAX string in the actual
runtime argument format. It is schema-independent and reads no business rows.

Accept only a raw response that:

1. Comes from a new native tool call on the requested model.
2. Contains the newly requested marker and exactly the bounded identity row.
3. Matches the expected guest UPN or explicitly approved identity alias.

Some environments render a home UPN and others a host `#EXT#` representation.
Do not invent equivalence; have the operator confirm allowed aliases.
`USEROBJECTID()` is not required. If its returned representation is unexpected,
record the discrepancy instead of treating an email as a certified Entra GUID.
These DAX functions do not independently certify OAuth token claims.

Do not retrieve business data on a mismatched identity. A successful candidate
model check must be repeated on the actual requested model.

## Bounded security probes

Obtain the expected policy from an authorized owner. Confirm the actual table,
column, category and relationship names; the skill's illustrative schema is
not a schema to impose on another tenant.
Escape actual DAX identifiers and string literals correctly; do not blindly
substitute arbitrary text into these templates.

Inspect the model schema in the guest context before custom business DAX.
For report-derived questions, first inspect the actual report metadata.
Record ordinary report/page/visual filters. The probes below intentionally
test security independently of ordinary query filters; disclose that scope.
They do not change the report or bypass RLS/OLS.

Use fresh markers, returned UPN, `maxRows: 1` and small aggregates.
Examples show one expected UPN; extend the guard only with approved aliases.

### Allowed data

The owner must know that this table contains permitted data in the chosen
scope. Positive counts are not required when the legitimate expected result
is empty; record the baseline limitation instead.

```dax
EVALUATE
ROW(
    "Marker", "<FRESH_POSITIVE_MARKER>",
    "UPN", USERPRINCIPALNAME(),
    "AllowedRows",
        IF(
            USERPRINCIPALNAME() = "<EXPECTED_UPN>",
            COALESCE(COUNTROWS('<ALLOWED_FACT_TABLE>'), 0),
            BLANK()
        )
)
```

Compare to an approved baseline only if it has the same model, filters and
data snapshot. An admin result is a comparison baseline, never guest proof.

### Forbidden category

Apply the owner's forbidden category to the appropriate secured dimension.
Repeat for each fact path where the model's security is supposed to propagate.
One table's zero count does not prove security on unrelated fact tables.

```dax
EVALUATE
ROW(
    "Marker", "<FRESH_NEGATIVE_MARKER>",
    "UPN", USERPRINCIPALNAME(),
    "ForbiddenFactRows",
        IF(
            USERPRINCIPALNAME() = "<EXPECTED_UPN>",
            COALESCE(
                CALCULATE(
                    COUNTROWS('<FACT_TABLE>'),
                    REMOVEFILTERS(),
                    FILTER(
                        ALL('<SECURED_DIMENSION>'),
                        '<SECURED_DIMENSION>'[<CATEGORY_COLUMN>]
                            = "<FORBIDDEN_CATEGORY>"
                    )
                ),
                0
            ),
            BLANK()
        )
)
```

Confirm the relationship path and that the forbidden category actually exists
in the owner's baseline. `ALL`/`REMOVEFILTERS` remove ordinary filters, not
security filters. A zero for a nonexistent category proves little.
For numeric or other non-text categories, adapt the literal using the schema.

### Denied shared table

Use this only for a table the owner explicitly intends to deny completely.
Do not impose blanket table denial on a different model design.

```dax
EVALUATE
ROW(
    "Marker", "<FRESH_SHARED_TABLE_MARKER>",
    "UPN", USERPRINCIPALNAME(),
    "Rows",
        IF(
            USERPRINCIPALNAME() = "<EXPECTED_UPN>",
            COALESCE(
                CALCULATE(
                    COUNTROWS('<DENIED_TABLE>'),
                    REMOVEFILTERS()
                ),
                0
            ),
            BLANK()
        )
)
```

Use one request/query per table when isolating errors. Prefer serial execution
for a diagnostic suite so an unexpected result can stop further probes;
do not create a large concurrent query burst.

`COALESCE(COUNTROWS(...), 0)` expresses a legitimate empty count as zero.
It must never be used to replace a tool error, parse error or missing response.

### Numeric OLS exclusion

An owner must confirm that the column exists, is numeric, and is intentionally
hidden from this caller. Inspect only the guest's exposed schema; do not query
with an administrator to manufacture the guest result.

```dax
EVALUATE
ROW(
    "UPN", USERPRINCIPALNAME(),
    "DeniedNumeric",
        IF(
            USERPRINCIPALNAME() = "<EXPECTED_UPN>",
            SUM('<TABLE>'[<PROTECTED_NUMERIC_COLUMN>]),
            BLANK()
        )
)
```

Run each protected column in a separate request. Capture exact native errors:
a confirmed hidden column may be reported as not found/not usable.
That is an expected negative result, not proof that any misspelled field is
secure. An error before evaluation will not return the UPN row; anchor it to
the verified guest session and successful identity checks surrounding the suite.

Stop if a protected numeric result or any forbidden count is returned.
Do not retry through another measure, API, identity or permission grant.

## Read the actual payload

A multi-query tool call can deliver two successful results plus an error for
the third query while the client records overall tool transport success.
Inspect every returned table/error. If the response shape is unclear, preserve
the exact sanitized result and mark the affected probe inconclusive.

Model/source errors such as missing references or duplicate relationship keys
are not successful zero-row security results. They can limit certification
even when identity, other RLS paths and OLS probes succeed.

## Natural-language prompts

Identity:

```text
Use only native FabricIQ tools. On my selected semantic model, run a fresh
one-row query returning a unique marker, USERPRINCIPALNAME() and USERNAME().
Return the actual tool response. Do not query business records or change
configuration, authentication or permissions.
```

Owner-approved security checks:

```text
Using the verified guest session and my supplied security expectations,
check one permitted aggregate, each forbidden fact path, each denied table,
and each confirmed numeric OLS exclusion. Return per-probe outcomes.
Do not disguise errors as zeros or use alternate identities/transports.
```

Cold restart:

```text
Use only native FabricIQ ExecuteQuery on the actual target model. Return
a new unique identity marker, USERPRINCIPALNAME() and USERNAME(), maxRows 1.
No cached replies, business records, authentication retries or other queries.
```
