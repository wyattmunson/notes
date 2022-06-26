# GitLab

Like GitHub, with more CI/CD.

## `.gitlab-ci.yml` File

Any project can have "CI" by adding a `.gitlab-ci.yml` file to the repo.

Pass these things into stages

```yaml

```

```yaml
# main config

# override the parent image
image: docker
stage: version
script:
  - echo "Put yer scripts here"
  - helm deploy loans-service
```

```yaml
# tags can control what runners pick up a given job
tags:
  - wcf-shared-services

# Note deployment to given env.
# Deployments to this env will show up on ops dashboard (silver feature)
environment:
  name: PROD

# variables can be set at stage or parent level
variables:
  SONAR_URL: https://sonarcloud.io
```

```yaml
# Only run tage with manual approval
when: manual

# Only run on master branch
only:
  - master

# More complicated "only"
only:
  refs:
    - master
  variables:
    - $CI_COMMIT_MESSAGE =~ /^(fix|feat|BREAKING CHANGE|Merge)/


# Dont run stage based on content of commits
except:
  variables:
    - $CI_COMMIT_MESSAGE =~ /chore/
```

```yaml
# Save file for later stages
artifacts:
  paths:
    - .dev-image-name-and-tag # file name

# Later stages using the file need to reference the artifacts stage as a dependency:
dependencies:
  - build-dev # stage/job name


# Expire artifacts
artifacts:
  expire_in: 3 days
```

## Sick `.gitlab-ci.yml` h4xs

```bash

# update value in file using sed
sed -i 's/<cluster_region_sed_variable>/us-east-1/g' eksctl/base-node-group-prod.yaml

# sed partially replace value
- 'sed -r "s/appVersion: bleeding-edge/appVersion: $CHART_VERSION/" -i $CHART_NAME/Chart.yaml'

# set env variable from value in file
export CHART_VERSION="$(grep "^version:" Chart.yaml | cut -d" " -f2)"
export IMAGE_NAME_AND_TAG=$(cat .image-name-and-tag)

# Set value of env variable to file
echo $SECRET_CODE > code-value.txt

# getting AWS creds into current shell session
- aws sts assume-role --role-arn arn:aws:iam::641481400528:role/aws-iam-prod-assumable-by-privileged-AssumableRole-1LNAMF75XL1FD --role-session-name prod-blue-eks-creation >> credentials.json
- export AWS_SECRET_ACCESS_KEY=$(cat credentials.json | grep "SecretAccessKey" | cut -d ':' -f2 | cut -d '"' -f2)
- export AWS_SESSION_TOKEN=$(cat credentials.json | grep "SessionToken" | cut -d ':' -f2 | cut -d '"' -f2)
- export AWS_ACCESS_KEY_ID=$(cat credentials.json | grep "AccessKeyId" | cut -d ':' -f2 | cut -d '"' -f2)
```

### Clone GitLab repo over HTTPS with 2FA

```bash
git clone https://oauth2:PERSONAL_ACCESS_TOKEN@gitlab.com/group/project.git
```

## Sample Pipelines

Pipeline samples take for a variety of repos. For application and configuration/infrastrcture code.

- [Helm chart pipeline](#helm-chart-pipeline)
- [React frontend](#react-frontend)
- [Go backend microservice](#go-backend-microservice)
- [Terraform pipeline](#terraform-pipeline)

### Helm chart pipeline

- Cut new version of Helm chart when version in bumped in `Chart.yaml` file. Requires version to be manually incremented.
- Verify Helm can lint and package the chart when non-master branches are pushed to the remote
- On master, grabs version number from `Chart.yaml`, cuts new version and pushes it remote Helm repo.

```yaml
image: docker

variables:
  REPO_NAME: $CI_SERVER_HOST/$CI_PROJECT_PATH
  HELM_REPO: https://nexus.internal.westcreekfin.com/repository/helm-hosted/
  CHART_EXT: .tgz
  GL_TOKEN: $GL_TOKEN

stages:
  - build
  - release

build:
  image: $DOCKER_REPO/westcreek/docker-containers/aws-toolbox:7d1d8e770b
  stage: build
  only:
    - branches
  except:
    - master
  script:
    - helm lint
    - helm package .

release:
  image: $DOCKER_REPO/westcreek/docker-containers/aws-toolbox:7d1d8e770b
  stage: release
  only:
    - branches
  except:
    - master
  script:
    - helm lint
    - helm package .
    - export CHART_VERSION="$(grep "^version:" Chart.yaml | cut -d" " -f2)"
    - export CHART_NAME="$(grep "^name:" Chart.yaml | cut -d" " -f2)"
    - export FILE_NAME="${CHART_NAME}-${CHART_VERSION}${CHART_EXT}"
    - echo "Uploading $FILE_NAME to $HELM_REPO"
    - curl -is -u "$NEXUS_USERNAME:$NEXUS_PASSWORD" $HELM_REPO --upload-file $FILE_NAME
  except:
    variables:
      - $CI_COMMIT_MESSAGE =~ /chore/

```

### Go backend microservice

This microservice is an HTTP client that connects to a postgres database. The pipeline handles versioning and tagging, running tests, deploying to k8s, and running database schema migrations.

- Run tests. Go tests, service tests.
- Version - use semantic-release to analyze commits and bump version if necessary
- Docker build and push - create new Docker image of app and push to artifact repo
- Deploy new image to k8s
- Run database migrations with flyway

```yaml
# Keep go version aligned with what's in Dockerfile
image: golang:1.13

stages:
  # static code analysis and tests
  - test
  # automatic semantic versioning
  - version
  # build and publish docker image
  - build
  - report
  - release
  - migrate-db

go-test:
  stage: test
  script:
    - go version
    - go env
    # Using gofmt since 'go fmt' doesn't respect '-mod vendor' and tries to download stuff we
    # don't have access to by default in this context.
    - gofmt -w *.go $(ls -d */ | grep -v vendor/)
    # 'go vet' only seems to respect the vendor flag set this way, not through the commandline option.
    # Works with 'go test' as well.
    - export GOFLAGS="-mod=vendor"
    - go test -coverprofile=c.out -race $(go list ./... | grep -v /vendor/)
    - go tool cover -func=c.out

service-tests:
  image: docker/compose:1.25.4
  stage: test
  script:
    - docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build --exit-code-from test-runner --renew-anon-volumes
  after_script:
    - docker-compose -f docker-compose.yml -f docker-compose.test.yml down --rmi local --volumes

# Version repo based on commit messages
# Store version number for later stages in `.next-version` file
# This version number is used throughout the rest of the pipelein
version:
  image: registry.gitlab.com/juhani/go-semrel-gitlab:v0.21.1
  stage: version
  allow_failure: true
  script:
    - release -v
    - release next-version > .next-version
    - echo 'next version:' $(cat .next-version)
    - release tag
  artifacts:
    paths:
      - .next-version
  only:
    refs:
      - master
    variables:
      - $CI_COMMIT_MESSAGE =~ /^(fix|feat|BREAKING CHANGE|Merge)/
  except:
    - tags

# Push docker image to artifact repo
# Use image version from previous stage
docker-build-and-push:
  image: docker/compose:1.25.1-alpine
  stage: build
  dependencies:
    - version
  script:
    - docker -v
    - export IMAGE_NAME_AND_TAG=$DOCKER_REPO/$CI_PROJECT_PATH:$(cat .next-version)
    - docker login -u $NEXUS_USERNAME -p $NEXUS_PASSWORD $DOCKER_REPO
    - docker build . --tag $IMAGE_NAME_AND_TAG --target production
    - docker push $IMAGE_NAME_AND_TAG
    - echo $IMAGE_NAME_AND_TAG > .image-name-and-tag
  artifacts:
    paths:
      - .image-name-and-tag
  only:
    refs:
      - master
    variables:
      - $CI_COMMIT_MESSAGE =~ /^(fix|feat|BREAKING CHANGE|Merge)/
  except:
    - tags

# See sonar-project.properties
# TODO: set $SONAR_PROJECT_VERSION based on new tag from version job
sonar:
  stage: report
  image: ciricihq/gitlab-sonar-scanner:3.2.1
  variables:
    SONAR_URL: https://sonarcloud.io/
    SONAR_ANALYSIS_MODE: publish
  script:
    - gitlab-sonar-scanner -Dsonar.login=$SONAR_USER_TOKEN
  dependencies:
    - go-test
  only:
    refs:
      - master
    variables:
      - $CI_COMMIT_MESSAGE =~ /^(fix|feat|BREAKING CHANGE|Merge)/
  except:
    - tags

# Deploy to k8s dev namespace
deploy-dev:
  image: $DOCKER_REPO/westcreek/docker-containers/aws-toolbox:7d1d8e770b
  stage: release
  environment:
    name: 2G-LLE-DEV
  tags:
    - wcf-shared-services
  dependencies:
    - docker-build-and-push
  script:
    - source /opt/assumeroles/lle/gitlab-runner-standard.sh
    - aws eks --region us-east-1 update-kubeconfig --name ${EKS_LLE_CLUSTER_NAME}
    - export IMAGE_NAME_AND_TAG=$(cat .image-name-and-tag)
    - sed -i "s,<IMAGE_NAME_AND_TAG>,${IMAGE_NAME_AND_TAG},g" infra/k8s/dev/deployment.yml
    - kubectl apply -n dev -f infra/k8s/dev/deployment.yml
  only:
    refs:
      - master
    variables:
      - $CI_COMMIT_MESSAGE =~ /^(fix|feat|BREAKING CHANGE|Merge)/
  except:
    - tags

deploy-stage:
  # Does the same as dev

# Deploy prod to k8s
# Add target cluster to kubeconfig, apply updated k8s yaml using new version number
deploy-prod:
  image: $DOCKER_REPO/westcreek/docker-containers/aws-toolbox:7d1d8e770b
  stage: release
  environment:
    name: 2G-PROD
  tags:
    - wcf-shared-services
  dependencies:
    - docker-build-and-push
  script:
    - source /opt/assumeroles/prod/gitlab-runner-standard.sh
    - aws eks --region us-east-1 update-kubeconfig --name ${EKS_NEW_PROD_CLUSTER_NAME}
    - export IMAGE_NAME_AND_TAG=$(cat .image-name-and-tag)
    - sed -i "s,<IMAGE_NAME_AND_TAG>,${IMAGE_NAME_AND_TAG},g" infra/k8s/prod/deployment.yml
    - kubectl apply -n applications -f infra/k8s/prod/deployment.yml
  when: manual
  only:
    refs:
      - master
    variables:
      - $CI_COMMIT_MESSAGE =~ /^(fix|feat|BREAKING CHANGE|Merge)/
  except:
    - tags

migrate-db-dev:
# migrate dev DB

migrate-db-stage:
# migrate stage DB

# Run versioned schema migrations using Flyway
migrate-db-prod:
  stage: migrate-db
  image:
    name: boxfuse/flyway:5.2-alpine
    entrypoint: [""]
  tags:
    - wcf-shared-services
  variables:
    FLYWAY_URL: "jdbc:postgresql://applications-prod.cs7474glw4f7.us-east-1.rds.amazonaws.com/applications"
    FLYWAY_USER: "postgres"
    FLYWAY_LOCATIONS: "filesystem:./infra/sql"
  script:
    - flyway migrate -password=$PROD_DB_PASSWORD
  when: manual
  only:
    refs:
      - master
    changes:
      - infra/sql/*
```

### React frontend

This project is a React frontend with a Backend for Frontend application. It has two components: `UI` and `BFF`.

- Test both components
- Build UI
- Version with semantic-release. Use this version through the rest of the pipeline
  - Reads commits, automatically tags release in GitLab and updates `package.json`
- Deploy to k8s
- Run Sonar NPM package and upload results to SonarCloud

```yaml
image: node:lts

stages:
  - test
  - version
  - build
  - deploy
  - report

test-bff:
  stage: test
  tags:
    - wcf-shared-services
  script:
    - cd bff
    - npm ci
    - npm test
  artifacts:
    paths:
      - bff/reports/coverage/
  except:
    - tags
  only:
    - master
    - merge_requests

test-ui:
  stage: test
  tags:
    - wcf-shared-services
  script:
    - cd ui
    - npm ci
    - npm test
  artifacts:
    paths:
      - ui/coverage/
  except:
    - tags
  only:
    - master
    - merge_requests

build-ui:
  # considering 'unable to build ui' as a failing test
  stage: test
  tags:
    - wcf-shared-services
  script:
    - cd ui
    - npm ci
    - npm run build
  except:
    - tags
  only:
    - master
    - merge_requests

semantic-release:
  stage: version
  tags:
    - wcf-shared-services
  # Making the updated version available to subsequent jobs.
  artifacts:
    paths:
      - package.json
  only:
    - master
  script:
    - npm ci
    - npx semantic-release

build-dev:
  image: $DOCKER_REPO/eks-kubectl:2019.08.02.148de49b2e
  stage: build
  tags:
    - wcf-shared-services
  script:
    # build-time environment variables
    - cp ui/environments/dev.env ui/.env.production
    - export VERSION=`grep '"version":' package.json | cut -d\" -f4`
    - export IMAGE_NAME_AND_TAG=$DOCKER_REPO/$CI_PROJECT_PATH:$CI_COMMIT_SHORT_SHA.dev
    - docker login -u $NEXUS_USERNAME -p $NEXUS_PASSWORD $DOCKER_REPO
    - docker build . --tag $IMAGE_NAME_AND_TAG
    - docker push $IMAGE_NAME_AND_TAG
    - echo $IMAGE_NAME_AND_TAG > .dev-image-name-and-tag
  artifacts:
    paths:
      - .dev-image-name-and-tag
  only:
    - master
    - merge_requests

build-stage:
# Similar to dev

build-prod:
  image: $DOCKER_REPO/eks-kubectl:2019.08.02.148de49b2e
  stage: build
  tags:
    - wcf-shared-services
  dependencies:
    - semantic-release
  script:
    - cp ui/environments/prod.env ui/.env.production
    - export VERSION=`grep '"version":' package.json | cut -d\" -f4`
    - export IMAGE_NAME_AND_TAG=$DOCKER_REPO/$CI_PROJECT_PATH:$VERSION
    - docker login -u $NEXUS_USERNAME -p $NEXUS_PASSWORD $DOCKER_REPO
    - docker build . --tag $IMAGE_NAME_AND_TAG
    - docker push $IMAGE_NAME_AND_TAG
    - echo $IMAGE_NAME_AND_TAG > .prod-image-name-and-tag
  artifacts:
    paths:
      - .prod-image-name-and-tag
  only:
    - master

deploy-dev:
  image: $DOCKER_REPO/eks-kubectl:2019.08.02.148de49b2e
  stage: deploy
  environment:
    name: 2G-LLE-DEV
  tags:
    - wcf-shared-services
  dependencies:
    - build-dev
  script:
    - source infra/k8s/dev/assumeRole.sh
    - export IMAGE_NAME_AND_TAG=$(cat .dev-image-name-and-tag)
    - aws eks --region us-east-1 update-kubeconfig --name ${EKS_LLE_CLUSTER_NAME}
    - sed -i "s,<IMAGE_NAME_AND_TAG>,${IMAGE_NAME_AND_TAG},g" infra/k8s/dev/deployment.yml
    - kubectl apply -f infra/k8s/dev/secrets.yml
    - kubectl apply -n dev -f infra/k8s/dev/deployment.yml
  when: manual
  only:
    - master
    - merge_requests

deploy-stage:
# Similar to dev

deploy-prod:
  image: $DOCKER_REPO/eks-kubectl:2019.08.02.148de49b2e
  stage: deploy
  environment:
    name: 2G-PROD
  tags:
    - wcf-shared-services
  dependencies:
    - build-prod
  script:
    - source infra/k8s/prod/assumeRole.sh
    - export IMAGE_NAME_AND_TAG=$(cat .prod-image-name-and-tag)
    - aws eks --region us-east-1 update-kubeconfig --name ${EKS_NEW_PROD_CLUSTER_NAME}
    - sed -i "s,<IMAGE_NAME_AND_TAG>,${IMAGE_NAME_AND_TAG},g" infra/k8s/prod/deployment.yml
    - kubectl apply -f infra/k8s/prod/secrets.yml
    - kubectl apply -n applications -f infra/k8s/prod/deployment.yml
  when: manual
  only:
    - master

sonar-bff:
  stage: report
  tags:
    - wcf-shared-services
  only:
    - master
  except:
    variables:
      - $CI_COMMIT_MESSAGE =~ /chore/
  dependencies:
    - test-bff
    - semantic-release
  script:
    - cd bff
    - npm ci
    - npm run sonar -- -Dsonar.host.url=https://sonarcloud.io/ -Dsonar.login=$SONAR_USER_TOKEN

sonar-ui:
# same as above
```

### Terraform pipeline

This show Terraform in three stages: validate, preview, and apply. Setup so apply is only run on master, SCM can be configured for merge approvals to master.

`-backend-config` can be passed to feed the bucket name in at runtime, as the bucket cannot be set as a variable in the application code.

`-backend=false` can be passed when you don't care about the current state (you also don't need to authenticate).

`terraform plan -out=./tf-plan` is saving plan in preview stage to be used during apply in the next stage.

`terraform workspace select prod` can select a workspace after `init`. You can have a job for each environment in each stage.

```yaml
stages:
  - validate
  - new-preview
  - new-apply

validate:
  stage: validate
  image: docker.internal.westcreekfin.com/terraform-aws:dea91da717
  tags:
    - wcf-shared-services
  script:
    - terraform init -backend=false
    - terraform validate

new-account:plan:
  stage: new-preview
  image: docker.internal.westcreekfin.com/terraform-aws:dea91da717
  tags:
    - wcf-shared-services
  script:
    - source ./sharedServices.sh
    - terraform init -backend-config="bucket=terraform-core-lle-state"
    - terraform plan -out=./tf-plan
  artifacts:
    untracked: false
    paths:
      - ./tf-plan
    expire_in: 3 days

new-account:apply:
  stage: new-apply
  image: docker.internal.westcreekfin.com/terraform-aws:dea91da717
  when: manual
  only:
    refs:
      - master
  tags:
    - aws-iam
  script:
    - source ./prod.sh
    - terraform init -backend-config="bucket=terraform-core-lle-state"
    - terraform apply -auto-approve
  dependencies:
    - new-account:plan
```
