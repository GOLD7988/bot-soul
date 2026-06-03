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
const DISCORD_BG = 0x2B2D31; // لون ديسكورد الشفاف الفخم لتختفي حدود القائمة

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
  }
];

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
let lastQuestionId = null; 
let matchTimeout = null;

function getPlayer(id, username) {
  if (!db.has(id)) {
    db.set(id, { id, name: username, pts: 100, rank: "ناجي مبتدئ 🏃" });
  }
  return db.get(id);
}

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

// ─── UI EMBED BUILDERS (شفافة بالكامل تعرض الصورة فقط) ───────────────────────
function buildLobbyEmbed() {
  return new EmbedBuilder()
    .setColor(DISCORD_BG)
    .setImage(LOGO); 
}

function lobbyComponents() {
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("game_trivia").setLabel("🧠 تحدي فردي").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("game_typing").setLabel("⌨️ سباق كتابة").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("game_skillcheck").setLabel("🎯 فحص المهارة").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("game_roulette").setLabel("🎲 روليت الكيان").setStyle(ButtonStyle.Secondary)
  );
  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("queue_join").setLabel("📥 دخول طابور المواجهة [4 لاعبين]").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("game_leaderboard").setLabel("🏆 الأساطير").setStyle(ButtonStyle.Secondary)
  );
  return [row1, row2];
}

// أزرار ما بعد انتهاء اللعبة (اللعب مجدداً أو العودة)
function postGameButtons(retryCustomId) {
  return [new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(retryCustomId).setLabel("🔄 العب مرة ثانية").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("go_lobby").setLabel("🏠 العودة للمخيم").setStyle(ButtonStyle.Secondary)
  )];
}

// ─── MESSAGE HANDLER ─────────────────────────────────────────────────────────
const activeGames = new Collection(); 

client.on("messageCreate", async msg => {
  if (msg.author.bot) return;

  const contentClean = msg.content.trim().toLowerCase();

  // تشغيل البوت عبر الأوامر (لعب- أو لعب)
  if (["لعب-", "!لعب", "لعب", "play"].includes(contentClean)) {
    return msg.reply({ 
      content: `**اللاعبين المنتظرين:** \`[${lobbyQueue.size}/4]\``,
      embeds: [buildLobbyEmbed()], 
      components: lobbyComponents() 
    });
  }

  // فحص إجابة المواجهة الجماعية للـ 4 لاعبين
  if (activeMatch && matchAnswer(msg.content, activeMatch.answers)) {
    const winner = getPlayer(msg.author.id, msg.author.username);
    winner.pts += 100; 
    activeMatch = null;
    lobbyQueue.clear(); 
    if (matchTimeout) clearTimeout(matchTimeout);

    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🏆 انتصار في المواجهة الجماعية!")
        .setDescription(`⚡ **${msg.author.username}** سحق الجميع وأجاب أولاً!\n> الإجابة الصح: **${msg.content}**\n\n💰 كسب: \`+100\` نقطة رصيد!`)
    ]});
  }

  // فحص تحدي التريفيّا الفردي
  const game = activeGames.get(msg.channel.id);
  if (!game) return;

  if (game.type === "trivia" && matchAnswer(msg.content, game.data.answers)) {
    activeGames.delete(msg.channel.id);
    const p = getPlayer(msg.author.id, msg.author.username);
    p.pts += 40;
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🎉 إجابة صحيحة!")
        .setDescription(`> **${msg.author.username}** جابها صح!\n💰 **رصيدك الحالي:** \`${p.pts}\``)
    ]});
  }

  // فحص سباق الكتابة
  if (game.type === "typing" && msg.content.trim() === game.data) {
    activeGames.delete(msg.channel.id);
    const p = getPlayer(msg.author.id, msg.author.username);
    p.pts += 45;
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("⌨️ كتبتها صح وأسرع واحد!")
        .setDescription(`> **${msg.author.username}** فاز بسباق الكتابة!\n💰 **كسب:** \`+45\` نقطة رصيد.`)
    ]});
  }
});

// ─── INTERACTION HANDLER (BUTTONS) ───────────────────────────────────────────
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;
  
  const id = interaction.customId;
  const p = getPlayer(interaction.user.id, interaction.user.username);

  if (id === "go_lobby") {
    return interaction.update({ 
      content: `**اللاعبين المنتظرين:** \`[${lobbyQueue.size}/4]\``,
      embeds: [buildLobbyEmbed()], 
      components: lobbyComponents() 
    });
  }

  // طابور الـ 4 لاعبين بالعداد التنازلي التفاعلي المدمج
  if (id === "queue_join") {
    if (lobbyQueue.has(interaction.user.id)) return interaction.reply({ content: "⚠️ أنت مسجل بالفعل في طابور الانتظار!", ephemeral: true });
    if (activeMatch) return interaction.reply({ content: "⚠️ هناك مواجهة جماعية قائمة حالياً، انتظر حتى تنتهي!", ephemeral: true });

    lobbyQueue.add(interaction.user.id);
    const neededPlayers = 4 - lobbyQueue.size;

    if (lobbyQueue.size === 4) {
      let q = dbdQuestions[Math.floor(Math.random() * dbdQuestions.length)];
      activeMatch = q; 

      const playersMention = Array.from(lobbyQueue).map(id => `<@${id}>`).join(" ");
      const endTimestamp = Math.floor((Date.now() + 60000) / 1000);
      const discordCountdown = `<t:${endTimestamp}:R>`; 

      await interaction.update({ 
        content: `**اللاعبين:** \`[4/4]\`\n🚨 **انتهى الانتظار وبدأت المواجهة فوراً!**`,
        embeds: [buildLobbyEmbed()], 
        components: lobbyComponents() 
      });

      matchTimeout = setTimeout(() => {
        if (activeMatch === q) {
          activeMatch = null;
          lobbyQueue.clear();
          interaction.channel.send("⏱️ **انتهت المواجهة الجماعية!** ولم يعرف أحد الحل، تم تصفير الطابور.");
        }
      }, 60000);

      return interaction.channel.send({
        content: `🚨 **انطلقت المواجهة الجماعية الحماسية!**\nالمتحدون: ${playersMention}\nينتهي التحدي: ${discordCountdown} ⏳`,
        embeds: [
          new EmbedBuilder().setColor(DISCORD_BG).setTitle("⚔️ تحدي الـ 4 لاعبين")
            .setDescription(`### الأسْرَع بالشات يقتنص الـ 100 نقطة:\n\n**${q.q}**`)
        ]
      });
    }

    return interaction.update({ 
      content: `**اللاعبين المنتظرين:** \`[${lobbyQueue.size}/4]\`\n⏳ تم تسجيل دخولك بنجاح! باقي [ ${neededPlayers} ] لاعبين...`,
      embeds: [buildLobbyEmbed()], 
      components: lobbyComponents() 
    });
  }

  // تحدي فردي عشوائي
  if (id === "game_trivia") {
    if (activeGames.has(interaction.channel.id)) return interaction.reply({ content: "⚠️ هناك تحدي نشط في الروم حالياً!", ephemeral: true });
    let availableQuestions = dbdQuestions.filter(q => q.id !== lastQuestionId);
    if (availableQuestions.length === 0) availableQuestions = dbdQuestions; 
    const q = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    lastQuestionId = q.id; 

    activeGames.set(interaction.channel.id, { type: "trivia", data: q });

    setTimeout(() => {
      const checkGame = activeGames.get(interaction.channel.id);
      if (checkGame && checkGame.type === "trivia" && checkGame.data.id === q.id) {
        activeGames.delete(interaction.channel.id);
        interaction.channel.send({ embeds: [
          new EmbedBuilder().setColor(DISCORD_BG).setTitle("⏱️ انتهى وقت التحدي!").setDescription(`مرت 30 ثانية وما حد عرف الجواب.\n> الإجابة الصحيحة: **${q.answers[0]}**`)
        ]});
      }
    }, 30000);

    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🧠 تحدي فكري فردي (سؤال عامي)").setDescription(`### ${q.q}`)
    ], components: postGameButtons("game_trivia") });
  }

  // سباق الكتابة السريع
  if (id === "game_typing") {
    if (activeGames.has(interaction.channel.id)) return interaction.reply({ content: "⚠️ هناك تحدي نشط في الروم حالياً!", ephemeral: true });
    const txt = typingRaces[Math.floor(Math.random() * typingRaces.length)];
    activeGames.set(interaction.channel.id, { type: "typing", data: txt });

    setTimeout(() => {
      const checkGame = activeGames.get(interaction.channel.id);
      if (checkGame && checkGame.type === "typing" && checkGame.data === txt) {
        activeGames.delete(interaction.channel.id);
        interaction.channel.send({ embeds: [
          new EmbedBuilder().setColor(DISCORD_BG).setTitle("⏱️ انتهى وقت سباق الكتابة!").setDescription("مرت 30 ثانية وما حد كتب الجملة.")
        ]});
      }
    }, 30000);

    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("⌨️ سباق سرعة الكتابة!").setDescription(`اكتب الجملة هذي بسرعة في الشات:\n\n> **${txt}**`)
    ], components: postGameButtons("game_typing") });
  }

  // روليت الكيان
  if (id === "game_roulette") {
    if (p.pts < 30) return interaction.reply({ content: "❌ رصيدك منخفض جداً للمخاطرة (تحتاج 30 نقطة)!", ephemeral: true });
    const win = Math.random() > 0.55; 
    const bet = 30;

    if (win) {
      p.pts += bet * 2;
      return interaction.reply({ embeds: [
        new EmbedBuilder().setColor(DISCORD_BG).setTitle("🎲 روليت الكيان: هروب!").setDescription(`🏃 نجحت في الهروب وتضليل القاتل!\n📈 **الأرباح:** \`+${bet * 2}\`  •  **الرصيد الحالي:** \`${p.pts}\``)
      ], components: postGameButtons("game_roulette") });
    } else {
      p.pts -= bet;
      return interaction.reply({ embeds: [
        new EmbedBuilder().setColor(DISCORD_BG).setTitle("💀 روليت الكيان: تضحية!").setDescription(`🪝 مسكك الكيلر وعلقك على الهوك!\n📉 **الخسارة:** \`-${bet}\`  •  **الرصيد الحالي:** \`${p.pts}\``)
      ], components: postGameButtons("game_roulette") });
    }
  }

  // فحص المهارة التفاعلي الموزون (ثانية ونصف - 1500ms) بدون أرقام في اسم الزر
  if (id === "game_skillcheck") {
    const checkTypes = [
      { type: "gen", title: "🛠️ !! SKILL CHECK — تصليح مولد", desc: "ظهر مؤشر تصليح المولد فجأة! اضغط على الهدف `🎯`!", winPts: 35, losePts: 20 },
      { type: "heal", title: "🩸 !! SKILL CHECK — تداوي وشفاء", desc: "جالس تهيل صاحبك وجاك فحص مفاجئ! اضغط على `🎯` عشان ما ينزف!", winPts: 40, losePts: 25 },
      { type: "trap", title: "🔒 !! SKILL CHECK — فك فخ ترابر", desc: "قاعد تفك فخ صياد (Bear Trap) وعلقت السنون! اضغط على `🎯` بسرعة تفلت!", winPts: 50, losePts: 35 }
    ];

    const chosenGame = checkTypes[Math.floor(Math.random() * checkTypes.length)];
    const randZone = Math.floor(Math.random() * 4); 
    
    const row = new ActionRowBuilder().addComponents(
      [0, 1, 2, 3].map(i => new ButtonBuilder()
        .setCustomId(`sk_${i}_${randZone}_${interaction.user.id}_${chosenGame.type}_active`) 
        .setLabel(i === randZone ? "🎯" : "⚙️")
        .setStyle(ButtonStyle.Secondary)
      )
    );

    await interaction.reply({ 
      embeds: [
        new EmbedBuilder().setColor(DISCORD_BG).setTitle(chosenGame.title).setDescription(`⚡ **انتبه!**\n\n> ${chosenGame.desc}`)
      ], 
      components: [row], 
      ephemeral: true,
      fetchReply: true
    });

    setTimeout(async () => {
      try {
        const checkFetch = await interaction.fetchReply();
        if (checkFetch && checkFetch.components.length > 0 && checkFetch.components[0].components[0].customId.endsWith("_active")) {
          p.pts = Math.max(0, p.pts - chosenGame.losePts);
          await interaction.editReply({
            embeds: [
              new EmbedBuilder().setColor(DISCORD_BG).setTitle("💥 انفجار! انتهى الوقت").setDescription(`⏱️ مرت الثانية والنصف وفشل الفحص، ونقصت نقاطك \`-${chosenGame.losePts}\`.`)
            ],
            components: postGameButtons("game_skillcheck")
          });
        }
      } catch (err) {}
    }, 1500);
    return;
  }

  // معالجة أزرار فحص المهارة المتعددة (مع أزرار إعادة اللعب)
  if (id.startsWith("sk_")) {
    const [, clicked, target, userId, gameType, status] = id.split("_");
    if (interaction.user.id !== userId) return interaction.reply({ content: "❌ هذا الفحص ليس لك!", ephemeral: true });
    if (status !== "active") return; 

    let winPts = 35, losePts = 20, successMsg = "", failMsg = "";
    if (gameType === "gen") {
      winPts = 35; losePts = 20;
      successMsg = "عمل رائع! كسبت نقاط والتصليح مستمر.";
      failMsg = "انفجر المولد بوجهك وجاك الكيلر يركض!";
    } else if (gameType === "heal") {
      winPts = 40; losePts = 25;
      successMsg = "كفو! هيلت خويك بنجاح وعطيته صحة.";
      failMsg = "صرخ صاحبك بقوة وتراجع شريط الشفاء بسبب النزيف!";
    } else if (gameType === "trap") {
      winPts = 50; losePts = 35;
      successMsg = "أسطورة! فككت الفخ الفولاذي وهربت بذكاء.";
      failMsg = "طبق الفخ على رجلك ومسكك ترابر وتأذيت بشدة.";
    }

    if (clicked === target) {
      p.pts += winPts;
      return interaction.update({ embeds: [
        new EmbedBuilder().setColor(DISCORD_BG).setTitle("💥 نجاح أسطوري وسريع!").setDescription(`${successMsg}\n\n💰 **الجوائز:** \`+${winPts}\` نقطة رصيد.`)
      ], components: postGameButtons("game_skillcheck") });
    } else {
      p.pts = Math.max(0, p.pts - losePts);
      return interaction.update({ embeds: [
        new EmbedBuilder().setColor(DISCORD_BG).setTitle("💥 فشل ذريع!").setDescription(`${failMsg}\n\n📉 **العقوبة:** \`-${losePts}\` من رصيدك.`)
      ], components: postGameButtons("game_skillcheck") });
    }
  }

  // لوحة الصدارة
  if (id === "game_leaderboard") {
    const sorted = [...db.values()].sort((a, b) => b.pts - a.pts).slice(0, 5);
    const lbDescription = sorted.length 
      ? sorted.map((pl, idx) => `> **${idx + 1}. ${pl.name}** — \`${pl.pts} نقطة\``).join("\n")
      : "📭 القائمة فارغة حالياً.";

    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG).setTitle("🏆 لوحة أساطير الضباب").setDescription(lbDescription)
    ], components: returnButton() });
  }
});

client.once("ready", () => {
  console.log(`🚀 SOUL DBD STABLE RUN ENGINE IS ONLINE: ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
