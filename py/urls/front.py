from flask import Flask, Blueprint, render_template, request, redirect, url_for, jsonify, abort

# Blueprintにて、APIパスのprefix定義
front = Blueprint('', __name__)

@front.route('/')
def index():
    return render_template('index.html')

@front.route('/login/<token>')
def login(token):
    return render_template('index.html')
