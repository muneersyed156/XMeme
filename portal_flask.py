#Libraries and Modules are declared here

#Importing Flask,request,render_template,abort,Response from flask module for use in code
from flask import Flask,request,render_template,abort,Response

#Importing json to dump data for a request or load data from a request 
import json

#Importing CORS,cross_origin to avoid cors_origin errors if any occur
from flask_cors import CORS,cross_origin

#Importing time module to record the request initiated time and send store in DB
import time

#Importing pymongo to access Mongodb to store or retrieve data
import pymongo


#Creating a flask object and accessing it as 'app' for application
app=Flask(__name__)

#Creating a MongoClient object to access db as instance
obj=pymongo.MongoClient()

#Using a db called test, if not present in mongodb this db will be created
db=obj.test



#routing any request with "/" or with ip_address to this method
@app.route("/")
def test():
    ''' This method renders index.html page from templates folder on to browser '''
    return(render_template("index.html"))

#A 'GET' request to '/memes/<int:ide>' api-endpoint  will be routed to this method
@app.route("/memes/<ide>",methods=['GET'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def fetch(ide):
    ''' 
        In this method we retrieve data from Mongodb using MongoClient obj and query
        that fetches a document with a particular Id as given in api-endpoint and returns it as JSON if exisits
        or it aborts with 404 status code

    '''
    result=list(db.sample1.find({"id":int(ide)},{"_id":0}))
    if(result!=[]):
        return(json.dumps(result[0]))
    else:
        abort(404)
        return("There is no data with this id")

#A 'PATCH' request to '/memes/<int: ide>' api-endpoint will be routed to this method
@app.route("/memes/<ide>",methods=["PATCH"])
@cross_origin(origin="*",headers=['content-Type','Authorization'])
def edit_content(ide):
    '''
       Here we access the ide from request and then fetches a document from Mongodb
       that matches with the document's id.So based on the 'PATCH' request which means 
       a kind of Update , we update that particular document in db with the data sent 
       by the user as part this request.If there is not data in db with the requested ide
       then we abort with 404 status code
    '''
    result=list(db.sample1.find({"id":int(ide)},{"_id":0}))
    if(result!=[]):
        #using json to load or parse the data and convert it into a dict
        data=json.loads(request.data)
        #storing url,caption data into respective variables
        url=data['url'];caption=data['caption']
        #updating the mongodb document with caption,url values using update_one query
        result=db.sample1.update_one({"id":int(ide)},{"$set":{"caption":caption,"url":url}})
        #returning a 200 status code as the 'PATCH' request is successful
        status_code = Response(status=200)
        return(status_code)#Return this status
    else:
        #aborting the request with 404 as no data exists
        abort(404,"This id doesn't exist")

# A 'GET' request to '/memes' api-endpoint will be routed to this method
@app.route("/memes/")
@app.route("/memes",methods=['GET'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def fetchall():
    ''' 
       When this method is called , it retireves recently added 100 documents to that db
       as a list of json objects
    '''
    result=list(db.sample1.find({},{"_id":0}).sort([("id",-1)]).limit(100))
    result=result[::-1]
    return(json.dumps(result))

# A 'POST' request to '/memes' api-endpoint will be routed to this method
@app.route("/memes",methods=["POST"])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def memes():
    '''
        In this method the data entered by user is send as POST request and thsi request data
        is parsed and then checked if this data already exists in the db, if exists then we
        abort the operation with 409 status code, if it doesn't exist in db then we enter that
        data into db as a document with fields like id,name,caption,url,time at which this post 
        request is initiated  
    '''
    #If there is data is received successfully then
    if(request.data):
        #data is parsed from JSON to a dict
        data=json.loads(request.data)
        # name, caption,url datais stored in respective variables
        name=data['name']
        url=data['url']
        caption=data['caption']

    #If form is used in html then data is sent to this condition as form data
    if(request.form):
        #form data is collected and then we store it in respective varaibles
        data=request.form
        name=data["name"];caption=data["caption"];url=data["url"]
    k=url;k=k.split(".")
    #We chech if the data exists in db using find query
    test_duplicate=list(db.sample1.find({"name":name,"caption" : caption,"url" : url}))

    #If data in db doesn't existsthen we enter data as document into the db
    if(test_duplicate==[] and (k[-1] in ["jpg","jpeg","png"])):
        k=db.sample1.count()
        ide=k+1
        time_stamp=str(time.ctime())
        db.sample1.insert_one({"id":ide,"name":name,"caption":caption,"url":url,"time":time_stamp})
        #After successful insertion of data, the id of that document is returned as JSON
        return(json.dumps({"id":ide}))
    elif(k[-1] not in ["jpg","jpeg","png"]):
        abort(404,"This url extension is not matched")
    #If the data in db already exists
    else:
        #Then we abort the request with 409 status code
        abort(409,"This data already exists")
        return


if __name__=="__main__":
    #Running the application on port 8081 in development mode so enabled debug to True
    app.run(debug=True,port=8081,host='0.0.0.0')




