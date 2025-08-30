import random
import csv

# -----------------------------
# Config
# -----------------------------
NUM_SAMPLES = 250
OUTPUT_CSV = "data/synthetic_money.csv"

# Templates with a {money} placeholder
TEMPLATES = [
    "I just spent {money} on food",
    "The item costs {money}",
    "She paid {money} for the ticket",
    "They donated {money} to charity",
    "The subscription fee is {money} per month",
    "This phone was bought for {money}",
    "You owe me {money}",
    "Total balance: {money}",
    "We received {money} in cash",
    "Fine imposed was {money}",
]

# Money formats
MONEY_SYMBOLS = ["$", "USD", "SGD", "S$", "£", "€", "¥"]
MONEY_WORDS = ["dollars", "bucks", "pounds", "euros", "yen", "rupees"]

def random_money():
    """Generate random money string."""
    amount = random.randint(1, 5000)
    fmt_type = random.choice(["symbol", "word", "mixed"])

    if fmt_type == "symbol":
        symbol = random.choice(MONEY_SYMBOLS)
        return f"{symbol}{amount}" if symbol in ["$", "£", "€", "¥", "S$"] else f"{symbol} {amount}"

    elif fmt_type == "word":
        word = random.choice(MONEY_WORDS)
        return f"{amount} {word}"

    else:  # mixed
        return f"${amount} {random.choice(MONEY_WORDS)}"

def label_money(text, money_str):
    """Generate BIO labels for sentence with money entity."""
    tokens = text.split()
    labels = ["O"] * len(tokens)
    money_tokens = money_str.split()

    for i in range(len(tokens)):
        if tokens[i] == money_tokens[0]:
            labels[i] = "B-MONEY"
            for j in range(1, len(money_tokens)):
                if i + j < len(tokens) and tokens[i + j] == money_tokens[j]:
                    labels[i + j] = "I-MONEY"
            break

    return " ".join(labels)

# -----------------------------
# Generate dataset
# -----------------------------
data = []

for _ in range(NUM_SAMPLES):
    template = random.choice(TEMPLATES)
    money_str = random_money()
    text = template.format(money=money_str)
    label = label_money(text, money_str)
    data.append([text, label])

# -----------------------------
# Save to CSV
# -----------------------------
with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["text", "label"])
    writer.writerows(data)

print(f"✅ Generated {NUM_SAMPLES} synthetic MONEY sentences at {OUTPUT_CSV}")
