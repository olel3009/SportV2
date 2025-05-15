import requests

def get_jwt():
    login_url = "http://localhost:5000/login"
    protected_url = "http://localhost:5000/protected"
    payload = {
        "email" : "test@test.de",
        "password": "test123"
    }

    login_response = requests.post(login_url, json=payload)
    protected_response = requests.get(protected_url, json=payload)
    access_token = login_response.json()["access_token"]
    
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.get(login_url, headers=headers)
    
    return response

if "__main__" == __name__:
    get_jwt()