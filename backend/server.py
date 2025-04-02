# ECE 461L Software Lab HW 6
# Logan Liberty

import os
from flask import Flask, jsonify, request, send_from_directory # Add send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='../frontend/build/static') # Point to React build static files
CORS(app) # Keep CORS for flexibility, though less critical if Flask serves UI

# Catch-all route to serve index.html for client-side routing
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, '../', path)):
         # Serve files from the root of the build folder
         return send_from_directory(os.path.join(app.static_folder, '../'), path)
    elif path != "" and os.path.exists(os.path.join(app.static_folder, path)):
         return send_from_directory(app.static_folder, path)
    else:
        # Serve index.html as the fallback for client-side routing
        return send_from_directory(os.path.join(app.static_folder, '../'), 'index.html')


# I modified the function call parameters slightly to match with how I setup the front-end
@app.route('/checkin/<int:projectId>/<int:qty>', methods=['POST'])
def checkIn_hardware(projectId,  qty):
  print(f"Received check-in request for Project ID: {projectId}, Quantity: {qty}")
  
  # Return popup message for frontend
  return jsonify({
      "message": f"{qty} hardware checked in",
      "projectId": projectId,
      "quantity": qty
  }), 200

@app.route('/checkout/<int:projectId>/<int:qty>', methods=['POST'])
def checkOut_hardware(projectId, qty):
  print(f"Received check-out request for Project ID: {projectId}, Quantity: {qty}")
  
  # Return popup message for frontend
  return jsonify({
      "message": f"{qty} hardware checked out",
      "projectId": projectId,
      "quantity": qty
  }), 200

@app.route('/join/<int:projectId>', methods=['POST'])
def joinProject(projectId):
    print(f"Received join request for Project ID: {projectId}")

    # Return popup message for frontend
    return jsonify({
        "message": f"Joined {projectId}",
        "projectId": projectId
    }), 200

@app.route('/leave/<int:projectId>', methods=['POST'])
def leaveProject(projectId):
    print(f"Received leave request for Project ID: {projectId}")

    # Return popup message for frontend
    return jsonify ({
        "message": f"Left {projectId}",
        "projectId": projectId
    }), 200

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get("PORT", 5000))
    # Run on 0.0.0.0 to be accessible externally (required by Heroku)
    app.run(debug=False, host='0.0.0.0', port=port) # Turn debug=False for production
