from flask import Flask, redirect, render_template
import firebase_admin
from firebase_admin import db
import os

cred_obj = firebase_admin.credentials.Certificate('./ServiceAccountKey.json')
