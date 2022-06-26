# Kubernetes Troubleshooting

> NOTE: [TL;DR](#tl;dr)

## Prerequisite Understanding

It's helpful to have some shared terminology. I encourage you to read the Kubernetes and Helm documentation first. If it looks complicated, that's because it is.

- Understand what a deployment and service mean (in k8s lingo):
  - **Service**: abstraction of k8s routing/networking: defines port mappings, external DNS name (Ambassador annotation). Specifies how traffic from outside the container will reach the pod.
    - Services usually get created once on creation and are infrequently if ever updated.
  - **Deployment**: defines the pod, Docker image tag (version), environment variables, secrets, ect.
    - When deleting a pod, Kubernetes will immediately start a new one; when deleting a deployment, the record of the pod and its history are removed from k8s entirely.
- Understand how Kubernetes does blue/green deployments
  - k8s will not direct traffic to a new pod _until it's alive and ready_. If the new pod fails in some way, kubnernetes will continue to direct traffic to the good, old pod.
  - No matter how many additional deployments occur, if they all fail in some way, Kubernetes will continue to direct traffic to the last good pod (no matter how old that is).
- All kubectl and helm commands require the `-n` namespace flag. This flag will be omitted in this guide for simplicity.

## Troubleshooting Steps

> NOTE: all k8s commands require the `-n` namespace flag. This flag will be omitted in this guide for simplicity.

### 0. Check Pipeline Output

> NOTE: Successful pipelines don't guarantee successful deployments

**If the pipeline fails** - there's probably a syntax issue with the k8s configuration files. Your configuration failed spectacularly and Kubernetes rejected the operation. **Read the pipeline output** to help determine the issue - while noisy, the pipeline output will usually identify the issue.

**If the pipeline succeeds** - your k8s files are syntactically correct, but the values are incorrect.

**If the pipeline hangs** - and you're using the `helm-deplov2.sh` script, the new container has failed to enter a ready state. Inspect the pod in Kubernetes to debug the issue.

#### Connectivity failures?

Have you tried turning it on an off again? If the pipeline output implies a connectivity or authentication issue, try rerunning the job.

#### Misleading Successful Pipelines

Depending on how your pipeline deploys, a successful GitLab pipeline doesn't guarantee a successful deployment.

When using `kubectl apply`, a successful pipeline indicated the command was **sent** to Kubernetes successfully, not that the release was successful. In this case, the syntax of the configuration was valid and not rejected outright by k8s, the values of the configuration files may need refining.

#### Use the `helm-deploy-v2.sh` script

> NOTE: Link to Helm docs

This script uses `kubectl rollout` to verify the new pod is running and accepting traffic. This means confirmation of a successful deployment in the pipeline.

```bash
# Gitlab Pipeline Output

Helm completed. Querying cluster to verify release was successful...
Waiting for deployment "cat-facts-ui" rollout to finish: 0 of 1 updated replicas are available...
deployment "cat-facts-ui" successfully rolled out
```

Look for the text `successfully rolled out`. When you see this output, Kubernetes has confirmed the new pod is **running and accepting traffic**.

### 1. Get Pods

Get list of all pods in a given namespace.

```
k get pods -n dev
```

Checking pod status helps you quickly triage an issue.

```
wyatt.munson $ k get pods

NAME                                                      READY   STATUS            RESTARTS   AGE
adverse-action-loan-544cd9b7b4-sks9c                      1/1     Running           0          33d
application-edge-service-68c897b7c-2q69d                  1/1     CrashLoopBackOff  45         33d
applications-service-6664d8bdb4-hpch8                     1/1     Error Starting    0          32d
```

- `Running` - indicates the container was started and the pod is running fine and is considered ready by Kubernetes.
  - **Diagnose**: inspect the `describe service` for misconfiguration.
  - Problems exist at the networking level, e.g., bad port mappings, bad Ambassador annotation (DNS name configuration).
- `CrashLoopBackOff` - K8s has detected the container is crashing on start. Application may be panicking, or failing a healthcheck.
  - **Diagnose**: check the application logs for the pod.
  - Problems exist at the application level, e.g., secret value was incorrect and the app couldn't authenticate with the database.
  - Kubernetes will repeatedly attempt to restart any dead container, but will wait before doing so at an exponentially slower rate when in this state.
- `CreateContainerConfigError` - Kubernetes hasn't event attempted to start the container. Any problems exist outside of the application.
  - **Diagnose**: use describe pod and check events.
  - Problems exist at the kubernetes level, e.g., you referenced a non-existant k8s secret.

### 2. Describe Pod

Get details about a given pod.

```bash
# Get unique pod name using `kubectl get pods`
k describe pod/application-edge-service-68c897b7c-2q69d

# You can also describe the service
k describe service/application-edge-service

# Or, the deployment
k describe deployment/application-edge-service
```

Take note of the following fields in the output:

- `Namespace` - is it correct?
- `Containers.ContainerID` - is the version tag of the image correct (or present)?
- `Containers.PortID` - is the port correct (this is the port the application is listening on)?
- `Containers.Environment` - are expected environment variables present?
- `-----` - is the healthcheck route correct?
- `Events` - check here for any k8s error output. Issues with pulling the image or finding secrets will display here.

### 3. Get Logs

Applications logs can be pulled from the pod or the service.

Get application logs.

```bash
k logs po/<POD-NAME>

k logs po/adverse-action-loan-544cd9b7b4-sks9c
# get logs for last 10 minutes
k logs po/adverse-action-loan-544cd9b7b4-sks9c --since 10m
# tail logs
k logs po/adverse-action-loan-544cd9b7b4-sks9c --follow
```

This will show the logs from a given container. Logs will persist until the pod is deleted.

<!-- - *Secrets* -  -->

#### Get Service Logs

Service logs usually persist over several versions of a pod, meaning you can access logs from previous pods through the service.

```bash
k get logs service/adverse-action-loan
```

With each release, usually only the deployment is updated (e.g., new application image) and the service remains intact. The service is usually created on project creation and is infrequently updated.

Often times, a missing environment variable or failed database connection is the culprit for a `CrashLoopBackOff`. Good application logging can greatly help troubleshooting efforts.

Remember, if the container hasn't started, there will be no application logs. In this case, the problem is.

### 4. Check Secret Values

> NOTE: A secret must exist in AWS before it can be created in k8s.

```bash
# list all secrets
k get secrets

# get a given secret's values
# secret values are represented in base64
k get secret SECRET_NAME -o yaml

# decode a base64 encoded string
echo "secret-text" | base64 -d
```

- Does the secret exist in Kubenrtes?
- Does the secret exist in AWS. It must be created here first. Even if some values are in AWS and some are not, if any are missing the secret will not be created in k98s
- Are you referencing the secret key and value correctly?

```
k describe pod/....


Environment:
      SERVER_ENV:        dev
      NEUSTAR_PASSWORD:  <set to the key 'NEUSTAR_PASSWORD' in secret 'non-existant-secret'>  Optional: false
```

### 5. Get Events

Get all events in a given namespace.

```bash
k get events
```

This output will give you events across all pods in the namespace. Take note of the `First occured` field FIX THIS.

### 6. Port Forwarding

Use port forwarding to isolate networking problems.

```bash

k port-forward pod/...
curl localhost:4545/healthcheck

k port-forward service/cat-facts-ui
curl localhost:4545/healthcheck
```

**Cannot hit pod** - port mapping issue

**Cannot hit service** - service cannot hit pod.

### 7. Ambassador Configuration

> NOTE: This step is only necessary if the service needs to be accessable externally from a domain name like (`service.dev.westcreekfin.com`).

If your pod is available via port forwarding, but cannot be accessed via its DNS name the issue lies with

This is a two step process:

1. A Route 53 entry points a DNS entry to the Ambassador load balancer
1. An ambassador annotation create a route table entry that routs a DNS name to a Kubernetes pod

#### Debug DNS Entry

```bash
dig apply.dev.westcreekfin.com
```

This should return the IP addresses of the AWS load balancers (`10.2.x.x` or `10.3.x.x` addresses).

#### Check Ambassador Console

```bash
# get ambassador pod name
k get pod -n default

# port forward to pod
k port-forward pod/ambassador-68c8c8fd54-tbcmb 8877
```

Access http://localhost:8877/ambassador/v0/diag/ in your web browser.

If y

## Rolling Back with Helm

Roll backs. What's in your wallet?

### Rolling back vs. deploying a revert commit vs. redeploying

The short answer is that **rolling back** guarantees you immediately revert to the last known working version; however, evidence of this is not captured in GitLab or git.

**Rerunning the deployment stage** for a previous pipeline is the fastest way to redeploy a older version using only the GitLab UI. Depending on the age of the pipeline, artifacts may have expired which will invalidate this option. History of re-deployment would be captured in GitLab, but not in git. Remember not to rerun the entire pipeline.

**Reverting commits** can be a slower option depending on the runtime of the pipeline. Repos may have merged, but undeployed code hoarded in master - it may be undesirable or confusing to remove it. This option, however, cements the operation in the GitLab and git histories, if such a record is desired.

### Rolling back with Helm

#### List Helm Release `helm ls`

A Helm release is a deployed version of your application. Each subsequent version is a new release.

```
helm ls
```

```
NAME                                	NAMESPACE	REVISION	UPDATED                                	STATUS  	CHART                                             	APP VERSION
application-edge-service            	dev      	2       	2020-07-01 17:49:36.624466184 +0000 UTC	failed  	application-edge-service-1                        	0.5.0
cat-facts-ui                        	dev      	1       	2020-07-11 21:50:44.54027864 +0000 UTC 	deployed	cat-facts-ui-bleeding-edge                        	1.1.22
```

#### See status of Helm Release `helm status`

```
wyatt.munson@WCF-0047 $ helm status cat-facts-ui

NAME: cat-facts-ui
LAST DEPLOYED: Sat Jul 11 21:50:44 2020
NAMESPACE: dev
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

See full output with manifest that will include all the helm values. **Use the command below to verify all values are set correctly**.

```bash
# see full output of helm release including all values
$ helm status cat-facts-ui -o yaml
```

#### See history of Helm releases `helm history`

> NOTE: `kubectl` equivalent is `kubectl rollout history`

```bash
$ helm history cat-facts-ui
```

```bash
wyatt.munson@WCF-0047 $ helm history document-generator
REVISION	UPDATED                 	STATUS    	CHART                           	APP VERSION	DESCRIPTION
29      	Mon Sep 14 16:36:24 2020	superseded	document-generator-bleeding-edge	0.29.30    	Upgrade complete
30      	Mon Sep 14 17:08:07 2020	deployed	  document-generator-bleeding-edge	0.29.31    	Upgrade complete
31      	Mon Sep 14 18:40:24 2020	failed	    document-generator-bleeding-edge	0.29.34    	Upgrade complete
32      	Mon Sep 14 19:20:36 2020	failed	    document-generator-bleeding-edge	0.29.35    	Upgrade complete
```

Using helm history you can see the status of all previous deployments. Note

> NOTE: It's intended Kubernetes behavior that the last known good version will continue to be served.

#### Rollback with `helm rollback`

```bash
$ helm rollback RELEASE [REVISION]

# rollback to the previous release
$ helm rollback cat-facts-ui

# rollback to revision number 12
# use `helm history` to get revision numbers
$ helm rollback cat-facts-ui 12

```

## Rollback with `kubectl`

> WARNING: Do **not** use kubectl rollback commands if Helm was used for the deploy

If you did _not_ use Helm, kubectl has built in commands for handling rollbacks.

### See release history (`kubectl rollout history`)

```bash
kubectl rollout history deployment/DEPLOYMENT_NAME
kubectl rollout history deployment/cat-facts-ui
```

```bash
# See deployment history for a given deployment
$ k rollout history deploy/cat-facts-ui

deployment.extensions/cat-facts-ui
REVISION  CHANGE-CAUSE
1         <none>
2         <none>

# See details including image name and tag
$ k rollout history deploy/cat-facts-ui --revision=1
```

### Rollback (`kubectl rollout undo`)

> WARNING: Don't use these commands if pod was deployed using Helm

```bash
kubectl rollout undo deployment/DEPLOYMENT_NAME

# Rollback to the previous deployment
kubectl rollout undo deployment/cat-facts-ui

# Rollback to specific deployment
kubectl rollout undo deployment/cat-facts-ui --to-revision=2
```

### Healthy Output of Running Container

```
wyatt.munson@WCF-0047 $ k describe po/cat-facts-ui-849f888dbc-lwwfh
Name:           cat-facts-ui-849f888dbc-lwwfh
Namespace:      dev
Priority:       0
Node:           ip-10-3-2-9.ec2.internal/10.3.2.9
Start Time:     Thu, 13 Aug 2020 16:00:59 -0400
Labels:         app=cat-facts-ui
                app.kubernetes.io/instance=cat-facts-ui
                app.kubernetes.io/name=cat-facts-ui
                pod-template-hash=849f888dbc
                release=cat-facts-ui
Annotations:    kubernetes.io/psp: eks.privileged
Status:         Running
IP:             10.3.2.160
IPs:            <none>
Controlled By:  ReplicaSet/cat-facts-ui-849f888dbc
Containers:
  cat-facts-ui:
    Container ID:   docker://ca7160614b34032cdd729cfd1a2c46ed0f551c7e5d2a568e72663775f2da574f
    Image:          docker.internal.westcreekfin.com/westcreek/example-projects/cat-facts-ui:1.1.22
    Image ID:       docker-pullable://docker.internal.westcreekfin.com/westcreek/example-projects/cat-facts-ui@sha256:8fd506a8844991c1ecb6bc202f025be5a340f4e2d79a6e4d7ff0dead68c4ed8a
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Thu, 13 Aug 2020 16:01:57 -0400
    Ready:          True
    Restart Count:  0
    Liveness:       http-get http://:5000/ delay=15s timeout=15s period=10s #success=1 #failure=3
    Readiness:      http-get http://:5000/ delay=5s timeout=3s period=10s #success=1 #failure=3
    Environment:
      SERVER_ENV:  dev
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-gzq4z (ro)
Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
Volumes:
  default-token-gzq4z:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-gzq4z
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:          <none>
```

### Bad Container Deployed After Good Container

Here a

```
cat-facts-ui-6886467ffc-rcb84                             0/1     ContainerCreating   0          16s
cat-facts-ui-849f888dbc-lwwfh                             1/1     Running             0          36d
```

```
k get pod/cat-facts-ui-6886467ffc-rcb84
NAME                            READY   STATUS                       RESTARTS   AGE
cat-facts-ui-6886467ffc-rcb84   0/1     CreateContainerConfigError   0          29s
```

### Event Ouput of bad container

```bash
Events:
  Type     Reason     Age               From                                 Message
  ----     ------     ----              ----                                 -------
  Normal   Scheduled  81s               default-scheduler                    Successfully assigned dev/cat-facts-ui-6886467ffc-rcb84 to ip-10-3-1-212.ec2.internal
  Normal   Pulling    7s (x6 over 80s)  kubelet, ip-10-3-1-212.ec2.internal  Pulling image "docker.internal.westcreekfin.com/westcreek/example-projects/cat-facts-ui:1.1.23"
  Normal   Pulled     7s (x6 over 61s)  kubelet, ip-10-3-1-212.ec2.internal  Successfully pulled image "docker.internal.westcreekfin.com/westcreek/example-projects/cat-facts-ui:1.1.23"
  Warning  Failed     7s (x6 over 61s)  kubelet, ip-10-3-1-212.ec2.internal  Error: secret "non-existant-secret" not found
```

### Test

## TL;DR

> NOTE: Remember the `-n` namespace flag for every command

```bash
# git list of pods in a given namespace
k get pods

# describe pod and service for detailed config
k describe pod/cat-facts-ui-849f888dbc-lwwfh
k describe service/cat-facts-ui

# see application logs from pod or service
k logs pod/cat-facts-ui-849f888dbc-lwwfh
k logs service/cat-facts-ui

# get namespace-wide events
k get events -n dev

# get secrets in a given namespace
k get secrets
# see base-64 encoded values for a given secret
k get secret some-secret-name -o yaml
# decode a base64 string
echo "BASE_64_ENCODED_STRING" | base64 -d

# port forward to pod, access on you machine as localhost:4545
k port-forward pod/cat-facts-ui-849f888dbc-lwwfh 4545:80
# port forward to serivce, access on you machine as localhost:4545
k port-forward service/cat-facts-ui 4545:80
```
