import os
import pkgutil
import importlib

def find_syntax_error(package_name):
    package = importlib.import_module(package_name)
    for loader, module_name, is_pkg in pkgutil.walk_packages(package.__path__, package.__name__ + "."):
        try:
            print(f"Importing {module_name}...")
            importlib.import_module(module_name)
        except SyntaxError as e:
            print(f"!!! SYNTAX ERROR in {module_name} !!!")
            print(f"File: {e.filename}")
            print(f"Line: {e.lineno}")
            print(f"Offset: {e.offset}")
            print(f"Text: {e.text}")
            return
        except Exception as e:
            print(f"Error importing {module_name}: {e}")

if __name__ == "__main__":
    find_syntax_error("app")
