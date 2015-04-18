# -*- coding: utf-8 -*-
"""
Created on Sat Apr 18 02:10:34 2015

@author: sonney
"""

import urllib
import json


dates = urllib.request.urlopen('http://charts.spotify.com/api/tracks/most_streamed/global/weekly/')
dataDates = json.loads(dates.read().decode())

urldict = dict()
weeklydict = dict()
for i in range(1, 99):
        WeeklyJSON = urllib.request.urlopen('http://charts.spotify.com/api/tracks/most_streamed/global/weekly/' + dataDates[i] )
        WeeklyDates = json.loads(WeeklyJSON.read().decode())
        WeeklyTracks = WeeklyDates['tracks']
        weeklydict[str(dataDates[i])] = list()#Remove the previous and next dates dictionary, returns a list
        for j in range(len(WeeklyTracks)):
            Test = WeeklyTracks[j]
            streams = Test['num_streams'] #Parse the number of views out of this
            artist = Test['track_name']
            url = Test['track_url']
            ArtistStream = [artist, streams, url]
            weeklydict[str(dataDates[i])].append(ArtistStream)
                        
Testdict = weeklydict #Create a test dictionary

for i in range(1,99):
    for j in range(len(weeklydict[dataDates[i]])):
        if weeklydict[dataDates[i]][j][2] not in urldict:
            urldict[str(weeklydict[dataDates[i]][j][2])] = list()
            new_list = [weeklydict[dataDates[i]][j][0], weeklydict[dataDates[i]][j][1], dataDates[i]]
            urldict[str(weeklydict[dataDates[i]][j][2])].append(new_list)
        else:
            new_list = [weeklydict[dataDates[i]][j][0], weeklydict[dataDates[i]][j][1], dataDates[i]]
            urldict[str(weeklydict[dataDates[i]][j][2])].append(new_list)
        

