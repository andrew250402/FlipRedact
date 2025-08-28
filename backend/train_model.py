import os
import torch
import pandas as pd
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForTokenClassification, TrainingArguments, Trainer

# -------------------------------
# Config
# -------------------------------
MODEL_NAME = "distilbert-base-uncased"
OUTPUT_DIR = "backend/distil_date_model"
BATCH_SIZE = 8
EPOCHS = 10
MAX_LEN = 128
LABEL_LIST = ["O", "B-DATE", "I-DATE"]  # only DATE labels
LABEL2ID = {l:i for i,l in enumerate(LABEL_LIST)}
ID2LABEL = {i:l for i,l in enumerate(LABEL_LIST)}

# -------------------------------
# Load CSV dataset
# -------------------------------
def load_csv_dataset(csv_path):
    df = pd.read_csv(csv_path)
    samples = []
    for _, row in df.iterrows():
        tokens = row["text"].split()
        labels = row["label"].split()
        samples.append({"text": " ".join(tokens), "label": " ".join(labels)})
    return Dataset.from_list(samples)


# -------------------------------
# Encode function
# -------------------------------
def encode_batch(example, tokenizer, label2id, max_length=128):
    encoding = tokenizer(
        example["text"],
        truncation=True,
        padding="max_length",
        max_length=max_length,
        return_offsets_mapping=True,
        is_split_into_words=False
    )

    word_labels = example["label"].split()
    labels = []
    word_idx = 0

    for offset in encoding["offset_mapping"]:
        if offset[0] == offset[1]:
            labels.append(-100)
        else:
            if word_idx < len(word_labels):
                labels.append(label2id.get(word_labels[word_idx], 0))
                word_idx += 1
            else:
                labels.append(-100)

    encoding["labels"] = labels
    del encoding["offset_mapping"]
    return encoding



# -------------------------------
# Training
# -------------------------------

labels = ["O","B-DATE","I-DATE"]  # plus any others you want
label2id = {l:i for i,l in enumerate(labels)}

def train(csv_path):
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, use_fast=True)
    model = AutoModelForTokenClassification.from_pretrained(
        MODEL_NAME,
        num_labels=len(LABEL_LIST),
        id2label=ID2LABEL,
        label2id=LABEL2ID
    )

    dataset = load_csv_dataset(csv_path)
    encoded_dataset = dataset.map(lambda x: encode_batch(x, tokenizer, label2id), batched=False)

    # set torch format
    encoded_dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])

    args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        save_strategy="epoch",
        learning_rate=5e-5,
        per_device_train_batch_size=BATCH_SIZE,
        num_train_epochs=EPOCHS,
        weight_decay=0.01,
        save_total_limit=2,
        logging_dir=f'{OUTPUT_DIR}/logs',
        logging_steps=10,
    )

    trainer = Trainer(
        model=model,
        args=args,
        train_dataset=encoded_dataset,
        tokenizer=tokenizer
    )

    trainer.train()
    model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    print(f"✅ DistilBERT fine-tuned model saved to {OUTPUT_DIR}")

# ----------------------------
# Run
# ----------------------------
if __name__ == "__main__":
    csv_path = os.path.join(os.path.dirname(__file__), "..", "data", "synthetic_dates.csv")
    train(csv_path)
