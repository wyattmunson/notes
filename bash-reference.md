# Full Bash reference

| Command                                         | Name                            | Description                                               |
| ----------------------------------------------- | ------------------------------- | --------------------------------------------------------- |
| [cat](#cat---concatenate)                       | concatenate                     | Display contents of text file; combine multiple files.    |
| [cd](#cd---change-directory)                    | change directory                | Traverse the directory tree and move to different folders |
| [cp](#cp---copy)                                | copy                            | Copy files or directories                                 |
| [curl](#curl---client-url)                      | curl                            | HTTP utility                                              |
| [cut](#curl---cut)                              | cut                             |                                                           |
| [dig](#dig---domain-information-grouper)        | domain information grouper      | Show DNS information for a URL                            |
| [file](#file-command)                           | file                            | Display file type                                         |
| [echo](#echo-command)                           | echo                            | Print output to the terminal                              |
| [export](#export---export)                      | export                          | Export a variable                                         |
| [grep](#grep---global-regular-expression-print) | global regular expression print | Use regex to find files                                   |
| [kill](#kill-command)                           | kill                            | Stop a running process                                    |
| [ls](#ls---list)                                | list                            | List contents of a directory                              |
| [lsof](#lsof---list-open-files)                 | list open files                 | See running processes, check ports                        |
| [mkdir](#mkdir---make-directory)                | mkdir                           | Create a directory                                        |
| [ps](#ps---process-status)                      | ps                              | See status of running process                             |
| [pwd](#pwd---print-working-directory)           | print working directory         | Show current directory                                    |
| [sudo](#sudo---super-user-do)                   | super user do                   | Elevates a command to super user privileges               |
| [scp](#scp---secure-copy)                       | secure copy                     | Securely copy file between hosts                          |
| [sed](#sed---stream-editor)                     | stream editor                   | Edit a text stream                                        |
| [ssh](#ssh---openssh-client)                    | ssh                             | HTTP utility                                              |
| [tail](#tail-command)                           | tail                            | Print the end of a file                                   |
| [touch](#touch-command)                         | touch                           | Create a file                                             |
| [type](#type-command)                           | type                            | See file or directory type                                |
| [xargs](#xargs)                                 | xargs                           | Yarr                                                      |
| [Redirect Operators](#redirect-operators)       | Redirect                        |                                                           |

## `cat` - ConcATenate

Intended to combine or concatenate multiple text files into one. Used for a variety of things, like the simple `cat filename.txt` to print out a files contents.

Use `cat` to print out contents of file to terminal:

```bash
$ cat FILE_NAME
$ cat log.txt
```

Use the more or less command to print out one page at a time:

```bash
$ cat file | more
$ cat file | less
```

Use `cat` to combine multiple files:

```bash
# combine file1 and file2 into megaFile.txt
$ cat file1 file2 > megaFile.txt

# combine all files in current directory to monsterFile.txt
$ cat * > monsterFile.txt
```

## `cd` - Change Directory

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

$ cd -                      # return to previous directory
# pwd /users/benish/code/lounge-frontend
```

## `chmod` - CHange MODe

Changes file permissions: who can read, write, and execute the file.

```bash
chmod +x FILE_NAME
chmod 744 FILE_NAME
```

The file permissions can be specified with either the symbolic or numeric method.

### Symobilc Method

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

### Numeric Method

> The numeric method uses numbers to identify permissions and their position to identify the linux user, e.g., `744`.

- `r` - read - 4
- `w` - write - 2
- `x` - execute - 1
- No permission - 0

To combine permissions, add the value for each permission:

```
Read (4) + Write (2) + Execute (1) => 7
Read (4) + Execute (1)             => 5
Read (4)                           => 4
```

Permissions given in a three digit code. The permission type(s) like read or execute are denoted by the value. The position of each digit refers to the three linux user group.

```bash
chmod 123 FILE_NAME
      ^^^
      |||_  all other users (o)
      ||__  group (g)
      |___  file owner
```

**Use `chmod` with numeric method**:

```bash
# give file owner - read, write, execute; group - read, write; all other users - read
chmod 764 FILE_NAME

# give all permissions to all groups
chmod 777 FILE_NAME
```

## `cp` - CoPy

```bash
# syntax
cp [OPTIONS] source destination
cp [OPTIONS] source directory

cp fileName ../otherDirectory
cp someDirectory/* anotherDirectory/
```

### Copy a file

Copies content of `file1` to `file2`. Creates file2 if it doesn't exist, overwrites it if it does.

```bash
cp file1 file2
```

### Copy files to a directory

Overwrites contents of directory if it exits, creates one if it does not. Can supply 1..n files.

```
cp file1 file2 file3 targetDirectory
```

### Copy directories

Copies entire contents of source directory to target directory. Creates or overwrites contents in target. Usually needs to be run recursively with the `-r` option.

```bash
cp -R sourceDirectory targetDirectory
```

### Copy and preserve timestamp

```bash
cp -p file1 file2
```

Other `cp` commands

```bash
$ cp -i s.txt f.txt # interactive - promt before overwriting
```

## `curl` - Client URL

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

### HTTP POST request

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

## `cut` - CUT

Cut stuff.

### Cut by Field

Cut by field using the `-f` flag. The default delimeter is TAB.

```bash
# sales.txt
2022-20-11  11:34   134.23      Electronics
2022-20-10  10:23   500.34      Appliances
```

Use `cut` to extract the first and third column:

```bash
$ cut sales.txt -f 1,3

# output
2022-20-11  134.23
2022-20-10  500.34
```

Display first through thrid field:

```bash
$ cut sales.txt -f -3

# output
2022-20-11  11:34   134.23
2022-20-10  10:23   500.34
```

### Cut with a Delimeter

Use the `-d` flag to specify a delimeter.

```bash
cut sales.txt -d ":" -f 1,2
```

## `dig` - Domain Information Grouper

Get information about DNS name servers. Commonly used to see what domain names resolve to.

```bash
# run dig on github.com
$ dig github.com

# results
#
# ...
#
# ;; ANSWER SECTION:
# github.com.		42	IN	A	140.82.113.3
#
# ...
```

Use the `ANSWER SECTION` to see the DNS records of the search. If there are no answers, the requested DNS record could not be found or does not exist.

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

Mark variables and functions to be passed to child shells and processes.

Export a variable:

> Bash variables are capatalized by convention.

```bash
export VARIABLE_NAME=VARIABLE_VALUE
export NODE_VERSION=14
```

Get text from file and insert into new file:

```bash
export VERSION=`grep '"version":' package.json | cut -d\" -f4`
export IMAGE_NAME_AND_TAG=$(cat .dev-image-name-and-tag)
echo $IMAGE_NAME_AND_TAG > .stage-image-name-and-tag
```

## `file` command

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

## `echo` command

Prints text to the terminal window.

```bash
$ echo some text
↪ some text
```

## `grep` - Global Regular Expression Print

Search a file to see if it contains a phrase.

```bash
grep SEARCH_TEXT FILE_NAME
grep phrase log.txt
```

Case insensitive search:

```bash
grep -i "phrase"
```

Search current directory and all subdirectories:

```bash
grep -R "phrase" .
```

Commands can be "piped in" to grep using the `|` operator.

```bash
# display only matching files
ls | grep SEARCH_TEXT
ls | grep log.txt

# use wildcards
ls | grep *report.txt
ls | grep *report*
```

### Get count of matching keyword

```bash
grep -c "keyword" log.txt
```

## `kill` command

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

## `ls` - LiSt

List contents of a directory.

List current directory:

```bash
ls
```

List a specified directory:

```bash
ls DIRECTORY
ls /local/usr/bin
```

`ls` flags:

```bash
ls -l
ls -lah

# flags
  # list/table view with date, ownership, and size
  -l
  # list hidden files like .git (starting with a dot ".")
  -a
  # human readable file sizes
  -h
  # list subdirectories
  -R
  # order by last modified
  -t
  # order by file size
  -lS
  # list in reverse order (combine with other commands)
  -r
  # show directories with "/" and executables with "*"
  -F
  # display inode number of file or directory
  -i
```

## `lsof` - LiSt Open Files

Use it to check if a process is running on a given port.

```bash
lsof -i :5432
```

`lsof` may be in `/usr/sbin` and needs to be invoked directly (`/usr/sbin/lsof -i :5432`).

## `sudo` - Super User DO

`sudo` allows a user to execute a command as the superuser or another user, within the specified security policy.

```bash
sudo COMMAND
sudo rm -rf /data
```

More:

```bash
# add a new user
sudo useradd

# create password for new user
sudo passwd

# add to a group
sudo groupadd

# delete user
sudo userdel

# delete group
sudo groupdel

# add user to a primary group
sudo usermod -g
```

## `man` - MANual

Show manual page for a given command. Use to show the manual for any bash command.

```bash
man COMMAND
man ls
```

## `mkdir` - MaKe DIRectory

Creates a directory

```bash
mkdir DIRECTORY_NAME
mkdir some directory

# copy subdirectories
-p
```

## `ps` - Process Status

Use to see running processes.

```bash
# show running terminal sessions
ps
```

### Show all running processes

```bash
ps aux

# use grep to find process by keyword
ps aux | grep keyword
```

```bash
# check if a process is running
ps auxwww | grep postgres
```

## `pwd` - Print Working Directory

Displays the current directory you're in.

```bash
$ pwd
↪ /home/greg/documents
```

## `scp` - Secure CoPy

Secure copy is used to securely transfer files from one host to another.

```bash
scp -i SOURCE TARGET
scp -i /home/file.txt user@host:/app/data/file.txt
```

## `sed` - Stream EDitor

Sed is a stream editor for filtering and replacing text. Sed probably has a shit tonne of stuff going on, used commonly for REGEX string matching and replacement.

```bash
sed -i "s,TEXT_TO_FIND,TEXT_TO_REPLACE_WITH,g"
sed -i "s,<SOMETHING_TO_FIND>,REPLACE_TEXT,g" someFile.txt
```

## `ssh` - openSSH client

Remote login program

```
$ ssh -i keyName.pem ec2-user@whatever.amazonaws.com
```

## `tail` command

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

## `touch` command

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

## `type` command

Type give the user information about the command type.

```
type [OPTIONS] FILE_NAME...
```

## `xargs`

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

# Redirect Operators

## `>` - Redirect Output Operator

Redirects the output of standard output (stdout) and writes it to a given file. If the file exists, it's overwritten.

Redirect standard output to a file:

```bash
# list current directory and write results to file_directory.txt
ls > file_directory.txt
```

### Types of Output

Different types of output

| Number | Type            | Abbreviation |
| ------ | --------------- | ------------ |
| 0      | Standard input  | `stdin`      |
| 1      | Standard output | `stdout`     |
| 2      | Standard error  | `stderr`     |

With the `>` operator, standard output (`1`) is assumed. Using `>` is the same as `1>`.

### Redirect Standard Error

Use `2>` to redirect `stderr`:

```bash
command 2> /dev/null
```

### Redirect Standard Error and Standard Output

Use `&>` to redirect `stderr` and `stdout`:

```bash
command &> /dev/null
```

In Bash, `&>` is the same as `>&`; however, the former is preferred.

More complex solutions achieve the same results

```bash
command >file 2>&1
```

What happened:

- The first redirection `>file` prints `stdout` to `file`
- The second redirection `2>&1` duplicates file descriptor `2` to be the same as `1`

### Discard Output of Command

```bash
command > /dev/null
```

The location `/dev/null` immediately deletes all data written to it. Also known as the "bit bucket."

Discard output of stdout and stderr:

```bash
command &> /dev/null
# OR
command >/dev/null 2>&1
```

## `>>` - Redirect Output Append Operator

Redirects the output of standard output (stdout) and writes it to a given file. If the file exists, it's appended to the contents of the file.

```bash
# list current directory and write results to file_directory.txt
ls >> file_directory.txt
```

### Redirect Standard Error and Standard Output`

Use `&>>` to redirect `stderr` and `stdout`:

```bash
command &>> file.txt
```

## `<` - Regular Input Operator

The input redirector pulls data in a stream from a given source.

Take the given text file for example:

```bash
# states.txt
California
Alaska
New York
```

Use above text file as input to `sort` command:

```bash
$ sort < states.txt
Alaska
California
New York
```

## `|` - Pipe Operator

Takes the output of a given program and redirects it as input for another program. This is known as "piping".

Use `ls` to print directory contents and use `grep` to find matching regex pattern:

```bash
# show files names that match "2004"
ls | grep 2004
```

https://catonmat.net/bash-one-liners-explained-part-three
