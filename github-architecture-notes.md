# THE ARZENS GitHub-Owned Launchpad — Architecture Evidence

## Official source findings

- GitHub Apps start with no permissions. GitHub recommends selecting only the minimum permissions required. Repository permissions are scoped to repositories selected at installation; the **Contents** repository permission supports HTTP Git access and repository content updates. Source: [Choosing permissions for a GitHub App](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app).
- GitHub’s Repository Contents REST API can create, modify, and delete Base64-encoded file content. This supports a dashboard committing an edited catalog file into the user-owned repository. Source: [REST API endpoints for repository contents](https://docs.github.com/en/rest/repos/contents).
- GitHub Pages can publish from a branch or GitHub Actions. GitHub cautions that a Pages site may be publicly accessible even when its source repository is private, subject to plan and organization settings; secrets must never be included in the repository. Source: [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Chosen security boundary

1. The code and curated resource catalog are owned by the user in one private GitHub repository.
2. The public Launchpad remains a static site; GitHub Actions can build and publish a safe production artifact once GitHub Pages eligibility is confirmed.
3. The protected admin dashboard must use a server-side backend for the GitHub App private key and installation token. These secrets will never be committed to GitHub or sent to the browser.
4. The GitHub App will be installed on the Launchpad repository only, with repository Contents read/write permission and no organization, account, webhook, or Actions permissions unless a later requirement demonstrably needs them.
5. Dashboard changes update one structured catalog file, validate required fields and direct official URLs, then create a descriptive Git commit. Public changes remain reviewable and reversible through Git history.
