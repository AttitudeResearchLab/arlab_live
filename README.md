# ARLab Live

The ARLab video platform.

{MDB} + {Python+Flask}

## Setup

First, create a python3 virtual environment and activate it.

Second, install python dependencies in accordance with 'requirements.txt':

```
pip install -r requirements.txt
```

Third, upload the video to play to 'static/res/' directory and name it as 'video1.mp4'.

## How to Run

The python script provides RESTful APIs for saving users' operations. Therefore, simply run command `python main.py` to start the program directly.

Other static resources, e.g. html, javascript and css, should be handled by an HTTP(s) server (recommend Nginx).

## Reference

1. HTML5 Video Shadow DOM: https://blog.hellojs.org/creating-a-custom-html5-video-player-and-the-shadow-dom-a98f29261be4
2. Serve Flask Applications with uWSGI and NginX: https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-uwsgi-and-nginx-on-ubuntu-14-04
3. Quickstart of Flask-RESTful: https://flask-restful.readthedocs.io/en/latest/quickstart.html
4. HTML5 Fullscreen API: https://developer.mozilla.org/en/docs/Web/API/Fullscreen_API