import os

def allowed_file(filename: str, allowed_exts: set) -> bool:
    ext = filename.rsplit('.', 1)[-1].lower()
    return '.' in filename and ext in allowed_exts

def to_float_german(x: str) -> float:
    """
    Wandelt deutschen Dezimal-String mit Komma in float um.
    z.B. "1,43" → 1.43
    Leerstring oder None löst ValueError aus.
    """
    if x is None or not x.strip():
        raise ValueError("leer oder None")
    return float(x.replace(",", ".").strip())
