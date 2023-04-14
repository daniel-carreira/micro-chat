terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "4.58.0"
    }
  }
}

provider "google" {
  credentials = file(var.credentials_file)
  project 	= var.project
  region  	= var.region
  zone    	= var.zone
}

data "google_iam_policy" "admin" {
  binding {
    role = "roles/editor"
    members = [
      "user:danielcarreira7@gmail.com",
    ]
  }
}

resource "google_compute_network" "vpc_network" {
  name = "terraform-network"
}

resource "google_cloud_run_v2_service" "page" {
  name     = "client-service"
  location = "us-central1"
  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "danielcarreira/microchatpage:latest"
      env {
        name = "SOCKET_URI"
        value = google_cloud_run_v2_service.socket.uri
      }
    }
  }
}
resource "google_cloud_run_v2_service_iam_policy" "page-policy" {
  project = google_cloud_run_v2_service.page.project
  location = google_cloud_run_v2_service.page.location
  name = google_cloud_run_v2_service.page.name
  policy_data = data.google_iam_policy.admin.policy_data
}

resource "google_cloud_run_v2_service" "socket" {
  name     = "socket-service"
  location = "us-central1"
  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "danielcarreira/microchatsocket:latest"
      env {
        name = "DATABASE_URL"
        value = var.mongodb_connection_string
      }
    }
  }
}
resource "google_cloud_run_v2_service_iam_policy" "socket-policy" {
  project = google_cloud_run_v2_service.socket.project
  location = google_cloud_run_v2_service.socket.location
  name = google_cloud_run_v2_service.socket.name
  policy_data = data.google_iam_policy.admin.policy_data
}

#resource "google_storage_bucket" "bucket" {
#  name      	= var.bucket_name
#  location  	= var.bucket_location
#  force_destroy = true
#}