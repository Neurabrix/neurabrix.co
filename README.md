# neurabrix.co redirect

This branch is the GitHub Pages publishing source for `neurabrix.co` and
`www.neurabrix.co`. It sends browser traffic to the equivalent path on
`https://neurabrix.com` while preserving query strings and fragments.

The canonical production website source remains in the private
`Neurabrix/neurabrix.com` repository. The legacy built-site history remains on
the `main` branch of this repository.

## Rollback

Change the GitHub Pages publishing source back to `main` at `/`, then trigger a
new Pages build. No DNS rollback is required because this redirect does not
change DNS records.
