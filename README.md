# semantic_scraper

Clone this repo, then load unpacked, then:

1) chrome://extensions
2) enable Developer mode
3) Load unpacked
4) Open the service worker logs by clicking the Inspect view link (important to validate what's going on)
5) Save some content. Download. Click clear when you're done to reset internal state.

## Collect & Crawl

Clear Data, click Collect & Crawl, then sit back and watch.

By default we don't cross domain boundaries, HOWEVER, in the case of redirects we may end up on an unintended site. Therefore, it is highly recommended to use the Link Inclusion Pattern regex, e.g.
`https://chamomile\.ai/.*`.

For extra protection, add specific URLs to exclude, e.g. those that are known to redirect.
