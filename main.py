from flask import Flask, make_response, render_template
import os, sys

import localsettings

tmpl_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

app = Flask("appname", template_folder=tmpl_dir, static_folder=static_dir)

app.config.from_object(localsettings.currentConfig)

parentdir = os.path.dirname(app.config['PROJECT_PATH'])
sys.path.insert(0,parentdir)

versionnumber = app.config['VERSION']


@app.route('/')
def index():
    resp = make_response(render_template('index.html', versionnumber=versionnumber))
    return resp

@app.route('/test')
def indextest():
    resp = make_response(render_template('index-grunt-template.html', versionnumber=versionnumber))
    return resp

if __name__ == '__main__':
    app.run(debug=True, host='localhost')
