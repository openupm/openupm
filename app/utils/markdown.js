// Markdown util.
const cheerio = require("cheerio");
const emoji = require("node-emoji");
const marked = require("marked");
const highlightjs = require("highlight.js");
const urljoin = require("url-join");

const urlWithProtocolRe = /.*:.*/i;

// Convert GitHub URL to GitHub raw URL.
const convertToGitHubRawUrl = function(url) {
  const gitHubBlobRe = /^https?:\/\/github\.com\/.*\/.*\/blob\//i;
  if (gitHubBlobRe.test(url)) url = url.replace(/\/blob\//, "/raw/");
  return url;
};

// Get customized marked renderer.
const markedRenderer = function({
  linkBaseUrl,
  linkBaseRelativeUrl,
  imageBaseUrl,
  imageBaseRelativeUrl
}) {
  const renderer = new marked.Renderer();
  const originalRendererLink = renderer.link.bind(renderer);
  const originalRendererImage = renderer.image.bind(renderer);

  renderer.link = (href, title, text) => {
    if (href.startsWith("#")) {
      return `<a href='${href}'>${text}</a>`;
    }
    if (!urlWithProtocolRe.test(href)) {
      if (href.startsWith("/")) {
        href = urljoin(linkBaseUrl, href);
      } else {
        href = urljoin(linkBaseRelativeUrl, href);
      }
    }
    let link = originalRendererLink(href, title, text);
    link = link.replace("<a", '<a rel="noopener noreferrer"');
    return link;
  };

  renderer.image = (href, title, text) => {
    if (!urlWithProtocolRe.test(href)) {
      if (href.startsWith("/")) {
        href = urljoin(imageBaseUrl, href);
      } else {
        href = urljoin(imageBaseRelativeUrl, href);
      }
    } else {
      href = convertToGitHubRawUrl(href);
    }
    return originalRendererImage(href, title, text);
  };

  // highlightjs: https://shuheikagawa.com/blog/2015/09/21/using-highlight-js-with-marked/
  const escapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  function escapeForHTML(input) {
    return input.replace(/([&<>'"])/g, char => escapeMap[char]);
  }
  renderer.code = (code, language) => {
    // Check whether the given language is valid for highlight.js.
    const validLang = !!(language && highlightjs.getLanguage(language));

    // Highlight only if the language is valid.
    // highlight.js escapes HTML in the code, but we need to escape by ourselves
    // when we don't use it.
    const highlighted = validLang
      ? highlightjs.highlight(language, code).value
      : escapeForHTML(code);

    // Render the highlighted code with `hljs` class.
    return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
  };

  return renderer;
};

// Render markdown for the given package context.
const renderMarkdownToHtml = async function({
  pkg,
  markdown,
  disableTitleParser
}) {
  // Parse title
  if (!disableTitleParser) {
    markdown = parseTitle({ pkg, markdown });
  }
  // Parse emoji
  const replacer = match => emoji.emojify(match);
  markdown = markdown.replace(/(:.*:)/g, replacer);
  // Render markdown
  const linkBaseUrl = urljoin(pkg.repoUrl, "blob/" + pkg.readmeBranch);
  const linkBaseRelativeUrl = urljoin(pkg.repoUrl, "blob/" + pkg.readmeBase);
  const imageBaseUrl = urljoin(pkg.repoUrl, "raw/" + pkg.readmeBranch);
  const imageBaseRelativeUrl = urljoin(pkg.repoUrl, "raw/" + pkg.readmeBase);
  const renderer = markedRenderer({
    linkBaseUrl,
    linkBaseRelativeUrl,
    imageBaseUrl,
    imageBaseRelativeUrl
  });
  const html = marked.parse(markdown, { renderer });
  // post-processing
  return postProcessHtml(html, { imageBaseRelativeUrl });
};

// Parse markdown to add title line.
const parseTitle = function({ pkg, markdown }) {
  const pkgName = pkg.displayName || pkg.name;
  const titleLine = "# " + pkgName + "\n";
  if (markdown) {
    // Insert h1 if need.
    if (
      !/^# /m.test(markdown) &&
      !/^===/m.test(markdown) &&
      !/^<h1/m.test(markdown)
    ) {
      markdown = titleLine + markdown;
    }
  } else {
    // Fallback to default readme.
    markdown = `${titleLine}
${pkg.description}

See more in the [${pkg.repo}](${pkg.repoUrl}) repository.
`;
  }
  return markdown;
};

// Post-processing markdown rendered html.
const postProcessHtml = function(html, { imageBaseRelativeUrl }) {
  const $ = cheerio.load(`<div>${html}</div>`, { xmlMode: false });
  $("img").attr("src", (idx, attr) => {
    if (attr === undefined) {
      // 1x1 transparent base64 png pixel.
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=";
    }
    if (!urlWithProtocolRe.test(attr)) attr = urljoin(imageBaseRelativeUrl, attr);
    return attr;
  });
  return $.html()
    .replace("<html><head></head><body>", "")
    .replace("</body></html>", "");
};

module.exports = {
  convertToGitHubRawUrl,
  renderMarkdownToHtml,
  parseTitle,
  postProcessHtml
};
