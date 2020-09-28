---
title: "Terraform and Azure CosmosDB"
date: 2020-09-23
categories:
  - Terraform
tags:
  - Terraform
  - CosmosDb
comments: true
---

Recently I was creating Terraform IaaC solution for Azure CosmosDB. First step
was to find if there is en exising terraform module, which I could use for our
needs. Unfortunately, there is no official module in Terraform Registry, like
one for [Azure PostgreSQL](https://registry.terraform.io/modules/Azure/postgresql/azurerm/2.1.0).

After some searching, I've found [CosmosDB module from Microsoft Cobalt](https://github.com/microsoft/cobalt/tree/master/infra/modules/providers/azure/cosmosdb)
repository. While it's better than nothing, still it don't look like production
ready - sparse documentation, weird tagging, low popularity and questionable
support.

So I've created our own module, and I'd like to share some thoughts on current
state of Azure CosmosDB Terraform support.

## Capabilities

As it turned out, capabilities are very important for creation of CosmosDB. But
documentation on capabilities is really confusing.

For example, capabilities on [Argument Reference](https://www.terraform.io/docs/providers/azurerm/r/cosmosdb_account.html#argument-reference)
is listed twice:

![First reference](/assets/images/cosmosdb-capabilities1.png)

Second reference:

![Second reference](/assets/images/cosmosdb-capabilities2.png)

Why capabilities are mentioned twice on `azurerm_cosmosdb_account`? What's the
difference? Why lists of supported capabilities are different?

Furthermore, since supported capabilities are tightly coupled with provider
version, it looks like that if even if provider already supports them, it may
still not be in documentation.

## CosmosDB API for Mongo

I've mentioned that capabilities are important. They allow you to pick the
MongoDB API version to be used(which will reflect to server version in Azure
Portal).

Here's what I've find out after some experimentations:

- `No capabilites` - server version 3.2 will be created
- `MongoDBv3.4` - server version 3.2 with 3.4 API support(determined in CLI as
  server version 3.4
- `EnableMongo` - server version 3.6 will be created.

List of supported capabilities depends on provider version and is a subject to
change.

In our case, it was worth always use `EnableMongo` to receive 3.6 compatible API.
Unsharded collection under database with throughput let's us synchronize
databases without pain amending sharded keys.

## Throughput

Another topic which I was confused about. As I understand it, you can assign
throughput on following levels:
- Database
  - dedicated throughput - RU/s are set per collection in DB
  - shared throughput - RU/s are shared among collections in DB
- Collection

You can also set following types of throughput:
- Manual - exact value, with minimum of 400 RU/s
- Autoscale - throughput will be provisioned on demand, with minumum 4000 RU/s

In Terraform, despite the fact that according to documentation `throughput must
be set upon database creation otherwise it cannot be updated without a manual
Terraform destroy-apply`, I was able to:
 - Successfully increase and decrease database throughput

## Backups

Initially, CosmosDB's built-in solution for backups supported only following:
- Backups are performed every 4 hours
- 2 copies of data are retained

Recently, Microsoft added support for [backup interval and retention period]( https://docs.microsoft.com/en-us/azure/cosmos-db/online-backup-and-restore#modify-the-backup-interval-and-retention-period).

At the time of writing, Terraform don't support setting backup interval or
retention period. To implement backups you have following optinos:
- Use CosmosDB's built-in solution with default options.
- Manually tweak interval or retention period
- Build your own backup solution

## Syncronizing data

While using of CosmosDB API for MongoDB v3.6 solved sharded key issue for us,
it bring it's own issues. For example, we couldn't restore backup using
`mongorestore`, with following error message:

```
Exception: This MongoDB deployment does not support retryable writes. Please
add retryWrites=false to your connection string.
```

Adding this option to connection URI didn't help. Maybe it will work on older
versions of `mongorestore` but we find another way.

`Azure Database Migration Services` worked like a charm, transferring all data
from On-Prem to Azure CosmosDB v3.6. While it's a bit pricy, all data were
synched successfully. Azure DMS supports both offline and online sync, which you
can pick depending on your needs.

## Summary

Even with all mentioned issues, ability to have databases as IaaC and scale them
on demand, outweighs the cons. While we've not reached prod with CosmosDB yet,
first dozen of databases are handed to developers for testing.

Worth mentioning the Microsoft released to preview [Azure Cosmos DB serverless](https://docs.microsoft.com/en-us/azure/cosmos-db/serverless)
which looks very promising and suits our need even better.(Though there are no
support for MongoDB yet).
