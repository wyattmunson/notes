# Rego

## Rego Examples

99% of Rego statements are if conditions.

```
allow {
    input.method == "GET"
}

deny {
    input.method == "DELETE"
}
```

Rego statements can be combined in a single policy.

```bash
allow {
    input.method == "GET"
}

# OR operator between rules
allow {
    # AND operator within rules
    input.method == "PATCH"
    input.user.isAdmin == true
}

allow {
    # explicit not operator
    not input.user.email == "robin@harness.io"
}

deny {
    input.user.email = "robin@harness.io"
}
```

There is no need for explicit ANDs or ORs:

- The statements within the allow block are ANDed together
- Use multiple rules for the OR operator
- There is an explicity NOT operator

### Compare to JavaScript

Unlike JavaScript, for example,

```js
const allow = () => {
  return isGet() || isAdmin();
};

const isGet = () => {
  return input.method === "GET";
};

const isAdmin = () => {
  return input.method === "GET" && input.user.isAdmin;
};
```

```bash
allow {
    input.method == "GET"
}

allow {
    input.method == "PATCH"
    input.user.isAdmin == true
}
```

### Collaboration and Packages

Every policy in OPA is scoped to a package name. This is defined by the writer of the policy. Policies can be written to consume other packages.

Each team can create its own packages (`package secops`, `package developers`).

```
package security

deny ["Canno use unapproved ports"] {
    input.request.port
}
```

```bash
deny {
	header = input.request.headers[_].header
	header.type = "Age"
	header.value >= "300"
}
```

```json
{
  "reqest": {
    "headers": [
      {
        "header": {
          "type": "Age",
          "value": "300"
        }
      },
      {
        "header": {
          "type": "Content-Type",
          "value": "application/json"
        }
      }
    ]
  }
}
```

```bash
# static error message
deny ["Error message to display"] {
    ...
}

# dynamic error message (using string interpolation)
deny [sprintf("Complex error in step %s"), [input.pipline.name]] {
    ...
}

```

### Package definition and import

```bash
# package declaration
package opa.examples

# package import (advanced examples)
import data.servers

http_servers[server] {
    server := servers[_]
    server.protocols[_] == "http"
}

```

### Built-in functions

```bash
# comparison
x == y
x <= y

# numbers
x := a + b

# contains - true if string contains search
contains(string, search)


```

### User defined functions

```bash
# Deny pipelines that do not use allowed environments
deny[sprintf("deployment stage '%s' cannot be deployed to environment '%s'", [stage.name, stage.spec.infrastructure.environmentRef])] {
    stage = input.pipeline.stages[_].stage                                        # Find all stages ...
    stage.type == "Deployment"                                                    # ... that are deployments
    not contains(allowed_environments, stage.spec.infrastructure.environmentRef)  # ... that do not use one of the allowed environments
}

# Environments that can be used for deployment - try removing "test" from this list to see the policy fail
allowed_environments = ["dev", "test"]

contains(arr, elem) {
  arr[_] = elem
}
```
