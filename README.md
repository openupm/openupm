# OpenUPM

Open source UPM registry for Unity

(under development)

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
- Job id: `[job_type]:[main_id]`
- Job payload: json object

| job id              | job payload |
|---------------------|-------------|
| `proj:[project_id]` | `{}`        |
| `rel:[release_id]`  | `{}`        |
