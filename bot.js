const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

const killers = [
  { name: 'The Trapper', emoji: '🪤', power: 'Bear Traps', difficulty: 'Beginner' },
  { name: 'The Nurse', emoji: '🩺', power: 'Blink', difficulty: 'Expert' },
  { name: 'The Huntress', emoji: '🪓', power: 'Hunting Hatchets', difficulty: 'Beginner' },
  { name: 'The Shape (Myers)', emoji: '🔪', power: 'Evil Within', difficulty: 'Intermediate' },
  { name: 'The Spirit', emoji: '👻', power: 'Yamaoka Haunting', difficulty: 'Expert' },
  { name: 'The Blight', emoji: '🧪', power: 'Blighted Corruption', difficulty: 'Expert' },
  { name: 'The Nemesis', emoji: '☣️', power: 'T-Virus', difficulty: 'Beginner' },
  { name: 'The Mastermind (Wesker)', emoji: '🦠', power: 'Uroboros Infection', difficulty: 'Beginner' },
  { name: 'The Pig', emoji: '🐷', power: 'Jigsaw Baptism', difficulty: 'Intermediate' },
  { name: 'The Ghost Face', emoji: '👤', power: 'Night Shroud', difficulty: 'Intermediate' },
];

const perks = [
  { name: 'Dead Hard', type: 'survivor', desc: 'تهرب من ضربة واحدة بالطاقة' },
  { name: 'Decisive Strike', type: 'survivor', desc: 'بعد الانقاذ اضرب الكيلر وافلت' },
  { name: 'Self Care', type: 'survivor', desc: 'اشفي نفسك بدون صندوق اسعاف' },
  { name: 'Adrenaline', type: 'survivor', desc: 'لما آخر مولد يشتغل تشتفي وتجري اسرع' },
  { name: 'Unbreakable', type: 'survivor', desc: 'قوم من الارض لوحدك مرة وحدة' },
  { name: 'NOED', type: 'killer', desc: 'بعد آخر مولد ضربة واحدة تعطل السرفايفر' },
  { name: 'Corrupt Intervention', type: 'killer', desc: 'ثلاث مولدات تتحجب في البداية' },
  { name: 'Barbecue and Chili', type: 'killer', desc: 'بعد الخطاف تشوف كل السرفايفرز' },
  { name: 'Pop Goes the Weasel', type: 'killer', desc: 'بعد الخطاف خرب مولد بشدة' },
  { name: 'Hex Ruin', type: 'killer', desc: 'المولدات تتراجع لوحدها' },
];

const trivia = [
  { q: 'كم عدد المولدات اللي تحتاج تصلحها للخروج؟', a: '5', hint: 'رقم بين 1 و 7' },
  { q: 'ما هي قوة The Trapper؟', a: 'bear trap', hint: 'شي يلتقط القدم' },
  { q: 'كم ضربة تحتاج قبل ما تقع على الارض؟', a: '2', hint: 'ضربة + ضربة' },
  { q: 'ما اسم العملة في Dead by Daylight؟', a: 'bloodpoints', hint: 'نقاط + دم' },
  { q: 'ما هو البيرك اللي يخليك تشوف الكيلر بعد الخطاف؟', a: 'barbecue', hint: 'Barbecue and ...' },
  { q: 'كم عدد السرفايفرز في كل مباراة؟', a: '4', hint: 'اقل من 5 واكثر من 3' },
  { q: 'ما هي قوة The Nurse؟', a: 'blink', hint: 'تقفز من خلال الجدران' },
  { q: 'من هو الكيلر من Resident Evil؟', a: 'nemesis', hint: 'T-Virus' },
];

const chase = [
  {
    s: '🌫️ سمعت موسيقى الكيلر وهو قريب منك!',
    c: [
      { l: '🏃 اركض للـ Loop', r: 'ذكي! كسبت وقت ثمين', p: 10 },
      { l: '🙈 اختبأ تحت المولد', r: 'خطأ! وجدك فوراً', p: -5 },
      { l: '💨 اركض عشوائي', r: 'محظوظ هذه المرة...', p: 0 },
    ]
  },
  {
    s: '⛽ تصلح مولد ورأيت الكيلر يقترب!',
    c: [
      { l: '⚡ اكمل المولد بسرعة', r: 'انجزت المولد وهربت!', p: 15 },
      { l: '🚶 اترك المولد واختبأ', r: 'نجوت لكن المولد تأخر', p: 5 },
      { l: '😤 ابقى وخاطر', r: 'ضربة! خسرت', p: -10 },
    ]
  },
  {
    s: '🪝 رفيقك على الخطاف والكيلر بجانبه!',
    c: [
      { l: '🤝 انقذه فوراً', r: 'انقذته لكن خذيت ضربة', p: -5 },
      { l: '⏳ انتظر الكيلر يمشي', r: 'صبور! انقذته بأمان', p: 20 },
      { l: '🔧 اصلح مولد بعيد', r: 'مولد اشتغل لكن رفيقك مات', p: 5 },
    ]
  },
];

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

client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;

  if (!msg.content.startsWith('!')) {
    const t = activeTrivia.get(msg.channel.id);
    if (t && msg.content.toLowerCase().includes(t.a)) {
      activeTrivia.delete(msg.channel.id);
      const secs = ((Date.now() - t.start) / 1000).toFixed(1);
      const pts = Math.max(5, 20 - Math.floor(secs / 2));
      const total = addPts(msg.author.id, msg.author.username, pts);
      return msg.reply({ embeds: [new EmbedBuilder().setColor(0x00ff88).setTitle('✅ صح!').addFields(
        { name: '⏱️ الوقت', value: secs + 's', inline: true },
        { name: '🏆 نقاط', value: '+' + pts, inline: true },
        { name: '💰 المجموع', value: '' + total, inline: true }
      )] });
    }
    return;
  }

  const args = msg.content.slice(1).trim().split(/ +/);
  const cmd = args[0].toLowerCase();

  if (cmd === 'help') {
    return msg.reply({ embeds: [new EmbedBuilder().setColor(0xB22222)
      .setTitle('⚰️ Dead by Daylight Bot')
      .addFields(
        { name: '🎮 ألعاب', value: '`!trivia` `!chase` `!leaderboard`', inline: true },
        { name: '🎲 عشوائي', value: '`!killer` `!perk` `!build`', inline: true },
      ).setFooter({ text: 'The Entity watches... 👁️' })] });
  }

  if (cmd === 'killer') {
    const k = rand(killers);
    return msg.reply({ embeds: [new EmbedBuilder().setColor(0xB22222)
      .setTitle(k.emoji + ' ' + k.name)
      .addFields(
        { name: '⚡ القوة', value: k.power, inline: true },
        { name: '🎯 الصعوبة', value: k.difficulty, inline: true }
      )] });
  }

  if (cmd === 'perk') {
    const p = rand(perks);
    return msg.reply({ embeds: [new EmbedBuilder().setColor(p.type === 'killer' ? 0xB22222 : 0xFF6600)
      .setTitle('✨ ' + p.name)
      .addFields(
        { name: '📋 الوصف', value: p.desc },
        { name: '👤 النوع', value: p.type === 'killer' ? '🔪 Killer' : '🏃 Survivor', inline: true }
      )] });
  }

  if (cmd === 'build') {
    const type = args[1] === 'killer' ? 'killer' : 'survivor';
    const pool = perks.filter(p => p.type === type);
    const picked = [];
    while (picked.length < 4 && pool.length > 0) picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    return msg.reply({ embeds: [new EmbedBuilder().setColor(type === 'killer' ? 0xB22222 : 0xFF6600)
      .setTitle('🎰 ' + (type === 'killer' ? 'Killer' : 'Survivor') + ' Build!')
      .setDescription(picked.map((p, i) => '**' + (i+1) + '. ' + p.name + '**\n' + p.desc).join('\n\n'))] });
  }

  if (cmd === 'trivia') {
    if (activeTrivia.has(msg.channel.id)) return msg.reply('⚠️ في سؤال شغال الحين!');
    const q = rand(trivia);
    activeTrivia.set(msg.channel.id, { ...q, start: Date.now() });
    setTimeout(() => {
      if (activeTrivia.has(msg.channel.id)) {
        activeTrivia.delete(msg.channel.id);
        msg.channel.send({ embeds: [new EmbedBuilder().setColor(0x555555).setTitle('⏱️ انتهى الوقت!').setDescription('الجواب: **' + q.a + '**')] });
      }
    }, 30000);
    return msg.reply({ embeds: [new EmbedBuilder().setColor(0xB22222)
      .setTitle('🧠 DBD Trivia!')
      .setDescription('**' + q.q + '**')
      .addFields({ name: '💡 تلميح', value: '||' + q.hint + '||' })
      .setFooter({ text: 'عندك 30 ثانية!' })] });
  }

  if (cmd === 'chase') {
    const s = rand(chase);
    activeChase.set(msg.channel.id + msg.author.id, { s, uid: msg.author.id, uname: msg.author.username });
    const row = new ActionRowBuilder().addComponents(
      s.c.map((c, i) => new ButtonBuilder().setCustomId('ch_' + msg.channel.id + '_' + msg.author.id + '_' + i)
        .setLabel(c.l).setStyle(i === 0 ? ButtonStyle.Primary : i === 1 ? ButtonStyle.Secondary : ButtonStyle.Danger))
    );
    return msg.reply({ embeds: [new EmbedBuilder().setColor(0xB22222).setTitle('⚔️ Chase Simulator!').setDescription(s.s)], components: [row] });
  }

  if (cmd === 'leaderboard' || cmd === 'lb') {
    const sorted = [...leaderboard.values()].sort((a, b) => b.pts - a.pts).slice(0, 10);
    if (!sorted.length) return msg.reply('📭 اللوحة فارغة! العب `!trivia` او `!chase`');
    const medals = ['🥇', '🥈', '🥉'];
    return msg.reply({ embeds: [new EmbedBuilder().setColor(0xB22222)
      .setTitle('🏆 لوحة المتصدرين')
      .setDescription(sorted.map((p, i) => (medals[i] || '**' + (i+1) + '.**') + ' **' + p.name + '** — ' + p.pts + ' نقطة').join('\n'))] });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton() || !interaction.customId.startsWith('ch_')) return;
  const parts = interaction.customId.split('_');
  const cid = parts[1], uid = parts[2], idx = parseInt(parts[3]);
  if (interaction.user.id !== uid) return interaction.reply({ content: '❌ هذه مو حقتك!', ephemeral: true });
  const game = activeChase.get(cid + uid);
  if (!game) return interaction.reply({ content: '❌ ما في لعبة نشطة', ephemeral: true });
  activeChase.delete(cid + uid);
  const choice = game.s.c[idx];
  const total = addPts(uid, game.uname, choice.p);
  return interaction.update({ embeds: [new EmbedBuilder()
    .setColor(choice.p > 0 ? 0x00ff88 : choice.p < 0 ? 0xB22222 : 0x555555)
    .setTitle(choice.p > 0 ? '✅ ذكي!' : choice.p < 0 ? '💀 خسرت!' : '😐 نجوت بالكاد...')
    .setDescription(choice.r)
    .addFields(
      { name: '🏆 النقاط', value: (choice.p >= 0 ? '+' : '') + choice.p, inline: true },
      { name: '💰 المجموع', value: '' + total, inline: true }
    )], components: [] });
});

client.once('ready', () => {
  console.log('DBD Bot Ready! Logged in as ' + client.user.tag);
  client.user.setActivity('Dead by Daylight | !help', { type: 0 });
});

client.login(process.env.DISCORD_TOKEN);
