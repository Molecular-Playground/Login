# ms-login
A microservice for user authentication.

All installation is done automatically through docker. If you do not have docker installed, install [here](https://docs.docker.com/engine/installation/).

### To Run
Before we begin, make sure you have the database running in a container. You can find instructions on how to do that [here](https://github.com/Molecular-Playground/databaes). From inside docker virtual machine, navigate to the top directory of this repository. Enter the following commands:
```
docker build -t login .
docker run -p 3001:3001 --link postgres:postgres login
# where the left postgres is the name of your postgres container
```
To test the login, run ```curl -d 'username=bruce@wayne.com&password=bruce' -u "bruce@wayne.com:bruce" "http://localhost:3001"```