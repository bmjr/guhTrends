# -*- coding: utf-8 -*-
"""
Created on Sat Apr 18 02:10:34 2015

@author: sonney
"""

import urllib
import json
import matplotlib.pyplot as plt


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


#Output the data as a JSON
test_url = '''https://play.spotify.com/track/2iS2s9oYpEmUzrAHPmqBHy''' #incoming track
x= list()
y = list()
for i in range(len(urldict[test_url])):
    x.append(urldict[test_url][i][2])
    y.append(urldict[test_url][i][1])

        

