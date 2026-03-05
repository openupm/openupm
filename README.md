# OpenUPM Data Repository

This repository now contains only OpenUPM curated data and the validator assets used to verify it.

## Contents

- `data/`: package and metadata YAML files
- `scripts/data-validator.js`: shared validation helpers
- `test/data-packages.js`: data validation test suite

## Validate data

```bash
npm install
npm test
```

or run only the validation target:

```bash
npm run test:data
```
