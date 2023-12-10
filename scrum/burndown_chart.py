import os
from dotenv import load_dotenv
import requests
from datetime import datetime
import pandas as pd
import matplotlib.pyplot as plt
import argparse

parser = argparse.ArgumentParser(description='Build a Burndown Chart from a Notion Database')
load_dotenv()
PAGE_SIZE = 100


def get_notion_credentials():
    # Github Action Secrets (github) or Locally (.env)
    try:
        if os.environ["NOTION_TOKEN"]:
            notion_token = os.environ["NOTION_TOKEN"]
        else:
            notion_token = os.getenv("NOTION_TOKEN")
        
        if os.environ["DATABASE_ID"]:
            database_id = os.environ["DATABASE_ID"]
        else:
            database_id = os.getenv("DATABASE_ID")
    except KeyError:
        raise ValueError("NOTION_TOKEN or DATABASE_ID not found in environment variables")

    return notion_token, database_id


def get_tasks():
    notion_token, database_id = get_notion_credentials()

    headers = {
        "Authorization": f"Bearer {notion_token}",
        "Notion-Version": "2022-06-28",
    }

    url = f"https://api.notion.com/v1/databases/{database_id}/query"


    payload = {"page_size": PAGE_SIZE}
    response = requests.post(url, headers=headers)

    data = response.json()

    results = data["results"]
    while data["has_more"]:
        payload = {"page_size": PAGE_SIZE, "start_cursor": data["next_cursor"]}
        response = requests.post(url, json=payload, headers=headers)
        data = response.json()
        results.extend(data["results"])

    return results


def create_burndown(tasks, chosen_sprint):
    data = []

    for page in tasks:
        props = page["properties"]
        
        sprint = props.get("Sprint", {}).get("select", {})
        if sprint:
            sprint = sprint.get("name", "").lower()

        if sprint == chosen_sprint.lower():
            status = props.get("Status", {}).get("status", {}).get("name", "").lower()
            if status == "done":
                completion_date = props.get("Completion Date", {}).get("date", {}).get("start", "")
                completion_date = datetime.fromisoformat(completion_date)
                data.append({"Page ID": page["id"], "Date": completion_date})
    
    df = pd.DataFrame(data)
    df["Date"] = df["Date"].dt.date

    all_days_in_sprint = pd.date_range(start=df["Date"].min(), end=df["Date"].max(), freq="D")
    all_days_df = pd.DataFrame({"Date": all_days_in_sprint})
    all_days_df["Date"] = all_days_df["Date"].dt.date

    tasks_done_per_day = df.groupby("Date").size().reset_index(name="T_Done")
    tasks_done_per_day = pd.merge(all_days_df, tasks_done_per_day, on="Date", how="left").fillna(0)
    print(tasks_done_per_day)

    total_tasks = len(tasks)

    tasks_remaining_per_day = pd.DataFrame({
        "Date": all_days_in_sprint,
        "T_Remaining": total_tasks - tasks_done_per_day["T_Done"].cumsum()
    })

    ideal_tasks_per_day = total_tasks / len(all_days_in_sprint)
    tasks_remaining_per_day["Ideal"] = total_tasks - ideal_tasks_per_day * tasks_remaining_per_day.index

    plt.figure(figsize=(10, 6))
    
    plt.plot(tasks_remaining_per_day["Date"], tasks_remaining_per_day["T_Remaining"], label="Remaining Tasks", marker='o')
    plt.plot(tasks_remaining_per_day["Date"], tasks_remaining_per_day["Ideal"], label="Ideal", linestyle='--')
    
    plt.xlabel("Date")
    plt.ylabel("Number of Tasks")
    plt.title("Burndown Chart")
    plt.legend()
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(f"{sprint}/burndown_chart.png")


if __name__ == "__main__":
    parser.add_argument('--sprint_num', required=True, type=int)
    args = parser.parse_args()

    sprint = f"sprint {args.sprint_num}"
    tasks = get_tasks()
    create_burndown(tasks, sprint)