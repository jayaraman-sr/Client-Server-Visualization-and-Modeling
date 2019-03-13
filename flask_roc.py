from flask import Flask
from flask_restful import Resource, Api
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_curve
import pandas as pd
import numpy as np

from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)

CORS(app)


class ROC(Resource):
	def get(self, preprocessing, c):
		# you need to preprocess the data according to user preferences (only fit preprocessing on train data)
		# fit the model on the training set
		# predict probabilities on test set

		#Standardization
		scaler = StandardScaler()
		if preprocessing == 'MinMaxScaler':
			scaler = MinMaxScaler()
		
		for column in X_train.columns:
			X_train[[column]] = scaler.fit_transform(X_train[[column]])
			X_test[[column]] = scaler.transform(X_test[[column]])

		#Logistic Regression
		clf = LogisticRegression(C=c)
		clf = clf.fit(X_train, y_train)
		probabilities = clf.predict_proba(X_test)

		fprs, tprs, thresholds = roc_curve(y_test, probabilities[:,0], pos_label=0)

		dict_result = []
		for i, j, k in zip(fprs, tprs, thresholds):
			dict_result.append({"fpr": i, "tpr": j, "threshold": k})



		return dict_result

# Here you need to add the ROC resource, ex: api.add_resource(HelloWorld, '/')
# for examples see 
# https://flask-restful.readthedocs.io/en/latest/quickstart.html#a-minimal-api
api.add_resource(ROC, '/roc/<preprocessing>/<float:c>')
if __name__ == '__main__':
	# load data
	df = pd.read_csv('data/transfusion.data')
	df.rename(columns = {'whether he/she donated blood in March 2007':'Donated'}, inplace = True)
	xDf = df.loc[:, df.columns != 'Donated']
	y = df['Donated']
	# get random numbers to split into train and test
	np.random.seed(1)
	r = np.random.rand(len(df))
	# split into train test
	X_train = xDf[r < 0.8]
	X_test = xDf[r >= 0.8]
	y_train = y[r < 0.8]
	y_test = y[r >= 0.8]
	app.run(debug=True, use_reloader=False)
