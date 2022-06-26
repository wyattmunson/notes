# CloudWatch

Watch logs from the cloud.

## CloudWatch Logs Query Syntax

### JSON

Given the follow JSON object...

```json
{
  "eventType": "PutObject",
  "destinationIP": "192.188.1.45",
  "someArray": ["Greg", "Benish"],
  "someArrayOfObjects": [
    {
      "name": "Greg",
      "id": 100
    },
    {
      "name": "David",
      "id": 101
    }
  ],
  "someNullValue": null,
  "someBooleanValue": true,
  "someObject": {
    "title": "Corporate Swashbuckler"
  }
}
```

... the following filters would match

```json
{$.eventType = "PutObject"}
```

```json
{$.destinationIP = 192.168.*}
```

```json
{ $.someArray = "Greg" }
```

```json
{ $.someArrayOfObjects[0].name = "Greg" }
```

```json
{ $.someNullValue IS NULL }
```

```json
{ $.someNonexistantValue NOT EXISTS }
```

```json
{ $.someBooleanValue IS TRUE }
```

**Compound Queries**

```json
// Matches above
{ ($.someObject.title = "Corporate Swashbucker") && ($.someBooleanValue IS TRUE)}
```

```json
{ $.}
```

### Kubernetes Log Example

Search filter syntax:

```
{ $.kubernetes.container_name = "loans-service"}
```

```json
{
  "log": "I0504 19:19:49.925545       1 rules.go:82] stage/transunion-service-ingress: modifying rule 1 on arn:aws:elasticloadbalancing:us-east-1:947227295406:listener/app/706a2cf8-stage-transunions-e7ee/6f6001ece4c02bb1/18d9a225b4662af1\n",
  "stream": "stderr",
  "docker": {
    "container_id": "45f759c9b1bd76d79436a3d98c75bd5fe3ff99147622fb0efd397bbdd056500a"
  },
  "kubernetes": {
    "container_name": "alb-ingress-controller",
    "namespace_name": "kube-system",
    "pod_name": "alb-ingress-controller-597bfc9958-h6ld8",
    "container_image": "amazon/aws-alb-ingress-controller:v1.1.4",
    "container_image_id": "docker-pullable://amazon/aws-alb-ingress-controller@sha256:d5935904d3d77dad4ccc6b51f5b523e3f0f3618daa0bee69f4a34a5f6ed71144",
    "pod_id": "b4ceb02d-1d08-11ea-ad37-02fcce14c20b",
    "labels": {
      "pod-template-hash": "597bfc9958",
      "app_kubernetes_io/name": "alb-ingress-controller"
    },
    "host": "ip-10-3-0-215.ec2.internal",
    "master_url": "https://172.20.0.1:443/api",
    "namespace_id": "ae81d727-1163-11ea-ad37-02fcce14c20b"
  }
}
```

```json
{ $.kubernetes.container_name = "alb-ingress-controller"}
```

This first log example is seen with internal Kubernetes containers. For application-level logging, see the next example:

### Kubernetes Log Example 2

```json
{
  "log": "{\"level\":\"info\",\"time\":1588607336565,\"pid\":17,\"hostname\":\"applications-ui-847d84f66-6vwzl\",\"req\":{\"id\":16,\"method\":\"POST\",\"url\":\"/api/customers/search\",\"headers\":{\"host\":\"apply.dev.westcreekfin.com\",\"user-agent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:75.0) Gecko/20100101 Firefox/75.0\",\"accept\":\"application/json, text/plain, */*\",\"accept-language\":\"en-US,en;q=0.5\",\"accept-encoding\":\"gzip, deflate, br\",\"authorization\":\"[Redacted]\",\"content-type\":\"application/json;charset=utf-8\",\"correlation-id\":\"bbcc4170-8e1e-11ea-ac88-a70a7bf2e970:c34036f0-8e1e-11ea-ac88-a70a7bf2e970\",\"content-length\":\"48\",\"origin\":\"https://apply.dev.westcreekfin.com\",\"referer\":\"https://apply.dev.westcreekfin.com/?dealerId=756a1256-0e18-4ced-9828-a33955c4426d\",\"cookie\":\"[Redacted]\",\"x-forwarded-proto\":\"http\",\"x-request-id\":\"84a15288-8527-42a4-867b-8f75fc944f44\",\"x-envoy-expected-rq-timeout-ms\":\"8000\",\"x-envoy-original-path\":\"/api/customers/search\"},\"remoteAddress\":\"::ffff:10.3.1.232\",\"remotePort\":44482},\"res\":{\"statusCode\":404,\"headers\":{\"correlation-id\":\"bbcc4170-8e1e-11ea-ac88-a70a7bf2e970:c34036f0-8e1e-11ea-ac88-a70a7bf2e970\",\"content-type\":\"text/plain; charset=utf-8\",\"content-length\":\"9\"}},\"responseTime\":13,\"msg\":\"request completed\",\"v\":1}\n",
  "stream": "stdout",
  "level": "info",
  "pid": 17,
  "hostname": "applications-ui-847d84f66-6vwzl",
  "req": {
    "id": 16,
    "method": "POST",
    "url": "/api/customers/search",
    "headers": {
      "host": "apply.dev.westcreekfin.com",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:75.0) Gecko/20100101 Firefox/75.0",
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.5",
      "accept-encoding": "gzip, deflate, br",
      "authorization": "[Redacted]",
      "content-type": "application/json;charset=utf-8",
      "correlation-id": "bbcc4170-8e1e-11ea-ac88-a70a7bf2e970:c34036f0-8e1e-11ea-ac88-a70a7bf2e970",
      "content-length": "48",
      "origin": "https://apply.dev.westcreekfin.com",
      "referer": "https://apply.dev.westcreekfin.com/?dealerId=756a1256-0e18-4ced-9828-a33955c4426d",
      "cookie": "[Redacted]",
      "x-forwarded-proto": "http",
      "x-request-id": "84a15288-8527-42a4-867b-8f75fc944f44",
      "x-envoy-expected-rq-timeout-ms": "8000",
      "x-envoy-original-path": "/api/customers/search"
    },
    "remoteAddress": "::ffff:10.3.1.232",
    "remotePort": 44482
  },
  "res": {
    "statusCode": 404,
    "headers": {
      "correlation-id": "bbcc4170-8e1e-11ea-ac88-a70a7bf2e970:c34036f0-8e1e-11ea-ac88-a70a7bf2e970",
      "content-type": "text/plain; charset=utf-8",
      "content-length": "9"
    }
  },
  "responseTime": 13,
  "msg": "request completed",
  "v": 1,
  "docker": {
    "container_id": "ce5972e9793af7f05c4e1aa85038c57ee0057b8ade7fe40fe27afef42ac2a423"
  },
  "kubernetes": {
    "container_name": "app",
    "namespace_name": "dev",
    "pod_name": "applications-ui-847d84f66-6vwzl",
    "container_image": "docker.internal.westcreekfin.com/westcreek/applications/applications-ui:32dbd8b8.dev",
    "container_image_id": "docker-pullable://docker.internal.westcreekfin.com/westcreek/applications/applications-ui@sha256:dfa4f70a7fac4722af320bce8128c1642a8bc916838b6d3fcf708d21e4a7e636",
    "pod_id": "900ff141-8b12-11ea-91c5-02620e148e33",
    "labels": {
      "app": "applications-ui",
      "pod-template-hash": "847d84f66"
    },
    "host": "ip-10-3-1-107.ec2.internal",
    "master_url": "https://172.20.0.1:443/api",
    "namespace_id": "f4567171-3e0c-11ea-abe9-0aeebb1a2381"
  }
}
```

```json
{ $.kubernetes.labels.app = "loans-service"}
```

Kibana

```json
{ $.kubernetes.labels.app : "applications-ui"}
```
