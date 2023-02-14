# Ports

A port is an endpoint of communication; it's the docking point where data flows through. Ports are a logical contrcut, but are commonly used in the TCP and UDP protocols.

Ports are a way to multiplex. The IP address 192.168.1.1 can be extended by adding ports: 192.168.1.1:22, 192.168.1.1:80, ect.

A port number is a 16-bit unsigned integer (includes 0 and positive numbers), this ranging from 0 to 65535. Ports can range from

## Common port numbers

Port numbers 0 to 1024 are reserved for privileged services and are considered well known ports.
Registered Ports are 1024 to 49151
Dynamic ports (aka: private ports): 49152 to 65535

| Port   | Protocol   | Desscrption                   |
| ------ | ---------- | ----------------------------- |
| 1      | TMUX       | Used as a multiplexer         |
|        |            |                               |
| 20, 21 | FTP        | 20 as data and 21 as control  |
| 22     | SSH        |                               |
| 23     | Telnet     |                               |
| 25     | SMTP       | Simple Mail Transfer Protocol |
| 29     | MSG IGP    |                               |
| 37     | Time       |                               |
| 42     | Hostname   |                               |
| 43     | Whois      |                               |
| 53     | DNS        | Domain Name Service           |
| 80     | HTTP       |                               |
| 115    | SFTP       |                               |
| 123    | NTP        | Network Time Protocol         |
| 143    | IMAP       |                               |
| 179    | BGP        | Border Gateway Protocol       |
| 443    | HTTPS      |                               |
| 3306   | MySQL\*    | Default MySQL port            |
| 3389   | RDP        | Remote Desktop Protocol       |
| 3456   | Postgres\* | Default Postgres port         |
|        |            |                               |
|        |            |                               |
|        |            |                               |
|        |            |                               |

# IP Address

An IP address is a numerical identifier, e.g., 192.168.0.1, that is attached tro a computer network using Internet Protocol for communication. The IP address serves as an address for computers on a network

## Public IP Address

A public IP address is an IP address that can be accessed over the internet. If a computer, server, or router is assigned a public IP address, it is reachable by anyone over the internet.

## Private IP Addresses

Private IP addresses are those not accessable over the internet. They can only be accessed by other computers on the same network.

## Public IP address ranges

10.0.0.0 - 10.255.255.255
176.16.0.0 - 172.331.255.255
192.168.0.0 - 192.168.255.255
