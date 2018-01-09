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

/*insert into reg_user (username,name,surname,password,type) values ('amarp','amar','panjeta','$2a$12$iM0zbkPawpkv.PCsZEqCG.7KipklBdo1adlnsiyEk/gYvL6tWNo3i',1);
*/

insert into store (name) values ('Zara');
insert into store (name) values ('Bershka');
insert into store (name) values ('Parfois');
insert into store (name) values ('Montana');
insert into store (name) values ('Mrvica');
insert into store (name) values ('Muscle freak');
insert into store (name) values ('CM');
insert into store (name) values ('DM');
insert into store (name) values ('Bakvala shop');
insert into store (name) values ('Torte i to');
insert into store (name) values ('AT Store');
insert into store (name) values ('Retro Home');
insert into store (name) values ('Flower box');
insert into store (name) values ('Buybook');
insert into store (name) values ('Inoma');

insert into reg_user (username,name,password,type,store_id) values ('zara','Zara shop','$2a$10$cP72CKRZKvyRcJj8rraW6Oz4kBrQ4KKzXmLtzX42ZArENXGMRu0X2',2,1);
insert into reg_user (username,name,password,type,store_id) values ('bershka','Bershka','$2a$10$v8RxEnbQnmuLWo5r4vJ78eCE6Pcx.u.FzpftjxyIRf8aaLTQrIXFe',2,2);
insert into reg_user (username,name,password,type,store_id) values ('parfois','Parfois','$2a$10$iyGbVOSQlm7oqGG19rrVQORO3yb0oAPlVo1GGuT9.VdAflLqjGXRK',2,3);
insert into reg_user (username,name,password,type,store_id) values ('montana','Montana','$2a$10$fg4NLe6uC.chO1sMfw4BeuWkX.Ph52dURtIsAfBdRYo9y7tJzDQzS',2,4);
insert into reg_user (username,name,password,type,store_id) values ('mrvica','Mrvica','$2a$10$4GYVqIghUAJHR3hQMCzebezr1yUpiUnvvkXopfvxe1X4j1.Noo2ta',2,5);

insert into reg_user (username,name,password,type,store_id) values ('musclefreak','Muscle Freak','$2a$10$J.rRXpx3D0s1HANRQPPZkOTVVnNjiuN/DkpZvdTnzz30oD/xSlSi.',2,6);
insert into reg_user (username,name,password,type,store_id) values ('cm','CM','$2a$10$SnC9Z/2mrEyIi3g8YZHt0.s659wInuCYpsHzQ5.OCq3m6F30ChEhC',2,7);
insert into reg_user (username,name,password,type,store_id) values ('dm','DM','$2a$10$5pLudX4qBBXv5s71GWIYies90P/VIIm7UkeBjidXD16/3blNonO.y',2,8);
insert into reg_user (username,name,password,type,store_id) values ('baklavashop','Baklava shop','$2a$10$mf3c6hEcwXHgSMv2/GtpROrYAYMf7yf0QV.S9CARi9uglExwvEfta',2,9);
insert into reg_user (username,name,password,type,store_id) values ('torteito','Torte i to','$2a$10$6jVVVOEHgqoiyKRwFngMsuMxpgKOQ.vHn.kthWmwtqhjjhXK1nOye',2,10);
insert into reg_user (username,name,password,type,store_id) values ('atstore','AT Store','$2a$10$SyzyNUQ1TK.nPkJlQ2miwe7FZUmpuapl8MPVAoAiYDofcl1GvMvRa',2,11);
insert into reg_user (username,name,password,type,store_id) values ('retrohome','Retro Home','$2a$10$9o3d08FqHTK.D.d4d47P0e4khKgVCcK5cP/PM/0uJFa8GU7cbTjC2',2,12);
insert into reg_user (username,name,password,type,store_id) values ('flowerbox','Flower box','$2a$10$E7JjbqRyZPO3Cv0xKNTZ2O5hSHq2Hx5NO1NBcEELPl4yMEY./PSi6',2,13);
insert into reg_user (username,name,password,type,store_id) values ('buybook','Buybook','$2a$10$M81sSfybN6SUg2nCSvZhYuizv2PNZ2TMyoUZh/n5xxmz.xPvpZJr6',2,14);
insert into reg_user (username,name,password,type,store_id) values ('inoma','Inoma','$2a$10$dfdCRN3x.A9rB43iAwlsc.tB.dLRl/5D9IX3348azral/Ph0EhMj2',2,15);