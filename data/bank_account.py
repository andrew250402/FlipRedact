import random
import csv

# -----------------------------
# Config
# -----------------------------
NUM_SAMPLES = 100
OUTPUT_CSV = "data/synthetic_bank_accounts.csv"

# Bank-specific account digit patterns
BANKS = {
    "DBS": 10,
    "UOB": 10,
    "FEB": 10,
    "POSBank": 9,
    "OCBC": 7,
    "HSBC": random.choice([7,8,9,10,11,12]),  # vary digits
    "Standard Chartered": 10
}

# Templates with {account} placeholder
TEMPLATES = [
    "My bank account is {account}",
    "Transfer the money to {account}",
    "Account number {account} is active",
    "Please verify {account}",
    "Payment should be sent to {account}",
    "The account {account} is closed",
    "Bank account {account} received the funds",
    "Deposit to {account} completed",
    "Funds were transferred from {account}",
    "The recipient's account is {account}",
]

# -----------------------------
# Helper functions
# -----------------------------
def random_bank_account(bank_name):
    digits = BANKS[bank_name]
    # Drop first 3 digits for OCBC/HSBC branch code simulation
    if bank_name in ["OCBC", "HSBC"]:
        branch_code = "".join(random.choices("0123456789", k=3))
        main_digits = "".join(random.choices("0123456789", k=digits))
        account_number = main_digits  # drop branch code
    else:
        account_number = "".join(random.choices("0123456789", k=digits))
    return account_number

def label_account(text, account_str):
    tokens = text.split()
    labels = ["O"] * len(tokens)
    for i in range(len(tokens)):
        if tokens[i] == account_str:
            labels[i] = "B-BANK"
            break
    return " ".join(labels)

# -----------------------------
# Generate dataset
# -----------------------------
data = []

for _ in range(NUM_SAMPLES):
    template = random.choice(TEMPLATES)
    bank = random.choice(list(BANKS.keys()))
    account_str = random_bank_account(bank)
    text = template.format(account=account_str)
    label = label_account(text, account_str)
    data.append([text, label])

# -----------------------------
# Save to CSV
# -----------------------------
with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["text", "label"])
    writer.writerows(data)

print(f"✅ Generated {NUM_SAMPLES} synthetic BANK ACCOUNT sentences at {OUTPUT_CSV}")
