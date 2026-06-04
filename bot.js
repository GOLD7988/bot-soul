const {
Client, GatewayIntentBits, EmbedBuilder,
ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection
} = require(“discord.js”);

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent,
GatewayIntentBits.GuildMembers
]
});

const LOGO = “https://cdn.discordapp.com/attachments/1510327104041127959/1510647569435332658/IMG_0059.jpg”;
const DISCORD_BG = 0x2B2D31;

// ─── QUESTION BANK ───────────────────────────────────────────────────────────
const dbdQuestions = [
{ q: “وش البيرك اللي يعطيك دزة قدام وحماية من الضربة وانت مصاب؟”, answers: [“ديد هارد”, “dead hard”, “dh”, “ددهارد”, “ديدهارد”] },
{ q: “وش اسم الكيان الأسود الخفي اللي يتحكم بالضباب ويبي التضحيات؟”, answers: [“ذا انتيتي”, “انتيتي”, “the entity”, “entity”, “الكيان”] },
{ q: “كم توكن في بيرك Devour Hope عشان تقتل بيدك؟”, answers: [“5”, “خمسة”, “خمس”] },
{ q: “وش اسم الصندوق اللي تستخدمه عشان تخرب الفخاخ وتصلح المولدات بسرعة؟”, answers: [“صندوق العدة”, “تول بوكس”, “toolbox”] },
{ q: “اذا متوا كلكم وبقيت لحالك، وش الشيء اللي ينفتح في الارض عشان تفلت؟”, answers: [“هاتش”, “الهاتش”, “hatch”, “الفتحة”] },
{ q: “كم مولد تصلح عشان تفتح البوابة؟”, answers: [“5”, “خمسة”, “خمس”] },
{ q: “ما هو البيرك اللي يخليك تقوم من الارض لوحدك؟”, answers: [“انبريكبل”, “unbreakable”] },
{ q: “ما هو البيرك اللي يخليك تشوف السرفايفرز بعد الخطاف؟”, answers: [“باربيكيو”, “barbecue”, “barbeque”, “باربيكيو آند شيلي”] },
{ q: “ما هو البيرك اللي يوقف 3 مولدات في بداية المباراة؟”, answers: [“كوراپت انترفينشن”, “corrupt intervention”] },
{ q: “ما هو البيرك اللي يرجع المولدات للخلف لوحدها؟”, answers: [“هيكس رين”, “ruin”, “hex ruin”] },
{ q: “ما اسم الكيلر اللي يبلنك من خلال الجدران؟”, answers: [“نيرس”, “nurse”, “ذا نيرس”] },
{ q: “ما اسم الكيلر اللي يرمي فؤوس؟”, answers: [“هنتريس”, “huntress”, “ذا هنتريس”] },
{ q: “ما اسم الكيلر من Halloween؟”, answers: [“شيب”, “مايرز”, “shape”, “myers”, “ذا شيب”] },
{ q: “ما اسم الكيلر من Resident Evil 3؟”, answers: [“نيميسيس”, “nemesis”, “ذا نيميسيس”] },
{ q: “ما اسم الكيلر من Alien؟”, answers: [“زينومورف”, “xenomorph”, “ذا زينومورف”] },
{ q: “ما اسم الكيلر من Child’s Play؟”, answers: [“چاكي”, “chucky”, “ذا چاكي”] },
{ q: “ما اسم الكيلر الياباني اللي يمشي بسرعة خفية؟”, answers: [“سبيريت”, “spirit”, “ذا سبيريت”] },
{ q: “ما اسم الكيلر من Saw؟”, answers: [“پيگ”, “pig”, “ذا پيگ”] },
{ q: “ما اسم الكيلر من Scream؟”, answers: [“غوست فيس”, “ghost face”, “ghostface”] },
{ q: “ما اسم الكيلر من Hellraiser؟”, answers: [“سينوبايت”, “cenobite”, “pinhead”, “پينهيد”] },
{ q: “ما هو البيرك اللي يخليك تتهرب من ضربة بالركض؟”, answers: [“ديد هارد”, “dead hard”, “dh”] },
{ q: “كم سرفايفر في المباراة الواحدة؟”, answers: [“4”, “اربعة”, “اربع”] },
{ q: “ما اسم العملة في DBD؟”, answers: [“بلودپوينتس”, “bloodpoints”, “blood points”] },
{ q: “ما هو البيرك اللي يخليك تشفي نفسك بدون صندوق؟”, answers: [“سيلف كير”, “self care”] },
{ q: “ما هو البيرك اللي يعطيك سرعة مفاجئة اول ما تركض؟”, answers: [“سبرنت برست”, “sprint burst”] },
{ q: “ما هي قوة ذا بلايت؟”, answers: [“راش”, “rush”, “بلايتد كوراپشن”, “blighted corruption”] },
{ q: “ما هي قوة ذا ليجن؟”, answers: [“فيرال فرنزي”, “feral frenzy”] },
{ q: “ما هو البيرك اللي يبطئ المولدات لما سرفايفر يتجرح؟”, answers: [“ثاناتوفوبيا”, “thanatophobia”] },
{ q: “ما اسم الكيلر من Texas Chainsaw؟”, answers: [“كانيبال”, “cannibal”, “بوبا”, “bubba”] },
{ q: “ما اسم الكيلر اللي يستخدم غاز؟”, answers: [“كلاون”, “clown”, “ذا كلاون”] },
{ q: “ما هو البيرك اللي يخليك تحس بالكيلر وهو يشوفك؟”, answers: [“سپاين شيل”, “spine chill”] },
{ q: “ما هو البيرك اللي يخليك ما تصدر صوت وانت مجروح؟”, answers: [“ايرون ويل”, “iron will”] },
{ q: “ما اسم الكيلر اللي يرمي سكاكين صغيرة كثيرة؟”, answers: [“ترايكستر”, “trickster”] },
{ q: “ما اسم الكيلر من RE8 ويسكر؟”, answers: [“ماسترمايند”, “mastermind”, “ويسكر”, “wesker”] },
{ q: “ما اسم الكيلر من The Ring؟”, answers: [“اونريو”, “onryo”, “ساداكو”, “sadako”] },
{ q: “كم مرة تتحمل على الخطاف قبل الموت؟”, answers: [“2”, “مرتين”, “اثنين”] },
{ q: “ما هو البيرك اللي يخليك تطعن الكيلر بعد الانقاذ؟”, answers: [“ديسيسيف ستريك”, “decisive strike”, “ds”] },
{ q: “ما اسم الكيلر اللي له قوة رسم الفخاخ على الارض؟”, answers: [“هاگ”, “hag”, “ذا هاگ”] },
{ q: “ما هو البيرك اللي يعطي الشخص اللي انقذته حماية؟”, answers: [“بوروود تايم”, “borrowed time”, “bt”] },
{ q: “ما اسم الكيلر اللي يرمي بندقية بحبل؟”, answers: [“ديثسلينجر”, “deathslinger”] },
{ q: “وش المقصود بـ DS في عالم DBD؟”, answers: [“ديسيسيف ستريك”, “decisive strike”] },
{ q: “ما اسم الكيلر اللي له ذراع طويلة كعقاب؟”, answers: [“اكزيكيوشنر”, “executioner”, “بيراميد هيد”, “pyramid head”] },
{ q: “ما اسم الكيلر اللي يستخدم فيروس T-Virus؟”, answers: [“نيميسيس”, “nemesis”] },
{ q: “ما هو الشيء الذي اذا كسره السرفايفر ينقذ فريقه من الهيكس؟”, answers: [“التوتيم”, “totem”, “الحجر”] },
{ q: “ما اسم الكيلر الكوري اللي يرمي سكاكين؟”, answers: [“ترايكستر”, “trickster”, “كوري”, “ji-woon”] },
{ q: “ما هي قوة ذا ترابر؟”, answers: [“فخاخ الدببة”, “bear traps”, “بير ترابس”] },
{ q: “ما هو البيرك اللي يعطيك سرعة وهيل عند اخر مولد؟”, answers: [“ادرينالين”, “adrenaline”] },
{ q: “ما هو الشيء اللي ترميه عشان توقف الكيلر؟”, answers: [“بالت”, “pallet”] },
{ q: “ما اسم الكيلر من Stranger Things؟”, answers: [“ديموقورقون”, “demogorgon”] },
{ q: “ما هو البيرك اللي يخليك تشوف الكيلر وهو يشوفك؟”, answers: [“اوبجكت اوف ابسيشن”, “object of obsession”, “ooo”] },
];

// ─── كلمات مفككة ─────────────────────────────────────────────────────────────
const scrambledWords = [
{ scrambled: “ر ا ر ب ت”, answer: “ترابر”, hint: “كيلر الفخاخ” },
{ scrambled: “س ر ي ن”, answer: “نيرس”, hint: “كيلر البلنك” },
{ scrambled: “ي ت ن س ه ر”, answer: “هنتريس”, hint: “كيلر الفؤوس” },
{ scrambled: “ت ي ل ب ا”, answer: “بلايت”, hint: “كيلر خبير سريع” },
{ scrambled: “ت ي ر ب ي س”, answer: “سبيريت”, hint: “كيلر ياباني” },
{ scrambled: “و د ن”, answer: “نود”, hint: “بيرك كيلر خطير” },
{ scrambled: “ن ي ل ا ن ي ر د ا”, answer: “ادرينالين”, hint: “بيرك سرفايفر عند اخر مولد” },
{ scrambled: “ي ك ا چ”, answer: “چاكي”, hint: “دمية كيلر” },
{ scrambled: “س ن ر ي ن ه”, answer: “هنتريس”, hint: “ترمي فؤوس” },
{ scrambled: “ر ه ب ر ت ا ب”, answer: “باربيكيو”, hint: “بيرك ترى فيه الجميع” },
{ scrambled: “ل ب ك ر ب ن ا”, answer: “انبريكبل”, hint: “بيرك القيام لوحدك” },
{ scrambled: “ج ه ا”, answer: “هاگ”, hint: “كيلر الفخاخ الارضية” },
];

// ─── حرف ناقص ────────────────────────────────────────────────────────────────
const missingLetterWords = [
{ blanked: “_رابر”, answer: “ترابر”, hint: “كيلر الفخاخ” },
{ blanked: “ني_س”, answer: “نيرس”, hint: “كيلر البلنك” },
{ blanked: “هنت_يس”, answer: “هنتريس”, hint: “كيلر الفؤوس” },
{ blanked: “سبي_يت”, answer: “سبيريت”, hint: “كيلر ياباني خبير” },
{ blanked: “نيم_سيس”, answer: “نيميسيس”, hint: “كيلر من RE” },
{ blanked: “ديد ه_رد”, answer: “ديد هارد”, hint: “بيرك تهرب من ضربة” },
{ blanked: “انبريك_ل”, answer: “انبريكبل”, hint: “بيرك تقوم لوحدك” },
{ blanked: “بارب_كيو”, answer: “باربيكيو”, hint: “بيرك ترى السرفايفرز” },
{ blanked: “چا_ي”, answer: “چاكي”, hint: “دمية قاتلة” },
{ blanked: “ب_ايت”, answer: “بلايت”, hint: “كيلر سريع خبير” },
{ blanked: “ه_كس رين”, answer: “هيكس رين”, hint: “بيرك يوقف المولدات” },
{ blanked: “ث_ناتوفوبيا”, answer: “ثاناتوفوبيا”, hint: “بيرك يبطئ المولدات بالجرح” },
];

// ─── كمل الكلمة ───────────────────────────────────────────────────────────────
const completeWordGames = [
{ display: “سيلف ____”, answers: [“سيلف كير”, “self care”], hint: “بيرك الهيل لوحدك” },
{ display: “ديسيسيف ____”, answers: [“ديسيسيف ستريك”, “decisive strike”], hint: “بيرك طعنة الكيلر بعد الانقاذ” },
{ display: “سبرنت ____”, answers: [“سبرنت برست”, “sprint burst”], hint: “بيرك السرعة المفاجئة” },
{ display: “ايرون ____”, answers: [“ايرون ويل”, “iron will”], hint: “بيرك الصمت وانت مجروح” },
{ display: “بوروود ____”, answers: [“بوروود تايم”, “borrowed time”], hint: “بيرك حماية المنقذ” },
{ display: “هيكس ____”, answers: [“هيكس رين”, “hex ruin”], hint: “بيرك يرجع المولدات للخلف” },
{ display: “كوراپت ____”, answers: [“كوراپت انترفينشن”, “corrupt intervention”], hint: “بيرك يوقف 3 مولدات” },
{ display: “باربيكيو ____”, answers: [“باربيكيو آند شيلي”, “barbecue and chili”], hint: “بيرك ترى الكل بعد الخطاف” },
];

// ─── STORAGE ─────────────────────────────────────────────────────────────────
const db = new Collection();
const lobbyQueue = new Set();
let activeMatch = null;
let matchTimeout = null;
const activeGames = new Collection();

function getPlayer(id, username) {
if (!db.has(id)) db.set(id, { id, name: username, pts: 100 });
const p = db.get(id);
p.name = username;
return p;
}

function cleanStr(str) {
if (!str) return “”;
return str.toLowerCase().trim()
.replace(/\s+/g, “”)
.replace(/[أإآا]/g, “ا”)
.replace(/ة/g, “ه”)
.replace(/ى/g, “ي”);
}

function matchAns(input, validAnswers) {
const clean = cleanStr(input);
return validAnswers.some(a => cleanStr(a) === clean || clean.includes(cleanStr(a)));
}

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ─── UI BUILDERS ─────────────────────────────────────────────────────────────
function logoEmbed() {
return new EmbedBuilder().setColor(DISCORD_BG).setImage(LOGO);
}

function startRow() {
return [new ActionRowBuilder().addComponents(
new ButtonBuilder().setCustomId(“open_menu”).setLabel(“🎮 قائمة الالعاب”).setStyle(ButtonStyle.Secondary)
)];
}

function menuRows() {
return [
new ActionRowBuilder().addComponents(
new ButtonBuilder().setCustomId(“g_trivia”).setLabel(“🧠 تحدي فردي”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“g_scramble”).setLabel(“🔤 كلمة مفككة”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“g_missing”).setLabel(“❓ حرف ناقص”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“g_complete”).setLabel(“📝 كمل الكلمة”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“g_roulette”).setLabel(“🎲 روليت الكيان”).setStyle(ButtonStyle.Secondary)
),
new ActionRowBuilder().addComponents(
new ButtonBuilder().setCustomId(“g_skillcheck”).setLabel(“🎯 فحص المهارة”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“g_luckybox”).setLabel(“📦 صندوق الحظ”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“g_mafia”).setLabel(“🕵️ مافيا الشات”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“g_queue”).setLabel(“⚔️ تحدي جماعي [4]”).setStyle(ButtonStyle.Primary),
new ButtonBuilder().setCustomId(“g_lb”).setLabel(“🏆 الاساطير”).setStyle(ButtonStyle.Secondary)
)
];
}

function retryRow(btnId) {
return [new ActionRowBuilder().addComponents(
new ButtonBuilder().setCustomId(btnId).setLabel(“🔄 مرة ثانية”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“open_menu”).setLabel(“🏠 القائمة”).setStyle(ButtonStyle.Secondary)
)];
}

// ─── MESSAGE HANDLER ─────────────────────────────────────────────────────────
client.on(“messageCreate”, async msg => {
if (msg.author.bot) return;
const content = msg.content.trim();
const lower = content.toLowerCase();

if ([”!menu”, “!لعب”, “لعب”, “!play”].includes(lower)) {
return msg.reply({ embeds: [logoEmbed()], components: startRow() });
}

// فحص التحدي الجماعي
if (activeMatch && activeMatch.type === “group”) {
if (matchAns(content, activeMatch.answers)) {
const winner = getPlayer(msg.author.id, msg.author.username);
winner.pts += 100;
activeMatch = null;
if (matchTimeout) clearTimeout(matchTimeout);
return msg.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“🏆 فاز بالتحدي!”).setDescription(”**” + msg.author.username + “** جاوب اول واحد!\n💰 **+100 نقطة**”)] });
}
}

// فحص مافيا الشات - البحث عن منشن أو اسم الهدف
if (activeMatch && activeMatch.type === “mafia”) {
const mentionMatch = msg.mentions.users.has(activeMatch.targetId);
const nameMatch = lower.includes(activeMatch.targetName.toLowerCase());
if (mentionMatch || nameMatch) {
const hero = getPlayer(msg.author.id, msg.author.username);
const target = getPlayer(activeMatch.targetId, activeMatch.targetName);
hero.pts += 50;
target.pts = Math.max(0, target.pts - 40);
activeMatch = null;
if (matchTimeout) clearTimeout(matchTimeout);
return msg.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“🕵️ تم كشف المافيا!”).setDescription(”**” + msg.author.username + “** كشف الجاسوس!\n\n💰 الكاشف: **+50** نقطة\n📉 المافيا **” + activeMatch.targetName + “**: **-40** نقطة”)] });
}
}

// فحص الالعاب الفردية
const game = activeGames.get(msg.channel.id);
if (!game) return;

if (matchAns(content, game.data.answers || [game.data.answer])) {
activeGames.delete(msg.channel.id);
const p = getPlayer(msg.author.id, msg.author.username);
p.pts += 40;
return msg.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“✅ صحيح!”).setDescription(”**” + msg.author.username + “** جابها!\n💰 **رصيدك:** `" + p.pts + "` نقطة”)], components: retryRow(“g_” + game.type) });
}
});

// ─── INTERACTION HANDLER ─────────────────────────────────────────────────────
client.on(“interactionCreate”, async interaction => {
if (!interaction.isButton()) return;
const id = interaction.customId;
const p = getPlayer(interaction.user.id, interaction.user.username);

// القائمة الرئيسية
if (id === “open_menu” || id === “go_menu”) {
return interaction.update({
content: “**طابور:** `[" + lobbyQueue.size + "/4]`”,
embeds: [logoEmbed()],
components: menuRows()
});
}

// تحدي فردي
if (id === “g_trivia”) {
if (activeGames.has(interaction.channel.id)) return interaction.reply({ content: “⚠️ في لعبة شغالة الحين!”, ephemeral: true });
const q = rand(dbdQuestions);
activeGames.set(interaction.channel.id, { type: “trivia”, data: q });
setTimeout(() => {
if (activeGames.has(interaction.channel.id)) {
activeGames.delete(interaction.channel.id);
interaction.channel.send({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“⏱️ انتهى الوقت!”).setDescription(“الجواب: **” + (q.answers ? q.answers[0] : q.answer) + “**”)] });
}
}, 30000);
return interaction.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“🧠 تحدي فردي!”).setDescription(”### “ + q.q).setFooter({ text: “اكتب الجواب! عندك 30 ثانية” })] });
}

// كلمة مفككة
if (id === “g_scramble”) {
if (activeGames.has(interaction.channel.id)) return interaction.reply({ content: “⚠️ في لعبة شغالة الحين!”, ephemeral: true });
const w = rand(scrambledWords);
activeGames.set(interaction.channel.id, { type: “scramble”, data: { answers: [w.answer], …w } });
setTimeout(() => {
if (activeGames.has(interaction.channel.id)) {
activeGames.delete(interaction.channel.id);
interaction.channel.send({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“⏱️ انتهى الوقت!”).setDescription(“الجواب: **” + w.answer + “**”)] });
}
}, 45000);
return interaction.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“🔤 كلمة مفككة!”).setDescription(”### رتب الحروف:\n# `" + w.scrambled + "`”).addFields({ name: “💡 تلميح”, value: “||” + w.hint + “||” }).setFooter({ text: “اكتب الكلمة الصحيحة! عندك 45 ثانية” })] });
}

// حرف ناقص
if (id === “g_missing”) {
if (activeGames.has(interaction.channel.id)) return interaction.reply({ content: “⚠️ في لعبة شغالة الحين!”, ephemeral: true });
const w = rand(missingLetterWords);
activeGames.set(interaction.channel.id, { type: “missing”, data: { answers: [w.answer], …w } });
setTimeout(() => {
if (activeGames.has(interaction.channel.id)) {
activeGames.delete(interaction.channel.id);
interaction.channel.send({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“⏱️ انتهى الوقت!”).setDescription(“الجواب: **” + w.answer + “**”)] });
}
}, 30000);
return interaction.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“❓ حرف ناقص!”).setDescription(”### اكمل الكلمة:\n# `" + w.blanked + "`”).addFields({ name: “💡 تلميح”, value: “||” + w.hint + “||” }).setFooter({ text: “اكتب الكلمة الكاملة! عندك 30 ثانية” })] });
}

// كمل الكلمة
if (id === “g_complete”) {
if (activeGames.has(interaction.channel.id)) return interaction.reply({ content: “⚠️ في لعبة شغالة الحين!”, ephemeral: true });
const w = rand(completeWordGames);
activeGames.set(interaction.channel.id, { type: “complete”, data: w });
setTimeout(() => {
if (activeGames.has(interaction.channel.id)) {
activeGames.delete(interaction.channel.id);
interaction.channel.send({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“⏱️ انتهى الوقت!”).setDescription(“الجواب: **” + w.answers[0] + “**”)] });
}
}, 30000);
return interaction.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“📝 كمل الكلمة!”).setDescription(”### اكمل اسم البيرك:\n# `" + w.display + "`”).addFields({ name: “💡 تلميح”, value: “||” + w.hint + “||” }).setFooter({ text: “اكتب الاسم الكامل! عندك 30 ثانية” })] });
}

// روليت الكيان
if (id === “g_roulette”) {
if (p.pts < 30) return interaction.reply({ content: “❌ رصيدك اقل من 30! ما تقدر تخاطر.”, ephemeral: true });
const win = Math.random() > 0.5;
if (win) {
p.pts += 60;
return interaction.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“🎲 روليت: هربت!”).setDescription(“نجحت في الهروب!\n💰 **+60 نقطة** — رصيدك: `" + p.pts + "`”)], components: retryRow(“g_roulette”) });
} else {
p.pts -= 30;
return interaction.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“💀 روليت: علقوك!”).setDescription(“تم تعليقك على الهوك.\n📉 **-30 نقطة** — رصيدك: `" + p.pts + "`”)], components: retryRow(“g_roulette”) });
}
}

// فحص المهارة
if (id === “g_skillcheck”) {
const target = Math.floor(Math.random() * 4);
const uid = interaction.user.id;
const row = new ActionRowBuilder().addComponents(
[0, 1, 2, 3].map(i => new ButtonBuilder()
.setCustomId(“sk_” + i + “*” + target + “*” + uid)
.setLabel(i === target ? “🎯” : “⚙️”)
.setStyle(ButtonStyle.Secondary)
)
);
return interaction.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“🎯 فحص المهارة!”).setDescription(“اضغط على 🎯 بسرعة!”)], components: [row], ephemeral: true });
}

if (id.startsWith(“sk_”)) {
const parts = id.split(”_”);
const clicked = parts[1], target = parts[2], uid = parts[3];
if (interaction.user.id !== uid) return interaction.reply({ content: “❌ مو فحصك!”, ephemeral: true });
if (clicked === target) {
p.pts += 35;
return interaction.update({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“✅ نجحت!”).setDescription(“💰 **+35 نقطة** — رصيدك: `" + p.pts + "`”)], components: retryRow(“g_skillcheck”) });
} else {
p.pts = Math.max(0, p.pts - 20);
return interaction.update({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“💥 فشلت!”).setDescription(“📉 **-20 نقطة** — رصيدك: `" + p.pts + "`”)], components: retryRow(“g_skillcheck”) });
}
}

// صندوق الحظ
if (id === “g_luckybox”) {
const target = Math.floor(Math.random() * 3);
const uid = interaction.user.id;
const row = new ActionRowBuilder().addComponents(
[0, 1, 2].map(i => new ButtonBuilder()
.setCustomId(“box_” + i + “*” + target + “*” + uid)
.setLabel(“📦 صندوق “ + (i + 1))
.setStyle(ButtonStyle.Secondary)
)
);
return interaction.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“📦 صندوق الحظ!”).setDescription(“واحد فيه مفتاح هروب، واحد فيه فخ ترابر، وواحد فاضي!\nاختر:”)], components: [row], ephemeral: true });
}

if (id.startsWith(“box_”)) {
const parts = id.split(”_”);
const clicked = parts[1], target = parts[2], uid = parts[3];
if (interaction.user.id !== uid) return interaction.reply({ content: “❌ مو صندوقك!”, ephemeral: true });
if (clicked === target) {
p.pts += 50;
return interaction.update({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“🔑 لقيت المفتاح!”).setDescription(“هربت! 💰 **+50 نقطة** — رصيدك: `" + p.pts + "`”)], components: retryRow(“g_luckybox”) });
} else if (Math.random() > 0.5) {
p.pts = Math.max(0, p.pts - 30);
return interaction.update({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“🪤 فخ ترابر!”).setDescription(“كلاك! 📉 **-30 نقطة** — رصيدك: `" + p.pts + "`”)], components: retryRow(“g_luckybox”) });
} else {
return interaction.update({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“💨 صندوق فاضي!”).setDescription(“ما فيه شيء هذه المرة.”)], components: retryRow(“g_luckybox”) });
}
}

// مافيا الشات - مصلّحة
if (id === “g_mafia”) {
if (activeMatch) return interaction.reply({ content: “⚠️ في تحدي نشط الحين!”, ephemeral: true });
try {
const members = await interaction.guild.members.fetch();
const humans = members.filter(m => !m.user.bot && m.user.id !== interaction.user.id);
if (humans.size < 2) return interaction.reply({ content: “❌ ما في اعضاء كافيين!”, ephemeral: true });
const target = humans.random().user;
activeMatch = { type: “mafia”, targetId: target.id, targetName: target.username };
matchTimeout = setTimeout(() => {
if (activeMatch && activeMatch.type === “mafia”) {
activeMatch = null;
interaction.channel.send({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“⏱️ افلت الجاسوس!”).setDescription(“انتهى الوقت! الجاسوس كان: **” + target.username + “**”)] });
}
}, 30000);
return interaction.reply({
content: “🚨 **انطلقت مافيا الشات!**\nفي جاسوس مختفي بالروم! اول حرف من اسمه: **`" + target.username[0].toUpperCase() + "`**\nاكتب منشن او اسم الجاسوس عشان تمسكه وتاخذ نقاطه!\n⏳ عندك 30 ثانية!”
});
} catch (err) {
return interaction.reply({ content: “❌ حدث خطأ في تشغيل المافيا.”, ephemeral: true });
}
}

// تحدي جماعي
if (id === “g_queue”) {
if (activeMatch) return interaction.reply({ content: “⚠️ في تحدي نشط الحين!”, ephemeral: true });
if (lobbyQueue.has(interaction.user.id)) return interaction.reply({ content: “⚠️ انت مسجل بالفعل!”, ephemeral: true });
lobbyQueue.add(interaction.user.id);
if (lobbyQueue.size >= 4) {
const q = rand(dbdQuestions);
activeMatch = { type: “group”, …q };
lobbyQueue.clear();
matchTimeout = setTimeout(() => {
if (activeMatch) {
activeMatch = null;
interaction.channel.send({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“⏱️ انتهى التحدي!”).setDescription(“الجواب: **” + q.answers[0] + “**”)] });
}
}, 60000);
await interaction.update({ content: “**[4/4] اكتمل الطابور!**”, embeds: [logoEmbed()], components: menuRows() });
return interaction.channel.send({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“⚔️ بدأت المواجهة الجماعية!”).setDescription(”### “ + q.q + “\n\nاسرع واحد يجاوب ياخذ **100 نقطة**! عندكم 60 ثانية ⏳”)] });
}
return interaction.update({ content: “**طابور:** `[" + lobbyQueue.size + "/4]` — باقي “ + (4 - lobbyQueue.size) + “ لاعبين…”, embeds: [logoEmbed()], components: menuRows() });
}

// لوحة الصدارة
if (id === “g_lb”) {
const sorted = […db.values()].sort((a, b) => b.pts - a.pts).slice(0, 10);
const medals = [“🥇”, “🥈”, “🥉”];
const desc = sorted.length
? sorted.map((pl, i) => (medals[i] || (i + 1) + “.”) + “ **” + pl.name + “** — `" + pl.pts + "` نقطة”).join(”\n”)
: “📭 القائمة فارغة!”;
return interaction.reply({ embeds: [new EmbedBuilder().setColor(DISCORD_BG).setTitle(“🏆 اساطير الضباب”).setDescription(desc)], ephemeral: true });
}
});

client.once(“ready”, () => {
console.log(“SOUL DBD Bot Ready! “ + client.user.tag);
client.user.setActivity(“Dead by Daylight | !menu”, { type: 0 });
});

client.login(process.env.DISCORD_TOKEN);
