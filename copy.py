import os
import shutil

# Determine the current working directory (where events.csv is generated)
src_path = os.path.join(os.getcwd(), "events.csv")
print("Source path:", src_path)

# Destination directory – replace with the directory allowed by secure_file_priv
dst_dir = r"C:\ProgramData\MySQL\MySQL Server 9.2\Uploads"
dst_path = os.path.join(dst_dir, "address.csv")
print("Destination path:", dst_path)

try:
    shutil.copy(src_path, dst_path)
    print("File copied successfully to", dst_path)
except Exception as e:
    print("Error copying file:", e)
