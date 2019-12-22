# Website Development

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
## Styling

Vuepress comes with a handy [default theme](https://github.com/vuejs/vuepress/tree/master/packages/%40vuepress/theme-default) for documentation. However comparing with modern css frameworks, it lacks features like flexbox grid, components and so on. The website mixed [spectre](https://picturepan2.github.io/) with default theme style. The order of loading css files as below.

```
↑ component styling
  [components|layouts]/*.vue

↑ parent theme
  parent-theme/styles/index.styl
  parent-theme/styles/palette.styl

↑ local theme
  theme/styles/index.styl
  theme/styles/palette.styl

↑ custom spectre
  spectre.scss
```

Notice: due a known css order bug of vuepress [issue #1885](https://github.com/vuejs/vuepress/issues/1885). The order or component styling and theme styling can be messy.
