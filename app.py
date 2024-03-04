"""Flask app for Cupcakes"""
import os

from flask import Flask, render_template, flash, redirect, jsonify, request
from models import connect_db, db, Cupcake

app = Flask(__name__)

app.config['SECRET_KEY'] = "Secret"

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
"DATABASE_URL", 'postgresql:///cupcakes')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True


connect_db(app)

@app.get('/api/cupcakes')
def show_cupcakes():
    """Returns information about all cupcakes

    Returns JSON {'cupcakes': [{id, flavor, size, rating, image_url}, ...]}"""

    cupcakes = Cupcake.query.all()
    serialized = [c.serialize() for c in cupcakes]

    return jsonify(cupcakes=serialized)

@app.get('/api/cupcakes/<int:cupcake_id>')
def show_cupcake(cupcake_id):
    """Returns information about a single cupcake

    Returns JSON {'cupcakes': {id, flavor, size, rating, image_url}}"""

    cupcake = Cupcake.query.get_or_404(cupcake_id)
    serialized = cupcake.serialize()

    return jsonify(cupcake=serialized)

@app.post('/api/cupcakes')
def create_cupcake():
    """Create cupcake from posted JSON data & return it

    Returns JSON {'cupcakes': {id, flavor, size, rating, image_url}}"""

    cupcake = Cupcake(
        flavor=request.json["flavor"],
        size=request.json["size"],
        rating=request.json["rating"],
        image_url=request.json.get("image_url"),
    )

    db.session.add(cupcake)
    db.session.commit()

    serialized=cupcake.serialize()

    return (jsonify(cupcake=serialized), 201)