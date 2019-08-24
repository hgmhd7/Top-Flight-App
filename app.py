# Import dependencies
import os

import pandas as pd
import numpy as np
import json

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Database Setup

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///final_airports_routes_db.sqlite"
#app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///airports_routes_db.sqlite"

db = SQLAlchemy(app)

# reflect an existing database into a new modelapp
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)


# # Save references to each table
# Samples_Metadata = Base.classes.sample_metadata

Airports = Base.classes.final_airport_globe_data
Routes = Base.classes.final_route_data
Plots = Base.classes.final_scatter_plot_data

#Airports = Base.classes.all_airports
#Routes = Base.classes.all_routes


@app.route("/")
def scatter():
    """Return the scatter plot page."""
    return render_template("scatter.html")
    

@app.route("/globe")
def index():
    """Render the globe demo"""
    return render_template("index.html")


@app.route("/airports")
def names():
    """Return a list of airport dictionaries"""

    # Use Pandas to perform the sql queryclear
    
    stmt = db.session.query(Airports).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    airportslist = df.to_dict(orient='records')
   
    # Return a list of the column names (sample names)
    #return json.dumps(airportslist)
    return jsonify(airportslist)

@app.route("/routes")
def places():
    """Return a list of route dictionaries"""

    # Use Pandas to perform the sql queryclear
    
    stmt = db.session.query(Routes).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    routeslist = df.to_dict(orient='records')
    return jsonify(routeslist)
    #return json.dumps(routeslist)

@app.route("/scatterplot")
def plots():
    """Return a list of scatter plot dictionaries"""

    stmt = db.session.query(Plots).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    scatterlist = df.to_dict(orient='records')
   
    # Return a list of the column names (sample names)
    #return json.dumps(airportslist)
    return jsonify(scatterlist)
    

if __name__ == "__main__":
    app.run(debug=True)