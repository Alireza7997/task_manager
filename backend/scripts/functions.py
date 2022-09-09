import os, subprocess

def add_dir_and_get_data():
    workingDir = "WorkingDirectory"
    execStart = "ExecStart"
    pwd = os.getcwd()

    file = open(pwd + "/collaboration_backend.service", "r")
    lines = file.readlines()
    file.close()

    lines_str = ""
    for line in lines:
        if line.find(workingDir) != -1:
            line = line.strip() + pwd + "\n"
        if line.find(execStart) != -1:
            line = line.strip() + pwd + "/" + "api" + "\n"
        lines_str += line

    return lines_str

def write_data(data):
    file = open("/etc/systemd/system/collaboration_backend.service", "w")
    file.write(data)
    file.close()

def is_service_defined():
    res = subprocess.run(['systemctl', 'is-enabled', 'collaboration_backend.service'], stdout=subprocess.PIPE)
    output = res.stdout.decode('utf-8').strip()
    if output != "enabled":
        return False

    return True
