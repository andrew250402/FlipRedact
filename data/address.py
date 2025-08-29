import random
import csv

# -----------------------------
# Config
# -----------------------------
NUM_SAMPLES = 400
OUTPUT_CSV = "data/synthetic_addresses.csv"

# Context phrases
CONTEXTS = [
    "I live at", "This school is at", "Let's meet at", 
    "The office is located at", "Delivery address:", "Please go to"
]

# Street prefixes (some roads have prefixes like "Mount", "Sector")
PREFIXES = ["Mount", "Sector", "Hill", "Bukit", "Coral", "St"]

# Street base names (examples from your list)
STREETS = [
    "Hillview", "Gilstead", "Tanglin", "Berwick", "Temasek", "Dempsey", 
    "Bukit Batok East", "Harper", "Chin Bee", "Caldecott", "Ang Mo Kio", 
    "Punggol", "Choa Chu Kang", "Raffles", "Sembawang", "Jurong", "Sentosa"
]

# Street suffixes
SUFFIXES = [
    "Alley", "Ave", "Bank", "Blvd", "Bow", "Business Park", "Central", "Circle", 
    "Circuit", "Circus", "Close", "Concourse", "Connect", "Court", "Cres", "Cross",
    "Crossing", "Dr", "East", "Estate", "E'way", "Farmway", "Field", "Garden", 
    "Gardens", "Gate", "Gateway", "Grande", "Green", "Grove", "Height", "Heights", 
    "Hway", "Industrial Park", "Island", "Junction", "Lane", "Link", "Loop", "Mall",
    "Mt", "North", "Park", "Parkway", "Path", "Pl", "Plain", "Plaza", "Promenade",
    "Quay", "Ridge", "Ring", "Ring Rd", "Rise", "Road", "Sector", "Service Rd",
    "South", "Square", "St", "Terrace", "Track", "Turn", "Underpass", "Vale",
    "Valley", "Viaduct", "View", "Vista", "Walk", "Way", "West", "Wood"
]

# Units / building numbers
UNITS = ["", "#01-102", "#05-14", "#03-06", "#08-04", "#29-01", "1st Storey", "2nd Storey"]

# -----------------------------
# Helper function
# -----------------------------
def random_address():
    context = random.choice(CONTEXTS)
    prefix = random.choice(PREFIXES + [""])
    street = random.choice(STREETS)
    suffix = random.choice(SUFFIXES + [""])
    unit = random.choice(UNITS)

    # Combine address parts
    parts = [prefix, street, suffix, unit]
    # Remove empty strings
    parts = [p for p in parts if p]
    address = " ".join(parts)
    
    # Full text with context
    text = f"{context} {address}"
    return text, address

def label_address(text, address):
    """Create B/I-ADDRESS labels for the address portion only"""
    tokens = text.split()
    address_tokens = address.split()
    labels = []
    i = 0
    while i < len(tokens):
        # check if the token starts the address
        if tokens[i:i+len(address_tokens)] == address_tokens:
            labels.append("B-ADDRESS")
            labels += ["I-ADDRESS"] * (len(address_tokens)-1)
            i += len(address_tokens)
        else:
            labels.append("O")
            i += 1
    return " ".join(labels)

# -----------------------------
# Generate dataset
# -----------------------------
data = []
for _ in range(NUM_SAMPLES):
    text, address = random_address()
    label = label_address(text, address)
    data.append([text, label])

# -----------------------------
# Save to CSV
# -----------------------------
with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["text","label"])
    writer.writerows(data)

print(f"✅ Generated {NUM_SAMPLES} synthetic address samples at {OUTPUT_CSV}")
