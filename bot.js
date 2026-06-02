const {
  Client, GatewayIntentBits, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// ─── PREMIUM THEME (IMAGE & TRANSPARENT COLOR) ───────────────────────────────
const LOGO = "https://cdn.discordapp.com/attachments/1510327104041127959/1510647569435332658/IMG_0059.jpg";
const DISCORD_BG = 0x2B2D31; // لون ديسكورد السري يجعل القوائم شفافة وتطفو بالكامل

// ─── ADVANCED QUESTION BANK (MULTIPLE SLANG & ENGLISH REGISTER) ──────────────
const dbdQuestions = [
  {
    q: "ما هو البيرك التعليمي (Teachable) لـ ديفيد كينج الذي يعطيك ميزة الاندفاع وحماية ضد الضربات وأنت مصاب؟",
    answers: ["ديد هارد", "ديدهارد", "dead hard", "deadhard", "بيرك ديدهارد", "المنيع", "المنعه", "dh", "ديادهارد"],
    hint: "يختصر بـ DH في مجتمع اللعبة"
  },
  {
    q: "ما اسم الكيان اللانهائي الخفي الذي يتغذى على مشاعر الأمل والخوف ويتحكم في الضباب؟",
    answers: ["ذا انتيتي", "انتيتي", "the entity", "entity", "الكيان", "الانتيي", "انتتي", "الأنتيتي"],
    hint: "يبدأ بـ ال التعريف وينتهي بالياء"
  },
  {
    q: "كم عدد التوكنز (Tokens) الأقصى التي يمكنك جمعها في بيرك Devour Hope لتتمكن من قتل السرفايفرز بيدك؟",
    answers: ["5", "خمسة", "خمس", "five", "٥", "5 توكنز", "خمس توكنات"],
    hint: "نفس عدد المولدات المطلوبة للخروج"
  },
  {
    q: "ما هي الأداة (Item) التي تستخدمها السرفايفرز لتعطيل الخطافات (Hooks) أو تخريب الفخاخ؟",
    answers: ["صندوق العدة", "صندوق عده", "تول بوكس", "toolbox", "التول بوكس", "شنطة العدة", "صندوق الأدوات"],
    hint: "Toolbox"
  },
  {
    q: "عندما يتبقى سرفايفر واحد في الخريطة، ما هو الشيء الذي يفتح تلقائياً في الأرض كفرصة أخيرة للهروب؟",
    answers: ["الهاتش", "هاتش", "البوابة الارضية", "البوابه الارضيه", "hatch", "الفتحة", "الفتحه", "الشق"],
    hint: "فتحة حديدية تصدر صوت صفير قوية"
  }
];

const missingWords = [
  { answers: ["ديسيسيف ستريك", "ديسيسيف", "ds", "decisive strike"], hint: "بيرك طعنة الكيلر الشهير للاستفاقة", display: "د_سـ_ـيـ_ف سـ_ـر_يـ_ـك" },
  { answers: ["بلدبوينتس", "بلد بوينت", "bloodpoints", "bp"],     hint: "العملة المستعملة لتطوير الشجرة الحيوية", display: "بـ_ـد بـ_ـو_يـ_ـنـ_ـتـ_ـس" },
  { answers: ["سيلف كير", "سيلف كير", "self care", "سلف كير"],    hint: "بيرك كلوديت لمعالجة النفس بدون اسعافات", display: "سـ_ـلـ_ـف كـ_ـيـ_ر" }
];

// ─── CORE DATABASE SYSTEM (RPG DATA) ─────────────────────────────────────────
const db = new Collection(); // قاعدة بيانات حفظ اللاعبين المؤقتة (تصفير مع إعادة التشغيل)

function getPlayer(id, username) {
  if (!db.has(id)) {
    db.set(id, { id, name: username, pts: 100, rank: "ناجي مبتدئ 🏃" });
  }
  const player = db.get(id);
  // تحديث الرتبة ديناميكياً حسب النقاط
  if (player.pts >= 1500) player.rank = "مختار الكيان 👁️🔥";
  else if (player.pts >= 800) player.rank = "سيد الضباب 🌫️🏆";
  else if (player.pts >= 400) player.rank = "هارب محترف 🏃⚡";
  else if (player.pts < 50) player.rank = "ضحية سهلة 💀";
  db.set(id, player);
  return player;
}

// ─── STRING CLEANING ENGINE (الذكاء الاصطناعي لتنظيف ومطابقة الكلمات العشوائية) ───
function cleanString(str) {
  if (!str) return "";
  return str.toLowerCase()
    .trim()
    .replace(/[\s_.-]/g, "") // إلغاء المسافات والرموز
    .replace(/[أإآا]/g, "ا") // توحيد الألف
    .replace(/ة/g, "ه")     // توحيد التاء المربوطة
    .replace(/ى/g, "ي")     // توحيد الياء
    .replace(/^ال/, "");    // تجاهل ال التعريف
}

function matchAnswer(userInput, validAnswers) {
  const userClean = cleanString(userInput);
  return validAnswers.some(ans => cleanString(ans) === userClean || userClean.includes(cleanString(ans)));
}

// ─── DYNAMIC EMBEDS ──────────────────────────────────────────────────────────
function buildLobbyEmbed(player) {
  return new EmbedBuilder()
    .setColor(DISCORD_BG)
    .setTitle("🌌  THE FOG SYSTEM — نظام الضباب المطور")
    .setDescription(
      `👤 **اللاعب:** ${player.name}\n` +
      `🏅 **الرتبة الحالية:** \`${player.rank}\` \n` +
      `💰 **الرصيد الحقيقي:** \`${player.pts} نقطة\`\n` +
      "━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "⚠️ **قوانين الضباب:** استخدم الأزرار التفاعلية بالأسفل لبدء المغامرة أو المراهنة برصيدك ضد الكيان!"
    )
    .setImage(LOGO);
}

function lobbyComponents() {
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("game_trivia").setLabel("🧠 التحدي الفكري").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("game_missing").setLabel("🔤 الكلمة الضائعة").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("game_skillcheck").setLabel("🎯 فحص المهارة (Skill Check)").setStyle(ButtonStyle.Primary)
  );
  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("game_roulette").setLabel("🎲 روليت الكيان (تضحية/مخاطرة)").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("game_leaderboard").setLabel("🏆 الأساطير").setStyle(ButtonStyle.Success)
  );
  return [row1, row2];
}

function returnButton() {
  return [new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("go_lobby").setLabel("🏠 العودة للمخيم").setStyle(ButtonStyle.Secondary)
  )];
}

// ─── GAMES ENGINE & TRACKING ──────────────────────────────────────────────────
const activeGames = new Collection(); 

client.on("messageCreate", async msg => {
  if (msg.author.bot) return;

  // التحقق الذكي من التحديات النشطة في الشات
  const game = activeGames.get(msg.channel.id);
  if (!game) return;

  if (game.type === "trivia" && matchAnswer(msg.content, game.data.answers)) {
    activeGames.delete(msg.channel.id);
    const p = getPlayer(msg.author.id, msg.author.username);
    p.pts += 40;
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🎉 إجابة عبقرية تم قبولها!")
        .setDescription(`> **${msg.author.username}** سحق التحدي بسرعة!\n> الإجابة النموذجية: **${game.data.answers[0]}**\n\n💰 **رصيدك الجديد:** \`${p.pts}\` نقطة`)
    ]});
  }

  if (game.type === "missing" && matchAnswer(msg.content, game.data.answers)) {
    activeGames.delete(msg.channel.id);
    const p = getPlayer(msg.author.id, msg.author.username);
    p.pts += 50;
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🔤 تم فك التشفير بنجاح!")
        .setDescription(`> **${msg.author.username}** أكمل الفراغ وعثر على الكلمة المتطابقة: **${game.data.answers[0]}**\n\n💰 **رصيدك الجديد:** \`${p.pts}\` نقطة`)
    ]});
  }

  // أوامر التشغيل المباشرة
  if (msg.content === "!menu" || msg.content === "!play") {
    const p = getPlayer(msg.author.id, msg.author.username);
    return msg.reply({ embeds: [buildLobbyEmbed(p)], components: lobbyComponents() });
  }
});

// ─── INTERACTION HANDLER ─────────────────────────────────────────────────────
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;
  const id = interaction.customId;
  const p = getPlayer(interaction.user.id, interaction.user.username);

  if (id === "go_lobby") {
    return interaction.update({ embeds: [buildLobbyEmbed(p)], components: lobbyComponents() });
  }

  // 1. لعبة الترتيب الفكري (التريفيا المطورة)
  if (id === "game_trivia") {
    if (activeGames.has(interaction.channel.id)) return interaction.reply({ content: "⚠️ الضباب مشغول بتحدي آخر حالياً!", ephemeral: true });
    
    const q = dbdQuestions[Math.floor(Math.random() * dbdQuestions.length)];
    activeGames.set(interaction.channel.id, { type: "trivia", data: q });

    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🧠 التحدي الفكري لـ Dead by Daylight")
        .setDescription(`━━━━━━━━━━━━━━━━━━━━━━\n### ${q.q}\n━━━━━━━━━━━━━━━━━━━━━━`)
        .addFields({ name: "💡 تلميح مساعد", value: `||${q.hint}||` })
        .setFooter({ text: "البوت يستوعب الإجابة بأي لغة أو عامية أو اختصار!" })
    ], components: returnButton() });
  }

  // 2. لعبة الكلمة المفقودة
  if (id === "game_missing") {
    if (activeGames.has(interaction.channel.id)) return interaction.reply({ content: "⚠️ الضباب مشغول بتحدي آخر حالياً!", ephemeral: true });

    const w = missingWords[Math.floor(Math.random() * missingWords.length)];
    activeGames.set(interaction.channel.id, { type: "missing", data: w });

    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🔤 تحدي الحروف الضائعة والتعريب")
        .setDescription(`━━━━━━━━━━━━━━━━━━━━━━\n# ${w.display}\n━━━━━━━━━━━━━━━━━━━━━━\n> **التلميح:** ${w.hint}`)
    ], components: returnButton() });
  }

  // 3. لعبة روليت المخاطرة وكازينو الكيان (The Sacrifice Roulette)
  if (id === "game_roulette") {
    if (p.pts < 30) return interaction.reply({ content: "❌ رصيدك منخفض جداً للمخاطرة (تحتاج 30 نقطة على الأقل)!", ephemeral: true });

    const win = Math.random() > 0.55; // نسبة الفوز 45% لتعطي حماس وتحدي قاسي
    const bet = 30;

    if (win) {
      p.pts += bet * 2;
      return interaction.reply({ embeds: [
        new EmbedBuilder().setColor(DISCORD_BG).setTitle("🎲 روليت الكيان: هروب أسطوري!")
          .setDescription(`🏃 لقد نجحت في تضليل الكيلر والهروب من البوابة في آخر ثانية!\n\n📈 **الأرباح:** \`+${bet * 2}\` نقطة.\n💰 **رصيدك الإجمالي:** \`${p.pts}\``)
      ], components: returnButton() });
    } else {
      p.pts -= bet;
      return interaction.reply({ embeds: [
        new EmbedBuilder().setColor(DISCORD_BG).setTitle("💀 روليت الكيان: تم التضحية بك!")
          .setDescription(`🪝 أمسك بك ذا بلايت وقام بتعليقك على الخطاف مباشرة وتغذى الكيان على طاقة الأمل لديك.\n\n📉 **الخسارة:** \`-${bet}\` نقطة.\n💰 **رصيدك الإجمالي:** \`${p.pts}\``)
      ], components: returnButton() });
    }
  }

  // 4. لعبة فحص المهارة التفاعلية الفورية (Skill Check Challenge)
  if (id === "game_skillcheck") {
    const randZone = Math.floor(Math.random() * 4); // توليد عشوائي لمنطقة الفوز الفوري
    const row = new ActionRowBuilder().addComponents(
      [0, 1, 2, 3].map(i => new ButtonBuilder()
        .setCustomId(`sk_${i}_${randZone}`)
        .setLabel(i === randZone ? "🎯 [SUCCESS]" : "⚙️ [GEN]")
        .setStyle(ButtonStyle.Secondary)
      )
    );

    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🎯 !! SKILL CHECK — فحص المهارة المفاجئ")
        .setDescription("⚡ ظهر مؤشر التصليح فجأة! اضغط على الزر الذي يحتوي على علامة الهدف **🎯** بسرعة فائقة لتجنب انفجار المولد!")
    ], components: [row], ephemeral: true });
  }

  // فحص نتيجة زر الـ Skill Check
  if (id.startsWith("sk_")) {
    const [, clicked, target] = id.split("_");
    if (clicked === target) {
      p.pts += 35;
      return interaction.update({ embeds: [
        new EmbedBuilder().setColor(DISCORD_BG).setTitle("💥 تصليح مثالي (Great Skill Check!)")
          .setDescription(`Great! قمت بضغط المؤشر في الوقت المناسب تماماً وتسارع تصليح المولد.\n\n💰 **الجوائز:** \`+35\` نقطة رصيد.`)
      ], components: [] });
    } else {
      p.pts = Math.max(0, p.pts - 20);
      return interaction.update({ embeds: [
        new EmbedBuilder().setColor(DISCORD_BG).setTitle("💥 انفجار المولد! (Failed Skill Check)")
          .setDescription(`انفجر المولد وأصدر صوتاً مدوياً كشف موقعك للكيلر وتراجعت نسبة التصليح.\n\n📉 **العقوبة:** \`-20\` نقطة من رصيدك.`)
      ], components: [] });
    }
  }

  // 5. قائمة المتصدرين بنظام الرتب الاحترافي الجديد
  if (id === "game_leaderboard") {
    const sorted = [...db.values()].sort((a, b) => b.pts - a.pts).slice(0, 5);
    const medals = ["🥇", "🥈", "🥉", "🏅", "💀"];
    
    const lbDescription = sorted.length 
      ? sorted.map((pl, idx) => `> ${medals[idx] || "•"} **${pl.name}** \n> 🏅 الرتبة: \`${pl.rank}\` | 💰 الرصيد: \`${pl.pts} نقطة\``).join("\n\n")
      : "📭 لا يوجد أي ناجي مسجل في هذا الضباب حالياً.";

    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🏆 لوحة أساطير وسادة الضباب الكلية")
        .setDescription(`━━━━━━━━━━━━━━━━━━━━━━\n${lbDescription}\n━━━━━━━━━━━━━━━━━━━━━━`)
    ], components: returnButton() });
  }
});

client.once("ready", () => {
  console.log(`🚀 PREMIUM BOT REVOLUTION IS LIVE: ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
