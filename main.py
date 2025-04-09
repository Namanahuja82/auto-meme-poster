import asyncio
from twikit import Client
from dotenv import load_dotenv
import os

load_dotenv()  


USERNAME = os.getenv("USERNAME")
EMAIL = os.getenv("EMAIL")
PASSWORD = os.getenv("PASSWORD")


# Initialize client with proper locale
client = Client(language='en-US')


async def main():
    try:
        # First try to load cookies if available
        client.load_cookies("cookies.json")
        print("Loaded cookies from file.")
        
        # Optional: verify login works
        user_info = await client.get_current_user()
        print(f"Logged in as: {user_info.username}")

    except Exception as e:
        print("Failed to load cookies or verify session, logging in again.")
        try:
            # Login fresh
            await client.login(
                auth_info_1=USERNAME,
                auth_info_2=EMAIL,
                password=PASSWORD,
                cookies_file='cookies.json'
            )
            print("Login successful.")
            media_ids = [await client.upload_media('memes/9q08th.jpg')]

            # Save cookies for next time
            client.save_cookies("cookies.json")
            print("Cookies saved.")

        except Exception as login_err:
            print("Login failed:", login_err)
            return  # Stop the script here if login failed

    # Create tweet
    try:
        await client.create_tweet(media_ids=media_ids)
        print("Tweet posted successfully.")
    except Exception as tweet_err:
        print("Failed to post tweet:", tweet_err)


asyncio.run(main())
