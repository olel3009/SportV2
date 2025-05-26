import os

def allowed_file(filename: str, allowed_exts: set) -> bool:
    ext = filename.rsplit('.', 1)[-1].lower()
    return '.' in filename and ext in allowed_exts
