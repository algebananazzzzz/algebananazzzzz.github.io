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
