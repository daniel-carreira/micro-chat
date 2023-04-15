variable "project" {
  default = "app"
}

variable "credentials" {
  default = "./google-key.json"
}

variable "region" {
  default = "us-central1"
}

variable "zone" {
  default = "us-central1-c"
}

variable "bucket" {
  default = "us-central1-c"
}

variable "mongodb_connection" {
  default = "mongodb://localhost:27017"
}