import random, string, sys


def generate_token(length: int) -> str:
    return(''.join(random.choice(string.ascii_letters + string.digits) for _ in range(length)))

if __name__ == "__main__":
    print(generate_token(int(sys.argv[1])))
