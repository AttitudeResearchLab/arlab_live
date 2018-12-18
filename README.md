# ARLab Live

The ARLab video platform with barrage (bullet comments) system and gift system.

{MDB} + {Python+Flask}

## Setup

First, create a python3 virtual environment and activate it.

Second, install python dependencies in accordance with 'requirements.txt':

```
pip install -r requirements.txt
```

Third, upload a video to 'static/res/' directory and name it as 'video1.mp4', which will be streamed and displayed on the live platform webpage by default.

## How to Run

The python script provides RESTful APIs for saving users' operations. Therefore, simply run command `python main.py` to start the program directly.

Other static resources, e.g. html, javascript and css, should be handled by an HTTP(s) server (recommend Nginx).

## Data-collect and Debug Logs

Barrages and gifts sent by users will be recorded in .csv files located in 'data/' directory. Each .csv file contains 3 fields: 'time', 'operation' and 'content', where 'time' field records the video time when the operation occured, 'operation' field is filled with either 'send_barrage' or 'send_gift', and 'content' field records content of each operation (for barrages, the content is the inputted string, while for gifts, the content is the index of the sent gift). Filename of each record is formatted in '{user}\_{student ID}.csv'.

Debug logs, which are essential to check API use records and find origin of errors, are located in 'logs/' directory with filename formatted in 'debug%Y-%m-%d %H.log'.

## Reference

1. HTML5 Video Shadow DOM: https://blog.hellojs.org/creating-a-custom-html5-video-player-and-the-shadow-dom-a98f29261be4
2. Serve Flask Applications with uWSGI and NginX: https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-uwsgi-and-nginx-on-ubuntu-14-04
3. Quickstart of Flask-RESTful: https://flask-restful.readthedocs.io/en/latest/quickstart.html
4. HTML5 Fullscreen API: https://developer.mozilla.org/en/docs/Web/API/Fullscreen_API