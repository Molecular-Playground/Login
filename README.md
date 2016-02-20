# ms-login
A microservice for user authentication.

All installation is done automatically through docker. If you do not have docker installed, install [here](https://docs.docker.com/engine/installation/).

### To Run
Before we begin, make sure you have the database running in a container. You can find instructions on how to do that [here](https://github.com/Molecular-Playground/databaes). From inside docker virtual machine, navigate to the top directory of this repository. Enter the following commands:
```
docker build -t login .
docker run -tiv (directory of your code):/src -p 3001:3001 --name login --link postgres:postgres login
```
### To Restart
To restart the container with new code, simply run ```docker restart -t=0 login```