# Docker

Docker is a OS virtualization software. Similar to virtual machines in their outcome, their differ in their function.

### Who created Docker

Docker is created by Docker, Inc. (see: [recursion](#who-created-docker))

### What's it purpose

The general idea is remove the complexity of the hardware level. If a Docker container runs on your local machine, it should run on someone else's machine, or a Kubernetes cluster, or Elastic Container Service cluster.

### What problem it solves

Let's say your developing a Node.js application running Node v12 on your computer. If someone else tries to run said program, but they're running Node v8, it may not run correctly.

With Docker, the version of Node would be built directly into the Docker image. So if we're using the same Docker image, we're using the same Node version.

#### Quick Note

With Docker so it would not matter what version of Node someone had installed, or if they even had it installed. The Docker image has already been configured to use a specific version of Node - the developer would not need to install Node on their local machine.

Now you may mention `nvm` or `n` as tools developers can install on their local machines to quickly switch between Node versions. There's two problems with that:

- It requires everone to install the same version of Node. Or if they need a different version of Node for a different project they now need multiple versions of Node. This needs to be communicated and documented in the projects `README.md`
-

### Docker vs. VMs

In short, VMs abstract the hardware layer so you can focus on the OS level. Docker abstracts the OS level, so you can focus on the app.

## Docker CLI Commands

```bash
# View all docker images saved locally
docker images

# View all running containers
docker ps

# build a docker image
docker build .
docker build . -t munsonwf/express-sample:1.2.3

# feed env variables in a command line
docker build . --build-arg DB_PASSWORD=hunter2

# run container in detached mode
docker run --rm -it mysql:5.6.12

# exec into running container
docker exec -it <CONTAINER_ID> <COMMAND>
docker exec -it fe93b2ca2 /bin/bash

# View container logs and tail output
sudo docker logs CONTAINER-NAME --follow

sudo systemctl start docker
service docker status

# install docker compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# add docker compose to path for sudo by creating symlink
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

```

```bash
# take snapshot of running image
docker commit <CONTAINER NAME>

# tag image you've created
docker tag <IMAGE_ID> <NEW_NAME>

# run exec against stopped container
docker run --rm -it <REPO_NAME> <EXEC_COMMAND>
docker run --rm -it gitlab/gitlab-runner:2.0.3 bin/bash

# run exec against stopped container (override entrypoint)
docker run --rm -ti --entrypoint='' munsonwf/nslookup:1.0.0 /bin/ash

# inspect container (see entrypoint, CMD)
docker inspect <IMAGE ID>
docker inspect 2bf89faaab70

# list and inspect docker networks
docker network ls
docker network inspect 74e
```

### Push to DockerHub

```bash
# login to docker
docker login

# push sepcific image and tag to docker push
docker push vendor/app:ver
```

### Build for different platforms

The platform for an M1 MacBook is not the same as the Linux container it may be running in on the cloud.

```bash
docker buildx build --platform=linux/amd64 -t <image-name> .
```

## Dockerfile samples

```dockerfile
# inhert this image from another image
FROM node:lts

# set metadata labels
LABEL maintainer="wyatt@example.com"
LABEL description="Docker file for Express app"

# set env vars for Dockerfile
ENV INSTALL_DIR /var/www/html

# copy files to the image filesystem

# copy files to the container filesystem
COPY build/ ${INSTALL_DIR}/build

RUN mkdir /opt/munson
RUN apk add dig
# use exec form for shells other than sh
RUN ["/bin/bash", "-c", "echo hello localhost"]

# expose assumes TCP by default
EXPOSE 80
EXPOSE 80/udp
EXPOSE 80/tcp

COPY ./script.sh /opt/script.sh
```

## Docker Concepts

### `CMD` vs `RUN` vs `ENTRYPOINT`

Containers are built to run a single process. When that process completes the container exits.

`RUN` is used to run commands like downloading software packages for the image. These are used to build the image.

`CMD` and `ENTRYPOINT` are the two commands that define what process is running in the container.

- `RUN` - executing a command and creates a new layer. Do something like installing software package
- `CMD` - default command to execute when running a container without supplying a command. It can be easily overriden.
- `ENTRYPOINT` - specify when making a container an executable. This is only overriden by the `--entrypoint` flag.
- `CMD` and `ENTRYPOINT` - combine when using a container with an executable that needs easily overrideable default values.

### Using `CMD`

```Dockerfile
# Shell form
CMD echo "Hello World"
# exec form
CMD ["echo", "Hello World"]
```

### Using `ENV` and `CMD` together

How to use environment variables in a `CMD` command.

```bash
# docker run command (with env variable)
$ docker run -e URL_PATH='example.com'
```

```Dockerfile
# Dockerfile
ENV URL_PATH $URL_PATH

CMD ["sh", "-c", "sh ./script.sh ${URL_PATH}" ]
```

## CI

### GitLab CI for Docker images

```yaml
image: docker

stages:
  - build-and-publish

build-and-publish:
  stage: build-and-publish
  only:
    refs:
      - master
  except:
    changes:
      - ./README.md

  script:
    - docker login -u $NEXUS_USERNAME -p $NEXUS_PASSWORD $DOCKER_REPO
    - export VERSION=${CI_COMMIT_SHA:0:10}
    - docker build --no-cache -t $DOCKER_REPO/$CI_PROJECT_PATH:${VERSION} .
    - docker push $DOCKER_REPO/$CI_PROJECT_PATH:${VERSION}
```

### Base image with bash scripts

This base image takes some bash scripts that it shoves inside the image.

```Dockerfile
FROM alpine:3.11.3

RUN apk update && apk upgrade
RUN apk add bash
RUN rm -rf /var/cache/apk/*

# Copy role assumption scripts over
COPY roleAssumption /opt/assumeroles/
```

```sh
# repo/roleAssumption/prod/whatever.sh

#!/bin/bash
echo "WCF Simple Assumption Service"
echo "WCF (c) 1978 Punched Card and Magnetic Tape Division"

# Start with default permissions
echo -e "\nEXISTING IDENTTITY: "
aws sts get-caller-identity
aws configure list

# assume role
echo -e "\nAssuming the role..."
aws sts assume-role --role-arn arn:aws:iam::641481400528:role/prod-standard-gitlabRunner-AssumableRole-1T2KHC5NTDERN --role-session-name gitlab-runner-iam-lle-${CI_COMMIT_SHA} >> credentials.json
export AWS_SECRET_ACCESS_KEY=$(cat credentials.json | grep "SecretAccessKey" | cut -d ':' -f2 | cut -d '"' -f2)
export AWS_SESSION_TOKEN=$(cat credentials.json | grep "SessionToken" | cut -d ':' -f2 | cut -d '"' -f2)
export AWS_ACCESS_KEY_ID=$(cat credentials.json | grep "AccessKeyId" | cut -d ':' -f2 | cut -d '"' -f2)

echo -e "\nASSUMED IDENTITY:"
aws sts get-caller-identity
aws configure list
```

### AWS Base Image

Contains AWS CLI, kubectl, and Helm.

```Dockerfile
FROM docker.internal.westcreekfin.com/westcreek/docker-containers/base-assume-roles:bfbac6c673

RUN apk -v --update add \
  python3 \
  py3-pip \
  curl \
  openssl \
  sed \
  && \
  pip3 install --upgrade awscli==1.17.13 s3cmd==2.0.1 python-magic && \
  apk -v --purge del py-pip


#install aws iam authenticator
RUN rm /var/cache/apk/*
RUN curl -o aws-iam-authenticator https://amazon-eks.s3-us-west-2.amazonaws.com/1.14.6/2019-08-22/bin/linux/amd64/aws-iam-authenticator

#check the checksums - aws iam authenticator
RUN curl -o aws-iam-authenticator.sha256 https://amazon-eks.s3-us-west-2.amazonaws.com/1.14.6/2019-08-22/bin/linux/amd64/aws-iam-authenticator.sha256
RUN openssl sha1 -sha256 aws-iam-authenticator

# make aia executable
RUN chmod +x ./aws-iam-authenticator
#move aia onto path
RUN mkdir -p /usr/local/bin
RUN cp ./aws-iam-authenticator /usr/local/bin

#fetch the kubectl binary
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl

#make kubectl executable
RUN chmod +x ./kubectl

#move kubectl on path
RUN cp ./kubectl /usr/local/bin/kubectl

#fetch the helm3 install script
RUN curl -o get-helm-3.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3

#make helm script executable
RUN chmod +x ./get-helm-3.sh

#run helm install script
RUN ./get-helm-3.sh

#clean up helm script
RUN rm ./get-helm-3.sh

#make sure /usr/bin/local is on path
RUN export PATH=$PATH:/usr/local/bin
```

### Terraform Image

Terraform, AWS CLI, kubectl/Helm.

```Dockerfile
FROM docker.internal.westcreekfin.com/westcreek/docker-containers/aws-toolbox:7d1d8e770b

# Install terraform
RUN wget https://releases.hashicorp.com/terraform/0.12.16/terraform_0.12.16_linux_amd64.zip \
  && unzip terraform_0.12.16_linux_amd64.zip \
  && mv terraform /usr/local/bin/ \
  && terraform --version
```
