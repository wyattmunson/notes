# Helm

## Common Commands

```bash
$ helm install [NAME] [CHART]

# install from PWD
$ helm install --set version=1.57.0 . --name-template=frontend

# successful commands
helm install ./infra/helm --name-template=frontend
helm upgrade applications-ui --set version=1.57.0 ./infra/helm
helm upgrade applications-ui --set version=1.57.0 .
helm install . --name-template=applications-ui

# values
$ helm get values front-end

# Add help repo
helm repo add influxdata https://influxdata.com
```

Creating helm charts

```bash
# Verify helm chart in syntatically correct
helm lint .

# Create template - to verify output during testing
helm template NAME .

# Package chart
helm package .

helm template applications-ui . -f dev-values.yaml
helm lint -f dev-values.yaml
```

Viewing deployed charts

```bash
# viewing installed charts
helm ls --all-namespaces

# view release history
helm history aws-ebs-csi-driver -n default
```

## Helm Files

### Chart.yaml

```yaml
apiVersion: v1
name: ebs-csi-driver
version: 0.0.1
appVersion: 1.0.0
description: Creekitized Helm chart for the ebs-csi-driver
keywords:
  - ebs
  - ebs-csi-driver
  - kubernetes
maintainers:
  - name: wmunson
    email: wyatt.munson@westcreekfin.com
```
