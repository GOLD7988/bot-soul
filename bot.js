const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection } = require(“discord.js”);

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent,
GatewayIntentBits.GuildMembers,
]
});

// ═══════════════════════════════════════
//              DATA
// ═══════════════════════════════════════

const killers = [
{ name: “ذا ترابر”, power: “فخاخ الدببة”, difficulty: “مبتدئ”, emoji: “🪤” },
{ name: “ذا نيرس”, power: “البلنك”, difficulty: “خبير”, emoji: “🩺” },
{ name: “ذا هنتريس”, power: “الفؤوس”, difficulty: “مبتدئ”, emoji: “🪓” },
{ name: “ذا شيب”, power: “ايفل ويذن”, difficulty: “متوسط”, emoji: “🔪” },
{ name: “ذا سبيريت”, power: “يامائوكا هونتنج”, difficulty: “خبير”, emoji: “👻” },
{ name: “ذا بلايت”, power: “بلايتد كوراپشن”, difficulty: “خبير”, emoji: “🧪” },
{ name: “ذا نيميسيس”, power: “تي-فيروس”, difficulty: “مبتدئ”, emoji: “🌿” },
{ name: “ذا ماسترمايند”, power: “يوروبوروس”, difficulty: “مبتدئ”, emoji: “🦠” },
{ name: “ذا پيگ”, power: “جيكسو بابتيزم”, difficulty: “متوسط”, emoji: “🐷” },
{ name: “ذا غوست فيس”, power: “نايت شراود”, difficulty: “متوسط”, emoji: “👤” },
{ name: “ذا كلاون”, power: “ذا غاسر”, difficulty: “مبتدئ”, emoji: “🎪” },
{ name: “ذا ليجن”, power: “فيرال فرنزي”, difficulty: “مبتدئ”, emoji: “😷” },
{ name: “ذا اوني”, power: “يامائوكا رايث”, difficulty: “خبير”, emoji: “🎭” },
{ name: “ذا ديثسلينجر”, power: “ريدييمر”, difficulty: “متوسط”, emoji: “🔫” },
{ name: “ذا ترايكستر”, power: “شوستوپر”, difficulty: “متوسط”, emoji: “🎯” },
{ name: “ذا دريدج”, power: “رين اوف داركنس”, difficulty: “متوسط”, emoji: “🌑” },
{ name: “ذا زينومورف”, power: “كراولر مود”, difficulty: “متوسط”, emoji: “👾” },
{ name: “ذا چاكي”, power: “هايدي-هو مود”, difficulty: “متوسط”, emoji: “🪆” },
];

const perks = [
{ name: “ديد هارد”, type: “survivor”, emoji: “💨”, desc: “تهرب من ضربة واحدة بالطاقة” },
{ name: “ديسيسيف ستريك”, type: “survivor”, emoji: “🗡”, desc: “بعد الانقاذ اضرب الكيلر وافلت” },
{ name: “سيلف كير”, type: “survivor”, emoji: “🩹”, desc: “اشفي نفسك بدون صندوق اسعاف” },
{ name: “ادرينالين”, type: “survivor”, emoji: “⚡”, desc: “لما اخر مولد يشتغل تشتفي وتجري اسرع” },
{ name: “انبريكبل”, type: “survivor”, emoji: “💪”, desc: “قوم من الارض لوحدك مرة واحدة” },
{ name: “بوروود تايم”, type: “survivor”, emoji: “⏳”, desc: “الشخص اللي انقذته ياخذ حماية اضافية” },
{ name: “سپاين شيل”, type: “survivor”, emoji: “❄”, desc: “تحس لما الكيلر يشوفك مباشرة” },
{ name: “سپرنت برست”, type: “survivor”, emoji: “🏃”, desc: “اسرع بشكل مفاجئ عند اول ركضة” },
{ name: “اوبجكت اوف ابسيشن”, type: “survivor”, emoji: “👁”, desc: “تشوف الكيلر وهو يشوفك” },
{ name: “ايرون ويل”, type: “survivor”, emoji: “🤫”, desc: “لا تصدر صوت وانت مجروح” },
{ name: “نود”, type: “killer”, emoji: “💀”, desc: “بعد اخر مولد ضربة واحدة تعطل السرفايفر” },
{ name: “كوراپت انترفينشن”, type: “killer”, emoji: “🚫”, desc: “ثلاث مولدات تتحجب في البداية” },
{ name: “باربيكيو آند شيلي”, type: “killer”, emoji: “🔥”, desc: “بعد الخطاف تشوف كل السرفايفرز من بعيد” },
{ name: “پوپ غوز ذا ويزل”, type: “killer”, emoji: “💥”, desc: “بعد الخطاف خرب مولد بشدة” },
{ name: “هيكس رين”, type: “killer”, emoji: “🕯”, desc: “المولدات تتراجع لوحدها” },
{ name: “ثاناتوفوبيا”, type: “killer”, emoji: “🩸”, desc: “كل سرفايفر مجروح يبطئ المولدات” },
{ name: “انفيكشس فرايت”, type: “killer”, emoji: “😱”, desc: “لما تخطف احد الباقين يصرخون ويركضون” },
{ name: “بيست اوف پراي”, type: “killer”, emoji: “🦅”, desc: “تشوف السرفايفر اللي تصيد عليه” },
];

const triviaQuestions = [
{ q: “كم عدد المولدات اللي تحتاج تصلحها للخروج؟”, a: “5”, hint: “رقم بين 1 و 7” },
{ q: “ما هي قوة ذا ترابر؟”, a: “bear trap”, hint: “شي يلتقط القدم” },
{ q: “كم ضربة تحتاج قبل ما تقع على الارض؟”, a: “2”, hint: “ضربة + ضربة” },
{ q: “اسم العملة في DBD؟”, a: “bloodpoints”, hint: “نقاط دم” },
{ q: “كم سرفايفر في كل مباراة؟”, a: “4”, hint: “اقل من 5 واكثر من 3” },
{ q: “قوة ذا نيرس؟”, a: “blink”, hint: “تقفز من خلال الجدران” },
{ q: “الكيلر من Resident Evil؟”, a: “nemesis”, hint: “تي-فيروس” },
{ q: “ما هو البيرك اللي يخليك تقوم لوحدك؟”, a: “unbreakable”, hint: “انبريكبل” },
{ q: “كم مولد يتحجب مع كوراپت انترفينشن؟”, a: “3”, hint: “ثلاث” },
{ q: “ما اسم الكيلر اللي يرمي فؤوس؟”, a: “huntress”, hint: “هنتريس” },
{ q: “ما اسم الكيلر من Stranger Things؟”, a: “demogorgon”, hint: “ديموقورقون” },
{ q: “كم مرة تقدر تتحمل على الخطاف قبل الموت؟”, a: “2”, hint: “مرتين” },
{ q: “ما اسم الكيلر اللي قوته T-Virus؟”, a: “nemesis”, hint: “من RE” },
{ q: “ما اسم الكيلر اللي يلبس قناع خنزير؟”, a: “pig”, hint: “هو الي عنده رؤوس الفخاخ” },
{ q: “ما معنى DBD؟”, a: “dead by daylight”, hint: “ثلاث كلمات” },
{ q: “ما هو البيرك اللي يخليك تتهرب من ضربة؟”, a: “dead hard”, hint: “ديد هارد” },
{ q: “ما اسم الكيلر اللي يرمي سكاكين صغيرة؟”, a: “trickster”, hint: “ترايكستر” },
{ q: “ما هو اللون الاحمر في لعبة DBD؟”, a: “bloodpoints”, hint: “عملة اللعبة” },
{ q: “كم عدد الابواب في كل مباراة؟”, a: “2”, hint: “مرتين” },
{ q: “ما اسم الكيلر من Scream؟”, a: “ghost face”, hint: “غوست فيس” },
];

const chaseScenarios = [
{
s: “سمعت موسيقى الكيلر وهو قريب منك!”,
c: [
{ l: “اركض للـ Loop”, r: “ذكي! كسبت وقت ثمين”, p: 10 },
{ l: “اختبأ تحت المولد”, r: “خطأ! وجدك فوراً”, p: -5 },
{ l: “اركض عشوائي”, r: “محظوظ هذه المرة…”, p: 0 },
]
},
{
s: “تصلح مولد ورأيت الكيلر يقترب!”,
c: [
{ l: “اكمل بسرعة”, r: “انجزت المولد وهربت!”, p: 15 },
{ l: “اترك واختبأ”, r: “نجوت لكن المولد تأخر”, p: 5 },
{ l: “خاطر وابقى”, r: “ضربة! خسرت”, p: -10 },
]
},
{
s: “رفيقك على الخطاف والكيلر بجانبه!”,
c: [
{ l: “انقذه فوراً”, r: “انقذته لكن خذيت ضربة”, p: -5 },
{ l: “انتظر الكيلر يمشي”, r: “صبرت وانقذته بامان!”, p: 20 },
{ l: “اصلح مولد بعيد”, r: “مولد اشتغل لكن رفيقك مات”, p: 5 },
]
},
{
s: “الكيلر شافك وانت بدون غطاء!”,
c: [
{ l: “اركض للـ Pallet”, r: “رميت البالت بوجهه ونجوت!”, p: 15 },
{ l: “اختبأ خلف شجرة”, r: “ما نفع! اخطفك”, p: -10 },
{ l: “اركض للمبنى”, r: “وصلت ونجحت تعمل loop”, p: 10 },
]
},
{
s: “الباب مفتوح وانت مجروح، الكيلر خلفك!”,
c: [
{ l: “اركض وادخل الباب”, r: “نجوت بالكاد! خرجت!”, p: 20 },
{ l: “قف واشفي نفسك”, r: “ما كان في وقت كافي! اخطفك”, p: -15 },
{ l: “ارمي البالت وهرب”, r: “أبطأته وهربت من الباب!”, p: 15 },
]
},
];

// ألعاب جديدة
const missingLetterWords = [
{ word: “ترابر”, hint: “كيلر يضع فخاخ”, blanked: “_رابر”, answer: “ترابر” },
{ word: “نيرس”, hint: “كيلر يبلنك”, blanked: “ني_س”, answer: “نيرس” },
{ word: “هنتريس”, hint: “كيلر يرمي فؤوس”, blanked: “هنت_يس”, answer: “هنتريس” },
{ word: “سبيريت”, hint: “كيلر ياباني خبير”, blanked: “سبي_يت”, answer: “سبيريت” },
{ word: “نيميسيس”, hint: “كيلر من RE”, blanked: “نيم_سيس”, answer: “نيميسيس” },
{ word: “ديد هارد”, hint: “بيرك تهرب من ضربة”, blanked: “ديد ه_رد”, answer: “ديد هارد” },
{ word: “بلودپوينتس”, hint: “عملة اللعبة”, blanked: “بلود_وينتس”, answer: “بلودپوينتس” },
{ word: “انبريكبل”, hint: “بيرك تقوم لوحدك”, blanked: “انبريك_ل”, answer: “انبريكبل” },
{ word: “باربيكيو”, hint: “بيرك ترى السرفايفرز”, blanked: “بارب_كيو”, answer: “باربيكيو” },
{ word: “چاكي”, hint: “دمية قاتلة”, blanked: “چا_ي”, answer: “چاكي” },
];

const scrambledWords = [
{ word: “ترابر”, scrambled: “ر ا ر ب ت”, answer: “ترابر”, hint: “كيلر” },
{ word: “نيرس”, scrambled: “س ر ي ن”, answer: “نيرس”, hint: “كيلر” },
{ word: “هنتريس”, scrambled: “ي ت ن س ه ر”, answer: “هنتريس”, hint: “كيلر” },
{ word: “بلايت”, scrambled: “ت ي ل ب ا”, answer: “بلايت”, hint: “كيلر” },
{ word: “سبيريت”, scrambled: “ت ي ر ب ي س”, answer: “سبيريت”, hint: “كيلر” },
{ word: “نود”, scrambled: “و د ن”, answer: “نود”, hint: “بيرك كيلر” },
{ word: “ادرينالين”, scrambled: “ن ي ل ا ن ي ر د ا”, answer: “ادرينالين”, hint: “بيرك سرفايفر” },
{ word: “چاكي”, scrambled: “ي ك ا چ”, answer: “چاكي”, hint: “كيلر دمية” },
{ word: “بلودپوينتس”, scrambled: “ن ت س ي و پ د و ل ب”, answer: “بلودپوينتس”, hint: “عملة اللعبة” },
{ word: “هيكس رين”, scrambled: “ن ي ر س ك ي ه”, answer: “هيكس رين”, hint: “بيرك كيلر هيكس” },
];

const speedRaceWords = [
“ترابر”, “نيرس”, “هنتريس”, “سبيريت”, “بلايت”,
“نيميسيس”, “چاكي”, “اوني”, “ليجن”, “كلاون”,
“ديد هارد”, “نود”, “باربيكيو”, “انبريكبل”, “هيكس رين”,
“بلودپوينتس”, “سرفايفر”, “مولد”, “هوك”, “پالت”,
];

// ═══════════════════════════════════════
//        STORAGE
// ═══════════════════════════════════════

const lb = new Collection();
const activeTrivia = new Collection();
const activeMissing = new Collection();
const activeScramble = new Collection();
const activeSpeed = new Collection();
const activeChase = new Collection();

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function addPts(id, name, pts) {
const cur = lb.get(id) || { name, pts: 0 };
cur.pts += pts;
cur.name = name;
lb.set(id, cur);
return cur.pts;
}

// ═══════════════════════════════════════
//        MENU
// ═══════════════════════════════════════

const SOUL_BANNER = “https://cdn.discordapp.com/attachments/1510327104041127959/1510647569435332658/IMG_0059.jpg”;

function menuEmbed() {
return new EmbedBuilder()
.setColor(0x1a6bff)
.setTitle(“SOUL DBD - القائمة الرئيسية”)
.setDescription(”**The Entity is watching…**\n\nاختر لعبة من الازرار أدناه:”)
.setImage(SOUL_BANNER)
.addFields(
{ name: “🎮 الالعاب”, value: “🧠 تريفيا\n⚔️ مطاردة\n🔤 كلمة مفككة\n❓ حرف ناقص\n⚡ سباق الكتابة”, inline: true },
{ name: “📋 القوائم”, value: “🔪 الكيلرز\n✨ البيركات\n🏆 المتصدرين\n🎲 كيلر عشوائي\n🎰 بيلد عشوائي”, inline: true }
)
.setFooter({ text: “SOUL Dead by Daylight | !menu” });
}

function menuRow1() {
return new ActionRowBuilder().addComponents(
new ButtonBuilder().setCustomId(“m_trivia”).setLabel(“🧠 تريفيا”).setStyle(ButtonStyle.Danger),
new ButtonBuilder().setCustomId(“m_chase”).setLabel(“⚔️ مطاردة”).setStyle(ButtonStyle.Primary),
new ButtonBuilder().setCustomId(“m_scramble”).setLabel(“🔤 كلمة مفككة”).setStyle(ButtonStyle.Success),
new ButtonBuilder().setCustomId(“m_missing”).setLabel(“❓ حرف ناقص”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“m_speed”).setLabel(“⚡ سباق الكتابة”).setStyle(ButtonStyle.Primary),
);
}

function menuRow2() {
return new ActionRowBuilder().addComponents(
new ButtonBuilder().setCustomId(“m_killers”).setLabel(“🔪 الكيلرز”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“m_perks”).setLabel(“✨ البيركات”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“m_lb”).setLabel(“🏆 المتصدرين”).setStyle(ButtonStyle.Success),
new ButtonBuilder().setCustomId(“m_killer_rand”).setLabel(“🎲 كيلر عشوائي”).setStyle(ButtonStyle.Danger),
new ButtonBuilder().setCustomId(“m_build”).setLabel(“🎰 بيلد عشوائي”).setStyle(ButtonStyle.Primary),
);
}

// ═══════════════════════════════════════
//        START GAME FUNCTIONS
// ═══════════════════════════════════════

async function startTrivia(channel, replyFn) {
if (activeTrivia.has(channel.id)) { return replyFn(“⚠️ في سؤال شغال الحين!”); }
const q = rand(triviaQuestions);
activeTrivia.set(channel.id, { …q, start: Date.now() });
setTimeout(() => {
if (activeTrivia.has(channel.id)) {
activeTrivia.delete(channel.id);
channel.send({ embeds: [new EmbedBuilder().setColor(0x555555).setTitle(“⏱️ انتهى الوقت!”).setDescription(“الجواب الصحيح: **” + q.a + “**”)] });
}
}, 30000);
return replyFn({ embeds: [new EmbedBuilder().setColor(0xB22222).setTitle(“🧠 سؤال DBD!”).setDescription(”**” + q.q + “**”).addFields({ name: “💡 تلميح”, value: “||” + q.hint + “||” }).setFooter({ text: “اكتب اجابتك مباشرة! عندك 30 ثانية” })] });
}

async function startScramble(channel, replyFn) {
if (activeScramble.has(channel.id)) { return replyFn(“⚠️ في لعبة شغالة الحين!”); }
const w = rand(scrambledWords);
activeScramble.set(channel.id, { …w, start: Date.now() });
setTimeout(() => {
if (activeScramble.has(channel.id)) {
activeScramble.delete(channel.id);
channel.send({ embeds: [new EmbedBuilder().setColor(0x555555).setTitle(“⏱️ انتهى الوقت!”).setDescription(“الجواب الصحيح: **” + w.answer + “**”)] });
}
}, 45000);
return replyFn({ embeds: [new EmbedBuilder().setColor(0x00AA44).setTitle(“🔤 كلمة مفككة!”).setDescription(”**رتب هذه الحروف لتكوّن كلمة من DBD:**\n\n# “ + w.scrambled).addFields({ name: “💡 تلميح”, value: “||” + w.hint + “||” }).setFooter({ text: “اكتب الكلمة الصحيحة! عندك 45 ثانية” })] });
}

async function startMissing(channel, replyFn) {
if (activeMissing.has(channel.id)) { return replyFn(“⚠️ في لعبة شغالة الحين!”); }
const w = rand(missingLetterWords);
activeMissing.set(channel.id, { …w, start: Date.now() });
setTimeout(() => {
if (activeMissing.has(channel.id)) {
activeMissing.delete(channel.id);
channel.send({ embeds: [new EmbedBuilder().setColor(0x555555).setTitle(“⏱️ انتهى الوقت!”).setDescription(“الجواب الصحيح: **” + w.answer + “**”)] });
}
}, 30000);
return replyFn({ embeds: [new EmbedBuilder().setColor(0xFF8C00).setTitle(“❓ حرف ناقص!”).setDescription(”**أكمل الكلمة الناقصة من DBD:**\n\n# “ + w.blanked).addFields({ name: “💡 تلميح”, value: “||” + w.hint + “||” }).setFooter({ text: “اكتب الكلمة الكاملة! عندك 30 ثانية” })] });
}

async function startSpeed(channel, replyFn) {
if (activeSpeed.has(channel.id)) { return replyFn(“⚠️ في سباق شغال الحين!”); }
const word = rand(speedRaceWords);
activeSpeed.set(channel.id, { word, start: Date.now() });
setTimeout(() => {
if (activeSpeed.has(channel.id)) {
activeSpeed.delete(channel.id);
channel.send({ embeds: [new EmbedBuilder().setColor(0x555555).setTitle(“⏱️ انتهى الوقت!”).setDescription(“ما احد كتب الكلمة الصحيحة!\nالجواب: **” + word + “**”)] });
}
}, 20000);
return replyFn({ embeds: [new EmbedBuilder().setColor(0x1a6bff).setTitle(“⚡ سباق الكتابة!”).setDescription(”**اكتب هذه الكلمة اسرع من غيرك:**\n\n# “ + word).setFooter({ text: “عندك 20 ثانية! اسرع واحد يفوز” })] });
}

async function startChase(channel, userId, username, replyFn) {
const s = rand(chaseScenarios);
activeChase.set(channel.id + userId, { s, uid: userId, uname: username });
const row = new ActionRowBuilder().addComponents(
s.c.map((c, i) => new ButtonBuilder()
.setCustomId(“ch_” + channel.id + “*” + userId + “*” + i)
.setLabel(c.l)
.setStyle(i === 0 ? ButtonStyle.Primary : i === 1 ? ButtonStyle.Secondary : ButtonStyle.Danger)
)
);
return replyFn({ embeds: [new EmbedBuilder().setColor(0xB22222).setTitle(“⚔️ محاكاة المطاردة!”).setDescription(”**” + s.s + “**\n\nوش تسوي؟”).setFooter({ text: “اختر قرارك بحكمة” })], components: [row] });
}

// ═══════════════════════════════════════
//        ANSWER CHECKER
// ═══════════════════════════════════════

client.on(“messageCreate”, async (msg) => {
if (msg.author.bot) return;

const content = msg.content.toLowerCase().trim();

// Check trivia
const trivia = activeTrivia.get(msg.channel.id);
if (trivia && !content.startsWith(”!”) && content.includes(trivia.a.toLowerCase())) {
activeTrivia.delete(msg.channel.id);
const secs = ((Date.now() - trivia.start) / 1000).toFixed(1);
const pts = Math.max(5, 20 - Math.floor(parseFloat(secs) / 2));
const total = addPts(msg.author.id, msg.author.username, pts);
return msg.reply({ embeds: [new EmbedBuilder().setColor(0x00FF88).setTitle(“✅ اجابة صحيحة!”).setDescription(msg.author.username + “ أجاب صح!”).addFields({ name: “الوقت”, value: secs + “s”, inline: true }, { name: “نقاط”, value: “+” + pts, inline: true }, { name: “المجموع”, value: “” + total, inline: true })] });
}

// Check scramble
const scramble = activeScramble.get(msg.channel.id);
if (scramble && !content.startsWith(”!”) && content === scramble.answer.toLowerCase()) {
activeScramble.delete(msg.channel.id);
const secs = ((Date.now() - scramble.start) / 1000).toFixed(1);
const pts = Math.max(10, 30 - Math.floor(parseFloat(secs) / 2));
const total = addPts(msg.author.id, msg.author.username, pts);
return msg.reply({ embeds: [new EmbedBuilder().setColor(0x00FF88).setTitle(“✅ صحيح! رتبت الكلمة!”).setDescription(msg.author.username + “ فك الكلمة بـ “ + secs + “ ثانية!”).addFields({ name: “نقاط”, value: “+” + pts, inline: true }, { name: “المجموع”, value: “” + total, inline: true })] });
}

// Check missing letter
const missing = activeMissing.get(msg.channel.id);
if (missing && !content.startsWith(”!”) && content === missing.answer.toLowerCase()) {
activeMissing.delete(msg.channel.id);
const secs = ((Date.now() - missing.start) / 1000).toFixed(1);
const pts = Math.max(5, 20 - Math.floor(parseFloat(secs) / 2));
const total = addPts(msg.author.id, msg.author.username, pts);
return msg.reply({ embeds: [new EmbedBuilder().setColor(0x00FF88).setTitle(“✅ صحيح! اكملت الكلمة!”).setDescription(msg.author.username + “ أجاب صح!”).addFields({ name: “نقاط”, value: “+” + pts, inline: true }, { name: “المجموع”, value: “” + total, inline: true })] });
}

// Check speed race
const speed = activeSpeed.get(msg.channel.id);
if (speed && !content.startsWith(”!”) && content === speed.word.toLowerCase()) {
activeSpeed.delete(msg.channel.id);
const secs = ((Date.now() - speed.start) / 1000).toFixed(1);
const pts = 25;
const total = addPts(msg.author.id, msg.author.username, pts);
return msg.reply({ embeds: [new EmbedBuilder().setColor(0x00FF88).setTitle(“⚡ فاز “ + msg.author.username + “!”).setDescription(“كتب الكلمة في “ + secs + “ ثانية!”).addFields({ name: “نقاط”, value: “+” + pts, inline: true }, { name: “المجموع”, value: “” + total, inline: true })] });
}

if (!content.startsWith(”!”)) return;

const args = msg.content.slice(1).trim().split(/ +/);
const cmd = args[0].toLowerCase();

if (cmd === “menu” || cmd === “play”) {
return msg.reply({ embeds: [menuEmbed()], components: [menuRow1(), menuRow2()] });
}
if (cmd === “help”) {
return msg.reply({ embeds: [new EmbedBuilder().setColor(0xB22222).setTitle(“SOUL DBD Bot - الاوامر”).setDescription(“اكتب **!menu** لتفتح القائمة الكاملة بالازرار\n\nاو الاوامر المباشرة:\n`!trivia` `!scramble` `!missing` `!speed` `!chase`\n`!killer` `!killers` `!perk` `!perks` `!build` `!lb`”).setFooter({ text: “SOUL DBD | The Entity is watching” })] });
}
if (cmd === “trivia”) return startTrivia(msg.channel, (r) => msg.reply(r));
if (cmd === “scramble”) return startScramble(msg.channel, (r) => msg.reply(r));
if (cmd === “missing”) return startMissing(msg.channel, (r) => msg.reply(r));
if (cmd === “speed”) return startSpeed(msg.channel, (r) => msg.reply(r));
if (cmd === “chase”) return startChase(msg.channel, msg.author.id, msg.author.username, (r) => msg.reply(r));

if (cmd === “killer”) {
const k = rand(killers);
return msg.reply({ embeds: [new EmbedBuilder().setColor(0xB22222).setTitle(k.emoji + “ “ + k.name).addFields({ name: “القوة”, value: k.power, inline: true }, { name: “الصعوبة”, value: k.difficulty, inline: true })] });
}
if (cmd === “killers”) {
const b = killers.filter(k => k.difficulty === “مبتدئ”);
const m = killers.filter(k => k.difficulty === “متوسط”);
const e = killers.filter(k => k.difficulty === “خبير”);
return msg.reply({ embeds: [new EmbedBuilder().setColor(0xB22222).setTitle(“قائمة الكيلرز - SOUL DBD”).addFields({ name: “مبتدئ”, value: b.map(k => k.emoji + “ “ + k.name + “ - “ + k.power).join(”\n”) }, { name: “متوسط”, value: m.map(k => k.emoji + “ “ + k.name + “ - “ + k.power).join(”\n”) }, { name: “خبير”, value: e.map(k => k.emoji + “ “ + k.name + “ - “ + k.power).join(”\n”) })] });
}
if (cmd === “perk”) {
const p = rand(perks);
return msg.reply({ embeds: [new EmbedBuilder().setColor(p.type === “killer” ? 0xB22222 : 0xFF8C00).setTitle(p.emoji + “ “ + p.name).addFields({ name: “الوصف”, value: p.desc }, { name: “النوع”, value: p.type === “killer” ? “كيلر” : “سرفايفر”, inline: true })] });
}
if (cmd === “perks”) {
const s = perks.filter(p => p.type === “survivor”);
const k = perks.filter(p => p.type === “killer”);
return msg.reply({ embeds: [new EmbedBuilder().setColor(0xFF8C00).setTitle(“قائمة البيركات - SOUL DBD”).addFields({ name: “بيركات السرفايفر”, value: s.map(p => p.emoji + “ **” + p.name + “** - “ + p.desc).join(”\n”) }, { name: “بيركات الكيلر”, value: k.map(p => p.emoji + “ **” + p.name + “** - “ + p.desc).join(”\n”) })] });
}
if (cmd === “build”) {
const type = args[1] === “killer” ? “killer” : “survivor”;
const pool = […perks.filter(p => p.type === type)];
const picked = [];
while (picked.length < 4 && pool.length > 0) picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
return msg.reply({ embeds: [new EmbedBuilder().setColor(type === “killer” ? 0xB22222 : 0xFF8C00).setTitle(“بيلد “ + (type === “killer” ? “كيلر” : “سرفايفر”) + “ عشوائي!”).setDescription(picked.map((p, i) => (i + 1) + “. “ + p.emoji + “ **” + p.name + “**\n” + p.desc).join(”\n\n”))] });
}
if (cmd === “lb” || cmd === “leaderboard”) {
const sorted = […lb.values()].sort((a, b) => b.pts - a.pts).slice(0, 10);
if (!sorted.length) return msg.reply(“اللوحة فارغة! العب اي لعبة لتجمع نقاط.”);
const medals = [“🥇”, “🥈”, “🥉”];
return msg.reply({ embeds: [new EmbedBuilder().setColor(0xFFD700).setTitle(“لوحة المتصدرين - SOUL DBD”).setDescription(sorted.map((p, i) => (medals[i] || (i + 1) + “.”) + “ **” + p.name + “** - “ + p.pts + “ نقطة”).join(”\n”))] });
}
});

// ═══════════════════════════════════════
//        BUTTON HANDLER
// ═══════════════════════════════════════

client.on(“interactionCreate”, async (interaction) => {
if (!interaction.isButton()) return;
const id = interaction.customId;

const replyEph = (content) => interaction.reply({ content, ephemeral: true });
const replyNew = (data) => interaction.reply(data);

if (id === “m_trivia”) return startTrivia(interaction.channel, replyNew);
if (id === “m_scramble”) return startScramble(interaction.channel, replyNew);
if (id === “m_missing”) return startMissing(interaction.channel, replyNew);
if (id === “m_speed”) return startSpeed(interaction.channel, replyNew);
if (id === “m_chase”) return startChase(interaction.channel, interaction.user.id, interaction.user.username, replyNew);

if (id === “m_killer_rand”) {
const k = rand(killers);
return interaction.reply({ embeds: [new EmbedBuilder().setColor(0xB22222).setTitle(k.emoji + “ “ + k.name).addFields({ name: “القوة”, value: k.power, inline: true }, { name: “الصعوبة”, value: k.difficulty, inline: true })], ephemeral: true });
}

if (id === “m_killers”) {
const b = killers.filter(k => k.difficulty === “مبتدئ”);
const m = killers.filter(k => k.difficulty === “متوسط”);
const e = killers.filter(k => k.difficulty === “خبير”);
return interaction.reply({ embeds: [new EmbedBuilder().setColor(0xB22222).setTitle(“قائمة الكيلرز - SOUL DBD”).addFields({ name: “مبتدئ”, value: b.map(k => k.emoji + “ “ + k.name + “ - “ + k.power).join(”\n”) }, { name: “متوسط”, value: m.map(k => k.emoji + “ “ + k.name + “ - “ + k.power).join(”\n”) }, { name: “خبير”, value: e.map(k => k.emoji + “ “ + k.name + “ - “ + k.power).join(”\n”) })], ephemeral: true });
}

if (id === “m_perks”) {
const s = perks.filter(p => p.type === “survivor”);
const k = perks.filter(p => p.type === “killer”);
return interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFF8C00).setTitle(“قائمة البيركات - SOUL DBD”).addFields({ name: “بيركات السرفايفر”, value: s.map(p => p.emoji + “ **” + p.name + “** - “ + p.desc).join(”\n”) }, { name: “بيركات الكيلر”, value: k.map(p => p.emoji + “ **” + p.name + “** - “ + p.desc).join(”\n”) })], ephemeral: true });
}

if (id === “m_build”) {
const pool = […perks.filter(p => p.type === “survivor”)];
const picked = [];
while (picked.length < 4 && pool.length > 0) picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
return interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFF8C00).setTitle(“بيلد سرفايفر عشوائي!”).setDescription(picked.map((p, i) => (i + 1) + “. “ + p.emoji + “ **” + p.name + “**\n” + p.desc).join(”\n\n”))], ephemeral: true });
}

if (id === “m_lb”) {
const sorted = […lb.values()].sort((a, b) => b.pts - a.pts).slice(0, 10);
return interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFFD700).setTitle(“لوحة المتصدرين - SOUL DBD”).setDescription(sorted.length ? sorted.map((p, i) => ([“🥇”, “🥈”, “🥉”][i] || (i + 1) + “.”) + “ **” + p.name + “** - “ + p.pts + “ نقطة”).join(”\n”) : “اللوحة فارغة!”)], ephemeral: true });
}

// Chase buttons
if (id.startsWith(“ch_”)) {
const parts = id.split(”_”);
const cid = parts[1], uid = parts[2], idx = parseInt(parts[3]);
if (interaction.user.id !== uid) return interaction.reply({ content: “هذه المطاردة مو حقتك!”, ephemeral: true });
const game = activeChase.get(cid + uid);
if (!game) return interaction.reply({ content: “ما في لعبة نشطة”, ephemeral: true });
activeChase.delete(cid + uid);
const choice = game.s.c[idx];
const total = addPts(uid, game.uname, choice.p);
const playAgain = new ActionRowBuilder().addComponents(
new ButtonBuilder().setCustomId(“m_chase”).setLabel(“العب مرة ثانية”).setStyle(ButtonStyle.Primary)
);
return interaction.update({
embeds: [new EmbedBuilder()
.setColor(choice.p > 0 ? 0x00FF88 : choice.p < 0 ? 0xB22222 : 0x888888)
.setTitle(choice.p > 0 ? “قرار ذكي!” : choice.p < 0 ? “خسرت!” : “نجوت بالكاد…”)
.setDescription(choice.r)
.addFields({ name: “النقاط”, value: (choice.p >= 0 ? “+” : “”) + choice.p, inline: true }, { name: “مجموعك”, value: “” + total, inline: true })
],
components: [playAgain]
});
}
});

// ═══════════════════════════════════════
//        READY
// ═══════════════════════════════════════

client.once(“ready”, () => {
console.log(“DBD Bot Ready! “ + client.user.tag);
client.user.setActivity(“Dead by Daylight | !menu”, { type: 0 });
});

client.login(process.env.DISCORD_TOKEN);
