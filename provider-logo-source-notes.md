# Provider identity asset notes

The branded card library uses compact identity icons retrieved for the official domains already stored in the launchpad catalog. The source is the site-favicon resolution endpoint for each official provider domain, with a small set of official apex-domain fallbacks for account subdomains.

The asset preparation run retrieved identity icons for 80 of 81 unique provider domains. `freedns.afraid.org` did not expose a retrievable favicon through either its resolved domain route or its default `/favicon.ico` path. Its card will use a resilient text-based provider fallback rather than an unrelated third-party image. The resource name and official FreeDNS route remain unchanged.
