import os

pwd = os.getcwd()

DATABASE_HOST = os.environ.get("DATABASE_HOST")
DATABASE_PORT = os.environ.get("DATABASE_PORT")
DATABASE_USERNAME = os.environ.get("DATABASE_USERNAME")
DATABASE_PASSWORD = os.environ.get("DATABASE_PASSWORD")
DATABASE_NAME = os.environ.get("DATABASE_NAME")
HOST = os.environ.get("HOST")
PORT = os.environ.get("PORT")
ALLOW_ORIGIN = os.environ.get("ALLOW_ORIGIN")
SECRET_KEY = os.environ.get("SECRET_KEY")

env = f'''
database:
  host: {DATABASE_HOST}
  port: {DATABASE_PORT}
  username: {DATABASE_USERNAME}
  password: {DATABASE_PASSWORD}
  dbname: {DATABASE_NAME}

host: {HOST}
port: {PORT}
allow_origins:
  - {ALLOW_ORIGIN}
# 30 days
expire_token_after_seconds: 2592000
access_token_expiry_seconds: 2592000
refresh_token_expiry_seconds: 2592000
secret_key: {SECRET_KEY}
'''

file = open(pwd + "/env.yml", "w")
file.write(env)
file.close()
