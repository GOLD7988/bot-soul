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

// ─── CONSTANTS & FLOATING VISUALS ───────────────────────────────────────────
const LOGO = "https://cdn.discordapp.com/attachments/1510327104041127959/1510647569435332658/IMG_0059.jpg";
const DISCORD_BG = 0x2B2D31; // لون ديسكورد الشفاف الفخم

// ─── ADVANCED QUESTION BANK (صياغة عامية + إجابات مرنة جداً) ──────────────────
const dbdQuestions = [
  {
    q: "وش البيرك اللي يعطيك دزّة قدام وحماية من الضربة وأنت مجروح؟",
    answers: ["ديد هارد", "ديدهارد", "dead hard", "deadhard", "بيرك ديدهارد", "المنيع", "dh", "دد هارد", "ددهارد"],
    hint: "بيرك ديفيد كينج المشهور"
  },
  {
    q: "وش اسم الشيء الخفي أو الكيان اللي يبي التضحيات ويتحكم بالضباب؟",
    answers: ["ذا انتيتي", "انتيتي", "the entity", "entity", "الكيان", "الانتيي", "انتتي", "الأنتيتي"],
    hint: "The Entity"
  },
  {
    q: "كم توكن تحتاج تجمع في بيرك ديفاور هوب (Devour Hope) عشان تقدر تقتل السرفايفرز بيدك؟",
    answers: ["5", "خمسة", "خمس", "five", "٥", "خمس توكنات", "5 توكنز"],
    hint: "نفس عدد المولدات الكلية"
  },
  {
    q: "وش الأداة اللي تستخدمها عشان تخرب الفخاخ أو تشيل الخطافات؟",
    answers: ["صندوق العدة", "صندوق عده", "تول بوكس", "toolbox", "التول بوكس", "شنطة العدة", "عده", "العدة"],
    hint: "Toolbox"
  },
  {
    q: "إذا صرت أنت آخر سرفايفر بالجيم، وش الشيء اللي ينفتح لك في الأرض عشان تهرب منه؟",
    answers: ["الهاتش", "هاتش", "البوابة الارضية", "hatch", "الفتحة", "الفتحه", "شق الارض"],
    hint: "صوت صفيرها عالي"
  },
  {
    q: "وش هي القوة الأساسية حقت الكيلر ذا ترابر (The Trapper)؟",
    answers: ["فخاخ الدببة", "فخاخ الدببه", "فخاخ", "فخ", "bear traps", "bear trap", "الفخ", "تراب", "trap", "التراب"],
    hint: "شيء يمسك رجلك بالأرض"
  },
  {
    q: "وش اسم البيرك حق كلوديت اللي يخليك تشفي نفسك بدون ما تحتاج مدكت؟",
    answers: ["سيلف كير", "سيلفكير", "self care", "selfcare", "سلف كير", "سلفكير", "بيرك سلف كير"],
    hint: "Self Care"
  }
];

// ─── RPG & MATCHMAKING SYSTEMS ───────────────────────────────────────────────
const db = new Collection(); 
const lobbyQueue = new Set(); // طابور انتظار الـ 4 لاعبين للمواجهة
let activeMatch = null;       // المواجهة الجماعية النشطة حالياً

function getPlayer(id, username) {
  if (!db.has(id)) {
    db.set(id, { id, name: username, pts: 100, rank: "ناجي مبتدئ 🏃" });
  }
  const player = db.get(id);
  if (player.pts >= 1500) player.rank = "مختار الكيان 👁️🔥";
  else if (player.pts >= 800) player.rank = "سيد الضباب 🌫️🏆";
  else if (player.pts >= 400) player.rank = "هارب محترف 🏃⚡";
  db.set(id, player);
  return player;
}

// ─── STRING CLEANING ENGINE (المعالج الذكي لكل اللهجات واللغات) ───────────────
function cleanString(str) {
  if (!str) return "";
  return str.toLowerCase()
    .trim()
    .replace(/[\s_.-]/g, "") // إلغاء المسافات لتسهيل مطابقة مثل (دد هارد / ددهارد)
    .replace(/[أإآا]/g, "ا") // توحيد الألفات
    .replace(/ة/g, "ه")     // توحيد الهاء والتاء المربوطة
    .replace(/ى/g, "ي")     // توحيد الياء
    .replace(/^ال/, "");    // تجاهل ال التعريف لو كتبها أو نسيها اللاعب
}

function matchAnswer(userInput, validAnswers) {
  const userClean = cleanString(userInput);
  return validAnswers.some(ans => cleanString(ans) === userClean || userClean.includes(cleanString(ans)));
}

// ─── UI EMBED BUILDERS (WIDE & BASIC) ────────────────────────────────────────
function buildLobbyEmbed(player) {
  return new EmbedBuilder()
    .setColor(DISCORD_BG)
    .setTitle("🌌  SOUL DBD SYSTEM")
    .setDescription(
      `**اللاعب:** ${player.name}  •  **الرتبة:** \`${player.rank}\`  •  **الرصيد:** \`${player.pts} نقطة\`\n` +
      `**طابور المواجهة الجماعية:** \`[${lobbyQueue.size}/4]\` لاعبين في الانتظار.`
    )
    .setImage(LOGO);
}

function lobbyComponents() {
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("game_trivia").setLabel("🧠 تحدي فردي").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("game_skillcheck").setLabel("🎯 فحص المهارة").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("game_roulette").setLabel("🎲 روليت الكيان").setStyle(ButtonStyle.Secondary)
  );
  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("queue_join").setLabel("📥 دخول طابور المواجهة [4 لاعبين]").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("game_leaderboard").setLabel("🏆 الأساطير").setStyle(ButtonStyle.Secondary)
  );
  return [row1, row2];
}

function returnButton() {
  return [new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("go_lobby").setLabel("🏠 العودة للمخيم").setStyle(ButtonStyle.Secondary)
  )];
}

// ─── MESSAGE HANDLER ─────────────────────────────────────────────────────────
const activeGames = new Collection(); 

client.on("messageCreate", async msg => {
  if (msg.author.bot) return;

  const contentLower = msg.content.trim().toLowerCase();

  // 1. تشغيل الأوامر الأساسية
  if (contentLower === "!menu" || contentLower === "!play") {
    const p = getPlayer(msg.author.id, msg.author.username);
    return msg.reply({ embeds: [buildLobbyEmbed(p)], components: lobbyComponents() });
  }

  // 2. فحص إجابة المواجهة الجماعية (4 لاعبين)
  if (activeMatch && matchAnswer(msg.content, activeMatch.answers)) {
    const winner = getPlayer(msg.author.id, msg.author.username);
    winner.pts += 100; 
    activeMatch = null;
    lobbyQueue.clear(); // تصفير الطابور تلقائياً بعد الفوز

    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🏆 انتصار في المواجهة الجماعية!")
        .setDescription(`⚡ **${msg.author.username}** سحق الجميع وأجاب أولاً!\n> الإجابة المقبولة: **${msg.content}**\n\n💰 كسب: \`+100\` نقطة رصيد!`)
    ]});
  }

  // 3. فحص التحدي الفردي العادي
  const game = activeGames.get(msg.channel.id);
  if (!game) return;

  if (game.type === "trivia" && matchAnswer(msg.content, game.data.answers)) {
    activeGames.delete(msg.channel.id);
    const p = getPlayer(msg.author.id, msg.author.username);
    p.pts += 40;
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🎉 إجابة صحيحة!")
        .setDescription(`> **${msg.author.username}** أجاب صح!\n💰 **الرصيد الجديد:** \`${p.pts}\``)
    ]});
  }
});

// ─── INTERACTION HANDLER (BUTTONS) ───────────────────────────────────────────
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;
  
  const id = interaction.customId;
  const p = getPlayer(interaction.user.id, interaction.user.username);

  if (id === "go_lobby") {
    return interaction.update({ embeds: [buildLobbyEmbed(p)], components: lobbyComponents() });
  }

  // نظام الطابور المطور مع حساب اللاعبين الباقين بشكل تفاعلي
  if (id === "queue_join") {
    if (lobbyQueue.has(interaction.user.id)) {
      return interaction.reply({ content: "⚠️ أنت مسجل بالفعل في طابور الانتظار!", ephemeral: true });
    }
    if (activeMatch) {
      return interaction.reply({ content: "⚠️ هناك مواجهة جماعية قائمة حالياً، انتظر حتى تنتهي!", ephemeral: true });
    }

    lobbyQueue.add(interaction.user.id);
    const neededPlayers = 4 - lobbyQueue.size;

    // إذا اكتمل العدد إلى 4، تبدأ المواجهة فوراً
    if (lobbyQueue.size === 4) {
      const q = dbdQuestions[Math.floor(Math.random() * dbdQuestions.length)];
      activeMatch = q; 

      const playersMention = Array.from(lobbyQueue).map(id => `<@${id}>`).join(" ");

      // تحديث رسالة اللوبي لتظهر ممتلئة [4/4]
      await interaction.update({ embeds: [buildLobbyEmbed(p)], components: lobbyComponents() });

      return interaction.channel.send({
        content: `🚨 **اكتمل الطابور وبدأت المواجهة فوراً!**\nالمتحدون: ${playersMention}`,
        embeds: [
          new EmbedBuilder().setColor(DISCORD_BG).setTitle("⚔️ مواجهة الـ 4 لاعبين الحماسيّة!")
            .setDescription(`### الأسْرَع في الشات يفوز بـ 100 نقطة:\n\n**${q.q}**`)
            .setFooter({ text: "أول لاعب يكتب الإجابة الصح يطير بالنقاط!" })
        ]
      });
    }

    // إذا لم يكتمل، يعطي العضو رسالة تفاعلية مؤقتة تفيد بالعدد المتبقي، ويحدث اللوبي العام
    await interaction.update({ embeds: [buildLobbyEmbed(p)], components: lobbyComponents() });
    return interaction.followUp({ content: `✅ **تم تسجيل دخولك للطابور بنجاح!** باقي \`[ ${neededPlayers} ]\` لاعبين وتبدأ المواجهة الجماعية تلقائياً.`, ephemeral: true });
  }

  // تحدي فردي
  if (id === "game_trivia") {
    if (activeGames.has(interaction.channel.id)) return interaction.reply({ content: "⚠️ هناك تحدي نشط في الروم حالياً!", ephemeral: true });
    
    const q = dbdQuestions[Math.floor(Math.random() * dbdQuestions.length)];
    activeGames.set(interaction.channel.id, { type: "trivia", data: q });

    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🧠 تحدي فكري فردي")
        .setDescription(`### ${q.q}`)
    ], components: returnButton() });
  }

  // روليت الكيان
  if (id === "game_roulette") {
    if (p.pts < 30) return interaction.reply({ content: "❌ رصيدك منخفض جداً للمخاطرة (تحتاج 30 نقطة)!", ephemeral: true });

    const win = Math.random() > 0.55; 
    const bet = 30;

    if (win) {
      p.pts += bet * 2;
      return interaction.reply({ embeds: [
        new EmbedBuilder().setColor(DISCORD_BG).setTitle("🎲 روليت الكيان: هروب!")
          .setDescription(`🏃 نجحت في الهروب!\n📈 **الأرباح:** \`+${bet * 2}\`  •  **الرصيد:** \`${p.pts}\``)
      ], components: returnButton() });
    } else {
      p.pts -= bet;
      return interaction.reply({ embeds: [
        new EmbedBuilder().setColor(DISCORD_BG).setTitle("💀 روليت الكيان: تضحية!")
          .setDescription(`🪝 تم تعليقك على الخطاف.\n📉 **الخسارة:** \`-${bet}\`  •  **الرصيد:** \`${p.pts}\``)
      ], components: returnButton() });
    }
  }

  // فحص المهارة
  if (id === "game_skillcheck") {
    const randZone = Math.floor(Math.random() * 4); 
    const row = new ActionRowBuilder().addComponents(
      [0, 1, 2, 3].map(i => new ButtonBuilder()
        .setCustomId(`sk_${i}_${randZone}_${interaction.user.id}`) 
        .setLabel(i === randZone ? "🎯" : "⚙️")
        .setStyle(ButtonStyle.Secondary)
      )
    );

    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🎯 !! SKILL CHECK")
        .setDescription("اضغط على الزر الذي يحتوي على الهدف **🎯** بسرعة!")
    ], components: [row], ephemeral: true });
  }

  // معالجة أزرار فحص المهارة
  if (id.startsWith("sk_")) {
    const [, clicked, target, userId] = id.split("_");
    
    if (interaction.user.id !== userId) {
      return interaction.reply({ content: "❌ هذا الفحص ليس لك!", ephemeral: true });
    }

    if (clicked === target) {
      p.pts += 35;
      return interaction.update({ embeds: [
        new EmbedBuilder().setColor(DISCORD_BG).setTitle("💥 تصليح مثالي!")
          .setDescription(`عمل رائع! كسبت \`+35\` نقطة رصيد.`)
      ], components: [] });
    } else {
      p.pts = Math.max(0, p.pts - 20);
      return interaction.update({ embeds: [
        new EmbedBuilder().setColor(DISCORD_BG).setTitle("💥 انفجار المولد!")
          .setDescription(`أخطأت التوقيت وتراجعت نقاطك بمقدار \`-20\`.`)
      ], components: [] });
    }
  }

  // لوحة الصدارة
  if (id === "game_leaderboard") {
    const sorted = [...db.values()].sort((a, b) => b.pts - a.pts).slice(0, 5);
    const lbDescription = sorted.length 
      ? sorted.map((pl, idx) => `> **${idx + 1}. ${pl.name}** — \`${pl.pts} نقطة\` (${pl.rank})`).join("\n")
      : "📭 القائمة فارغة حالياً.";

    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🏆 لوحة أساطير الضباب")
        .setDescription(lbDescription)
    ], components: returnButton() });
  }
});

client.once("ready", () => {
  console.log(`🚀 SOUL DBD COUNTDOWN EDITION IS LIVE: ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
