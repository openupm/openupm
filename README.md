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

Use [https://github.com/bee-queue/bee-queue](bee-queue) as job queue.

Job id format: `[job_type]:[main_id]` or `[job_type]:[main_id]:[sub_id]`

| job_type | main_id    | sub_id   | job id example | comment                                     |
|----------|------------|----------|----------------|---------------------------------------------|
| proj     | project_id |          | proj:1         | Fetch project info, then generate sub-jobs. |
| pkg      | package_id | 20190301 | pkg:1:20190301 | Build package for nightly release.          |
| pkg      | package_id | 1.0.1    | pkg:1:1.0.1    | Build package for specific version.         |

Job data

    {
        repo_url: string,
        repo_branch: string,
        repo_branch: string,
        nightly: boolean,
    }
