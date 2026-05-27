locals {
  pages_project_name = "${var.environment}-web-pages-${var.project_name}"

  common_tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Project     = var.project_name
  }
}
