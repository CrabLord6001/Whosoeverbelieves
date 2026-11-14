"""Strip the C2PA provenance manifest that Claude's output folder embeds in delivered images.

Lossless. It removes container chunks only and never re-encodes, so the pixels and the
ICC profile are untouched. Pillow would re-compress a WebP and lose quality for nothing.

  py claude/strip-c2pa.py images/opt/foo.webp images/opt/bar.jpg

WebP: drops the "C2PA" RIFF chunk and rewrites the RIFF size field.
JPEG: drops APP11 (0xFFEB) segments, which is where the JUMBF manifest is stored.
Prints the before and after byte sizes, since byte size is the only reliable check
that a committed file is the one we meant to write.
"""
import struct
import sys


def strip_webp(data):
    if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        return data
    out = bytearray()
    i = 12
    while i + 8 <= len(data):
        fourcc = data[i:i + 4]
        size = struct.unpack("<I", data[i + 4:i + 8])[0]
        end = i + 8 + size + (size & 1)
        if fourcc != b"C2PA":
            out += data[i:end]
        i = end
    return b"RIFF" + struct.pack("<I", len(out) + 4) + b"WEBP" + bytes(out)


def strip_jpeg(data):
    if data[:2] != b"\xff\xd8":
        return data
    out = bytearray(data[:2])
    i = 2
    while i + 4 <= len(data):
        if data[i] != 0xFF:
            break
        marker = data[i + 1]
        if marker == 0xDA:          # start of scan, image data to the end
            out += data[i:]
            return bytes(out)
        length = struct.unpack(">H", data[i + 2:i + 4])[0]
        if marker != 0xEB:          # keep everything except APP11
            out += data[i:i + 2 + length]
        i += 2 + length
    out += data[i:]
    return bytes(out)


def main(paths):
    for path in paths:
        raw = open(path, "rb").read()
        cleaned = strip_jpeg(raw) if raw[:2] == b"\xff\xd8" else strip_webp(raw)
        if cleaned == raw:
            print(f"{path}: clean already, {len(raw)} bytes")
            continue
        open(path, "wb").write(cleaned)
        print(f"{path}: {len(raw)} -> {len(cleaned)} bytes")


if __name__ == "__main__":
    main(sys.argv[1:])
