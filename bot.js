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

// ─── ADVANCED QUESTION BANK ──────────────────────────────────────────────────
const dbdQuestions = [
  {
    q: "ما هو البيرك الذي يعطيك ميزة الاندفاع وحماية ضد الضربات وأنت مصاب؟",
    answers: ["ديد هارد", "ديدهارد", "dead hard", "deadhard", "بيرك ديدهارد", "المنيع", "dh"],
    hint: "يختصر بـ DH"
  },
  {
    q: "ما اسم الكيان الخفي الذي يتغذى على مشاعر الأمل ويتحكم في الضباب؟",
    answers: ["ذا انتيتي", "انتيتي", "the entity", "entity", "الكيان", "الانتيي"],
    hint: "The Entity"
  },
  {
    q: "كم عدد التوكنز الأقصى التي يمكنك جمعها في بيرك Devour Hope لتتمكن من قتل السرفايفرز بيدك؟",
    answers: ["5", "خمسة", "خمس", "five", "٥"],
    hint: "رقم بين 4 و6"
  },
  {
    q: "ما هي الأداة التي تستخدمها السرفايفرز لتعطيل الخطافات أو تخريب الفخاخ؟",
    answers: ["صندوق العدة", "صندوق عده", "تول بوكس", "toolbox", "التول بوكس"],
    hint: "Toolbox"
  },
  {
    q: "عندما يتبقى سرفايفر واحد في الخريطة، ما هو الشيء الذي يفتح تلقائياً في الأرض للهروب؟",
    answers: ["الهاتش", "هاتش", "البوابة الارضية", "hatch", "الفتحة"],
    hint: "Hatch"
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

// ─── STRING CLEANING ENGINE ──────────────────────────────────────────────────
function cleanString(str) {
  if (!str) return "";
  return str.toLowerCase()
    .trim()
    .replace(/[\s_.-]/g, "") 
    .replace(/[أإآا]/g, "ا") 
    .replace(/ة/g, "ه")     
    .replace(/ى/g, "ي")     
    .replace(/^ال/, "");    
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
      `**طابور المواجهة الحالية:** \`[${lobbyQueue.size}/4]\` لاعبين في الانتظار.`
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
    winner.pts += 100; // جائزة ضخمة للمواجهة الجماعية
    activeMatch = null;
    lobbyQueue.clear(); // تصفير الطابور للجيم القادم

    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🏆 انتصار في المواجهة الجماعية!")
        .setDescription(`⚡ **${msg.author.username}** سحق الجميع وأجاب أولاً وبشكل صحيح!\n> الإجابة: **${msg.content}**\n\n💰 كسب: \`+100\` نقطة رصيد!`)
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

  // نظام الطابور والمواجهة الجماعية (4 لاعبين)
  if (id === "queue_join") {
    if (lobbyQueue.has(interaction.user.id)) {
      return interaction.reply({ content: "⚠️ أنت مسجل بالفعل في طابور الانتظار!", ephemeral: true });
    }
    if (activeMatch) {
      return interaction.reply({ content: "⚠️ هناك مواجهة جماعية قائمة حالياً في السيرفر، انتظر حتى تنتهي!", ephemeral: true });
    }

    lobbyQueue.add(interaction.user.id);

    // تحديث الرسالة الأصلية لتعكس العدد الجديد في الطابور
    await interaction.update({ embeds: [buildLobbyEmbed(p)], components: lobbyComponents() });

    // إذا اكتمل العدد إلى 4، تبدأ المواجهة فوراً
    if (lobbyQueue.size === 4) {
      const q = dbdQuestions[Math.floor(Math.random() * dbdQuestions.length)];
      activeMatch = q; // تفعيل المواجهة الجماعية

      const playersMention = Array.from(lobbyQueue).map(id => `<@${id}>`).join(" ");

      return interaction.channel.send({
        content: `🚨 **اكتمل الطابور وبدأت المواجهة!**\nالمتحدون: ${playersMention}`,
        embeds: [
          new EmbedBuilder().setColor(DISCORD_BG).setTitle("⚔️ مواجهة الـ 4 لاعبين الحماسيّة!")
            .setDescription(`### الأسْرَع في الشات يفوز بـ 100 نقطة:\n\n**${q.q}**`)
            .setFooter({ text: "أول لاعب يكتب الإجابة الصحيحة يقتنص الفوز!" })
        ]
      });
    }
    return;
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

  // حل مشاكل وتشغيل فحص المهارة (Skill Check Fix)
  if (id === "game_skillcheck") {
    const randZone = Math.floor(Math.random() * 4); 
    const row = new ActionRowBuilder().addComponents(
      [0, 1, 2, 3].map(i => new ButtonBuilder()
        .setCustomId(`sk_${i}_${randZone}_${interaction.user.id}`) // إضافة الـ User ID لمنع التداخل والأخطاء
        .setLabel(i === randZone ? "🎯" : "⚙️")
        .setStyle(ButtonStyle.Secondary)
      )
    );

    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🎯 !! SKILL CHECK")
        .setDescription("اضغط على الزر الذي يحتوي على الهدف **🎯** بسرعة!")
    ], components: [row], ephemeral: true });
  }

  // فحص وإصلاح ردود الـ Skill Check الفورية
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

  // لوحة الصدارة الرشيقة
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
  console.log(`🚀 SOUL DBD PRO IS RUNNING: ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
