docker run -it --name express-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=famp52845 -d mysql
9dbd5716a9f352568b4789e0fe2d9e2a87431ed859ba4127bd5a63c7f2ca55b6

┌─[ felix ╼ Arcris ]─[05:23 PM]─[~] 
└──╼ $ docker exec -it 9db /bin/bash

bash-4.4# mysql -u root -pfamp52845
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 8.0.30 MySQL Community Server - GPL

Copyright (c) 2000, 2022, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> CREATE DATABASE IF NOT EXISTS companydb;
Query OK, 1 row affected (0.01 sec)

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| companydb          |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.01 sec)

mysql> use companydb;
Database changed
mysql> CREATE TABLE employee(
    ->     id INT(11) NOT NULL AUTO_INCREMENT,
    ->     name VARCHAR(45) DEFAULT NULL,
    ->     salary INT(11) DEFAULT NULL,
    ->     PRIMARY KEY (id)
    -> );
Query OK, 0 rows affected, 2 warnings (0.03 sec)

mysql> describe employee;
+--------+-------------+------+-----+---------+----------------+
| Field  | Type        | Null | Key | Default | Extra          |
+--------+-------------+------+-----+---------+----------------+
| id     | int         | NO   | PRI | NULL    | auto_increment |
| name   | varchar(45) | YES  |     | NULL    |                |
| salary | int         | YES  |     | NULL    |                |
+--------+-------------+------+-----+---------+----------------+
3 rows in set (0.00 sec)

mysql> SELECT 1 + 1 AS result;
+--------+
| result |
+--------+
|      2 |
+--------+
1 row in set (0.00 sec)

mysql> 
