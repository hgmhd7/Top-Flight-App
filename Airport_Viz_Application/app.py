# Import dependencies
import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)




# Database Setup

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///airports_db.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new modelapp
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)




# # Save references to each table
# Samples_Metadata = Base.classes.sample_metadata
Airports = Base.classes.all_airports



@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/aiports")
def names():
    """Return a list of sample names."""

    # Use Pandas to perform the sql queryclear
    
    stmt = db.session.query(Airports).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (sample names)
    return jsonify(list(df.columns))


if __name__ == "__main__":
    app.run(debug=True)