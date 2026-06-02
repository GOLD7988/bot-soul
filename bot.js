const {
  Client, GatewayIntentBits, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, StringSelectMenuBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// ─── CONSTANTS & PREMIUM THEMING ─────────────────────────────────────────────
const LOGO = "https://cdn.discordapp.com/attachments/1510327104041127959/1510647569435332658/IMG_0059.jpg";

// ألوان مخصصة لثيم الديسكورد الداكن لتبدو القائمة مدمجة وشبه شفافة
const DISCORD_TRANSPARENT = 0x2B2D31; 
const GLOW_GOLD           = 0xD4AF37;
const GLOW_PURPLE         = 0x8A2BE2;
const STATUS_GREEN        = 0x2ECC71;
const STATUS_RED          = 0xE74C3C;

// ─── DATA & MULTI-ANSWER DICTIONARIES ────────────────────────────────────────
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

// دمج مصفوفات الإجابات المقبولة (عربي، إنجليزي، نسخ بدون مسافات، فرانكو)
const trivia = [
  { 
    q: "ما هو البيرك اللي يخليك تهرب من ضربة واحدة بالطاقة؟", 
    answers: ["ديد هارد", "ديدهارد", "dead hard", "deadhard", "بيرك ديدهارد"], 
    hint: "يبدأ بحرف الدال أو الـ D" 
  },
  { 
    q: "كم عدد المولدات اللي تحتاج تشغلها للخروج؟", 
    answers: ["5", "خمسة", "خمس", "five"], 
    hint: "رقم بين 4 و6" 
  },
  { 
    q: "ما هي قوة ذا ترابر؟",                        
    answers: ["فخاخ الدببة", "فخاخ الدببه", "فخاخ", "bear traps", "bear trap"], 
    hint: "شي يلتقط القدم" 
  },
  { 
    q: "اسم العملة الأساسية في DBD؟",                 
    answers: ["بلدبوينتس", "بلدبوينت", "بلدپوينتس", "bloodpoints", "bp", "بلد بوينت"], 
    hint: "دم + نقاط" 
  },
  { 
    q: "ما هي قوة ذا نيرس؟",                          
    answers: ["البلنك", "بلنك", "blink", "البلمك"], 
    hint: "تقفز من خلال الجدران" 
  },
  { 
    q: "الكيلر اللي جاي من Resident Evil؟",           
    answers: ["ذا نيميسيس", "نيميسيس", "نمسيس", "nemesis", "ذا نمسيس"], 
    hint: "تي-فيروس" 
  }
];

const missingLetterWords = [
  { wordAnswers: ["ديد هارد", "ديدهارد", "dead hard", "deadhard"], hint: "بيرك سرفايفر مشهور",       display: "د_د ه_رد" },
  { wordAnswers: ["خطاف", "الخطاف", "hook"],                      hint: "يعلق عليه السرفايفر",       display: "خ_اف" },
  { wordAnswers: ["مولد", "المولد", "generator", "gen"],          hint: "تصلحه للخروج",              display: "م_لد" },
  { wordAnswers: ["سرفايفر", "السرفايفر", "survivor"],            hint: "اللاعب اللي يهرب",          display: "س_فا_فر" }
];

const chaseScenarios = [
  {
    s: "🌫️ **سمعت موسيقى الكيلر وهو قريب منك!**\nوش تسوي؟",
    c: [
      { l: "🏃 اركض للـ Loop",       r: "ذكي! كسبت وقت ثمين وأربكت الكيلر",       p: 10 },
      { l: "🙈 اختبأ تحت المولد",    r: "خطأ! وجدك فوراً بسبب السكراتش ماركس",    p: -5 },
      { l: "💨 اركض عشوائي",         r: "محظوظ هذه المرة... لكن ما راح تنجح دايم", p: 0  }
    ]
  }
];

const typingRaces = [
  "أنقذ رفيقك قبل الموت",
  "اصلح المولدات وافتح الباب",
  "الكيلر يطارد السرفايفرز في الضباب"
];

// قاعدة بيانات مصلح مشاكل الألعاب المدمجة (Game Fixer DB)
const gameFixes = {
  dbd_crash: {
    title: "💀 حل مشكلة كراشات Dead by Daylight",
    fix: "1. تحقق من سلامة ملفات اللعبة عبر Steam (Verify integrity).\n2. قم بتحديث كرت الشاشة إلى أحدث إصدار.\n3. قم بتعطيل أي برامج أوفOverlay مثل Discord Overlay أو GeForce Experience."
  },
  eac_error: {
    title: "🛡️ حل خطأ Easy Anti-Cheat (EAC)",
    fix: "1. توجه لمجلد اللعبة وابحث عن مجلد `EasyAntiCheat`.\n2. شغل ملف `EasyAntiCheat_Setup.exe` واضغط على **Repair** (إصلاح).\n3. تأكد من عدم تشغيل أي برامج حماية تمنع عمل الأنتي شيت."
  },
  gtav_loading: {
    title: "🚗 حل مشكلة تعليق تحميل GTA V Online",
    fix: "1. قم بمسح كاش اللعبة ومجلد الـ Social Club في المستندات.\n2. تأكد من تفعيل الـ UPnP في إعدادات الراوتر الخاص بك لضمان اتصال P2P مستقر."
  },
  steam_offline: {
    title: "🎮 مشكلة عدم اتصال Steam بالشبكة",
    fix: "1. اغلق ستيم تماماً من الـ Task Manager.\n2. شغل ستيم كمسؤول (Run as Administrator).\n3. امسح كاش التحميل من إعدادات ستيم (Clear Download Cache)."
  }
};

// ─── STATE ───────────────────────────────────────────────────────────────────
const lb     = new Collection(); 
const atMap  = new Collection(); 
const acMap  = new Collection(); 
const mlMap  = new Collection(); 
const trMap  = new Collection(); 

// ─── HELPERS & STRING NORMALIZATION ──────────────────────────────────────────
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function addPts(id, name, pts) {
  const e = lb.get(id) || { name, pts: 0 };
  e.pts += pts; e.name = name; lb.set(id, e); return e.pts;
}

// دالة سحرية لتنظيف النصوص ومطابقتها مهما اختلف أسلوب الكتابة والعربي والتعريب
function normalizeText(text) {
  if (!text) return "";
  return text.toLowerCase()
    .trim()
    .replace(/[\s_.-]/g, "") // إزالة المسافات والفواصل والرموز
    .replace(/[أإآا]/g, "ا") // توحيد الألفات
    .replace(/ة/g, "ه")     // توحيد التاء المربوطة والهاء
    .replace(/ى/g, "ي")     // توحيد الألف المقصورة والياء
    .replace(/^ال/, "");    // إزالة ال التعريف من بداية الكلمة لعدم العرقلة
}

// دالة فحص الإجابة المدخلة ضد قائمة الإجابات الصحيحة الممكنة
function checkAnswer(userInput, answersArray) {
  const cleanInput = normalizeText(userInput);
  return answersArray.some(ans => normalizeText(ans) === cleanInput || cleanInput.includes(normalizeText(ans)));
}

// ─── PREMIUM UI EMBED BUILDERS ───────────────────────────────────────────────
function mainMenuEmbed() {
  return new EmbedBuilder()
    .setColor(DISCORD_TRANSPARENT)
    .setTitle("✨  SOUL PLATFORM — النظام الذكي والألعاب")
    .setDescription(
      "⚡ **مرحباً بك في لوحة التحكم الفخمة للبوت**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "> 🌌 *تم دمج واجهة البوت الشفافة مع نظام التحقق الشامل لتجربة لعب سلسة وعادلة.*\n\n" +
      "**🛠️ مصلح المشاكل:** يمكنك الآن اختيار حلول كراشات الألعاب مباشرة من القائمة بالأسفل."
    )
    .setImage(LOGO)
    .setFooter({ text: "Premium Gaming Experience • SOUL System" });
}

function mainMenuRows() {
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("menu_trivia").setLabel("🧠 التريفيا المطورة").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("menu_chase").setLabel("⚔️ محاكاة المطاردة").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("menu_missing").setLabel("🔤 حرف ناقص").setStyle(ButtonStyle.Success)
  );
  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("menu_killers").setLabel("🔪 قائمة الكيلرز").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("menu_perks").setLabel("✨ البيركات").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("menu_lb").setLabel("🏆 المتصدرين").setStyle(ButtonStyle.Success)
  );
  
  // قائمة منسدلة فخمة لمصلح مشاكل الألعاب الشائعة
  const fixerRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("game_fixer_menu")
      .setPlaceholder("🛠️ اختر اللعبة أو المشكلة التقنية لإصلاحها فوراً...")
      .addOptions([
        { label: "كراش لعبة Dead by Daylight", value: "dbd_crash", description: "حلول مشاكل الخروج المفاجئ وتجمد الشاشة", emoji: "💀" },
        { label: "خطأ Easy Anti-Cheat", value: "eac_error", description: "حلول فشل تشغيل مانع الغش للمباراة", emoji: "🛡️" },
        { label: "تعليق قراند GTA V Online", value: "gtav_loading", description: "إصلاح مشاكل تعليق شاشات التحميل اللانهائية", emoji: "🚗" },
        { label: "مشاكل اتصال متجر Steam", value: "steam_offline", description: "حل عدم ظهور الأصدقاء والوضع الأوفلاين للستيم", emoji: "🎮" }
      ])
  );

  return [row1, row2, fixerRow];
}

function backRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("menu_back").setLabel("🏠 العودة للقائمة الرئيسية").setStyle(ButtonStyle.Secondary)
  );
}

// ─── MESSAGE HANDLER ─────────────────────────────────────────────────────────
client.on("messageCreate", async msg => {
  if (msg.author.bot) return;

  // ── الفحص المطور للتريفيا الذكية ──
  const tq = atMap.get(msg.channel.id);
  if (tq && checkAnswer(msg.content, tq.answers)) {
    atMap.delete(msg.channel.id);
    const secs = ((Date.now() - tq.start) / 1000).toFixed(1);
    const pts  = Math.max(5, 20 - Math.floor(Number(secs) / 2));
    const tot  = addPts(msg.author.id, msg.author.username, pts);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(STATUS_GREEN).setTitle("🎯 إجابة عبقرية وصحيحة!")
        .setDescription(`> **${msg.author.username}** التقط الإجابة بدقة مذهلة! 🎉\n> الإجابة النموذجية: **${tq.answers[0]}**`)
        .addFields(
          { name: "⏱️ سرعة الرد",  value: `\`${secs} ثانية\``, inline: true },
          { name: "🏆 نقاط المهارة",   value: `\`+${pts}\``,  inline: true },
          { name: "💰 الرصيد الإجمالي",  value: `\`${tot}\``,   inline: true }
        ).setFooter({ text: "Premium Verification System Active 🛡️" })
    ]});
  }

  // ── الفحص المطور للحرف الناقص ──
  const mq = mlMap.get(msg.channel.id);
  if (mq && checkAnswer(msg.content, mq.wordAnswers)) {
    mlMap.delete(msg.channel.id);
    const pts = 15;
    const tot = addPts(msg.author.id, msg.author.username, pts);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(STATUS_GREEN).setTitle("🔤 تم فك التشفير بنجاح!")
        .setDescription(`> **${msg.author.username}** عرف الكلمة المفقودة! 🎉\n> الكلمة هي: **${mq.wordAnswers[0]}**`)
        .addFields(
          { name: "🏆 نقاط الإضافة",  value: `\`+${pts}\``, inline: true },
          { name: "💰 مجموع النقاط", value: `\`${tot}\``,  inline: true }
        )
    ]});
  }

  // ── سباق الكتابة العادي ──
  const tr = trMap.get(msg.channel.id);
  if (tr && !tr.winner && msg.content.trim() === tr.text) {
    tr.winner = msg.author.id;
    trMap.delete(msg.channel.id);
    const pts = 25;
    const tot = addPts(msg.author.id, msg.author.username, pts);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(GLOW_GOLD).setTitle("⌨️ سرعة خارقة في الكتابة!")
        .setDescription(`> **${msg.author.username}** انتصر في سباق السرعة! 🥇`)
        .addFields(
          { name: "🏆 نقاط",  value: `\`+${pts}\``, inline: true },
          { name: "💰 مجموع", value: `\`${tot}\``,  inline: true }
        )
    ]});
  }

  if (!msg.content.startsWith("!")) return;
  const args = msg.content.slice(1).trim().split(/ +/);
  const cmd  = args[0].toLowerCase();

  if (["menu", "play", "soul"].includes(cmd)) {
    return msg.reply({ embeds: [mainMenuEmbed()], components: mainMenuRows() });
  }

  // الأمر المباشر لتشغيل التريفيا المطورة
  if (cmd === "trivia") {
    if (atMap.has(msg.channel.id)) return msg.reply("⚠️ هناك تحدي نشط في هذه القناة بالفعل!");
    const q = rand(trivia);
    atMap.set(msg.channel.id, { ...q, start: Date.now() });
    setTimeout(() => {
      if (atMap.has(msg.channel.id)) {
        atMap.delete(msg.channel.id);
        msg.channel.send({ embeds: [
          new EmbedBuilder().setColor(STATUS_RED).setTitle("⏱️ انتهى وقت التحدي!")
            .setDescription(`> لم يعرف أحد الإجابة الصحيحة. الإجابة المقبولة كانت تشمل: **${q.answers.join(" / ")}**`)
        ]});
      }
    }, 30000);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(GLOW_PURPLE).setTitle("🧠  مسابقة الذكاء والسرعة المطورة")
        .setDescription(`━━━━━━━━━━━━━━━━━━━━━━\n### ${q.q}\n━━━━━━━━━━━━━━━━━━━━━━`)
        .addFields({ name: "💡 تلميح تقريبي", value: `> ||${q.hint}||` })
        .setFooter({ text: "البوت يقبل الإجابة بالعربي، الإنجليزي، أو الفرانكو والنسخ! ⏳" })
    ]});
  }
});

// ─── INTERACTION HANDLER (BUTTONS & SELECT MENUS) ───────────────────────────
client.on("interactionCreate", async interaction => {
  
  // ── التعامل مع قائمة مصلح المشاكل التقنية (Game Fixer Interaction) ──
  if (interaction.isStringSelectMenu() && interaction.customId === "game_fixer_menu") {
    const selectedGame = interaction.values[0];
    const fixData = gameFixes[selectedGame];
    
    if (!fixData) return interaction.reply({ content: "❌ لم يتم العثور على حل لهذه المشكلة.", ephemeral: true });

    const fixEmbed = new EmbedBuilder()
      .setColor(GLOW_GOLD)
      .setTitle(fixData.title)
      .setDescription(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "### 🛠️ خطوات الإصلاح التقني والمجرب:\n" +
        fixData.fix + 
        "\n━━━━━━━━━━━━━━━━━━━━━━"
      )
      .setFooter({ text: "نظام الدعم الفني الآلي للألعاب • SOUL Fixer" });

    return interaction.reply({ embeds: [fixEmbed], ephemeral: true });
  }

  if (!interaction.isButton()) return;
  const id = interaction.customId;

  if (id === "menu_back") {
    return interaction.update({ embeds: [mainMenuEmbed()], components: mainMenuRows() });
  }

  if (id === "menu_trivia") {
    if (atMap.has(interaction.channel.id)) {
      return interaction.reply({ content: "⚠️ هناك مسابقة شغال الآن في الروم!", ephemeral: true });
    }
    const q = rand(trivia);
    atMap.set(interaction.channel.id, { ...q, start: Date.now() });
    setTimeout(() => {
      if (atMap.has(interaction.channel.id)) {
        atMap.delete(interaction.channel.id);
        interaction.channel.send({ embeds: [
          new EmbedBuilder().setColor(STATUS_RED).setTitle("⏱️ انتهى الوقت!").setDescription(`> الإجابة المقبولة كانت: **${q.answers[0]}**`)
        ]});
      }
    }, 30000);
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(GLOW_PURPLE).setTitle("🧠  مسابقة الذكاء والسرعة المطورة")
        .setDescription(`━━━━━━━━━━━━━━━━━━━━━━\n### ${q.q}\n━━━━━━━━━━━━━━━━━━━━━━`)
        .addFields({ name: "💡 تلميح تقريبي", value: `> ||${q.hint}||` })
        .setFooter({ text: "نظام التحقق يقبل العربي، الإنجليزي، والتعريب المنسوخ!" })
    ], components: [backRow()] });
  }

  if (id === "menu_missing") {
    if (mlMap.has(interaction.channel.id)) {
      return interaction.reply({ content: "⚠️ في سؤال شغال الحين!", ephemeral: true });
    }
    const q = rand(missingLetterWords);
    mlMap.set(interaction.channel.id, { ...q, start: Date.now() });
    setTimeout(() => {
      if (mlMap.has(interaction.channel.id)) {
        mlMap.delete(interaction.channel.id);
        interaction.channel.send({ embeds: [
          new EmbedBuilder().setColor(STATUS_RED).setTitle("⏱️ انتهى الوقت!").setDescription(`> الكلمة هي: **${q.wordAnswers[0]}**`)
        ]});
      }
    }, 30000);
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(GLOW_PURPLE).setTitle("🔤  تحدي الحرف الناقص المطور")
        .setDescription(`━━━━━━━━━━━━━━━━━━━━━━\n# ${q.display}\n━━━━━━━━━━━━━━━━━━━━━━`)
        .addFields({ name: "💡 تلميح مساعد", value: `> ${q.hint}` })
        .setFooter({ text: "اكتب الكلمة كاملة وبأي لغة تناسبك!" })
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
      new EmbedBuilder().setColor(DISCORD_TRANSPARENT).setTitle("⚔️  محاكاة وضع المطاردة")
        .setDescription(s.s).setFooter({ text: "حدد قرارك الفوري بأزرار التحكم 👁️" })
    ], components: [row] });
  }

  if (id === "menu_killers") {
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_TRANSPARENT).setTitle("🔪 قائمة كيلرز الضباب")
        .setDescription(killers.map(k => `> ${k.emoji} **${k.name}** •  *${k.power}* [${k.difficulty}]`).join("\n"))
    ], ephemeral: true });
  }

  if (id === "menu_perks") {
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(DISCORD_TRANSPARENT).setTitle("✨ أرشيف قدرات وبيركات اللعبة")
        .setDescription(perks.map(p => `> ${p.emoji} **${p.name}** •  ${p.desc}`).join("\n"))
    ], ephemeral: true });
  }

  if (id === "menu_lb") {
    const sorted = [...lb.values()].sort((a, b) => b.pts - a.pts).slice(0, 10);
    const medals = ["🥇","🥈","🥉"];
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(GLOW_GOLD).setTitle("🏆  لوحة أساطير السيرفر المتصدرين")
        .setDescription(
          sorted.length
            ? sorted.map((p, i) => `> ${medals[i] || `**${i + 1}.**`} **${p.name}** — \`${p.pts} نقطة\``).join("\n")
            : "📭 اللوحة فارغة تماماً حتى الآن، ابدأ اللعب واثبت جدارتك!"
        )
    ], ephemeral: true });
  }

  if (id.startsWith("ch_")) {
    const parts  = id.split("_");
    const cid    = parts[1];
    const uid    = parts[2];
    const idx    = parseInt(parts[3]);
    if (interaction.user.id !== uid) return interaction.reply({ content: "❌ هذه المطاردة مخصصة لشخص آخر!", ephemeral: true });
    
    const game = acMap.get(cid + uid);
    if (!game) return interaction.reply({ content: "❌ انتهت الجلسة أو غير صالحة.", ephemeral: true });
    acMap.delete(cid + uid);
    
    const choice = game.s.c[idx];
    const tot    = addPts(uid, game.uname, choice.p);
    const again  = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("menu_chase").setLabel("🔄 العب مجدداً").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("menu_back").setLabel("🏠 القائمة").setStyle(ButtonStyle.Secondary)
    );
    return interaction.update({ embeds: [
      new EmbedBuilder()
        .setColor(choice.p > 0 ? STATUS_GREEN : choice.p < 0 ? STATUS_RED : DISCORD_TRANSPARENT)
        .setTitle(choice.p > 0 ? "✅  نتيجة ممتازة وقرار تكتيكي!" : choice.p < 0 ? "💀  تم الإطاحة بك!" : "😐  نجوت بصعوبة...")
        .setDescription("━━━━━━━━━━━━━━━━━━━━━━\n" + choice.r + "\n━━━━━━━━━━━━━━━━━━━━━━")
        .addFields(
          { name: "🏆 النقاط المكتسبة",  value: `> \`${choice.p >= 0 ? "+" : ""}${choice.p}\``, inline: true },
          { name: "💰 رصيدك الكلي", value: `> \`${tot}\``, inline: true }
        )
    ], components: [again] });
  }
});

// ─── READY EVENT ─────────────────────────────────────────────────────────────
client.once("ready", () => {
  console.log("=================================================");
  console.log(`✅ SOUL ENGINE IS ONLINE: ${client.user.tag}`);
  console.log("=================================================");
  client.user.setActivity("Dead by Daylight | !menu", { type: 0 });
});

client.login(process.env.DISCORD_TOKEN);
