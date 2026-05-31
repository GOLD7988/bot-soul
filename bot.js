const{Client,GatewayIntentBits,EmbedBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle,Collection}=require("discord.js");
const client=new Client({intents:[GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent,GatewayIntentBits.GuildMembers]});

const killers=[
{name:"ذا ترابر",power:"فخاخ الدببة",difficulty:"مبتدئ",emoji:"🪤"},
{name:"ذا نيرس",power:"البلنك",difficulty:"خبير",emoji:"🩺"},
{name:"ذا هنتريس",power:"الفؤوس",difficulty:"مبتدئ",emoji:"🪓"},
{name:"ذا شيب - مايرز",power:"إيفل ويذن",difficulty:"متوسط",emoji:"🔪"},
{name:"ذا سبيريت",power:"يامائوكا هونتنج",difficulty:"خبير",emoji:"👻"},
{name:"ذا بلايت",power:"بلايتد كوراپشن",difficulty:"خبير",emoji:"🧪"},
{name:"ذا نيميسيس",power:"تي-فيروس",difficulty:"مبتدئ",emoji:"☣️"},
{name:"ذا ماسترمايند",power:"يوروبوروس إنفيكشن",difficulty:"مبتدئ",emoji:"🦠"},
{name:"ذا پيگ",power:"جيكسو بابتيزم",difficulty:"متوسط",emoji:"🐷"},
{name:"ذا غوست فيس",power:"نايت شراود",difficulty:"متوسط",emoji:"👤"},
{name:"ذا كلاون",power:"ذا غاسر",difficulty:"مبتدئ",emoji:"🎪"},
{name:"ذا ليجن",power:"فيرال فرنزي",difficulty:"مبتدئ",emoji:"😷"},
{name:"ذا أوني",power:"يامائوكا رايث",difficulty:"خبير",emoji:"🎭"},
{name:"ذا ديثسلينجر",power:"ريدييمر",difficulty:"متوسط",emoji:"🔫"},
{name:"ذا ترايكستر",power:"شوستوپر",difficulty:"متوسط",emoji:"🎯"},
];

const perks=[
{name:"ديد هارد",type:"survivor",emoji:"💨",desc:"تهرب من ضربة واحدة بالطاقة"},
{name:"ديسيسيف ستريك",type:"survivor",emoji:"🗡️",desc:"بعد الإنقاذ اضرب الكيلر وافلت"},
{name:"سيلف كير",type:"survivor",emoji:"🩹",desc:"اشفي نفسك بدون صندوق إسعاف"},
{name:"أدرينالين",type:"survivor",emoji:"⚡",desc:"لما آخر مولد يشتغل تشتفي وتجري أسرع"},
{name:"أنبريكبل",type:"survivor",emoji:"💪",desc:"قوم من الأرض لوحدك مرة واحدة"},
{name:"بوروود تايم",type:"survivor",emoji:"⏳",desc:"الشخص اللي أنقذته يأخذ حماية إضافية"},
{name:"سپاين شيل",type:"survivor",emoji:"🥶",desc:"تحس لما الكيلر يشوفك مباشرة"},
{name:"سپرنت برست",type:"survivor",emoji:"🏃",desc:"أسرع بشكل مفاجئ عند أول ركضة"},
{name:"نود",type:"killer",emoji:"💀",desc:"بعد آخر مولد ضربة واحدة تعطل السرفايفر"},
{name:"كوراپت انترفينشن",type:"killer",emoji:"🚫",desc:"ثلاث مولدات تتحجب في البداية"},
{name:"باربيكيو آند شيلي",type:"killer",emoji:"🔥",desc:"بعد الخطاف تشوف كل السرفايفرز من بعيد"},
{name:"پوپ غوز ذا ويزل",type:"killer",emoji:"💥",desc:"بعد الخطاف خرب مولد بشدة"},
{name:"هيكس رين",type:"killer",emoji:"🕯️",desc:"المولدات تتراجع لوحدها"},
{name:"ثاناتوفوبيا",type:"killer",emoji:"🩸",desc:"كل سرفايفر مجروح يبطئ المولدات"},
];

const trivia=[
{q:"كم عدد المولدات للخروج؟",a:"5",hint:"رقم بين 1 و 7"},
{q:"ما هي قوة ذا ترابر؟",a:"bear trap",hint:"شي يلتقط القدم"},
{q:"كم ضربة قبل ما تقع؟",a:"2",hint:"ضربة + ضربة"},
{q:"اسم العملة في DBD؟",a:"bloodpoints",hint:"نقاط + دم"},
{q:"كم سرفايفر في كل مباراة؟",a:"4",hint:"أقل من 5 وأكثر من 3"},
{q:"قوة ذا نيرس؟",a:"blink",hint:"تقفز من خلال الجدران"},
{q:"الكيلر من Resident Evil؟",a:"nemesis",hint:"تي-فيروس"},
{q:"ما هو البيرك اللي يخليك تقوم لوحدك؟",a:"unbreakable",hint:"أنبريكبل"},
{q:"كم مولد يتحجب مع كوراپت انترفينشن؟",a:"3",hint:"ثلاث"},
];

const chaseScenarios=[
{s:"🌫️ **سمعت موسيقى الكيلر وهو قريب منك!**\nوش تسوي؟",c:[{l:"🏃 اركض للـ Loop",r:"ذكي! كسبت وقت ثمين وأربكت الكيلر",p:10},{l:"🙈 اختبأ تحت المولد",r:"خطأ! وجدك فوراً بسبب السكراتش ماركس",p:-5},{l:"💨 اركض عشوائي",r:"محظوظ هذه المرة... لكن ما راح تنجح دايم",p:0}]},
{s:"⛽ **تصلح مولد ورأيت الكيلر يقترب!**\nوش تسوي؟",c:[{l:"⚡ أكمل بسرعة",r:"أنجزت المولد قبل وصوله وهربت!",p:15},{l:"🚶 اترك واختبأ",r:"نجوت لكن المولد تأخر كثير",p:5},{l:"😤 خاطر وابقى",r:"ضربة! كانت مخاطرة غير محسوبة",p:-10}]},
{s:"🪝 **رفيقك على الخطاف والكيلر واقف بجانبه!**\nوش تسوي؟",c:[{l:"🤝 أنقذه فوراً",r:"أنقذته لكن خذيت ضربة قوية",p:-5},{l:"⏳ انتظر الكيلر يمشي",r:"صبرت وأنقذته بأمان! قرار حكيم",p:20},{l:"🔧 اصلح مولد بعيد",r:"مولد اشتغل لكن رفيقك مات على الخطاف",p:5}]},
];

const lb=new Collection(),at=new Collection(),ac=new Collection();
function rand(a){return a[Math.floor(Math.random()*a.length)]}
function addPts(id,name,pts){const c=lb.get(id)||{name,pts:0};c.pts+=pts;c.name=name;lb.set(id,c);return c.pts}

// ─── MAIN MENU ───────────────────────────────────────────────────────────────
function mainMenuEmbed(){
  return new EmbedBuilder()
    .setColor(0x1a6bff)
    .setTitle("🩸  SOUL DBD — القائمة الرئيسية")
    .setDescription(
      "```\n" +
      "  ░██████╗░█████╗░██╗░░░██╗██╗░░░░░\n" +
      "  ██╔════╝██╔══██╗██║░░░██║██║░░░░░\n" +
      "  ╚█████╗░██║░░██║██║░░░██║██║░░░░░\n" +
      "  ░╚═══██╗██║░░██║██║░░░██║██║░░░░░\n" +
      "  ██████╔╝╚█████╔╝╚██████╔╝███████╗\n" +
      "```\n" +
      "> 🌫️ *The Entity is watching...*"
    )
    .addFields(
      {name:"🎮 الألعاب",value:"اضغط على الزر اللي تبيه 👇",inline:false}
    )
    .setFooter({text:"SOUL Dead by Daylight Server 🔪"});
}

function mainMenuRow(){
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("menu_trivia").setLabel("🧠 تريفيا").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("menu_chase").setLabel("⚔️ مطاردة").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("menu_killers").setLabel("🔪 الكيلرز").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("menu_perks").setLabel("✨ البيركات").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("menu_lb").setLabel("🏆 المتصدرين").setStyle(ButtonStyle.Success),
  );
}

function buildRow(){
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("build_survivor").setLabel("🏃 بيلد سرفايفر").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("build_killer").setLabel("🔪 بيلد كيلر").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("menu_back").setLabel("🏠 رجوع").setStyle(ButtonStyle.Secondary),
  );
}

// ─── COMMANDS ────────────────────────────────────────────────────────────────
client.on("messageCreate",async msg=>{
  if(msg.author.bot)return;

  // trivia answer
  if(!msg.content.startsWith("!")){
    const t=at.get(msg.channel.id);
    if(t&&msg.content.toLowerCase().includes(t.a)){
      at.delete(msg.channel.id);
      const secs=((Date.now()-t.start)/1000).toFixed(1),pts=Math.max(5,20-Math.floor(secs/2)),total=addPts(msg.author.id,msg.author.username,pts);
      return msg.reply({embeds:[new EmbedBuilder().setColor(0x00FF88).setTitle("✅ إجابة صحيحة!").setDescription("> **"+msg.author.username+"** أجاب صح! 🎉").addFields({name:"⏱️ الوقت",value:"`"+secs+"s`",inline:true},{name:"🏆 نقاط",value:"`+"+pts+"`",inline:true},{name:"💰 مجموع",value:"`"+total+"`",inline:true}).setFooter({text:"The Entity is pleased... 👁️"})]});
    }
    return;
  }

  const cmd=msg.content.slice(1).trim().split(/ +/)[0].toLowerCase();

  if(cmd==="menu"||cmd==="play"||cmd==="soul"){
    return msg.reply({embeds:[mainMenuEmbed()],components:[mainMenuRow()]});
  }

  if(cmd==="help"){
    return msg.reply({embeds:[new EmbedBuilder().setColor(0x1a6bff)
      .setTitle("🩸 SOUL DBD Bot — الأوامر")
      .setDescription("> اكتب `!menu` لتفتح القائمة الرئيسية بالأزرار!\n> أو استخدم الأوامر المباشرة:")
      .addFields(
        {name:"🎮 ألعاب بالأزرار",value:"> `!menu` ← القائمة الكاملة"},
        {name:"⌨️ أوامر مباشرة",value:"> `!trivia` `!chase` `!killer` `!perk` `!build` `!killers` `!perks` `!lb`"},
      ).setFooter({text:"SOUL DBD 🔪 | The fog never forgives"})
    ]});
  }

  if(cmd==="killer"){
    const k=rand(killers);
    return msg.reply({embeds:[new EmbedBuilder().setColor(0xB22222).setTitle(k.emoji+"  "+k.name).addFields({name:"⚡ القوة",value:"> "+k.power,inline:true},{name:"🎯 الصعوبة",value:"> "+k.difficulty,inline:true}).setFooter({text:"استخدم !killers لقائمة كاملة"})]});
  }

  if(cmd==="killers"){
    const b=killers.filter(k=>k.difficulty==="مبتدئ"),m=killers.filter(k=>k.difficulty==="متوسط"),e=killers.filter(k=>k.difficulty==="خبير");
    return msg.reply({embeds:[new EmbedBuilder().setColor(0xB22222).setTitle("🔪  قائمة الكيلرز — SOUL DBD")
      .addFields(
        {name:"🟢  مبتدئ",value:b.map(k=>"> "+k.emoji+" **"+k.name+"**  •  "+k.power).join("\n")},
        {name:"🟡  متوسط",value:m.map(k=>"> "+k.emoji+" **"+k.name+"**  •  "+k.power).join("\n")},
        {name:"🔴  خبير",value:e.map(k=>"> "+k.emoji+" **"+k.name+"**  •  "+k.power).join("\n")},
      ).setFooter({text:"!killer لكيلر عشوائي 🎲"})
    ]});
  }

  if(cmd==="perk"){
    const p=rand(perks);
    return msg.reply({embeds:[new EmbedBuilder().setColor(p.type==="killer"?0xB22222:0xFF8C00).setTitle(p.emoji+"  "+p.name).addFields({name:"📋 الوصف",value:"> "+p.desc},{name:"👤 النوع",value:"> "+(p.type==="killer"?"🔪 كيلر":"🏃 سرفايفر"),inline:true}).setFooter({text:"!perks لقائمة كاملة"})]});
  }

  if(cmd==="perks"){
    const s=perks.filter(p=>p.type==="survivor"),k=perks.filter(p=>p.type==="killer");
    return msg.reply({embeds:[new EmbedBuilder().setColor(0xFF8C00).setTitle("✨  قائمة البيركات — SOUL DBD")
      .addFields(
        {name:"🏃  بيركات السرفايفر",value:s.map(p=>"> "+p.emoji+" **"+p.name+"**\n> "+p.desc).join("\n\n")},
        {name:"🔪  بيركات الكيلر",value:k.map(p=>"> "+p.emoji+" **"+p.name+"**\n> "+p.desc).join("\n\n")},
      ).setFooter({text:"!perk لبيرك عشوائي 🎲"})
    ]});
  }

  if(cmd==="build"){
    const type=msg.content.includes("killer")?"killer":"survivor";
    const pool=[...perks.filter(p=>p.type===type)],picked=[];
    while(picked.length<4&&pool.length>0)picked.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
    return msg.reply({embeds:[new EmbedBuilder().setColor(type==="killer"?0xB22222:0xFF8C00)
      .setTitle("🎰  بيلد "+(type==="killer"?"كيلر 🔪":"سرفايفر 🏃")+" عشوائي!")
      .setDescription(picked.map((p,i)=>"**"+["1️⃣","2️⃣","3️⃣","4️⃣"][i]+"  "+p.emoji+" "+p.name+"**\n> "+p.desc).join("\n\n"))
      .setFooter({text:"SOUL DBD 🔪"})
    ]});
  }

  if(cmd==="trivia"){
    if(at.has(msg.channel.id))return msg.reply("⚠️ في سؤال شغال الحين! جاوب عليه أول.");
    const q=rand(trivia);
    at.set(msg.channel.id,{...q,start:Date.now()});
    setTimeout(()=>{if(at.has(msg.channel.id)){at.delete(msg.channel.id);msg.channel.send({embeds:[new EmbedBuilder().setColor(0x555555).setTitle("⏱️ انتهى الوقت!").setDescription("> الجواب كان: **"+q.a+"**")]})}},30000);
    return msg.reply({embeds:[new EmbedBuilder().setColor(0xB22222)
      .setTitle("🧠  سؤال Dead by Daylight!")
      .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━\n**"+q.q+"**\n━━━━━━━━━━━━━━━━━━━━━━━━")
      .addFields({name:"💡 تلميح",value:"> ||"+q.hint+"||"})
      .setFooter({text:"اكتب إجابتك مباشرة! عندك 30 ثانية ⏳"})
    ]});
  }

  if(cmd==="chase"){
    const s=rand(chaseScenarios);
    ac.set(msg.channel.id+msg.author.id,{s,uid:msg.author.id,uname:msg.author.username});
    const row=new ActionRowBuilder().addComponents(s.c.map((c,i)=>new ButtonBuilder().setCustomId("ch_"+msg.channel.id+"_"+msg.author.id+"_"+i).setLabel(c.l).setStyle(i===0?ButtonStyle.Primary:i===1?ButtonStyle.Secondary:ButtonStyle.Danger)));
    return msg.reply({embeds:[new EmbedBuilder().setColor(0xB22222).setTitle("⚔️  محاكاة المطاردة!").setDescription(s.s).setFooter({text:"اختر قرارك بحكمة 👁️"})],components:[row]});
  }

  if(cmd==="lb"||cmd==="leaderboard"){
    const sorted=[...lb.values()].sort((a,b)=>b.pts-a.pts).slice(0,10);
    if(!sorted.length)return msg.reply("📭 اللوحة فارغة! العب `!trivia` أو `!chase`");
    const medals=["🥇","🥈","🥉"];
    return msg.reply({embeds:[new EmbedBuilder().setColor(0xFFD700)
      .setTitle("🏆  لوحة المتصدرين — SOUL DBD")
      .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━\n"+sorted.map((p,i)=>(medals[i]||"**"+(i+1)+".**")+"  **"+p.name+"**\n> 💰 "+p.pts+" نقطة").join("\n\n")+"\n━━━━━━━━━━━━━━━━━━━━━━━━")
      .setFooter({text:"The Entity rewards the worthy 👁️"})
    ]});
  }
});

// ─── BUTTON INTERACTIONS ──────────────────────────────────────────────────────
client.on("interactionCreate",async interaction=>{
  if(!interaction.isButton())return;
  const id=interaction.customId;

  // Main menu buttons
  if(id==="menu_trivia"){
    if(at.has(interaction.channel.id)){return interaction.reply({content:"⚠️ في سؤال شغال الحين!",ephemeral:true})}
    const q=rand(trivia);
    at.set(interaction.channel.id,{...q,start:Date.now()});
    setTimeout(()=>{if(at.has(interaction.channel.id)){at.delete(interaction.channel.id);interaction.channel.send({embeds:[new EmbedBuilder().setColor(0x555555).setTitle("⏱️ انتهى الوقت!").setDescription("> الجواب كان: **"+q.a+"**")]})}},30000);
    await interaction.reply({embeds:[new EmbedBuilder().setColor(0xB22222).setTitle("🧠  سؤال Dead by Daylight!").setDescription("━━━━━━━━━━━━━━━━━━━━━━━━\n**"+q.q+"**\n━━━━━━━━━━━━━━━━━━━━━━━━").addFields({name:"💡 تلميح",value:"> ||"+q.hint+"||"}).setFooter({text:"اكتب إجابتك مباشرة! عندك 30 ثانية ⏳"})]});
    return;
  }

  if(id==="menu_chase"){
    const s=rand(chaseScenarios);
    ac.set(interaction.channel.id+interaction.user.id,{s,uid:interaction.user.id,uname:interaction.user.username});
    const row=new ActionRowBuilder().addComponents(s.c.map((c,i)=>new ButtonBuilder().setCustomId("ch_"+interaction.channel.id+"_"+interaction.user.id+"_"+i).setLabel(c.l).setStyle(i===0?ButtonStyle.Primary:i===1?ButtonStyle.Secondary:ButtonStyle.Danger)));
    await interaction.reply({embeds:[new EmbedBuilder().setColor(0xB22222).setTitle("⚔️  محاكاة المطاردة!").setDescription(s.s).setFooter({text:"اختر قرارك بحكمة 👁️"})],components:[row]});
    return;
  }

  if(id==="menu_killers"){
    const b=killers.filter(k=>k.difficulty==="مبتدئ"),m=killers.filter(k=>k.difficulty==="متوسط"),e=killers.filter(k=>k.difficulty==="خبير");
    await interaction.reply({embeds:[new EmbedBuilder().setColor(0xB22222).setTitle("🔪  قائمة الكيلرز — SOUL DBD").addFields({name:"🟢  مبتدئ",value:b.map(k=>"> "+k.emoji+" **"+k.name+"**  •  "+k.power).join("\n")},{name:"🟡  متوسط",value:m.map(k=>"> "+k.emoji+" **"+k.name+"**  •  "+k.power).join("\n")},{name:"🔴  خبير",value:e.map(k=>"> "+k.emoji+" **"+k.name+"**  •  "+k.power).join("\n")}).setFooter({text:"!killer لكيلر عشوائي 🎲"})],ephemeral:true});
    return;
  }

  if(id==="menu_perks"){
    const s=perks.filter(p=>p.type==="survivor"),k=perks.filter(p=>p.type==="killer");
    await interaction.reply({embeds:[new EmbedBuilder().setColor(0xFF8C00).setTitle("✨  قائمة البيركات — SOUL DBD").addFields({name:"🏃  بيركات السرفايفر",value:s.map(p=>"> "+p.emoji+" **"+p.name+"**  •  "+p.desc).join("\n")},{name:"🔪  بيركات الكيلر",value:k.map(p=>"> "+p.emoji+" **"+p.name+"**  •  "+p.desc).join("\n")})],ephemeral:true});
    return;
  }

  if(id==="menu_lb"){
    const sorted=[...lb.values()].sort((a,b)=>b.pts-a.pts).slice(0,10);
    const medals=["🥇","🥈","🥉"];
    await interaction.reply({embeds:[new EmbedBuilder().setColor(0xFFD700).setTitle("🏆  لوحة المتصدرين — SOUL DBD").setDescription(sorted.length?sorted.map((p,i)=>(medals[i]||"**"+(i+1)+".**")+"  **"+p.name+"** — "+p.pts+" نقطة").join("\n"):"📭 اللوحة فارغة! العب أولاً")],ephemeral:true});
    return;
  }

  if(id==="build_survivor"||id==="build_killer"){
    const type=id==="build_killer"?"killer":"survivor";
    const pool=[...perks.filter(p=>p.type===type)],picked=[];
    while(picked.length<4&&pool.length>0)picked.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
    await interaction.reply({embeds:[new EmbedBuilder().setColor(type==="killer"?0xB22222:0xFF8C00).setTitle("🎰  بيلد "+(type==="killer"?"كيلر 🔪":"سرفايفر 🏃")+" عشوائي!").setDescription(picked.map((p,i)=>"**"+["1️⃣","2️⃣","3️⃣","4️⃣"][i]+"  "+p.emoji+" "+p.name+"**\n> "+p.desc).join("\n\n"))],ephemeral:true});
    return;
  }

  if(id==="menu_back"){
    await interaction.update({embeds:[mainMenuEmbed()],components:[mainMenuRow()]});
    return;
  }

  // Chase buttons
  if(id.startsWith("ch_")){
    const parts=id.split("_"),cid=parts[1],uid=parts[2],idx=parseInt(parts[3]);
    if(interaction.user.id!==uid)return interaction.reply({content:"❌ هذه المطاردة مو حقتك!",ephemeral:true});
    const game=ac.get(cid+uid);
    if(!game)return interaction.reply({content:"❌ ما في لعبة نشطة",ephemeral:true});
    ac.delete(cid+uid);
    const choice=game.s.c[idx],total=addPts(uid,game.uname,choice.p);
    const backRow=new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("menu_chase").setLabel("🔄 العب مرة ثانية").setStyle(ButtonStyle.Primary));
    return interaction.update({embeds:[new EmbedBuilder().setColor(choice.p>0?0x00FF88:choice.p<0?0xB22222:0x888888).setTitle(choice.p>0?"✅  قرار ذكي!":choice.p<0?"💀  خسرت!":"😐  نجوت بالكاد...").setDescription("━━━━━━━━━━━━━━━━━━━━━━━━\n"+choice.r+"\n━━━━━━━━━━━━━━━━━━━━━━━━").addFields({name:"🏆 النقاط",value:"> `"+(choice.p>=0?"+":"")+choice.p+"`",inline:true},{name:"💰 مجموعك",value:"> `"+total+"`",inline:true}).setFooter({text:"SOUL DBD 🔪"})],components:[backRow]});
  }
});

client.once("ready",()=>{
  console.log("DBD Bot Ready! "+client.user.tag);
  client.user.setActivity("Dead by Daylight | !menu",{type:0});
});

client.login(process.env.DISCORD_TOKEN);
