module "dev" {
  source = "./modules/dev"
}

module "prod" {
  source = "./modules/prod"
}

output "dev_page_uri" {
  value = module.dev.page_uri
}

output "dev_socker_uri" {
  value = module.dev.socket_uri
}

output "prod_page_uri" {
  value = module.prod.page_uri
}

output "prod_socket_uri" {
  value = module.prod.socket_uri
}
