const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection } = require(“discord.js”);

const client = new Client({
intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});

const LOGO = “https://cdn.discordapp.com/attachments/1510327104041127959/1510647569435332658/IMG_0059.jpg”;
const COLOR = 0x2B2D31;

const questions = [
{ q: “كم مولد تصلح عشان تفتح الباب؟”, a: [“5”, “خمسة”] },
{ q: “وش اسم العملة في DBD؟”, a: [“bloodpoints”, “بلودبوينتس”] },
{ q: “كم سرفايفر في المباراة؟”, a: [“4”, “اربعة”] },
{ q: “ما هو البيرك اللي يخليك تقوم لوحدك من الارض؟”, a: [“unbreakable”, “انبريكبل”] },
{ q: “ما هو البيرك اللي يرجع المولدات للخلف لوحدها؟”, a: [“ruin”, “hex ruin”, “هيكس رين”] },
{ q: “ما اسم الكيلر اللي يبلنك من خلال الجدران؟”, a: [“nurse”, “نيرس”] },
{ q: “ما اسم الكيلر اللي يرمي فؤوس؟”, a: [“huntress”, “هنتريس”] },
{ q: “ما اسم الكيلر من Halloween؟”, a: [“shape”, “myers”, “شيب”, “مايرز”] },
{ q: “ما اسم الكيلر من Resident Evil 3؟”, a: [“nemesis”, “نيميسيس”] },
{ q: “ما اسم الكيلر من Alien؟”, a: [“xenomorph”, “زينومورف”] },
{ q: “ما اسم الكيلر من Scream؟”, a: [“ghost face”, “ghostface”, “غوست فيس”] },
{ q: “ما اسم الكيلر من Saw؟”, a: [“pig”, “بيج”, “البيج”] },
{ q: “ما هو البيرك اللي يخليك تتهرب من ضربة؟”, a: [“dead hard”, “deadhard”, “ديد هارد”] },
{ q: “ما هو البيرك اللي يخليك تشفي نفسك بدون صندوق؟”, a: [“self care”, “selfcare”, “سيلف كير”] },
{ q: “ما هو البيرك اللي يعطيك سرعة مفاجئة اول ما تركض؟”, a: [“sprint burst”, “sprintburst”, “سبرنت برست”] },
{ q: “ما هو البيرك اللي يوقف 3 مولدات في البداية؟”, a: [“corrupt intervention”, “كوراپت انترفينشن”] },
{ q: “ما هو البيرك اللي يخليك تشوف السرفايفرز بعد الخطاف؟”, a: [“barbecue”, “barbecue and chili”, “باربيكيو”] },
{ q: “كم مرة تتحمل على الخطاف قبل الموت؟”, a: [“2”, “مرتين”, “اثنين”] },
{ q: “ما اسم الكيلر الياباني الخبير؟”, a: [“spirit”, “سبيريت”] },
{ q: “ما اسم الكيلر من Texas Chainsaw؟”, a: [“cannibal”, “bubba”, “كانيبال”, “بوبا”] },
{ q: “ما اسم الكيلر من Stranger Things؟”, a: [“demogorgon”, “ديموقورقون”] },
{ q: “ما هو البيرك اللي يبطئ المولدات لما سرفايفر يتجرح؟”, a: [“thanatophobia”, “ثاناتوفوبيا”] },
{ q: “ما اسم الكيلر من Child’s Play؟”, a: [“chucky”, “چاكي”] },
{ q: “ما هو البيرك اللي يخليك ما تصدر صوت وانت مجروح؟”, a: [“iron will”, “ironwill”, “ايرون ويل”] },
{ q: “ما اسم الكيلر من RE8؟”, a: [“mastermind”, “wesker”, “ماسترمايند”, “ويسكر”] },
{ q: “ما اسم الكيلر اللي يرمي سكاكين كثيرة؟”, a: [“trickster”, “ترايكستر”] },
{ q: “ما هو البيرك اللي يعطيك حماية بعد الانقاذ؟”, a: [“borrowed time”, “borrowedtime”, “بوروود تايم”] },
{ q: “ما اسم الكيلر من Hellraiser؟”, a: [“cenobite”, “pinhead”, “سينوبايت”, “بينهيد”] },
{ q: “ما هو البيرك اللي يطعن الكيلر بعد الانقاذ؟”, a: [“decisive strike”, “ds”, “ديسيسيف ستريك”] },
{ q: “كم لاعب في المباراة كلهم؟”, a: [“5”, “خمسة”] },
{ q: “ما اسم الكيلر من The Ring؟”, a: [“onryo”, “sadako”, “اونريو”, “ساداكو”] },
{ q: “ما هو البيرك اللي يشفيك عند اخر مولد؟”, a: [“adrenaline”, “ادرينالين”] },
{ q: “ما اسم الكيلر اللي يستخدم غاز؟”, a: [“clown”, “كلاون”] },
{ q: “ما هو البيرك اللي يخليك تحس بالكيلر وهو يشوفك؟”, a: [“spine chill”, “spinechill”, “سبين شيل”] },
{ q: “ما معنى DBD؟”, a: [“dead by daylight”] },
{ q: “ما اسم الكيلر اللي يستخدم سنانير ضخمة؟”, a: [“executioner”, “pyramid head”, “اكزيكيوشنر”, “بيراميد هيد”] },
{ q: “ما هو البيرك اللي يظهر مكان السرفايفرز بعد الخطاف؟”, a: [“barbecue and chili”, “barbecue”, “باربيكيو”] },
{ q: “ما اسم الكيلر الكوري اللي يرمي سكاكين؟”, a: [“trickster”, “ji-woon”, “ترايكستر”] },
{ q: “ما هو البيرك اللي يعطيك معلومات عن الشخص اللي تصيده؟”, a: [“best of prey”, “ايست اوف براي”] },
{ q: “ما اسم الكيلر اللي له قوة Rush ويرتد؟”, a: [“blight”, “بلايت”] },
{ q: “ما اسم الكيلر اللي يستخدم امراض؟”, a: [“plague”, “بليج”] },
{ q: “كم عدد ابواب الخروج في المباراة؟”, a: [“2”, “مرتين”, “اثنين”] },
{ q: “ما هو الشيء اللي ترميه عشان توقف الكيلر؟”, a: [“pallet”, “بالت”] },
{ q: “ما اسم الكيلر من Alan Wake؟”, a: [“unknown”, “انونن”] },
{ q: “ما اسم الكيلر اللي له اجنحة غربان؟”, a: [“artist”, “ارتيست”] },
{ q: “ما هو البيرك اللي يخليك تشوف الكيلر وهو يشوفك؟”, a: [“object of obsession”, “ooo”] },
{ q: “ما اسم الكيلر اللي يرسم فخاخ على الارض؟”, a: [“hag”, “هاج”] },
{ q: “ما هو البيرك اللي يخرب المولد بعد الخطاف؟”, a: [“pop goes the weasel”, “pop”, “بوب”] },
{ q: “ما اسم الشيء اللي تكسره عشان تلغي الهيكس؟”, a: [“totem”, “توتيم”] },
{ q: “ما هو البيرك اللي يصرخ فيه الناجين بعد الخطاف؟”, a: [“infectious fright”, “انفيكشس فرايت”] }
];

const scrambled = [
{ s: “ر ا ر ب ت”, a: “ترابر”, h: “كيلر الفخاخ” },
{ s: “س ر ي ن”, a: “نيرس”, h: “كيلر البلنك” },
{ s: “ي ت ن س ه ر”, a: “هنتريس”, h: “كيلر الفؤوس” },
{ s: “ت ي ل ب ا”, a: “بلايت”, h: “كيلر خبير سريع” },
{ s: “ت ي ر ب ي س”, a: “سبيريت”, h: “كيلر ياباني” },
{ s: “و د ن”, a: “نود”, h: “بيرك كيلر خطير” },
{ s: “ن ي ل ا ن ي ر د ا”, a: “ادرينالين”, h: “بيرك سرفايفر اخر مولد” },
{ s: “ي ك ا چ”, a: “چاكي”, h: “دمية كيلر” },
{ s: “ر ه ب ر ت ا ب”, a: “باربيكيو”, h: “بيرك ترى فيه الجميع” },
{ s: “ل ب ك ر ب ن ا”, a: “انبريكبل”, h: “بيرك القيام لوحدك” },
{ s: “ج ه ا”, a: “هاج”, h: “كيلر الفخاخ الارضية” },
{ s: “ج ن ي ل”, a: “ليجن”, h: “كيلر يركض بجنون” }
];

const missing = [
{ b: “_رابر”, a: “ترابر”, h: “كيلر الفخاخ” },
{ b: “ني_س”, a: “نيرس”, h: “كيلر البلنك” },
{ b: “هنت_يس”, a: “هنتريس”, h: “كيلر الفؤوس” },
{ b: “سبي_يت”, a: “سبيريت”, h: “كيلر ياباني” },
{ b: “ديد ه_رد”, a: “ديد هارد”, h: “بيرك تهرب من ضربة” },
{ b: “انبريك_ل”, a: “انبريكبل”, h: “بيرك تقوم لوحدك” },
{ b: “بارب_كيو”, a: “باربيكيو”, h: “بيرك ترى السرفايفرز” },
{ b: “چا_ي”, a: “چاكي”, h: “دمية قاتلة” },
{ b: “ب_ايت”, a: “بلايت”, h: “كيلر سريع خبير” },
{ b: “ه_كس رين”, a: “هيكس رين”, h: “بيرك يوقف المولدات” }
];

const complete = [
{ d: “سيلف ____”, a: [“سيلف كير”, “self care”], h: “بيرك الهيل لوحدك” },
{ d: “ديسيسيف ____”, a: [“ديسيسيف ستريك”, “decisive strike”], h: “بيرك طعنة الكيلر” },
{ d: “سبرنت ____”, a: [“سبرنت برست”, “sprint burst”], h: “بيرك السرعة المفاجئة” },
{ d: “ايرون ____”, a: [“ايرون ويل”, “iron will”], h: “بيرك الصمت وانت مجروح” },
{ d: “بوروود ____”, a: [“بوروود تايم”, “borrowed time”], h: “بيرك حماية المنقذ” },
{ d: “هيكس ____”, a: [“هيكس رين”, “hex ruin”], h: “بيرك يرجع المولدات” },
{ d: “كوراپت ____”, a: [“كوراپت انترفينشن”, “corrupt intervention”], h: “بيرك يوقف 3 مولدات” },
{ d: “باربيكيو ____”, a: [“باربيكيو اند شيلي”, “barbecue and chili”], h: “بيرك ترى الكل بعد الخطاف” }
];

const db = new Collection();
const queue = new Set();
const games = new Collection();
let match = null;
let matchTimer = null;

function player(id, name) {
if (!db.has(id)) db.set(id, { id, name, pts: 100 });
const p = db.get(id); p.name = name; return p;
}

function clean(s) {
if (!s) return “”;
return s.toLowerCase().trim().replace(/\s+/g, “”).replace(/[أإآا]/g, “ا”).replace(/ة/g, “ه”).replace(/ى/g, “ي”);
}

function check(input, answers) {
const c = clean(input);
return answers.some(a => clean(a) === c || c.includes(clean(a)));
}

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function logo() {
return new EmbedBuilder().setColor(COLOR).setImage(LOGO);
}

function menuRows() {
return [
new ActionRowBuilder().addComponents(
new ButtonBuilder().setCustomId(“g_trivia”).setLabel(“🧠 تحدي فردي”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“g_scramble”).setLabel(“🔤 كلمة مفككة”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“g_missing”).setLabel(“❓ حرف ناقص”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“g_complete”).setLabel(“📝 كمل الكلمة”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“g_roulette”).setLabel(“🎲 روليت”).setStyle(ButtonStyle.Secondary)
),
new ActionRowBuilder().addComponents(
new ButtonBuilder().setCustomId(“g_skillcheck”).setLabel(“🎯 فحص المهارة”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“g_luckybox”).setLabel(“📦 صندوق الحظ”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“g_mafia”).setLabel(“🕵️ مافيا الشات”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“g_queue”).setLabel(“⚔️ تحدي جماعي”).setStyle(ButtonStyle.Primary),
new ButtonBuilder().setCustomId(“g_lb”).setLabel(“🏆 الاساطير”).setStyle(ButtonStyle.Secondary)
)
];
}

function again(id) {
return [new ActionRowBuilder().addComponents(
new ButtonBuilder().setCustomId(id).setLabel(“🔄 مرة ثانية”).setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId(“g_menu”).setLabel(“🏠 القائمة”).setStyle(ButtonStyle.Secondary)
)];
}

function expire(channelId, answer, channel) {
setTimeout(() => {
if (games.has(channelId)) {
games.delete(channelId);
channel.send({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“⏱️ انتهى الوقت!”).setDescription(“الجواب: **” + answer + “**”)] });
}
}, 30000);
}

client.on(“messageCreate”, async msg => {
if (msg.author.bot) return;
const txt = msg.content.trim();
const low = txt.toLowerCase();

if ([”!menu”, “!play”, “!لعب”].includes(low)) {
return msg.reply({ embeds: [logo()], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(“g_menu”).setLabel(“🎮 قائمة الالعاب”).setStyle(ButtonStyle.Secondary))] });
}

if (match && match.type === “group” && check(txt, match.answers)) {
const w = player(msg.author.id, msg.author.username);
w.pts += 100; match = null; if (matchTimer) clearTimeout(matchTimer);
return msg.reply({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“🏆 فاز بالتحدي!”).setDescription(”**” + msg.author.username + “** جاوب اول واحد!\n+100 نقطة — رصيدك: `" + w.pts + "`”)] });
}

if (match && match.type === “mafia”) {
const mentioned = msg.mentions.users.has(match.tid);
const named = low.includes(match.tname.toLowerCase());
if (mentioned || named) {
const hero = player(msg.author.id, msg.author.username);
const target = player(match.tid, match.tname);
hero.pts += 50; target.pts = Math.max(0, target.pts - 40);
const tname = match.tname; match = null; if (matchTimer) clearTimeout(matchTimer);
return msg.reply({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“🕵️ تم كشف المافيا!”).setDescription(”**” + msg.author.username + “** كشف الجاسوس **” + tname + “**!\n\nالكاشف: +50 نقطة\nالمافيا: -40 نقطة”)] });
}
}

const g = games.get(msg.channel.id);
if (!g) return;
const answers = g.data.a ? [g.data.a] : g.data.answers || g.data.a || [];
if (check(txt, answers)) {
games.delete(msg.channel.id);
const p = player(msg.author.id, msg.author.username);
p.pts += 40;
return msg.reply({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“✅ صحيح!”).setDescription(”**” + msg.author.username + “** جابها!\n+40 نقطة — رصيدك: `" + p.pts + "`”)], components: again(“g_” + g.type) });
}
});

client.on(“interactionCreate”, async interaction => {
if (!interaction.isButton()) return;
const id = interaction.customId;
const p = player(interaction.user.id, interaction.user.username);

if (id === “g_menu”) {
return interaction.update({ content: “طابور: [” + queue.size + “/4]”, embeds: [logo()], components: menuRows() });
}

if (id === “g_trivia”) {
if (games.has(interaction.channel.id)) return interaction.reply({ content: “⚠️ في لعبة شغالة الحين!”, ephemeral: true });
const q = rand(questions);
games.set(interaction.channel.id, { type: “trivia”, data: { a: q.a[0], answers: q.a } });
expire(interaction.channel.id, q.a[0], interaction.channel);
return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“🧠 تحدي فردي!”).setDescription(”### “ + q.q).setFooter({ text: “اكتب الجواب! 30 ثانية” })] });
}

if (id === “g_scramble”) {
if (games.has(interaction.channel.id)) return interaction.reply({ content: “⚠️ في لعبة شغالة الحين!”, ephemeral: true });
const w = rand(scrambled);
games.set(interaction.channel.id, { type: “scramble”, data: { a: w.a, answers: [w.a] } });
expire(interaction.channel.id, w.a, interaction.channel);
return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“🔤 كلمة مفككة!”).setDescription(“رتب الحروف:\n# `" + w.s + "`”).addFields({ name: “تلميح”, value: “||” + w.h + “||” }).setFooter({ text: “30 ثانية” })] });
}

if (id === “g_missing”) {
if (games.has(interaction.channel.id)) return interaction.reply({ content: “⚠️ في لعبة شغالة الحين!”, ephemeral: true });
const w = rand(missing);
games.set(interaction.channel.id, { type: “missing”, data: { a: w.a, answers: [w.a] } });
expire(interaction.channel.id, w.a, interaction.channel);
return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“❓ حرف ناقص!”).setDescription(“اكمل الكلمة:\n# `" + w.b + "`”).addFields({ name: “تلميح”, value: “||” + w.h + “||” }).setFooter({ text: “30 ثانية” })] });
}

if (id === “g_complete”) {
if (games.has(interaction.channel.id)) return interaction.reply({ content: “⚠️ في لعبة شغالة الحين!”, ephemeral: true });
const w = rand(complete);
games.set(interaction.channel.id, { type: “complete”, data: { a: w.a[0], answers: w.a } });
expire(interaction.channel.id, w.a[0], interaction.channel);
return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“📝 كمل الكلمة!”).setDescription(“اكمل اسم البيرك:\n# `" + w.d + "`”).addFields({ name: “تلميح”, value: “||” + w.h + “||” }).setFooter({ text: “30 ثانية” })] });
}

if (id === “g_roulette”) {
if (p.pts < 30) return interaction.reply({ content: “❌ رصيدك اقل من 30!”, ephemeral: true });
const win = Math.random() > 0.5;
if (win) { p.pts += 60; return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“🎲 هربت!”).setDescription(”+60 نقطة — رصيدك: `" + p.pts + "`”)], components: again(“g_roulette”) }); }
else { p.pts -= 30; return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“💀 علقوك!”).setDescription(”-30 نقطة — رصيدك: `" + p.pts + "`”)], components: again(“g_roulette”) }); }
}

if (id === “g_skillcheck”) {
const t = Math.floor(Math.random() * 4);
const uid = interaction.user.id;
const row = new ActionRowBuilder().addComponents([0, 1, 2, 3].map(i => new ButtonBuilder().setCustomId(“sk_” + i + “*” + t + “*” + uid).setLabel(i === t ? “🎯” : “⚙️”).setStyle(ButtonStyle.Secondary)));
return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“🎯 فحص المهارة!”).setDescription(“اضغط على 🎯 بسرعة!”)], components: [row], ephemeral: true });
}

if (id.startsWith(“sk_”)) {
const [, clicked, target, uid] = id.split(”_”);
if (interaction.user.id !== uid) return interaction.reply({ content: “مو فحصك!”, ephemeral: true });
if (clicked === target) { p.pts += 35; return interaction.update({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“✅ نجحت!”).setDescription(”+35 نقطة — رصيدك: `" + p.pts + "`”)], components: again(“g_skillcheck”) }); }
else { p.pts = Math.max(0, p.pts - 20); return interaction.update({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“💥 فشلت!”).setDescription(”-20 نقطة — رصيدك: `" + p.pts + "`”)], components: again(“g_skillcheck”) }); }
}

if (id === “g_luckybox”) {
const t = Math.floor(Math.random() * 3);
const uid = interaction.user.id;
const row = new ActionRowBuilder().addComponents([0, 1, 2].map(i => new ButtonBuilder().setCustomId(“box_” + i + “*” + t + “*” + uid).setLabel(“📦 “ + (i + 1)).setStyle(ButtonStyle.Secondary)));
return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“📦 صندوق الحظ!”).setDescription(“واحد فيه مفتاح هروب، واحد فيه فخ، وواحد فاضي!”)], components: [row], ephemeral: true });
}

if (id.startsWith(“box_”)) {
const [, clicked, target, uid] = id.split(”_”);
if (interaction.user.id !== uid) return interaction.reply({ content: “مو صندوقك!”, ephemeral: true });
if (clicked === target) { p.pts += 50; return interaction.update({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“🔑 لقيت المفتاح!”).setDescription(”+50 نقطة — رصيدك: `" + p.pts + "`”)], components: again(“g_luckybox”) }); }
else if (Math.random() > 0.5) { p.pts = Math.max(0, p.pts - 30); return interaction.update({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“🪤 فخ ترابر!”).setDescription(”-30 نقطة — رصيدك: `" + p.pts + "`”)], components: again(“g_luckybox”) }); }
else { return interaction.update({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“💨 صندوق فاضي!”).setDescription(“ما كسبت ولا خسرت شيء.”)], components: again(“g_luckybox”) }); }
}

if (id === “g_mafia”) {
if (match) return interaction.reply({ content: “في تحدي نشط الحين!”, ephemeral: true });
try {
const members = await interaction.guild.members.fetch();
const humans = members.filter(m => !m.user.bot && m.user.id !== interaction.user.id);
if (humans.size < 1) return interaction.reply({ content: “ما في اعضاء كافيين!”, ephemeral: true });
const target = humans.random().user;
match = { type: “mafia”, tid: target.id, tname: target.username };
matchTimer = setTimeout(() => {
if (match && match.type === “mafia”) {
const n = match.tname; match = null;
interaction.channel.send({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“⏱️ افلت الجاسوس!”).setDescription(“الجاسوس كان: **” + n + “**”)] });
}
}, 30000);
return interaction.reply({ content: “🚨 **مافيا الشات!**\nفي جاسوس بالروم! اول حرف من اسمه: **`" + target.username[0].toUpperCase() + "`**\nاكتب منشن او اسمه عشان تمسكه! 30 ثانية ⏳” });
} catch (e) {
return interaction.reply({ content: “حدث خطأ.”, ephemeral: true });
}
}

if (id === “g_queue”) {
if (match) return interaction.reply({ content: “في تحدي نشط الحين!”, ephemeral: true });
if (queue.has(interaction.user.id)) return interaction.reply({ content: “انت مسجل بالفعل!”, ephemeral: true });
queue.add(interaction.user.id);
if (queue.size >= 4) {
const q = rand(questions);
match = { type: “group”, answers: q.a };
queue.clear();
matchTimer = setTimeout(() => {
if (match) { match = null; interaction.channel.send({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“⏱️ انتهى التحدي!”).setDescription(“الجواب: **” + q.a[0] + “**”)] }); }
}, 60000);
await interaction.update({ content: “[4/4] اكتمل الطابور!”, embeds: [logo()], components: menuRows() });
return interaction.channel.send({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“⚔️ بدأت المواجهة الجماعية!”).setDescription(”### “ + q.q + “\n\nاسرع واحد يجاوب ياخذ 100 نقطة! 60 ثانية ⏳”)] });
}
return interaction.update({ content: “طابور: [” + queue.size + “/4] — باقي “ + (4 - queue.size) + “ لاعبين…”, embeds: [logo()], components: menuRows() });
}

if (id === “g_lb”) {
const sorted = […db.values()].sort((a, b) => b.pts - a.pts).slice(0, 10);
const medals = [“🥇”, “🥈”, “🥉”];
const desc = sorted.length ? sorted.map((pl, i) => (medals[i] || (i + 1) + “.”) + “ **” + pl.name + “** — `" + pl.pts + "` نقطة”).join(”\n”) : “القائمة فارغة!”;
return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLOR).setTitle(“🏆 اساطير الضباب”).setDescription(desc)], ephemeral: true });
}
});

client.once(“ready”, () => {
console.log(“SOUL DBD Bot Ready! “ + client.user.tag);
client.user.setActivity(“Dead by Daylight | !menu”, { type: 0 });
});

client.login(process.env.DISCORD_TOKEN);
