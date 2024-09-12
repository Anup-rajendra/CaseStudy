# CaseStudy


# I have done two changes in the Database


# 1. Added a photoUrl column in Products table
    Added a photoURL column in products table, this contains URL for images - this URL is to productimages folder in react app which allows to display photos.

    The Products Table looks like this

    ProductID	CategoryID	SupplierID	InventoryID	Name	Price	PhotoURL
    1	1	1	1	Laptop	998.990	/productimages/laptop.jpeg
    2	2	2	2	Novel	19.990	/productimages/novel.jpeg
    3	3	3	3	T-shirt	9.990	/productimages/tshirt.jpeg
    4	4	4	4	Microwave	49.990	/productimages/microwave.jpeg
    5	5	5	5	Action Figure	14.990	/productimages/actionfigure.jpeg

# 2. Hashed Passwords Column in User table
    I have implemented password hashing , hence i have already hashed passwords stored in the table.

    The Users table looks like this

    UserID	Username	Firstname	Lastname	Email	Token	EmailVerified	UPassword	URole	TokenExpiry	PhoneNumber	ProfilePicture
1	john_doe	John	Doe	john@example.com	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImpvaG5fZG9lIiwibmFtZWlkIjoiMSIsIm5iZiI6MTcyNDc1NjU4OSwiZXhwIjoxNzI0NzYwMTg5LCJpYXQiOjE3MjQ3NTY1ODksImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTE4NS9hcGkvUmV0YWlsQVBJL2F1dGhlbnRpY2F0ZSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9sb2dpbiJ9.ixnJCbZZvGBRoxs8S9hX07X-GAJYx-u9Flr4EzWxvbU	1	$2a$10$d1V3AVkZcWAYoWOcjc/oMOXiH29lLW1xT3HdbLj93.dtEgMcRzI0u	Customer	2024-12-31 23:59:59.000	1234567890	profile1.jpg
2	jane_smith	Jane	Smith	jane@example.com	token2	1	$2a$10$rQRC.kYJkrYxXDYy7q/kwu8a2mkH87CnO8GecmbguT/txfROn0qyC	Customer	2024-12-31 23:59:59.000	1234567891	profile2.jpg
3	admin_user	Admin	User	admin@example.com	token3	1	$2a$10$UKzPn75oGwwCfnSBCgORVeCCmVnyMlH1brB/9BSKLkCfKV0KMAIEC	Admin	2024-12-31 23:59:59.000	1234567892	profile3.jpg
4	bob_jones	Bob	Jones	bob@example.com	token4	0	$2a$10$UGHYXG6QI/hYiDqZUpqyLuhOWSqfP9.fBQ6JwQN1K6t1awBgRcmUu	Customer	2024-12-31 23:59:59.000	1234567893	profile4.jpg
5	alice_brown	Alice	Brown	alice@example.com	token5	0	$2a$10$CzTluf2IgHOJvO4lhhaNV.FX/J9XxjRF3wmO/ltRMO.mDaqel5Syi	Customer	2024-12-31 23:59:59.000	1234567894	profile5.jpg
6	Musthaffa	Musthaffa	Shaik	musthaffa2311@gmail.com	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Ik11c3RoYWZmYSIsIm5hbWVpZCI6IjYiLCJuYmYiOjE3MjUzNjYwMDMsImV4cCI6MTcyNTM2OTYwMywiaWF0IjoxNzI1MzY2MDAzLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxODUvYXBpL1JldGFpbEFQSS9hdXRoZW50aWNhdGUiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjMwMDEvbG9naW4ifQ.ZJroRbJ04RQhMDdj_Znftje1V9NqA2biBVlDPurOQIA	1	$2a$10$JbcHJPJzOe8qPTxIaGyaiO1aX9f5ycNBwfSAM4gBZjNqP6zs6.nhC	Customer	2024-12-31 23:59:59.000	9049436369	profile6.png
7	Samatha	Samatha	p	musthaffawork@gmail.com	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IlNhbWF0aGEiLCJuYW1laWQiOiI3IiwibmJmIjoxNzI0NzU4NTQ2LCJleHAiOjE3MjQ3NjIxNDYsImlhdCI6MTcyNDc1ODU0NiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MTg1L2FwaS9SZXRhaWxBUEkvYXV0aGVudGljYXRlIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwL2xvZ2luIn0.iaW1Zs3isn_n_BwFiqAF__FUmd6l1M4rDL6nkMLR2yE	1	$2a$10$02lspmkv1ITF9Ub1ErSyde6WJBSFzf5VtkxMN9cOhOsSg8ImJGJVm	NULL	NULL	9999999999	NULL
8	Abdul	afreen	shaik	afreen31@gmail.com	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkFiZHVsIiwibmFtZWlkIjoiOCIsIm5iZiI6MTcyNDgyMTU4MywiZXhwIjoxNzI0ODI1MTgzLCJpYXQiOjE3MjQ4MjE1ODMsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTE4NS9hcGkvUmV0YWlsQVBJL2F1dGhlbnRpY2F0ZSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9sb2dpbiJ9.H_HtmQ-afCeDggaBUD21Y_489ips674PUtJvAWbCriU	1	$2a$10$ZrRy0w0jKDWv6w9bpXD.TunVOWsM8nIhItSMlPhY0Im4C0XUPg0ry	NULL	NULL	333333	NULL
9	Faayaz	Fayaz	k	rohithkv271@gmail.com	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkZhYXlheiIsIm5hbWVpZCI6IjkiLCJuYmYiOjE3MjQ4Mzk4MzMsImV4cCI6MTcyNDg0MzQzMywiaWF0IjoxNzI0ODM5ODMzLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxODUvYXBpL1JldGFpbEFQSS9hdXRoZW50aWNhdGUiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvbG9naW4ifQ.7yz4FR_SFmAAuMlILsa8eheetAUcCboIWbjvpKiJZvw	1	$2a$10$jmErng/YvluSsD4EAIo0eejFF5m/TCRDbPIgSAhvQMXIhThgVqz5e	NULL	NULL	3333333	NULL





