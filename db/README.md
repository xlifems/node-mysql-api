# remove old container

# create new container
docker run -it --name express-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql
9dbd5716a9f352568b4789e0fe2d9e2a87431ed859ba4127bd5a63c7f2ca55b6

# enter in current container
└──╼ $ docker exec -it 9db /bin/bash

mysql -u root -proot