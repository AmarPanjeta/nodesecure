DROP DATABASE IF EXISTS ts;

CREATE DATABASE ts;

use ts;

CREATE TABLE store(
	id int(10) unsigned auto_increment primary key, 
	name varchar(100) not null
);

CREATE TABLE reg_user(
	id int(10) unsigned auto_increment primary key, 
	username varchar(30) not null,
	name varchar(30), 
	surname varchar(30),
	password char(60),
	type tinyint not null,
	store_id int(10) unsigned,
	foreign key fk_store(store_id)
	references store(id)
	ON UPDATE CASCADE
   	ON DELETE RESTRICT
   	);

CREATE TABLE item(
	id int(10) unsigned auto_increment primary key,
	name varchar(100) not null,
	description text not null,
	store_id int(10) unsigned,
	foreign key fk_store(store_id)
	references store(id)
	ON UPDATE CASCADE
   	ON DELETE RESTRICT
);

CREATE TABLE event(
	id int(10) unsigned auto_increment primary key,
	name varchar(255) not null,
	description text not null,
	date datetime not null,
	type varchar(100) not null,
	owner_id int(10) unsigned not null,
	foreign key fk_owner(owner_id)
	references reg_user(id)
	ON UPDATE CASCADE
   	ON DELETE RESTRICT
);

CREATE TABLE invitation(
	user_id int(10) unsigned not null,
	event_id int(10) unsigned not null,
	foreign key fk_user(user_id)
	references reg_user(id)
	ON UPDATE CASCADE
   	ON DELETE RESTRICT,
   	foreign key fk_event(event_id)
	references event(id)
	ON UPDATE CASCADE
   	ON DELETE RESTRICT
);

CREATE TABLE event_gift(
	item_id int(10) unsigned not null,
	event_id int(10) unsigned not null,
	available bit not null,
	foreign key fk_item(item_id)
	references item(id)
	ON UPDATE CASCADE
   	ON DELETE RESTRICT,
   	foreign key fk_event(event_id)
	references event(id)
	ON UPDATE CASCADE
   	ON DELETE RESTRICT
);

insert into reg_user (username,name,surname,password,type) values ('amarp','amar','panjeta','$2a$12$iM0zbkPawpkv.PCsZEqCG.7KipklBdo1adlnsiyEk/gYvL6tWNo3i',1);
