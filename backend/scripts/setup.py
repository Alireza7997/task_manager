import os, sys
from functions import *


if sys.argv[1] == "install":
    print("===Setting Up The Service===")
    if not is_service_defined():
        print("===Activating Service===")
        write_data(add_dir_and_get_data())
        os.system("sudo systemctl daemon-reload")
        os.system("sudo systemctl enable collaboration_backend.service")

elif sys.argv[1] == "restart":
    print("===Restart Service===")
    os.system("sudo systemctl restart collaboration_backend.service")
    print("===It Should Be Done===")

elif sys.argv[1] == "remove":
    print("===Removing Service===")
    os.system("sudo systemctl stop collaboration_backend.service")
    os.system("sudo systemctl disable collaboration_backend.service")
    os.system("sudo rm /etc/systemd/system/collaboration_backend.service")
    os.system("sudo systemctl daemon-reload")