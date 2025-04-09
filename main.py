import asyncio
from twikit import Client
from dotenv import load_dotenv
import os

load_dotenv()

USERNAME = os.getenv("USERNAME")
EMAIL = os.getenv("EMAIL")
PASSWORD = os.getenv("PASSWORD")

client = Client(language='en-US')

async def main():
    try:
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
            client.save_cookies("cookies.json")
            print("Cookies saved.")

        except Exception as login_err:
            print("Login failed:", login_err)
            return

    # Read generated meme path
    try:
        with open("latest-meme.txt", "r") as f:
            meme_path = f.read().strip()
        print(f"Uploading meme from path: {meme_path}")
        media_ids = [await client.upload_media(meme_path)]
    except Exception as file_err:
        print("Failed to read or upload meme file:", file_err)
        return

    # Create tweet
    try:
        await client.create_tweet(media_ids=media_ids)
        print("Tweet posted successfully.")
    except Exception as tweet_err:
        print("Failed to post tweet:", tweet_err)

asyncio.run(main())
