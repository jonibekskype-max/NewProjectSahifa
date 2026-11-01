import "dotenv/config";
import { Telegraf, Markup } from "telegraf";
import { message } from "telegraf/filters";

// ─────────────────────────────────────────────
// Owners — both co-creators have equal admin rights
// ─────────────────────────────────────────────
const ADMINS = [
  { username: "norqulov_sohibjon", name: "Sohibjon Norqulov" },
  { username: "jonibeksamps", name: "Jonibek" },
];

// Telegram private messages are delivered by chat ID. Add both IDs to .env
// or let the bot remember them after each owner sends /start.
const configuredOwnerChatIds = (process.env.OWNER_CHAT_IDS || "")
  .split(",")
  .map((id) => Number(id.trim()))
  .filter((id) => Number.isInteger(id) && id !== 0);
const ownerChatIds = new Set(configuredOwnerChatIds);

function isAdmin(user) {
  if (!user) return false;
  const uname = (user.username || "").toLowerCase();
  return ADMINS.some((a) => a.username.toLowerCase() === uname);
}

// ─────────────────────────────────────────────
// Bot stats (in-memory, resets on restart)
// ─────────────────────────────────────────────
const stats = {
  startDate: new Date(),
  totalUsers: new Set(),
  totalMessages: 0,
  totalSearches: 0,
  broadcastsSent: 0,
};

// ─────────────────────────────────────────────
// Broadcast helper — admins send a message to all known users
// ─────────────────────────────────────────────
const broadcastSubscribers = new Set();
const feedbackState = new Set(); // user IDs who are writing feedback
const broadcastState = new Map(); // admin user IDs waiting for broadcast text

function getBot() {
  const token = process.env.BOT_TOKEN;
  if (!token || token.startsWith("123456789")) {
    console.error(
      "\n❌ BOT_TOKEN topilmadi!\n" +
        "   .env faylini yarating: cp .env.example .env\n" +
        "   Va @BotFather'dan olgan token ni kiriting.\n"
    );
    process.exit(1);
  }
  return new Telegraf(token);
}

const bot = getBot();

// Remember owners as soon as they interact with the bot.
bot.use((ctx, next) => {
  if (ctx.from?.id) {
    broadcastSubscribers.add(ctx.from.id);
    stats.totalUsers.add(ctx.from.id);

    const username = (ctx.from.username || "").toLowerCase();
    if (ADMINS.some((admin) => admin.username.toLowerCase() === username)) {
      ownerChatIds.add(ctx.from.id);
    }
  }
  return next();
});

// ─────────────────────────────────────────────
// /start — welcome message in Uzbek
// ─────────────────────────────────────────────
bot.start((ctx) => {
  stats.totalUsers.add(ctx.from.id);
  const name = ctx.from.first_name || "Do'stim";
  const welcome =
    `Assalomu alaykum, ${name}! 👋\n\n` +
    "📚 Sizni *BilimXazina* botida xush kelibsiz!\n\n" +
    "Bu bot orqali tez orada siz:\n" +
    "• Kitoblar, darsliklar va ilmiy maqolalarni qidirish\n" +
    "• O'zbek adabiyoti asarlarini yuklab olish\n" +
    "• Testlar va qo'llanmalardan foydalanish\n" +
    "• O'zingiz ham material qo'shish imkoniyatiga ega bo'lasiz\n\n" +
    "🚀 Hozircha bot test rejimida ishlamoqda. Tez orada to'liq kitoblar bazasi ishga tushadi!\n\n" +
    "Qidirish uchun /search buyrug'ini yuboring yoki istalgan matn yozing.";

  const keyboard = Markup.keyboard([
    ["🔍 Qidirish", "💬 Feedback / Shikoyat"],
    ["ℹ️ Yordam"],
  ]).resize();

  ctx.reply(welcome, { parse_mode: "Markdown", ...keyboard });
});

// ─────────────────────────────────────────────
// /search — placeholder
// ─────────────────────────────────────────────
function searchPlaceholder(ctx) {
  stats.totalSearches++;
  ctx.reply(
    "📚 *Qidiruv funktsiyasi tez orada ishga tushadi!*\n\n" +
      "Hozirda kitoblar bazasi tayyorlanmoqda. Tez orada siz " +
      "kitob, darslik va maqolalarni to'liq qidirib topa olasiz.\n\n" +
      `_Izlangan so'rov: "${ctx.message?.text || "search"}"_`,
    { parse_mode: "Markdown" }
  );
}

bot.command("search", searchPlaceholder);
bot.command("qidirish", searchPlaceholder);

// ─────────────────────────────────────────────
// Feedback / complaint flow
// ─────────────────────────────────────────────
function askForFeedback(ctx) {
  feedbackState.add(ctx.from.id);
  return ctx.reply(
    "💬 Fikringiz, taklifingiz yoki shikoyatingizni yozing.\n\n" +
      "Xabaringiz ikkala loyiha egasiga yuboriladi. Bekor qilish uchun /cancel yuboring."
  );
}

bot.command("feedback", askForFeedback);
bot.command("shikoyat", askForFeedback);

async function sendFeedbackToOwners(ctx, feedbackText) {
  const sender = ctx.from;
  const knownOwner = ADMINS.find(
    (admin) => admin.username.toLowerCase() === (sender.username || "").toLowerCase()
  );
  if (knownOwner) ownerChatIds.add(sender.id);

  const ownerTargets = [...ownerChatIds].filter((id) => id !== sender.id);
  const ownerMessage =
    "💬 Yangi feedback / shikoyat\n\n" +
    `👤 Foydalanuvchi: ${sender.first_name || "Noma'lum"}` +
    (sender.username ? ` (@${sender.username})` : "") +
    `\n🆔 Chat ID: ${sender.id}\n\n` +
    feedbackText;

  if (ownerTargets.length === 0) {
    console.warn("Feedback qabul qilindi, ammo OWNER_CHAT_IDS hali sozlanmagan.");
    return;
  }

  await Promise.all(
    ownerTargets.map((chatId) =>
      bot.telegram.sendMessage(chatId, ownerMessage).catch((error) => {
        console.error(`Feedback yuborilmadi (${chatId}):`, error.message);
      })
    )
  );
}

// ─────────────────────────────────────────────
// Any text message — feedback first, otherwise search placeholder
// ─────────────────────────────────────────────
bot.on(message("text"), async (ctx, next) => {
  stats.totalUsers.add(ctx.from.id);
  stats.totalMessages++;

  const text = ctx.message.text.trim();

  if (broadcastState.get(ctx.from.id) && isAdmin(ctx.from)) {
    if (text === "/cancel") {
      broadcastState.delete(ctx.from.id);
      await ctx.reply("❌ Xabar yuborish bekor qilindi.");
      return;
    }

    broadcastState.delete(ctx.from.id);
    const deliveries = await Promise.all(
      [...broadcastSubscribers]
        .filter((userId) => userId !== ctx.from.id)
        .map((userId) =>
          bot.telegram
            .sendMessage(userId, `📢 *E'lon:*\n\n${text}`, { parse_mode: "Markdown" })
            .then(() => true)
            .catch(() => false)
        )
    );
    stats.broadcastsSent++;
    const sent = deliveries.filter(Boolean).length;
    await ctx.reply(
      `✅ Xabar yuborildi!\n\nYuborilgan: ${sent} ta foydalanuvchiga\n` +
        `(Jami obunachi: ${broadcastSubscribers.size})`
    );
    return;
  }

  if (text === "/feedback" || text === "/shikoyat") {
    await askForFeedback(ctx);
    return;
  }

  if (feedbackState.has(ctx.from.id)) {
    if (text === "/cancel") {
      feedbackState.delete(ctx.from.id);
      await ctx.reply("❌ Feedback yuborish bekor qilindi.");
      return;
    }

    feedbackState.delete(ctx.from.id);
    await sendFeedbackToOwners(ctx, text);
    await ctx.reply("Xabaringiz qabul qilindi! Rahmat, tez orada ko'rib chiqamiz.");
    return;
  }

  if (text === "💬 Feedback / Shikoyat") {
    await askForFeedback(ctx);
    return;
  }

  // Let command handlers such as /admin and /cancel continue below.
  if (text.startsWith("/")) return next();

  searchPlaceholder(ctx);
});

// ─────────────────────────────────────────────
// /admin — admin panel (owners only)
// ─────────────────────────────────────────────
bot.command("admin", async (ctx) => {
  if (!isAdmin(ctx.from)) {
    ctx.reply(
      "⛔ Ushbu buyruq faqat bot administratorlari uchun mo'ljallangan.\n\n" +
        "Adminlar: @norqulov_sohibjon va @jonibeksamps"
    );
    return;
  }

  stats.totalUsers.add(ctx.from.id);
  const adminName = ctx.from.first_name || "Admin";

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("📢 Xabar yuborish (broadcast)", "admin_broadcast"),
      Markup.button.callback("📊 Statistika", "admin_stats"),
    ],
    [
      Markup.button.callback("👥 Adminlar ro'yxati", "admin_list"),
      Markup.button.callback("❌ Yopish", "admin_close"),
    ],
  ]);

  await ctx.reply(
    `🔧 *Admin paneli*\n\n` +
      `Xush kelibsiz, *${adminName}*!\n` +
      `Sizga botni boshqarish uchun to'liq huquq berilgan.\n\n` +
      "Kerakli amalni tanlang:",
    { parse_mode: "Markdown", ...keyboard }
  );
});

// ─── Broadcast flow ───
bot.action("admin_broadcast", (ctx) => {
  if (!isAdmin(ctx.from)) return ctx.answerCbQuery("⛔ Ruxsat yo'q");
  broadcastState.set(ctx.from.id, true);
  ctx.answerCbQuery();
  ctx.reply(
    "📢 *Xabar yuborish*\n\n" +
      "Barcha foydalanuvchilarga yuboriladigan xabar matnini yozing.\n" +
      "Bekor qilish uchun /cancel ni yuboring.",
    { parse_mode: "Markdown" }
  );
});

bot.command("cancel", (ctx) => {
  if (broadcastState.has(ctx.from?.id)) {
    broadcastState.delete(ctx.from.id);
    ctx.reply("❌ Amal bekor qilindi.");
  }
});

// ─── Stats action ───
bot.action("admin_stats", (ctx) => {
  if (!isAdmin(ctx.from)) return ctx.answerCbQuery("⛔ Ruxsat yo'q");
  ctx.answerCbQuery();
  const uptime = Math.floor((Date.now() - stats.startDate.getTime()) / 1000);
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  ctx.reply(
    "📊 *Bot statistikasi*\n\n" +
      `👥 Noyob foydalanuvchilar: ${stats.totalUsers.size}\n` +
      `💬 Joriy sessiya xabarlari: ${stats.totalMessages}\n` +
      `🔍 Qidiruvlar soni: ${stats.totalSearches}\n` +
      `📢 Yuborilgan e'lonlar: ${stats.broadcastsSent}\n` +
      `⏱ Ishlash vaqti: ${days} kun ${hours} soat ${mins} daqiqa\n\n` +
      `_Bot qayta ishga tushganda statistika yangilanadi._`,
    { parse_mode: "Markdown" }
  );
});

// ─── Admin list ───
bot.action("admin_list", (ctx) => {
  if (!isAdmin(ctx.from)) return ctx.answerCbQuery("⛔ Ruxsat yo'q");
  ctx.answerCbQuery();
  ctx.reply(
    "👥 *Bot administratorlari (egalari)*\n\n" +
      "1. @norqulov_sohibjon — Sohibjon Norqulov (Owner)\n" +
      "2. @jonibeksamps — Jonibek (Owner)\n\n" +
      "Ikkalasi ham to'liq admin huquqlariga ega.",
    { parse_mode: "Markdown" }
  );
});

bot.action("admin_close", (ctx) => {
  ctx.answerCbQuery("Yopildi");
  ctx.deleteMessage().catch(() => {});
});

// ─────────────────────────────────────────────
// /help — help in Uzbek
// ─────────────────────────────────────────────
bot.command("help", (ctx) => {
  ctx.reply(
    "ℹ️ *Yordam*\n\n" +
      "Mavjud buyruqlar:\n" +
      "/start — Botni boshlash va salomlashish\n" +
      "/search — Kitob qidirish (tez orada!)\n" +
      "/qidirish — Qidiruv (o'zbekcha)\n" +
      "/help — Ushbu yordam matni\n" +
      "/feedback — Fikr, taklif yoki shikoyat yuborish\n" +
      "/shikoyat — Feedback yuborish (o'zbekcha)\n" +
      "/admin — Admin paneli (faqat adminlar uchun)\n\n" +
      "Kitoblar bazasi tez orada ishga tushadi!",
    { parse_mode: "Markdown" }
  );
});

// ─────────────────────────────────────────────
// Launch
// ─────────────────────────────────────────────
bot.launch().then(() => {
  console.log("✅ BilimXazina boti ishga tushdi!");
  console.log(`   Adminlar: @norqulov_sohibjon, @jonibeksamps`);
  console.log(`   Boshqarish: /admin buyrug'i`);
});

bot.catch((err, ctx) => {
  console.error("Bot xatosi:", err);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
