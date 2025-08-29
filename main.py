from flask import Flask, send_from_directory, make_response
import os

app = Flask(__name__)

def add_cache_headers(response):
    response.headers['Cache-Control'] = 'public, max-age=300'  # 5 minutes cache
    return response

@app.route('/')
def index():
    with open('index.html', 'r') as f:
        html_content = f.read()
    response = make_response(html_content)
    return add_cache_headers(response)

@app.route('/privacy-policy.html')
def privacy_policy():
    with open('privacy-policy.html', 'r') as f:
        html_content = f.read()
    response = make_response(html_content)
    return add_cache_headers(response)

@app.route('/cookie-policy.html')
def cookie_policy():
    with open('cookie-policy.html', 'r') as f:
        html_content = f.read()
    response = make_response(html_content)
    return add_cache_headers(response)

@app.route('/terms-conditions.html')
def terms_conditions():
    with open('terms-conditions.html', 'r') as f:
        html_content = f.read()
    response = make_response(html_content)
    return add_cache_headers(response)

@app.route('/styles.css')
def styles():
    response = send_from_directory('.', 'styles.css', mimetype='text/css')
    response.headers['Cache-Control'] = 'public, max-age=3600'  # 1 hour cache for CSS
    return response

@app.route('/script.js')
def script():
    response = send_from_directory('.', 'script.js', mimetype='application/javascript')
    response.headers['Cache-Control'] = 'public, max-age=3600'  # 1 hour cache for JS
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)