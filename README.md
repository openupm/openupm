# OpenUPM

Open source UPM registry for Unity

(alpha)

## Development

```bash
yarn docs:dev
yarn server:dev
```

## Directory Structure

```
app/ - website backend
docs/ - website frontend
config/ - configurations
devops/ - devops
migrations/ - backend database migrations
fixtures/ - backend database data fixtures
scripts/ - other scripts
```

## Background Jobs

Use [bee-queue](https://github.com/bee-queue/bee-queue) as job queue.

Define a job

- Job id: `[jobType]:[key]`
- Job payload: json object

| job id                    | job payload |
| ------------------------- | ----------- |
| `build-pkg:[packageName]` | `{}`        |
| `build-rel:[releaseId]`   | `{}`        |
