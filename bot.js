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

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const LOGO = "https://cdn.discordapp.com/attachments/1510327104041127959/1510647569435332658/IMG_0059.jpg";
const RED   = 0xB22222;
const BLUE  = 0x1a6bff;
const GOLD  = 0xFFD700;
const GREEN = 0x00FF88;
const GREY  = 0x555555;

// ─── DATA ────────────────────────────────────────────────────────────────────
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
  { name: "ذا غوست فيس",     power: "نايت شراود",             difficulty: "متوسط",  emoji: "👤" },
  { name: "ذا كلاون",        power: "ذا غاسر",                difficulty: "مبتدئ",  emoji: "🎪" },
  { name: "ذا ليجن",         power: "فيرال فرنزي",            difficulty: "مبتدئ",  emoji: "😷" },
  { name: "ذا أوني",         power: "يامائوكا رايث",          difficulty: "خبير",   emoji: "🎭" },
  { name: "ذا ديثسلينجر",    power: "ريدييمر",                difficulty: "متوسط",  emoji: "🔫" },
  { name: "ذا ترايكستر",     power: "شوستوپر",                difficulty: "متوسط",  emoji: "🎯" },
  { name: "ذا دوكتور",       power: "ستاتيك بلاست",           difficulty: "متوسط",  emoji: "⚡" },
  { name: "ذا ريث",          power: "رايث ووكينج",            difficulty: "مبتدئ",  emoji: "💨" },
  { name: "ذا هيلبيلي",      power: "چين سو چارچ",            difficulty: "متوسط",  emoji: "⚙️" },
  { name: "ذا ويچ",          power: "كيرس اوبسيشن",           difficulty: "خبير",   emoji: "🕯️" },
  { name: "ذا تونلتريست",    power: "اليرت",                  difficulty: "خبير",   emoji: "🕸️" }
];

const perks = [
  { name: "ديد هارد",              type: "survivor", emoji: "💨", desc: "تهرب من ضربة واحدة بالطاقة" },
  { name: "ديسيسيف ستريك",         type: "survivor", emoji: "🗡️", desc: "بعد الإنقاذ اضرب الكيلر وافلت" },
  { name: "سيلف كير",              type: "survivor", emoji: "🩹", desc: "اشفي نفسك بدون صندوق إسعاف" },
  { name: "أدرينالين",             type: "survivor", emoji: "⚡", desc: "لما آخر مولد يشتغل تشتفي وتجري أسرع" },
  { name: "أنبريكبل",              type: "survivor", emoji: "💪", desc: "قوم من الأرض لوحدك مرة واحدة" },
  { name: "سپرنت برست",            type: "survivor", emoji: "🏃", desc: "أسرع بشكل مفاجئ عند أول ركضة" },
  { name: "سپاين شيل",             type: "survivor", emoji: "🥶", desc: "تحس لما الكيلر يشوفك مباشرة" },
  { name: "بوروود تايم",           type: "survivor", emoji: "⏳", desc: "الشخص اللي أنقذته يأخذ حماية إضافية" },
  { name: "نود",                   type: "killer",   emoji: "💀", desc: "بعد آخر مولد ضربة واحدة تعطل السرفايفر" },
  { name: "كوراپت انترفينشن",      type: "killer",   emoji: "🚫", desc: "ثلاث مولدات تتحجب في البداية" },
  { name: "باربيكيو آند شيلي",     type: "killer",   emoji: "🔥", desc: "بعد الخطاف تشوف كل السرفايفرز من بعيد" },
  { name: "پوپ غوز ذا ويزل",      type: "killer",   emoji: "💥", desc: "بعد الخطاف خرب مولد بشدة" },
  { name: "هيكس رين",              type: "killer",   emoji: "🕯️", desc: "المولدات تتراجع لوحدها" },
  { name: "ثاناتوفوبيا",           type: "killer",   emoji: "🩸", desc: "كل سرفايفر مجروح يبطئ المولدات" },
  { name: "بروتيكتيف پوز",         type: "killer",   emoji: "👁️", desc: "تشوف الأوراك اللي يتعمل على أوبسيشن" },
  { name: "اسنيك ستيلث",          type: "killer",   emoji: "🐍", desc: "يبطئ موسيقاك لما تمشي" }
];

const trivia = [
  { q: "كم عدد المولدات اللي تحتاج تشغلها للخروج؟", a: "5",           hint: "رقم بين 4 و6" },
  { q: "ما هي قوة ذا ترابر؟",                        a: "فخاخ الدببة", hint: "شي يلتقط القدم" },
  { q: "كم ضربة تحتاج الكيلر قبل ما تقع على الأرض؟", a: "2",           hint: "ضربة + ضربة" },
  { q: "اسم العملة الأساسية في DBD؟",                 a: "بلدپوينتس",   hint: "دم + نقاط" },
  { q: "كم سرفايفر في كل مباراة؟",                    a: "4",           hint: "أقل من 5 وأكثر من 3" },
  { q: "ما هي قوة ذا نيرس؟",                          a: "البلنك",      hint: "تقفز من خلال الجدران" },
  { q: "الكيلر اللي جاي من Resident Evil؟",           a: "ذا نيميسيس",  hint: "تي-فيروس" },
  { q: "ما هو البيرك اللي يخليك تقوم لوحدك؟",         a: "أنبريكبل",    hint: "4 حروف بالإنجليزي" },
  { q: "كم مولد يتحجب مع كوراپت انترفينشن؟",         a: "3",           hint: "ثلاث" },
  { q: "ما هو بيرك الكيلر الأشهر لرؤية السرفايفرز؟", a: "باربيكيو آند شيلي", hint: "شواء + جبن" },
  { q: "كم باب في المباراة الواحدة؟",                  a: "2",           hint: "باب + باب" },
  { q: "ما اسم قوة ذا سبيريت؟",                       a: "يامائوكا هونتنج", hint: "اسم ياباني" },
  { q: "ما هو البيرك اللي يخليك تجري سريع فجأة؟",     a: "سپرنت برست", hint: "انطلاق مفاجئ" },
  { q: "ما اسم الكيان في DBD؟",                        a: "ذا إنتيتي",   hint: "The ..." },
  { q: "كم خطاف تحتاج قبل يموت السرفايفر؟",          a: "3",           hint: "المرحلة الأولى والثانية والثالثة" },
  { q: "ما هي قوة ذا بلايت؟",                          a: "بلايتد كوراپشن", hint: "يجري بسرعة عالية" },
  { q: "الكيلر اللي يستخدم الفؤوس؟",                  a: "ذا هنتريس",   hint: "امرأة من الغابة" },
  { q: "ما البيرك اللي يبطئ المولدات لما السرفايفرز مجروحين؟", a: "ثاناتوفوبيا", hint: "خوف الموت" },
  { q: "كيلر جاء من Saw؟",                             a: "ذا پيگ",      hint: "الخنزير" },
  { q: "ما اسم قوة ذا كلاون؟",                         a: "ذا غاسر",     hint: "غاز مضحك" }
];

const chaseScenarios = [
  {
    s: "🌫️ **سمعت موسيقى الكيلر وهو قريب منك!**\nوش تسوي؟",
    c: [
      { l: "🏃 اركض للـ Loop",       r: "ذكي! كسبت وقت ثمين وأربكت الكيلر",       p: 10 },
      { l: "🙈 اختبأ تحت المولد",    r: "خطأ! وجدك فوراً بسبب السكراتش ماركس",    p: -5 },
      { l: "💨 اركض عشوائي",         r: "محظوظ هذه المرة... لكن ما راح تنجح دايم", p: 0  }
    ]
  },
  {
    s: "⛽ **تصلح مولد ورأيت الكيلر يقترب!**\nوش تسوي؟",
    c: [
      { l: "⚡ أكمل بسرعة",          r: "أنجزت المولد قبل وصوله وهربت!",           p: 15 },
      { l: "🚶 اترك واختبأ",          r: "نجوت لكن المولد تأخر كثير",               p: 5  },
      { l: "😤 خاطر وابقى",           r: "ضربة! كانت مخاطرة غير محسوبة",            p: -10 }
    ]
  },
  {
    s: "🪝 **رفيقك على الخطاف والكيلر واقف بجانبه!**\nوش تسوي؟",
    c: [
      { l: "🤝 أنقذه فوراً",          r: "أنقذته لكن خذيت ضربة قوية",               p: -5 },
      { l: "⏳ انتظر الكيلر يمشي",   r: "صبرت وأنقذته بأمان! قرار حكيم",           p: 20 },
      { l: "🔧 اصلح مولد بعيد",      r: "مولد اشتغل لكن رفيقك مات على الخطاف",    p: 5  }
    ]
  },
  {
    s: "🚪 **الباب اشتغل والكيلر قريب منك!**\nوش تسوي؟",
    c: [
      { l: "🏃 اركض للباب مباشرة",   r: "وصلت! نجوت من المباراة",                  p: 20 },
      { l: "🕵️ تمسكن وانتظر",        r: "الكيلر وجدك وضربك قبل الباب",             p: -15 },
      { l: "📦 اختبأ في صندوق",       r: "الكيلر فتش المنطقة وما لقاك، نجوت لاحقاً", p: 10 }
    ]
  },
  {
    s: "⚕️ **أنت مجروح ورفيقك يحاول يشفيك والكيلر قريب!**\nوش تسوي؟",
    c: [
      { l: "✅ أكمل الشفاء",         r: "اشتفيت! الكيلر وصل لكنك هربت بصحة كاملة", p: 15 },
      { l: "❌ اهرب لوحدك",           r: "تركت رفيقك وهرب الكيلر وراك بسرعة",       p: -5 },
      { l: "🔔 نبّه رفيقك وهرب",     r: "رفيقك هرب وأنت أيضاً، نجحت معاً",        p: 10 }
    ]
  }
];

// الكلمات المشفرة (حرف ناقص)
const missingLetterWords = [
  { word: "ديد هارد",     hint: "بيرك سرفايفر مشهور",       display: "د_د ه_رد" },
  { word: "خطاف",         hint: "يعلق عليه السرفايفر",       display: "خ_اف" },
  { word: "مولد",         hint: "تصلحه للخروج",              display: "م_لد" },
  { word: "سرفايفر",      hint: "اللاعب اللي يهرب",          display: "س_فا_فر" },
  { word: "الإنتيتي",     hint: "الكيان الشرير في اللعبة",   display: "الإ_تيتي" },
  { word: "بلدپوينتس",    hint: "العملة الأساسية",           display: "بلد_وي_تس" },
  { word: "كيلر",         hint: "يطارد السرفايفرز",          display: "ك_لر" },
  { word: "هنتريس",       hint: "تلقي فؤوس",                 display: "ه_ترس" },
  { word: "ترابر",        hint: "يضع فخاخ الدببة",           display: "تر_بر" },
  { word: "نيميسيس",      hint: "من Resident Evil",         display: "ن_ميس_س" }
];

// سباق الكتابة
const typingRaces = [
  "أنقذ رفيقك قبل الموت",
  "اصلح المولدات وافتح الباب",
  "الكيلر يطارد السرفايفرز في الضباب",
  "ديد هارد بيرك قوي جداً",
  "هرب من الخطاف قبل المرحلة الثالثة"
];

// ─── STATE ───────────────────────────────────────────────────────────────────
const lb     = new Collection(); // leaderboard
const atMap  = new Collection(); // active trivia   channel -> question
const acMap  = new Collection(); // active chase    channel+uid -> game
const mlMap  = new Collection(); // active missing  channel -> question
const trMap  = new Collection(); // active typing   channel -> race

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function addPts(id, name, pts) {
  const e = lb.get(id) || { name, pts: 0 };
  e.pts += pts; e.name = name; lb.set(id, e); return e.pts;
}

// ─── MENU BUILDERS ───────────────────────────────────────────────────────────
function mainMenuEmbed() {
  return new EmbedBuilder()
    .setColor(BLUE)
    .setTitle("🩸  SOUL DBD — القائمة الرئيسية")
    .setDescription("> 🌫️ *The Entity is watching...*\n> 🎮 اختار اللعبة اللي تبيها 👇")
    .setImage(LOGO)
    .setFooter({ text: "SOUL Dead by Daylight Server 🔪" });
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
    new ButtonBuilder().setCustomId("build_survivor").setLabel("🏃 بيلد سرفايفر").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("build_killer").setLabel("🔪 بيلد كيلر").setStyle(ButtonStyle.Danger),
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

  // ── Trivia answer check ──
  const tq = atMap.get(msg.channel.id);
  if (tq && msg.content.toLowerCase().includes(tq.a.toLowerCase())) {
    atMap.delete(msg.channel.id);
    const secs = ((Date.now() - tq.start) / 1000).toFixed(1);
    const pts  = Math.max(5, 20 - Math.floor(Number(secs) / 2));
    const tot  = addPts(msg.author.id, msg.author.username, pts);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(GREEN).setTitle("✅ إجابة صحيحة!")
        .setDescription("> **" + msg.author.username + "** أجاب صح! 🎉")
        .addFields(
          { name: "⏱️ الوقت",  value: "`" + secs + "s`", inline: true },
          { name: "🏆 نقاط",   value: "`+" + pts + "`",  inline: true },
          { name: "💰 مجموع",  value: "`" + tot + "`",   inline: true }
        ).setFooter({ text: "The Entity is pleased... 👁️" })
    ]});
  }

  // ── Missing letter answer check ──
  const mq = mlMap.get(msg.channel.id);
  if (mq && msg.content.trim() === mq.word) {
    mlMap.delete(msg.channel.id);
    const pts = 15;
    const tot = addPts(msg.author.id, msg.author.username, pts);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(GREEN).setTitle("✅ إجابة صحيحة!")
        .setDescription("> **" + msg.author.username + "** عرف الكلمة! 🎉\n> الكلمة كانت: **" + mq.word + "**")
        .addFields(
          { name: "🏆 نقاط",  value: "`+" + pts + "`", inline: true },
          { name: "💰 مجموع", value: "`" + tot + "`",  inline: true }
        )
    ]});
  }

  // ── Typing race check ──
  const tr = trMap.get(msg.channel.id);
  if (tr && !tr.winner && msg.content.trim() === tr.text) {
    tr.winner = msg.author.id;
    trMap.delete(msg.channel.id);
    const pts = 25;
    const tot = addPts(msg.author.id, msg.author.username, pts);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(GOLD).setTitle("🏆 فزت في سباق الكتابة!")
        .setDescription("> **" + msg.author.username + "** أول واحد كتب الجملة الصح! 🥇")
        .addFields(
          { name: "🏆 نقاط",  value: "`+" + pts + "`", inline: true },
          { name: "💰 مجموع", value: "`" + tot + "`",  inline: true }
        )
    ]});
  }

  if (!msg.content.startsWith("!")) return;
  const args = msg.content.slice(1).trim().split(/ +/);
  const cmd  = args[0].toLowerCase();

  // ── !menu ──
  if (["menu", "play", "soul"].includes(cmd)) {
    return msg.reply({ embeds: [mainMenuEmbed()], components: mainMenuRows() });
  }

  // ── !help ──
  if (cmd === "help") {
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(BLUE).setTitle("🩸 SOUL DBD Bot — المساعدة")
        .setDescription("> اكتب `!menu` لتفتح القائمة الكاملة بالأزرار!\n\n**أو استخدم الأوامر مباشرة:**")
        .addFields(
          { name: "🎮 ألعاب",     value: "> `!trivia`  `!chase`  `!missing`  `!typing`" },
          { name: "📚 معلومات",   value: "> `!killer`  `!killers`  `!perk`  `!perks`" },
          { name: "🎰 بيلد",     value: "> `!build killer`  `!build survivor`" },
          { name: "🏆 ليدربورد", value: "> `!lb`" }
        ).setFooter({ text: "SOUL DBD 🔪 | The fog never forgives" })
    ]});
  }

  // ── !trivia ──
  if (cmd === "trivia") {
    if (atMap.has(msg.channel.id)) return msg.reply("⚠️ في سؤال شغال الحين! جاوب عليه أول.");
    const q = rand(trivia);
    atMap.set(msg.channel.id, { ...q, start: Date.now() });
    setTimeout(() => {
      if (atMap.has(msg.channel.id)) {
        atMap.delete(msg.channel.id);
        msg.channel.send({ embeds: [
          new EmbedBuilder().setColor(GREY).setTitle("⏱️ انتهى الوقت!")
            .setDescription("> الجواب كان: **" + q.a + "**")
        ]});
      }
    }, 30000);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(RED).setTitle("🧠  سؤال Dead by Daylight!")
        .setDescription("━━━━━━━━━━━━━━━━━━━━━━\n**" + q.q + "**\n━━━━━━━━━━━━━━━━━━━━━━")
        .addFields({ name: "💡 تلميح", value: "> ||" + q.hint + "||" })
        .setFooter({ text: "اكتب إجابتك مباشرة! عندك 30 ثانية ⏳" })
    ]});
  }

  // ── !chase ──
  if (cmd === "chase") {
    const s = rand(chaseScenarios);
    acMap.set(msg.channel.id + msg.author.id, { s, uid: msg.author.id, uname: msg.author.username });
    const row = new ActionRowBuilder().addComponents(
      s.c.map((c, i) => new ButtonBuilder()
        .setCustomId("ch_" + msg.channel.id + "_" + msg.author.id + "_" + i)
        .setLabel(c.l)
        .setStyle([ButtonStyle.Primary, ButtonStyle.Secondary, ButtonStyle.Danger][i])
      )
    );
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(RED).setTitle("⚔️  محاكاة المطاردة!")
        .setDescription(s.s).setFooter({ text: "اختر قرارك بحكمة 👁️" })
    ], components: [row] });
  }

  // ── !missing ──
  if (cmd === "missing") {
    if (mlMap.has(msg.channel.id)) return msg.reply("⚠️ في سؤال شغال الحين!");
    const q = rand(missingLetterWords);
    mlMap.set(msg.channel.id, { ...q, start: Date.now() });
    setTimeout(() => {
      if (mlMap.has(msg.channel.id)) {
        mlMap.delete(msg.channel.id);
        msg.channel.send({ embeds: [
          new EmbedBuilder().setColor(GREY).setTitle("⏱️ انتهى الوقت!")
            .setDescription("> الجواب كان: **" + q.word + "**")
        ]});
      }
    }, 30000);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(0x9B59B6).setTitle("🔤  حرف ناقص!")
        .setDescription("━━━━━━━━━━━━━━━━━━━━━━\n# " + q.display + "\n━━━━━━━━━━━━━━━━━━━━━━")
        .addFields({ name: "💡 تلميح", value: "> " + q.hint })
        .setFooter({ text: "اكتب الكلمة الكاملة! عندك 30 ثانية ⏳" })
    ]});
  }

  // ── !typing ──
  if (cmd === "typing") {
    if (trMap.has(msg.channel.id)) return msg.reply("⚠️ في سباق شغال الحين!");
    const text = rand(typingRaces);
    trMap.set(msg.channel.id, { text, winner: null });
    setTimeout(() => {
      if (trMap.has(msg.channel.id)) {
        trMap.delete(msg.channel.id);
        msg.channel.send({ embeds: [
          new EmbedBuilder().setColor(GREY).setTitle("⏱️ انتهى السباق!")
            .setDescription("> ما فاز أحد! الجملة كانت:\n> **" + text + "**")
        ]});
      }
    }, 45000);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(GOLD).setTitle("⌨️  سباق الكتابة!")
        .setDescription("━━━━━━━━━━━━━━━━━━━━━━\n**اكتب هذه الجملة بالضبط:**\n\n> " + text + "\n\n━━━━━━━━━━━━━━━━━━━━━━")
        .setFooter({ text: "أول واحد يكتبها صح يفوز! عندك 45 ثانية ⌨️" })
    ]});
  }

  // ── !killer ──
  if (cmd === "killer") {
    const k = rand(killers);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(RED).setTitle(k.emoji + "  " + k.name)
        .addFields(
          { name: "⚡ القوة",      value: "> " + k.power,      inline: true },
          { name: "🎯 الصعوبة",   value: "> " + k.difficulty, inline: true }
        ).setFooter({ text: "استخدم !killers لقائمة كاملة" })
    ]});
  }

  // ── !killers ──
  if (cmd === "killers") {
    const b = killers.filter(k => k.difficulty === "مبتدئ");
    const m = killers.filter(k => k.difficulty === "متوسط");
    const e = killers.filter(k => k.difficulty === "خبير");
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(RED).setTitle("🔪  قائمة الكيلرز — SOUL DBD")
        .addFields(
          { name: "🟢  مبتدئ", value: b.map(k => "> " + k.emoji + " **" + k.name + "**  •  " + k.power).join("\n") },
          { name: "🟡  متوسط", value: m.map(k => "> " + k.emoji + " **" + k.name + "**  •  " + k.power).join("\n") },
          { name: "🔴  خبير",  value: e.map(k => "> " + k.emoji + " **" + k.name + "**  •  " + k.power).join("\n") }
        ).setFooter({ text: "!killer لكيلر عشوائي 🎲" })
    ]});
  }

  // ── !perk ──
  if (cmd === "perk") {
    const p = rand(perks);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(p.type === "killer" ? RED : 0xFF8C00)
        .setTitle(p.emoji + "  " + p.name)
        .addFields(
          { name: "📋 الوصف", value: "> " + p.desc },
          { name: "👤 النوع",  value: "> " + (p.type === "killer" ? "🔪 كيلر" : "🏃 سرفايفر"), inline: true }
        ).setFooter({ text: "!perks لقائمة كاملة" })
    ]});
  }

  // ── !perks ──
  if (cmd === "perks") {
    const s = perks.filter(p => p.type === "survivor");
    const k = perks.filter(p => p.type === "killer");
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(0xFF8C00).setTitle("✨  قائمة البيركات — SOUL DBD")
        .addFields(
          { name: "🏃  بيركات السرفايفر", value: s.map(p => "> " + p.emoji + " **" + p.name + "**\n> " + p.desc).join("\n\n") },
          { name: "🔪  بيركات الكيلر",    value: k.map(p => "> " + p.emoji + " **" + p.name + "**\n> " + p.desc).join("\n\n") }
        ).setFooter({ text: "!perk لبيرك عشوائي 🎲" })
    ]});
  }

  // ── !build ──
  if (cmd === "build") {
    const type  = (args[1] || "").toLowerCase() === "killer" ? "killer" : "survivor";
    const pool  = perks.filter(p => p.type === type);
    const picked = [];
    const copy   = [...pool];
    while (picked.length < 4 && copy.length) picked.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(type === "killer" ? RED : 0xFF8C00)
        .setTitle("🎰  بيلد " + (type === "killer" ? "كيلر 🔪" : "سرفايفر 🏃") + " عشوائي!")
        .setDescription(picked.map((p, i) => "**" + ["1️⃣","2️⃣","3️⃣","4️⃣"][i] + "  " + p.emoji + " " + p.name + "**\n> " + p.desc).join("\n\n"))
        .setFooter({ text: "SOUL DBD 🔪" })
    ]});
  }

  // ── !lb ──
  if (["lb", "leaderboard"].includes(cmd)) {
    const sorted = [...lb.values()].sort((a, b) => b.pts - a.pts).slice(0, 10);
    if (!sorted.length) return msg.reply("📭 اللوحة فارغة! العب `!trivia` أو غيره.");
    const medals = ["🥇","🥈","🥉"];
    return msg.reply({ embeds: [
      new EmbedBuilder().setColor(GOLD).setTitle("🏆  لوحة المتصدرين — SOUL DBD")
        .setDescription(
          "━━━━━━━━━━━━━━━━━━━━━━\n" +
          sorted.map((p, i) => (medals[i] || "**" + (i + 1) + ".**") + "  **" + p.name + "**\n> 💰 " + p.pts + " نقطة").join("\n\n") +
          "\n━━━━━━━━━━━━━━━━━━━━━━"
        ).setFooter({ text: "The Entity rewards the worthy 👁️" })
    ]});
  }
});

// ─── BUTTON HANDLER ──────────────────────────────────────────────────────────
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;
  const id = interaction.customId;

  // ── Back to menu ──
  if (id === "menu_back") {
    return interaction.update({ embeds: [mainMenuEmbed()], components: mainMenuRows() });
  }

  // ── Trivia ──
  if (id === "menu_trivia") {
    if (atMap.has(interaction.channel.id)) {
      return interaction.reply({ content: "⚠️ في سؤال شغال الحين!", ephemeral: true });
    }
    const q = rand(trivia);
    atMap.set(interaction.channel.id, { ...q, start: Date.now() });
    setTimeout(() => {
      if (atMap.has(interaction.channel.id)) {
        atMap.delete(interaction.channel.id);
        interaction.channel.send({ embeds: [
          new EmbedBuilder().setColor(GREY).setTitle("⏱️ انتهى الوقت!").setDescription("> الجواب كان: **" + q.a + "**")
        ]});
      }
    }, 30000);
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(RED).setTitle("🧠  سؤال Dead by Daylight!")
        .setDescription("━━━━━━━━━━━━━━━━━━━━━━\n**" + q.q + "**\n━━━━━━━━━━━━━━━━━━━━━━")
        .addFields({ name: "💡 تلميح", value: "> ||" + q.hint + "||" })
        .setFooter({ text: "اكتب إجابتك مباشرة! عندك 30 ثانية ⏳" })
    ], components: [backRow()] });
  }

  // ── Chase ──
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
      new EmbedBuilder().setColor(RED).setTitle("⚔️  محاكاة المطاردة!")
        .setDescription(s.s).setFooter({ text: "اختر قرارك بحكمة 👁️" })
    ], components: [row] });
  }

  // ── Missing Letter ──
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
          new EmbedBuilder().setColor(GREY).setTitle("⏱️ انتهى الوقت!").setDescription("> الجواب كان: **" + q.word + "**")
        ]});
      }
    }, 30000);
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(0x9B59B6).setTitle("🔤  حرف ناقص!")
        .setDescription("━━━━━━━━━━━━━━━━━━━━━━\n# " + q.display + "\n━━━━━━━━━━━━━━━━━━━━━━")
        .addFields({ name: "💡 تلميح", value: "> " + q.hint })
        .setFooter({ text: "اكتب الكلمة الكاملة! عندك 30 ثانية ⏳" })
    ], components: [backRow()] });
  }

  // ── Typing Race ──
  if (id === "menu_typing") {
    if (trMap.has(interaction.channel.id)) {
      return interaction.reply({ content: "⚠️ في سباق شغال الحين!", ephemeral: true });
    }
    const text = rand(typingRaces);
    trMap.set(interaction.channel.id, { text, winner: null });
    setTimeout(() => {
      if (trMap.has(interaction.channel.id)) {
        trMap.delete(interaction.channel.id);
        interaction.channel.send({ embeds: [
          new EmbedBuilder().setColor(GREY).setTitle("⏱️ انتهى السباق!").setDescription("> ما فاز أحد! الجملة كانت:\n> **" + text + "**")
        ]});
      }
    }, 45000);
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(GOLD).setTitle("⌨️  سباق الكتابة!")
        .setDescription("━━━━━━━━━━━━━━━━━━━━━━\n**اكتب هذه الجملة بالضبط:**\n\n> " + text + "\n\n━━━━━━━━━━━━━━━━━━━━━━")
        .setFooter({ text: "أول واحد يكتبها صح يفوز! عندك 45 ثانية ⌨️" })
    ], components: [backRow()] });
  }

  // ── Killers list ──
  if (id === "menu_killers") {
    const b = killers.filter(k => k.difficulty === "مبتدئ");
    const m = killers.filter(k => k.difficulty === "متوسط");
    const e = killers.filter(k => k.difficulty === "خبير");
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(RED).setTitle("🔪  قائمة الكيلرز — SOUL DBD")
        .addFields(
          { name: "🟢  مبتدئ", value: b.map(k => "> " + k.emoji + " **" + k.name + "**  •  " + k.power).join("\n") },
          { name: "🟡  متوسط", value: m.map(k => "> " + k.emoji + " **" + k.name + "**  •  " + k.power).join("\n") },
          { name: "🔴  خبير",  value: e.map(k => "> " + k.emoji + " **" + k.name + "**  •  " + k.power).join("\n") }
        )
    ], ephemeral: true });
  }

  // ── Perks list ──
  if (id === "menu_perks") {
    const s = perks.filter(p => p.type === "survivor");
    const k = perks.filter(p => p.type === "killer");
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(0xFF8C00).setTitle("✨  قائمة البيركات — SOUL DBD")
        .addFields(
          { name: "🏃  سرفايفر", value: s.map(p => "> " + p.emoji + " **" + p.name + "**  •  " + p.desc).join("\n") },
          { name: "🔪  كيلر",    value: k.map(p => "> " + p.emoji + " **" + p.name + "**  •  " + p.desc).join("\n") }
        )
    ], ephemeral: true });
  }

  // ── Build ──
  if (id === "build_survivor" || id === "build_killer") {
    const type   = id === "build_killer" ? "killer" : "survivor";
    const copy   = perks.filter(p => p.type === type);
    const picked = [];
    while (picked.length < 4 && copy.length) picked.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(type === "killer" ? RED : 0xFF8C00)
        .setTitle("🎰  بيلد " + (type === "killer" ? "كيلر 🔪" : "سرفايفر 🏃") + " عشوائي!")
        .setDescription(picked.map((p, i) => "**" + ["1️⃣","2️⃣","3️⃣","4️⃣"][i] + "  " + p.emoji + " " + p.name + "**\n> " + p.desc).join("\n\n"))
    ], ephemeral: true });
  }

  // ── Leaderboard ──
  if (id === "menu_lb") {
    const sorted = [...lb.values()].sort((a, b) => b.pts - a.pts).slice(0, 10);
    const medals = ["🥇","🥈","🥉"];
    return interaction.reply({ embeds: [
      new EmbedBuilder().setColor(GOLD).setTitle("🏆  لوحة المتصدرين — SOUL DBD")
        .setDescription(
          sorted.length
            ? sorted.map((p, i) => (medals[i] || "**" + (i + 1) + ".**") + "  **" + p.name + "** — " + p.pts + " نقطة").join("\n")
            : "📭 اللوحة فارغة! العب أولاً"
        )
    ], ephemeral: true });
  }

  // ── Chase choice ──
  if (id.startsWith("ch_")) {
    const parts  = id.split("_");
    const cid    = parts[1];
    const uid    = parts[2];
    const idx    = parseInt(parts[3]);
    if (interaction.user.id !== uid) {
      return interaction.reply({ content: "❌ هذه المطاردة مو حقتك!", ephemeral: true });
    }
    const game = acMap.get(cid + uid);
    if (!game) return interaction.reply({ content: "❌ ما في لعبة نشطة", ephemeral: true });
    acMap.delete(cid + uid);
    const choice = game.s.c[idx];
    const tot    = addPts(uid, game.uname, choice.p);
    const again  = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("menu_chase").setLabel("🔄 العب مرة ثانية").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("menu_back").setLabel("🏠 القائمة").setStyle(ButtonStyle.Secondary)
    );
    return interaction.update({ embeds: [
      new EmbedBuilder()
        .setColor(choice.p > 0 ? GREEN : choice.p < 0 ? RED : GREY)
        .setTitle(choice.p > 0 ? "✅  قرار ذكي!" : choice.p < 0 ? "💀  خسرت!" : "😐  نجوت بالكاد...")
        .setDescription("━━━━━━━━━━━━━━━━━━━━━━\n" + choice.r + "\n━━━━━━━━━━━━━━━━━━━━━━")
        .addFields(
          { name: "🏆 النقاط",  value: "> `" + (choice.p >= 0 ? "+" : "") + choice.p + "`", inline: true },
          { name: "💰 مجموعك", value: "> `" + tot + "`", inline: true }
        ).setFooter({ text: "SOUL DBD 🔪" })
    ], components: [again] });
  }
});

// ─── READY ───────────────────────────────────────────────────────────────────
client.once("ready", () => {
  console.log("✅ SOUL DBD Bot is online! Logged in as: " + client.user.tag);
  client.user.setActivity("Dead by Daylight | !menu", { type: 0 });
});

client.login(process.env.DISCORD_TOKEN);
