#!/usr/bin/env python3
"""
Add the comment section to every article page.

Run this from the root of the Whosoeverbelieves repository:

    python3 add-comments-to-articles.py            # preview only, changes nothing
    python3 add-comments-to-articles.py --apply    # actually edit the files

It inserts one line before the closing </body> tag of each article:

    <script src="../comments.js"></script>

The relative path is worked out per file, so it also works for pages that are
not inside articles/. Running it twice is safe — files that already have the
line are left alone. To remove the comment section from a page later, just
delete that one line.
"""

import argparse
import os
import re
import sys

ARTICLE_DIRS = ["articles"]          # add more directories here if needed
MARKER = "comments.js"
BODY_CLOSE = re.compile(r"</body\s*>", re.IGNORECASE)


def relative_prefix(path: str, root: str) -> str:
    """How many ../ are needed to get from this file back to the site root."""
    depth = len(os.path.relpath(path, root).split(os.sep)) - 1
    return "../" * depth


def process(path: str, root: str, apply_changes: bool) -> str:
    # newline="" keeps existing line endings exactly as they are. Without it,
    # a file saved with Windows CRLF endings gets rewritten with Unix LF ones,
    # and Git then reports every line in the file as changed.
    with open(path, "r", encoding="utf-8", newline="") as fh:
        html = fh.read()

    if MARKER in html:
        return "skipped (already has it)"

    match = None
    for match in BODY_CLOSE.finditer(html):
        pass                                  # keep the last </body>
    if match is None:
        return "SKIPPED — no </body> tag found"

    eol = "\r\n" if "\r\n" in html else "\n"
    tag = '<script src="%scomments.js"></script>%s' % (relative_prefix(path, root), eol)
    updated = html[:match.start()] + tag + html[match.start():]

    if apply_changes:
        with open(path, "w", encoding="utf-8", newline="") as fh:
            fh.write(updated)
        return "added"
    return "would add"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true",
                        help="write the changes (without this, nothing is modified)")
    parser.add_argument("--root", default=".", help="site root (default: current directory)")
    args = parser.parse_args()

    root = os.path.abspath(args.root)

    targets = []
    for directory in ARTICLE_DIRS:
        full = os.path.join(root, directory)
        if not os.path.isdir(full):
            print("Note: %s/ not found, skipping." % directory)
            continue
        for dirpath, _dirnames, filenames in os.walk(full):
            for name in sorted(filenames):
                if name.lower().endswith((".html", ".htm")):
                    targets.append(os.path.join(dirpath, name))

    if not targets:
        print("No article pages found under: %s" % ", ".join(ARTICLE_DIRS))
        return 1

    print("%s %d page(s)\n" % ("Updating" if args.apply else "Previewing", len(targets)))
    counts = {}
    for path in sorted(targets):
        result = process(path, root, args.apply)
        counts[result] = counts.get(result, 0) + 1
        print("  %-55s %s" % (os.path.relpath(path, root), result))

    print("\nSummary:")
    for result, n in sorted(counts.items()):
        print("  %-28s %d" % (result, n))

    if not args.apply:
        print("\nNothing was changed. Re-run with --apply to write these edits.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
