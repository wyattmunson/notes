# Postgres

Postgres is an open source relational database manager.

- [Postgres Convetions](#postgres-conventions)
  - [Postgres connection stting](#postgres-connection-string)
  - [Case sentitive column names](#case-sensitive-column-names)
- [PSQL CLI](#psql-cli)
  - [Logging into psql](#logging-into-psql)
  - [Basic psql commands](#basic-psql-commands)
  - [Using psql wtih schemas](#using-psql-with-schemas)
- [Postgres flavored SQL](#postgres-flavored-sql)
  - [Creating tables](#creating-tables)
  - [Drop table](drop-table)
  - [Alter table and delete rows](#alter-table-and-delete-rows)
  - [Limit and offset](#limit-and-offset)
  - [Enums](#enums)
  - [Schemas](#schemas)
- [Postgres data types](#postgres-data-types)

## Postgres Conventions

### Postgres connection string

`postgres://USERNAME:PASSWORD@DATABASE_URL:5432/DATABSE_NAME`

`postgres://postgres@some-database.us-east-1.amazonaws.com:5432/secret_database`

#### Unsecure method

You can alternately pass in the password using `USERNAME:PASSWORD` but this is considered unsecure. The password should be omtted from the connection sting, which will then prompt the user to enter it.

### Case sensitive column names

Using case sensitive column names in Postgres is optional.

Use `"` double quotes around column names when creating tables for case sentitive columns.

The advantage is the column names can be formatted in camel case, meaning one less transformation before returning it to the frontend. The disadvantage is the double quotes must be used on the column name in every SQL statement.

### Schemas

> [Using schemas](#schemas)

A Postgres contains multiple databases. A database contains multiple schemas. Schemas in turn contain tables. Schemas are a way to segment a single database and allow multiple user to use the same database without stepping on each other.

By default talbes use the public schema, which does not have to be referenced in SQL queries.

## `psql` CLI

`psql` is a CLI front end for postgres. Use it to describe databases and tables or run SQL commands directly.

### Logging into `psql`

```bash
psql -U postgres
psql -h localhost -U postgres -p 5432

# specify username and database when logging in
psql -U USERNAME DATABASE_NAME
```

Be default, when specifying a username, Postgres will attempt to connect a database with the same name. If the database does not exist, the command will fail saying `FAIL: database <USER> does not exist`.

In this case specify a database name using the command above. If you do not know the database names, log in using the `postgres` user first.

### Basic `psql` commands

```bash
# LISTING DATABASES
# list databases
\l
# list database with additional info
\l+

# CONNECTING TO DATABASES
# connect to database 'users'
\c users
# see current connection (auto connects to postgres if not connected)
\c

# TABLES
# list tables
\dt
# list tables and sequences
\d
# list tables and sequences with additional info
\d+
# describe a table
\d orders
# describe table with add;t into
\d+ orders
# list a tables relations
\dt orders
# list schemas
\dn orders
\dn+ orders

# quit shell
\q

# open text editors
\e

# see users
\du

CREATE USER username;
```

### Using `psql` with schemas

```bash
# list schemas
\dn

# list table within a schema
\dt schema_name.<TABLE NAME>

# list all tables within a schema
\dt schema_name.*

# List all tables in all schemas
\dt *.*

# select data from a table in schema
SELECT * FROM schema_name.table_name;
```

## Postgres flavored SQL

Postgres implements the SQL language as expected for the most part. Postgres layers on additional datatypes and functions.

### Creating tables

> [Postgres datatype reference](#postgres-data-types)

```sql
-- Create a sequence to be used in a table (e.g., id field)
CREATE SEQUENCE box_sequence
    start 2000
    increment 1;

CREATE TABLE boxes (
    -- sequence reference uses 'single quotes'
    "boxId"           INTEGER NOT NULL PRIMARY KEY DEFAULT nextval('box_sequence'),
    -- column names use "double quotes"
    "boxName"         VARCHAR(32),
    -- lower case column names don't need quotes
    notes             VARCHAR(128)
    fixed_text        CHAR(32)
    long_text         TEXT,
    can_delete        BOOLEAN,
    price             FLOAT(2),
    metadata          JSONB,
    id_code           UUID,
    create_time       TIME,
    create_date       DATE,
    created_on        TIMESTAMP,
    with_timezone     TIMESTAMP WITH TIME ZONE
);

CREATE TABLE items (
    -- SERIAL is auto-incremented auto-populated integer
    "itemId"            SERIAL PRIMARY KEY,
    -- foreign key reference to another table
    "box"             INTEGER REFERENCES boxes ("boxId"),
);
```

- `SERIAL` is an auto-incrementing, auto-populating type. It starts at one and is automatically add when the record is created. It's handy for a primary key ID when you're not concerned about the value.

### Drop table

Delete a table, handle errors, handle object dependencies.

```sql
-- drop (delete) a table
DROP TABLE table_name;

-- prevent SQL error if talbe doesn't exist
DROP TABLE IF EXISTS table_name;

-- drop table and dependant objects in foreign table
DROP TABLE table_name CASCADE;
```

### Alter table and delete rows

Add columns, change column data types, delete columns.

```sql
ALTER TABLE items
ADD "itemDescription" VARCHAR(64);

ALTER TABLE items
ALTER COLUMN "lastMoved" TYPE TIMESTAMP WITH TIME ZONE;

ALTER TABLE
DROP COLUMN description;
```

### Insert, Update, and Delete rows

Insert new rows, update existing rows, and delete rows.

```sql
-- INSERT (strings use 'single quotes')
INSERT INTO users ("userId", notes)
VALUES (500, 'Greg Benish');

-- UPDATE ROW(S)
UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;

-- DELETE ROW(S)
DELETE FROM table_name
WHERE condition;
```

### Limit and Offset

Limit number of returned rows, skip a number of rows before returning the retult set.

```sql
-- Limiting the rows returned
SELECT *
FROM users
ORDER BY create_date
LIMIT 200;

-- Skip a number of rows before returning limit
SELECT *
FROM users
LIMIT 200
OFFSET 20;
```

### Enums

Create predefined values for a column.

```sql
-- Create an enum
CREATE TYPE item_category AS ENUM ('Electronic', 'Camping', 'Other');

-- Update existing enum
ALTER TYPE item_category ADD VALUE 'None';

-- Use as column type
ALTER TABLE items
ADD "itemCategory" ITEM_CATEGORY;
```

### Schemas

```sql
CREATE SCHEMA some_schema;

CREATE TABLE some_schema.some_table (
    ...
);
```

## Postgres Data Types

| Type          | Code                        | Desc.                                                                                              |
| ------------- | --------------------------- | -------------------------------------------------------------------------------------------------- |
| Boolean       | `BOOLEAN` or `BOOL`         | `0`, `true`, `t`, `yes`, `y` evaluates to `true`. `1`, `false`, `f`, `no`, `n` evaluates to false. |
| Charachter    | `CHAR(n)`                   | Fixed length string. Strings less than `n` are padded with spaces.                                 |
| Charachter    | `VARCHAR(n)`                | Variable length string. Limited to up to `n` charachters.                                          |
| Charachter    | `TEXT`                      | Variable length string. Unlimited length.                                                          |
| Small Integer | `SMALLINT`                  | 2-byte signed integer -32,768 to 32,767                                                            |
| Integer       | `INT` or `INTEGER`          | 4-byte singed integer from -2,147,483,648 to 2,147,483,647                                         |
| Serial        | `SERIAL`                    | Similar to integer, but Postgres will automatically generate and populate the value.               |
| Float         | `FLOAT(n)`                  | Floating-point number with precision of `n`. Maximum of 8 bytes.                                   |
| Float         | `real` or `float8`          | 4-byte floating point number                                                                       |
| Float         | `numeric` or `numeric(p,s)` | Real number with `p` digits and `s` number after the decimal place.                                |
| Date          | `DATE`                      | Date only.                                                                                         |
| Date          | `TIME`                      | Time only.                                                                                         |
| Date          | `TIMESTAMP`                 | Time and date.                                                                                     |
| Date          | `TIMESTAMPZ`                | Time and date with timezone.                                                                       |
| Date          | `INTERVAL`                  | Periods of time.                                                                                   |
| UUID          | `UUID`                      | RFC 4122 compliant UUIDs.                                                                          |
| JSON          | `JSON`                      | Plain JSON types that require for each processing.                                                 |
| JSON          | `JSONB`                     | Plain JSON types that are faster to inster but slower to insert. Supports indexing.                |
| Array         | `???`                       | Plain JSON types that are faster to inster but slower to insert. Supports indexing.                |

# Running Postgres

## Commands

```bash
# check if Postgres is running
ps auxwww | grep postgres

```
