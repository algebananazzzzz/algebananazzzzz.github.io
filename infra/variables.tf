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
