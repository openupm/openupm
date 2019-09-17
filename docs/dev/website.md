# Website Development

## Styling

Vuepress comes with a handy [default theme](https://github.com/vuejs/vuepress/tree/master/packages/%40vuepress/theme-default) for documentation. However comparing with modern css frameworks, it lacks features like flexbox grid, components and so on. The website mixed [spectre](https://picturepan2.github.io/) with default theme style. The order of loading css files as below.

```
# parent theme
  parent-theme/styles/palette.styl
  parent-theme/styles/index.styl

# local theme
  theme/styles/palette.styl        # override theme palette and vars

# custom spectre
  spectre_variables.scss           # override spectre vars
  spectre.scss                     # load spectre

# local styling
  theme/styles/main.styl           # main styling

# parent component
  parent-theme/component/*.vue     # parent component styling

# component
  component/*.vue                  # local component styling
```
