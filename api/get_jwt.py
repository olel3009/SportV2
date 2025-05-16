import requests

def get_jwt():
    login_url = "http://localhost:5000/users/login"
    protected_url = "http://localhost:5000/protected"
    
    payload = {
        "email" : "test@test.de",
        "password": "test123"
    }

    login_response = requests.post(login_url, json=payload)
    protected_response = requests.get(protected_url, json=payload)

    try:
        json_data = login_response.json()
        access_token = json_data["access_token"]
        print(access_token)
        headers = {
        "Authorization": f"Bearer {access_token}"
        }

        response = requests.get(login_url, headers=headers)

        return response
    except requests.exceptions.JSONDecodeError:
        print("Exception")
    
    

if "__main__" == __name__:
    get_jwt()