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

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///airports_routes_db.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new modelapp
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)


# # Save references to each table
# Samples_Metadata = Base.classes.sample_metadata
Airports = Base.classes.all_airports
Routes = Base.classes.all_routes



@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/airports")
def names():
    """Return a list of sample names."""

    # Use Pandas to perform the sql queryclear
    
    stmt = db.session.query(Airports).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    airportslist = df.to_dict(orient='records')
   
    # Return a list of the column names (sample names)
    return json.dumps(airportslist)

@app.route("/routes")
def places():
    """Return a list of sample names."""

    # Use Pandas to perform the sql queryclear
    
    stmt = db.session.query(Routes).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    routeslist = df.to_dict(orient='records')
   
    return json.dumps(routeslist)

if __name__ == "__main__":
    app.run(debug=True)