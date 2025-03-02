Hey so i have done some implementation for Oauth so that the login is done through google. 
The flow goes like this:
1. The frontend creates code_verifier and code_challenge. The code_verifier is stored in the localStorage.
2. Then the frontend initiates the Oauth flow. 
    This is done by redirecting to google's oauth2 url. 
    In this url, I pass some query paramters. 
    The main query paramters are google client_id, redirect_url (same as the one I gave as authorized redirect url in google cloud console),
    and code_challenge
3. Once the users logs in with their gmail and consents. It will redirect to the url I had given
    Now this url is back to another page in my frontend (can be thought of as the loading page) 
    When this url is reached, it has a query paramter added to what I had originally given which is the "authorization code"
    Now the frontend takes this code (when I say code, I mean authorization code) it just received and the code_verifier from the localStorage
    It then sends this code and code_verifier to the backend.
4. The backend then receives the code and code_verifier from the frontend.
    It then takes this and sends a POST HTTP request to the google Oauth.
    In this HTTP req, it contains the code, code_verifier, client_id, client_secrect, redirect_uri (this is to the frontend but no one is actually redirected there, just sent for a validation purpose)
    The response sent back has the id_token
5. The backend then takes the id_tokena nd verifies it once just to be sure.
6. When verified, oauth2 returns the userInfo which contains email, name, picture.
7. The backend then takes the userData and then signs it with the JWT secret.
    The JWT is then returned to the frontend as a response the HTTP request it sent to the backend containing the code and code_verifier.
8. The frontend takes the JWT and safely stores in as a secure cookie with only same site restriction
 