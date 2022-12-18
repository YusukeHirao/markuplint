# Ignoring code

## Ignoring file

Use [`excludeFiles`](/configuration/properties#excludefiles) property on the configuration.

## Disable rules

### Disable by selector

Use [`nodeRules`](/configuration/properties#noderules) or [`childNodeRules`](/configuration/properties#childnoderules) property on the configuration.
See [Applying to some](./applying-rules/#applying-to-some).

```json
{
  "rules": {
    "any-rule": true
  },
  "nodeRules": [
    {
      "selector": ".ignore",
      "rules": {
        "any-rule": false
      }
    }
  ]
}
```

### Overriding to disable rules

Use [`overrides`](/configuration/properties#overrides) property on the configuration.

```json
{
  "rules": {
    "any-rule": true
  },
  "overrides": {
    "./path/to/**/*": {
      "rules": {
        "any-rule": false
      }
    }
  }
}
```