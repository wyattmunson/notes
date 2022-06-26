# Terraform

## Install

Mac?

```
brew install terraform
```

## Basic Usage

### Sample Backend

```tf
terraform {
  backend "s3" {
    bucket         = "terraform-core-lle-state"
    key            = "A/UNIQUE/KEY"
    region         = "us-east-1"
    dynamodb_table = "terraform-lock"
  }
}
```

The `key` is the S3 key, that is the path to the file. **Do not duplicate keys between projects, or you will destroy existing the existing state file.**

Terraform's backend is a statefile, with a representation of it provisioned. For more information about Terraform state, go here: [Terraform State](https://www.terraform.io/docs/state/index.html)

#### Paramterizing the Backend

You can set the bucket name to be a variable, by passing it in during `terraform init`:

```bash
$ terraform init -backend-config="bucket=${your-bash-variable-that-has-bknd-s3-bucket-name}" \
    -backend-config="key=some-key" \
    -backend-config="region=${your-bash-variable-that-has-aws-region}" \
    -backend-config="access_key=${your-access-key-in-variable}" \
    -backend-config="secret_key="${your-secret-key-in-variable}"
```

### Store Secrets in AWS

You can store secrets in AWS and have terraform retrieve the value from AWS at runtime.

There are two AWS services for secrets storage

- AWS Secrets Manager
- Parameter Store (part of AWS Systems Manager)

### Retrieving a Secret in Terraform

Secrets can be stored in AWS Secrets Manager or AWS Parameter Store

```hcl
# Import secret from Parameter Store
data "aws_ssm_parameter" "token-db-password" {
  name = "prod-token-db-pw-${terraform.workspace}"
}

# Use secret in new resource
resource "aws_rds_cluster" "token-cluster" {
  engine                          = "aurora-postgresql"
  master_password                 = "${data.aws_ssm_parameter.token-db-password.value}"
  master_username                 = "postgres"
}
```

## Common Commands

```bash

# import
$ terraform import
$ terraform import aws_s3_bucket.prod bucket-name

# Remove from state
$ terraform state rm aws_s3_b

# Remove state lock
$ terraform force-unlock <LOCK_ID>
```

### Terraform Import

```bash
$ terrform import ADDRESS ID
$ terraform import aws_s3_bucket.prod_bucket aws-resource-id
```

NOTE: Use `terraform refresh` to get resource addresses and ID's. See [here](#terraform-refresh)

### Terraform Refresh

```bash
$ terraform refresh

| ----- ADRESS ------    |                         | ---- ID ---- |
aws_s3_bucket.prod-bucket: Refreshing state... [id=prod-bucket-name]
```

## Terraform in the Pipeline

This is where it gets tricky.

There are three main stages:

1. **Validate**: verify terraform is syntactically correct through static anlysis
   - Connection to backend is not required here
   - Role assumption in pipeline is not required here
   - Terraform must be inialized, but backed connection not required at this stage (`terraform init -backend=false`).
1. **Plan**: generate an execution plan with details about what Terraform will update or change
   - Use this stage to verify Terraform is not altering resources you do not expect
   - Plan file is saved as an artifact and used during the `apply` stage, so Terraform will apply exactly what it plans to do on this stage.
   - Connection to backend is established here
1. **Apply**: provision resources as planned. Terraform will call out to the AWS CLI and provision the resources you requested
   - Apply stage uses plan file from previous stage to be certain there is no deveation between the `plan` and `apply` stage.

### Sample `.gitlab-ci.yml`

```yaml
image: docker.internal.westcreekfin.com/terraform-aws:1a8cfe02b6

stages:
  - validate
  - plan
  - apply
  - destroy

validate:lle:
  stage: validate
  tags:
    - aws-public-cloud-privileged
  script:
    - terraform init -backend=false
    - terraform validate
  except:
    variables:
      - $CI_COMMIT_MESSAGE =~ /chore/

plan:lle:
  stage: plan
  tags:
    - aws-public-cloud-privileged
  script:
    - source lle.sh
    - aws eks --region us-east-1 update-kubeconfig --name ${EKS_LLE_CLUSTER_NAME}
    - terraform init -backend-config="bucket=terraform-core-lle-state"
    - terraform workspace select lle
    - terraform plan -out=./tf-plan
  artifacts:
    untracked: false
    paths:
      - ./tf-plan
    expire_in: 3 days
  except:
    variables:
      - $CI_COMMIT_MESSAGE =~ /chore/

apply:lle:
  stage: apply
  when: manual
  tags:
    - aws-public-cloud-privileged
  script:
    - source lle.sh
    - aws eks --region us-east-1 update-kubeconfig --name ${EKS_LLE_CLUSTER}
    - kubectl config current-context
    - kubectl get po -A
    - helm repo add ${HELM_REPO_NAME_AND_URL}
    - helm repo update
    - terraform init -backend-config="bucket=terraform-core-lle-state"
    - terraform workspace select lle
    - terraform apply -auto-approve ./tf-plan
  dependencies:
    - plan:lle
  except:
    variables:
      - $CI_COMMIT_MESSAGE =~ /chore/

DESTROY_ALL_RESOURCES:lle:
  stage: destroy
  when: manual
  tags:
    - aws-public-cloud-privileged
  script:
    - source lle.sh
    - aws eks --region us-east-1 update-kubeconfig --name ${EKS_LLE_CLUSTER}
    - terraform init -backend-config="bucket=terraform-core-lle-state"
    - terraform workspace select lle
    - terraform destroy -auto-approve
```
