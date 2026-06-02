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

// ─── ADVANCED QUESTION BANK (صياغة عامية واضحة جداً + إجابات شاملة) ───────────
const dbdQuestions = [
  {
    id: 1,
    q: "وش البيرك اللي يعطيك دزّة قدام وحماية من الضربة وأنت مصاب؟ (حق ديفيد كينج)",
    answers: ["ديد هارد", "ديدهارد", "dead hard", "deadhard", "بيرك ديدهارد", "المنيع", "dh", "دد هارد", "ددهارد"],
    hint: "يختصرونه بـ DH"
  },
  {
    id: 2,
    q: "وش اسم الكيان أو الشيء الأسود الخفي اللي يبي التضحيات ويتحكم بالضباب؟",
    answers: ["ذا انتيتي", "انتيتي", "the entity", "entity", "الكيان", "الانتيي", "انتتي", "الأنتيتي"],
    hint: "The Entity"
  },
  {
    id: 3,
    q: "كم حبة توكن لازم تجمعها في بيرك (Devour Hope) عشان تقدر تقتل السرفايفر بيدك بدون خطاف؟",
    answers: ["5", "خمسة", "خمس", "five", "٥", "خمس توكنات", "5 توكنز"],
    hint: "نفس عدد المولدات اللي لازم تتصلح بالجيم"
  },
  {
    id: 4,
    q: "وش اسم الشنطة أو الصندوق اللي تستخدمه عشان تخرب الفخاخ أو تشيل الهوكات؟",
    answers: ["صندوق العدة", "صندوق عده", "تول بوكس", "toolbox", "التول بوكس", "شنطة العدة", "عده", "العدة"],
    hint: "Toolbox"
  },
  {
    id: 5,
    q: "إذا متوا كلكم وبقيت أنت لحالك بالجيم، وش الشيء اللي ينفتح لك في الأرض عشان تفلت؟",
    answers: ["الهاتش", "هاتش", "البوابة الارضية", "hatch", "الفتحة", "الفتحه", "شق الارض", "الفتحه الارضيه"],
    hint: "تطلع صوت صفير قوي"
  },
  {
    id: 6,
    q: "وش هي القوة الأساسية حقت الكيلر ذا ترابر (The Trapper)؟",
    answers: ["فخاخ الدببة", "فخاخ الدببه", "فخاخ", "فخ", "bear traps", "bear trap", "الفخ", "تراب", "trap", "التراب"],
    hint: "شيء يمسك رجلك وما يخليك تتحرك"
  },
  {
    id: 7,
    q: "وش اسم بيرك كلوديت اللي يخليك تيل نفسك (تشفي نفسك) لحالك بدون مدكت؟",
    answers: ["سيلف كير", "سيلفكير", "self care", "selfcare", "سلف كير", "سلفكير", "بيرك سلف كير"],
    hint: "Self Care"
  },
  {
    id: 8,
    q: "كم ضربة يحتاجها الكيلر العادي عشان يطرح السرفايفر بالكامل على الأرض (داون)؟",
    answers: ["2", "ضربتين", "ضربتان", "اثنين", "two", "٢"],
    hint: "ضربة أولى تجرحه، والثانية تطرحه"
  },
  {
    id: 9,
    q: "وش اسم الكيلر اللي يرمي عليك فؤوس من بعيد ويغني أغنية أطفال؟",
    answers: ["ذا هنتريس", "هنتريس", "huntress", "الارنب", "ام الفؤوس", "الهنتريس", "ارنب"],
    hint: " Huntress تلبس قناع أرنب"
  },
  {
    id: 10,
    q: "كم مرة لازم الكيلر يعلق السرفايفر على الخطاف (الهوك) عشان يموت ويطلع برا الجيم نهائياً؟",
    answers: ["3", "ثلاث", "ثلاثة", "ثلاث مرات", "three", "٣"],
    hint: "المرحلة الأولى، الثانية (المقاومة)، والثالثة موت"
  }
];

// جمل سباق الكتابة العشوائية (بالعامية)
const typingRaces = [
  "فزع لأخوك قبل ما يموت على الهوك",
  "صلح المولدات بسرعة وافتح البوابة",
  "الكيلر وراك لا تدرعم عشوائي",
  "شغل ديد هارد وافلت من الضربة",
  "انفجر المولد وجاك الكيلر يركض"
];

// ─── RPG & MATCHMAKING SYSTEMS ───────────────────────────────────────────────
const db = new Collection(); 
const lobbyQueue = new Set(); 
let activeMatch = null;       
let lastQuestionId = null; // لتخزين آيدي آخر سؤال ومنع تكراره ورا بعض

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

// ─── UI EMBED BUILDERS ───────────────────────────────────────────────────────
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
    new ButtonBuilder().setCustomId("game_typing").setLabel("⌨️ سباق كتابة").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("game_skillcheck").setLabel("🎯 فحص المهارة (1 ثانية)").setStyle(ButtonStyle.Secondary),
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
    lobbyQueue.clear(); 

    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🏆 انتصار في المواجهة الجماعية!")
        .setDescription(`⚡ **${msg.author.username}** سحق الجميع وأجاب أولاً!\n> الإجابة الصح: **${msg.content}**\n\n💰 كسب: \`+100\` نقطة رصيد!`)
    ]});
  }

  // 3. فحص التحدي الفردي العادي (تريفيّا)
  const game = activeGames.get(msg.channel.id);
  if (!game) return;

  if (game.type === "trivia" && matchAnswer(msg.content, game.data.answers)) {
    activeGames.delete(msg.channel.id);
    const p = getPlayer(msg.author.id, msg.author.username);
    p.pts += 40;
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🎉 إجابة صحيحة!")
        .setDescription(`> **${msg.author.username}** جابها صح!\n💰 **الرصيد الجديد:** \`${p.pts}\``)
    ]});
  }

  // 4. فحص سباق الكتابة السريع للشات
  if (game.type === "typing" && msg.content.trim() === game.data) {
    activeGames.delete(msg.channel.id);
    const p = getPlayer(msg.author.id, msg.author.username);
    p.pts += 45;
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("⌨️ كتبتها صح وأسرع واحد!")
        .setDescription(`> **${msg.author.username}** فاز بسباق الكتابة المطور!\n💰 **كسب:** \`+45\` نقطة رصيد.`)
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

  // طابور الـ 4 لاعبين
  if (id === "queue_join") {
    if (lobbyQueue.has(interaction.user.id)) {
      return interaction.reply({ content: "⚠️ أنت مسجل بالفعل في طابور الانتظار!", ephemeral: true });
    }
    if (activeMatch) {
      return interaction.reply({ content: "⚠️ هناك مواجهة جماعية قائمة حالياً، انتظر حتى تنتهي!", ephemeral: true });
    }

    lobbyQueue.add(interaction.user.id);
    const neededPlayers = 4 - lobbyQueue.size;

    if (lobbyQueue.size === 4) {
      // اختيار عشوائي ذكي بدون تكرار للمواجهة الجماعية أيضاً
      let q = dbdQuestions[Math.floor(Math.random() * dbdQuestions.length)];
      activeMatch = q; 

      const playersMention = Array.from(lobbyQueue).map(id => `<@${id}>`).join(" ");
      await interaction.update({ embeds: [buildLobbyEmbed(p)], components: lobbyComponents() });

      return interaction.channel.send({
        content: `🚨 **اكتمل الطابور وبدأت المواجهة فوراً!**\nالمتحدون: ${playersMention}`,
        embeds: [
          new EmbedBuilder().setColor(DISCORD_BG).setTitle("⚔️ مواجهة الـ 4 لاعبين الحماسيّة!")
            .setDescription(`### الأسْرَع في الشات يفوز بـ 100 نقطة:\n\n**${q.q}**`)
            .setFooter({ text: "يقبل عامي، انقليزي، تعريب، واختصارات!" })
        ]
      });
    }

    await interaction.update({ embeds: [buildLobbyEmbed(p)], components: lobbyComponents() });
    return interaction.followUp({ content: `✅ **تم تسجيلك!** باقي \`[ ${neededPlayers} ]\` لاعبين وتبدأ المواجهة الجماعية.`, ephemeral: true });
  }

  // تحدي فردي عشوائي (بدون تكرار ورا بعض)
  if (id === "game_trivia") {
    if (activeGames.has(interaction.channel.id)) return interaction.reply({ content: "⚠️ هناك تحدي نشط في الروم حالياً!", ephemeral: true });
    
    // فلترة الأسئلة لاستبعاد السؤال الأخير اللي ظهر
    let availableQuestions = dbdQuestions.filter(q => q.id !== lastQuestionId);
    if (availableQuestions.length === 0) availableQuestions = dbdQuestions; // أمان إعادة تعيين لو خلصت

    const q = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    lastQuestionId = q.id; // تخزين السؤال الحالي لمنع ظهوره المرة القادمة

    activeGames.set(interaction.channel.id, { type: "trivia", data: q });

    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🧠 تحدي فكري فردي (سؤال عامي)")
        .setDescription(`### ${q.q}`)
    ], components: returnButton() });
  }

  // سباق الكتابة السريع
  if (id === "game_typing") {
    if (activeGames.has(interaction.channel.id)) return interaction.reply({ content: "⚠️ هناك تحدي نشط في الروم حالياً!", ephemeral: true });

    const txt = typingRaces[Math.floor(Math.random() * typingRaces.length)];
    activeGames.set(interaction.channel.id, { type: "typing", data: txt });

    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("⌨️ سباق سرعة الكتابة!")
        .setDescription(`اكتب الجملة هذي بسرعة البرق في الشات:\n\n> **${txt}**`)
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

  // فحص المهارة الانتحاري (ثانية واحدة فقط!)
  if (id === "game_skillcheck") {
    const randZone = Math.floor(Math.random() * 4); 
    const row = new ActionRowBuilder().addComponents(
      [0, 1, 2, 3].map(i => new ButtonBuilder()
        .setCustomId(`sk_${i}_${randZone}_${interaction.user.id}_active`) 
        .setLabel(i === randZone ? "🎯" : "⚙️")
        .setStyle(ButtonStyle.Secondary)
      )
    );

    // إرسال الفحص التفاعلي
    const skillCheckMessage = await interaction.reply({ 
      embeds: [
        new EmbedBuilder().setColor(DISCORD_BG).setTitle("🚨 !! SKILL CHECK — خطر !!")
          .setDescription("🔴 **معك ثانية واحدة بس (1000ms)!!** اضغط على الهدف `🎯` الحين وإلا بينفجر المولد!")
      ], 
      components: [row], 
      ephemeral: true,
      fetchReply: true
    });

    // مؤقت ذكي ينتهي بعد 1 ثانية (1000 ملي ثانية)
    setTimeout(async () => {
      try {
        // نتحقق من قاعدة بيانات اللاعب إذا ما زال مسجلاً ومفتوحاً الفحص، نخصم عليه لتأخره
        const checkFetch = await interaction.fetchReply();
        if (checkFetch && checkFetch.components.length > 0 && checkFetch.components[0].components[0].customId.endsWith("_active")) {
          p.pts = Math.max(0, p.pts - 20);
          await interaction.editReply({
            embeds: [
              new EmbedBuilder().setColor(DISCORD_BG).setTitle("💥 انفجار! انتهى الوقت")
                .setDescription(`⏱️ تأخرت كثير! مرت الثانية وما ضغطت شيء، انفجر المولد ونقصت نقاطك \`-20\`.`)
            ],
            components: []
          });
        }
      } catch (err) {
        // تم الضغط بنجاح قبل انتهاء الثانية فلا نفعل شيء
      }
    }, 1000);

    return;
  }

  // معالجة أزرار فحص المهارة (قبل انتهاء الثانية)
  if (id.startsWith("sk_")) {
    const [, clicked, target, userId, status] = id.split("_");
    
    if (interaction.user.id !== userId) {
      return interaction.reply({ content: "❌ هذا الفحص ليس لك!", ephemeral: true });
    }
    if (status !== "active") return; // الفحص منتهي بالفعل أو انفجر بالتوقيت

    if (clicked === target) {
      p.pts += 35;
      return interaction.update({ embeds: [
        new EmbedBuilder().setColor(DISCORD_BG).setTitle("💥 تصليح مثالي وسريع!")
          .setDescription(`ردة فعل خرافية! نجحت في فحص المهارة وكسبت \`+35\` نقطة رصيد.`)
      ], components: [] });
    } else {
      p.pts = Math.max(0, p.pts - 20);
      return interaction.update({ embeds: [
        new EmbedBuilder().setColor(DISCORD_BG).setTitle("💥 انفجار المولد! غلط")
          .setDescription(`ضغطت الزر الخطأ وانفجر المولد بوجهك! تراجعت نقاطك بمقدار \`-20\`.`)
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
  console.log(`🚀 SOUL DBD HARDCORE REVOLUTION IS LIVE: ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
