# MicroChat
MicroChat is a chat application that provides a real-time communication platform capable of handling both text and image-based conversations.

[Live Demo](https://micro-chat-client-53vw4iymqq-uc.a.run.app/)

___

## Local
To run MicroChat locally, you need to use `docker-compose` to provision and deploy the code. Three services will run locally (`HTTP Server`, `Socket.IO Server`, and `Database`), and one service will run externally (`File Bucket`).

**Build & Start**

```
docker compose up --build
```

- Running this command builds the required images (`nginx`, `node`, and `mongo`), and starts the containers. After it finish, you should have three services (`HTTP Server`, `Socket.IO Server`, and `Database`, respectively). 

**Note:** Initially, the project was provisioned using `terraform`, but due to some issues encountered during the process, it was discontinued. The attempted implementation using terraform is available in the `terraform-local-remote` branch.

___


## Remote
To run MicroChat locally, you need to use `terraform` to provision and deploy the code. Three services will run on GCP (`HTTP Server`, `Socket.IO Server`, and `File Bucket`), and one service will run on AWS (`Database`).

### Manual Deploy
To build the application manually, you need to setup your environment first.

**Init**
```
terraform init
```
- Running this command initializes the existing Terraform working directory. Then you should insert the authentication token of `Terraform Cloud`, where the remote infrastructure state is stored.

**Apply**
```
terraform apply -auto-approve
```
- Running this command applies any changes to the infrastructure, without requiring manual confirmation from the user. At the end, it wil be provided to you the endpoint of the deployed services (`HTTP Server`, `Socket.IO Server`).

### Automatic Deploy
Another way to trigger the deployment of the application is through a `push` action in the `main` branch, with the help of `Git Actions`. Whenever the event occurs, the images are built and deployed to `Docker Hub`, then the `terraform` procedure is executed to apply the changes.

  **Trigger Event**
  ```bash
  git add .
  git commit -m "<message>"
  git push
  ```