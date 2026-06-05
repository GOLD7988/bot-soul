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

// ─── ADVANCED QUESTION BANK ──────────────────────────────────────────────────
const dbdQuestions = [
  { id: 1, q: "وش البيرك اللي يعطيك دزّة قدام وحماية من الضربة وأنت مصاب؟ (حق ديفيد كينج)", answers: ["ديد هارد", "ديدهارد", "dead hard", "deadhard", "بيرك ديدهارد", "المنيع", "dh", "دد هارد", "ددهارد"], hint: "يختصرونه بـ DH" },
  { id: 2, q: "وش اسم الكيان أو الشيء الأسود الخفي اللي يبي التضحيات ويتحكم بالضباب؟", answers: ["ذا انتيتي", "انتيتي", "the entity", "entity", "الكيان", "الانتيي", "انتتي", "الأنتيتي"], hint: "The Entity" },
  { id: 3, q: "كم حبة توكن لازم تجمعها في بيرك (Devour Hope) عشان تقدر تقتل السرفايفر بيدك بدون خطاف؟", answers: ["5", "خمسة", "خمس", "five", "٥"], hint: "نفس عدد المولدات الكلية" },
  { id: 4, q: "وش اسم الشنطة أو الصندوق اللي تستخدمه عشان تخرب الفخاخ أو تشيل الهوكات؟", answers: ["صندوق العدة", "صندوق عده", "تول بوكس", "toolbox", "التول بوكس", "شنطة العدة"], hint: "Toolbox" },
  { id: 5, q: "إذا متوا كلكم وبقيت أنت لحالك بالجيم، وش الشيء اللي ينفتح لك في الأرض عشان تفلت؟", answers: ["الهاتش", "هاتش", "البوابة الارضية", "hatch", "الفتحة", "الفتحه"], hint: "تطلع صوت صفير قوي" }
];

// ألعاب كمل الكلمة
const completeWordGames = [
  { display: "سيلف ____", answers: ["سيلف كير", "سيلفكير", "self care", "selfcare", "سلف كير"], hint: "بيرك الهيل الشهير لحالك" },
  { display: "ديسيسيف ____", answers: ["ديسيسيف ستريك", "decisive strike", "سترايك", "ستريك"], hint: "بيرك الطعنة حقت لوري ستالي" },
  { display: "ويندوز اوف ____", answers: ["ويندوز اوف اوبورتيونتي", "windows of opportunity", "اوبورتيونتي", "اوبورتونتي"], hint: "بيرك كاشف الشبابيك والبالتات" },
  { display: "سبرنت ____", answers: ["سبرنت برست", "sprint burst", "برست", "بيرست"], hint: "بيرك السرعة المفاجئة أول ما تركض" }
];

// ألعاب تتبع الأثر (اتجاه اللوب)
const scratchMarksGames = [
  { text: "🔴🔴🔴\n🔴 🏃 🔴\n      \n الخدوش حمراء ومرتبة ورا الجدار، وين راح السرفايفر؟", answers: ["نط من الشباك", "نط شباك", "الشباك", "vaulted", "window"], hint: "فكر بتكتيكات اللوب السريع" },
  { text: "🩸  🩸  🩸\n🩸 🔪 🚶\n بقع الدم على الأرض حارة والكيلر يمشي ببطء وصوت الأنفاس اختفى فجأة، وش سوا السرفايفر؟", answers: ["دخل الصندوق", "دخل صندوق", "صندوق", "locker", "خزانة"], hint: "مكان يختبئ فيه يقطع الأثر تماماً" }
];

const typingRaces = [
  "فزع لأخوك قبل ما يموت على الهوك",
  "صلح المولدات بسرعة وافتح البوابة",
  "شغل ديد هارد وافلت من الضربة"
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
  return str.toLowerCase().trim().replace(/[\s_.-]/g, "").replace(/[أإآا]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/^ال/, "");    
}

function matchAnswer(userInput, validAnswers) {
  const userClean = cleanString(userInput);
  return validAnswers.some(ans => cleanString(ans) === userClean || userClean.includes(cleanString(ans)));
}

// ─── UI EMBED BUILDERS ───────────────────────────────────────────────────────
function buildLobbyEmbed() {
  return new EmbedBuilder().setColor(DISCORD_BG).setImage(LOGO); 
}

// واجهة البداية بـ زر واحد فقط نظيف وفخم
function startComponent() {
  return [new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("open_games_menu").setLabel("🎮 قائمة الألعاب").setStyle(ButtonStyle.Secondary)
  )];
}

// لوحة الألعاب الكاملة بعد الضغط على الزر الأساسي
function lobbyComponents() {
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("game_trivia").setLabel("🧠 تحدي فردي").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("game_complete").setLabel("📝 كمل الكلمة").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("game_skillcheck").setLabel("🎯 فحص المهارة").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("game_roulette").setLabel("🎲 روليت الكيان").setStyle(ButtonStyle.Secondary)
  );
  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("game_luckybox").setLabel("📦 المربع الصح").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("game_mafia").setLabel("🕵️ مافيا الشات").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("queue_join").setLabel("📥 دخول طابور [4]").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("game_leaderboard").setLabel("🏆 الأساطير").setStyle(ButtonStyle.Secondary)
  );
  return [row1, row2];
}

function postGameButtons(retryCustomId) {
  return [new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(retryCustomId).setLabel("🔄 العب مرة ثانية").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("go_lobby").setLabel("🏠 العودة").setStyle(ButtonStyle.Secondary)
  )];
}

// ─── MESSAGE HANDLER ─────────────────────────────────────────────────────────
const activeGames = new Collection(); 

client.on("messageCreate", async msg => {
  if (msg.author.bot) return;
  const contentClean = msg.content.trim().toLowerCase();

  // أمر التشغيل بالعامية العربي
  if (["لعب-", "!لعب", "لعب", "play"].includes(contentClean)) {
    return msg.reply({ embeds: [buildLobbyEmbed()], components: startComponent() });
  }

  // فحص إجابة المواجهة الجماعية
  if (activeMatch && activeMatch.type === "group" && matchAnswer(msg.content, activeMatch.answers)) {
    const winner = getPlayer(msg.author.id, msg.author.username);
    winner.pts += 100; activeMatch = null; lobbyQueue.clear(); if (matchTimeout) clearTimeout(matchTimeout);
    return msg.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle("🏆 انتصار جماعي!").setDescription(`⚡ **${msg.author.username}** سحق الجميع وجاوب أول واحد صح!\n💰 كسب: \`+100\` نقطة رصيد!`)] });
  }

  // فحص إجابة مافيا الشات (اسم الشخص المكتوب)
  if (activeMatch && activeMatch.type === "mafia") {
    if (msg.content.includes(activeMatch.targetId)) {
      const hero = getPlayer(msg.author.id, msg.author.username);
      const mafiaPlayer = getPlayer(activeMatch.targetId, activeMatch.targetName);
      hero.pts += 50; mafiaPlayer.pts = Math.max(0, mafiaPlayer.pts - 40); activeMatch = null; if (matchTimeout) clearTimeout(matchTimeout);
      return msg.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle("🕵️ تم شنق المافيا!").setDescription(`⚔️ **${msg.author.username}** كشف الجاسوس وكبسه وصادره!\n💰 الممسك كسب \`+50\` رصيد • 💀 المافيا خسر \`-40\` رصيد.`)] });
    }
  }

  const game = activeGames.get(msg.channel.id);
  if (!game) return;

  // فحص الألعاب الفردية
  if ((game.type === "trivia" || game.type === "complete" || game.type === "scratch") && matchAnswer(msg.content, game.data.answers)) {
    activeGames.delete(msg.channel.id);
    const p = getPlayer(msg.author.id, msg.author.username);
    p.pts += 40;
    return msg.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle("🎉 كفو صح!").setDescription(`> **${msg.author.username}** جابها صح!\n💰 **رصيدك الحالي:** \`${p.pts}\``)] });
  }
});

// ─── INTERACTION HANDLER ─────────────────────────────────────────────────────
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;
  const id = interaction.customId;
  const p = getPlayer(interaction.user.id, interaction.user.username);

  // فتح قائمة الألعاب (التحويل التفاعلي)
  if (id === "open_games_menu" || id === "go_lobby") {
    return interaction.update({ content: `**طابور الانتظار:** \`[${lobbyQueue.size}/4]\``, embeds: [buildLobbyEmbed()], components: lobbyComponents() });
  }

  // 1. تحدي فردي عشوائي
  if (id === "game_trivia") {
    if (activeGames.has(interaction.channel.id)) return interaction.reply({ content: "⚠️ الروم محجوز بتحدي نشط حالياً!", ephemeral: true });
    const pool = Math.random() > 0.5 ? dbdQuestions : scratchMarksGames; // تنويع عشوائي مدمج مع تتبع الأثر
    const q = pool[Math.floor(Math.random() * pool.length)];
    activeGames.set(interaction.channel.id, { type: pool === dbdQuestions ? "trivia" : "scratch", data: q });
    setTimeout(() => { activeGames.delete(interaction.channel.id); }, 30000);

    return interaction.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(pool === dbdQuestions ? "🧠 تحدي فكري فردي" : "🔍 تحدي تتبع الأثر والخدوش").setDescription(`### ${q.q || q.text}`)], components: postGameButtons("game_trivia") });
  }

  // 2. لعبة كمل الكلمة
  if (id === "game_complete") {
    if (activeGames.has(interaction.channel.id)) return interaction.reply({ content: "⚠️ الروم مشغول بتحدي آخر!", ephemeral: true });
    const c = completeWordGames[Math.floor(Math.random() * completeWordGames.length)];
    activeGames.set(interaction.channel.id, { type: "complete", data: c });
    setTimeout(() => { activeGames.delete(interaction.channel.id); }, 30000);

    return interaction.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle("📝 لعبة كمل الكلمة الممسوحة").setDescription(`### اكمل الفراغ التالي لاسم البيرك:\n\n# \`${c.display}\``).addFields({ name: "💡 تلميح مساعد", value: `||${c.hint}||` })], components: postGameButtons("game_complete") });
  }

  // 3. لعبة المربع الصح (Lucky Box)
  if (id === "game_luckybox") {
    const targetBox = Math.floor(Math.random() * 3);
    const row = new ActionRowBuilder().addComponents(
      [0, 1, 2].map(i => new ButtonBuilder().setCustomId(`box_${i}_${targetBox}_${interaction.user.id}`).setLabel(`📦 صندوق ${i+1}`).setStyle(ButtonStyle.Secondary))
    );
    return interaction.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle("📦 لعبة الصندوق والمربع الصح").setDescription("قدامك 3 صناديق مقفلة بالضباب؛ واحد فيه مفتاح يفتح رصيدك، وواحد فيه فخ ترابر يطير نقاطك، وواحد فاضي! اختر بحظك:")], components: [row], ephemeral: true });
  }

  if (id.startsWith("box_")) {
    const [, clicked, target, userId] = id.split("_");
    if (interaction.user.id !== userId) return interaction.reply({ content: "❌ مو صندوقك!", ephemeral: true });
    if (clicked === target) {
      p.pts += 50;
      return interaction.update({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle("🔑 لقيت المفتاح وهربت!").setDescription("حظك حريقة! فتحت المربع الصح ولقيت مفتاح الهروب الأسطوري.\n\n💰 **كسبت:** `+50` نقطة.")], components: postGameButtons("game_luckybox") });
    } else if (Math.random() > 0.5) {
      p.pts = Math.max(0, p.pts - 30);
      return interaction.update({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle("🪤 كلاك! فخ ترابر").setDescription("سوء حظ فادح! المربع هذا كان فيه فخ حديدي مسك رجلك وعورك.\n\n📉 **خسرت:** `-30` نقطة.")], components: postGameButtons("game_luckybox") });
    } else {
      return interaction.update({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle("💨 صندوق فارغ محبط").setDescription("فتحت الصندوق وطلع غبار وما فيه أي شيء يفيدك.")], components: postGameButtons("game_luckybox") });
    }
  }

  // 4. لعبة مافيا الشات (The Fog Mafia)
  if (id === "game_mafia") {
    if (activeMatch) return interaction.reply({ content: "⚠️ في مواجهة أو تحدي شغال بالشات حالياً!", ephemeral: true });
    
    // سحب أعضاء أونلاين عشوائيين من السيرفر كهدف للمافيا
    const members = await interaction.guild.members.fetch();
    const activeMembers = members.filter(m => !m.user.bot);
    if (activeMembers.size < 1) return interaction.reply({ content: "❌ ما في أعضاء كافيين بالسيرفر لتشغيل المافيا الحين!", ephemeral: true });
    
    const randomTarget = activeMembers.random().user;
    activeMatch = { type: "mafia", targetId: randomTarget.id, targetName: randomTarget.username };

    matchTimeout = setTimeout(() => { activeMatch = null; }, 30000);

    return interaction.reply({ content: `🚨 **انطلقت لعبة مافيا الشات والعملاء!**\nالكيان اختار عضو عشوائي وخلاه جاسوس ومافيا الحين بالروم، أسرع واحد يكتب منشن العضو هذا أو يحط الآيدي حقه بالشات يمسكه ويشنقه وياخذ رصيده!\n\n> **💡 تلميح الجاسوس:** أول حرف من اسمه هو (\` ${randomTarget.username[0]} \`) وعنده 30 ثانية يختفي! ⏳` });
  }

  // 5. فحص المهارة (ثانية ونصف تفاعلي)
  if (id === "game_skillcheck") {
    const checkTypes = [
      { type: "gen", title: "🛠️ !! SKILL CHECK — تصليح مولد", desc: "اضغط على الهدف `🎯`!", winPts: 35, losePts: 20 },
      { type: "heal", title: "🩸 !! SKILL CHECK — تداوي وشفاء", desc: "اضغط على `🎯` عشان ما ينزف خويك!", winPts: 40, losePts: 25 }
    ];
    const chosenGame = checkTypes[Math.floor(Math.random() * checkTypes.length)];
    const randZone = Math.floor(Math.random() * 4); 
    const row = new ActionRowBuilder().addComponents([0, 1, 2, 3].map(i => new ButtonBuilder().setCustomId(`sk_${i}_${randZone}_${interaction.user.id}_${chosenGame.type}_active`).setLabel(i === randZone ? "🎯" : "⚙️").setStyle(ButtonStyle.Secondary)));

    await interaction.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(chosenGame.title).setDescription(`⚡ **انتبه!**\n\n> ${chosenGame.desc}`)], components: [row], ephemeral: true, fetchReply: true });
    setTimeout(async () => {
      try {
        const checkFetch = await interaction.fetchReply();
        if (checkFetch && checkFetch.components.length > 0 && checkFetch.components[0].components[0].customId.endsWith("_active")) {
          p.pts = Math.max(0, p.pts - chosenGame.losePts);
          await interaction.editReply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle("💥 انتهى الوقت").setDescription(`⏱️ مرت الثانية والنصف وفشل الفحص، ونقصت نقاطك \`-${chosenGame.losePts}\`.`)], components: postGameButtons("game_skillcheck") });
        }
      } catch (err) {}
    }, 1500);
    return;
  }

  if (id.startsWith("sk_")) {
    const [, clicked, target, userId, gameType, status] = id.split("_");
    if (interaction.user.id !== userId) return interaction.reply({ content: "❌ ليس فحصك!", ephemeral: true });
    if (status !== "active") return; 
    let winPts = gameType === "gen" ? 35 : 40, losePts = gameType === "gen" ? 20 : 25;
    if (clicked === target) {
      p.pts += winPts; return interaction.update({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle("💥 نجاح سريع!").setDescription(`💰 **الجوائز:** \`+${winPts}\` نقطة رصيد.`)], components: postGameButtons("game_skillcheck") });
    } else {
      p.pts = Math.max(0, p.pts - losePts); return interaction.update({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle("💥 فشل وانفجار!").setDescription(`📉 **العقوبة:** \`-${losePts}\` من رصيدك.`)], components: postGameButtons("game_skillcheck") });
    }
  }

  // 6. روليت الكيان
  if (id === "game_roulette") {
    if (p.pts < 30) return interaction.reply({ content: "❌ رصيدك منخفض جداً للمخاطرة (تحتاج 30 نقطة)!", ephemeral: true });
    const win = Math.random() > 0.55; 
    if (win) {
      p.pts += 60; return interaction.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle("🎲 روليت: هروب!").setDescription(`🏃 نجحت في الهروب!\n📈 **رصيدك الحالي:** \`${p.pts}\``)], components: postGameButtons("game_roulette") });
    } else {
      p.pts -= 30; return interaction.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle("💀 روليت: تضحية!").setDescription(`🪝 تم تعليقك على الهوك.\n📉 **رصيدك الحالي:** \`${p.pts}\``)], components: postGameButtons("game_roulette") });
    }
  }

  // طابور الـ 4 لاعبين الجماعي
  if (id === "queue_join") {
    if (lobbyQueue.has(interaction.user.id)) return interaction.reply({ content: "⚠️ مسجل بالفعل بالطابور!", ephemeral: true });
    if (activeMatch) return interaction.reply({ content: "⚠️ في تحدي جماعي نشط بالشات حالياً!", ephemeral: true });

    lobbyQueue.add(interaction.user.id);
    const needed = 4 - lobbyQueue.size;

    if (lobbyQueue.size === 4) {
      let q = dbdQuestions[Math.floor(Math.random() * dbdQuestions.length)];
      activeMatch = { type: "group", ...q }; 
      const endTimestamp = Math.floor((Date.now() + 60000) / 1000);
      await interaction.update({ content: `**اللاعبين:** \`[4/4]\`\n🚨 **بدأت المواجهة!**`, embeds: [buildLobbyEmbed()], components: lobbyComponents() });
      matchTimeout = setTimeout(() => { if (activeMatch && activeMatch.type === "group") { activeMatch = null; lobbyQueue.clear(); interaction.channel.send("⏱️ انتهى وقت التحدي الجماعي."); } }, 60000);

      return interaction.channel.send({ content: `🚨 **انطلقت مواجهة الـ 4 لاعبين!**\nينتهي التحدي: <t:${endTimestamp}:R> ⏳`, embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle("⚔️ الأسْرَع بالشات يقتنص الـ 100 نقطة:").setDescription(`### ${q.q}`)] });
    }

    return interaction.update({ content: `**طابور الانتظار:** \`[${lobbyQueue.size}/4]\`\n⏳ باقي [ ${needed} ] لاعبين وتبدأ المواجهة الجماعية...`, embeds: [buildLobbyEmbed()], components: lobbyComponents() });
  }

  // لوحة الصدارة
  if (id === "game_leaderboard") {
    const sorted = [...db.values()].sort((a, b) => b.pts - a.pts).slice(0, 5);
    const lbDescription = sorted.length ? sorted.map((pl, idx) => `> **${idx + 1}. ${pl.name}** — \`${pl.pts} نقطة\` (${pl.rank})`).join("\n") : "📭 القائمة فارغة حالياً.";
    return interaction.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle("🏆 لوحة أساطير الضباب").setDescription(lbDescription)], components: returnButton() });
  }
});

client.once("ready", () => { console.log(`🚀 SOUL DBD PLATFORM SYSTEM IS LIVE: ${client.user.tag}`); });
client.login(process.env.DISCORD_TOKEN);
