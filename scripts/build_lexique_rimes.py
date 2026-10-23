#!/usr/bin/env python3
"""Build a phonological rhyme index from the official Lexique 4.00 TSV."""
import csv, io, json, os, re, urllib.request, zipfile

URL = "https://www.lexique.org/databases/Lexique400/Lexique400.zip"
OUT = "data/lexique-rimes.json"

def clean_word(s):
    return re.sub(r"[^a-zàâäéèêëîïôöùûüÿçœæ'-]", "", (s or "").lower().strip())

def main():
    print("Téléchargement de Lexique 4.00 officiel…", flush=True)
    req = urllib.request.Request(URL, headers={"User-Agent":"impro-de-rap-rhyme-index/1.0"})
    with urllib.request.urlopen(req, timeout=180) as response:
        archive = response.read()
    print(f"Archive reçue : {len(archive):,} octets", flush=True)
    with zipfile.ZipFile(io.BytesIO(archive)) as z:
        candidates = [n for n in z.namelist() if n.lower().endswith((".tsv", ".txt", ".csv"))]
        if not candidates:
            raise RuntimeError("Aucun fichier tabulé trouvé dans l'archive.")
        member = max(candidates, key=lambda n: z.getinfo(n).file_size)
        with z.open(member) as raw:
            text = io.TextIOWrapper(raw, encoding="utf-8-sig", errors="replace")
            reader = csv.DictReader(text, delimiter="\t")
            if not reader.fieldnames:
                raise RuntimeError("En-têtes absents du fichier Lexique.")
            headers = {re.sub(r"[^a-z0-9]", "", h.lower()): h for h in reader.fieldnames}
            def pick(*aliases):
                for alias in aliases:
                    if alias in headers:
                        return headers[alias]
                return None
            word_col = pick("1mot", "ortho", "forme", "word", "orthographe")
            phon_col = pick("2phono", "phon", "phonologie", "transcriptionphonologique")
            syll_col = pick("25syllphono", "syllphono", "syllabesphono")
            freq_col = pick("10freqmot", "freqfilms2", "freqfilms", "frequence", "freq")
            gram_col = pick("5cgram", "cgram", "categoriegrammaticale", "pos")
            if not word_col or not phon_col:
                raise RuntimeError("Colonnes non reconnues : " + repr(reader.fieldnames))
            families, seen, word_index = {}, set(), {}
            count = 0
            for row in reader:
                word = clean_word(row.get(word_col, ""))
                phon = (row.get(phon_col, "") or "").strip()
                syll = (row.get(syll_col, "") or "").strip() if syll_col else ""
                if not word or not phon or len(word) < 2 or any(c.isspace() for c in word):
                    continue
                # Lexique syllable notation separates syllables with dots; exact syllabic
                # endings avoid the false matches caused by arbitrary character suffixes.
                # Lexique 4.00 uses hyphens between syllables and meaningful
                # phonetic symbols such as @, R, O and §. Preserve them exactly.
                syllables = [part.strip() for part in re.split(r"[-‐‑‒–—]", syll) if part.strip()]
                if not syllables:
                    # Fallback when a row has no syllabified transcription.
                    syllables = [phon]
                if not syllables or not syllables[-1]:
                    continue
                ident = (word, phon)
                if ident in seen:
                    continue
                seen.add(ident)
                count += 1
                try:
                    frequency = float((row.get(freq_col, "0") if freq_col else "0").replace(",", "."))
                except (ValueError, AttributeError):
                    frequency = 0.0
                word_index.setdefault(word, []).append({"phon": phon, "syllables": syllables, "frequency": frequency})
                # Index final syllable and the last two/three syllables for richer matches.
                for n in (1, 2, 3):
                    if len(syllables) >= n:
                        key = ".".join(syllables[-n:])
                        families.setdefault(key, []).append([word, frequency])
    compact = {}
    for key, entries in families.items():
        unique = {}
        for e in entries:
            if e[0] not in unique or e[1] > unique[e[0]][1]:
                unique[e[0]] = e
        if len(unique) >= 3:
            compact[key] = [e[0] for e in sorted(unique.values(), key=lambda e: (-e[1], len(e[0]), e[0]))[:100]]
    # Garde-fous : éviter de publier silencieusement un index incomplet ou mal formé.
    required_words = ("amour", "liberté", "nuit", "rêve", "chanson", "oeuvre")
    missing = [word for word in required_words if word not in word_index]
    if missing:
        raise RuntimeError("Validation Lexique échouée, mots attendus absents : " + ", ".join(missing))
    if len(word_index.get("plus", [])) < 2:
        raise RuntimeError("Validation Lexique échouée : les prononciations multiples de « plus » ne sont pas présentes.")
    malformed = [word for word, entries in word_index.items()
                 if not entries or any(not entry.get("phon") or not entry.get("syllables") for entry in entries)]
    if malformed:
        raise RuntimeError(f"Validation Lexique échouée : {len(malformed)} entrées mal formées.")
    print("Validation réussie : mots accentués, graphie oe, prononciations multiples et structure contrôlés.", flush=True)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump({
            "source":"Lexique 4.00 officiel",
            "source_url":"https://www.lexique.org/databases/Lexique400/",
            "license":"CC BY-SA 4.0",
            "generated_rows":count,
            "method":"finales syllabiques exactes (1 à 3 syllabes), triées par fréquence",
            "families":compact,
            "word_index":word_index
        }, f, ensure_ascii=False, separators=(",", ":"))
    print(f"Index créé : {count:,} formes, {len(compact):,} finales, {os.path.getsize(OUT):,} octets", flush=True)

if __name__ == "__main__":
    main()
