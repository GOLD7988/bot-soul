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

// ─── EXTENSIVE QUESTION BANK (بنك أسئلتك العامي والموسع بالكامل) ───────────
const dbdQuestions = [
  // --- بيركات وآيتمات (Perks & Items) ---
  {
    id: 1,
    q: "وش البيرك اللي يخليك تقوم من الأرض بنفسك لمرة واحدة بالرابير بدون مساعدة خويك؟",
    answers: ["unbreakable", "انبريكابل", "انبريكبل", "أنبريكابل"],
    hint: "بيرك العجوز بيل المشهور"
  },
  {
    id: 2,
    q: "إذا الكيلر جالس 'يتنل' (Tunnel) وراك أول ما نزلت من الهوك، وش البيرك اللي يعطيك طعنة تخليه يفتحك إذا شالك؟",
    answers: ["decisive strike", "ديسايسف سترايك", "الطعنه", "الطعنة", "ds", "دي اس"],
    hint: "طعنة السرفايفور الشهيرة بعد الهوك"
  },
  {
    id: 3,
    q: "بيرك 'Windows of Opportunity' (الشبابيك) وش وظيفته الأساسية اللي تساعد اللوبر؟",
    answers: ["يكشف لك اماكن البالتات والشبابيك القريبة", "يكشف الشبابيك والبالتات", "يكشف الشبابيك", "الشبابيك والبالتات", "يكشف بالتات وشبابيك"],
    hint: "يكشف لك مسارات الهروب باللون الأصفر"
  },
  {
    id: 4,
    q: "وش اسم البيرك المشهور اللي يعطيك 'دش' (Dash) أو دفعة سرعة مؤقتة لما تكون مصاب وتضغط زر الأبيليتي بالوقت الصح؟",
    answers: ["dead hard", "ددهارد", "دد هارد", "ديد هارد", "ديدهار", "dh"],
    hint: "بيرك ديفيد كينج اللي يعطيك حماية ثانية"
  },
  {
    id: 5,
    q: "إذا تبي 'تنقع' (Genrush) الماطور بأسرع وقت, وش أفضل آيتم تاخذه معك؟",
    answers: ["toolbox", "تول بوكس", "تولبوكس", "عدت تصليح", "شنطة عدة", "صندوق العدة"],
    hint: "صندوق العدة والمسامير"
  },
  {
    id: 6,
    q: "وش البيرك اللي يعطيك دفعة سرعة (Sprint) أول ما تبدأ تركض، ويروح كول داون (Exhausted)؟",
    answers: ["sprint burst", "سبرنت بيرست", "سبرنت برست", "سبرنت", "سبرنت برست"],
    hint: "بيرك ميغ الشهير للركض المفاجئ"
  },
  {
    id: 7,
    q: "بيرك 'Adrenaline' وش يسوي لك بالضبط أول ما تفتح البوابة الأخيرة أو تكتمل المواطير؟",
    answers: ["يهيلك هيل كامل ويعطيك دفعة سرعة", "يهيل ويعطي سرعه", "يهيلك ويعطيك سرعة", "يقومك ويسرعك"],
    hint: "يقومك من الأرض ويهيلك مع دفعة سرعة أدرينالين"
  },
  {
    id: 8,
    q: "وش البيرك اللي يخليك تسرع الهيل لنفسك بدون ما تحتاج ميد-كيت (Med-Kit)؟",
    answers: ["self-care", "self care", "سيلف كير", "سلف كير", "سلفكير"],
    hint: "بيرك كلوديت لمعالجة النفس"
  },
  {
    id: 9,
    q: "إذا تبي تشوف مكان الكيلر أول ما يكسر بالتة أو ينط من شباك، وش البيرك اللي تستخدمه؟",
    answers: ["alert", "اليرت", "أليرت"],
    hint: "بيرك فينج مين للتجسس على حركات الكيلر"
  },
  {
    id: 10,
    q: "وش البيرك اللي يخليك تنط من الأماكن العالية (مثل السطوح) بدون ما تتجمد رجلك ويوفر لك دفعة سرعة؟",
    answers: ["balanced landing", "بالانسد لاندنج", "بالانسد", "بالانس", "بالانست"],
    hint: "بيرك نيا للنزول المتوازن"
  },
  // --- كيلرز وقدراتهم (Killers) ---
  {
    id: 11,
    q: "مين الكيلر اللي معروف بـ 'المنشار' ويقدر يجيبك بضربة واحدة (One Shot) إذا شحن قدرته؟",
    answers: ["hillbilly", "هيلبيلي", "هيل بلي", "ابو منشار", "أبو منشار"],
    hint: "الكيلر المشوه راعي المنشار اللانهائي"
  },
  {
    id: 12,
    q: "أي كيلر تقدر 'تطفيه' أو تكشفه إذا ناظرته مباشرة وهو يحاول يسوي لك ستالك (Stalk)؟",
    answers: ["ghostface", "غوست فيس", "غوستفيس", "الجوست", "جوست فيس", "قوست فيس"],
    hint: "راعي قناع الصرخة المشهور"
  },
  {
    id: 13,
    q: "وش الكيلر اللي يختفي تماماً وتسمع صوت 'الجرَس' حقه لما يجي يظهر ويركض وراك؟",
    answers: ["wraith", "ريث", "الريث", "ابو جرس", "أبو جرس"],
    hint: "راعي الجرس والتخفي الشبح"
  },
  {
    id: 14,
    q: "مين أقوى كيلر في اللعبة وتقدر تتنقل (Teleport) وتخترق الجدران بالبلينك؟",
    answers: ["nurse", "نيرس", "النيرس", "الممرضه", "الممرضة"],
    hint: "الممرضة الطائرة بالبلينكات"
  },
  {
    id: 15,
    q: "وش الكيلر اللي يرمي عليك 'فؤوس' (Hatchets) من بعيد ولازم تلوف يمين ويسار عشان تفادقها؟",
    answers: ["huntress", "هانترس", "الهانترس", "ام فؤوس", "أم فؤوس", "هنتريس"],
    hint: "راعية الأقنعة والترنيمة الطفولية"
  },
  {
    id: 16,
    q: "كيلر 'The Trapper' وش هي الأبيليتي الأساسية حقته اللي يقفل فيها اللوبات؟",
    answers: ["bear traps", "فخاخ", "فخ", "الفخاخ", "فخ الدب", "تراب", "ترابات"],
    hint: "فخاخ حديدية تطبق على الرجل"
  },
  {
    id: 17,
    q: "مين الكيلر اللي يخليك تلعب لعبة 'المناشير' (Jigsaw) ولازم تدور على مفتاح عشان تفك الفخ من راسك قبل ما ينفجر؟",
    answers: ["pig", "الخنزيره", "الخنزيرة", "بيج", "بيق"],
    hint: "الخنزيرة التابعة لـ Jigsaw"
  },
  {
    id: 18,
    q: "الكيلر 'The Spirit' لما تستخدم قدرتها وتختفي وتسمع صوت الهوا، كيف تقدر تعرف مكانك؟",
    answers: ["تعتمد على صوت أنفاسك، خطواطك، وتحرك الحشيش", "الصوت والخطوات", "صوت الانفاس والخطوات", "صوت ومشي", "بالصوت"],
    hint: "تعتمد كلياً على السمع وتتبع الخدوش"
  },
  {
    id: 19,
    q: "مين الكيلر اللي يركض ويصدم في الجدران (Rush) عشان يجيبك بسرعة عالية؟",
    answers: ["blight", "بلايت", "البلايت", "المعوق", "ابو كورة", "أبو كورة"],
    hint: "الكيلر البرتقالي المنطلق كالكُرة"
  },
  {
    id: 20,
    q: "أي كيلر يخلي السرفايفرز يرجعون 'يزوعون' ويمرضون وتتوسخ الماطورات إذا لمسوها؟",
    answers: ["plague", "بلاج", "بلايق", "المطوعه", "المطوعة"],
    hint: "راعية الكأس والسموم والمطوعة"
  },
  // --- تكتيكات ومصطلحات (Gameplay & Slangs) ---
  {
    id: 21,
    q: "وش يعني مصطلح 'كامب' (Camping) اللي يسويه الكيلر؟",
    answers: ["يوقف عند الهوك وينتظر أحد يجي ينقذ", "كامب عند الهوك", "التخييم عند الهوك", "حراسة الهوك", "يغرس عند الهوك"],
    hint: "الوقوف اللزقة عند الناجي المعلق"
  },
  {
    id: 22,
    q: "لما تلوح بالكشاف بوجه الكيلر وهو شايل خويك عشان يربحه ويفلت، وش تسمى اللقطة؟",
    answers: ["flashlight save", "فلاش سيف", "فلاش سيفد", "انقاذ بالكشاف"],
    hint: "إعماء الكيلر وإنقاذ المحمول بالـ Flashlight"
  },
  {
    id: 23,
    q: "وش يعني لما خويك يقول لك 'الكيلر مسوي تري جين (3-Gen)'؟",
    answers: ["3-gen", "3 gen", "تري جين", "تري جن", "ثلاث مواطير قريبه", "3 مواطير قريبة"],
    hint: "حصار آخر 3 مولدات متقاربة جداً"
  },
  {
    id: 24,
    q: "وش أفضل تصرف تسويه لما الكيلر يفعل بيرك 'NOED' وتفتح بوابات الخروج؟",
    answers: ["تدور على توتم الهكس المشتعل وتكسره", "تكسر التوتم", "tكسر النويد", "تدور النويد وتكسره", "تكسر هكس النويد"],
    hint: "البحث عن عظمة الهكس المشتعلة بالخريطة وتكسيرها"
  },
  {
    id: 25,
    q: "وش المقصود بمصطلح 'التنل' (Tunneling) في قيم ديد باي دايلايت؟",
    answers: ["tunneling", "تنل", "تنقيع سرفايفر", "يلحق واحد لين يموت", "يركز على واحد"],
    hint: "استهداف نفس الشخص فور نزوله من الخطاف لتصفيته"
  },
  {
    id: 26,
    q: "وش يعني مصطلح 'Slugged' أو 'تنقيع أرض'؟",
    answers: ["لما الكيلر يخليك طايح على الأرض (نظام زحف) وما يشيلك على الهوك", "منقوع ارض", "منقوع أرض", "مخليه على الارض", "زحف"],
    hint: "ترك السرفايفر يزحف على الأرض دون تعليقه"
  },
  {
    id: 27,
    q: "لما تقفل على الكيلر بالبالتة بوجهه مباشرة وهو يلحقك وتخليه يتجمد ثانية، وش تسمى؟",
    answers: ["pallet stun", "بالت ستن", "ستن بالبالته", "صقعه بالبالته", "ستن"],
    hint: "صقع الكيلر بالخشب مباشرة"
  },
  {
    id: 28,
    q: "وش هو الـ 'Hatch' (الهاش) ومتى يفتح لآخر سرفايفر في الجيم؟",
    answers: ["hatch", "هاش", "الهاش", "الفتحه الارضية", "الفتحة الأرضية"],
    hint: "ممر الهروب الأرضي السري للأخير"
  },
  {
    id: 29,
    q: "وش يعني مصطلح 'Mindgame' في اللوب؟",
    answers: ["mindgame", "مايند قيم", "مايندقيم", "خدعة اللوب", "تمويه"],
    hint: "التلاعب بضوء الكيلر والحركة لخدعة الخصم ورا الجدار"
  },
  {
    id: 30,
    q: "وش الفايدة الأساسية من حركة الـ 'Body Block' (البدي بلوك)؟",
    answers: ["body block", "بدي بلوك", "بديبلبوك", "تقفيل بالجسم", "سد الطريق"],
    hint: "حجب وحماية خويك بجسدك لمنع ضربه أو إعاقة الكيلر"
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

function returnButton() {
  return [new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("go_lobby").setLabel("🏠 العودة للمخيم").setStyle(ButtonStyle.Secondary)
  )];
}

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

  // تحدي فردي عشوائي (بنك الأسئلة الجديد)
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

  // فحص المهارة التفاعلي الموزون (ثانية ونصف - 1500ms)
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

  // معالجة أزرار فحص المهارة
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
  console.log(`🚀 SOUL DBD ULTRA EXPANDED EDITION IS LIVE: ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
