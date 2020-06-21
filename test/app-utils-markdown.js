/* eslint-disable no-undef */
const assert = require("assert");
// eslint-disable-next-line no-unused-vars
const should = require("should");

const {
  convertToGitHubRawUrl,
  renderMarkdownToHtml,
  preProgressMarkdown,
  postProgressMarkdownHtml
} = require("../app/utils/markdown");
const { loadPackageSync } = require("../app/utils/package");

describe("app/util/markdown.js", function() {
  describe("convertToGitHubRawUrl()", function() {
    it("non-GitHub URL", function() {
      assert.equal(
        convertToGitHubRawUrl("https://example.com"),
        "https://example.com"
      );
    });
    it("GitHub URL", function() {
      assert.equal(
        convertToGitHubRawUrl(
          "https://github.com/openupm/openupm/blob/master/package.json"
        ),
        "https://github.com/openupm/openupm/raw/master/package.json"
      );
    });
    it("GitHub URL + branch", function() {
      assert.equal(
        convertToGitHubRawUrl(
          "https://github.com/openupm/openupm/blob/upm/package.json"
        ),
        "https://github.com/openupm/openupm/raw/upm/package.json"
      );
    });
  });

  describe("preProgressMarkdown()", function() {
    it("with h1", function() {
      const pkg = loadPackageSync("com.littlebigfun.addressable-importer");
      assert.equal(
        preProgressMarkdown({ pkg, markdown: "# title" }),
        "# title"
      );
    });
    it("with h1 alternative", function() {
      const pkg = loadPackageSync("com.littlebigfun.addressable-importer");
      assert.equal(
        preProgressMarkdown({ pkg, markdown: "title\n=====" }),
        "title\n====="
      );
    });
    it("with h1 html", function() {
      const pkg = loadPackageSync("com.littlebigfun.addressable-importer");
      assert.equal(
        preProgressMarkdown({ pkg, markdown: "<h1>title</h1>" }),
        "<h1>title</h1>"
      );
    });
    it("without h1", function() {
      const pkg = loadPackageSync("com.littlebigfun.addressable-importer");
      pkg.name = "title";
      pkg.displayName = "Title";
      pkg.description = "description";
      assert.equal(
        preProgressMarkdown({ pkg, markdown: "" }),
        "# Title\n\ndescription\n\nSee more in the [favoyang/unity-addressable-importer](https://github.com/favoyang/unity-addressable-importer) repository.\n"
      );
    });
  });

  describe("postProgressMarkdownHtml()", function() {
    it("img tag without src", function() {
      assert.equal(
        postProgressMarkdownHtml("<img />", { imageBaseRelativeUrl: "/" }),
        '<div><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="/></div>'
      );
    });
    it("img tag with absolute src path", function() {
      assert.equal(
        postProgressMarkdownHtml("<img src='https://example.com/test.png'/>", {
          imageBaseRelativeUrl: "/"
        }),
        '<div><img src="https://example.com/test.png"/></div>'
      );
    });
    it("img tag with relative path", function() {
      assert.equal(
        postProgressMarkdownHtml("<img src='/img/test.png'/>", {
          imageBaseRelativeUrl: "https://example.com"
        }),
        '<div><img src="https://example.com/img/test.png"/></div>'
      );
    });
  });

  describe("renderMarkdownToHtml()", function() {
    it("markdown", async function() {
      const markdown = "# title";
      const pkg = loadPackageSync("com.littlebigfun.addressable-importer");
      const html = await renderMarkdownToHtml({
        pkg,
        markdown,
        disablePreProgress: true
      });
      assert.equal(html, '<div><h1 id="title">title</h1>\n</div>');
    });
    it("mixed with html", async function() {
      const markdown = "<h1>title</h1>";
      const pkg = loadPackageSync("com.littlebigfun.addressable-importer");
      const html = await renderMarkdownToHtml({
        pkg,
        markdown,
        disablePreProgress: true
      });
      assert.equal(html, "<div><h1>title</h1></div>");
    });
    it("relative link", async function() {
      const markdown = "[link](path-1)";
      const pkg = loadPackageSync("com.littlebigfun.addressable-importer");
      const html = await renderMarkdownToHtml({
        pkg,
        markdown,
        disablePreProgress: true
      });
      assert.equal(
        html,
        '<div><p><a rel="noopener noreferrer" href="https://github.com/favoyang/unity-addressable-importer/blob/master/path-1">link</a></p>\n</div>'
      );
    });
    it("relative link with custom readme branch and path", async function() {
      const markdown = "[link](path-1)";
      const pkg = loadPackageSync("com.littlebigfun.addressable-importer");
      pkg.readme = "upm:.github/README.md";
      pkg.readmeBranch = "upm";
      pkg.readmeBase = "upm/.github";
      pkg.readmePath = ".github/README.md";
      const html = await renderMarkdownToHtml({
        pkg,
        markdown,
        disablePreProgress: true
      });
      assert.equal(
        html,
        '<div><p><a rel="noopener noreferrer" href="https://github.com/favoyang/unity-addressable-importer/blob/upm/.github/path-1">link</a></p>\n</div>'
      );
    });
    it("absolute link", async function() {
      const markdown = "[link](http://example.com)";
      const pkg = loadPackageSync("com.littlebigfun.addressable-importer");
      const html = await renderMarkdownToHtml({
        pkg,
        markdown,
        disablePreProgress: true
      });
      assert.equal(
        html,
        '<div><p><a rel="noopener noreferrer" href="http://example.com">link</a></p>\n</div>'
      );
    });
    it("img + relative path", async function() {
      const markdown = "![image](path-1.png)";
      const pkg = loadPackageSync("com.littlebigfun.addressable-importer");
      const html = await renderMarkdownToHtml({
        pkg,
        markdown,
        disablePreProgress: true
      });
      assert.equal(
        html,
        '<div><p><img src="https://github.com/favoyang/unity-addressable-importer/raw/master/path-1.png" alt="image"/></p>\n</div>'
      );
    });
    it("img + relative path with custom readme branch and path", async function() {
      const markdown = "![image](path-1.png)";
      const pkg = loadPackageSync("com.littlebigfun.addressable-importer");
      pkg.readme = "upm:.github/README.md";
      pkg.readmeBranch = "upm";
      pkg.readmeBase = "upm/.github";
      pkg.readmePath = ".github/README.md";
      const html = await renderMarkdownToHtml({
        pkg,
        markdown,
        disablePreProgress: true
      });
      assert.equal(
        html,
        '<div><p><img src="https://github.com/favoyang/unity-addressable-importer/raw/upm/.github/path-1.png" alt="image"/></p>\n</div>'
      );
    });
    it("img + absolute path", async function() {
      const markdown = "![image](http://example.com/path-1.png)";
      const pkg = loadPackageSync("com.littlebigfun.addressable-importer");
      const html = await renderMarkdownToHtml({
        pkg,
        markdown,
        disablePreProgress: true
      });
      assert.equal(
        html,
        '<div><p><img src="http://example.com/path-1.png" alt="image"/></p>\n</div>'
      );
    });
    it("code highlighting", async function() {
      const markdown = "```js\nconst x = 1;\n```";
      const pkg = loadPackageSync("com.littlebigfun.addressable-importer");
      const html = await renderMarkdownToHtml({
        pkg,
        markdown,
        disablePreProgress: true
      });
      assert.equal(
        html,
        '<div><pre><code class="hljs js"><span class="hljs-keyword">const</span> x = <span class="hljs-number">1</span>;</code></pre></div>'
      );
    });
  });
});
