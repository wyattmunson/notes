# SQL

Structured Query Language (SQL) is a language for interacting with databases. It defines the syntax for querying data and mantaining the database using statements like `SELECT FROM` and `ADD COLUMN`.

SQL is used in Relational Database Management Systems (RDMS) that uses "[structured](#structured-data)" or "relational" data, unlike the unstructured data set seen in NoSQL databases. SQL is a language; PostgreSQL is a RDMS.

The SQL standard defines the core language; however, many SQL implementations add additional functionality and are thus incompatable with one another.

## Structured Data

Is a data model where real world entities and heiarchies are mapped to an abstract model. For example, a database can contain a list of students and a list of classes and use a third table to map a student to class.

## Relational database management systems

A RDMS is require to actually run a databse. Each RDMS implements the core SQL standard, but vendor's procedural extensions add additional functionalities that are often incompatable with each other.

SQL Server is Microsoft's RDMS offering. SQL Server transact-SQL, which extends SQL and provides additional query commands. These commands would be incompatable on, say, PostgreSQL. SQL Server also requires a paid license to use where Postgres

Postgres

```sql
SELECT column
FROM table
LIMIT 5;
```

SQL Server

```sql
SELECT TOP 5
    column
FROM table;
```

### Common relational database management systems

- PostgreSQL - common FOSS
- SQL Server - Microsoft's RDMS using tSQL, Microsoft's implementation of SQL
- MySQL - open source, aquired by Oracle
- MariaDB - fork of MySQL from 2009 when it was aquired by Oracle
