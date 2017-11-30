import json

from bson import json_util
from flask import Flask, request, Response, session, jsonify
from flask_pymongo import PyMongo
from pymongo.errors import DuplicateKeyError
from werkzeug import security
from werkzeug.exceptions import BadRequest, NotFound, UnsupportedMediaType, Unauthorized
from authy.api import AuthyApiClient
#from exceptions import JSONExceptionHandler
from pymongo import MongoClient
from pymongo.objectid import ObjectId
import datetime
#from mongoengine import *

# This defines a Flask application
app = Flask(__name__)

# This code here converts Flask's default (HTML) errors to Json errors.
# This is helpful because HTML breaks clients that are expecting JSON
#JSONExceptionHandler(app)

# We configure the app object
#app.config['MONGO_DBNAME'] = 'moving_database'
app.secret_key = 'A0Zr98j/3yX R~XHH!!!jmN]LWX/,?RT2341'

# This initializes PyMongo and makes `mongo` available
#mongo = PyMongo(app)
authy_api = AuthyApiClient('nhC1DZj2WEeGhKqqi1NNvcIrEHAL30W9')

# database schema
#client = MongoClient()
#client = MongoClient('localhost', 27017)
#db = client['moving_database']
#mongoengine.connect('moving_database', host='localhost', port=27017)
DB_NAME = "man_in_van"
DB_HOST = "ds125126.mlab.com"
DB_PORT = 25126
DB_USER = "admin"
DB_PASS = "Hello7777"

connection = MongoClient(DB_HOST, DB_PORT)
db = connection[DB_NAME]
db.authenticate(DB_USER, DB_PASS)

users = db['users']
moverReviews = db['mover_reviews']
jobs = db['jobs']
offers = db['offers']
jobPhotos = db['job_photos']
users = db['users']


#######################
##Revised API endpoints
#######################

@app.route('/profile', methods=['POST'])
def add_new_user():
    """
    This method is used to register a new user.
    :return:
    """
    # Bounce any requests that are not JSON type requests
    if not request.is_json:
        raise UnsupportedMediaType()

    # Check that the request body has `username` and `password` properties
    body = request.get_json()
    if body.get('username') is None:
        raise BadRequest('missing username property')
    if body.get('password') is None:
        raise BadRequest('missing password property')
    if body.get('first_name') is None:
        raise BadRequest('missing first name')
    if body.get('last_name') is None:
        raise BadRequest('missing first name')
    if body.get('zipcode') is None:
        raise BadRequest('missing zip code')
    else:
        zipcode = body.get('zipcode')
        if len(zipcode)!=5 or zipcode.isdigit()==False:
            raise BadRequest("Invalid zip code")
        zipcode = int(zipcode)
    if body.get('payment') is None:
        raise BadRequest('missing payment type')
    if body.get("phone") is None:
        phone = None
    else:
        phone = body.get("phone")
        if len(phone)!=10 or phone.isdigit()==False:
            raise BadRequest("Invalid phone number")
        phone = int(phone)

    if body.get('type') is None:
        raise BadRequest('missing user type')
    if body.get("vehicle") is None:
        raise BadRequest("Missing vehicle details")

    password_hash = security.generate_password_hash(body.get('password'))

    newUser = {"firstName": body.get("first_name"),
                "last_name":body.get("last_name"),
                "username":body.get("username"),
                "password": password_hash,
                "zipcode":zipcode,
                "payment":body.get("payment"),
                "phone": phone,
                "vehicle": body.get("vehicle"),
                "verified_phone": False}    

    try:
        users.insert_one(newUser)
    except DuplicateKeyError:
        raise NotFound('User already exists')

    # check that mongo didn't fail
    return Response(status=201)


@app.route('/profile', methods = ['PUT'])
def update():
    # if session.get('user') is None:
    #     raise Unauthorized()
    if not request.is_json:
        raise UnsupportedMediaType()

    if body.get("number") is not None:

        number = body.get('number')

        if len(number)!=10 or number.isdigit()==False:
            resp =authy_api.phones.verification_start(number, 1, via='sms')

            if resp.content["success"]:
                users.update_one({'_id':ObjectID(session.get('user')["_id"]["$oid"])},{'$set':{'phone':phone}})
                #Add number to database record
                return Response(200)
            else:
                return Response("Invalid number",400)

        else:
            raise BadRequest("invalid phone number")

    

    ##TODO: implement update method

@app.route('/profile', methods = ['GET'])
def update_profile():
    if session.get('user') is None:
        raise Unauthorized()

    return jsonify(session.get('user'))


@app.route('/verify', methods = ['POST'])
def verifyCode():
    if session.get('user') is None:
        raise Unauthorized()

    body = request.get_json()
    if body.get('code') is None:
        raise BadRequest('missing verification code')

    code = body.get('code')

    username = session.get('user')['username']
    phone = users.find_one({'username': username})["phone"]
    #phone = "9174766772"

    if phone is None:
        raise BadRequest("No phone number available")
    
    resp = authy_api.phones.verification_check(phone, 1, code)

    if resp.content["success"]:
        users.update_one({'_id':session.get('user')["_id"]["$oid"]},{'$set':{'verified_phone':True}})
        return Response(200)

    else:
        #Either code is wrong or has expired
        return Response(401)

@app.route('/login', methods=['POST'])
def login():
    """
    This method logs the user in by checking username + password
    against the mongo database
    :return:
    """
    # Bounce any requests that are not JSON type requests
    if not request.is_json:
        raise UnsupportedMediaType()

    # Check that the request body has `username` and `password` properties
    body = request.get_json()
    if body.get('username') is None:
        raise BadRequest('missing username property')
    if body.get('password') is None:
        raise BadRequest('missing password property')

    user = users.find_one({'username': body.get('username')})

    if user is None:
        session.clear()
        raise BadRequest('User not found')
    if not security.check_password_hash(user['password'], body.get('password')):
        session.clear()
        raise BadRequest('Password does not match')

    # this little trick is necessary because MongoDb sends back objects that are
    # CLOSE to json, but not actually JSON (principally the ObjectId is not JSON serializable)
    # so we just convert to json and use `loads` to get a dict
    serializable_user_obj = json.loads(json_util.dumps(user))
    session['user'] = serializable_user_obj

    print session['user']
    return Response(status=200)


@app.route('/logout')
def logout():
    """
    This 'logs out' the user by clearing the session data
    """
    session.clear()
    return Response(status=200)

app.route('/jobs', methods=['POST'])
def create_job():
    """
    Create a record in the jobs collection.
    Only possible if the user is logged in!!
    """
    # Bounce any requests that are not JSON type requests
    if not request.is_json:
        raise UnsupportedMediaType()

    if session.get('user') is None:
        raise Unauthorized()

    # Check that the JSON request has the fields you expect
    body = request.get_json()
    if body.get('start_time') is None:
        raise BadRequest('missing start_time property')
    if body.get('end_time') is None:
        raise BadRequest('missing end_time property')
    if body.get('start_address') is None:
        raise BadRequest("missing start address property")
    if body.get('send_address') is None:
        raise BadRequest("missing end address property")
    if body.get("max_price") is None:
        raise BadRequest("missing max price property")
    else:
        try:
            max_price = float(body.get("max_price"))
        except Exception,e:
            raise BadRequest("Invalid max price property")


    # Create a dictionary that will be inserted into Mongo
    job_record = {'start_time': body.get('start_time'), 
                    'end_time': body.get('end_time'),
                    'start_address': body.get('start_address'),
                    'end_address': body.get("end_address"),
                    'max_price': max_price}

    job_record.update({'user': session['user']['_id']['$oid']})

    # Insert into the mongo collection
    res = jobs.insert_one(job_record)
    return Response(str(res.inserted_id), 200)

app.route('/jobs', methods=['GET'])
def get_jobs():
    all_jobs = jobs.find()
    return jsonify(all_jobs)



##################################

##Existing API endpoints - to be cleaned up later##

#################################



@app.route('/profile', methods = ['POST'])
def profile():
    """
    This method is used to register a new user.
    :return:
    """

    # Bounce any requests that are not JSON type requests
    if not request.is_json:
        raise UnsupportedMediaType()

    # Check that the request body has `first_name`,`last_name`, `username` and `password` properties
    body = request.get_json()
    if body.get('type') is None:
        raise BadRequest('missing type property')
    if body.get('first_name') is None:
        raise BadRequest('missing first_name property')
    if body.get('last_name') is None:
        raise BadRequest('missing last_name property')
    if body.get('username') is None:
        raise BadRequest('missing username property')
    if body.get('password') is None:
        raise BadRequest('missing password property')
    else:
        password_hash = security.generate_password_hash(body.get('password'))
    if body.get('verified_phone') is None:
        raise BadRequest('missing verified_phone property')

    typeU = body.get('type')
    first_name =  body.get('first_name')
    last_name = body.get('last_name')
    username = body.get('username')
    password = body.get('password')
    zipcode = body.get('zipcode')
    vehicle = body.get('vehicle')
    payment = body.get('payment')
    photo = body.get('photo')
    phone = body.get('phone')
    verified_phone = body.get('verified_phone')

    '''post = {"type":"mover",
                "first_name": "Mike",
                "last_name": "Weener",
                "username": "mikew@gmail.com",
                "password": "1234",
                "zipcode":10103,
                "vehicle": "truck",
                "payment": "debit",
                "photo": "mike.jpg",
                "phone": "123456789",
                "verified_phone": False,
                "dateCreated": datetime.datetime.utcnow()
                }'''

    post = {'type':typeU,
                'first_name':first_name,
                'last_name': last_name,
                'username': username,
                'password': password,
                'zipcode':zipcode,
                'vehicle':vehicle,
                'payment':payment,
                'photo':photo,
                'phone':phone,
                'verified_phone':verified_phone
                'dateCreated': datetime.datetime.utcnow()
                }

    try:
        postId = mongo.db.users.insert_one(post).inserted_id

        #return jsonify(status='OK',message='inserted successfully')
        #return str(postId)

    except DuplicateKeyError:
        raise NotFound('User already exists')

    # check that mongo didn't fail
    return Response(status=201)



@app.route('/profile', methods = ['GET'])
def profile():
    """
    This method gets all profile data of currently logged user
    input: session id here should match the id stored in database
    return: 
    """
    # Bounce any requests that are not JSON type requests
    if not request.is_json:
        raise UnsupportedMediaType()

    try:
        user = mongo.db.users.find_one({"_id": "<session_id>"}) #session id here should match the id stored in database
        #mongo.db.users.find_one({"_id": ObjectId("569bbe3a65193cde93ce7092")})

        if user != None:
            return user
        else:
            return jsonify(status='ERROR',message='profile does not exist')

    except Exception,e:
        return jsonify(status='ERROR',message=str(e))



@app.route('/profile', methods = ['PUT'])
def profile():
    """
    This method updates profile data for currently logged in user
    input: session id here should match the id stored in database, one or any of the user registration field
    return: 
    """
    # Bounce any requests that are not JSON type requests
    if not request.is_json:
        raise UnsupportedMediaType()

    try:
        '''body = request.get_json() - comes from frontend
        first_name =  body.get('first_name')
        last_name = body.get('last_name')
        username = body.get('username')
        password = body.get('password')
        zipcode = body.get('zipcode')
        vehicle = body.get('vehicle')
        payment = body.get('payment')
        photo = body.get('photo')
        phone = body.get('phone')'''

        mongo.db.users.update_one({'_id':ObjectId(userId)},{'$set':{'first_name':first_name,
                                                            'last_name': last_name,
                                                            'username': username,
                                                            'password': password,
                                                            'zipcode':zipcode,
                                                            'vehicle':vehicle,
                                                            'payment':payment,
                                                            'photo':photo,'phone':phone}}) #userId = sessionId = _id in users collection
        
        return jsonify(status='OK',message='Updated successfully')

    except Exception,e:
        return jsonify(status='ERROR',message=str(e))


@app.route('/login', methods=['POST'])
def login():
    """
    This method logs the user in by checking username + password against the mongo database
    :return:
    """
    # Bounce any requests that are not JSON type requests
    if not request.is_json:
        raise UnsupportedMediaType()

    # Check that the request body has `username` and `password` properties
    body = request.get_json()
    if body.get('username') is None:
        raise BadRequest('missing username property')
    else:
        username = body.get('username')
    if body.get('password') is None:
        raise BadRequest('missing password property')
    else:
        password = body.get('password')
    if body.get('type') is None:
        raise BadRequest('missing type property')
    else:
        typeU = body.get('type')

    #user = mongo.db.users.find_one({'username': body.get('username')})
    user = mongo.db.users.find_one({'$and': [{'username':username}, {'type':typeU}]})
    if user is None:
        session.clear()
        raise BadRequest('User not found')
    if not security.check_password_hash(user['password_hash'], body.get('password')):
        session.clear()
        raise BadRequest('Password does not match')

    # this little trick is necessary because MongoDb sends back objects that are
    # CLOSE to json, but not actually JSON (principally the ObjectId is not JSON serializable)
    # so we just convert to json and use `loads` to get a dict
    serializable_user_obj = json.loads(json_util.dumps(user))
    session['user'] = serializable_user_obj
    return Response(status=200)


@app.route('/logout', methods = ['POST'])
def logout():
    """
    This 'logs out' the user by clearing the session data
    """
    session.clear()
    return Response(status=200)



@app.route('/verify', methods = ['POST'])
def verifyCode():
    """
    This method verifies phone number
    input: session id here should match the id stored in database, code
    return: 
    """
    #if session.get('user') is None:
    #     raise Unauthorized()

    body = request.get_json()
    if body.get('code') is None:
        raise BadRequest('missing verification code')

    code = body.get('code')

    #Get number from database instead
    
    #user = mongo.db.users.find_one({'username': "zee"})
    user = mongo.db.users.find_one({"_id": "<session_id>"}) #session id here should match the id stored in database
    #mongo.db.users.find_one({"_id": ObjectId("569bbe3a65193cde93ce7092")})
    number = user["number"]
    #number = "9174766772"

    resp = authy_api.phones.verification_check(number, 1, code)

    post = {'userId':session_id,
            'phone':number,
            'code':code
            }

    if resp.content["success"]:
        #insert phone code in collection "phone_codes" with user id
        try:
            postId = mongo.db.phone_codes.insert_one(post).inserted_id

        except DuplicateKeyError:
            raise NotFound('User already exists')


        return Response(200)

    else:
        #Either code is wrong or has expired
        return Response(401)


@app.route('/jobs', methods=['POST'])
def create_job():
    """
    Create a record in the jobs collection.
    Only possible if the user is logged in!!
    """
    # Bounce any requests that are not JSON type requests
    if not request.is_json:
        raise UnsupportedMediaType()

    if session.get('user') is None:
        raise Unauthorized()

    # Check that the JSON request has the fields you expect
    body = request.get_json()
    if body.get('start_address') is None:
        raise BadRequest('missing start_address property')
    if body.get('end_address') is None:
        raise BadRequest('missing end_address property')
    if body.get('start_time') is None:
        raise BadRequest('missing start_time property')
    if body.get('end_time') is None:
        raise BadRequest('missing end_time property')
    if body.get('max_price') is None:
        raise BadRequest('missing max_price property')

    start_address = body.get('start_address')
    end_address = body.get('end_address')
    start_time = body.get('start_time')
    end_time = body.get('end_time')
    max_price = body.get('max_price')

    # Create a dictionary that will be inserted into Mongo
    job_record = {'start_address':start_address,'end_address':end_address,'start_time': start_time, 'end_time': end_time,'max_price':max_price}
    #job_record.update({'user': session['user']['_id']['$oid']})
    # Insert into the mongo collection
    #res = mongo.db.jobs.insert_one(job_record)
    #return Response(str(res.inserted_id), 200)

    try:
        job = mongo.db.jobs.insert_one(post).inserted_id

    except DuplicateKeyError:
        raise NotFound('Job already exists')

    return Response(200)

    

@app.route('/jobs', methods=['GET'])
def open_jobs():
    """
    This method returns all open jobs
    return: job list
    """

@app.route('/jobs/id', methods=['GET'])
def job_desc():
    """
    This method returns job with specific id
    input: job id
    return: job details
    """
    # Bounce any requests that are not JSON type requests
    if not request.is_json:
        raise UnsupportedMediaType()

    body = request.get_json()
    if body.get('job_id') is None:
        raise BadRequest('missing job_id property')

    jobId = body.get('job_id')

    try:
        job = mongo.db.jobs.find_one({"_id": jobId}) #session id here should match the id stored in database
        #mongo.db.users.find_one({"_id": ObjectId("569bbe3a65193cde93ce7092")})

        if job != None:
            return job
        else:
            return jsonify(status='ERROR',message='job does not exist')

    except Exception,e:
        return jsonify(status='ERROR',message=str(e))


@app.route('/addOffer', methods=['POST'])
def addOffer():
    # Bounce any requests that are not JSON type requests
    if not request.is_json:
        raise UnsupportedMediaType()

    # Check that the request body has `first_name`,`last_name`, `username` and `password` properties
    body = request.get_json()
    if body.get('job_id') is None:
        raise BadRequest('missing job_id property')
    if body.get('price') is None:
        raise BadRequest('missing price property')
    if body.get('start_time') is None:
        raise BadRequest('missing start_time property')

    jobId = body.get('job_id')
    price =  body.get('price')
    start_time = body.get('start_time')
    userId = #session Id = Id stored in database


    offer = {'userId': userId,
                'jobId':jobId,
                'price':price,
                'start_time': start_time
                }

    try:
        offerId = mongo.db.offers.insert_one(offer).inserted_id

        #return jsonify(status='OK',message='inserted successfully')
        #return str(postId)

    except DuplicateKeyError:
        raise NotFound('offer already exists')

    # check that mongo didn't fail
    return Response(status=201)


@app.route('/acceptOffer', methods=['POST'])
def acceptOffer():
    """
    This method is used to accept offer
    input: job id, offer id
    return: boolean
    """


@app.route('/review', methods=['POST'])
def review():
    """
    This method is used to give mover_reviews
    input: rating
    return:
    """
    # Bounce any requests that are not JSON type requests
    if not request.is_json:
        raise UnsupportedMediaType()

    # Check that the request body has `first_name`,`last_name`, `username` and `password` properties
    body = request.get_json()
    if body.get('rating') is None:
        raise BadRequest('missing rating property')

    review_score = body.get('rating')
    userId = #session Id = Id stored in database


    rev = {'userId': userId,
                'review_score':rating
                }

    try:
        revId = mongo.db.movers_reviews.insert_one(rev).inserted_id

        #return jsonify(status='OK',message='inserted successfully')
        #return str(postId)

    except DuplicateKeyError:
        raise NotFound('review already exists')

    # check that mongo didn't fail
    return Response(status=201)




@app.route('/addPhone', methods = ['POST'])
def addPhone():
    # if session.get('user') is None:
    #     raise Unauthorized()

    body = request.get_json()
    #need user id as well - signUp returns id which can be used as session id
    if body.get('number') is None:
        raise BadRequest('missing phone number')

    number = body.get('number')
    resp =authy_api.phones.verification_start(number, 1, via='sms')
    

    if resp.content["success"]:
        #Add number to database record
        db.users.update_one({'_id':ObjectId(userId)},{'$set':{'phone':phone}})
        return Response(200)
    else:
        return Response("Invalid number",400)


@app.route('/user', methods=['GET'])
def who_am_i():
    """
    Simple method just to show how you can access session data
    :return:
    """
    if session.get('user') is None:
        raise Unauthorized()
    return jsonify(session.get('user'))



# This allows you to run locally.
# When run in GCP, Gunicorn is used instead (see entrypoint in app.yaml) to
# Access the Flack app via WSGI
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)