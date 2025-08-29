from flask import Flask, render_template_string, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
def index():
    with open('index.html', 'r') as f:
        html_content = f.read()
    return html_content

@app.route('/privacy-policy.html')
def privacy_policy():
    with open('privacy-policy.html', 'r') as f:
        html_content = f.read()
    return html_content

@app.route('/cookie-policy.html')
def cookie_policy():
    with open('cookie-policy.html', 'r') as f:
        html_content = f.read()
    return html_content

@app.route('/styles.css')
def styles():
    return send_from_directory('.', 'styles.css', mimetype='text/css')

@app.route('/script.js')
def script():
    return send_from_directory('.', 'script.js', mimetype='application/javascript')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)