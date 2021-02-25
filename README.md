.
├── install.sh
├── portal_flask.py
├── README.md
├── requirements.txt
├── server.sh
├── sleep.sh
├── static
│   ├── index.css
│   └── index.js
└── templates
    └── index.html

2 directories, 9 files

1. The above stated diagram shows the files and the structure in this Repo
2. This Micro-Experience is developed using Flask Framework
3. Files and their contents are listed below
   
   a. install.sh: This file consists of commands to install the mandatory SDK's to use this   Application in a new Setup

   b. server_run.sh: Consists of commands to run the backend

   c. sleep.sh: sleep command with some time(10 sec)

   d. static: This folder consists of static files like JS,CSS. So we are having our index.js,inde.css files in this folder

   e. templates: This folder consists of HTML files. So we have our index.html file here

   d. requirements.txt: Consists of 3rd party python libraries or packages needed to be installed to run the python script successfully

   f. portal_flask.py: Consists of our flask server code.When we run this python script the backend server starts running at 8081 port

   g. Dockerfile: This application can be placed in container,by building an image with this file and running a conatiner with that image. 

4. The front-end code is stored in static,templates folder
5. Where as back-end code is present in a file named as portal_flask.py

TechStack:

1. HTML
2. CSS
3. JS
4. Flask Framework
5. python3
6. Nginx
7. MongoDB

Steps To deploy the application:

1. Clone the repo: git clone "Url of this repo"
2. cd Crio
3. sudo chmod +x install.sh
4. ./install.sh
5. sudo chmod +x server_run.sh
6. ./server_run.sh
7. sudo chmod +x sleep.sh
8. ./sleep.sh
9. Now you can test if the server is setup successfully or not by running this command
   curl --location --request POST 'http://localhost:8081/memes' \
   --header 'Content-Type: application/json' \
   --data-raw '{
   "name": "xyz",
   "url": "abc.com",
   "caption": "This is a meme"
   }'

   This should return a json like {"id": 1} if the entered url is a valid one(An integer say 1 here)
   Or 409 if such data already exists in DB 

10. curl --location --request GET 'http://localhost:8081/memes' should return an empty list   
    if there is no data in db.If there is any data in db then it should return as list of JSON
    objects


  API Documentation 

| API end-point | Request Type|    Sample Payload            | Explanation              |
| :-----------: | :---------: | :------------------------:   |:------------------------:|      
| /memes        |    POST     |  {"name":"Ajay",             |After end user enters     |
|               |             |   "caption": Crio Memes,     |data it is sent as POST   |
|               |             |   "url": "https://sample.png"|req to this api           |  
|               |             |   }                          |                          | 
|               |             |                              |                          |
| /memes        |    GET      |{"name":"name","url":"...png",| Sends data present in db |
|               |             | "caption":"caption",         | when this api is hit     |
|               |             | "time":"time_meme_created"}  |                          |
|               |             |                              |                          |
| /memes/<int:d>|    PATCH    |{"url":"image_url of that id",|Meme of that card having  |
|               |             |   "caption":"meme_caption" } |that id is sent to update |
|               |             |                              | data in db               |
|               |             |                              |                          |
| /memes/<int:d>|    GET      |{"url":"image_url of that id",|Data of that particular id|
|               |             |  "caption":"meme_caption",   |is sent from db           |
|               |             |  "id":"id of meme",          |                          |
|               |             |   "time":"time_meme_created" |                          |