PYTHON = python3.13
VIRTUAL_ENV = venv

.PHONY = help setup test clean activate

help:
 @echo "Available commands:"
 @echo "  setup    - Set up the virtual environment and install dependencies"
 @echo "  test     - Run tests"
 @echo "  clean    - Remove the virtual environment"
 @echo "  activate - Activate the virtual environment"

setup:
 $(PYTHON) -m venv $(VIRTUAL_ENV)
 $(VIRTUAL_ENV)/bin/pip install --upgrade pip setuptools
 $(VIRTUAL_ENV)/bin/pip install -r requirements.txt

test:
 $(VIRTUAL_ENV)/bin/python -m unittest discover -s tests

clean:
 rm -rf $(VIRTUAL_ENV)

activate:
 @echo "To activate the virtual environment, run:"
 @echo "source $(VIRTUAL_ENV)/bin/activate"

build:
 docker build --platform linux/amd64 -t retail-allocation-bknd .

run-docker:
 docker run -it --name retail-allocation-bknd-local --rm -p 8000:8000 retail-allocation-bknd

stop-docker:
 -@docker stop retail-allocation-bknd-local 2>/dev/null || true
 -@docker rm retail-allocation-bknd-local 2>/dev/null || true
# Usage:
# 1. Run `make setup` to create the virtual environment and install dependencies.
# 2. Run `make test` to execute the tests.
# 3. Run `make clean` to remove the virtual environment.
# 4. Run `make activate` to get instructions on how to activate the virtual environment.
# 5. Use `make help` to see the available commands.
# Note: Ensure you have Python 3.13 installed on your system.
# This Makefile is designed to simplify the setup and management of the Python project environment.
# It assumes that the `requirements.txt` file is present in the same directory as this Makefile.
# The virtual environment will be created in a directory named `venv`.
# The Makefile uses `python3.13` to ensure compatibility with the specified Python version.
# The `test` command runs all tests located in the `tests` directory using Python's unittest framework.
# The `clean` command removes the virtual environment directory, allowing for a fresh setup if needed.
# The `activate` command provides instructions for activating the virtual environment, which is useful
 