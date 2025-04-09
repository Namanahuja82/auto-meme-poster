import asyncio
from twikit import Client
from dotenv import load_dotenv
import os

load_dotenv()

USERNAME = os.getenv("USERNAME")
EMAIL = os.getenv("EMAIL")
PASSWORD = os.getenv("PASSWORD")

# Initialize client
client = Client(language='en-US')

async def main():
    try:
        # Try loading cookies
        client.load_cookies("cookies.json")
        print("Loaded cookies from file.")

        user_info = await client.get_current_user()
        print(f"Logged in as: {user_info.username}")

    except Exception as e:
        print("Failed to load cookies or verify session, logging in again.")
        try:
            await client.login(
                auth_info_1=USERNAME,
                auth_info_2=EMAIL,
                password=PASSWORD,
                cookies_file='cookies.json'
            )
            print("Login successful.")

            # Save cookies
            client.save_cookies("cookies.json")
            print("Cookies saved.")
        except Exception as login_err:
            print("Login failed:", login_err)
            return

    # Read the latest meme filename
    try:
        with open("latest-meme.txt", "r") as f:
            filename = f.read().strip()
            filepath = f"memes/{filename}"
            print(f"Uploading meme from: {filepath}")

            media_ids = [await client.upload_media(filepath)]
    except Exception as file_err:
        print("Failed to read or upload meme:", file_err)
        return

    # Tweet it
    try:
        await client.create_tweet(media_ids=media_ids)
        print("Tweet posted successfully.")
    except Exception as tweet_err:
        print("Failed to post tweet:", tweet_err)

asyncio.run(main())
