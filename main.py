from flask import Flask
from flask_cors import CORS
from flask_restful import reqparse, abort, Api, Resource
import json
import csv
import time


parser = reqparse.RequestParser()
parser.add_argument('data', type=str)
parser.add_argument('user', type=str)

app = Flask(__name__)
CORS(app)

api = Api(app)


def saveRecordCSV(arr, user):
	if not user:
		user = time.time()

	with open('data/%s.csv' % user, mode='w') as csv_file:
		fieldnames = ['time', 'operation', 'content']
		writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

		writer.writeheader()

		for row in arr:
			writer.writerow(row)


class RecordSaver(Resource):
	def post(self):
		args = parser.parse_args()

		data_str = args['data']
		data_arr = json.loads(data_str)
		
		user = args['user']

		saveRecordCSV(data_arr, user)

		return "Ok", 200


api.add_resource(RecordSaver, '/')


if __name__ == '__main__':
	app.run(debug=True)
