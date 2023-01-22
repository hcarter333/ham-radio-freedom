#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util, template
#from google.appengine.api import app_identity
import pprint
import urllib
import urllib2
import datetime
import re
import logging
import sys
import os

class User(db.Model):
    name = db.StringProperty(
            required=True)
    password = db.StringProperty(
            required=True)
    id = db.StringProperty()
    created = db.DateTimeProperty(auto_now_add=True)
    updated = db.DateTimeProperty(auto_now=True)
    profile_url = db.StringProperty()
    access_token = db.StringProperty()
    techpass = db.StringProperty()
    generalpass = db.StringProperty()
    extrapass = db.StringProperty()
    firstqso = db.StringProperty()
    callsign = db.StringProperty()
    
class QSOMapLink(db.Model):
    link = db.StringProperty(
            required=True)
    smlink = db.StringProperty()
    tx = db.StringProperty()
    rx = db.StringProperty()
    tag = db.StringProperty()
    date = db.DateTimeProperty(auto_now_add=True)
    frequency = db.FloatProperty()
    power = db.FloatProperty()
    rst = db.StringProperty()
    rrst = db.StringProperty()
    mode = db.StringProperty()
    distance = db.FloatProperty()
    band = db.StringProperty()

class QSOMissedCall(db.Model):
    callsign = db.StringProperty(required=True)
    date = db.DateTimeProperty(auto_now_add=True)

class HamHelp(db.Model):
    tclass = db.StringProperty(
            required=True)
    qindex = db.IntegerProperty(
            required=True)
    helplink = db.StringProperty(
              required=True)
    htitle = db.StringProperty()

class HamTestScore(db.Model):
    name = db.StringProperty(
            required=True)
    tclass = db.StringProperty(
            required=True)
    elementscores = db.StringProperty(
            required = True)  
    partial = db.StringProperty()
    scoredate = db.DateTimeProperty(auto_now_add = True)
    se_score = db.StringProperty()
    
class APRSTrack(db.Model):
    trackdate = db.DateTimeProperty(auto_now_add = True)
    callsign = db.StringProperty(
                required = True)
    trackpos = db.TextProperty()
    angle = db.StringProperty()
    altitude = db.TextProperty()
    drivemode = db.TextProperty()
    delay = db.TextProperty()
    
class ForumEntry(db.Model):
    qindex = db.StringProperty(
                required = True)
    postdate = db.DateTimeProperty(auto_now_add = True)
    uid = db.StringProperty(
                required = True)
    uname = db.StringProperty(
                required = True)
    test_type = db.StringProperty(
                required = True)
    comment = db.TextProperty(
                required = True)
    
class ForumLatest(db.Model):
    qindex = db.StringProperty(
                required = True)
    postdate = db.DateTimeProperty(auto_now=True)
    uid = db.StringProperty()
    uname = db.StringProperty()
    test_type = db.StringProperty()
    count = db.IntegerProperty(
                required = True)

class ForumBM(db.Model):
    xid = db.StringProperty(
                required = True)
    uid = db.StringProperty(
                required = True)
    commcount = db.IntegerProperty()
    

class SeenPassed(db.Model):
    name = db.StringProperty(
            required=True)
    tclass = db.StringProperty(
            required=True)
    passedseen = db.TextProperty(
            required=True)


class TestQuestion(db.Model):
    index = db.IntegerProperty(
          required = True)
    tclass = db.StringProperty(
          required=True)
    subelement = db.StringProperty(
               required=True)
    group = db.StringProperty(
          required = True)
    qnum = db.StringProperty(
          required = True)
    answer = db.StringProperty(
          required = True)
    question = db.StringProperty(
          required = True)
    A = db.StringProperty(
          required = True)
    B = db.StringProperty(
          required = True)
    C = db.StringProperty(
          required = True)
    D = db.StringProperty(
          required = True)
    

class Contact(db.Model):
    user = db.StringProperty()
    tx_call = db.StringProperty(
            required=True)
    rx_call = db.StringProperty()
    date = db.DateProperty()
    time = db.TimeProperty()
    tx_lat = db.FloatProperty()
    tx_lng = db.FloatProperty()
    rx_lat = db.FloatProperty()
    rx_lng = db.FloatProperty()
    frequency = db.FloatProperty(
             required=True)
    power = db.FloatProperty()
    rst = db.StringProperty()
    rrst = db.StringProperty()
    mode = db.StringProperty()
    distance = db.FloatProperty()
    band = db.StringProperty()


class CallsignLatLng(db.Model):
    callsign = db.StringProperty(
            required=True)
    street_addr = db.StringProperty(
            required=True)
    call_lat = db.FloatProperty(
            required=True)
    call_lng = db.FloatProperty(
            required=True)
    call_alt_lat = db.FloatProperty()
    call_alt_lng = db.FloatProperty()
    call_alt_user = db.StringProperty()

class ReviewCallsignLatLng(db.Model):
    callsign = db.StringProperty(
            required=True)
    street_addr = db.StringProperty(
            required=True)
    call_lat = db.FloatProperty(
            required=True)
    call_lng = db.FloatProperty(
            required=True)
    call_alt_lat = db.FloatProperty()
    call_alt_lng = db.FloatProperty()
    call_alt_user = db.StringProperty()

class Shot(db.Model):
    cannon_name = db.StringProperty()
    target_name = db.StringProperty()
    cannon_lat = db.FloatProperty(
            required=True)
    cannon_lng = db.FloatProperty(
            required=True)
    target_lat = db.FloatProperty(
            required=True)
    target_lng = db.FloatProperty(
            required=True)
    shot_angle = db.FloatProperty()
    shot_heading = db.FloatProperty()
    shot_vel = db.FloatProperty()


class MainHandler(webapp.RequestHandler):
    def get(self):
        values = {
        }
        self.response.out.write(
          template.render('ham_exam_simple.html', values))
        
    def post(self):
        user = User(name = self.request.get('user'),
                    password = self.request.get('password'))
        user.put()        
#        self.redirect('/')

class MainHandlerQS(webapp.RequestHandler):
    def get(self):
        values = {
        }
        self.response.out.write(
          template.render('fronttestqs.html', values))
        
    def post(self):
        user = User(name = self.request.get('user'),
                    password = self.request.get('password'))
        user.put()        
#        self.redirect('/')

class TestFront(webapp.RequestHandler):
    def get(self):
        values = {
        }
        self.response.out.write(
          template.render('fronttest.html', values))

class DXSMirror(webapp.RequestHandler):
    def get(self):
        
        values = {}
        self.response.out.write(
          template.render('dxsmirror.html', values))

class QSLLogHandler(webapp.RequestHandler):
    def get(self):
        libs = self.request.get('libs')

        #get the last 25 calls
        qsls = db.GqlQuery(
            "SELECT * FROM Contact Order By date DESC, time DESC LIMIT 50")

        values = { 'names': libs.split(','),
                   'qsls': qsls,
        }
        self.response.out.write(
          template.render('qsllog.html', values))

class HBCUsers(webapp.RequestHandler):
    def get(self):
        #get the last 25 calls
        names = db.GqlQuery(
            "SELECT * FROM User")

        values = { 'names': names,
                   
        }
        self.response.out.write(
          template.render('users.html', values))


class QSLLogTableHandler(webapp.RequestHandler):
    def get(self):
        values = {
        }
        self.response.out.write(
          template.render('qsllogtable.html', values))

class DXSHBCDelete(webapp.RequestHandler):
    def get(self):
        #Clean the stored callsigns
        q = db.GqlQuery("SELECT * FROM CallsignLatLng")
        results = q.fetch(1000000)
        i = 0
        for result in results:
            i = i + 1
            result.delete()

        self.response.out.write('test ' + str(i))

class DelPS(webapp.RequestHandler):
    def get(self):
        #Clean the stored callsigns
        q = db.GqlQuery("SELECT * FROM HamTestScore")
        results = q.fetch(1000000)
        i = 0
        for result in results:
            result.put()
            i = i + 1
            
        self.response.out.write('test ' + str(i))

class DXSGet(webapp.RequestHandler):
    def get(self):
        #Clean the stored callsigns
        #q = db.GqlQuery("SELECT * FROM CallsignLatLng")
        #results = q.fetch(1000000)
        #db.delete(results)
        
        filehandle = urllib.urlopen('http://www.dxsummit.fi/DxSpots.aspx?count=30&range=1')
        #send only the spots
        found_calls = 0
        calls=[]
        for line in filehandle.readlines():
            if found_calls == 1:
                #Now, pull out only the good information
                m = re.search('qrz\.com\/db\/([A-Z|0-9]*) *\".*A> *([0-9|\.]*) *\<A.*qrz\.com\/db\/([A-Z|0-9]*) *\".*([0-9][0-9][0-9][0-9]) [0-9][0-9] [A-Z]', line)
                if m != None:
                    calls.append(m.group(1))
                    calls.append(m.group(2))
                    calls.append(m.group(3))
                    calls.append(m.group(4))
            if re.search('\<pre\>', line):
                found_calls = 1
            if re.search('\<\/pre\>', line):
                found_calls = 0
        values = { 'names': calls
        }
        self.response.out.write(
          template.render('mirrortable.html', values))

class DXSGetQS(webapp.RequestHandler):
    def get(self):
        #Clean the stored callsigns
        #q = db.GqlQuery("SELECT * FROM CallsignLatLng")
        #results = q.fetch(1000000)
        #db.delete(results)
        
        filehandle = urllib.urlopen('http://www.qrpspots.com/qrpspots.php')
        #send only the spots
        found_calls = 1
        calls=[]
        for line in filehandle.readlines():
            if found_calls == 1:
                #Now, pull out only the good information
                m = re.search('\<td\>[0-9][0-9]\/[0-9][0-9] ([0-9][0-9]\:[0-9][0-9])\<\/td\>\<td\>([0-9|\.]*)\<\/td\>\<td\>([0-9|A-Z|a-z| |]*)\<\/td\>\<td\>[^\<]*\<\/td\>\<td\>(.*)', line)
                if m != None:
                    calls.append(m.group(3))
                    calls.append(m.group(2))
                    calls.append(m.group(4))
                    calls.append(m.group(1))
            #if re.search('\<pre\>', line):
            #    found_calls = 1
            #if re.search('\<\/pre\>', line):
            #    found_calls = 0
        values = { 'names': calls
        }
        self.response.out.write(
          template.render('mirrortableqs.html', values))

class QSLLocation(webapp.RequestHandler):
    def get(self):
        callsign = self.request.get(
            'callsign')
        filehandle = urllib.urlopen('http://velkejkuk.cz/get2post/?get2post-url=http://www.qrz.com/callsign&callsign=' + callsign)
        values = { 'names': filehandle.readlines()
        }
        self.response.out.write(
          template.render('qsllogtable.html', values))

#Concept test for getting html from web pages
#has been reomved from the index list
class CallTest(webapp.RequestHandler):
    def get(self):
        callsign = self.request.get(
            'callsign')
        filehandle = urllib.urlopen('http://copaseticflows.appspot.com/examhelp/calltest.html?callsign=' + callsign)
        #values = { 'names': filehandle.readlines()
        #}
        #self.response.out.write(filehandle.readlines())
        values = { 'names': filehandle.readlines()
        }
        self.response.out.write(
          template.render('qsllogtable.html', values))
        



class SATTrack(webapp.RequestHandler):
    def get(self):

        #uncomment before deployment
        #filehandle = urllib.urlopen('http://www.amsat.org/amsat/ftp/keps/current/nasa.all')
        #parse the data
        grab_sat = 0
        sat_lines = ''
#        for line in filehandle.readlines():
#            clean_line = line.rstrip()
#            if grab_sat == 1:
#              grab_sat = grab_sat + 1
#            if clean_line == 'TO ALL RADIO AMATEURS BT':
#                  #set the flag to indicate satellite capture
##                  grab_sat = 1
#            if grab_sat > 1:
##                #if this isn't /EX then it is one of the satellite lines
#                if clean_line != '/EX':
#                    sat_lines = sat_lines + clean_line + '&'
            
        #remove the leftmost &
        sat_lines = sat_lines.lstrip('&');    
        #filehandle = myopener.open('http://www.eham.net/callbook/search?' + params)
        values = { 'sats': sat_lines}
        self.response.out.write(
            template.render('sattrackf.html', values))

class FindSat(webapp.RequestHandler):
    def get(self):

        #uncomment before deployment
        filehandle = urllib.urlopen('http://www.amsat.org/amsat/ftp/keps/current/nasa.all')
        #parse the data
        grab_sat = 0
        sat_lines = ''
        for line in filehandle.readlines():
            clean_line = line.rstrip()
            if grab_sat == 1:
              grab_sat = grab_sat + 1
            if clean_line == 'TO ALL RADIO AMATEURS BT':
                  #set the flag to indicate satellite capture
                  grab_sat = 1
            if grab_sat > 1:
                #if this isn't /EX then it is one of the satellite lines
                if clean_line != '/EX':
                    sat_lines = sat_lines + clean_line + '&'
            
        #remove the leftmost &
        sat_lines = sat_lines.lstrip('&');    
        #sat_lines = 'test'
        #filehandle = myopener.open('http://www.eham.net/callbook/search?' + params)
        if 'view' in self.request.GET:
            view_code = self.request.get('view')
            view_lat = self.request.get('lat')
            view_lng = self.request.get('lng')
            view_sats = self.request.get_all('sat')
            values = {'sats': sat_lines,
                      'view_code': view_code,
                      'view_lat': view_lat,
                      'view_lng': view_lng,
                      'view_sats': view_sats}
        else:
            values = { 'sats': sat_lines}
        self.response.out.write(
            template.render('findsat.html', values))

class GEBang(webapp.RequestHandler):
    def post(self):
        if 'op' in self.request.POST:
            #location to store game
            test = 'test'        
            new_game = Shot(shot_heading = float(self.request.get('shot_heading')),
                    cannon_lat = float(self.request.get('clat')),
                    cannon_lng = float(self.request.get('clng')),
                    target_lat = float(self.request.get('tlat')),
                    target_lng = float(self.request.get('tlng')),
                    shot_angle = float(self.request.get('shot_angle')),
                    shot_vel = float(self.request.get('shot_vel'))
                    )
            new_game.put()
            #get the key and returnit to the game
            self.response.out.write(new_game.key().__str__())

    def get(self):
        if 'game' in self.request.GET:
            test = 'test'
            #get the saved key reference
            game = self.request.get('game')
            #pass this to a key constructor and get the game record
            replay = Shot.get(game)
            values = { 'shot': replay}
            self.response.out.write(
                template.render('gebang_replay.html', values))
        else:
            values = { 'test': 'tests'}
            self.response.out.write(
                template.render('gebang.html', values))

class GEAPRS(webapp.RequestHandler):
    def post(self):
        if 'trackpos' in self.request.POST:
            #location to store game
            test = 'test'        
            new_track = APRSTrack(callsign = self.request.get('callsign'),
                    trackpos = self.request.get('trackpos'),
                    angle = self.request.get('angle'),
                    drivemode = self.request.get('drivemode'),
                    delay = self.request.get('delay')
                    )
            new_track.put()
            #get the key and returnit to the game
            self.response.out.write(new_track.key().__str__())
        #if 'trackpos' in self.request.POST:
        elif 'oldtour' in self.request.POST:
            test = 'test'
            user_agent = 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)'
            headers = { 'User-Agent' : user_agent }
            url="http://www.findu.com/cgi-bin/posit.cgi"
            lookup_call = self.request.get('callsign')
            data={'call': lookup_call, 'comma': '1', 'start': '240', 'length': '240'}
            data2 = urllib.urlencode(data)
        
            req = urllib2.Request(url, data2, headers)
            response = urllib2.urlopen(req)
            the_page = response.read()
            muli = re.finditer("(.*),(.*),(.*),(.*),(.*)<br>", the_page)
            track_string = ""
            for line in muli:
                #str(float(line.group(5))*3.28)
                #check on the altitude
                try:
                    alt = float(line.group(5))/3.28
                except:
                    alt = 0
                track_string = track_string + line.group(2) + ',' + line.group(1) + ',' + str(alt) + ' '
            self.response.out.write(track_string)
        elif 'cars' in self.request.POST:
            test = 'test'
            user_agent = 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)'
            headers = { 'User-Agent' : user_agent }
            url="http://www.findu.com/cgi-bin/symbol.cgi"
            data={'icon': '/\>',
                  'limit': '200'}
            data2 = urllib.urlencode(data)
        
            req = urllib2.Request(url, data2, headers)
            response = urllib2.urlopen(req)
            the_page = response.read()
            muli = re.finditer("\?call\=([A-Z0-9\-]*)\"", the_page)
            times = re.finditer("([0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9])", the_page)
            #latlng = re.finditer("<td>\s*([\-,0-9]*\.[0-9]*)</td><td>\s*([\-,0-9]*\.[0-9]*)</td>", the_page)
            latlng = re.finditer("\?call\=([A-Z0-9\-]*)\".*<td>\s*([\-,0-9]*\.[0-9]*)</td><td>\s*([\-,0-9]*\.[0-9]*)</td>", the_page)
            calls=[]
            lat=[]
            lng=[]
            lasttimes=[]
            calltimes=[]
            calltimestring=''
            callcount = 0
            for line in muli:
                calls.append(line.group(1))
                #callcount = callcount + 1
            callposcount = 0
            posstring = ""
            for line in latlng:
                #lat.append(line.group(1))
                #lng.append(line.group(2))
                #build position string to be appended to the end of the response
                posstring += line.group(1) + "," + line.group(2) + "," + line.group(3) + " "
                #callposcount = callposcount + 1
            for line in times:
                calltimestring = calltimestring + '<tr><td><a href="javascript:void(0)" onClick="track_station_link(\'' + calls[callcount] + '\',\'' + line.group(1) + '\')">' + calls[callcount] + '</a></td><td>' + line.group(1) + '</td></tr>'
                #calltimes.append('<tr><td><a href="javascript:void(0)" onClick="track_station_link(\'' + calls[callcount] + '\',\'' + line.group(1) + '\')">' + calls[callcount] + '</a></td><td>' + line.group(1) + '</td></tr>')
                #calltimes.append('<tr><td><a href="javascript:void(0)" onClick="track_station_link(\'' + calls[callcount] + '\')">' + calls[callcount] + '</a></td><td>' + line.group(1) + '</td></tr>')
                callcount = callcount + 1
            #append position string to the end of the response
            calltimestring = calltimestring + "|" + posstring
            self.response.out.write(calltimestring);
            #for line in muli:
            #   calltimes.append('<tr><td>' + calls[callcount] + '</td><td>' + lasttimes[callcount] + '</td></tr>') 
            #   callcount = callcount + 1
        elif 'planes' in self.request.POST:
            test = 'test'
            user_agent = 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)'
            headers = { 'User-Agent' : user_agent }
            url="http://www.findu.com/cgi-bin/symbol.cgi"
            data={'icon': '/\'',
                  'limit': '200'}
            data2 = urllib.urlencode(data)
        
            req = urllib2.Request(url, data2, headers)
            response = urllib2.urlopen(req)
            the_page = response.read()
            muli = re.finditer("\?call\=([A-Z0-9\-]*)\"", the_page)
            times = re.finditer("([0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9])", the_page)
            latlng = re.finditer("\?call\=([A-Z0-9\-]*)\".*<td>\s*([\-,0-9]*\.[0-9]*)</td><td>\s*([\-,0-9]*\.[0-9]*)</td>", the_page)
            calls=[]
            lasttimes=[]
            calltimes=[]
            calltimestring=''
            callcount = 0
            for line in muli:
                calls.append(line.group(1))
                #callcount = callcount + 1
            posstring = ""
            for line in latlng:
                #lat.append(line.group(1))
                #lng.append(line.group(2))
                #build position string to be appended to the end of the response
                posstring += line.group(1) + "," + line.group(2) + "," + line.group(3) + " "
            for line in times:
                calltimestring = calltimestring + '<tr><td><a href="javascript:void(0)" onClick="track_station_link(\'' + calls[callcount]  + '\',\'' + line.group(1) + '\')">' + calls[callcount] + '</a></td><td>' + line.group(1) + '</td></tr>'
                #calltimes.append('<tr><td><a href="javascript:void(0)" onClick="track_station_link(\'' + calls[callcount] + '\',\'' + line.group(1) + '\')">' + calls[callcount] + '</a></td><td>' + line.group(1) + '</td></tr>')
                #calltimes.append('<tr><td><a href="javascript:void(0)" onClick="track_station_link(\'' + calls[callcount] + '\')">' + calls[callcount] + '</a></td><td>' + line.group(1) + '</td></tr>')
                callcount = callcount + 1
            #append position string to the end of the response
            calltimestring = calltimestring + "|" + posstring
            
            self.response.out.write(calltimestring);
            
            

    def get(self):
        user_agent = 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)'
        headers = { 'User-Agent' : user_agent }
        url="http://www.findu.com/cgi-bin/symbol.cgi"
        data={'icon': '/\'',
              'limit': '200'}
        data2 = urllib.urlencode(data)
        
        req = urllib2.Request(url, data2, headers)
        response = urllib2.urlopen(req)
        the_page = response.read()
        muli = re.finditer("\?call\=([A-Z0-9\-]*)\"", the_page)
        times = re.finditer("([0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9])", the_page)
        latlng = re.finditer("\?call\=([A-Z0-9\-]*)\".*<td>\s*([\-,0-9]*\.[0-9]*)</td><td>\s*([\-,0-9]*\.[0-9]*)</td>", the_page)
        calls=[]
        lasttimes=[]
        calltimes=[]
        callcount = 0
        for line in muli:
            calls.append(line.group(1))
            #callcount = callcount + 1
        posstring = ""
        for line in latlng:
            posstring += line.group(1) + "," + line.group(2) + "," + line.group(3) + " "
        for line in times:
            calltimes.append('<tr><td><a href="javascript:void(0)" onClick="track_station_link(\'' + calls[callcount] + '\',\'' + line.group(1) + '\')">' + calls[callcount] + '</a></td><td>' + line.group(1) + '</td></tr>')
            callcount = callcount + 1
            
            #for line in muli:
            #   calltimes.append('<tr><td>' + calls[callcount] + '</td><td>' + lasttimes[callcount] + '</td></tr>') 
            #   callcount = callcount + 1
            
            
            
        #values = { 'calltimes': calltimes}

        if 'tour' in self.request.GET:
            test = 'test'
            #get the saved key reference
            tour = self.request.get('tour')
            #pass this to a key constructor and get the game record
            replay = APRSTrack.get(tour)
            values = { 'tour': replay,
                        'calltimes': calltimes,
                        'tourid': tour,
                        'stations': posstring}
            self.response.out.write(
                template.render('aprsdotfly.html', values))
        else:
            #get the flying callsigns
            values = { 'calltimes': calltimes,
                        'stations': posstring}
            self.response.out.write(
                template.render('aprsdotfly.html', values))




class HamTestHelp(webapp.RequestHandler):
    def get(self):
        #Put the new entry into the database
        #Put the new entry into the database
        new_help = HamHelp(tclass = 'T',
                    qindex = 157,
                    helplink = '/examhelp/techcurrent.html'
                    )
        new_help.put()
        
        hhs = db.GqlQuery(
            "SELECT * FROM HamHelp")

        values = {
            'hhs': hhs
        }
        self.response.out.write(
          template.render('hhs.html', values))
        self.response.out.write('Test33')


class QSLLogEntry(webapp.RequestHandler):
    def post(self):
        #Put the new entry into the database
        #Put the new entry into the database
        new_contact = Contact(user = self.request.get('my_user'),
                    tx_call = self.request.get('id_call_sign'),
                    rx_call = self.request.get('id_rx_call_sign'),
                    date = datetime.datetime.strptime(self.request.get('field_id'), '%m/%d/%Y').date(),
                    time = datetime.datetime.strptime(self.request.get('time'), '%H:%M').time(),
                    tx_lat = float(self.request.get('tx_lat')),
                    tx_lng = float(self.request.get('tx_lng')),
                    rx_lat = float(self.request.get('rx_lat')),
                    rx_lng = float(self.request.get('rx_lng')),
                    frequency = float(self.request.get('frequency')),
                    power = float(self.request.get('id_tx_power', '10')),
                    rst = self.request.get('rst', '559'),
                    rrst = self.request.get('rxrst', '559'),
                    mode = self.request.get('mode', 'none'),
                    distance = float(self.request.get('cf_distance', '0')),
                    band = self.request.get('band', 'none')
                    )
        new_contact.put()
        

        qsls = db.GqlQuery(
            "SELECT * FROM Contact Order By date DESC, time DESC")

        values = {
            'qsls': qsls
        }
        self.response.out.write(
          template.render('contacts.html', values))

class DXSLogEntry(webapp.RequestHandler):
    def post(self):
        #Put the new entry into the database
        #Put the new entry into the database
        new_contact = Contact(user = self.request.get('my_user'),
                    tx_call = self.request.get('id_call_sign'),
                    rx_call = self.request.get('id_rx_call_sign'),
                    date = datetime.datetime.strptime(self.request.get('field_id'), '%m/%d/%Y').date(),
                    time = datetime.datetime.strptime(self.request.get('time'), '%H:%M').time(),
                    tx_lat = float(self.request.get('tx_lat')),
                    tx_lng = float(self.request.get('tx_lng')),
                    rx_lat = float(self.request.get('rx_lat')),
                    rx_lng = float(self.request.get('rx_lng')),
                    frequency = float(self.request.get('frequency')),
                    power = float(self.request.get('id_tx_power', '10')),
                    rst = self.request.get('rst', '559'),
                    rrst = self.request.get('rxrst', '559'),
                    mode = self.request.get('mode', 'none'),
                    distance = float(self.request.get('cf_distance', '0')),
                    band = self.request.get('band', 'none')
                    )
        new_contact.put()
        self.response.out.write(new_contact.key().__str__())        

class DXSGetCalls(webapp.RequestHandler):
    def get(self):
        callsigns = db.GqlQuery(
            "SELECT * FROM CallsignLatLng")

        values = {
            'callsigns': callsigns
        }
        self.response.out.write(
          template.render('newcallsign.html', values))

class GLog(webapp.RequestHandler):
    def get(self):
        values = {
            
        }
        self.response.out.write(
          template.render('glogin.html', values))
        

class CFLBLU(webapp.RequestHandler):
    def get(self):
        if 'up_lucall' in self.request.GET:
            gql_query = "SELECT * FROM Contact WHERE "
            rx_gql_query = gql_query
            
            callsign = self.request.get('up_lucall')
            
            gql_query = gql_query + "tx_call = '" + callsign + "' Order By date DESC, time DESC LIMIT 50"
            rx_gql_query = rx_gql_query + "rx_call = '" + callsign + "' Order By date DESC, time DESC LIMIT 50"
            qsls = db.GqlQuery(gql_query)
            rx_qsls = db.GqlQuery(rx_gql_query)
            lu_values = { 'qsls': qsls,
                       'rx_qsls': rx_qsls
            }
            self.response.out.write(
              template.render('tabtest2lug.html', lu_values))

class TCFLBLU(webapp.RequestHandler):
    def get(self):
        if 'up_lucall' in self.request.GET:
            gql_query = "SELECT * FROM Contact WHERE "
            rx_gql_query = gql_query
            
            callsign = self.request.get('up_lucall')
            
            gql_query = gql_query + "tx_call = '" + callsign + "' Order By date DESC, time DESC"
            rx_gql_query = rx_gql_query + "rx_call = '" + callsign + "' Order By date DESC, time DESC"
            qsls = db.GqlQuery(gql_query)
            rx_qsls = db.GqlQuery(rx_gql_query)
            lu_values = { 'qsls': qsls,
                       'rx_qsls': rx_qsls
            }
            self.response.out.write(
              template.render('tabtest2lugt.html', lu_values))

class QSLGadget(webapp.RequestHandler):
    def get(self):
        lang = 'en'
        if 'lang' in self.request.GET:
            lang = self.request.get('lang')
        
        #Get the last 5 spots
        qsls = db.GqlQuery(
             "SELECT * FROM Contact Order By date DESC, time DESC LIMIT 50")

        qg_values = { 'name': 'qslgaddget',
                      'lang': lang,
                      'qsls': qsls
        }
        self.response.out.write(
          template.render('qslgadgetcomp.html', qg_values))


class TabTest(webapp.RequestHandler):
    def get(self):
        if 'lookup_call' in self.request.GET:
            gql_query = "SELECT * FROM Contact WHERE "
            rx_gql_query = gql_query
            
            callsign = self.request.get('lookup_call')
            
            gql_query = gql_query + "tx_call = '" + callsign + "' Order By date DESC, time DESC LIMIT 50"
            rx_gql_query = rx_gql_query + "rx_call = '" + callsign + "' Order By date DESC, time DESC LIMIT 50"
            qsls = db.GqlQuery(gql_query)
            rx_qsls = db.GqlQuery(rx_gql_query)
            lu_values = { 'qsls': qsls,
                       'rx_qsls': rx_qsls
            }
            self.response.out.write(
              template.render('tabtest2lu.html', lu_values))
        if 'mobile' in self.request.GET:
            qsls = db.GqlQuery(
                "SELECT * FROM Contact Order By date DESC, time DESC LIMIT 50")

            values = { 'qsls': qsls,
            }
            self.response.out.write(
              template.render('tabtest2mob.html', values))
            
        else:
            qsls = db.GqlQuery(
                "SELECT * FROM Contact Order By date DESC, time DESC LIMIT 50")

            values = { 'qsls': qsls,
            }
            self.response.out.write(
              template.render('tabtest2.html', values))

class FillQSO(webapp.RequestHandler):
    def get(self):
        qsls = db.GqlQuery(
            "SELECT * FROM Contact Order By date DESC, time DESC LIMIT 50")

        values = { 'qsls': qsls,
        }
        self.response.out.write(
          template.render('contacts.html', values))

class FillQSOg(webapp.RequestHandler):
    def get(self):
        qsls = db.GqlQuery(
            "SELECT * FROM Contact Order By date DESC, time DESC LIMIT 5")

        values = { 'qsls': qsls,
        }
        self.response.out.write(
          template.render('contacts.html', values))

class LastDXS(webapp.RequestHandler):
    def get(self):
        qsls = db.GqlQuery(
            "SELECT * FROM Contact Order By date DESC, time DESC LIMIT 20")

        values = { 'qsls': qsls,
        }
        self.response.out.write(
          template.render('recentcall.html', values))


class HFEGet(webapp.RequestHandler):
    def post(self):
        tclass = self.request.get('tclass')
        qnum = self.request.get('qnum')
        
        index_query = "SELECT * FROM ForumEntry WHERE qindex = :q_num and test_type = :t_class order by postdate desc"       
        posts = db.GqlQuery(index_query, q_num=qnum, t_class=tclass)

        values = { 'posts': posts,
                   'one_qnum': qnum,
        }
        
        self.response.out.write(
          template.render('qforum.html', values))


class HFEntry(webapp.RequestHandler):
    def post(self):
        q_index = self.request.get('qnum')
        user_name = self.request.get('uname')
        user_id = self.request.get('uid')
        forum_post = self.request.get('comment')
        tclass = self.request.get('tclass')
            
        forum_entry = ForumEntry(qindex = q_index, uid = user_id, uname = user_name, test_type = tclass, comment = forum_post)
        forum_entry.put()
        
        #Now, get the latest entry summary for this question and update it reflect the new post
        index_query = "SELECT * FROM ForumLatest WHERE qindex = :q_num and test_type = :t_class order by postdate desc"       
        latest = db.GqlQuery(index_query, q_num=q_index, t_class=tclass)

        if latest.count() == 1:
            #update the entry
            for post in latest:
                post.count = post.count + 1
                #now update the post record
                post.put()
        else:
            latestpost = ForumLatest(qindex = q_index, uid = user_id, uname = user_name, test_type = tclass, count = 1)
            latestpost.put()
            
        
        #Get all the forum entries for this question and return them
        index_query = "SELECT * FROM ForumEntry WHERE qindex = :q_num and test_type = :t_class order by postdate desc"       
        posts = db.GqlQuery(index_query, q_num=q_index, t_class=tclass)

        values = { 'posts': posts,
        }
        
        self.response.out.write(
          template.render('qforum.html', values))
        

class HFUser(webapp.RequestHandler):
    def post(self):
        uid = self.request.get('uid')
        tclass = self.request.get('tclass')
        
        index_query = "SELECT * FROM ForumEntry WHERE test_type = :t_class and uid = :u_id order by qindex asc"       
        posts = db.GqlQuery(index_query, t_class=tclass, u_id=uid)

        values = { 'posts': posts
        }
        
        self.response.out.write(
          template.render('hfuser.html', values))


class HamTForumOut(webapp.RequestHandler):
    def get(self):
        q_index = self.request.get('q_index') 
        t_class = self.request.get('t_class')
        index_query = "SELECT * FROM TestQuestion WHERE index = " + q_index + " and tclass = '" + t_class + "' Order By index"       
        questions = db.GqlQuery(index_query)

        values = { 'questions': questions,
        }
        
        #for iq in questions:
        #    iq.delete()
        
        self.response.out.write(
          template.render('ushamforum.html', values))


class TechPoolOut(webapp.RequestHandler):
    def get(self):
        questions = db.GqlQuery(
            "SELECT * FROM TestQuestion WHERE tclass = 'E' Order By index")

        values = { 'questions': questions,
        }
        
        #for iq in questions:
        #    iq.delete()
        
        self.response.out.write(
          template.render('techpoolform.html', values))
class FGUpdate(webapp.RequestHandler):
    def post(self):
        mapqsl = db.GqlQuery("SELECT * FROM QSOMapLink order by date desc limit 15")
        values = { 'qsls': mapqsl,
            }
        
        self.response.out.write(
          template.render('fgupdate.html', values))
        
class FGCallClaim(webapp.RequestHandler):
    def post(self):
        callsign = self.request.get('callsign')
        user_id = self.request.get('userid')

        #Here the callsign is being claimed
        if callsign != 'none':
            uq = "SELECT * FROM User WHERE callsign = :utlink"
            userqs = db.GqlQuery(uq, utlink=callsign)

            user_count = 0
            for user in userqs:
                tester = user
                user_count = user_count + 1
            
        #If no one has this call sign already, then register it to the user id
        #If values is empty, then the callsign is already taken and a warning 
        #message will be displayed
            values = {}
            if user_count == 0:
                #get the user record for the user id
                userq = "SELECT * FROM User WHERE id = :utlink"
                userqs = db.GqlQuery(userq, utlink=user_id)
                user_count = 0
            
                for user in userqs:
                    tester = user
                    user_count = user_count + 1
            #update the record with the callsign and store it
                if user_count != 0:
                    user.callsign = callsign
                    user.put()
                    values = {'callsign': callsign}
            else:
                values = {'callsign': callsign,
                          'used': "yes"}
        #Handle case that is trying to retrive the callsign
        else:
            userq = "SELECT * FROM User WHERE id = :utlink"
            userqs = db.GqlQuery(userq, utlink=user_id)
            user_count = 0
            
            for user in userqs:
                tester = user
                user_count = user_count + 1
            #update the record with the callsign and store it
            if user_count != 0:
                if user.callsign != '':
                    values = {'callsign': user.callsign}
        
        
        self.response.out.write(
          template.render('fgcallclaimupdate.html', values))

class FGBadges(webapp.RequestHandler):
    def post(self):
        
        userid = self.request.get('userid')
        #fclass = self.request.get('tclass')
        #fpassedseen = self.request.get('passedseen')
        uq = "SELECT * FROM User WHERE id = :utlink"
        userqs = db.GqlQuery(uq, utlink=userid)

        user_count = 0
        for user in userqs:
            tester = user
            user_count = user_count + 1
            
        if user_count == 0:
            user = User(id = userid,
                                name = userid,
                                password = userid)
            user.put()
        
            #Add earned badges
            if 'firstqso' in self.request.arguments():
                user.firstqso =  '1'
        
            user.put()
        
        values = { 'user': user,
            }
        
        self.response.out.write(
          template.render('fgbadgeupdate.html', values))
        
class FourGrid(webapp.RequestHandler):
    def get(self):
        mapqsl = db.GqlQuery("SELECT * FROM QSOMapLink order by date desc limit 15")
        values = { 'qsls': mapqsl,
            }
        
        self.response.out.write(
          template.render('fourgridqsl.html', values))

class TeslaEvent(webapp.RequestHandler):
    def get(self):
        mapqsl = db.GqlQuery("SELECT * FROM QSOMapLink order by date desc limit 15")
        values = { 'qsls': mapqsl,
            }
        
        self.response.out.write(
          template.render('teslaevent.html', values))

        

class LinkQSO(webapp.RequestHandler):
    def get(self):
        #link_store = QSOMapLink(link = '    http://goo.gl/Iflsf ', tx = 'KD0FNR', rx = 'ZD7FT', tag = 'Iflsf')
        #link_store.put()

        mtag = self.request.get('mqso')
        #fclass = self.request.get('tclass')
        #fpassedseen = self.request.get('passedseen')
        pqs = "SELECT * FROM QSOMapLink WHERE tag = :utlink"
        mapqsl = db.GqlQuery(
            pqs, utlink=mtag)

        qres_count = 0
        for qres in mapqsl:
            tester = qres
            qres_count = qres_count + 1
            
        values = {}
        if qres_count != 0:
            values = { 'qsl': qres,
                }
        
        self.response.out.write(
          template.render('newmapqsl.html', values))
    

class ShortMap(webapp.RequestHandler):
    def post(self):
        map = self.request.get('map')
        qtx = self.request.get('tx')
        qrx = self.request.get('rx')
        smmap = self.request.get('sm_map')

                
        #credentials = AppAssertionCredentials(scope='https://www.googleapis.com/auth/urlshortener')
        #http = credentials.authorize(httplib2.Http(memcache))
                
        shortUrl = 'teststuff'
        qtag = shortUrl.lstrip('http://goo.gl/')
        
        #Only do the rest of this if the tg didn't already exist.  No more duplicates
        mtag = qtag
        #fclass = self.request.get('tclass')
        #fpassedseen = self.request.get('passedseen')
        pqs = "SELECT * FROM QSOMapLink WHERE tag = :utlink"
        mapqsl = db.GqlQuery(
            pqs, utlink=mtag)

        qres_count = 0
        for qres in mapqsl:
            tester = qres
            qres_count = qres_count + 1
            
        if qres_count == 0:
        

            # Create a shortened small map URL by inserting the URL into the url collection.
            #body = {"longUrl": smmap }
            #smresp = url.insert(body=body).execute()

            #shortsmUrl = smresp['id']
            shortsmUrl = 'teststuff'

        
            link_store = QSOMapLink(link = shortUrl, tx = qtx, rx = qrx, tag = qtag, smlink = shortsmUrl)
            #handle all the optional fields  
            if 'frequency' in self.request.arguments():
                link_store.frequency =  float(self.request.get('frequency'))
            if 'cf_distance' in self.request.arguments():
                link_store.distance =  float(self.request.get('cf_distance'))
            if 'band' in self.request.arguments():
                link_store.band =  self.request.get('band')

        
        
            link_store.put()
            #End of the conditional to avoid duplicates            

        values = {
                  'short_url' : qtag,
              }
        self.response.out.write(
          template.render('shortmap.html', values))

class TechPoolLoad(webapp.RequestHandler):
    def get(self):
        questions = db.GqlQuery(
            "SELECT * FROM TestQuestion WHERE tclass = 'CA' Order By subelement ASC, group ASC, qnum ASC")
        #q = db.GqlQuery("SELECT * FROM TestQuestion")
        #results = q.fetch(1000000)
        #for result in results:
        #    result.delete()

        values = { 'questions': questions,
        }
        self.response.out.write(
          template.render('techpoolload.html', values))


class AccHamTestScore(webapp.RequestHandler):
    def post(self):
        se_score_tag = "N"
        if 'se_score' in self.request.POST:
            se_score_tag = self.request.get('se_score')
        new_score = HamTestScore(name = self.request.get('name'),
                    tclass = self.request.get('tclass'),
                    elementscores = self.request.get('elementscores'),
                    partial = self.request.get('partial'),
                    se_score = se_score_tag)
        new_score.put()
        
        fname = self.request.get('name')
        fclass = self.request.get('tclass')
        fpassedseen = self.request.get('passedseen')
        pqs = "SELECT * FROM SeenPassed WHERE tclass = :utclass AND name = :uname"
        qpqs = db.GqlQuery(
            pqs, utclass=fclass, uname=fname)
        qres_count = 0
        for qres in qpqs:
            tester = qres
            qres_count = qres_count + 1
            
        if qres_count != 0:
            qres.passedseen = fpassedseen
            qres.put()
        else:
            new_ps = SeenPassed(name = fname,
                                tclass = fclass,
                                passedseen = fpassedseen)
            new_ps.put()
        #self.response.out.write(new_score)
    def get(self):
        name = self.request.get('name')
        tclass = self.request.get('tclass')
        qst = "SELECT * FROM HamTestScore WHERE tclass = :utclass AND name = :uname ORDER BY scoredate ASC"
        qpassseen = "SELECT * FROM SeenPassed WHERE tclass = :utclass AND name = :uname"
        scores = db.GqlQuery(
            qst, utclass=tclass, uname=name)
        passedseens = db.GqlQuery(
            qpassseen, utclass=tclass, uname=name)
        values = { 'scores': scores,
                   'passedseens': passedseens
        }
        #self.response.out.write(values)
        self.response.out.write(
          template.render('hamscores.html', values))

        
class GenTest(webapp.RequestHandler):
    def get(self):
        questions = db.GqlQuery(
            "SELECT * FROM TestQuestion WHERE tclass = 'T' Order By index ASC")
        t_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'T'")
        g_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'G'")
        e_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'E'")
        nz_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'NZ'")
        #q = db.GqlQuery("SELECT * FROM TestQuestion")
        #results = q.fetch(1000000)
        #for result in results:
        #    result.delete()
        libraries = self.request.get('libs')
        values = { 'libs': libraries.split(','),
                  'questions': questions,
            't_helps': t_helps,
            'g_helps': g_helps,
            'e_helps': e_helps,
            'nz_helps': nz_helps,
            'page_test_type' : 'GN'
        }
        self.response.out.write(
          template.render('main.html', values))

class NewGenTest(webapp.RequestHandler):
    def get(self):
        questions = db.GqlQuery(
            "SELECT * FROM TestQuestion WHERE tclass = 'T' Order By index ASC")
        t_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'T'")
        g_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'G'")
        e_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'E'")
        nz_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'NZ'")
        #q = db.GqlQuery("SELECT * FROM TestQuestion")
        #results = q.fetch(1000000)
        #for result in results:
        #    result.delete()
        libraries = self.request.get('libs')
        values = { 'libs': libraries.split(','),
                  'questions': questions,
            't_helps': t_helps,
            'g_helps': g_helps,
            'e_helps': e_helps,
            'nz_helps': nz_helps,
            'page_test_type' : 'GN'
        }
        self.response.out.write(
          template.render('main.html', values))

class ExtraTest(webapp.RequestHandler):
    def get(self):
        questions = db.GqlQuery(
            "SELECT * FROM TestQuestion WHERE tclass = 'T' Order By index ASC")
        t_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'T'")
        g_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'G'")
        e_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'E'")
        nz_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'NZ'")
        #q = db.GqlQuery("SELECT * FROM TestQuestion")
        #results = q.fetch(1000000)
        #for result in results:
        #    result.delete()
        libraries = self.request.get('libs')
        values = { 'libs': libraries.split(','),
                  'questions': questions,
            't_helps': t_helps,
            'g_helps': g_helps,
            'e_helps': e_helps,
            'nz_helps': nz_helps,
            'page_test_type' : 'E'
        }
        self.response.out.write(
          template.render('main.html', values))


## API Keys go here!

class MainPage(webapp.RequestHandler):
    def get(self):
  
 
        qsls = db.GqlQuery(
             "SELECT * FROM Contact Order By date DESC, time DESC LIMIT 50")
        t_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'T'")
        g_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'G'")
        e_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'E'")
        nz_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'NZ'")

        
        template_values = {
            #'name': 'Hamilton Test',
#            'name': self.user['name'],
            #'uid': '27',
#            'uid': self.user['uid'],
            't_helps': t_helps,
            'g_helps': g_helps,
            'e_helps': e_helps,
            'nz_helps': nz_helps,
            'qsls': qsls
        }

        self.response.out.write(template.render('fbtechtestnew.html', template_values))
  

class Callsigns(webapp.RequestHandler):
    def get(self):
        values = { 'test': 'tests'}
        self.response.out.write(
            template.render('callsign.html', values))
    def post(self):
        values = { 'test': 'tests'}
        self.response.out.write(
            template.render('callsign.html', values))

class MainPageQSO(webapp.RequestHandler):
    def post(self):
        
#        logging.debug('About to get qsl info')
        qsls = db.GqlQuery(
             "SELECT * FROM Contact Order By date DESC, time DESC LIMIT 50")
        t_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'T'")
        g_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'G'")
        e_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'E'")
        nz_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'NZ'")
        
        template_values = {
            #'name': 'Hamilton Test',
            #'name': self.user['name'],
            #'uid': '27',
            #'uid': self.user['uid'],
            't_helps': t_helps,
            'g_helps': g_helps,
            'e_helps': e_helps,
            'nz_helps': nz_helps,
            'qsls': qsls
        }

        self.response.out.write(template.render('fbtechtestnewqso.html', template_values))

class FBTester(webapp.RequestHandler):
    def get(self):
        t_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'T'")
        g_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'G'")
        e_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'E'")
        nz_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'NZ'")

        
        template_values = {
            #'name': 'Hamilton Test',
            #'name': 'Hamilton',
            #'uid': '27',
            #'uid': '01234567890',
            #'t_helps': t_helps,
            #'g_helps': g_helps,
            #'e_helps': e_helps,
            #'nz_helps': nz_helps,
            #'test_land' : 'E',
        }

        template_values['apikey'] = 'fbjunk'
        self.response.out.write(template.render('ham_exam_simple.html', template_values))
    def post(self):
  
        qsls = db.GqlQuery(
             "SELECT * FROM Contact Order By date DESC, time DESC LIMIT 50")
        t_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'T'")
        g_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'G'")
        e_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'E'")
        nz_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'NZ'")

        
        template_values = {
            #'name': 'Hamilton Test',
            'name': 'Hamilton',
            #'uid': '27',
            'uid': '01234567890',
            't_helps': t_helps,
            'g_helps': g_helps,
            'e_helps': e_helps,
            'nz_helps': nz_helps,
            'test_land' : 'E',
        }

        template_values['apikey'] = 'fbjunk'
        self.response.out.write(template.render('ham_exam_simple.html', template_values))
  
class HelpIndex(webapp.RequestHandler):
    def get(self):
  
        ## otherwise redirect to where the user can login and install
 
        qsls = db.GqlQuery(
             "SELECT * FROM Contact Order By date DESC, time DESC LIMIT 50")
        t_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'T'")
        g_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'G'")
        e_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'E'")
        nz_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'NZ'")

        tposts = db.GqlQuery("SELECT * FROM ForumLatest WHERE test_type = 'T' order by postdate desc")
        gposts = db.GqlQuery("SELECT * FROM ForumLatest WHERE test_type = 'G' order by postdate desc")
        eposts = db.GqlQuery("SELECT * FROM ForumLatest WHERE test_type = 'E' order by postdate desc")


        
        template_values = {
            #'name': 'Hamilton Test',
            'name': 'Hamilton',
            #'uid': '27',
            'uid': '01234567890',
            't_helps': t_helps,
            'g_helps': g_helps,
            'e_helps': e_helps,
            'nz_helps': nz_helps,
            'test_land': 'E',
            'tposts': tposts,
            'gposts': gposts,
            'eposts':eposts
        }

        self.response.out.write(template.render('helpindex.html', template_values))
  
class FTest(webapp.RequestHandler):
    def get(self):
  
        ## otherwise redirect to where the user can login and install
 
        qsls = db.GqlQuery(
             "SELECT * FROM Contact Order By date DESC, time DESC LIMIT 50")
        t_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'T'")
        g_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'G'")
        e_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'E'")
        nz_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'NZ'")

        
        template_values = {
            #'name': 'Hamilton Test',
            'name': 'Hamilton',
            #'uid': '27',
            'uid': '01234567890',
            't_helps': t_helps,
            'g_helps': g_helps,
            'e_helps': e_helps,
            'nz_helps': nz_helps,
            'test_land' : 'E',
        }

        self.response.out.write(template.render('fbtechtesttest.html', template_values))
  
class FBTesterQSO(webapp.RequestHandler):
    def get(self):
        if 'fbqsoapp' not in self.request.GET and 'fbqso_obj' in self.request.GET:
            contact = self.request.get('fbqso_obj')
            #pass this to a key constructor and get the game record
            replay = Contact.get(contact)
            values = { 'contact': replay}
            values['key'] = contact
            self.response.out.write(
                template.render('fbqso_obj.html', values))

        else:
            
  
            qsls = db.GqlQuery(
                 "SELECT * FROM Contact Order By date DESC, time DESC LIMIT 50")
            t_helps = db.GqlQuery(
                "SELECT * FROM HamHelp WHERE tclass = 'T'")
            g_helps = db.GqlQuery(
                "SELECT * FROM HamHelp WHERE tclass = 'G'")
            e_helps = db.GqlQuery(
                "SELECT * FROM HamHelp WHERE tclass = 'E'")
            nz_helps = db.GqlQuery(
                "SELECT * FROM HamHelp WHERE tclass = 'NZ'")
    
            
            template_values = {
                #'name': 'Hamilton Test',
                'name': 'Hamilton',
                #'uid': '27',
                'uid': '01234567890',
                't_helps': t_helps,
                'g_helps': g_helps,
                'e_helps': e_helps,
                'nz_helps': nz_helps,
                'test_land' : 'E',
            }

            if 'fbqso_obj' in self.request.GET:
                contact = self.request.get('fbqso_obj')
                #pass this to a key constructor and get the game record
                replay = Contact.get(contact)
                template_values['contact'] = replay
                template_values['key'] = contact
            self.response.out.write(template.render('fbqso_obj.html', template_values))

    def post(self):
        if 'fbqsoapp' not in self.request.GET and 'fbqso_obj' in self.request.GET:
            contact = self.request.get('fbqso_obj')
            #pass this to a key constructor and get the game record
            replay = Contact.get(contact)
            values = { 'contact': replay}
            values['key'] = contact
            self.response.out.write(
                template.render('fbqso_obj.html', values))

        else:
            qsls = db.GqlQuery(
                 "SELECT * FROM Contact Order By date DESC, time DESC LIMIT 50")
            t_helps = db.GqlQuery(
                "SELECT * FROM HamHelp WHERE tclass = 'T'")
            g_helps = db.GqlQuery(
                "SELECT * FROM HamHelp WHERE tclass = 'G'")
            e_helps = db.GqlQuery(
                "SELECT * FROM HamHelp WHERE tclass = 'E'")
            nz_helps = db.GqlQuery(
                "SELECT * FROM HamHelp WHERE tclass = 'NZ'")
    
            
            template_values = {
                #'name': 'Hamilton Test',
                'name': 'Hamilton',
                #'uid': '27',
                'uid': '01234567890',
                't_helps': t_helps,
                'g_helps': g_helps,
                'e_helps': e_helps,
                'nz_helps': nz_helps,
                'test_land' : 'E',
            }
    
            if 'fbqso_obj' in self.request.GET:
                contact = self.request.get('fbqso_obj')
                #pass this to a key constructor and get the game record
                replay = Contact.get(contact)
                template_values['contact'] = replay
                template_values['key'] = contact
            self.response.out.write(template.render('fbqso_obj.html', template_values))
        
class FGQSO(webapp.RequestHandler):
    def get(self):
  
        qsls = db.GqlQuery(
             "SELECT * FROM Contact Order By date DESC, time DESC LIMIT 50")
        t_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'T'")
        g_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'G'")
        e_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'E'")
        nz_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'NZ'")

        
        template_values = {
            #'name': 'Hamilton Test',
            'name': 'Hamilton',
            #'uid': '27',
            'uid': '01234567890',
            't_helps': t_helps,
            'g_helps': g_helps,
            'e_helps': e_helps,
            'nz_helps': nz_helps,
            'test_land' : 'E',
        }

        self.response.out.write(template.render('fgqso.html', template_values))
        
class GBack(webapp.RequestHandler):
    def get(self):
  
        template_values = {
            #'name': 'Hamilton Test',
            'name': 'Hamilton',
            #'uid': '27',
            'uid': '01234567890',
        }

        self.response.out.write(template.render('gback.html', template_values))
        

class FBTechTest(webapp.RequestHandler):
    def get(self):
        helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'T'")

        #libraries = self.request.get('libs')
        values = {    
            'name': 'Hamilton Carter',
            'helps': helps
        }
        self.response.out.write(
          template.render('fbtechtestnew.html', values))

FACEBOOK_APP_ID = '140851685938025'
FACEBOOK_APP_SECRET = ''

class BaseHandler(webapp.RequestHandler):
    """Provides access to the active Facebook user in self.current_user

The property is lazy-loaded on first access, using the cookie saved
by the Facebook JavaScript SDK to determine the user ID of the active
user. See http://developers.facebook.com/docs/authentication/ for
more information.
"""
    @property
    def current_user(self):
        if not hasattr(self, "_current_user"):
            self._current_user = None
            cookie = facebook2.get_user_from_cookie(
                self.request.cookies, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET)
            if cookie:
                # Store a local instance of the user data so we don't need
                # a round-trip to Facebook on every request
                user = User.get_by_key_name(cookie["uid"])
                if not user:
                    graph = facebook2.GraphAPI(cookie["access_token"])
                    profile = graph.get_object("me")
                    user = User(key_name=str(profile["id"]),
                                id=str(profile["id"]),
                                name=profile["name"],
                                password="tester33",
                                profile_url=profile["link"],
                                access_token=cookie["access_token"])
                    user.put()
                elif user.access_token != cookie["access_token"]:
                    user.access_token = cookie["access_token"]
                    user.put()
                self._current_user = user
        return self._current_user


class HomeHandler(BaseHandler):
    def get(self):
        #path = os.path.join(os.path.dirname(__file__), "fblogin3.html")
        args = dict(current_user=self.current_user,
                    facebook_app_id=FACEBOOK_APP_ID)
        self.response.out.write(template.render("fblogin3.html", args))



class TechTest(webapp.RequestHandler):
    def get(self):
        questions = db.GqlQuery(
            "SELECT * FROM TestQuestion WHERE tclass = 'T' Order By index ASC")
        t_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'T'")
        g_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'G'")
        e_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'E'")
        nz_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'NZ'")
        #q = db.GqlQuery("SELECT * FROM TestQuestion")
        #results = q.fetch(1000000)
        #for result in results:
        #    result.delete()
        libraries = self.request.get('libs')
        values = { 'libs': libraries.split(','),
                  'questions': questions,
            't_helps': t_helps,
            'g_helps': g_helps,
            'e_helps': e_helps,
            'nz_helps': nz_helps,
            'page_test_type' : 'T'
        }
        self.response.out.write(
          template.render('main.html', values))

class TechTest2(webapp.RequestHandler):
    def get(self):
        questions = db.GqlQuery(
            "SELECT * FROM TestQuestion WHERE tclass = 'T' Order By index ASC")
        t_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'T'")
        g_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'G'")
        e_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'E'")
        nz_helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'NZ'")
        #q = db.GqlQuery("SELECT * FROM TestQuestion")
        #results = q.fetch(1000000)
        #for result in results:
        #    result.delete()
        libraries = self.request.get('libs')
        values = { 'libs': libraries.split(','),
                  'questions': questions,
            't_helps': t_helps,
            'g_helps': g_helps,
            'e_helps': e_helps,
            'nz_helps': nz_helps
        }
        self.response.out.write(
          template.render('techtest2.html', values))

class CFTech(webapp.RequestHandler):
    def get(self):
        questions = db.GqlQuery(
            "SELECT * FROM TestQuestion WHERE tclass = 'T' Order By index ASC")
        helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'T'")
        #q = db.GqlQuery("SELECT * FROM TestQuestion")
        #results = q.fetch(1000000)
        #for result in results:
        #    result.delete()
        libraries = self.request.get('libs')
        values = { 'libs': libraries.split(','),
                  'questions': questions,
                  'helps': helps
        }
        self.response.out.write(
          template.render('techtestloc.html', values))

class CFNZ(webapp.RequestHandler):
    def get(self):
        questions = db.GqlQuery(
            "SELECT * FROM TestQuestion WHERE tclass = 'NZ' Order By index ASC")
        helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'NZ'")
        #q = db.GqlQuery("SELECT * FROM TestQuestion")
        #results = q.fetch(1000000)
        #for result in results:
        #    result.delete()
        libraries = self.request.get('libs')
        values = { 'libs': libraries.split(','),
                   'questions': questions,
                  'helps': helps
        }
        self.response.out.write(
          template.render('nztestloc.html', values))

class CFGen(webapp.RequestHandler):
    def get(self):
        questions = db.GqlQuery(
            "SELECT * FROM TestQuestion WHERE tclass = 'G' Order By index ASC")
        helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'G'")
        #q = db.GqlQuery("SELECT * FROM TestQuestion")
        #results = q.fetch(1000000)
        #for result in results:
        #    result.delete()
        libraries = self.request.get('libs')
        values = { 'libs': libraries.split(','),
                  'questions': questions,
                  'helps': helps
        }
        self.response.out.write(
          template.render('gentestloc.html', values))

class CFTBF(webapp.RequestHandler):
    def get(self):
        values = { 
        }
        self.response.out.write(
          template.render('techbandflash.html', values))

class CFExtra(webapp.RequestHandler):
    def get(self):
        questions = db.GqlQuery(
            "SELECT * FROM TestQuestion WHERE tclass = 'E' Order By index ASC")
        helps = db.GqlQuery(
            "SELECT * FROM HamHelp WHERE tclass = 'E'")
        #q = db.GqlQuery("SELECT * FROM TestQuestion")
        #results = q.fetch(1000000)
        #for result in results:
        #    result.delete()
        libraries = self.request.get('libs')
        values = { 'libs': libraries.split(','),
                  'questions': questions,
                  'helps': helps
        }
        self.response.out.write(
          template.render('extratestloc.html', values))


class TechPoolF(webapp.RequestHandler):
    def get(self):
        #filehandle = urllib.urlopen('http://copaseticflows.appspot.com/examhelp/nzparsetest.txt')
        filehandle = urllib.urlopen('http://copaseticflows.appspot.com/examhelp/cbasefr.txt')
        #send only the spots
        longq = ''
        for line in filehandle.readlines():
            longq = longq + line.rstrip() + ' '
        #m = re.finditer('E([0-9|O])([A-Z])([0-9|O][0-9|O]) *\(([A-D])\)[ |\[](.*?) (A\..*?) (B\..*?) (C\..*?) (D\..*?) \~', longq)
        #m = re.finditer('([0-9][0-9])\-([0-9])\-\(([a-d])\)(.*?:) (a .*?) (b .*?) (c .*?) (d .*?) (?=[0-9][0-9]\-)', longq)
        m = re.finditer('B\-([0-9]*)\-([0-9]*)\-([0-9]*)\ \(([1-4])\)(.*?) (1\. .*?) (2\. .*?) (3\. .*?) (4\. .*?) \> ', longq)
        i = 0
        mcopy = m
        for q in m:
            i = i + 1         
            #self.response.out.write(str(i) + ' Found ' + q.group(1) + ' ' + q.group(2) + ' '+ q.group(3) + ' ' + q.group(4) + ' ' + q.group(5) + ' ' + q.group(6) + ' ' + q.group(7) + ' ' + q.group(8) + ' ' + q.group(9) + '<br>')
            self.response.out.write(str(i) + ' Found ' + q.group(1) + ' ' + q.group(2) + ' '+ q.group(3) + ' ' + q.group(4) + ' ' + q.group(5) + ' ' + q.group(6) + ' ' + q.group(7) + ' ' + q.group(8) + ' ' + q.group(9) + '<br>')
            #Setup the actual answer
            num_answer = q.group(4)
            temp_answer = 'A'
            if num_answer == '1':
                temp_answer = 'A'
            if num_answer == '2':
                temp_answer = 'B'
            if num_answer == '3':
                temp_answer = 'C'
            if num_answer == '4':
                temp_answer = 'D'
            #Add the question to the db
            new_question = TestQuestion(
                    index = i,
                    tclass = 'CBF',
                    #subelement = q.group(1),
                    subelement = q.group(1),
                    group = q.group(2),
                    qnum = q.group(3),
                    answer = q.group(4),
                    question = q.group(5),
                    A = q.group(6),
                    B = q.group(7),
                    C = q.group(8),
                    D = q.group(9)
                    )
            new_question.put()
            
        self.response.out.write('<br>Found ' + str(i) + '<br>')
        values = { 'questions': mcopy
        }
        #self.response.out.write(
        #  template.render('techpoolform.html', values))

class CallAdd(webapp.RequestHandler):
    def get(self):
        filehandle = urllib.urlopen('http://copaseticflows.appspot.com/examhelp/nz4.txt')
        #send only the spots
        starter = int(self.request.get('start'))
        longq = ''
        i = starter
        for line in filehandle.readlines():
            if i >= starter and i < starter + 200:
                longq = line.rstrip()
                m = longq.split('<br>')
                callsign = m[0]
                new_call = CallsignLatLng(
                                          callsign = callsign,
                                          street_addr = longq,
                                          call_lat = 10000.0,
                                          call_lng = 10000.0
                                          )
                new_call.put()
                if i == starter + 199:
                    break
            i = i + 1
        i = i + 1
            
        
            #street_addr = longq
        #m = re.finditer('E([0-9|O])([A-Z])([0-9|O][0-9|O]) *\(([A-D])\)[ |\[](.*?) (A\..*?) (B\..*?) (C\..*?) (D\..*?) \~', longq)
            #foundstr = foundstr + line.rstrip()
            
        #self.response.out.write(catchl)
        values = { 'current_name': starter,
                   'next_url' : i
        }
        self.response.out.write(
                        template.render('callupdate.html', values))

class DXSCall(webapp.RequestHandler):
    def post(self):
        #Put the new entry into the database
        #Put the new entry into the database
        scallsign = self.request.get('callsign')
        calls = db.GqlQuery("SELECT * FROM CallsignLatLng WHERE callsign = '" + scallsign + "'")
        use_calls = db.GqlQuery("SELECT * FROM CallsignLatLng WHERE callsign = '" + scallsign + "'")

        if calls.count() > 0:
            for call in use_calls:
                call.call_lat = float(self.request.get('call_lat'))
                call.call_lng = float(self.request.get('call_lng'))
                call.put()
                
        else:
            new_callsign = CallsignLatLng(callsign = self.request.get('callsign'),
                    call_lat = float(self.request.get('call_lat')),
                    call_lng = float(self.request.get('call_lng')),
                    street_addr = self.request.get('street_addr')
                    )
            new_callsign.put()
        
        #callsigns = db.GqlQuery(
        #    "SELECT * FROM CallsignLatLng")

        #values = {
        #    'callsigns': callsigns
        #}
        #self.response.out.write(
        #  template.render('newcallsign.html', values))


class QSLSearch(webapp.RequestHandler):
    def get(self):
        #Put the new entry into the database
        #Put the new entry into the database
        callsign = self.request.get('callsign', 'optout')
        search_mode = self.request.get('search_mode', 'optout')
        search_year = self.request.get('search_year', 'optout')
        search_band = self.request.get_all('band')
        #print callsign
        gql_query = "SELECT * FROM Contact WHERE "
        rx_gql_query = gql_query
        found_first = 0
        
        if callsign != '' :
            found_first = 1
            gql_query = gql_query + "tx_call = '" + callsign + "' "
            rx_gql_query = rx_gql_query + "rx_call = '" + callsign + "' "
            
           
        
        if search_mode != 'ALL' :
            if found_first == 1 :
                gql_query = gql_query + "AND mode = '" + search_mode + "' "
                rx_gql_query = rx_gql_query + "AND mode = '" + search_mode + "' "
            if found_first != 1 :
                found_first = 1
                gql_query = gql_query + "mode = '" + search_mode + "' "
                rx_gql_query = rx_gql_query + "mode = '" + search_mode + "' "
        
        dt_search_year = datetime.datetime.now()
        dt_search_year_top = datetime.datetime.now()        
        if search_year != '' :
            #print datetime.datetime.strptime(search_year, '%Y').date()
            dt_search_year = datetime.datetime.strptime(search_year, '%Y').date() 
            dt_search_year_top = dt_search_year + datetime.timedelta(days=365)
            #print dt_search_year
            #print dt_search_year_top
            if found_first == 1 :
                gql_query = gql_query + "AND date > :first_date AND date < :last_date "
                rx_gql_query = rx_gql_query + "AND date > :first_date AND date < :last_date "
            if found_first != 1 :
                gql_query = gql_query + "date >= :first_date AND date < :last_date "
                rx_gql_query = rx_gql_query + "date >= :first_date AND date < :last_date "
                
        found_band = len(search_band)
        if found_band != 0:
            if found_first == 1 :
                gql_query = gql_query + "AND band in :sband"
                rx_gql_query = rx_gql_query + "AND band in :sband"
            if found_first != 1 :
                gql_query = gql_query + "band in :sband"
                rx_gql_query = rx_gql_query + "band in :sband"
                      
        
        #print "123123123"
        #print gql_query

        #print "456456456"
        #print rx_gql_query
#if found_year == 0 and found_band == 0:
        #    qsls = db.GqlQuery(gql_query)
        #if found_year == 1 and found_band == 0:
        rx_qsls = None
        qsls = db.GqlQuery(gql_query, first_date = dt_search_year, last_date = dt_search_year_top, sband=search_band)
        if found_first != 0:
            rx_qsls = db.GqlQuery(rx_gql_query, first_date = dt_search_year, last_date = dt_search_year_top, sband=search_band)

        values = {
            'qsls': qsls,
            'rx_qsls': rx_qsls
        }
        self.response.out.write(
          template.render('contacts.html', values))

class LoginHandler(webapp.RequestHandler):
    def get(self):
        user = self.request.get(
            'user')
        password = self.request.get(
            'password')
        #Query for the user password combination
        users = db.GqlQuery(
            "SELECT * FROM User WHERE name = '" + user + "' and password = '" +
            password + "'")

        values = {
            'name': users.count()
        }
        

        self.response.out.write(
          template.render('login.html', values))
        
    def post(self):
        user = self.request.get(
            'user')
        users = db.GqlQuery(
            "SELECT * FROM User WHERE name = '" + user +"'")
        
        user_created = 1
        if users.count() == 0:
            new_user = User(name = self.request.get('user'),
                    password = self.request.get('password'))
            new_user.put()
            self.redirect('/')
        else:
            user_created = 0
        
        values = {
            'name': user_created
        }
        

        self.response.out.write(
          template.render('login.html', values))

#        self.redirect('/')

def main():
    application = webapp.WSGIApplication([('/', MainHandler),
                                          ('/qrpspot', MainHandlerQS),
                                          ('/login', LoginHandler),
                                          ('/qsllog', QSLLogHandler),
                                          ('/qsllogtable', QSLLogTableHandler),
                                          ('/qsllocation', QSLLocation),
                                          ('/qsllogentry', QSLLogEntry),
                                          ('/qslsearch', QSLSearch),
                                          ('/dxsmirror', DXSMirror),
                                          ('/dxsget', DXSGet),
                                          ('/dxsgetqs', DXSGetQS),
                                          ('/dxscall', DXSCall),
                                          ('/dxslogentry', DXSLogEntry),
                                          ('/dxsgetcalls', DXSGetCalls),
                                          ('/dxshbcdelete', DXSHBCDelete),
                                          ('/tabtest', TabTest),
                                          ('/techpoolout', TechPoolOut),
                                          ('/techpoolf', TechPoolF),
                                          ('/techpoolload', TechPoolLoad),
                                          ('/techtest', TechTest),
                                          ('/techtest2', TechTest2),
                                          ('/fbapps/techtest', FBTester),
                                          ('/fbapps/stechtest', FBTester),
                                          ('/fbapps/qsomapper', FBTesterQSO),
                                          ('/fbapps/fbtester', FBTester),
                                          ('/hamtest', FBTester),
                                          ('/hamtestscore', AccHamTestScore),
                                          ('/cftech', FBTester),
                                          ('/cfnz', FBTester),
                                          ('/cfgen', FBTester),
                                          ('/cfextra', FBTester),
                                          ('/hbcusers', HBCUsers),
                                          ('/gentest', GenTest),
                                          ('/extratest', ExtraTest),
                                          ('/hamtesthelp', HamTestHelp),
                                          ('/calladd', CallAdd),
                                          ('/cftbf', CFTBF),
                                          ('/lastdxs', LastDXS),
                                          ('/test', TestFront),
                                          ('/hamtforum', HamTForumOut),
                                          ('/fillqso', FillQSO),
                                          ('/fillqsog', FillQSOg),
                                          ('/cflogbook', TabTest),
                                          ('/cflblu', CFLBLU),
                                          ('/tcflblu', TCFLBLU),
                                          ('/qslgadget', QSLGadget),
                                          ('/shm', ShortMap),
                                          ('/mapqso', LinkQSO),
                                          ('/newqso', FBTesterQSO),
                                          ('/glogin', GLog),
                                          ('/fourgrid', FourGrid),
                                          ('/teslaevent', TeslaEvent),
                                          ('/fgupdate', FGUpdate),
                                          ('/fgqso', FGQSO),
                                          ('/fgbadges', FGBadges),
                                          ('/fgcallclaim', FGCallClaim),
                                          ('/ftester', FTest),
                                          ('/gback', GBack),
                                          ('/newgentest', NewGenTest),
                                          ('/hamforumentry', HFEntry),
                                          ('/helpindex', HelpIndex),
                                          ('/hfeget', HFEGet),
                                          ('/hfuser', HFUser),
                                          ('/sattrack', SATTrack),
                                          ('/findsat', FindSat),
                                          ('/gebang', GEBang),
                                          ('/aprsdotfly', GEAPRS),
                                          ('/callsigns', Callsigns)
                                          ],
                                         debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()

