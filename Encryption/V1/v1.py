import base64

def to_bits(data):
    return ' '.join(format(b, '08b') for b in data)

def to_chars(data):
    return "".join(chr(b) if 32 <= b <= 126 else "" for b in data)

input_txt = input("Enter message: ")
print(f"\n[1] ORIGINAL TEXT: {input_txt}")

b85_bytes = base64.b85encode(input_txt.encode('utf-8'))
print(f"\n[2] AFTER BASE85 ENCODING:")
print("Explanation: The text is now represented as Base85 bytes.")
print(f"Bits: {to_bits(b85_bytes)}")
print(f"Chars: {to_chars(b85_bytes)}")

shifted1 = bytearray()
for i, val in enumerate(b85_bytes):
    shift = 5 if i % 2 == 0 else -3
    shifted1.append((val + shift) % 256)
print(f"\n[3] AFTER FIRST SHIFT (+5 for Odd, -3 for Even):")
print("Explanation: We moved the bits 'up' or 'down' on the 8-bit scale.")
print(f"Bits: {to_bits(shifted1)}")
print(f"Chars: {to_chars(shifted1)}")

swapped = bytearray(shifted1)
for i in range(0, len(swapped) - 1, 2):
    swapped[i], swapped[i+1] = swapped[i+1], swapped[i]
print(f"\n[4] AFTER POSITION SWAP:")
print("Explanation: Every two bytes traded places. Odd-numbered ends stay put.")
print(f"Bits: {to_bits(swapped)}")
print(f"Chars: {to_chars(swapped)}")

b64_bytes = base64.b64encode(swapped)
print(f"\n[5] AFTER BASE64 ENCODING:")
print("Explanation: The swapped data is now packed into Base64 bytes.")
print(f"Bits: {to_bits(b64_bytes)}")
print(f"Chars: {to_chars(b64_bytes)}")

final_data = bytearray()
for i, val in enumerate(b64_bytes):
    shift = -2 if i % 2 == 0 else 9
    final_data.append((val + shift) % 256)
print(f"\n[6] FINAL ENCRYPTED OUTPUT (Second Shift -2, +9):")
print("Explanation: The final binary result ready to be sent.")
print(f"Final Bits: {to_bits(final_data)}")
print(f"Final Chars: {to_chars(final_data)}")