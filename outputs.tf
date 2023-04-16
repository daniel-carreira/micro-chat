output "page_uri" {
  value       = google_cloud_run_v2_service.page.uri
  description = "The URL on which the deployed service is available"
}

output "socket_uri" {
  value       = google_cloud_run_v2_service.socket.uri
  description = "The URI on which the deployed service is available"
}