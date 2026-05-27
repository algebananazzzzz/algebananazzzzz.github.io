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
  tags    = toset([for k, v in local.common_tags : "${lower(k)}:${v}"])
}
