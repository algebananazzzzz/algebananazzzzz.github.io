# Cloudflare Pages + Terraform Deployment Design

## Goal

Replace GitHub Pages deployment with Cloudflare Pages, managed by Terraform. Two fully isolated environments with separate Pages projects, custom domains, and per-environment Terraform state. Tag-based promotion from preprod to production. CI/CD via GitHub Actions.

## Naming Convention

All Cloudflare resources follow `{env}-{tier}-{object}-{custom}`:

| Resource            | Preprod                              | Production                       |
|---------------------|--------------------------------------|----------------------------------|
| Pages project       | `preprod-web-pages-algebananazzzzz`  | `prd-web-pages-algebananazzzzz`  |
| R2 tfstate bucket   | `com-infra-tfstate-cloudflare` (shared across envs)                     |

## Environments

| Environment | Pages Project                        | Custom Domain              | GitHub Environment |
|-------------|--------------------------------------|----------------------------|--------------------|
| Preprod     | `preprod-web-pages-algebananazzzzz`  | `beta.algebananazzzzz.com` | `preprod`          |
| Production  | `prd-web-pages-algebananazzzzz`      | `www.algebananazzzzz.com`  | `production`       |

Both environments deploy from `main`. There is no long-lived `beta` branch.

## Deployment Flow

```
push to main
  → 2-preprod-deploy.yml
    1. auto-generate vx.x.x-beta tag (mathieudutour/github-tag-action)
    2. checks: format, astro check, test
    3. terraform apply (if infra/ changed) with preprod.tfvars
    4. build (SITE_URL=https://beta.algebananazzzzz.com)
    5. wrangler deploy to preprod-web-pages-algebananazzzzz
    6. on success: create vx.x.x tag (strip -beta suffix)

vx.x.x tag created (no -beta)
  → 3-prd-deploy.yml
    1. terraform apply (if infra/ changed) with prd.tfvars
    2. build (SITE_URL=https://www.algebananazzzzz.com)
    3. wrangler deploy to prd-web-pages-algebananazzzzz
```

## Versioning

Uses `mathieudutour/github-tag-action` to auto-generate semver tags based on conventional commits:

- `fix:` → patch bump (v1.0.0 → v1.0.1)
- `feat:` → minor bump (v1.0.0 → v1.1.0)
- `BREAKING CHANGE:` or `feat!:` → major bump (v1.0.0 → v2.0.0)
- Default (no signal): patch bump

Preprod creates `vx.x.x-beta` tag at the start of its run. On successful preprod deploy, it strips the `-beta` suffix and creates the `vx.x.x` production tag, which triggers the prd deploy workflow.

## GitHub Actions Workflows

### `1-feature-branch-ci.yml`

- **Trigger:** PR to `main`
- **Steps:** format:check, astro check, vitest run, astro build
- **No deployment.**

### `2-preprod-deploy.yml`

- **Trigger:** push to `main`
- **GitHub environment:** `preprod`
- **Steps:**
  1. Checkout
  2. `mathieudutour/github-tag-action` — create `vx.x.x-beta` tag
  3. Setup Node, `npm ci`
  4. Run checks (format:check, astro check, vitest run)
  5. Detect if `infra/` changed (`dorny/paths-filter`)
  6. If infra changed: `terraform init` (preprod backend config), `terraform apply -var-file=config/preprod.tfvars -auto-approve`
  7. Build with `SITE_URL=https://beta.algebananazzzzz.com`
  8. `wrangler pages deploy dist/ --project-name=preprod-web-pages-algebananazzzzz`
  9. On success: create `vx.x.x` tag (production promotion)

### `3-prd-deploy.yml`

- **Trigger:** push tags matching `v*`, filtered to exclude `-beta` tags (`if: "!contains(github.ref_name, '-')"`)
- **GitHub environment:** `production`
- **Steps:**
  1. Checkout at the tag ref
  2. Setup Node, `npm ci`
  3. Detect if `infra/` changed (compare tag vs previous release tag)
  4. If infra changed: `terraform init` (prd backend config), `terraform apply -var-file=config/prd.tfvars -auto-approve`
  5. Build with `SITE_URL=https://www.algebananazzzzz.com`
  6. `wrangler pages deploy dist/ --project-name=prd-web-pages-algebananazzzzz`

## Terraform

### Directory structure

```
infra/
  main.tf          # terraform block, provider, backend (partial config)
  pages.tf         # cloudflare_pages_project
  domains.tf       # cloudflare_pages_domain + cloudflare_dns_record
  variables.tf     # all variable declarations
  outputs.tf       # project subdomain, custom domain status
  config/
    preprod.tfvars
    prd.tfvars
```

### Backend (S3-compatible via Cloudflare R2)

```hcl
terraform {
  backend "s3" {
    bucket                      = "com-infra-tfstate-cloudflare"
    region                      = "auto"
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
    # 'key' and 'endpoints.s3' provided via -backend-config at init time
  }
}
```

Each environment uses a different state key:
- Preprod: `-backend-config="key=preprod/terraform.tfstate"`
- Production: `-backend-config="key=prd/terraform.tfstate"`
- Both: `-backend-config="endpoints={s3=\"https://<account_id>.r2.cloudflarestorage.com\"}"`

### Resources per environment

| Resource                   | Purpose                                              |
|----------------------------|------------------------------------------------------|
| `data.cloudflare_zone`     | Look up existing `algebananazzzzz.com` zone          |
| `cloudflare_pages_project` | Pages project for this environment                   |
| `cloudflare_pages_domain`  | Bind custom domain to the Pages project              |
| `cloudflare_dns_record`    | CNAME record pointing custom domain to Pages project |

### Variables

```hcl
variable "cloudflare_account_id" {
  type = string
}

variable "zone_name" {
  type    = string
  default = "algebananazzzzz.com"
}

variable "environment" {
  type        = string
  description = "Environment name (preprod or prd)"
}

variable "project_name" {
  type        = string
  description = "Application name — the custom suffix in {env}-web-pages-{name}"
}

variable "production_branch" {
  type    = string
  default = "main"
}

variable "custom_domain" {
  type        = string
  description = "Custom domain for this environment, e.g. beta.algebananazzzzz.com"
}
```

### tfvars

**`config/preprod.tfvars`:**
```hcl
environment       = "preprod"
project_name      = "algebananazzzzz"
production_branch = "main"
custom_domain     = "beta.algebananazzzzz.com"
```

**`config/prd.tfvars`:**
```hcl
environment       = "prd"
project_name      = "algebananazzzzz"
production_branch = "main"
custom_domain     = "www.algebananazzzzz.com"
```

The full Pages project name is computed in `locals.tf` as `${var.environment}-web-pages-${var.project_name}`, enforcing the naming convention in code.

## Secrets

Stored as GitHub Actions secrets, scoped per GitHub environment:

| Secret                  | Scope     | Used by              |
|-------------------------|-----------|----------------------|
| `CLOUDFLARE_API_TOKEN`  | Both envs | Terraform + Wrangler |
| `CLOUDFLARE_ACCOUNT_ID` | Both envs | Terraform + Wrangler |
| `R2_ACCESS_KEY_ID`      | Both envs | TF backend auth      |
| `R2_SECRET_ACCESS_KEY`  | Both envs | TF backend auth      |

The Cloudflare API token needs permissions: Pages Read/Write, DNS Read/Write, Workers R2 Storage Write.

## Bootstrap (one-time manual steps)

1. Create R2 bucket: `wrangler r2 bucket create com-infra-tfstate-cloudflare`
2. Create R2 API token in Cloudflare dashboard (generates access key ID + secret)
3. Create Cloudflare API token with Pages + DNS + R2 permissions
4. Add secrets to GitHub repo environments (`preprod` and `production`)
5. Run `terraform init` + `terraform apply` locally for each env to create initial resources

## Astro config change

`astro.config.mjs` reads `SITE_URL` env var for correct sitemap/canonical URLs:

```js
site: process.env.SITE_URL || 'https://www.algebananazzzzz.com',
```

## What this replaces

- `deploy.yml` (GitHub Pages deployment) is deleted
- `site` hardcoded to `algebananazzzzz.github.io` in `astro.config.mjs` is replaced with env-var-driven URL
