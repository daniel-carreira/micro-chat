terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

# Define the Docker images to be built
resource "docker_image" "chat-page" {
  name = "chat-page"
  build {
    context = "service-page"
  }
}

resource "docker_image" "chat-socket" {
  name = "chat-socket"
  build {
    context = "service-socket"
  }
}

# Define the Docker containers
resource "docker_container" "page" {
  name  = "chat-page"
  image = "chat-page"
  ports {
    internal = 8080
    external = 3000
  }
  env = [
    "SOCKET_URI=localhost:8000"
  ]
  depends_on = [
    docker_container.socket
  ]
}

resource "docker_container" "socket" {
  name  = "chat-socket"
  image = "chat-socket"
  ports {
    internal = 3000
    external = 8000
  }
  env = [
    "DATABASE_URI=localhost",
    "BUCKET=${var.bucket}"
  ]
  depends_on = [
    docker_container.database
  ]
}

resource "docker_container" "database" {
  name  = "chat-database"
  image = "mongo"
  ports {
    internal = 27017
    external = 27017
  }
}