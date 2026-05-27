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
