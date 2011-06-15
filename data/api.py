import sys, os, json
from copy import deepcopy
from genshi.template import MarkupTemplate
DOCROOT = os.path.dirname(__file__)
sys.path[:0] = [os.path.join(DOCROOT)]
import pymongo as pm
from bson.objectid import ObjectId
con = pm.Connection()
mong = con.mong

ObjectIdType = type(ObjectId())
seqTypes = (type([]), type(()))

class foo:
    pass

def getField(typ, _id, f):
    try:
        return mong[typ].find_one({'_id':_id})[f]
    except:
        return "INVALID"

def buildRecord(typ, _id, fields, items):
    if type(_id) in seqTypes:
        for e in _id:
            buildRecord(typ, e, fields, items)
            items.append("<br/>")
        return
    for f in fields:
        if type(f) in seqTypes:
            item = "<i>" + f[1] + ":</i> "
            it = getField(typ, _id, f[1])
            link = '<a href="/?' + f[0] + '=' + str(it) + '">' + str(it) + '</a>'
            item += link
        else:
            item = "<i>" + f + ":</i> "
            it = getField(typ, _id, f)
            try:
                item += it
            except:
                try:
                    item += str(it)
                except:
                    item += repr(it)
        items.append(item)

def application(environ, start_response):
    status = '200 OK'
    if environ['REQUEST_METHOD'].lower()=="post":
        try:
            request_body_size = int(environ.get('CONTENT_LENGTH', 0))
        except (ValueError):
            request_body_size = 0
        qs = environ['wsgi.input'].read(request_body_size)
    else:
        qs = environ.get("QUERY_STRING","").strip()
    qtups = qs.split("&")
    qargs = {}
    for q in qtups:
        if "=" in q:
            key, val = q.split("=")
            val = val.replace("%20", " ")
            val = val.replace("%22", '"')
            qargs[key] = val
        else:
            qargs[q] = True
    print >> sys.stderr, "DEBUG qargs:", qargs
    output = """{"status":"ok","result":[{"letterid":"262538","letter":"voltfrVF1180359c_1key001cor","authorid":"48939","author":"NOT FOUND","recipientid":"50510","recipient":"NOT FOUND","source":"","destinationlatlon":"","sourcelatlon":"","destination":"","date":"1769-3-24"}]}"""
    if 'action' in qargs and qargs['action'] == 'query' and 'q' in qargs:
        query = json.loads(qargs['q'])
        mresp = []
        for k in query:
            if k in ['author', 'recipient']:
                q = {'NameRaw': query[k]}
                person = mong.Person.find_one(q)
                print >> sys.stderr, "DEBUG q:", q, "person:", person
                if person:
                    q = {k.capitalize(): person['_id']}
                    mresp += list(mong.Letter.find(q).limit(3))
        print >> sys.stderr, "DEBUG query:", query, "\nMRESP:", mresp
        template = {"letterid":"262538","letter":"voltfrVF1180359c_1key001cor","authorid":"48939","author":"UNKNOWN","recipientid":"50510","recipient":"UNKNOWN","source":"","destinationlatlon":"","sourcelatlon":"","destination":"","date":"1769-3-24"}
        if len(mresp):
            resp = []
            for i in range(len(mresp)):
                resp.append(deepcopy(template))
                if 'Author' in mresp[i]:
                    resp[i]['author']=mong.Person.find_one({'_id':mresp[i]['Author']})['NameRaw']
                if 'Recipient' in mresp[i]:
                    resp[i]['recipient']=mong.Person.find_one({'_id':mresp[i]['Recipient']})['NameRaw']
        else:
            resp = [template]
        resp = {"status":"ok","result":resp}
        output = json.dumps(resp)
        print >> sys.stderr, "DEBUG result:", output

##    print >> sys.stderr, "DEBUG---", type(qargs['author'])
##    output = """{"status":"ok","result":[{"letterid":"262538","letter":"voltfrVF1180359c_1key001cor","authorid":"48939","author":"Pierre Grox","recipientid":"50510","recipient":"Voltairx","source":"","destinationlatlon":"","sourcelatlon":"","destination":"","date":"1769-3-24"},{"letterid":"262560","letter":"voltfrVF1180375b_1key001cor","authorid":"48939","author":"Pierre Grox","recipientid":"50510","recipient":"Voltairx","source":"","destinationlatlon":"","sourcelatlon":"","destination":"","date":"1769-3-31"}]}"""
##    temp = json.loads(output)
##    output = json.dumps(temp)
    response_headers = [('Content-type', 'text/html'),
                        ('Content-Length', str(len(output)))]
    start_response(status, response_headers)
    return [output]
