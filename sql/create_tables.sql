CREATE TABLE
    User (
        user_ID varchar(100),
        PRIMARY KEY (user_ID),
        user_Type ENUM ('DRIVER', 'SPONSOR', 'ADMIN') NOT NULL,
        email varchar(50),
        first_Name varchar(50),
        is_active boolean DEFAULT true,
        bio varchar(255)
    );

CREATE TABLE
    Org (
        org_ID INT auto_increment,
        primary key (org_ID),
        org_Name varchar(50),
        point_Ratio INT
    );

CREATE table
    User_Org (
        user_ID varchar(100),
        foreign key (user_ID) references User (user_ID),
        org_ID INT,
        foreign key (org_ID) references Org (org_ID),
        primary key (user_ID, org_ID),
        app_Status ENUM ('PENDING', 'ACCEPTED', 'REJECTED') DEFAULT 'PENDING',
        Is_current boolean DEFAULT false,
        active_User boolean DEFAULT false
    );

CREATE TABLE
    Orders (
        order_ID INT auto_increment,
        PRIMARY KEY (order_ID),
        user_ID varchar(100),
        FOREIGN KEY (user_ID) REFERENCES User (user_ID),
        is_cart boolean DEFAULT false,
        order_Status ENUM ('PENDING', 'ACCEPTED', 'CANCELLED'),
        org_ID INT,
        timestamp datetime
    );

CREATE TABLE
    Order_Item (
        order_ID INT,
        foreign key (order_ID) references Orders (order_ID),
        item_ID INT,
        PRIMARY KEY (item_ID, order_ID),
        item_Quantity INT,
        item_Name varchar(50),
        points INT
    );

CREATE TABLE
    Audit (
        audit_ID INT auto_increment,
        primary key (audit_ID),
        user_ID varchar(100),
        foreign key (user_ID) references User (user_ID),
        log_Type ENUM ('APPLICATION', 'POINT', 'PASSWORD', 'LOGIN')
    );

CREATE TABLE
    Driver_App_Audit (
        driver_app_id INT auto_increment,
        primary key (driver_app_id),
        org_ID INT,
        foreign key (user_ID) references User (user_ID),
        user_ID varchar(100),
        foreign key (org_ID) references Org (org_ID),
        reason VARCHAR(255),
        timestamp date,
        app_Status ENUM ('PENDING', 'ACCEPTED', 'REJECTED')
    );

CREATE TABLE
    Point_Changes_Audit (
        point_change_id INT auto_increment,
        primary key (point_change_id),
        user_ID varchar(100),
        foreign key (user_ID) references User (user_ID),
        point_change_value INT,
        reason VARCHAR(255),
        org_ID INT,
        foreign key (org_ID) references Org (org_ID),
        timestamp datetime
    );

CREATE TABLE
    Password_Changes_Audit (
        password_change_id INT auto_increment,
        primary key (password_change_id),
        user_ID varchar(100),
        change_type varchar(50),
        timestamp datetime
    );

CREATE TABLE
    Login_Attempts_Audit (
        login_attempts_id INT auto_increment,
        primary key (login_attempts_id),
        user_ID varchar(100),
        status ENUM ('SUCCESS', 'FAILURE'),
        timestamp date
    );

CREATE TABLE
    Org_Item (
        item_ID INT,
        org_ID INT,
        foreign key (org_ID) references Org (org_ID),
        primary key (item_ID, org_ID)
    );

* * * * ADD COMPANIES INTO ORG * * * * * * USE app_db;

INSERT INTO
    Org (org_Name)
VALUES
    ('SpaceX'),
    ('Amazon'),
    ('Fedex'),
    ('Apple');