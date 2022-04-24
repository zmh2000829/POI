from flask import Flask, request
import json, random, string, hashlib
import pymysql
import sys, os
import time
from flask_cors import CORS

f = open('disease_list.json', 'r')
content = json.loads(f.read())
f.close()

f = open('pgi_report.json', 'r',errors='ignore')
report = json.loads(f.read())
f.close()

host = '8.217.7.187'
user = 'root'
password = 'lrock186186186'
database = 'POI'
charset = 'utf8'

app = Flask(__name__)
CORS(app)
@app.route('/')
def hell():
	return 'hello world?' 

@app.route('/select_diseaseid',methods=['GET']) 
def select_diseaseid():
	# print(content)
	res = []
	for name in content:
		temp = {}
		temp['value'] = name
		temp['label'] = name
		temp['children'] = []
		for disease in content[name]:
			temp2 = {}
			temp2['value'] = disease
			temp2['label'] = disease
			temp['children'].append(temp2)

		res.append(temp)

	return {'data': res}

@app.route('/getReport',methods=['POST'])
def getReport():
	caseid = str(request.values.get("caseid"))
	print(caseid)
	# conn = pymysql.connect(host=host, user=user, password=password, database=database, charset=charset)
	# cur = conn.cursor()
	# sql = "SELECT Token, status, Tissue, Disease, Population from PGI.Case where Token=%s"
	# a = cur.execute(sql, caseid)
	# temp = cur.fetchall()[0]
	# conn.commit()
	a = 1
	test = 666
	temp = ['ad0234829205b9033196ba818f7a872b', 2, test, test, test]
	tumor_text = ''

	if a == 1:
		if temp[1] == 0:
			res = '201' #waiting
		elif temp[1] == 1:
			res = '202' #running
		elif temp[1] == 2 :
			# report_path = '/mnt/premedkb/case/' + caseid + '/pgi_report.json'
			# global report
			# f = open(report_path, 'r', errors='ignore')
			# report = json.loads(f.read())
			# f.close()
			tumor_text = str(temp[2]) + ' ' + str(temp[3])
			popu = temp[4]
			res = '200' #success
		elif temp[1] == 3 :
			res = '500' #failed
	else:
		res = '404'

	return { 'code': res, 'data': report, 'tumor': tumor_text, 'popu': popu}

@app.route('/checkValid',methods=['POST'])
def checkValid():
	caseid = str(request.values.get("caseid"))
	print(caseid)
	conn = pymysql.connect(host=host, user=user, password=password, database=database, charset=charset)
	cur = conn.cursor()
	sql = "SELECT Token from PGI.Case where Token=%s"
	a = cur.execute(sql, caseid)
	conn.commit()
	if a == 1:
		res = '200'
	else:
		res = '404'
	return res


@app.route('/create',methods=['POST'])
def create():
	title = str(request.values.get("title"))
	disease = str(request.values.get("disease"))
	tissue = str(request.values.get("tissue"))
	curPopu = str(request.values.get("curPopu"))
	tissue = str(request.values.get("tissue"))
	TMB = str(request.values.get("TMB"))
	MSI = str(request.values.get("MSI"))

	SomaticGenome = str(request.values.get("SomaticGenome"))
	GermlineGenome = str(request.values.get("GermlineGenome"))

	somaticfiles = request.files.get('Somaticfiles[]')
	germlinefiles = request.files.get('Germlinefiles[]')
	bedfiles = request.files.get('Bedfiles[]')
	somaticbedfiles = request.files.get('somaticBedfiles[]')
	CNVFileList = request.files.get('CNVFileList[]')
	GeneFusionFile = request.files.get('GeneFusionFile[]')
	TumorCountFile = request.files.get('TumorCountFile[]')
	NormaCountFile = request.files.get('NormaCountFile[]')

	conn = pymysql.connect(host=host, user=user, password=password, database=database, charset=charset)
	cur = conn.cursor()
	sql = "SELECT Title from PGI.Case where Title=%s"
	a = cur.execute(sql, title)
	conn.commit()
	if(a==1):
		res = '403'
	else:
		token = hashlib.md5(title.encode()).hexdigest()
		path = "/mnt/premedkb/case/" + str(token) + "/"
		mkdir(path)

		somatic_path = ''
		somatic = 0
		germline_path = ''
		germline = 0
		somatic_bed_path = ''
		somatic_bed = 0
		bed_path = ''
		bed = 0
		cnv_path = ''
		cnv = 0
		gene_path = ''
		gene = 0
		tumor_path = ''
		tumor = 0
		normal_path = ''
		normal = 0

		if(somaticfiles is not None):
			somatic_path = path + 'SomaticVCF.vcf'
			somaticfiles.save(somatic_path)
			somatic = 1
		if(germlinefiles is not None):
			germline_path = path + 'GermlineVCF.vcf'
			germlinefiles.save(germline_path)
			germline = 1
		if(somaticbedfiles is not None):
			somatic_bed_path = path + 'SomaticBed.vcf'
			germlinefiles.save(somatic_bed_path)
			germline = 1
		if(bedfiles is not None):
			bed_path = path + 'GermlineBed.bed'
			bedfiles.save(bed_path)
			bed = 1
		if(CNVFileList is not None):
			cnv_path = path + 'CNV' + CNVFileList.filename.split('.')[-1]
			CNVFileList.save(cnv_path)
			cnv = 1
		if(GeneFusionFile is not None):
			gene_path = path + 'GeneFusion' + GeneFusionFile.filename.split('.')[-1]
			GeneFusionFile.save(gene_path)
			gene = 1
		if(TumorCountFile is not None):
			tumor_path = path + 'TumorExp' + TumorCountFile.filename.split('.')[-1]
			TumorCountFile.save(tumor_path)
			tumor = 1
		if(NormaCountFile is not None):
			normal_path = path + 'NormalExp'+ NormaCountFile.filename.split('.')[-1]
			NormaCountFile.save(normal_path)
			normal = 1

		cur.execute('INSERT INTO PGI.Case(Title,Token,Status,FilePath,Tissue,Disease,Population,SomaticVCF,SomaticRefGenome,GermlineVCF,GermlineBed,GermlineRefGenome,CNV,GeneFusion,TumorExp,NormalExp,TMB,MSI) values ("%s","%s","%s","%s","%s","%s","%s","%s","%s","%s","%s","%s","%s","%s","%s","%s","%s","%s");' % (title,token,0,path,tissue,disease,curPopu,somatic,SomaticGenome,germline,bed,GermlineGenome,cnv,gene,tumor,normal,TMB,MSI))
		conn.commit()
		res = '成功创建用户'

	cur.close()
	conn.close()
	return '成功创建用户'

def mkdir(path):
	path = path.strip()
	path  =path.rstrip("\\")
	isExists = os.path.exists(path)
	if not isExists:
		os.makedirs(path)
		print(path+' 创建成功')
		return True
	else:
		print(path+' 目录已存在')
		return False

if __name__ == '__main__':
	app.run()
