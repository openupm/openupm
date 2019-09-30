// Util

const marked = require("marked");
const urljoin = require("url-join");

export default {
  // Get customized marked renderer
  markedRenderer: function(option) {
    const renderer = new marked.Renderer();
    const originalRendererLink = renderer.link.bind(renderer);
    const originalRendererImage = renderer.image.bind(renderer);
    const httpRe = /^https?:\/\//i;

    renderer.link = (href, title, text) => {
      if (option.linkBaseUrl && !httpRe.test(href)) {
        href = urljoin(option.linkBaseUrl, href);
      }
      let link = originalRendererLink(href, title, text);
      link = link.replace("<a", '<a target="_blank" rel="noopener noreferrer"');
      return link;
    };

    renderer.image = (href, title, text) => {
      if (option.imageBaseUrl && !httpRe.test(href)) {
        href = urljoin(option.imageBaseUrl, href);
      }
      return originalRendererImage(href, title, text);
    };

    return renderer;
  }
};
