
variable "project" {
}

variable "credentials_file" {
}

variable "region" {
  default = "us-central1"
}

variable "zone" {
  default = "us-central1-c"
}

variable "bucket_name" {
}

variable "bucket_location" {
  default = "US"
}

variable "mongodb_connection_string" {
  type    = string
  default = "mongodb://localhost:27017"
}