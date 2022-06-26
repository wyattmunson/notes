# Kubernetes

Kubernetes is a container orchistration platform.

## Contents

- [Core concepts](#core-concepts)
- [kubectl commands](#kubctl-commands)
- [Kubectx & Kubens](#kubectx--kubens)
- [Secrets - external secrets](#secrets-externalsecrets-method)

## Core Concepts

### Deployment

Set things like:

- replicas
- Update strategy: rolling update, ect.
- environment variables,
- Image location
- Healthcheck and liveliness probe endpoints

### Pods

Like a pod of whales, one or more containers that should be treated as a single application. A pod encapsulates application containers, storage resrouces, a unique network Id, and configuration on how to run the containers.

### Service

Logical set of pods that acts as a gateway for the client to send requests to the pods. Pods are volatile in k8s. The replication controller may kill pods. Service abstracts the finding of the physical pods and acts as a gateway.

Set configurations like what port the service listens on and what port that maps to the port the container is listening on.

### Namespace

Analgous to an Amazon VPC, a namspace is a virtual cluster. A physical cluster can run multiple namespaces (virtual clusters) to isolate components, projects, or secure access.

## kubctl commands

`kubectl` is a command line interface tool that interacts with the `kube-apiserver` (in the master node).

Add EKS cluster to your local kubeconfig

```bash
# add EKS cluster to local kubeconfig
$ aws eks --region us-east-1 update-kubeconfig --name cluster-name-in-eks-ce548264
```

Namespaces

```bash
kubectl create namespace finance-qa
kubectl delete namepsaces finance-qa # note extra "s"
```

### Creating Resrouces

```bash
$ kubectl apply -f ./deploy-dev.yaml        # create resrouce from file
$ kubectl apply -f ./dev.yaml ./prod.yaml   # from two files
$ kubectl apply -f ./dir                    # from an entire directory

```

### Viewing Created Resrouces

```bash
$ kubectl get services
$ kubectl get pods -A       # get pods all namespaces
$ kubectl get pods -o wide      # list pods with more details
$ kubectl get deployment dev-dep    # get deployment dev-dep
$ kubectl get pods
$ kubectl get pod ui-pod -o yaml    # get ui-pod's YAML
$ kubectl get  --export #list pod without cluster specific information

# get all k8s resoruces in given namespace
kubectl get all -n NAMESPACE
# get all k8s resources in all namespaces
kubectl get all -A

# Can get, describe, and delete resources
$ k get pods -n tick
$ k desribe pods/influx-influxdb-j3ilso93-ae82kdl2 -n tick
$ k delete pods/influx-influxdb-j3ilso93-ae82kdl2 -n tick

$ k get deployments
$ k delete deployments applications-service -n applications-dev

```

### Get logs

```bash
kubectl logs CONTINER-NAME -n NAMESPACE

kubectl logs RESOURCE/RESOURCE-NAME -n NAMESPACE
kubectl logs svc/payment-service -n dev

# tail/follow logs
kubectl logs svc/payment-service -n dev --follow

# limit logs based on time
kubectl logs svc/payment-service -n dev --since 10m

```

### Add a user to EKS Config Map

```bash
$ kubectl edit -n kube-system configmap/aws-auth
```

### Unorganized commands

```bash
# Current meximum pods per node
kubectl get nodes -o yaml | grep pods

# Current pods per node
$ kubectl get pods --all-namespaces | grep Running | wc -l
```

```bash
# Get cluster info
$ kubectl cluster-info

$ kubectl component-status

# shorthand commands
$ k get services
$ k get svc
$ k get pods
$ k get po

# exec into container in pod
k exec --stdin --tty employer-lookup-service-78cb8c8c7d-hhltf -- sh

# see pod limit per node
$ kubectl get nodes -o yaml | grep pods
# see total running pods
$ kubectl get pods --all-namespaces | grep Running | wc -l

# Port forwarding
$ k port-forward services/applications-service -n dev 8080:80

# Check node CPU and memory usage
kubectl get nodes --no-headers | awk '{print $1}' | xargs -I {} sh -c 'echo {}; kubectl describe node {} | grep Allocated -A 5 | grep -ve Event -ve Allocated -ve percent -ve -- ; echo'
```

[kubectl short hand](https://blog.heptio.com/kubectl-resource-short-names-heptioprotip-c8eff9fb7202)

```bash
$ k get all
k get pod/applications-service-6ffbc48d6d-bpchh
$ k get service/applications-ui
$ k get deployment.apps/token-service
$ k get replicaset.apps/applications-service-558c6b579d

```

### Generate admin token for dashboard

```bash
#!/bin/bash
EKS_ADMIN_TOKEN_KEY=$(kubectl -n kube-system get secret | grep eks-admin | awk '{print $1}')
kubectl -n kube-system describe secret ${EKS_ADMIN_TOKEN_KEY} | grep 'token:'
```

## Kubectx & Kubens

Kubectx is a command line tool to help you quickly swtich clusters. Use Kubens for namespaces.

Install kubectx here: https://github.com/ahmetb/kubectx

Use kubectl here:

```bash
USAGE:
  kubectx                       : list the contexts
  kubectx <NAME>                : switch to context <NAME>
  kubectx -                     : switch to the previous context
  kubectx <NEW_NAME>=<NAME>     : rename context <NAME> to <NEW_NAME>
  kubectx <NEW_NAME>=.          : rename current-context to <NEW_NAME>
  kubectx -d <NAME> [<NAME...>] : delete context <NAME> ('.' for current-context)
                                  (this command won\'t delete the user/cluster entry
                                  that is used by the context)
```

## Secrets (ExternalSecrets Method)

> NOTE: This requires the GoDaddy External Secrets for K8s is installed, you can see the yaml kind is `ExternalSecret`.

1. Store secret in AWS Secrets Manager
1. Write `ExternalSecret` k8s yaml to reference AWS Secret and deploy to k8. The cluster will automatically fetch the secret(s) from AWS and give them a name you specify
1. Reference secret key/name

You can store multiple secrets under main secret. In the example below, `connectionString` is a secrets stored under the parent `webserver-secret`.

**Create ExternalSecret yaml**

```yaml
apiVersion: "kubernetes-client.io/v1"
kind: ExternalSecret
metadata:
  name: webserver-secret # name in kubernetes
  namespace: finance-qa
secretDescriptor:
  backendType: secretsManager
  data:
    - key: prod/rds/connectionString # name in AWS secrets manager
      name: connectionSting # key for secret in kubernetes
    - key: prod/additional/secret
      name: anotherApiKey
```

This creates a secret key of `webserver-secret` that is equal to a key/value pair of the secrets pulled into AWS. You can sort of represent it with the JSON below:

```json
{
  "webserver-secret": {
    "connectionString": "postgres:password//posgres@172.0.0:5432/database",
    "anotherApiKey": "asdfef;asldkf;eSECRET_TEXTlskdjfla"
  }
}
```

**Reference secret in deployment `yaml`**

Now that the secret is populated and named in k8s, you can reference it like you would normally.

```yaml
---
.
.
.
env:
  - name: DB_CONNECTION_STRING
    valueFrom:
      secretKeyRef:
        key: connectionString
        name: webserver-secret
```

### kubectl & secrets

```bash
# related kubectl commands
$ kubectl apply -f secret.yml -n some-namespace
$ kubectl delete secret secret-name -n some-namespace

# Get a list of all secret names in a namespace
$ kubectl get secrets -n some-namespace

# Get details of a particular secret
$ kubectl get secrets webserver-secret -n some-namespace -o yaml
# This will return the base64 encoded secrets
$ echo 'SECRET_TEXT' | base64 --decode

```

### Kubernetes API Resources and Shorthand

All k8s resources that can get "gotten" and shorthand if applicable.

```bash
$ k api-resources
NAME                              SHORTNAMES   APIGROUP                       NAMESPACED   KIND
bindings                                                                      true         Binding
componentstatuses                 cs                                          false        ComponentStatus
configmaps                        cm                                          true         ConfigMap
endpoints                         ep                                          true         Endpoints
events                            ev                                          true         Event
limitranges                       limits                                      true         LimitRange
namespaces                        ns                                          false        Namespace
nodes                             no                                          false        Node
persistentvolumeclaims            pvc                                         true         PersistentVolumeClaim
persistentvolumes                 pv                                          false        PersistentVolume
pods                              po                                          true         Pod
podtemplates                                                                  true         PodTemplate
replicationcontrollers            rc                                          true         ReplicationController
resourcequotas                    quota                                       true         ResourceQuota
secrets                                                                       true         Secret
serviceaccounts                   sa                                          true         ServiceAccount
services                          svc                                         true         Service
mutatingwebhookconfigurations                  admissionregistration.k8s.io   false        MutatingWebhookConfiguration
validatingwebhookconfigurations                admissionregistration.k8s.io   false        ValidatingWebhookConfiguration
customresourcedefinitions         crd,crds     apiextensions.k8s.io           false        CustomResourceDefinition
apiservices                                    apiregistration.k8s.io         false        APIService
controllerrevisions                            apps                           true         ControllerRevision
daemonsets                        ds           apps                           true         DaemonSet
deployments                       deploy       apps                           true         Deployment
replicasets                       rs           apps                           true         ReplicaSet
statefulsets                      sts          apps                           true         StatefulSet
tokenreviews                                   authentication.k8s.io          false        TokenReview
localsubjectaccessreviews                      authorization.k8s.io           true         LocalSubjectAccessReview
selfsubjectaccessreviews                       authorization.k8s.io           false        SelfSubjectAccessReview
selfsubjectrulesreviews                        authorization.k8s.io           false        SelfSubjectRulesReview
subjectaccessreviews                           authorization.k8s.io           false        SubjectAccessReview
horizontalpodautoscalers          hpa          autoscaling                    true         HorizontalPodAutoscaler
cronjobs                          cj           batch                          true         CronJob
jobs                                           batch                          true         Job
certificatesigningrequests        csr          certificates.k8s.io            false        CertificateSigningRequest
leases                                         coordination.k8s.io            true         Lease
eniconfigs                                     crd.k8s.amazonaws.com          false        ENIConfig
events                            ev           events.k8s.io                  true         Event
daemonsets                        ds           extensions                     true         DaemonSet
deployments                       deploy       extensions                     true         Deployment
ingresses                         ing          extensions                     true         Ingress
networkpolicies                   netpol       extensions                     true         NetworkPolicy
podsecuritypolicies               psp          extensions                     false        PodSecurityPolicy
replicasets                       rs           extensions                     true         ReplicaSet
ingresses                         ing          networking.k8s.io              true         Ingress
networkpolicies                   netpol       networking.k8s.io              true         NetworkPolicy
runtimeclasses                                 node.k8s.io                    false        RuntimeClass
poddisruptionbudgets              pdb          policy                         true         PodDisruptionBudget
podsecuritypolicies               psp          policy                         false        PodSecurityPolicy
clusterrolebindings                            rbac.authorization.k8s.io      false        ClusterRoleBinding
clusterroles                                   rbac.authorization.k8s.io      false        ClusterRole
rolebindings                                   rbac.authorization.k8s.io      true         RoleBinding
roles                                          rbac.authorization.k8s.io      true         Role
priorityclasses                   pc           scheduling.k8s.io              false        PriorityClass
csidrivers                                     storage.k8s.io                 false        CSIDriver
csinodes                                       storage.k8s.io                 false        CSINode
storageclasses                    sc           storage.k8s.io                 false        StorageClass
volumeattachments                              storage.k8s.io                 false        VolumeAttachment

```

Get Nodes. View pods within a given node.

```bash
> kubectl get nodes
NAME                         STATUS   ROLES    AGE    VERSION
ip-10-3-0-215.ec2.internal   Ready    <none>   200d   v1.14.7-eks-1861c5
ip-10-3-1-138.ec2.internal   Ready    <none>   27h    v1.14.7-eks-1861c5
ip-10-3-2-194.ec2.internal   Ready    <none>   137d   v1.14.7-eks-1861c5
ip-10-3-3-208.ec2.internal   Ready    <none>   14m    v1.14.7-eks-1861c5
[10:06:44] wyatt.munson@WCF-0047 /Users/wyatt.munson/code/gloomberg (0)
> kubectl get pods --all-namespaces -o wide --field-selector spec.nodeName
Error from server (BadRequest): Unable to find "/v1, Resource=pods" that match label selector "", field selector "spec.nodeName": invalid selector: 'spec.nodeName'; can't understand 'spec.nodeName'
[10:06:53] wyatt.munson@WCF-0047 /Users/wyatt.munson/code/gloomberg (1)
> kubectl get pods --all-namespaces -o wide --field-selector spec.nodeName=ip-10-3-0-215.ec2.internal
```

userarn: 'arn:aws:iam::468667468385:user/branden.dodge@westcreekfin.com'
username: branden.dodge@westcreekfin.com
groups: - 'system:masters'
