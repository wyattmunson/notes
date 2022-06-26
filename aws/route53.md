# Route 53

DNS through AWS.

What is it? What does it do? No one knows for sure.

## Definitions and things

**Hosted Zones** - are containers for records. Records contain information about about how you want to route traffic for a domain (catcorp.com) and its subdomains (admin.catcorp.com). There are two types:

- Public hosted zones - how you want to route traffic on the internet
- Private hosted zones - how you want to route traffic witin an Amazon VPC.

Example hosted zone

```
catcorp.com
```

#### Records

After you create a hosted zone for a domain, you create records to tell DNS how you want traffic to be routed

- Route traffic for catcorp.com to a private data center
- Route email (fuzz.aldrin@catcorp.com) to a mail server (mail.catcorp.com)
- Route traffic for a subdomain called protal.catcorp.com to the IP address of a different host

**Record Types**

- **A** - IPv4 address in dotted decimal notation
  - `192.168.1.1`
- **CNAME** - same format as domain name, excludes zone apex
  - `customers.catcorp.com`
- **MX** - Mail eXchanger. specify domain name and priority
  - Priority is indicated by a number from 0 to 65535 with lower numbers being routed to first. If you have two different priorty numbers, traffic is always routed to the first one unless it's unavailable. If you two of the same priority numbers, traffic is routed equally between them
  - `10 mail.catcorp.com`
- **NS** - specify the name servers for the hosted zone. Value is the domain of a name server.
  - Amazon automatically includes a NS and SOA record in each hosted zone
  - `ns-5.catcorp.com`
- **SOA** - Start of Authority record. Provides information about the domain and corresponding Route 53 hosted zone.
  - Amazon automatically includes a NS and SOA record in each hosted zone
- **SRV** - consits of four space delimited values: priority, weight, port, and domain name.
  - `15 5 443 hostname.catcorp.com`

**Route 53 Automatic NS and SOA**

Route 53 automatically creates a NS and SOA record. Do not change these records.

NS Records

Do not alter. Whoops.

```
# Sample format for NS records

ns-2048.awsdns-64.com
ns-2049.awsdns-65.net
ns-2050.awsdns-66.org
ns-2051.awsdns-67.co.uk
```

Start of Authroity Records

This record identifies the base DNS information about the domain.

```
# sample start of autority record

ns-2048.awsdns-64.net. hostmaster.example.com. 1 7200 900 1209600 86400
```

Additional details about record types:

DNS does not allow for CNAME records at the top node of the namespace (aka zone apex). If the DNS name is registered as `catcorp.com`, it is the zone apex and no CNAME record can be made for it. CNAME records can be made for `www.catcorp.com` or `portal.catcorp.com`.

#### Choosing a routing policy

AWS Docs: [Choosing a Routing Policy](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html)

### Add new route 53 hosted zone in separate account from base domain

Premise: 1G account has `westcreekfin.com` and you want to create `stage.westcreekfin.com` in a new account.

HOW TO:

- Create new hosted zone in new account `stage.westcreekfin.com`.
  - This will create a two record sets: a NS and SOA record.
- Create a new record set in the old account `stage.westcreekfin.com`.
  - Select `NS` record.
  - Set the value to the records that populated in the auto created `NS` record in the new account.
  - Hope for magic
