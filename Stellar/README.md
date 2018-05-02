# Stellar node
## Compute requirements
CPU, RAM, Disk and network depends on network activity.

As of early 2018, stellar-core with PostgreSQL running on the same machine has no problem running on a m5.large in AWS (dual core 2.5 GHz Intel Xeon, 8 GB RAM).

Storage wise, 20 GB seems to be an excellent working set as it leaves plenty of room for growth.

## Network access
### Interaction with the peer to peer network
* inbound: stellar-core needs to allow all ips to connect to its PEER_PORT (default 11625) over TCP.
* outbound: stellar-core needs access to connect to other peers on the internet on PEER_PORT (most use the default as well) over TCP.

### Interaction with other internal systems
* outbound:
stellar-core needs access to a database (postgresql for example), which may reside on a different machine on the network
other connections can safely be blocked
* inbound: stellar-core exposes an unauthenticated HTTP endpoint on port HTTP_PORT (default 11626)
it is used by other systems (such as Horizon) to submit transactions (so may have to be exposed to the rest of your internal ips)
query information (info, metrics, …) for humans and automation perform administrative commands (schedule upgrades, change log levels, …)

# Install node
## installation of horizon and stella-core

* install Go
>https://golang.org/doc/install     --- download tar file
>https://medium.com/@patdhlk/how-to-install-go-1-9-1-on-ubuntu-16-04-ee64c073cd79

* install horizon 
>https://github.com/stellar/go/tree/master/services/horizon

* install pandoc
>https://github.com/jgm/pandoc/releases/tag/2.2

* install stella-core
>https://github.com/stellar/stellar-core/blob/master/INSTALL.md
