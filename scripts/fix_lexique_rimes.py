"""Applique scripts/phon_fixes.py au fichier data/lexique-rimes.json déjà construit.

Usage : python3 scripts/fix_lexique_rimes.py  (idempotent : relancer ne change plus rien)
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from phon_fixes import fix_phon

PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "lexique-rimes.json")


def keys(syllables):
    return [".".join(syllables[-n:]) for n in (1, 2, 3) if len(syllables) >= n]


def main():
    with open(PATH, encoding="utf-8") as f:
        data = json.load(f)
    fam, changed, changed_words = data["families"], [], []
    for word, entries in data["word_index"].items():
        for e in entries:
            phon, syll, ok = fix_phon(word, e["phon"], e.get("syllables"))
            if not ok:
                continue
            for k in keys(e.get("syllables") or []):
                if word in fam.get(k, []):
                    fam[k].remove(word)
                    if not fam[k]:
                        del fam[k]
            changed_words.append((word, syll))
            changed.append(f"{word}: {e['phon']} → {phon}")
            e["phon"], e["syllables"] = phon, syll
    # Comme le script de construction : une famille garde ses 100 mots les plus fréquents.
    freq = lambda w: max((e.get("frequency", 0) for e in data["word_index"].get(w, [])), default=0)
    for word, syll in changed_words:
        for k in keys(syll):
            if k in fam and word not in fam[k]:
                fam[k] = sorted(fam[k] + [word], key=lambda w: (-freq(w), len(w), w))[:100]
    with open(PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    print(len(changed), "prononciations corrigées")
    for line in changed:
        print(" ", line)


if __name__ == "__main__":
    main()
