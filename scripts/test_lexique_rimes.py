#!/usr/bin/env python3
"""Smoke tests for the generated Lexique rhyme index."""
import json
import sys
from pathlib import Path

INDEX = Path("data/lexique-rimes.json")
EXPECTED_PAIRS = [
    ("amour", "humour"),
    ("maison", "raison"),
    ("bateau", "gâteau"),
    ("musique", "physique"),
    ("liberté", "vérité"),
    ("gentrification", "nation"),  # finale nasale corrigée (Lexique notait « sjO »)
]

def fail(message):
    print(f"ÉCHEC : {message}", file=sys.stderr)
    raise SystemExit(1)

def main():
    if not INDEX.is_file():
        fail(f"index introuvable : {INDEX}")
    with INDEX.open(encoding="utf-8") as stream:
        data = json.load(stream)

    words = data.get("word_index", {})
    families = data.get("families", {})
    if data.get("source") != "Lexique 4.00 officiel":
        fail("source/version Lexique incorrecte")
    if not words or not families:
        fail("index des mots ou familles vide")

    # Check a mix of accents, nasal vowels, and common rhyme endings.
    for word in ("liberté", "vérité", "gâteau", "maison", "musique"):
        if word not in words or not words[word]:
            fail(f"mot absent ou sans prononciation : {word}")
        for entry in words[word]:
            if not isinstance(entry.get("phon"), str) or not entry["phon"]:
                fail(f"transcription phonologique absente : {word}")
            syllables = entry.get("syllables")
            if not isinstance(syllables, list) or not syllables or not all(syllables):
                fail(f"découpage syllabique invalide : {word}")

    checked = 0
    for first, second in EXPECTED_PAIRS:
        a, b = words.get(first, []), words.get(second, [])
        if not a or not b:
            fail(f"paire de test incomplète : {first} / {second}")
        # Use the most frequent pronunciation, matching the current app behaviour.
        a = max(a, key=lambda e: e.get("frequency", 0))
        b = max(b, key=lambda e: e.get("frequency", 0))
        ending_a = a["syllables"][-1]
        ending_b = b["syllables"][-1]
        if ending_a != ending_b:
            fail(f"finales phonologiques différentes : {first} ({ending_a}) / {second} ({ending_b})")
        family_key = ending_a
        group = families.get(family_key, [])
        if first not in group or second not in group:
            fail(f"paire absente de la famille {family_key} : {first} / {second}")
        checked += 1

    print(
        "Tests Lexique OK : "
        f"{len(words):,} mots indexés, {len(families):,} finales, "
        f"{checked} paires phonologiques contrôlées."
    )

if __name__ == "__main__":
    main()
