import os

pwd = os.getcwd()

NEXT_PUBLIC_BACKEND = os.environ.get("NEXT_PUBLIC_BACKEND")

env = f'''
NEXT_PUBLIC_BACKEND={NEXT_PUBLIC_BACKEND}
'''

file = open(pwd + "/.env", "w")
file.write(env)
file.close()