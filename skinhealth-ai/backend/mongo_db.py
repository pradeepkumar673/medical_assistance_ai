from flask import g, current_app
from pymongo import MongoClient


def get_db():
    if 'mongo_db' not in g:
        client = MongoClient(current_app.config['MONGO_URI'])
        g.mongo_client = client
        g.mongo_db = client[current_app.config['MONGO_DB_NAME']]
    return g.mongo_db
