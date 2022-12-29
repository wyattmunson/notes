# Wonderful World of Networking

## Networking Terminal Commands

```bash
# see computer's current ARP table
# show's other devices on network
# only shows devices your computer has interacted with
arp -a

```

## Linux networking commands

Will not work on macOS

```bash
# see current internal IP address
hostname -i
# -> 192.168.1.1

# see router default gateway IP
ip r | grep default

# uk
netstat -nr
```

## ifconfig

```bash


```

- `eth0` - ethernet
- `wlan0` - wifi

## Netstat

`netstat` - show list of all active TCP connections between host device and foreign networks

## Notes

- Use [MAC address lookup tool](http://www.coffer.com/mac_find/) in combination with `arp -a` to narrow down devices based on MAC address.
- See network gateway macOS `netstat -nr | grep default`
- 
