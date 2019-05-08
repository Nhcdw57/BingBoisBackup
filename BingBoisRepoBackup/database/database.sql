CREATE DATABASE bingbois;
create table Company(
    companyID serial,
    companyName varchar(50),
    description varchar(500),
    ownerID int default NULL,
    Primary key(companyID)
);
create table Position(
    positionID serial,
    title varchar(50),
    description varchar(500),
    companyID int,
    managerID int default NULL,
    publicVisible boolean default false,
    isAvailable boolean default false,
    startDate date,
    postedDate date,
    postingExpirationDate date,
    onboardInfo JSON default NULL,
    location varchar(25) DEFAULT NULL,
    Primary key(positionID),
    Foreign key (companyID) references Company(companyID)
);
create table UserTable(
    firstName varchar(20),
    lastName varchar(20),
    userID serial,
    managerID int CHECK (managerID <> userID),
    positionID int,
    companyID int,
    hasHiringPriv boolean,
    email varchar(75),
    joinDate date,
    Primary key (userID),
    Foreign key (positionID) references Position(positionID),
    Foreign key (managerID) references UserTable(userID),
    Foreign key (companyID) references Company(companyID)
);
create table cref(
    cid INT,
    iid INT
);
create table pref(
    pid int,
    iid INT
);
create table uref(
    uid int,
    iid INT
);
alter table Position add Foreign key (managerID) references UserTable(userID);
alter table Company add FOREIGN KEY (ownerID) REFERENCES UserTable(userID);