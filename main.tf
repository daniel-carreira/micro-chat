terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "4.58.0"
    }
  }
}

provider "google" {
  credentials = file("./google-key.json")
  project 	= var.project
  region  	= var.region
}

data "google_iam_policy" "public" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_v2_service" "page" {
  name     = "micro-chat-client"
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
  policy_data = data.google_iam_policy.public.policy_data
}

resource "google_cloud_run_v2_service" "socket" {
  name     = "micro-chat-socket"
  location = "us-central1"
  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "danielcarreira/microchatsocket:latest"
      env {
        name = "DATABASE_URI"
        value = var.mongodb_connection
      }
      env {
        name = "BUCKET"
        value = var.bucket
      }
    }
  }
}
resource "google_cloud_run_v2_service_iam_policy" "socket-policy" {
  project = google_cloud_run_v2_service.socket.project
  location = google_cloud_run_v2_service.socket.location
  name = google_cloud_run_v2_service.socket.name
  policy_data = data.google_iam_policy.public.policy_data
}

#resource "google_storage_bucket" "bucket" {
#  name      	= var.bucket
#  location  	= var.bucket_location
#  force_destroy = true
#}