const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection } = require(‘discord.js’);

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent,
GatewayIntentBits.GuildMembers,
]
});

// ═══════════════════════════════════════
//              DBD DATA
// ═══════════════════════════════════════

const killers = [
{ name: ‘ذا ترابر’, eng: ‘The Trapper’, emoji: ‘🪤’, power: ‘فخاخ الدببة’, difficulty: ‘مبتدئ’, color: 0x8B4513 },
{ name: ‘ذا نيرس’, eng: ‘The Nurse’, emoji: ‘🩺’, power: ‘البلنك’, difficulty: ‘خبير’, color: 0xFFFFFF },
{ name: ‘ذا هنتريس’, eng: ‘The Huntress’, emoji: ‘🪓’, power: ‘الفؤوس’, difficulty: ‘مبتدئ’, color: 0x8B0000 },
{ name: ‘ذا شيب - مايرز’, eng: ‘The Shape’, emoji: ‘🔪’, power: ‘إيفل ويذن’, difficulty: ‘متوسط’, color: 0x000000 },
{ name: ‘ذا سبيريت’, eng: ‘The Spirit’, emoji: ‘👻’, power: ‘يامائوكا هونتنج’, difficulty: ‘خبير’, color: 0x9370DB },
{ name: ‘ذا بلايت’, eng: ‘The Blight’, emoji: ‘🧪’, power: ‘بلايتد كوراپشن’, difficulty: ‘خبير’, color: 0x00FF7F },
{ name: ‘ذا نيميسيس’, eng: ‘The Nemesis’, emoji: ‘☣️’, power: ‘تي-فيروس’, difficulty: ‘مبتدئ’, color: 0x006400 },
{ name: ‘ذا ماسترمايند - ويسكر’, eng: ‘The Mastermind’, emoji: ‘🦠’, power: ‘يوروبوروس إنفيكشن’, difficulty: ‘مبتدئ’, color: 0x4B0082 },
{ name: ‘ذا پيگ’, eng: ‘The Pig’, emoji: ‘🐷’, power: ‘جيكسو بابتيزم’, difficulty: ‘متوسط’, color: 0xFF69B4 },
{ name: ‘ذا غوست فيس’, eng: ‘Ghost Face’, emoji: ‘👤’, power: ‘نايت شراود’, difficulty: ‘متوسط’, color: 0x2F4F4F },
{ name: ‘ذا كلاون’, eng: ‘The Clown’, emoji: ‘🎪’, power: ‘ذا غاسر’, difficulty: ‘مبتدئ’, color: 0xFFD700 },
{ name: ‘ذا ليجن’, eng: ‘The Legion’, emoji: ‘😷’, power: ‘فيرال فرنزي’, difficulty: ‘مبتدئ’, color: 0x696969 },
{ name: ‘ذا أوني’, eng: ‘The Oni’, emoji: ‘🎭’, power: ‘يامائوكا رايث’, difficulty: ‘خبير’, color: 0xFF4500 },
{ name: ‘ذا ديثسلينجر’, eng: ‘The Deathslinger’, emoji: ‘🔫’, power: ‘ريدييمر’, difficulty: ‘متوسط’, color: 0xD2691E },
{ name: ‘ذا ترايكستر’, eng: ‘The Trickster’, emoji: ‘🎯’, power: ‘شوستوپر’, difficulty: ‘متوسط’, color: 0xFF1493 },
];

const perks = [
// سرفايفر
{ name: ‘ديد هارد’, eng: ‘Dead Hard’, type: ‘survivor’, emoji: ‘💨’, desc: ‘استخدم طاقتك للتهرب من ضربة واحدة’ },
{ name: ‘ديسيسيف ستريك’, eng: ‘Decisive Strike’, type: ‘survivor’, emoji: ‘🗡️’, desc: ‘بعد الإنقاذ اضرب الكيلر وافلت منه’ },
{ name: ‘سيلف كير’, eng: ‘Self Care’, type: ‘survivor’, emoji: ‘🩹’, desc: ‘اشفي نفسك بدون صندوق إسعاف’ },
{ name: ‘أدرينالين’, eng: ‘Adrenaline’, type: ‘survivor’, emoji: ‘⚡’, desc: ‘لما آخر مولد يشتغل تشتفي وتجري أسرع’ },
{ name: ‘أنبريكبل’, eng: ‘Unbreakable’, type: ‘survivor’, emoji: ‘💪’, desc: ‘قوم من الأرض لوحدك مرة واحدة’ },
{ name: ‘بوروود تايم’, eng: ‘Borrowed Time’, type: ‘survivor’, emoji: ‘⏳’, desc: ‘الشخص اللي أنقذته يأخذ حماية إضافية’ },
{ name: ‘سپاين شيل’, eng: ‘Spine Chill’, type: ‘survivor’, emoji: ‘🥶’, desc: ‘تحس لما الكيلر يشوفك مباشرة’ },
{ name: ‘سپرنت برست’, eng: ‘Sprint Burst’, type: ‘survivor’, emoji: ‘🏃’, desc: ‘أسرع بشكل مفاجئ عند أول ركضة’ },
// كيلر
{ name: ‘نود’, eng: ‘NOED’, type: ‘killer’, emoji: ‘💀’, desc: ‘بعد آخر مولد، ضربة واحدة تعطل أي سرفايفر’ },
{ name: ‘كوراپت إنترفينشن’, eng: ‘Corrupt Intervention’, type: ‘killer’, emoji: ‘🚫’, desc: ‘ثلاث مولدات تتحجب في البداية’ },
{ name: ‘باربيكيو آند شيلي’, eng: ‘Barbecue & Chili’, type: ‘killer’, emoji: ‘🔥’, desc: ‘بعد الخطاف تشوف كل السرفايفرز من بعيد’ },
{ name: ‘پوپ غوز ذا ويزل’, eng: ‘Pop Goes the Weasel’, type: ‘killer’, emoji: ‘💥’, desc: ‘بعد الخطاف خرب مولد بشدة’ },
{ name: ‘هيكس رين’, eng: ‘Hex: Ruin’, type: ‘killer’, emoji: ‘🕯️’, desc: ‘المولدات تتراجع لوحدها بدون سرفايفر’ },
{ name: ‘ثاناتوفوبيا’, eng: ‘Thanatophobia’, type: ‘killer’, emoji: ‘🩸’, desc: ‘كل سرفايفر مجروح يبطئ المولدات’ },
];

const trivia = [
{ q: ‘كم عدد المولدات اللي تحتاج تصلحها للخروج؟’, a: ‘5’, hint: ‘رقم بين 1 و 7’ },
{ q: ‘ما هي قوة ذا ترابر؟’, a: ‘bear trap’, hint: ‘شي يلتقط القدم’ },
{ q: ‘كم ضربة تحتاج قبل ما تقع على الأرض؟’, a: ‘2’, hint: ‘ضربة + ضربة’ },
{ q: ‘ما اسم العملة في Dead by Daylight؟’, a: ‘bloodpoints’, hint: ‘نقاط + دم’ },
{ q: ‘ما هو البيرك اللي يخليك تشوف الكيلر بعد الخطاف؟’, a: ‘barbecue’, hint: ‘باربيكيو آند …’ },
{ q: ‘كم عدد السرفايفرز في كل مباراة؟’, a: ‘4’, hint: ‘أقل من 5 وأكثر من 3’ },
{ q: ‘ما هي قوة ذا نيرس؟’, a: ‘blink’, hint: ‘تقفز من خلال الجدران’ },
{ q: ‘من هو الكيلر من Resident Evil؟’, a: ‘nemesis’, hint: ‘تي-فيروس’ },
{ q: ‘ما هو البيرك اللي يخليك تقوم لوحدك من الأرض؟’, a: ‘unbreakable’, hint: ‘أنبريكبل’ },
{ q: ‘كم مولد يتحجب مع كوراپت إنترفينشن؟’, a: ‘3’, hint: ‘ثلاث’ },
];

const chase = [
{
s: ‘🌫️ سمعت موسيقى الكيلر وهو قريب منك!’,
c: [
{ l: ‘🏃 اركض للـ Loop’, r: ‘✅ ذكي! كسبت وقت ثمين وأربكت الكيلر’, p: 10 },
{ l: ‘🙈 اختبأ تحت المولد’, r: ‘❌ خطأ! وجدك فوراً بسبب السكراتش ماركس’, p: -5 },
{ l: ‘💨 اركض عشوائي’, r: ‘😐 محظوظ هذه المرة… لكن ما راح تنجح دايم’, p: 0 },
]
},
{
s: ‘⛽ تصلح مولد ورأيت الكيلر يقترب من بعيد!’,
c: [
{ l: ‘⚡ أكمل المولد بسرعة’, r: ‘✅ أنجزت المولد قبل وصوله وهربت!’, p: 15 },
{ l: ‘🚶 اترك المولد واختبأ’, r: ‘😐 نجوت لكن المولد تأخر كثير’, p: 5 },
{ l: ‘😤 ابقى وخاطر’, r: ‘❌ ضربة! كانت مخاطرة غير محسوبة’, p: -10 },
]
},
{
s: ‘🪝 رفيقك على الخطاف والكيلر واقف بجانبه يحرسه!’,
c: [
{ l: ‘🤝 أنقذه فوراً رغم الكيلر’, r: ‘😬 أنقذته لكن خذيت ضربة قوية’, p: -5 },
{ l: ‘⏳ انتظر الكيلر يمشي’, r: ‘✅ صبرت وأنقذته بأمان! قرار حكيم’, p: 20 },
{ l: ‘🔧 اصلح مولد بعيد’, r: ‘😔 مولد اشتغل لكن رفيقك مات على الخطاف’, p: 5 },
]
},
];

// ═══════════════════════════════════════
//           STORAGE & HELPERS
// ═══════════════════════════════════════

const leaderboard = new Collection();
const activeTrivia = new Collection();
const activeChase = new Collection();

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function addPts(id, name, pts) {
const cur = leaderboard.get(id) || { name, pts: 0 };
cur.pts += pts;
cur.name = name;
leaderboard.set(id, cur);
return cur.pts;
}

function diffEmoji(d) {
if (d === ‘مبتدئ’) return ‘🟢’;
if (d === ‘متوسط’) return ‘🟡’;
return ‘🔴’;
}

// ═══════════════════════════════════════
//              COMMANDS
// ═══════════════════════════════════════

client.on(‘messageCreate’, async (msg) => {
if (msg.author.bot) return;

// Trivia answer check
if (!msg.content.startsWith(’!’)) {
const t = activeTrivia.get(msg.channel.id);
if (t && msg.content.toLowerCase().includes(t.a)) {
activeTrivia.delete(msg.channel.id);
const secs = ((Date.now() - t.start) / 1000).toFixed(1);
const pts = Math.max(5, 20 - Math.floor(secs / 2));
const total = addPts(msg.author.id, msg.author.username, pts);
return msg.reply({ embeds: [new EmbedBuilder()
.setColor(0x00FF88)
.setTitle(‘✅ إجابة صحيحة!’)
.setDescription(’> **’ + msg.author.username + ’** أجاب صح!’)
.addFields(
{ name: ‘⏱️ الوقت’, value: ‘`' + secs + 's`’, inline: true },
{ name: ‘🏆 النقاط المكسوبة’, value: ‘`+' + pts + '`’, inline: true },
{ name: ‘💰 مجموع نقاطك’, value: ‘`' + total + '`’, inline: true }
)
.setFooter({ text: ‘The Entity is pleased… 👁️’ })
]});
}
return;
}

const args = msg.content.slice(1).trim().split(/ +/);
const cmd = args[0].toLowerCase();

// ── !help ──────────────────────────────────────────────
if (cmd === ‘help’) {
return msg.reply({ embeds: [new EmbedBuilder()
.setColor(0xB22222)
.setTitle(‘⚰️  __ Dead by Daylight Bot __  ⚰️’)
.setDescription(’*The Entity has granted you access to these commands…*’)
.addFields(
{
name: ‘━━━━━━━━━━━━━━━━━━━━━━━━\n🎮  الألعاب’,
value: ‘> `!trivia` ← أسئلة عن DBD\n> `!chase` ← محاكاة مطاردة\n> `!leaderboard` ← لوحة المتصدرين’
},
{
name: ‘━━━━━━━━━━━━━━━━━━━━━━━━\n🎲  عشوائي’,
value: ‘> `!killer` ← كيلر عشوائي\n> `!perk` ← بيرك عشوائي\n> `!build` ← بيلد سرفايفر\n> `!build killer` ← بيلد كيلر’
},
{
name: ‘━━━━━━━━━━━━━━━━━━━━━━━━\n📋  قوائم كاملة’,
value: ‘> `!killers` ← قائمة الكيلرز\n> `!perks` ← قائمة البيركات’
},
)
.setFooter({ text: ‘The fog never forgives… 🌫️’ })
]});
}

// ── !killer ────────────────────────────────────────────
if (cmd === ‘killer’) {
const k = rand(killers);
return msg.reply({ embeds: [new EmbedBuilder()
.setColor(k.color)
.setTitle(k.emoji + ’  ’ + k.name)
.setDescription(’*’ + k.eng + ’*’)
.addFields(
{ name: ‘⚡ القوة الخاصة’, value: ‘> ’ + k.power, inline: true },
{ name: diffEmoji(k.difficulty) + ’ مستوى الصعوبة’, value: ’> ’ + k.difficulty, inline: true }
)
.setFooter({ text: ‘The Entity has chosen your killer…’ })
]});
}

// ── !killers ───────────────────────────────────────────
if (cmd === ‘killers’) {
const beginner = killers.filter(k => k.difficulty === ‘مبتدئ’);
const intermediate = killers.filter(k => k.difficulty === ‘متوسط’);
const expert = killers.filter(k => k.difficulty === ‘خبير’);
return msg.reply({ embeds: [new EmbedBuilder()
.setColor(0xB22222)
.setTitle(‘🔪  قائمة الكيلرز’)
.addFields(
{
name: ‘━━━━━━━━━━━━━━━━━━━━━━━━\n🟢  مبتدئ’,
value: beginner.map(k => ‘> ’ + k.emoji + ’ **’ + k.name + ’** — ’ + k.power).join(’\n’)
},
{
name: ‘━━━━━━━━━━━━━━━━━━━━━━━━\n🟡  متوسط’,
value: intermediate.map(k => ‘> ’ + k.emoji + ’ **’ + k.name + ’** — ’ + k.power).join(’\n’)
},
{
name: ‘━━━━━━━━━━━━━━━━━━━━━━━━\n🔴  خبير’,
value: expert.map(k => ‘> ’ + k.emoji + ’ **’ + k.name + ’** — ’ + k.power).join(’\n’)
},
)
.setFooter({ text: ‘استخدم !killer لكيلر عشوائي’ })
]});
}

// ── !perk ──────────────────────────────────────────────
if (cmd === ‘perk’) {
const p = rand(perks);
return msg.reply({ embeds: [new EmbedBuilder()
.setColor(p.type === ‘killer’ ? 0xB22222 : 0xFF8C00)
.setTitle(p.emoji + ’  ’ + p.name)
.setDescription(’*’ + p.eng + ’*’)
.addFields(
{ name: ‘📋 الوصف’, value: ’> ’ + p.desc },
{ name: ‘👤 النوع’, value: ’> ’ + (p.type === ‘killer’ ? ‘🔪 كيلر’ : ‘🏃 سرفايفر’), inline: true }
)
.setFooter({ text: ‘استخدم !perks لقائمة كاملة’ })
]});
}

// ── !perks ─────────────────────────────────────────────
if (cmd === ‘perks’) {
const sPerks = perks.filter(p => p.type === ‘survivor’);
const kPerks = perks.filter(p => p.type === ‘killer’);
return msg.reply({ embeds: [new EmbedBuilder()
.setColor(0xFF8C00)
.setTitle(‘✨  قائمة البيركات’)
.addFields(
{
name: ‘━━━━━━━━━━━━━━━━━━━━━━━━\n🏃  بيركات السرفايفر’,
value: sPerks.map(p => ‘> ’ + p.emoji + ’ **’ + p.name + ’**\n> ’ + p.desc).join(’\n\n’)
},
{
name: ‘━━━━━━━━━━━━━━━━━━━━━━━━\n🔪  بيركات الكيلر’,
value: kPerks.map(p => ‘> ’ + p.emoji + ’ **’ + p.name + ’**\n> ’ + p.desc).join(’\n\n’)
},
)
.setFooter({ text: ‘استخدم !perk لبيرك عشوائي’ })
]});
}

// ── !build ─────────────────────────────────────────────
if (cmd === ‘build’) {
const type = args[1] === ‘killer’ ? ‘killer’ : ‘survivor’;
const pool = […perks.filter(p => p.type === type)];
const picked = [];
while (picked.length < 4 && pool.length > 0) {
picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
}
return msg.reply({ embeds: [new EmbedBuilder()
.setColor(type === ‘killer’ ? 0xB22222 : 0xFF8C00)
.setTitle(‘🎰  بيلد ’ + (type === ‘killer’ ? ‘كيلر’ : ‘سرفايفر’) + ’ عشوائي!’)
.setDescription(picked.map((p, i) => ‘**’ + (i+1) + ’. ’ + p.emoji + ’ ’ + p.name + ’**\n> ’ + p.desc).join(’\n\n’))
.setFooter({ text: ‘!build killer | !build survivor’ })
]});
}

// ── !trivia ────────────────────────────────────────────
if (cmd === ‘trivia’) {
if (activeTrivia.has(msg.channel.id)) return msg.reply(‘⚠️ في سؤال شغال الحين! جاوب عليه أول.’);
const q = rand(trivia);
activeTrivia.set(msg.channel.id, { …q, start: Date.now() });
setTimeout(() => {
if (activeTrivia.has(msg.channel.id)) {
activeTrivia.delete(msg.channel.id);
msg.channel.send({ embeds: [new EmbedBuilder()
.setColor(0x555555)
.setTitle(‘⏱️ انتهى الوقت!’)
.setDescription(’> الجواب الصحيح كان: **’ + q.a + ’**’)
]});
}
}, 30000);
return msg.reply({ embeds: [new EmbedBuilder()
.setColor(0xB22222)
.setTitle(‘🧠  سؤال Dead by Daylight!’)
.setDescription(‘━━━━━━━━━━━━━━━━━━━━━━━━\n**’ + q.q + ‘**\n━━━━━━━━━━━━━━━━━━━━━━━━’)
.addFields({ name: ‘💡 تلميح’, value: ‘> ||’ + q.hint + ‘||’ })
.setFooter({ text: ‘اكتب إجابتك مباشرة! عندك 30 ثانية ⏳’ })
]});
}

// ── !chase ─────────────────────────────────────────────
if (cmd === ‘chase’) {
const s = rand(chase);
activeChase.set(msg.channel.id + msg.author.id, { s, uid: msg.author.id, uname: msg.author.username });
const row = new ActionRowBuilder().addComponents(
s.c.map((c, i) => new ButtonBuilder()
.setCustomId(‘ch_’ + msg.channel.id + ‘*’ + msg.author.id + ’*’ + i)
.setLabel(c.l)
.setStyle(i === 0 ? ButtonStyle.Primary : i === 1 ? ButtonStyle.Secondary : ButtonStyle.Danger)
)
);
return msg.reply({ embeds: [new EmbedBuilder()
.setColor(0xB22222)
.setTitle(‘⚔️  محاكاة المطاردة!’)
.setDescription(‘━━━━━━━━━━━━━━━━━━━━━━━━\n’ + s.s + ‘\n━━━━━━━━━━━━━━━━━━━━━━━━’)
.setFooter({ text: ‘اختر قرارك بحكمة… 👁️’ })
], components: [row] });
}

// ── !leaderboard ───────────────────────────────────────
if (cmd === ‘leaderboard’ || cmd === ‘lb’) {
const sorted = […leaderboard.values()].sort((a, b) => b.pts - a.pts).slice(0, 10);
if (!sorted.length) return msg.reply(‘📭 اللوحة فارغة! العب `!trivia` أو `!chase` لتجمع نقاط.’);
const medals = [‘🥇’, ‘🥈’, ‘🥉’];
return msg.reply({ embeds: [new EmbedBuilder()
.setColor(0xFFD700)
.setTitle(‘🏆  لوحة المتصدرين’)
.setDescription(
‘━━━━━━━━━━━━━━━━━━━━━━━━\n’ +
sorted.map((p, i) => (medals[i] || ‘**’ + (i+1) + ’.**’) + ’  **’ + p.name + ’**\n> 💰 ’ + p.pts + ’ نقطة’).join(’\n\n’) +
‘\n━━━━━━━━━━━━━━━━━━━━━━━━’
)
.setFooter({ text: ‘The Entity rewards the worthy… 👁️’ })
]});
}
});

// ═══════════════════════════════════════
//          BUTTON INTERACTIONS
// ═══════════════════════════════════════

client.on(‘interactionCreate’, async (interaction) => {
if (!interaction.isButton() || !interaction.customId.startsWith(‘ch_’)) return;
const parts = interaction.customId.split(’_’);
const cid = parts[1], uid = parts[2], idx = parseInt(parts[3]);
if (interaction.user.id !== uid) return interaction.reply({ content: ‘❌ هذه المطاردة مو حقتك!’, ephemeral: true });
const game = activeChase.get(cid + uid);
if (!game) return interaction.reply({ content: ‘❌ ما في لعبة نشطة’, ephemeral: true });
activeChase.delete(cid + uid);
const choice = game.s.c[idx];
const total = addPts(uid, game.uname, choice.p);
return interaction.update({ embeds: [new EmbedBuilder()
.setColor(choice.p > 0 ? 0x00FF88 : choice.p < 0 ? 0xB22222 : 0x888888)
.setTitle(choice.p > 0 ? ‘✅  قرار ذكي!’ : choice.p < 0 ? ‘💀  خسرت!’ : ‘😐  نجوت بالكاد…’)
.setDescription(‘━━━━━━━━━━━━━━━━━━━━━━━━\n’ + choice.r + ‘\n━━━━━━━━━━━━━━━━━━━━━━━━’)
.addFields(
{ name: ‘🏆 النقاط’, value: ‘> `' + (choice.p >= 0 ? '+' : '') + choice.p + '`’, inline: true },
{ name: ‘💰 مجموعك’, value: ‘> `' + total + '`’, inline: true }
)
.setFooter({ text: ‘The fog never forgives mistakes…’ })
], components: [] });
});

// ═══════════════════════════════════════
//               READY
// ═══════════════════════════════════════

client.once(‘ready’, () => {
console.log(’DBD Bot Ready! Logged in as ’ + client.user.tag);
client.user.setActivity(‘Dead by Daylight | !help’, { type: 0 });
});

client.login(process.env.DISCORD_TOKEN);
