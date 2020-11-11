if (location.href.indexOf('http://localhost') === -1 && location.protocol !== 'https:') {
  location.href = window.location.href.replace('http:', 'https:');
}
