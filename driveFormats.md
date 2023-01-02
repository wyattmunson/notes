# Hard Drive Formats

## Formats

### NTFS

New Technology File System developed for WindowsNT. Any relatively modern Windows machine uses NTFS.

Use this option if you're only sharing between Windows devices.

### HFS+

HFS+, or MacOS Extended, was created for MacOS. Drives using time machine must be formatted with the additional HFS+ Journaled format.

Use this option if you're only sharing between Mac devices.

### FAT / FAT32 / exFAT

File Allocation Table is a format that can be read and written to by Windows and Mac.

exFAT is the newest option - if using some variant of FAT, choose exFAT.

#### FAT Warning

FAT is not "journaled" like NTFS or HFS, meaning a power outage or bumped drive can cause a catastophic loss of data, unlike NTFS or HFS.

## Format Compatability

|         | NTFS         | HFS+         | FAT          |
| ------- | ------------ | ------------ | ------------ |
| Windows | Read / Write | None         | Read / Write |
| Mac     | Read only    | Read / Write | Read / Write |
