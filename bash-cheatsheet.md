# Bash Cheatsheet

## File Commands

### ls

Use `ls` to list files and directories.

```bash
# list current directory file contents
ls

# list specified direcotry's file contents
ls /usr/local/bin

# display all files, with metatadata, that is human readable
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

### cd

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

### Creating a file

```bash
touch file_name

# create file and open text editor
vim file_name
nano file_name
```

### Moving a file

```bash
mv source_file target_file
```

### Copying a file

```bash
cp source_file target_file

# copy directory, and create target_dir if it doesn't exist
cp -r source_dir target_dir
```

### Deleting a file

```bash
rm file_name

# remove directory
rm -r directory_name

# force remove file
rm -f file_name
```

## Text

## `sed` - Stream EDitor

Sed is a stream editor for filtering and replacing text. Sed probably has a shit tonne of stuff going on, used commonly for REGEX string matching and replacement.

### Use sed to find and replace text

```bash
sed -i "s,TEXT_TO_FIND,TEXT_TO_REPLACE_WITH,g"

# use a sigial charachter in a file and replce the text
sed -i "s,<VERSION_NUMBER>,10,g" someFile.txt

# formatting for macOS 10.9+
sed -i'.original' -e  "s,<SOMETHING_TO_FIND>,REPLACE_TEXT,g" someFile.txt
```

## System Information

```bash
date        # get date
cal         # show current month's calendar
uptime      # show current uptime
w           # display who's online
whoami      # display current logged in user
finger user # display infomation about "user"
uname -a    # show kernel information
df          # show disk usage
du          # show directory space usage
free        # show memory and swap usage
cat /proc/cpuinfo   # CPU information
cat /proc/meminfo   # memory information
```

## Networking

```bash
# ping
ping google.com

# get DNS information about domain
dig google.com
```

### wget

```bash
# download file with wget
wget http://example.com/file.txt
# set file name (also use to overwrite)
wget -O custom_name.txt http://example.com/file.txt
# download to a specific directory
wget -P Documents/ http://example.com/file.txt
# silence output
wget -p http://example.com/file.txt
# show progress bar
wget -q --show-progress http://example.com/file.txt
# send GET request
wget -O- http://example.com/posts
# send POST request
wget --method=post -O- -q --body-data='{"key": "value"}' --header=Content-Type:application/json http://example.com/posts
```

## Compressing

```bash
tar -cf file.tar files  # create a tar named file.tar containing files
tar xf file.tar         # extract the files from file.tar
tar czf file.tar.gz files   # create a tar with Gzip compression
tar xzf file.tar.gz     #  extract a tar using Gzip
tar cjf file.tar.bz2    # create a tar with Bzip2 compression
tar xjf file.tar.bz2    # extract a tar using Bzip2
gzip file               # compresses file and renames it to file.gz
gzip -d file.gz         # decompresses file.gz back to file
```

## Searching

```bash
# search file for matching text
grep search_text file_name
grep -i "phrase" file.txt

# case-insensitive search
grep -i "phrase" file_name

# search current directory and all subdirectories:
grep -R "phrase" .

# find matching file names
ls | grep "phrase"

# use wildcards
ls | grep *report.txt
ls | grep *report*
```

## Running Commands

```bash
whereis app # show possible locations of "app"
which app   # show default location of "app" to be used

# see manual page for command
man command
man grep
```
