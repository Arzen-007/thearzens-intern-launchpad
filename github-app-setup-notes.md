# THE ARZENS GitHub App Setup Record

The private **THE ARZENS Launchpad Catalog Manager** GitHub App is being registered under `Arzen-007` only. It has no redirect URI, no GitHub user authorization flow, no device flow, no setup URL, and no webhook. Its sole intended repository permission is **Contents: Read and write** plus GitHub's mandatory metadata read access. It must be installable only on `Arzen-007/thearzens-intern-launchpad`.

The GitHub registration form has been configured with its webhook disabled and the **Only on this account** installation target selected. All repository permission controls remain at **No access** until the single Contents control is changed to **Read and write**.

Source: GitHub App registration form for `https://github.com/settings/apps/new`, viewed during setup. The **Contents** permission row explicitly covers repository contents, commits, branches, downloads, releases, and merges; its control is currently the only permission selector that will be changed.

Verified before submission: the GitHub form now reports **1 selected, 1 mandatory** repository permission. The selected permission is **Contents — Read and write**. The required **Metadata — Read-only** access is mandatory and cannot be changed. All other repository permission rows remain **No access**.

Registration outcome: GitHub created the private App at `https://github.com/settings/apps/the-arzens-launchpad-manager` using the shortened effective name **THE ARZENS Launchpad Manager**. GitHub reports that App ID **4706835** requires a private key before installation; one private key has been generated and must remain outside the repository. The installation page at `https://github.com/apps/the-arzens-launchpad-manager/installations/new` is configured for **Only select repositories**, with GitHub reporting only metadata read access and code/contents read-write access.

Installation outcome: **THE ARZENS Launchpad Manager** is installed only on `Arzen-007/thearzens-intern-launchpad`, installation ID `156307850`. A server-side, read-only validation confirms that the credential variables exist but the current private-key value cannot be parsed as a PEM key. No GitHub API call or repository mutation was made during this failed validation, and no credential value was logged.

App identifiers and its generated private key are secrets. They must be supplied through the protected service configuration and must never be stored in this repository, browser code, screenshots, or project documentation.
