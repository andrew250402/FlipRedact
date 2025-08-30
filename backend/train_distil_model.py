import os
import torch
import pandas as pd
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForTokenClassification, TrainingArguments, Trainer

# -------------------------------
# Config
# -------------------------------
MODEL_NAME = "distilbert-base-uncased"
OUTPUT_DIR = "backend/distil_model"
BATCH_SIZE = 10
EPOCHS = 6
MAX_LEN = 128
LABEL_LIST = ["O", "B-DATE", "I-DATE", "B-MONEY", "I-MONEY", "B-BANK", "I-BANK", "B-ADDRESS", "I-ADDRESS"]
LABEL2ID = {l:i for i,l in enumerate(LABEL_LIST)}
ID2LABEL = {i:l for i,l in enumerate(LABEL_LIST)}

# -------------------------------
# Load CSV dataset
# -------------------------------
def load_csv_folder(data_folder):
    all_samples = []
    for file in os.listdir(data_folder):
        if file.endswith(".csv"):
            df = pd.read_csv(os.path.join(data_folder, file))
            for _, row in df.iterrows():
                tokens = row["text"].split()
                labels = row["label"].split()
                all_samples.append({"text": " ".join(tokens), "label": " ".join(labels)})
    return Dataset.from_list(all_samples)


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

def train(dataset):
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, use_fast=True)
    model = AutoModelForTokenClassification.from_pretrained(
        MODEL_NAME,
        num_labels=len(LABEL_LIST),
        id2label=ID2LABEL,
        label2id=LABEL2ID
    )

    encoded_dataset = dataset.map(lambda x: encode_batch(x, tokenizer, LABEL2ID), batched=False)

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
    data_folder = os.path.join(os.path.dirname(__file__), "..", "data")
    dataset = load_csv_folder(data_folder)
    train(dataset)
