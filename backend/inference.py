import os
import re
import torch
from transformers import AutoTokenizer, AutoModelForTokenClassification

class PIIModel:
    # -------------------------------
    # Regex patterns
    # -------------------------------
    EMAIL_RE = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")
    URL_RE   = re.compile(r"https?://[^\s]+")
    IPV4_RE  = re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b")
    SG_PHONE_RE = re.compile(r"(?<!\d)(?:\+65[\s-]?)?(?:[3698]\d{3}[\s-]?\d{4})(?!\d)")
    CC_RE    = re.compile(r"(?<!\d)(?:\d[ -]?){13,19}(?!\d)")
    NRIC_RE  = re.compile(r"(?i)\b[STFGM]\d{7}[A-Z]\b")
    PASSPORT_RE = re.compile(r"[eE]\d{7}[A-Za-z]")
    LIC_PLATE_RE = re.compile(r"S[A-HJ-NP-Z][1-9]\d{0,3}[A-EG-HJ-MP-UZ]")
    DATE_RE = re.compile(
        r"(?:"
        r"\d{1,2}[/-]\d{1,2}[/-]\d{2,4}"    
        r"|\d{4}[/-]\d{1,2}[/-]\d{1,2}"       
        r"|\d{1,2}\.\d{1,2}\.\d{4}"         
        r"|\d{1,2}(?:st|nd|rd|th)?\s+of\s+[A-Za-z]+\s+\d{4}"  
        r"|\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4}"
        r"|\d{1,2}\s+[A-Za-z]{3}\s+\d{4}"    
        r"|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}" 
        r")"
    )
    MONEY_RE = re.compile(
        r"(?:USD|SGD|EUR|GBP|AUD|CAD|\$|€|£)\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?"
        r"|\d+(?:,\d{3})*(?:\.\d{2})?\s?(?:dollars?|bucks?|cents?)",
        re.IGNORECASE
    )
    SOCIAL_HANDLE_RE = re.compile(
        r"(?<![A-Za-z0-9])"
        r"@[A-Za-z0-9][A-Za-z0-9_.-]{1,29}"
        r"(?!\.[A-Za-z]{2,})"
    )
    POSTAL_CODE_RE = re.compile(r"\b\d{6}\b")




    # -------------------------------
    # Initialize models
    # -------------------------------
    def __init__(self, distil_model_dir=None):
        # Base BERT NER
        self.tok = AutoTokenizer.from_pretrained("dslim/bert-base-NER", use_fast=True)
        self.ner = AutoModelForTokenClassification.from_pretrained("dslim/bert-base-NER").eval()
        self.id2label = self.ner.config.id2label

        # DistilBERT fine-tuned for custom PII (e.g., DATE)
        if distil_model_dir and os.path.exists(distil_model_dir):
            self.distil_tok = AutoTokenizer.from_pretrained(distil_model_dir)
            self.distil_ner = AutoModelForTokenClassification.from_pretrained(distil_model_dir).eval()
            self.distil_id2label = self.distil_ner.config.id2label
        else:
            self.distil_tok = None
            self.distil_ner = None
            self.distil_id2label = None

    # -------------------------------
    # Regex spans
    # -------------------------------
    def regex_spans(self, text):
        spans = []
        for pat, lab in [(self.EMAIL_RE,"EMAIL"), (self.URL_RE,"URL"),
                         (self.IPV4_RE,"IP"), (self.SG_PHONE_RE,"PHONE"),
                         (self.NRIC_RE,"NATIONAL_ID"), (self.PASSPORT_RE, "PASSPORT"),
                         (self.LIC_PLATE_RE, "LICENSE_PLATE"), (self.DATE_RE, "DATE"),
                         (self.MONEY_RE, "MONEY"), (self.SOCIAL_HANDLE_RE, "HANDLE"),
                         (self.POSTAL_CODE_RE, "POSTAL")]:
            for m in pat.finditer(text):
                spans.append({"start": m.start(), "end": m.end(), "label": lab,
                              "score": 1.0, "word": text[m.start():m.end()]})
        for m in self.CC_RE.finditer(text):
            spans.append({"start": m.start(), "end": m.end(), "label": "CREDIT_CARD",
                          "score": 1.0, "word": m.group()})
        return spans

    # -------------------------------
    # ML spans (base BERT)
    # -------------------------------
    def ml_spans(self, text, threshold=0.8):
        enc = self.tok(text, return_offsets_mapping=True, return_tensors="pt", truncation=True)
        offsets = enc.pop("offset_mapping")[0].tolist()
        with torch.no_grad():
            logits = self.ner(**enc).logits[0]
        probs = torch.softmax(logits, dim=-1)

        spans, cur = [], None
        for i, (st, en) in enumerate(offsets):
            if en == 0: continue
            label_id = int(probs[i].argmax())
            label = self.id2label[label_id]
            score = float(probs[i, label_id])
            if score < threshold or label == "O":
                if cur: spans.append(cur); cur=None
                continue
            pref, ent = (label.split("-") + [""])[:2]
            if pref=="B" or cur is None or (cur and ent!=cur["label"]):
                if cur: spans.append(cur)
                cur={"start": st, "end": en, "label": ent, "score": round(score,4), "word": text[st:en]}
            else:
                cur["end"]=en
                cur["word"]=text[cur["start"]:en]
                cur["score"]=max(cur["score"], round(score,4))
        if cur: spans.append(cur)
        # map some tags to standard PII labels
        for s in spans:
            if s["label"]=="PER": s["label"]="PERSON"
            if s["label"]=="LOC": s["label"]="GPE"
            if s["label"]=="MISC": s["label"]="ORG"
        return spans

    # -------------------------------
    # Distil spans (custom fine-tuned)
    # -------------------------------
    def distil_spans(self, text, threshold=0.7):
        if self.distil_ner is None: return []
        enc = self.distil_tok(text, return_offsets_mapping=True, return_tensors="pt", truncation=True)
        offsets = enc.pop("offset_mapping")[0].tolist()
        with torch.no_grad():
            logits = self.distil_ner(**enc).logits[0]
        probs = torch.softmax(logits, dim=-1)

        spans, cur = [], None
        for i, (st, en) in enumerate(offsets):
            if en == 0: continue
            label_id = int(probs[i].argmax())
            label = self.distil_id2label[label_id]
            score = float(probs[i, label_id])
            if score < threshold or label == "O":
                if cur: spans.append(cur); cur=None
                continue
            pref, ent = (label.split("-") + [""])[:2]
            if pref=="B" or cur is None or (cur and ent!=cur["label"]):
                if cur: spans.append(cur)
                cur={"start": st, "end": en, "label": ent, "score": round(score,4), "word": text[st:en]}
            else:
                cur["end"]=en
                cur["word"]=text[cur["start"]:en]
                cur["score"]=max(cur["score"], round(score,4))
        if cur: spans.append(cur)
        return spans

    # -------------------------------
    # Merge overlapping spans
    # -------------------------------
    def merge_spans(self, spans):
        spans = sorted(spans, key=lambda s: (s["start"], -s["end"]))
        out=[]
        for s in spans:
            if out and s["start"] <= out[-1]["end"]:
                # pick longer or higher score
                if (s["end"]-s["start"] > out[-1]["end"]-out[-1]["start"]) or (s["score"] > out[-1]["score"]):
                    out[-1] = s
            else:
                out.append(s)
        return out

    # -------------------------------
    # Full prediction
    # -------------------------------
    def predict(self, text):
        all_spans = self.regex_spans(text) + self.ml_spans(text) + self.distil_spans(text)
        merged = self.merge_spans(all_spans)

        grouped = {}
        for span in merged:
            key = (span["label"], span["word"])
            start_end = [span["start"], span["end"]]  # convert tuple to list
            score = span["score"]

            if key not in grouped:
                grouped[key] = {
                    "position": [start_end],
                    "label": span["label"],
                    "score": score,
                    "word": span["word"]
                }
            else:
                grouped[key]["position"].append(start_end)
                grouped[key]["score"] = max(grouped[key]["score"], score)

        return list(grouped.values())
