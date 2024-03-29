# -*- coding: utf-8 -*-

from flask import Flask
from flask import got_request_exception
from flask_cors import CORS
from flask_restful import reqparse, abort, Api, Resource
import json
import csv
import time
import datetime
from urllib import parse
import logging
import logging.handlers


app = Flask(__name__)
CORS(app)

api = Api(app)

def saveRecordCSV(arr, user):
	if not user:
		user = int(time.time())

	with open('data/%s.csv' % user, mode='w', newline='', encoding='utf-8') as csv_file:
		fieldnames = ['time', 'operation', 'content']
		writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

		writer.writeheader()

		for row in arr:
			writer.writerow(row)


class Recorder(Resource):
	def __init__(self):
		self.req_parser = reqparse.RequestParser()
		self.req_parser.add_argument('data', type=str)
		self.req_parser.add_argument('user', type=str)

		super(Recorder, self).__init__()

	def post(self):
		args = self.req_parser.parse_args()

		data_str = parse.unquote(args['data'])
		data_arr = json.loads(data_str)
		
		user = args['user']

		saveRecordCSV(data_arr, user)

		return "Ok, record saved.", 200

api.add_resource(Recorder, '/')


def log_exception(sender, exception, **extra):
	sender.logger.error('Exception occurs: %s', exception)

got_request_exception.connect(log_exception, app)


# config logging
logging.basicConfig(
	filename='logs/debug%s.log' % (datetime.datetime.now().strftime("%Y-%m-%d %H")),
	level=logging.DEBUG,
	format='%(asctime)s::%(levelname)s::%(message)s',
	datefmt='%Y-%m-%d %H:%M:%S'
)

if __name__ == '__main__':
	app.run(debug=True, host='0.0.0.0')
