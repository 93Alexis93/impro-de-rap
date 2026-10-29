"""Corrections de prononciations fautives dans Lexique 4.00 (29/10/2026).

Certains mots rares de Lexique ont une finale nasale notée comme une voyelle orale :
« gentrification » Z@tRifikasjO au lieu de Z@tRifikasj§, « maintenant » m5tna au lieu
de m5tn@, « tremplins » tR@plE au lieu de tR@pl5. Ces erreurs faussent les rimes.

Règles volontairement étroites : on ne corrige que si l'orthographe finit par une
finale nasale française sans ambiguïté ET que la prononciation finit par la voyelle
orale correspondante. Les mots anglais (fan, bacon, cartoon…) ne sont pas touchés,
car leur prononciation se termine par une consonne (n, ns…).
"""
import re

RULES = [
    # (finale écrite, finale prononcée fautive, finale corrigée)
    (re.compile(r"ions?$"), re.compile(r"j[Oo]$"), "j§"),            # gentrification, quintillion, tendrions
    (re.compile(r"(?<![io])ons?$"), re.compile(r"[Oo]$"), "§"),       # klingon
    (re.compile(r"(ants?|ments?)$"), re.compile(r"[a°]$"), "@"),      # maintenant, complétement, basiquement
    (re.compile(r"(ains?|ins|eint?)$"), re.compile(r"E$"), "5"),      # onzain, tremplins, complains
    (re.compile(r"ance$"), re.compile(r"as$"), "@s"),                 # autocomplaisance
]


def fix_phon(word, phon, syllables=None):
    """Renvoie (phon, syllables, corrigé ?) avec la finale nasale rétablie si besoin."""
    w = (word or "").lower()
    for spell, wrong, right in RULES:
        if spell.search(w) and wrong.search(phon or ""):
            new_phon = wrong.sub(right, phon)
            new_syll = list(syllables or [])
            if new_syll and wrong.search(new_syll[-1]):
                new_syll[-1] = wrong.sub(right, new_syll[-1])
            elif not new_syll:
                new_syll = [new_phon]
            return new_phon, new_syll, True
    return phon, list(syllables or []), False
