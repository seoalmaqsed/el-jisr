import os
import glob

def try_fix_encoding(filepath, encodings_to_try=['windows-1256', 'windows-1252']):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    best_fixed = None
    
    for enc in encodings_to_try:
        try:
            # Revert the false decoding
            raw_bytes = content.encode(enc, errors='ignore')
            # Now decode properly
            fixed = raw_bytes.decode('utf-8')
            # Check if it looks like Arabic
            if 'رسن' in fixed or 'ال' in fixed or '<html' in fixed:
                best_fixed = fixed
                print(f"Success with {enc} for {filepath}")
                break
        except Exception as e:
            continue
            
    if best_fixed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(best_fixed)
            
for f in glob.glob('*.html'):
    if f not in ['rasan-egypt.html', 'rasan-kuwait.html']:
        try_fix_encoding(f)
