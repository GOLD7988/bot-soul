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

// كود اللون السحري الذي يطابق خلفية الديسكورد تماماً ليجعل القائمة "شفافة وتطفو"
const DISCORD_BG_TRANSPARENT = 0x2B2D31; 

// ─── EXTENSIVE DATABASE (ضخمة جداً ومتعددة الإجابات) ──────────────────────────
const killers = [
  { name: "ذا ترابر",        power: "فخاخ الدببة",           difficulty: "مبتدئ",  emoji: "🪤" },
  { name: "ذا نيرس",         power: "البلنك",                 difficulty: "خبير",   emoji: "🩺" },
  { name: "ذا هنتريس",       power: "الفؤوس",                 difficulty: "مبتدئ",  emoji: "🪓" },
  { name: "ذا شيب - مايرز",  power: "إيفل ويذن",              difficulty: "متوسط",  emoji: "🔪" },
  { name: "ذا سبيريت",       power: "يامائوكا هونتنج",        difficulty: "خبير",   emoji: "👻" },
  { name: "ذا بلايت",        power: "بلايتد كوراپشن",         difficulty: "خبير",   emoji: "🧪" },
  { name: "ذا نيميسيس",      power: "تي-فيروس",               difficulty: "مبتدئ",  emoji: "☣️" },
  { name: "ذا ماسترمايند",   power: "يوروبوروس إنفيكشن",      difficulty: "مبتدئ",  emoji: "🦠" },
  { name: "ذا پيگ",          power: "جيكسو بابتيزم",          difficulty: "متوسط",  emoji: "🐷" },
  { name: "ذا غوست فيس",     power: "نايت شراود",             difficulty: "متوسط",  emoji: "👤" }
];

const perks = [
  { name: "ديد هارد",              type: "survivor", emoji: "💨", desc: "تهرب من ضربة واحدة بالطاقة" },
  { name: "ديسيسيف ستريك",         type: "survivor", emoji: "🗡️", desc: "بعد الإنقاذ اضرب الكيلر وافلت" },
  { name: "سيلف كير",              type: "survivor", emoji: "🩹", desc: "اشفي نفسك بدون صندوق إسعاف" },
  { name: "أدرينالين",             type: "survivor", emoji: "⚡", desc: "لما آخر مولد يشتغل تشتفي وتجري أسرع" },
  { name: "أنبريكبل",              type: "survivor", emoji: "💪", desc: "قوم من الأرض لوحدك مرة واحدة" }
];

// بنك أسئلة التريفيا الشامل والموسع مع كل الإجابات الممكنة (عامي، فصيح، إنجليزي، نسخ)
const trivia = [
  { 
    q: "ما هو البيرك الذي يعطيك طاقة جري وحماية عند اندفاعك وأنت مجروح؟", 
    answers: ["ديد هارد", "ديدهارد", "dead hard", "deadhard", "بيرك ديدهارد", "المنيع", "المنعه"], 
    hint: "بيرك ديفيد كينج المشهور بـ المنيع" 
  },
  { 
    q: "كم عدد المولدات التي يجب إصلاحها لتفعيل أبواب الخروج؟", 
    answers: ["5", "خمسة", "خمس", "five", "٥"], 
    hint: "رقم بين 4 و6" 
  },
  { 
    q: "ما هي القوة الخاصة بـ ذا ترابر (The Trapper)؟",                        
    answers: ["فخاخ الدببة", "فخاخ الدببه", "فخاخ", "فخ", "bear traps", "bear trap", "الفخ"], 
    hint: "شيء حديدي يمسك القدم بالأرض" 
  },
  { 
    q: "ما اسم العملة الحمراء الأساسية التي تطور بها الشخصيات في الـ Bloodweb؟",                 
    answers: ["بلدبوينتس", "بلدبوينت", "بلدپوينتس", "bloodpoints", "bp", "بلد بوينت", "نقاط الدم", "البلد بوينت"], 
    hint: "نقاط + دم" 
  },
  { 
    q: "كم عدد الناجين (Survivors) المتواجدين داخل المباراة الواحدة بشكل رسمي؟",                    
    answers: ["4", "اربعة", "اربع", "four", "٤"], 
    hint: "أقل من 5 وأكثر من 3" 
  },
  { 
    q: "ما اسم القدرة الانتقالية لـ ذا نيرس (The Nurse) التي تخترق الجدران؟",                          
    answers: ["البلنك", "بلنك", "blink", "البلمك", "انتقال"], 
    hint: "القفزة أو الانتقال الآني اللحظي" 
  },
  { 
    q: "من هو الكيلر الشهير الذي جاء كـ تعاون من سلسلة Resident Evil ويحمل السوط؟",           
    answers: ["ذا نيميسيس", "نيميسيس", "نمسيس", "nemesis", "ذا نمسيس", "النميسيس"], 
    hint: "صاحب فيروس التي-فيروس الشهير" 
  },
  { 
    q: "ما هو البيرك الذي يسمح للسرفايفر بالنهوض من الأرض تلقائياً مرة واحدة بالديم؟",         
    answers: ["أنبريكبل", "انبريكبل", "unbreakable", "ان بريك ابل", "انبريك ابل"], 
    hint: "بيرك العجوز بيل" 
  },
  { 
    q: "كم مولداً يتم إغلاقه في بداية الجيم عند استخدام بيرك Corrupt Intervention؟",         
    answers: ["3", "ثلاثة", "ثلاث", "three", "٣"], 
    hint: "عدد مولدات يتم حجبها باللون الأحم" 
  },
  { 
    q: "ما اسم بيرك الكيلر الشهير الذي يكشف أماكن السرفايفرز بعد تعليق أحدهم على الخطاف؟", 
    answers: ["باربيكيو آند شيلي", "باربيكيو", "barbecue", "bbq", "باربكيو", "باربكيو اند شيلي"], 
    hint: "شواء ولحم" 
  },
  { 
    q: "كم عدد بوابات الخروج المتواجدة في أي خريطة بالجيم؟",                  
    answers: ["2", "اثنين", "اثنين", "two", "٢"], 
    hint: "بوابتين تفتح برافعة" 
  },
  { 
    q: "ما اسم قوة ذا سبيريت (The Spirit) الي تخفيها وتجعلها تتحرك بسرعة؟",                       
    answers: ["يامائوكا هونتنج", "ياماوكا", "yamaoka haunting", "ياماوكا هونتنق", "هونتنق"], 
    hint: "اسم عائلتها اليابانية" 
  },
  { 
    q: "ما اسم الكيان الشرير اللانهائي الذي يتحكم في الضباب ويطلب التضحيات؟",                        
    answers: ["ذا إنتيتي", "انتيتي", "the entity", "entity", "الكيان", "الانتيي"], 
    hint: "The Entity" 
  },
  { 
    q: "كم مرة يجب تعليق السرفايفر على الخطاف ليموت بشكل كامل (المراحل الكلية)؟",          
    answers: ["3", "ثلاثة", "ثلاث", "three", "٣"], 
    hint: "المرحلة 1 و2 والموت في 3" 
  },
  { 
    q: "ما هو اللقب الملقب به الكيلر (The Huntress) في مجتمع اللعبة؟",                  
    answers: ["الارنب", "ارنب", "ذا هنتريس", "هنتريس", "huntress", "ام الفؤوس"], 
    hint: "تلبس قناع حيوان وتغني تهويدة للأطفال" 
  }
];

// تحديات الحرف الناقص المطورة بدعم لغوي متعدد
const missingLetterWords = [
  { wordAnswers: ["ديد هارد", "ديدهارد", "dead hard", "deadhard"], hint: "بيرك سرفايفر يعطي اندفاعة حماية", display: "د_د ه_رد" },
  { wordAnswers: ["خطاف", "الخطاف", "hook", "هوك"],               hint: "الأداة التي يُعلق عليها الناجي للتضحية", display: "خ_اف" },
  { wordAnswers: ["مولد", "المولد", "generator", "gen"],          hint: "الآلة الميكانيكية التي يتطلب إصلاحها للخروج", display: "م_لد" },
  { wordAnswers: ["سرفايفر", "السرفايفر", "survivor"],            hint: "اللاعب الطريد الذي يحاول الهرب من القاتل", display: "س_فا_فر" },
  { wordAnswers: ["الإنتيتي", "انتيتي", "the entity"],            hint: "الكيان الحاكم والمسيطر على عالم الضباب", display: "الإ_تيتي" },
  { wordAnswers: ["بلدبوينتس", "بلدبوينت", "bloodpoints"],        hint: "النقاط المستعملة لفتح الأدوات والبيركات", display: "بلد_وي_تس" },
  { wordAnswers: ["كيلر", "الكيلر", "killer", "قاتل"],            hint: "اللاعب الصياد الذي يطارد البقية لمنع خروجهم", display: "ك_لر" },
  { wordAnswers: ["هنتريس", "الهنتريس", "huntress"],              hint: "القاتلة التي ترمي الفؤوس من مسافات بعيدة", display: "ه_ترس" }
];

// ألعاب سباق الكتابة
const typingRaces = [
  "أنقذ رفيقك قبل الموت",
  "اصلح المولدات وافتح الباب",
  "الكيلر يطارد السرفايفرز في الضباب",
  "ديد هارد بيرك قوي جداً",
  "هرب من الخطاف قبل المرحلة الثالثة"
];

const chaseScenarios = [
  {
    s: "🌫️ **سمعت موسيقى الكيلر وهو قريب منك جداً!**\nوش تسوي؟",
    c: [
      { l: "🏃 اركض للـ Loop",       r: "ذكي! كسبت وقت ثمين وأربكت الكيلر حول المنصات", p: 10 },
      { l: "🙈 اختبأ تحت المولد",    r: "خطأ فادح! وجدك فوراً بسبب علامات الركض والكاشف", p: -5 },
      { l: "💨 اركض عشوائي",         r: "محظوظ هذه المرة... لكن التحرك بدون خطة سيسقطك سريعاً", p: 0  }
    ]
  }
];

// ─── STATE ───────────────────────────────────────────────────────────────────
const lb     = new Collection(); 
const atMap  = new Collection(); 
const acMap  = new Collection(); 
const mlMap  = new Collection(); 
const trMap  = new Collection(); 

// ─── STRING PROCESSING ENGINE (تصفية وتنظيف الإجابات لتقبل كل الطرق) ───────────
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function addPts(id, name, pts) {
  const e = lb.get(id) || { name, pts: 0 };
  e.pts += pts; e.name = name; lb.set(id, e); return e.pts;
}

// دالة لتنظيف النص تماماً من أل التعريف، الفراغات، الحروف المتشابهة في النطق والكتابة لضمان العدل
function normalizeText(text) {
  if (!text) return "";
  return text.toLowerCase()
    .trim()
    .replace(/[\s_.-]/g, "") // إزالة المسافات والشرطات تماماً
    .replace(/[أإآا]/g, "ا") // معاملة كل الألفات كـ ا
    .replace(/ة/g, "ه")     // توحيد الهاء والتاء المربوطة
    .replace(/ى/g, "ي")     // توحيد الياء والألف المقصورة
    .replace(/^ال/, "");    // تجاهل ال التعريف إذا كتبها اللاعب أو نسيها
}

// مطابقة إجابة العضو مع قائمة الإجابات المرنة
function checkAnswer(userInput, answersArray) {
  const cleanInput = normalizeText(userInput);
  return answersArray.some(ans => normalizeText(ans) === cleanInput || cleanInput.includes(normalizeText(ans)));
}

// ─── UI EMBED BUILDERS (شفافة تماماً مدمجة مع أزرار صورتك) ────────────────────
function mainMenuEmbed() {
  return new EmbedBuilder()
    .setColor(DISCORD_BG_TRANSPARENT) // جعل الخلفية مطابقة تماماً لخلفية ديسكورد الداكنة
    .setTitle("🩸  SOUL DBD — القائمة الرئيسية")
    .setDescription("> 🌫️ *The Entity is watching you...*\n> 🎮 **اختار اللعبة اللي تبي تلعبها من الأزرار بالأسفل** 👇")
    .setImage(LOGO);
}

function mainMenuRows() {
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("menu_trivia").setLabel("🧠 تريفيا").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("menu_chase").setLabel("⚔️ مطاردة").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("menu_missing").setLabel("🔤 حرف ناقص").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("menu_typing").setLabel("⌨️ سباق الكتابة").setStyle(ButtonStyle.Secondary)
  );
  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("menu_killers").setLabel("🔪 الكيلرز").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("menu_perks").setLabel("✨ البيركات").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("menu_lb").setLabel("🏆 المتصدرين").setStyle(ButtonStyle.Success)
  );
  return [row1, row2];
}

function backRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("menu_back").setLabel("🏠 القائمة الرئيسية").setStyle(ButtonStyle.Secondary)
  );
}

// ─── MESSAGE HANDLER ─────────────────────────────────────────────────────────
client.on("messageCreate", async msg => {
  if (msg.author.bot) return;

  // ── الفحص الذكي لإجابات التريفيا المتعددة ──
  const tq = atMap.get(msg.channel.id);
  if (tq && checkAnswer(msg.content, tq.answers)) {
    atMap.delete(msg.channel.id);
    const secs = ((Date.now() - tq.start) / 1000).toFixed(1);
    const pts  = Math.max(5, 20 - Math.floor(Number(secs) / 2));
    const tot  = addPts(msg.author.id, msg.author.username, pts);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG_TRANSPARENT).setTitle("✅ إجابة صحيحة ومقبولة!")
        .setDescription(`> **${msg.author.username}** أجاب صح! 🎉\n> الإجابة كانت تشمل: **${tq.answers[0]}**`)
        .addFields(
          { name: "⏱️ الوقت",  value: `\`${secs}s\``, inline: true },
          { name: "🏆 نقاط",   value: `\`+${pts}\``,  inline: true },
          { name: "💰 مجموع",  value: `\`${tot}\``,   inline: true }
        )
    ]});
  }

  // ── الفحص الذكي لإجابة الحرف الناقص ──
  const mq = mlMap.get(msg.channel.id);
  if (mq && checkAnswer(msg.content, mq.wordAnswers)) {
    mlMap.delete(msg.channel.id);
    const pts = 15;
    const tot = addPts(msg.author.id, msg.author.username, pts);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG_TRANSPARENT).setTitle("✅ إجابة صحيحة!")
        .setDescription(`> **${msg.author.username}** عرف الكلمة! 🎉\n> الكلمة المطلوبة: **${mq.wordAnswers[0]}**`)
        .addFields(
          { name: "🏆 نقاط",  value: `\`+${pts}\``, inline: true },
          { name: "💰 مجموع", value: `\`${tot}\``,  inline: true }
        )
    ]});
  }

  // ── فحص سباق الكتابة ──
  const tr = trMap.get(msg.channel.id);
  if (tr && !tr.winner && msg.content.trim() === tr.text) {
    tr.winner = msg.author.id;
    trMap.delete(msg.channel.id);
    const pts = 25;
    const tot = addPts(msg.author.id, msg.author.username, pts);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG_TRANSPARENT).setTitle("🏆 فزت في سباق الكتابة!")
        .setDescription(`> **${msg.author.username}** أول واحد كتب الجملة الصح! 🥇`)
        .addFields(
          { name: "🏆 نقاط",  value: `\`+${pts}\``, inline: true },
          { name: "💰 مجموع", value: `\`${tot}\``,  inline: true }
        )
    ]});
  }

  if (!msg.content.startsWith("!")) return;
  const args = msg.content.slice(1).trim().split(/ +/);
  const cmd  = args[0].toLowerCase();

  if (["menu", "play", "soul", "roulette"].includes(cmd)) {
    return msg.reply({ embeds: [mainMenuEmbed()], components: mainMenuRows() });
  }

  // الأوامر المباشرة عبر الشات (تستخدم نفس محرك الإجابات المرن)
  if (cmd === "trivia") {
    if (atMap.has(msg.channel.id)) return msg.reply("⚠️ في سؤال شغال الحين! جاوب عليه أول.");
    const q = rand(trivia);
    atMap.set(msg.channel.id, { ...q, start: Date.now() });
    setTimeout(() => {
      if (atMap.has(msg.channel.id)) {
        atMap.delete(msg.channel.id);
        msg.channel.send({ embeds: [
          new EmbedBuilder().setColor(DISCORD_BG_TRANSPARENT).setTitle("⏱️ انتهى الوقت!").setDescription(`> الجواب النموذجي هو: **${q.answers[0]}**`)
        ]});
      }
    }, 30000);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG_TRANSPARENT).setTitle("🧠  سؤال Dead by Daylight المطور!")
        .setDescription(`━━━━━━━━━━━━━━━━━━━━━━\n**${q.q}**\n━━━━━━━━━━━━━━━━━━━━━━`)
        .addFields({ name: "💡 تلميح", value: `> ||${q.hint}||` })
        .setFooter({ text: "اكتب الإجابة بأي طريقة؛ البوت ذكي ويقبل كل اللهجات ⏳" })
    ]});
  }
});

// ─── BUTTON HANDLER (التحكم والتنقل بالأزرار الفخمة كلياً) ───────────────────────
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;
  const id = interaction.customId;

  if (id === "menu_back") {
    return interaction.update({ embeds: [mainMenuEmbed()], components: mainMenuRows() });
  }

  if (id === "menu_trivia") {
    if (atMap.has(interaction.channel.id)) return interaction.reply({ content: "⚠️ في سؤال شغال الحين بالروم!", ephemeral: true });
    const q = rand(trivia);
    atMap.set(interaction.channel.id, { ...q, start: Date.now() });
    setTimeout(() => {
      if (atMap.has(interaction.channel.id)) {
        atMap.delete(interaction.channel.id);
        interaction.channel.send({ embeds: [
          new EmbedBuilder().setColor(DISCORD_BG_TRANSPARENT).setTitle("⏱️ انتهى الوقت!").setDescription(`> الجواب الصحيح: **${q.answers[0]}**`)
        ]});
      }
    }, 30000);
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG_TRANSPARENT).setTitle("🧠  سؤال Dead by Daylight المطور!")
        .setDescription(`━━━━━━━━━━━━━━━━━━━━━━\n**${q.q}**\n━━━━━━━━━━━━━━━━━━━━━━`)
        .addFields({ name: "💡 تلميح", value: `> ||${q.hint}||` })
    ], components: [backRow()] });
  }

  if (id === "menu_missing") {
    if (mlMap.has(interaction.channel.id)) return interaction.reply({ content: "⚠️ في سؤال شغال الحين!", ephemeral: true });
    const q = rand(missingLetterWords);
    mlMap.set(interaction.channel.id, { ...q, start: Date.now() });
    setTimeout(() => {
      if (mlMap.has(interaction.channel.id)) {
        mlMap.delete(interaction.channel.id);
        interaction.channel.send({ embeds: [
          new EmbedBuilder().setColor(DISCORD_BG_TRANSPARENT).setTitle("⏱️ انتهى الوقت!").setDescription(`> الكلمة كانت: **${q.wordAnswers[0]}**`)
        ]});
      }
    }, 30000);
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG_TRANSPARENT).setTitle("🔤  حرف ناقص!")
        .setDescription(`━━━━━━━━━━━━━━━━━━━━━━\n# ${q.display}\n━━━━━━━━━━━━━━━━━━━━━━`)
        .addFields({ name: "💡 تلميح", value: `> ${q.hint}` })
    ], components: [backRow()] });
  }

  if (id === "menu_typing") {
    if (trMap.has(interaction.channel.id)) return interaction.reply({ content: "⚠️ في سباق كتابة شغال الحين!", ephemeral: true });
    const text = rand(typingRaces);
    trMap.set(interaction.channel.id, { text, winner: null });
    setTimeout(() => {
      if (trMap.has(interaction.channel.id)) {
        trMap.delete(interaction.channel.id);
        interaction.channel.send({ embeds: [
          new EmbedBuilder().setColor(DISCORD_BG_TRANSPARENT).setTitle("⏱️ انتهى السباق!").setDescription(`> الجملة كانت:\n> **${text}**`)
        ]});
      }
    }, 45000);
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG_TRANSPARENT).setTitle("⌨️  سباق السرعة والكتابة!")
        .setDescription(`━━━━━━━━━━━━━━━━━━━━━━\n**اكتب الجملة التالية بالضبط وبسرعة:**\n\n> ${text}\n━━━━━━━━━━━━━━━━━━━━━━`)
    ], components: [backRow()] });
  }

  if (id === "menu_chase") {
    const s = rand(chaseScenarios);
    acMap.set(interaction.channel.id + interaction.user.id, { s, uid: interaction.user.id, uname: interaction.user.username });
    const row = new ActionRowBuilder().addComponents(
      s.c.map((c, i) => new ButtonBuilder()
        .setCustomId("ch_" + interaction.channel.id + "_" + interaction.user.id + "_" + i)
        .setLabel(c.l)
        .setStyle([ButtonStyle.Primary, ButtonStyle.Secondary, ButtonStyle.Danger][i])
      )
    );
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG_TRANSPARENT).setTitle("⚔️  محاكاة المطاردة والهروب!")
        .setDescription(s.s)
    ], components: [row] });
  }

  if (id === "menu_killers") {
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG_TRANSPARENT).setTitle("🔪  قائمة صيادين الضباب (Killers)")
        .setDescription(killers.map(k => `> ${k.emoji} **${k.name}**  •  ${k.power} (\`${k.difficulty}\`)`).join("\n"))
    ], ephemeral: true });
  }

  if (id === "menu_perks") {
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG_TRANSPARENT).setTitle("✨  أرشيف قدرات البيركات المتوفرة")
        .setDescription(perks.map(p => `> ${p.emoji} **${p.name}**\n> *${p.desc}*`).join("\n\n"))
    ], ephemeral: true });
  }

  if (id === "menu_lb") {
    const sorted = [...lb.values()].sort((a, b) => b.pts - a.pts).slice(0, 10);
    const medals = ["🥇","🥈","🥉"];
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_BG_TRANSPARENT).setTitle("🏆  لوحة المتصدرين الفخمة")
        .setDescription(
          sorted.length
            ? sorted.map((p, i) => `> ${medals[i] || `**${i + 1}.**`}  **${p.name}** — \`${p.pts} نقطة\``).join("\n")
            : "📭 القائمة خالية تماماً، كن أول من يسجل نقاطاً بالجيم!"
        )
    ], ephemeral: true });
  }

  if (id.startsWith("ch_")) {
    const parts  = id.split("_");
    const cid    = parts[1];
    const uid    = parts[2];
    const idx    = parseInt(parts[3]);
    if (interaction.user.id !== uid) return interaction.reply({ content: "❌ التحدي مو لك!", ephemeral: true });
    
    const game = acMap.get(cid + uid);
    if (!game) return interaction.reply({ content: "❌ المطاردة انتهت فعلياً", ephemeral: true });
    acMap.delete(cid + uid);
    
    const choice = game.s.c[idx];
    const tot    = addPts(uid, game.uname, choice.p);
    const again  = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("menu_chase").setLabel("🔄 العب مرة ثانية").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("menu_back").setLabel("🏠 القائمة الرئيسية").setStyle(ButtonStyle.Secondary)
    );
    return interaction.update({ embeds: [
      new EmbedBuilder()
        .setColor(DISCORD_BG_TRANSPARENT)
        .setTitle(choice.p > 0 ? "✅ قرار أسطوري" : choice.p < 0 ? "💀 إسقاط أرضي!" : "😐 هروب صعب")
        .setDescription(`━━━━━━━━━━━━━━━━━━━━━━\n${choice.r}\n━━━━━━━━━━━━━━━━━━━━━━`)
        .addFields(
          { name: "🏆 النقاط",  value: `\`${choice.p >= 0 ? "+" : ""}${choice.p}\``, inline: true },
          { name: "💰 المجموع", value: `\`${tot}\``, inline: true }
        )
    ], components: [again] });
  }
});

// ─── READY ───────────────────────────────────────────────────────────────────
client.once("ready", () => {
  console.log(`✅ SOUL DBD Engine has launched successfully as: ${client.user.tag}`);
  client.user.setActivity("Dead by Daylight | !menu", { type: 0 });
});

client.login(process.env.DISCORD_TOKEN);
