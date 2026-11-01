# BilimXazina Telegram Bot

Telegram bot for the **BilimXazina** Uzbek book and study resource platform. Built with Node.js and [Telegraf](https://telegraf.js.org/).

---

## Features

- **`/start`** — Welcomes users in Uzbek, explains what the bot will do
- **`/search`** or **`/qidirish`** — Placeholder search that tells users the book database is launching soon
- **`/help`** — Full help in Uzbek
- **`/admin`** — Admin panel (owners only) with:
  - 📢 Broadcast messages to all users
  - 📊 Bot statistics (user count, messages, searches, uptime)
  - 👥 Admin list
- **Dual owners**: `@norqulov_sohibjon` and `@jonibeksamps` — both have equal admin privileges
- **Feedback / complaints**: `/feedback`, `/shikoyat`, or the menu button forwards messages to both owners

---

## Setup Guide

### Step 1 — Get a Bot Token from BotFather

1. Open Telegram and message **[@BotFather](https://t.me/BotFather)**
2. Send `/newbot`
3. Choose a name (e.g., `BilimXazina`)
4. Choose a username ending in `bot` (e.g., `bilimxazina_bot`)
5. BotFather gives you a **bot token** that looks like:
   ```
   7123456789:AAHx...long-string...
   ```
6. Copy this token — you'll need it next

### Step 2 — Configure the bot

```bash
# Go to the bot folder
cd bot

# Install dependencies
npm install

# Create your .env file from the template
cp .env.example .env
```

Open `.env` in any text editor and paste your token:

```
BOT_TOKEN=7123456789:AAHx-your-actual-token-from-BotFather
```

### Step 3 — Run the bot

```bash
# Start the bot
npm start

# Or run in dev mode (auto-restarts on file changes)
npm run dev
```

You should see:

```
✅ BilimXazina boti ishga tushdi!
   Adminlar: @norqulov_sohibjon, @jonibeksamps
```

Now go to Telegram, find your bot, and send `/start`.

---

## Admin Access (Dual Owners)

Both co-creators have **equal** owner privileges:

| Admin          | Telegram Username         | Role   |
| -------------- | ------------------------- | ------ |
| Sohibjon       | `@norqulov_sohibjon`      | Owner  |
| Jonibek        | `@jonibeksamps`           | Owner  |

### How admin detection works

The bot checks the **Telegram username** of whoever sends `/admin`. If the username matches `norqulov_sohibjon` or `jonibeksamps`, the admin panel opens. Otherwise, the user sees "access denied."

> **Important**: Both admin usernames must have their Telegram username set in their account settings (Settings → Edit Profile → Username). The bot matches by username, not by display name.

### Admin capabilities

Both owners can:
- 📢 **Broadcast** — Send a message to every user who has interacted with the bot
- 📊 **View stats** — See how many users, messages, and searches have occurred
- 👥 **View admin list** — See both co-owners

---

## Co-Hosting & Management (Both Owners Together)

This bot is designed for **two co-creators** to manage together. Here's how:

### Sharing the code

Both of you can edit this project together in Bolt:

1. The project owner opens the **Share** menu (top-right corner)
2. Invites the co-creator by email
3. Sets their role to **Editor** (or **Co-owner** on a Teams plan)
4. The co-creator receives an invite link and can edit the same project in real time

From the Bolt docs: Editors can "prompt and edit code," and Co-owners can additionally "invite users" and "manage the published site."

### Running the bot from two machines

Only **one** instance of the bot should run at a time — a Telegram bot can only have one active connection per token. Choose one of these approaches:

**Option A — One person hosts, both edit the code**

- One person runs the bot on their machine or a server
- Both edit the code in Bolt, then the host pulls changes and restarts

**Option B — Host on a free cloud service (recommended)**

Deploy to a service like [Railway](https://railway.app), [Render](https://render.com), or a VPS:

1. Push the `bot/` folder to a GitHub repo
2. Connect the repo to your hosting service
3. Set the `BOT_TOKEN` as an environment variable in the hosting dashboard
4. Both owners can manage the deployment from the hosting dashboard

**Option C — Switch hosts easily**

Since the bot stores stats in memory (not a database yet), switching hosts is simple — just stop one and start the other. When a database is added later, both can connect to the same database.

### Changing or adding admins

Edit the `ADMINS` array in `bot/index.js`:

```js
const ADMINS = [
  { id: null, username: "norqulov_sohibjon", name: "Sohibjon Norqulov" },
  { username: "jonibeksamps", name: "Jonibek" },
  // Add more here:
  // { id: null, username: "new_admin_username", name: "New Admin" },
];
```

Then restart the bot.

---

## Project Structure

```
bot/
├── index.js          # Bot logic (start, search, admin panel)
├── package.json      # Dependencies and scripts
├── .env.example      # Template for your bot token
├── .env              # Your actual token (not shared, in .gitignore)
├── .gitignore        # Ignores node_modules and .env
└── README.md         # This file
```

---

## Commands Reference

| Command     | Who can use  | Description                        |
| ----------- | ------------ | ---------------------------------- |
| `/start`    | Everyone     | Welcome message                    |
| `/search`   | Everyone     | Search placeholder                 |
| `/qidirish` | Everyone     | Search (Uzbek)                     |
| `/help`     | Everyone     | Help in Uzbek                      |
| `/admin`    | Owners only  | Admin panel                        |
| `/cancel`   | Owners (in broadcast mode) | Cancel broadcast   |

---

## Troubleshooting

**"❌ BOT_TOKEN topilmadi!"**
→ You haven't created the `.env` file or the token is still the placeholder. Run `cp .env.example .env` and paste your real token.

**"409 Conflict"** when starting the bot
→ Another instance of the bot is already running with the same token. Stop the other one first. Only one instance can run per token.

**Admin panel says "access denied"**
→ Make sure your Telegram username is set in your profile and matches exactly (without the `@`). The match is case-insensitive.

---

## What's Next

Once the book database is ready, the `/search` command will query real books, textbooks, and articles. The admin panel will gain tools for adding and managing resources directly from Telegram.

## Feedback and complaints

Users can send feedback in three ways:

- `/feedback`
- `/shikoyat`
- The **💬 Feedback / Shikoyat** button shown after `/start`

The bot asks the user to type a message, suggestion, or complaint. It then sends that message to both owners and replies:

> Xabaringiz qabul qilindi! Rahmat, tez orada ko'rib chiqamiz.

### Owner delivery setup

Telegram bots cannot start a private conversation with a username alone. They need each owner's private chat ID. There are two supported ways to provide them:

1. Add both IDs in `.env`:
   ```
   OWNER_CHAT_IDS=123456789,987654321
   ```
2. Have both owners open the bot and send `/start`. The bot automatically remembers their chat IDs while it is running.

For reliable delivery after restarts, use `OWNER_CHAT_IDS`. To find a Telegram chat ID, an owner can message the bot first and inspect the logged sender ID, or use a trusted Telegram ID lookup bot.

Built with ❤️ by **@norqulov_sohibjon** and **@jonibeksamps**.
