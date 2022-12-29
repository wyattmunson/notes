# Bash

Get drangerous in bash.

## What is Bash?

Simply put, Bash is a Unix shell that allows you to enter commands and write programs (know as bash scripts). It's widely used as it ships as the defauly login shell for most versions of Linux and MacOS since Mojave. There's even an Windows version.

Bash is short for "Borne-again shell" a tounge-in-cheek reference to the shell it replaced: the Borne shell (sometime stylized as `sh`). It's more formally known as GNU Bash.

Many alternatives to Bash exist, like ZShell or fish; however, their different implmentations means their scripts are incompatable. For exmaple, Bash uses logical operators like `! && ||` while in fish they're written as `not and or`. Use can use a [shebang](#shebang) to force the file to be interpreted using bash regardless of what shell it's called from.

## Bash concepts

### Calling a bash script

```bash
bash yourScript.sh
```

### bash vs. sh

**Bash**, or Borne Again Shell, is the most common default login shell (a command line interface). It's widly used in as the default in Linux and has been added in Windows 10. Ironically, around that time it was removed as the default shell for macOS. Mojave is last release to uship with bash.

Borne Shell (**sh**) is Bash's older cousin.

### Shebang

A "shebang" tell's the current shell what interpreter to use. It's placed at the top of the file.

```bash
#!/bin/bash
```

So you can call a file using `sh`, but it will still execute using `bash` if the file includes a shebang.

```bash
sh someFile.sh
```

### Location

Bash is actually a file in your computer. Specfically a binary. `/bin/bash` is it's location in the filesystem.

```bash
↪ file /bin/bash
/bin/bash: Mach-O 64-bit executable x86_64
```

### Input/Output redirection

- `<`: redirect contents of file to the program
- `>`: takes STDOUT of specified program and writes it to a given file. If the file exists, the contents are overwritten.
- `>>`: takes STDOUT of specified program and adds it to a given file. If the files exists, the redirect is appended to the contents of the file.
- `|`: takes output of given program and redirects it as input to another program. This process is known as piping. (`ls | grep "2004"` is a good example, using `ls` and `grep` to find files with a matching Regex pattern.)

## `.bash_profile`, `.bashrc`, and `.profile`

These are initialization files (scripts) that are run when bash is invoked. They may set variables or add something to you `$PATH`. While file is run depends how bash is invoked (e.g., login, purely interactive, ect.).

### Interactive, login, nonlogin

### `.bash_profile` - Login shells

`.bash_profile`: gets executed for login shell. OS X is unique in that it logs in everytime you open a new instance of the terminal.

Commands that will invoke a login shell:

```
sudo su -
bash --login
ssh user@root
```

When bash is invoked as a login shell, these files are executed in order:

1. `/etc/profile`
2. `~/.bash_profile`
3. `~/.bash_login`
4. `~/.profile`

### `.bashrc` - Interactive shells (no login)

`.bashrc`: gets exected for non login, but still interative shells. It's also executed when you run `/bin/bash`.

Commands that will invoke a purely interavtive shell:

```
sudo su
bash
ssh user@host /path/to/command
```

Non-interactive shells

Shells that do not automatically execute any scripts like `~/.bashrc`.

```

```

## See Current Shell

```bash
# see linux distro version
$ cat /etc/*-release

PRETTY_NAME="Debian GNU/Linux 10 (buster)"
NAME="Debian GNU/Linux"
VERSION_ID="10"
VERSION="10 (buster)"
VERSION_CODENAME=buster
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
```

```bash
$ lsb_release -a



```

```bash
$ uname -a
Linux cbebaf34eebf 4.19.76-linuxkit #1 SMP Thu Oct 17 19:31:58 UTC 2019 x86_64 GNU/Linux

$ uname -mrs
Linux 4.19.76-linuxkit x86_64
# Linux = Kernel name
# 4.19.76-linuxkit = Kernel version number
# x86_64 = machine hardware name
```

```bash
$ cat /proc/version
Linux version 4.19.76-linuxkit (root@d203b39a3d78) (gcc version 8.3.0 (Alpine 8.3.0)) #1 SMP Thu Oct 17 19:31:58 UTC 2019
```

## Pack resolution Problem

## Resolve packages

https://launchpad.net/ubuntu/+ppas?name_filter=ondrej

```
E: Failed to fetch http://ppa.launchpad.net/ondrej/php/ubuntu/dists/bionic/InRelease  403  Forbidden [IP: 91.189.95.83 80]
E: The repository 'http://ppa.launchpad.net/ondrej/php/ubuntu bionic InRelease' is not signed.
N: Updating from such a repository can't be done securely, and is therefore disabled by default.
N: See apt-secure(8) manpage for repository creation and user configuration details.
```

Find the PPA:

- `https://launchpad.net/ubuntu/+ppas?name_filter=ondrej`
- https://launchpad.net/~ondrej/+archive/ubuntu/php

Go to `Adding this PPA to your system` > `Technical details about this PPA`

1024R/14AA40EC0831756756D7F66C4F4EA0AAE5267A6C

sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 75BCA694

```bash
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 14AA40EC0831756756D7F66C4F4EA0AAE5267A6C

deb http://ppa.launchpad.net/ondrej/php/ubuntu bionic main
deb-src http://ppa.launchpad.net/ondrej/php/ubuntu bionic main

```

## Bash Things

### Shebang

Start bash scripts with a "shebang" to tell the interpreter what shell to use.

```bash
#!/bin/bash
```

## Common Bash Commands

### ls

**`ls -l` output**

The `-l` flag indicates a list in long format.

```

\$ ls -l

-rw-r--r-- 1 wyatt staff 721 May 2 19:46 bash.md
^ ^ ^ ^ ^ ^ ^
A B C D E F G

```

Key:

- A: File permissions
- B: Links
- C: Owner
- D: Group
- E: File size
- F: Date
- G: File name

A. File Permissions

```
-rw-r--r--
FUUUGGGOOOS

```

F = File type flag (will appear as `d` if it's a directory)
U = User/owner
G = Group members
O = All others
S = Alternative access (null if blank)

**B. Link Count**

What constitutes a link here varies.

**C. Owner Account**

**D. Group**

**E. File size**

Again, depends on the filesystem. In OSX, it refers to bytes. Use `ls -lah` for human readable file sizes.

**F. Date**

## Installing a package from a binary

### Downloading a binary from the internet using curl

`curl -LO https://site.com/dowload/linux-amd64.tar.gz`
The `-L` flag tells curl to retry at a new address if it recieves a redirect response.
The `-O` flag tells curl to write the downloaded file to be save to a local location of the same name.

### Untarring a tarball

The `tar` command can compress and extract files. It was originally used to for magnetic tapes, hence it's name Tape ARchive. GZip is the most used scheme for compressing `.tar` files. If you file ends in `.tar.gz`, it was compressed using GZip.

```bash
tar -xvf tarball.tar.gz
tar -xvfz tarball.tar.gz # uncompress
tar -xvf tarball.tar.gz -C /usr/local/bin # output contents to directory
```

```bash
tar -xvf
```

### What package to choose?

When installing some software that needs some manual work over the command line, you'll likely see packages that look look something like this:

`helm-v3.0.0-beta.3-darwin-amd64.tar.gz`

Let's break this down a little bit.

`helm-v3.0.0-beta.3` refers to the package we want to download: the 3rd beta release of Helm. In our case, we want to download a prerelease version of Helm 3 to test and play around with. If you're looking for the latest stable version, the word "beta" should tip you off that you're looking for the wrong version.

`darwin-amd64` refers to machines running a 64-bit version of Mac OSX.

`.tar.gz` tells us how the package. While probably wouldn't pick a pacakge based on this information, you could

Below are some definitions to decifer the names and choose the package right for you.

**Operating systems**

- darwin - if you see Darwin in the name, it's OSX.
- linux - you guessed it.
- debian - debian and debian derivatives like Ubuntu.
- windows - no surpises here either.

**Processor architectures**

- **amd64 / x86_64 / x64** - 64-bit version. Linux users will know it as amd64. It references the 64-bit extension of the x86 instruction set (first popularized by AMD). AMD64, Intel 64, or VIA Nano chips can run this software. Choose this version if you have a 64-bit computer. This is most users.
- **386 / i386 / x86_32** - 32-bit version. Chose this version if you have a 32-bit computer. This was common on computers more than a decade ago.
- **arm** - references the ARM architecture. Used in lightwieght applications like smartphones, micro computers, and embedded systems. Think Raspberry Pi.
- **arm64** - the 64-bit flavor.

32 vs 64-bit computers

The takeaway: 32-bit computers are only capabile of handling a limited amount of RAM (think 4GB on a Windows machine). With RAM and processing power consistently on the rise, the need or

## Full Bash reference

- [cat](#cat---concatenate)
- [cd](#cd---change-directory)
- [cp](#cp---copy)
- [curl](#curl---client-url)
- [cut](#curl---cut)
- [dig](#dig---domain-information-grouper)
- [file](#file-command)
- [export](#export---export)
- [kill](#kill---kill-command)
- [ls](#ls---list)
- [ps](#ps---process-status)
- [pwd](#pwd---print-working-directory)
- [sed](#sed---stream-editor)
- [ssh](#ssh---openssh-client)
- [tail](#tail---tail-command)
- [touch](#touch---touch)
- [type](#type-command)
- [xargs](#xargs)

### `cat` - ConcATenate

Intended to combine or concatenate multiple text files into one. Used for a variety of things, like the simple `cat filename.txt` to print out a files contents.

```bash
# print out contents of file to terminal
$ cat file

# Use the more or less command to print out one page at a time
$ cat file | more
$ cat file | less

# combine multiple files
$ cat file1 file2 > megaFile
$ cat * > monsterFile

```

### `cd` - Change Directory

Probably the most rudimentary command. Allows you to traverse the file system.

```bash
$ pwd                       # print working directory - get current location
↪ /users/benish/code

$ ls                        # list out content of current directory
↪ file.txt  lounge-frontend/  lounge-backend/

$ cd lounge-frontend/       # move into "lounge-frontend"
# pwd /users/benish/code/lounge-frontend

$ cd ..                     # move up one directory
# pwd /users/benish/code
```

### `chmod` - CHange MODe

Changes file permissions: who can read, write, and execute the file.

```bash
chmod +x FILE_NAME
chmod 744 FILE_NAME
```

The file permissions can be specified with either the symbolic or numeric method.

**Symobilc Method**

Symbolic method uses letters to refer to the groups and permissions, e.g., `g+x`.

Groups:

- `u` - file owner (user)
- `g` - group, users in the same linux group
- `o` - all other users
- `a` - all users (`u`, `g`, `o`)

Attachments:

- `+` - add specified permission
- `-` - remove specified permission
- `=` - change current permission to specified permission (if no permissions are specified, all permissions are removed)

Permissions:

- `r` - read
- `w` - write
- `x` - execute

**Use `chmod` with symbolic method**:

```bash
# give file owner execute permissions
chmod u=x FILE_NAME

# remove group permissions to write to file
chmod g-w FILE_NAME

# add execute to file owner, remove all permissions from group
chmod u+x,g= FILE_NAME
```

#### Numeric Method

The numeric method uses numbers to identify permissions and their position to identify the linux user, e.g., `744`.

- `r` - read - 4
- `w` - write - 2
- `x` - execute - 1
- No permission - 0

To combine permission, add the value for each permission:

```
Read (4) + Write (2) + Execute (1) = 7
Read (4) + Execute (1) = 5
```

Permissions given in a three digit code.

```bash
chmod 123 FILE_NAME

# 1 = file owner (u)
# 2 = group (g)
# 3 = all other users (o)
```

**Use `chmod` with numeric method**:

```bash
# give file owner
chmod 764 FILE_NAME

# remove group permissions to write to file
chmod g-w FILE_NAME

# add execute to file owner, remove all permissions from group
chmod u+x,g= FILE_NAME
```

### `cp` - CoPy

```bash
# syntax
cp [OPTIONS] source destination
cp [OPTIONS] source directory

cp fileName ../otherDirectory
cp someDirectory/* anotherDirectory/
```

Copy a file - copies content of `file1` to `file2`. Creates file2 if it doesn't exist, overwrites it if it does.

```bash
cp file1 file2
```

Copy files to a directory - overwrites contents of directory if it exits, creates one if it does not. Can supply 1..n files.

```
cp file1 file2 file3 targetDirectory
```

Copy directories - copies entire contents of source directory to target directory. Creates or overwrites contents in target. Usually needs to be run recursively with the `-r` option.

```
cp -R sourceDirectory targetDirectory
```

Other `cp` commands

```bash
$ cp -i s.txt f.txt # interactive - promt before overwriting
```

### `curl` - Client URL

Transfer an URL.

```bash
# download file
`curl -O https://site.com/dowload/linux-amd64.tar.gz`
    # -O: save file locally with same name as remote file
    # -L: follow redirects (if first response is 3xx)

# make executable?
chmod +x ./chartmuseum

# move to something on the path?
mv ./chartmuseum /usr/local/bin
```

#### HTTP POST request

```bash
# Authenticate and request bearer token
curl -X POST "http://local.magento/index.php/rest/V1/integration/admin/token" \
-H "Content-Type:application/json" \
-d '{"username":"admin", "password":"magentorocks1"}'
```

### See redirect path

```bash
curl -sILk google.com
```

### `cut` - CUT

### `dig` - Domain Information Grouper

Get information about DNS name servers. Commonly used to see what domain names resolve to.

```bash
# run dig on github.com
$ dig github.com

# results
# ; <<>> DiG 9.10.6 <<>> github.com
# ;; global options: +cmd
# ;; Got answer:
# ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 47887
# ;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1
#
# ;; OPT PSEUDOSECTION:
# ; EDNS: version: 0, flags:; udp: 512
# # What was queried (the defult query is for an Internet Address [A])
# ;; QUESTION SECTION:
# ;github.com.			IN	A
#
# # "Answer" - IP of where to find github.com
# ;; ANSWER SECTION:
# github.com.		42	IN	A	140.82.113.3
#
# # statistics about the query
# ;; Query time: 28 msec
# ;; SERVER: 2001:558:feed::1#53(2001:558:feed::1)
# ;; WHEN: Sat Nov 09 21:12:49 EST 2019
# ;; MSG SIZE  rcvd: 55
```

```bash
# quick dig
$ dig github.com +short
↪ 140.82.113.3

# get trace route
$ dig github.com +trace

# bring your own nameserver
$ dig @ns1.you-specify.com github.com

# trim dig output
$ dig github.com +nostats       # no stats
$ dig github.com +nocomments    # no header
$ dig github.com +noall +answer # remove everything, show answer

# Request different types of records
$ dig github.com NS
```

Request different types of records

- A = Internet Address, default (IP address)
- TXT = Text annotations
- MX = Mail eXchange (mail servers)
- NS = Name Server

### `export` - EXPORT

```bash
export VERSION=`grep '"version":' package.json | cut -d\" -f4`
export IMAGE_NAME_AND_TAG=$(cat .dev-image-name-and-tag)
echo $IMAGE_NAME_AND_TAG > .stage-image-name-and-tag
```

### `file` command

Indicates file type.

Usage

```bash
$ file cats.md      # basic usage
↪ ./cats.md: ASCII text, with very long lines

$ file cats.md      # get MIME type
↪ ./cats.md: text/plain; charset=utf-8

$ file some-directory/* # entire contents of "some-directory"
$ file -z flash.        # content of compressed file

file /dev/sda
file -s /dev/sda
file /dev/sda5
file -s /dev/sda5

```

### `kill` - `kill` command

Stop a process by process ID.

```bash
# see processes running in terminal
$ ps
  PID TTY           TIME CMD
27894 ttys001    0:00.08 -bash

# see process for all users and outside of terminal
$ ps aux
$ ps aux | grep chrome


$ kill SIGNAL PID
$ kill -9 ./applications-service

# see all signal commands
# 9 (SIGKILL) - is the most common command to terminate a process
$ kill -l
```

### `ls` - LiSt

List

```bash

# list current directory
ls
# list relative directory
ls var/

# flags
  # list/table view with date, ownership, and size
  -l
  # list hidden files like .git
  -a
  # list


# calculate APR
let apr = current_balance * 0.12

let apr = current_balance * 01.2

# the misplaced decimal in the bottom example changed the interest rate from 12% to 120%

```

### `ps` - Process Status

```bash
# check if a process is running
ps auxwww | grep postgres
```

### `pwd` - Print Working Directory

Displays the current directory you're in.

```bash
$ pwd
↪ /home/greg/documents
```

### `sed` - Stream EDitor

Sed is a stream editor for filtering and replacing text. Sed probably has a shit tonne of stuff going on, used commonly for REGEX string matching and replacement.

```bash
sed -i "s,TEXT_TO_FIND,TEXT_TO_REPLACE_WITH,g"
sed -i "s,<SOMETHING_TO_FIND>,REPLACE_TEXT,g" someFile.txt
```

### `ssh` - openSSH client

Remote login program

```
$ ssh -i keyName.pem ec2-user@whatever.amazonaws.com
```

### `tail` - tail command

Displays content of files; prints the last 10 lines of a file by default.

```bash
tail FILE_NAME
```

**Follow a file**: do not close tail when end of file is reached, but rather wait for additional input.

```bash
tail -f FILE_NAME

# also check if file is renamed or rotated
tail -F FILE_NAME
```

**Specify length**: specify amount of file returned in lines, blocks, or bytes.

```bash
# specify 50 lines
tail -n 50 FILE_NAME

# specify 50 blocks
tail -b 50 FILE_NAME

# specify 50 bytes
tail -c 50 FILE_NAME
```

### `touch` - TOUCH

Touch command creates a new file.

```bash
touch FILE_NAME
```

```bash
# create multiple files
touch FILE_NAME_1 FILE_NAME_2



```

**Full argument list**

- `-A` Adjust access and modification timestamps of value with specified value.
- `-a` Change access time of file. Modification time is not changed, unless `-m` flag also specified.
- `-c` Do not create the file if it does not exist
- `-d` Change access and modification times
- `-h` If file has symbolic link, change time of the link itself, rather than the file the link points to. Using `-h` implies `-c` and will not create a new file.
- `m` Change modification time of file. Access time is not changed unless `-a` is also specified.
- `r` Use access and modification times from specified file instead of the current time of day.
- `t` Change access and modification times to the specified time instead of the current time of day.

```bash
# Adjust access and modification timestamps of value with specified value
touch

# Change access time of file. Modification time is not changed, unless `-m` flag also specified.
touch -a FILE_NAME

```

### `type` command

Type give the user information about the command type.

```
type [OPTIONS] FILE_NAME...
```

### `xargs`

Can remove quotes form a

```bash
echo '"text"' | xargs
↪ text
```

### Random Commands

**`xargs`**

Can remove quotes form a

```bash
echo '"text"' | xargs
↪ text
```

**Random Commands from around the block**

```bash
# Extract value from file and set to env variable
export CHART_VERSION="$(grep "^version:" Chart.yaml | cut -d" " -f2)"
export CHART_NAME="$(grep "^name:" Chart.yaml | cut -d" " -f2)"

# Set environment variables
export VERSION=`grep '"version":' package.json | cut -d\" -f4`
export IMAGE_NAME_AND_TAG=$DOCKER_REPO/$CI_PROJECT_PATH:$VERSION.stage

# Echo ENV variable to file
echo $IMAGE_NAME_AND_TAG > .stage-image-name-and-tag
# Cat file to env variable
export IMAGE_NAME_AND_TAG=$(cat .dev-image-name-and-tag)

# Get version number from package.json
cat package.json | jq ."version" | xargs
grep '"version":' package.json | cut -d\" -f4
export VERSION=`grep '"version":' package.json | cut -d\" -f4`:

export EVERSION=`grep '"version":' package.json | cut -d\" -f4`

# Overwrite sigil charachter with env variable
sed -i "s,<IMAGE_NAME_AND_TAG>,${IMAGE_NAME_AND_TAG},g" infra/k8s/dev/deployment.yml

# Source a filevi
source someScript.sh

# Assume AWS role, export creds to env variables
aws sts assume-role --role-arn arn:aws:iam::1231231231:role/someRoleName --role-session-name some-session name-${CI_COMMIT_SHA} >> credentials.json
export AWS_SECRET_ACCESS_KEY=$(cat credentials.json | grep "SecretAccessKey" | cut -d ':' -f2 | cut -d '"' -f2)
export AWS_SESSION_TOKEN=$(cat credentials.json | grep "SessionToken" | cut -d ':' -f2 | cut -d '"' -f2)
export AWS_ACCESS_KEY_ID=$(cat credentials.json | grep "AccessKeyId" | cut -d ':' -f2 | cut -d '"' -f2)

# add EKS cluster to kubeconfig
aws eks update-kubeconfig --name $CLUSTER_NAME

# kubectl patch
kubectl patch storageclass csi-sc -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

#### Check if scipt called with correct number of arguments

```bash
#!/bin/bash -x

if test "$#" != "2"
then
    echo "Script takes two inputs: ./script.sh <arg-1> <arg-2>"
    exit 1
fi
```

### Docker Commands

```bash
$ docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

# Building the image
$ docker build --no-cache -t $DOCKER_REPO/$CI_PROJECT_PATH

```

### Creating a Hugo Site

```bash
hugo new site site-name
```

## Return to Magento learnings

A POST to the successUrl is required. It records the order in Magento and finalizes some customer information on the Magento side. It calls back to Affirm to validate the user is truly authorized. There a CSRF validation phase blocking the request, I'm currently trying to bypass it.

existing_status=`helm ls -n ${namespace} | grep ${chart_name} | awk '{print $8}'`
echo EXISTING STATUS $existing_status

export existing_status=`helm ls -n ${namespace} | grep ${chart_name} | awk '{print $8}'`
echo EXISTING STATUS $existing_status
