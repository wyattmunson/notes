# Uniform Resource Locator

A URL is a type of a Uniform Resource Identifier

## A basic example

```bash
# model
scheme://host:port/path?query

# example
scheme://    host      :port/   path      ?   query
 https://www.benish.com:5051/api/getByName?firstname="greg"
```

**Scheme** - identifies the protocol to be used. In our example, we're securely requesting the data over HTTP with SSL encryption (e.g., `HTTPS`).

**Host** - identifies the host that holds the resource (e.g., `www.benish.com`).

**Port** - optional. In a typical HTTP call, which uses port 80, this value could be omitted. In this example, let's assume we're hitting a backend API on a specific port (e.g., `:5051`).

**Path** - identifies the specific resource on the host the client wants to access. Here, we're accessing the backend API's `getByName` resource. The API will return information about a user based on information we will supply in the query.

**Query** - provides some information to a resource in the form of a string. Here, we will supply a name for the user we want the API to return information about.

### Sample response

In your browser, going to `www.google.com` would return the wepage for google.com. In our example, however, the request is going to return a JSON object containg the information about a user based on some information we provided.

```json
{
  "firstName": "Greg",
  "lastName": "Benish",
  "age": 73,
  "city": "Billings",
  "cats": ["Little Whiskey", "Charles Prancin'", "Freezeout"]
}
```

## Understanding URIs

To understand a URL, it helps to understand the URI superset.

```
URI = scheme:[//authority]path[?query][#fragment]

# where authority is
authority = [userinfo@]host[:port]

# [] = optional
```

### Authority

In a generic URI syntax, the host and port in a URL is expanded into a broader `authority` in a URI. The key difference is the addition of a `userinfo@` string.

**`userinfo`**

Optional userinfo can be included followed by an `@` like so: `david@`. A password can be appended following a colon like so: `david:p@assw0rd:`, but this is depricated and an extremely poor security practice. You would never do that, right?

**`host`**

Same as in a URL: it can be a hostname (e.g., `www.benish.com`) or an IP address (e.g., `192.168.1.1`).

**`port`**

Same as above.
