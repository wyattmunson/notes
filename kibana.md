# Kibana

## Looking up a k8s pod

> Sample `kubernetes.container.name: "magic-service"`

| tag                          | value                            |
| ---------------------------- | -------------------------------- |
| `kubernetes.container.image` | docker image and tag             |
| `kubernetes.container.name`  | "magic-service"                  |
| `kubernetes.labels.app`      | "magic-service"                  |
| `kubernetes.namespace`       | "prod"                           |
| `kubernetes.node.name`       | "ip-10-5-143-12.ec2.internal"    |
| `kubernetes.pod.name`        | "magic-service-77dcd94bfb-6lcpr" |
| `kubernetes.replicaset.name` | "magic-service-77dcd94bfb"       |
