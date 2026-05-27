# Cloudflare Pages + Terraform Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace GitHub Pages with Cloudflare Pages + Terraform, two isolated environments, tag-based promotion from preprod to production.

**Architecture:** Terraform manages Cloudflare infrastructure (Pages projects, custom domains, DNS records) with per-environment state in R2. GitHub Actions deploys: push to main → preprod (auto-tags beta), on success → production tag → prd deploy.

**Tech Stack:** Terraform 1.14+, Cloudflare provider 5.x, GitHub Actions, Wrangler, mathieudutour/github-tag-action

---

### Task 1: Terraform Foundation — terraform.tf, providers.tf, variables.tf, locals.tf

**Files:**
- Create: `infra/terraform.tf`
- Create: `infra/providers.tf`
- Create: `infra/variables.tf`
- Create: `infra/locals.tf`

- [ ] **Step 1: Create `infra/terraform.tf`**

```hcl
terraform {
  required_version = ">= 1.14"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket                      = "com-infra-tfstate-cloudflare"
    region                      = "auto"
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
    use_path_style              = true
  }
}
```

- [ ] **Step 2: Create `infra/providers.tf`**

```hcl
provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
```

- [ ] **Step 3: Create `infra/variables.tf`**

```hcl
variable "cloudflare_account_id" {
  description = "Cloudflare account identifier"
  type        = string
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token with Pages, DNS, and R2 permissions"
  type        = string
  sensitive   = true
}

variable "custom_domain" {
  description = "Custom domain for this environment (e.g. beta.algebananazzzzz.com)"
  type        = string
}

variable "environment" {
  description = "Environment name (preprod or prd)"
  type        = string

  validation {
    condition     = contains(["preprod", "prd"], var.environment)
    error_message = "Environment must be preprod or prd."
  }
}

variable "production_branch" {
  description = "Git branch that triggers production deployments for this Pages project"
  type        = string
  default     = "main"
}

variable "project_name" {
  description = "Application name used as the custom suffix in {env}-web-pages-{name}"
  type        = string
}

variable "zone_name" {
  description = "Cloudflare DNS zone name"
  type        = string
  default     = "algebananazzzzz.com"
}
```

- [ ] **Step 4: Create `infra/locals.tf`**

```hcl
locals {
  pages_project_name = "${var.environment}-web-pages-${var.project_name}"
}
```

- [ ] **Step 5: Commit**

```bash
git add infra/terraform.tf infra/providers.tf infra/variables.tf infra/locals.tf
git commit -m "feat(infra): add terraform foundation — backend, provider, variables, locals"
```

---

### Task 2: Terraform Resources — pages.tf, domains.tf, outputs.tf

**Files:**
- Create: `infra/pages.tf`
- Create: `infra/domains.tf`
- Create: `infra/outputs.tf`

- [ ] **Step 1: Create `infra/pages.tf`**

```hcl
data "cloudflare_zone" "main" {
  filter = {
    name = var.zone_name
  }
}

resource "cloudflare_pages_project" "main" {
  account_id        = var.cloudflare_account_id
  name              = local.pages_project_name
  production_branch = var.production_branch
}
```

- [ ] **Step 2: Create `infra/domains.tf`**

```hcl
resource "cloudflare_pages_domain" "main" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.main.name
  name         = var.custom_domain
}

resource "cloudflare_dns_record" "pages_cname" {
  zone_id = data.cloudflare_zone.main.id
  name    = var.custom_domain
  type    = "CNAME"
  content = "${cloudflare_pages_project.main.name}.pages.dev"
  ttl     = 1
  proxied = true
}
```

- [ ] **Step 3: Create `infra/outputs.tf`**

```hcl
output "custom_domain" {
  description = "Custom domain bound to the Pages project"
  value       = cloudflare_pages_domain.main.name
}

output "custom_domain_status" {
  description = "Status of the custom domain binding"
  value       = cloudflare_pages_domain.main.status
}

output "pages_project_name" {
  description = "Computed Pages project name ({env}-web-pages-{name})"
  value       = cloudflare_pages_project.main.name
}

output "pages_subdomain" {
  description = "The .pages.dev subdomain for this project"
  value       = cloudflare_pages_project.main.subdomain
}
```

- [ ] **Step 4: Commit**

```bash
git add infra/pages.tf infra/domains.tf infra/outputs.tf
git commit -m "feat(infra): add pages project, custom domain, and DNS resources"
```

---

### Task 3: Terraform Environment Configs

**Files:**
- Create: `infra/config/preprod.tfvars`
- Create: `infra/config/prd.tfvars`

- [ ] **Step 1: Create `infra/config/preprod.tfvars`**

```hcl
environment       = "preprod"
project_name      = "algebananazzzzz"
production_branch = "main"
custom_domain     = "beta.algebananazzzzz.com"
```

- [ ] **Step 2: Create `infra/config/prd.tfvars`**

```hcl
environment       = "prd"
project_name      = "algebananazzzzz"
production_branch = "main"
custom_domain     = "www.algebananazzzzz.com"
```

- [ ] **Step 3: Commit**

```bash
git add infra/config/preprod.tfvars infra/config/prd.tfvars
git commit -m "feat(infra): add per-environment tfvars for preprod and prd"
```

---

### Task 4: Update .gitignore for Terraform

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Append Terraform patterns to `.gitignore`**

Add to the end of `.gitignore`:

```
# Terraform
infra/.terraform/
infra/*.tfstate
infra/*.tfstate.backup
infra/*.tfplan
infra/.terraform.lock.hcl
infra/backend.hcl
```

Note: `backend.hcl` is generated at runtime in CI with secrets. `.terraform.lock.hcl` — normally committed, but since we only apply from CI with a pinned provider version (`~> 5.0`), the lock file is regenerated each run and doesn't need to be tracked.

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: add terraform patterns to .gitignore"
```

---

### Task 5: Validate Terraform

- [ ] **Step 1: Check if terraform is installed**

```bash
terraform --version
```

If not installed: `brew install terraform` (macOS).

- [ ] **Step 2: Run terraform fmt**

```bash
cd infra && terraform fmt -check -recursive
```

Expected: all files formatted correctly (exit 0). If not, run `terraform fmt -recursive` and amend the previous commit.

- [ ] **Step 3: Run terraform validate (without backend)**

```bash
cd infra && terraform init -backend=false && terraform validate
```

Expected: `Success! The configuration is valid.`

This validates syntax and schema without needing R2 credentials. The `-backend=false` flag skips backend initialization.

- [ ] **Step 4: Clean up .terraform directory**

```bash
rm -rf infra/.terraform
```

---

### Task 6: Create `1-feature-branch-ci.yml`

**Files:**
- Create: `.github/workflows/1-feature-branch-ci.yml`
- Delete: `.github/workflows/ci.yml`

- [ ] **Step 1: Delete old CI workflow**

```bash
rm .github/workflows/ci.yml
```

- [ ] **Step 2: Create `.github/workflows/1-feature-branch-ci.yml`**

```yaml
name: 1. Feature Branch CI

on:
  pull_request:
    branches: [main]

concurrency:
  group: ci-${{ github.head_ref }}
  cancel-in-progress: true

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run format:check
      - run: npm run check
      - run: npm test
      - run: npm run build
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/1-feature-branch-ci.yml
git rm .github/workflows/ci.yml
git commit -m "feat(ci): add 1-feature-branch-ci, remove old ci.yml"
```

---

### Task 7: Create `2-preprod-deploy.yml`

**Files:**
- Create: `.github/workflows/2-preprod-deploy.yml`

- [ ] **Step 1: Create `.github/workflows/2-preprod-deploy.yml`**

```yaml
name: 2. Preprod Deploy

on:
  push:
    branches: [main]

concurrency:
  group: preprod-deploy
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: preprod
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate beta tag
        id: tag
        uses: mathieudutour/github-tag-action@v6.2
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          release_branches: ""
          pre_release_branches: "main"
          append_to_pre_release_tag: "beta"
          default_bump: patch

      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run format:check
      - run: npm run check
      - run: npm test

      - name: Check for infra changes
        id: changes
        uses: dorny/paths-filter@v3
        with:
          filters: |
            infra:
              - 'infra/**'

      - name: Setup Terraform
        if: steps.changes.outputs.infra == 'true'
        uses: hashicorp/setup-terraform@v3

      - name: Terraform Init
        if: steps.changes.outputs.infra == 'true'
        working-directory: infra
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
        run: |
          cat > backend.hcl <<EOF
          key = "preprod/terraform.tfstate"
          endpoints = {
            s3 = "https://${{ secrets.CLOUDFLARE_ACCOUNT_ID }}.r2.cloudflarestorage.com"
          }
          EOF
          terraform init -backend-config=backend.hcl

      - name: Terraform Apply
        if: steps.changes.outputs.infra == 'true'
        working-directory: infra
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
        run: terraform apply -var-file=config/preprod.tfvars -var="cloudflare_api_token=${{ secrets.CLOUDFLARE_API_TOKEN }}" -var="cloudflare_account_id=${{ secrets.CLOUDFLARE_ACCOUNT_ID }}" -auto-approve

      - name: Build
        run: npm run build
        env:
          SITE_URL: https://beta.algebananazzzzz.com

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist/ --project-name=preprod-web-pages-algebananazzzzz --branch=main

      - name: Promote to production tag
        uses: actions/github-script@v7
        with:
          script: |
            const betaTag = '${{ steps.tag.outputs.new_tag }}';
            const prodTag = betaTag.replace(/-beta\.\d+$/, '');
            await github.rest.git.createRef({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: `refs/tags/${prodTag}`,
              sha: context.sha,
            });
            core.info(`Created production tag: ${prodTag}`);
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/2-preprod-deploy.yml
git commit -m "feat(ci): add 2-preprod-deploy with beta tagging and promotion"
```

---

### Task 8: Create `3-prd-deploy.yml`

**Files:**
- Create: `.github/workflows/3-prd-deploy.yml`

- [ ] **Step 1: Create `.github/workflows/3-prd-deploy.yml`**

```yaml
name: 3. Production Deploy

on:
  push:
    tags: ['v*']

concurrency:
  group: prd-deploy
  cancel-in-progress: false

jobs:
  deploy:
    if: ${{ !contains(github.ref_name, '-') }}
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3

      - name: Terraform Init
        working-directory: infra
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
        run: |
          cat > backend.hcl <<EOF
          key = "prd/terraform.tfstate"
          endpoints = {
            s3 = "https://${{ secrets.CLOUDFLARE_ACCOUNT_ID }}.r2.cloudflarestorage.com"
          }
          EOF
          terraform init -backend-config=backend.hcl

      - name: Terraform Apply
        working-directory: infra
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
        run: terraform apply -var-file=config/prd.tfvars -var="cloudflare_api_token=${{ secrets.CLOUDFLARE_API_TOKEN }}" -var="cloudflare_account_id=${{ secrets.CLOUDFLARE_ACCOUNT_ID }}" -auto-approve

      - name: Build
        run: npm run build
        env:
          SITE_URL: https://www.algebananazzzzz.com

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist/ --project-name=prd-web-pages-algebananazzzzz
```

Note: Terraform always runs on prd deploys (no `dorny/paths-filter`). Tag-based triggers make change detection complex, and `terraform apply` is idempotent — if nothing changed, it exits cleanly with "No changes."

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/3-prd-deploy.yml
git commit -m "feat(ci): add 3-prd-deploy triggered by production tags"
```

---

### Task 9: Cleanup — Delete Old Workflow, Update CLAUDE.md

**Files:**
- Delete: `.github/workflows/deploy.yml`
- Modify: `CLAUDE.md` (CI & Deployment section)

- [ ] **Step 1: Delete old deploy workflow**

```bash
git rm .github/workflows/deploy.yml
```

- [ ] **Step 2: Update CLAUDE.md CI & Deployment section**

Replace the existing `## CI & Deployment` section in `CLAUDE.md` with:

```markdown
## CI & Deployment

Three workflows in `.github/workflows/`, plus Terraform in `infra/`:

- `1-feature-branch-ci.yml` — runs on PRs to `main`. Gates: `format:check`, `astro check`, `vitest run`, `astro build`.
- `2-preprod-deploy.yml` — runs on push to `main`. Auto-tags `vx.x.x-beta`, runs checks, optionally applies Terraform (`infra/` changes), builds with `SITE_URL=https://beta.algebananazzzzz.com`, deploys to `preprod-web-pages-algebananazzzzz`. On success, creates `vx.x.x` production tag.
- `3-prd-deploy.yml` — runs on production tags (`v*` without `-`). Applies Terraform, builds with `SITE_URL=https://www.algebananazzzzz.com`, deploys to `prd-web-pages-algebananazzzzz`.

Terraform resources live in `infra/`. Per-env config in `infra/config/preprod.tfvars` and `infra/config/prd.tfvars`. State stored in Cloudflare R2 (`com-infra-tfstate-cloudflare`) with separate keys per environment.

Secrets required in GitHub repo settings (per-environment): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`.
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git rm .github/workflows/deploy.yml
git commit -m "chore: remove old deploy.yml, update CLAUDE.md with new CI/CD docs"
```

---

### Task 10: Final Validation

- [ ] **Step 1: Verify build passes with SITE_URL**

```bash
SITE_URL=https://www.algebananazzzzz.com npm run build
```

Expected: `5 page(s) built`, exit 0.

- [ ] **Step 2: Verify all workflow files are valid YAML**

```bash
for f in .github/workflows/*.yml; do python3 -c "import yaml; yaml.safe_load(open('$f'))" && echo "$f: OK"; done
```

Expected: all three files OK.

- [ ] **Step 3: Verify terraform validates**

```bash
cd infra && terraform init -backend=false && terraform validate
```

Expected: `Success! The configuration is valid.`

- [ ] **Step 4: List final file structure**

```bash
find infra -type f | sort
```

Expected:
```
infra/config/prd.tfvars
infra/config/preprod.tfvars
infra/domains.tf
infra/locals.tf
infra/outputs.tf
infra/pages.tf
infra/providers.tf
infra/terraform.tf
infra/variables.tf
```

```bash
ls .github/workflows/
```

Expected:
```
1-feature-branch-ci.yml
2-preprod-deploy.yml
3-prd-deploy.yml
```
