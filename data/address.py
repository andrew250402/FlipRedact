import random
import csv

# -----------------------------
# Config
# -----------------------------
NUM_SAMPLES = 1000
OUTPUT_CSV = "data/synthetic_addresses.csv"

# Context phrases
CONTEXTS = [
    "I live at", "This school is at", "Let's meet at", 
    "The office is located at", "Delivery address:", "Please go to"
]

# Street prefixes (some roads have prefixes like "Mount", "Sector")
PREFIXES = ["Mount", "Sector", "Hill", "Bukit", "Coral", "St"]

# Street base names
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
UNITS = ["#01-102", "#05-14", "#03-06", "#08-04", "#29-01", "1st Storey", "2nd Storey"]

# -----------------------------
# Helper function
# -----------------------------
def random_address():
    context = random.choice(CONTEXTS)
    prefix = random.choice(PREFIXES + [""])
    street = random.choice(STREETS)
    suffix = random.choice(SUFFIXES + [""])
    
    # Add random street number
    street_number = str(random.randint(1, 999)) if random.random() < 0.7 else ""

    # Combine street name
    street_name = " ".join([p for p in [street_number, prefix, street, suffix] if p])

    # Maybe add unit number (position randomized)
    unit = random.choice(UNITS)
    if random.random() < 0.5:
        street_name = f"{unit} {street_name}"
    else:
        street_name = f"{street_name} {unit}"

    # Maybe add Singapore + postal code
    if random.random() < 0.7:
        postal_code = f"Singapore {random.randint(100000, 829999)}"
        if random.random() < 0.5:
            street_name = f"{street_name} {postal_code}"
        else:
            street_name = f"{postal_code} {street_name}"

    # Final text with context
    text = f"{context} {street_name}"
    return text, street_name

def label_address(text, address):
    """Create B/I-ADDRESS labels for the address portion only"""
    tokens = text.split()
    address_tokens = address.split()
    labels = []
    i = 0
    while i < len(tokens):
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
