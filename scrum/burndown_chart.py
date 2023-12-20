import os
from dotenv import load_dotenv
import requests
from datetime import datetime
import pandas as pd
import matplotlib.pyplot as plt
import argparse
from collections import defaultdict

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

    sprint_tasks = 0
    sprint_hours = 0
    hours_spent_per_day = defaultdict(int) 

    for page in tasks:
        props = page["properties"]
        
        try:
            task_sprint = props.get("Sprint", {}).get("select", {}).get("name", "").lower()
        
            if task_sprint == chosen_sprint.lower() and props.get("Estimate", {}): 
                task_estimate_hours = float(props.get("Estimate", {}).get("select", {}).get("name", "").lower().split("[")[1].split("]")[0])
                sprint_tasks += 1
                sprint_hours += task_estimate_hours
                status = props.get("Status", {}).get("status", {}).get("name", "").lower()
        
                if status == "done":
                    completion_date = props.get("Completion Date", {}).get("date", {}).get("start", "")
                    completion_date = datetime.fromisoformat(completion_date)

                    hours_spent_per_day[completion_date] += task_estimate_hours

                    data.append({"Page ID": page["id"], "Date": completion_date})
        
        except AttributeError:
            continue

    df = pd.DataFrame(data)
    if df.empty: return
    df["Date"] = df["Date"].dt.date

    all_days_in_sprint = pd.date_range(start=df["Date"].min(), end=df["Date"].max(), freq="D")
    all_days_df = pd.DataFrame({"Date": all_days_in_sprint})
    all_days_df["Date"] = all_days_df["Date"].dt.date

    hours_spent_per_day_df = pd.DataFrame.from_dict(hours_spent_per_day, orient="index", columns=['Hours'])
    hours_spent_per_day_df = hours_spent_per_day_df.reset_index().rename(columns={'index': 'Date'})
    print(hours_spent_per_day_df)

    hours_spent_per_day_df["Date"] = hours_spent_per_day_df["Date"].dt.date
    hours_spent_per_day_df = pd.merge(all_days_df, hours_spent_per_day_df, on="Date", how="left").fillna(0).groupby('Date')['Hours'].sum().reset_index()
    print(hours_spent_per_day_df)

    hours_remaining_per_day = pd.DataFrame({
        "Date": all_days_in_sprint,
        "Hours_Remaining": sprint_hours - hours_spent_per_day_df["Hours"].cumsum()
    })

    ideal_hours_per_day = sprint_hours / len(all_days_in_sprint)
    hours_remaining_per_day["Ideal"] = sprint_hours - ideal_hours_per_day * hours_spent_per_day_df.index

    plt.figure(figsize=(10, 6))
    
    plt.plot(hours_remaining_per_day["Date"], hours_remaining_per_day["Hours_Remaining"], label="Remaining Hours", marker='o')
    plt.plot(hours_remaining_per_day["Date"], hours_remaining_per_day["Ideal"], label="Ideal", linestyle='--')
    
    plt.xlabel("Date")
    plt.ylabel("Number of Hours")
    plt.title(f"Burndown Chart - {chosen_sprint}")
    plt.legend()
    plt.xticks(rotation=45)
    plt.tight_layout()

    cwd = os.path.dirname(os.path.realpath(__file__))
    date = datetime.today().strftime('%Y-%m-%d')    
    plt.savefig(f"{cwd}/{chosen_sprint}/bd-{date}.png")


if __name__ == "__main__":
    parser.add_argument('--sprint_num', required=True, type=int)
    args = parser.parse_args()

    sprint = f"sprint {args.sprint_num}"
    tasks = get_tasks()
    create_burndown(tasks, sprint)
