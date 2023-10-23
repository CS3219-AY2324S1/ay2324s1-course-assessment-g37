### Set up

copy secret files to ec2 instance
```
scp -i <path/to/pem>.pem secrets.zip ec2-user@<public ip of ec2 instance>:\home\ec2-user
```

ssh into ec2 instance
```
ssh -i <path/to/pem>.pem ec2-user@<public ip of ec2 instance>
```

Update instance
```
sudo yum update -y
```

Install docker
```
sudo yum install docker -y
wget https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) 
sudo mv docker-compose-$(uname -s)-$(uname -m) /usr/local/bin/docker-compose
sudo chmod -v +x /usr/local/bin/docker-compose
```

Install git
```
sudo yum install git -y
```

Add group membership for ec2-user to run docker commands
```
sudo usermod -a -G docker ec2-user
id ec2-user
newgrp docker
```

Enable and start docker
```
sudo systemctl enable docker.service
sudo systemctl start docker.service
```

Initialise docker swarm
```
sudo docker swarm init
```

Clone repo
```
git clone https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g37.git
```

Unzip secrets
```
unzip secrets.zip -d ay2324s1-course-assessment-g37/
```

Start the containers
```
cd ay2324s1-course-assessment-g37/
docker-compose up --build
``

#### Set up script for ec2 launch

```
#!/bin/bash -ex
sudo yum update -y
sudo yum install docker -y
wget https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) 
sudo mv docker-compose-$(uname -s)-$(uname -m) /usr/local/bin/docker-compose
sudo chmod -v +x /usr/local/bin/docker-compose
sudo yum install git -y
sudo usermod -a -G docker ec2-user
id ec2-user
newgrp docker
sudo systemctl enable docker.service
sudo systemctl start docker.service
sudo docker swarm init
git clone https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g37.git
```