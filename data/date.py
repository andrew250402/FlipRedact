import random
from datetime import datetime, timedelta
import csv

# -----------------------------
# Config
# -----------------------------
NUM_SAMPLES = 100
OUTPUT_CSV = "data/synthetic_dates.csv"

# Common templates with a placeholder {date}
TEMPLATES = [
    "he graduated in {date}",
    "rent due on {date}",
    "policy renewed on {date}",
    "application submitted {date}",
    "her birthday is {date}",
    "contract will expire {date}",
    "passport renewal date {date}",
    "driver license issued {date}",
    "membership started in {date}",
    "lease signed on {date}",
    "product manufactured on {date}",
    "visa valid until {date}",
    "exam scheduled for {date}",
    "holiday starts {date}",
    "software license expires {date}",
    "training session held on {date}",
    "certificate awarded {date}",
    "file last modified {date}",
    "he left the job on {date}",
    "application reviewed {date}",
]

# Date formats to vary
DATE_FORMATS = [
    "%d/%m/%Y",
    "%Y-%m-%d",
    "%d-%m-%Y",
    "%d.%m.%Y",
    "%d %B %Y",
    "%B %Y",
    "%dth of %B %Y",
    "%d %b %Y",
]

# -----------------------------
# Helper functions
# -----------------------------
def random_date(start_year=1990, end_year=2030):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 12, 31)
    delta = end - start
    random_days = random.randint(0, delta.days)
    return start + timedelta(days=random_days)

def format_date(dt):
    fmt = random.choice(DATE_FORMATS)
    return dt.strftime(fmt)

def label_date(text):
    """Create label sequence for the text. Only mark DATE tokens as B/I-DATE."""
    tokens = text.split()
    labels = []
    prev_was_date = False

    for t in tokens:
        if any(c.isdigit() for c in t) or any(month in t.lower() for month in 
                                             ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]):
            if prev_was_date:
                labels.append("I-DATE")
            else:
                labels.append("B-DATE")
                prev_was_date = True
        else:
            labels.append("O")
            prev_was_date = False

    return " ".join(labels)

# -----------------------------
# Generate dataset
# -----------------------------
data = []

for _ in range(NUM_SAMPLES):
    template = random.choice(TEMPLATES)
    dt = random_date()
    date_str = format_date(dt)
    text = template.format(date=date_str)
    label = label_date(text)
    data.append([text, label])

# -----------------------------
# Save to CSV
# -----------------------------
with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["text","label"])
    writer.writerows(data)

print(f"✅ Generated {NUM_SAMPLES} synthetic date sentences at {OUTPUT_CSV}")
