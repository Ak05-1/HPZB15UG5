import base64

def to_bits(data):
    return ' '.join(format(b, '08b') for b in data)

def to_chars(data):
    return "".join(chr(b) if 32 <= b <= 126 else "." for b in data)

raw_input = input("\nPaste the Final Bits OR Final Chars here: ").strip()

# LOGIC: Check if the input is actually bits (only 0s, 1s, and spaces)
if all(c in "01 " for c in raw_input) and len(raw_input) > 8:
    if " " in raw_input:
        encrypted_bytes = bytearray(int(b, 2) for b in raw_input.split())
    else:
        encrypted_bytes = bytearray(int(raw_input[i:i+8], 2) for i in range(0, len(raw_input), 8))
else:
    # If it's not bits, treat it as characters (Latin-1 preserves the 0-255 byte values)
    encrypted_bytes = bytearray(raw_input.encode('latin1'))

# --- [1] UNDO SECOND SHIFT ---
step1 = bytearray()
for i, val in enumerate(encrypted_bytes):
    shift = 2 if i % 2 == 0 else -9
    step1.append((val + shift) % 256)

print(f"\n[1] UNDO SECOND SHIFT:")
print(f"Bits: {to_bits(step1)}")
print(f"Chars: {to_chars(step1)}")

# --- [2] BASE64 DECODE ---
try:
    # Base64 strings must be multiples of 4. We fix padding if needed.
    # Note: We convert step1 to a string for b64decode
    b64_str = "".join(chr(b) for b in step1)
    missing_padding = len(b64_str) % 4
    if missing_padding:
        b64_str += "=" * (4 - missing_padding)
    
    step2 = base64.b64decode(b64_str)
except Exception as e:
    print(f"\n[!] Base64 Decode Failed: {e}")
    exit()

print(f"\n[2] BASE64 DECODED:")
print(f"Bits: {to_bits(step2)}")
print(f"Chars: {to_chars(step2)}")

# --- [3] REVERSE SWAP ---
step3 = bytearray(step2)
for i in range(0, len(step3) - 1, 2):
    step3[i], step3[i+1] = step3[i+1], step3[i]

print(f"\n[3] POSITIONS SWAPPED BACK:")
print(f"Bits: {to_bits(step3)}")
print(f"Chars: {to_chars(step3)}")

# --- [4] UNDO FIRST SHIFT ---
step4 = bytearray()
for i, val in enumerate(step3):
    shift = -5 if i % 2 == 0 else 3
    step4.append((val + shift) % 256)

print(f"\n[4] UNDO FIRST SHIFT:")
print(f"Bits: {to_bits(step4)}")
print(f"Chars: {to_chars(step4)}")

# --- [5] FINAL BASE85 DECODE ---
try:
    final_text = base64.b85decode(step4).decode('utf-8')
    print(f"\n✅ RECOVERED MESSAGE: {final_text}")
except Exception as e:
    print(f"\n[!] Base85 Decode Failed: {e}")
    print("Likely cause: Using 'Final Chars' instead of 'Final Bits'.")