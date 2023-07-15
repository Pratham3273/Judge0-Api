# Judge0-Api

## Description
This is a complete functional clone of Judge0-Api.

## Running the project

First clone this repository by typing this in command line : 
### `git clone https://github.com/Pratham3273/Judge0-Api.git`

Split your terminal into two and cd to the directory in which you've cloned this repo. In the first terminal install backend dependencies using:
### `cd Backend/`
### `npm i`

similarly in the second terminal :
### `cd Client/`
### `npm i`

now, in the backend, change the file named 'sample .env' to '.env' and enter your credentials.

Note that by default the BACKEND runs on the port 5000 while the CLIENT runs on the port 3000.

Ensure that you have WSL installed on your computer. 
You can install it from here : https://learn.microsoft.com/en-us/windows/wsl/install

Once you have WSL installed, Install REDIS. 
You can download it from here : https://redis.io/docs/getting-started/installation/install-redis-on-windows/

Once you have redis installed, run this command on your system command line to initiate redis server.
### `redis-cli`

Now, in both split terminals type this command to initiate backend and client.
### `npm start`
