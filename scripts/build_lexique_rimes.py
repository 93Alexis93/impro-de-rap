#!/usr/bin/env python3
"""Build a compact phonetic rhyme index from the official Lexique 4 TSV."""
import csv, io, json, os, re, sys, urllib.request, zipfile

URL = "https://www.lexique.org/databases/Lexique400/Lexique400.zip"
OUT = "data/lexique-rimes.json"

def norm(s):
    return re.sub(r"[^a-zàâäéèêëîïôöùûüÿçœæ'-]", "", (s or "").lower().strip())

def field(row, names):
    for n in names:
        if n in row and row[n] not in ("", "NA", "NaN"):
            return row[n]
    return ""

def main():
    print("Téléchargement de Lexique 4 officiel…", flush=True)
    req = urllib.request.Request(URL, headers={"User-Agent":"impro-de-rap-rhyme-index/1.0"})
    with urllib.request.urlopen(req, timeout=180) as response:
        archive = response.read()
    print(f"Archive reçue : {len(archive):,} octets", flush=True)
    z = zipfile.ZipFile(io.BytesIO(archive))
    candidates = [n for n in z.namelist() if n.lower().endswith((".tsv", ".txt", ".csv"))]
    if not candidates:
        raise RuntimeError("Aucun fichier tabulé trouvé dans l'archive.")
    member = max(candidates, key=lambda n: z.getinfo(n).file_size)
    raw = z.read(member)
    text = raw.decode("utf-8-sig", errors="replace")
    sample = text[:8192]
    try:
        dialect = csv.Sniffer().sniff(sample, delimiters="\t;,")
    except csv.Error:
        dialect = csv.excel_tab
    reader = csv.DictReader(io.StringIO(text), dialect=dialect)
    if not reader.fieldnames:
        raise RuntimeError("En-têtes absents du fichier Lexique.")
    # Column names vary slightly between releases; identify the core fields by common aliases.
    headers = {re.sub(r"[^a-z0-9]", "", h.lower()): h for h in reader.fieldnames}
    def pick(*aliases):
        for alias in aliases:
            if alias in headers: return headers[alias]
        return None
    ortho = pick("ortho", "forme", "word", "orthographe")
    phon = pick("phon", "phonologie", "phonemic", "transcriptionphonologique")
    freq = pick("freqfilms2", "freqfilms", "frequence", "freq", "freqfilms2")
    gram = pick("cgram", "categoriegrammaticale", "pos")
    if not ortho or not phon:
        raise RuntimeError("Colonnes orthographiques/phonologiques non reconnues. En-têtes : " + repr(reader.fieldnames))
    # A pronunciation's suffixes make rhyme families. Use syllable-aware phoneme strings
    # where possible; include 2–7 final phoneme characters, not spelling endings.
    families = {}
    seen = set()
    count = 0
    for row in reader:
        word = norm(row.get(ortho, ""))
        pron = (row.get(phon, "") or "").strip().lower()
        if not word or not pron or len(word) < 2 or any(ch.isspace() for ch in word):
            continue
        # Lexique phonological transcriptions use spaces or hyphens in some exports.
        pron = re.sub(r"[\s-]+", "", pron)
        if len(pron) < 2: continue
        try: frequency = float((row.get(freq, "0") if freq else "0").replace(",", "."))
        except (ValueError, AttributeError): frequency = 0.0
        # Store orthographic form, pronunciation and frequency; de-duplicate by word+pronunciation.
        ident = (word, pron)
        if ident in seen: continue
        seen.add(ident); count += 1
        for n in range(2, min(8, len(pron) + 1)):
            key = pron[-n:]
            families.setdefault(key, []).append([word, frequency, pron, (row.get(gram, "") if gram else "")])
    # Keep useful rhyme clusters only; rank frequent words first, then lexical forms.
    compact = {}
    for key, entries in families.items():
        unique = {}
        for e in entries:
            if e[0] not in unique or e[1] > unique[e[0]][1]:
                unique[e[0]] = e
        if len(unique) >= 3:
            compact[key] = sorted(unique.values(), key=lambda e: (-e[1], len(e[0]), e[0]))[:80]
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump({"source":"Lexique 4.00 officiel","source_url":"https://www.lexique.org/databases/Lexique400/","license":"CC BY-SA 4.0","generated_rows":count,"families":compact}, f, ensure_ascii=False, separators=(",", ":"))
    print(f"Index créé : {count:,} formes, {len(compact):,} familles, {os.path.getsize(OUT):,} octets", flush=True)

if __name__ == "__main__":
    main()
