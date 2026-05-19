// ═══════════════════════════════════════════════════════
// THE LOST MC — LOS SANTOS CHAPTER — DISCORD BOT
// ═══════════════════════════════════════════════════════
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('The Lost MC Discord Bot is online 24/7!');
});

app.listen(port, () => {
  console.log(`Web server active on port ${port}`);
});

const {
  Client, GatewayIntentBits, Partials, Collection,
  REST, Routes, EmbedBuilder, ActionRowBuilder,
  ButtonBuilder, ButtonStyle, ModalBuilder,
  TextInputBuilder, TextInputStyle, ChannelType,
  PermissionFlagsBits, ActivityType
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.GuildMember, Partials.Channel]
});

// ═══════════════════════════════════════════════════════
// SLASH KOMUTLARI TANIMLAMA
// ═══════════════════════════════════════════════════════
const commands = require('./commands');

// ═══════════════════════════════════════════════════════
// BOT HAZIR OLDUĞUNDA
// ═══════════════════════════════════════════════════════
client.once('ready', async () => {
  console.log(`\n⚡ ${client.user.tag} aktif!`);
  client.user.setActivity('The Lost MC', { type: ActivityType.Watching });

  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
  try {
    // Tüm guildleri fetch et
    const guilds = await client.guilds.fetch();
    const guildId = guilds.first()?.id;
    if (!guildId) {
      console.log('❌ Bot hiçbir sunucuda değil!');
      return;
    }

    const guild = await client.guilds.fetch(guildId);

    // Log kanallarını kontrol et ve oluştur
    await guild.channels.fetch();

    let logChannel = guild.channels.cache.find(c => c.name === 'lost-logs' && c.type === ChannelType.GuildText);
    if (!logChannel) {
      logChannel = await guild.channels.create({
        name: 'lost-logs',
        type: ChannelType.GuildText,
        topic: 'The Lost MC Genel Log Kanalı'
      });
      console.log(`📝 #lost-logs kanalı oluşturuldu: ${logChannel.id}`);
    }

    let mazeretChannel = guild.channels.cache.find(c => c.name === 'mazeret-log' && c.type === ChannelType.GuildText);
    if (!mazeretChannel) {
      mazeretChannel = await guild.channels.create({
        name: 'mazeret-log',
        type: ChannelType.GuildText,
        topic: 'The Lost MC Mazeret Bildirim Logları'
      });
      console.log(`📝 #mazeret-log kanalı oluşturuldu: ${mazeretChannel.id}`);
    }

    let mazeretSonucChannel = guild.channels.cache.find(c => c.name === 'mazeret-sonuc' && c.type === ChannelType.GuildText);
    if (!mazeretSonucChannel) {
      mazeretSonucChannel = await guild.channels.create({
        name: 'mazeret-sonuc',
        type: ChannelType.GuildText,
        topic: 'The Lost MC Mazeret Sonuç Bildirimleri'
      });
      console.log(`📝 #mazeret-sonuc kanalı oluşturuldu: ${mazeretSonucChannel.id}`);
    }

    let icIsimChannel = guild.channels.cache.find(c => c.name === 'ic-isim' && c.type === ChannelType.GuildText);
    if (!icIsimChannel) {
      icIsimChannel = await guild.channels.create({
        name: 'ic-isim',
        type: ChannelType.GuildText,
        topic: 'The Lost MC IC İsim Talepleri'
      });
      console.log(`📝 #ic-isim kanalı oluşturuldu: ${icIsimChannel.id}`);
    }

    // .env dosyasını otomatik güncelle
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      let updated = false;

      if (!envContent.includes(`LOG_CHANNEL_ID=${logChannel.id}`)) {
        envContent = envContent.replace(/LOG_CHANNEL_ID=.*/, `LOG_CHANNEL_ID=${logChannel.id}`);
        process.env.LOG_CHANNEL_ID = logChannel.id;
        updated = true;
      }
      if (!envContent.includes(`MAZERET_LOG_CHANNEL_ID=${mazeretChannel.id}`)) {
        envContent = envContent.replace(/MAZERET_LOG_CHANNEL_ID=.*/, `MAZERET_LOG_CHANNEL_ID=${mazeretChannel.id}`);
        process.env.MAZERET_LOG_CHANNEL_ID = mazeretChannel.id;
        updated = true;
      }
      if (!envContent.includes('MAZERET_SONUC_CHANNEL_ID=')) {
        envContent = envContent.replace(
          `MAZERET_LOG_CHANNEL_ID=${mazeretChannel.id}`,
          `MAZERET_LOG_CHANNEL_ID=${mazeretChannel.id}\nMAZERET_SONUC_CHANNEL_ID=${mazeretSonucChannel.id}`
        );
        process.env.MAZERET_SONUC_CHANNEL_ID = mazeretSonucChannel.id;
        updated = true;
      } else if (!envContent.includes(`MAZERET_SONUC_CHANNEL_ID=${mazeretSonucChannel.id}`)) {
        envContent = envContent.replace(/MAZERET_SONUC_CHANNEL_ID=.*/, `MAZERET_SONUC_CHANNEL_ID=${mazeretSonucChannel.id}`);
        process.env.MAZERET_SONUC_CHANNEL_ID = mazeretSonucChannel.id;
        updated = true;
      }

      if (!envContent.includes('IC_ISIM_CHANNEL_ID=')) {
        envContent = envContent.replace(
          `MAZERET_SONUC_CHANNEL_ID=${mazeretSonucChannel.id}`,
          `MAZERET_SONUC_CHANNEL_ID=${mazeretSonucChannel.id}\nIC_ISIM_CHANNEL_ID=${icIsimChannel.id}`
        );
        process.env.IC_ISIM_CHANNEL_ID = icIsimChannel.id;
        updated = true;
      } else if (!envContent.includes(`IC_ISIM_CHANNEL_ID=${icIsimChannel.id}`)) {
        envContent = envContent.replace(/IC_ISIM_CHANNEL_ID=.*/, `IC_ISIM_CHANNEL_ID=${icIsimChannel.id}`);
        process.env.IC_ISIM_CHANNEL_ID = icIsimChannel.id;
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(envPath, envContent, 'utf8');
        console.log('✅ .env dosyası yeni log kanalları ile güncellendi.');
      }
    }

    // Slash komutları kaydet
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, guild.id),
      { body: commands.map(c => c.data) }
    );
    console.log('✅ Slash komutları yüklendi.');

    // Rolleri fetch et ve konsola yazdır
    await guild.roles.fetch();
    console.log(`\n📋 SUNUCU: ${guild.name} (${guild.id})`);
    console.log('📋 SUNUCU ROLLERİ (.env dosyasına kopyalayın):');
    console.log('─'.repeat(55));
    guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .forEach(r => {
        if (r.name !== '@everyone') {
          console.log(`  ${r.name.padEnd(35)} → ${r.id}`);
        }
      });
    console.log('─'.repeat(55));

    // Kanalları listele
    console.log('\n📋 SUNUCU KANALLARI:');
    console.log('─'.repeat(55));
    guild.channels.cache
      .filter(c => c.type === ChannelType.GuildText)
      .forEach(c => {
        console.log(`  #${c.name.padEnd(34)} → ${c.id}`);
      });
    // Kategorileri listele
    guild.channels.cache
      .filter(c => c.type === ChannelType.GuildCategory)
      .forEach(c => {
        console.log(`  📁 ${c.name.padEnd(32)} → ${c.id}`);
      });
    console.log('─'.repeat(55));

  } catch (err) {
    console.error('Başlatma hatası:', err);
  }
});

// ═══════════════════════════════════════════════════════
// YENİ ÜYE KATILDIĞINDA (HOŞ GELDİN + OTO ROL)
// ═══════════════════════════════════════════════════════
client.on('guildMemberAdd', async (member) => {
  // Oto Rol
  const autoRoleId = process.env.AUTO_ROLE_ID;
  if (autoRoleId) {
    try {
      await member.roles.add(autoRoleId);
    } catch (e) {
      console.error('Oto rol hatası:', e.message);
      const logChannelId = process.env.LOG_CHANNEL_ID;
      if (logChannelId) {
        const logChannel = member.guild.channels.cache.get(logChannelId);
        if (logChannel) {
          logChannel.send({
            content: `⚠️ **Oto Rol Hatası:** <@${member.id}> (${member.user.tag}) kullanıcısına otomatik rol verilemedi.\n> **Hata Mesajı:** \`${e.message}\`\n> **Çözüm:** Discord Sunucu Ayarları > Roller kısmından botun rolünü verilecek rolün (örn: \`Patched Members\`) üstüne sürükleyin.`
          }).catch(() => {});
        }
      }
    }
  }

  // Hoş geldin mesajı
  const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
  if (!welcomeChannelId) return;
  const channel = member.guild.channels.cache.get(welcomeChannelId);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor(0x2B2D31)
    .setTitle('⛓️ THE LOST MC — LOS SANTOS')
    .setDescription(
      `> Yeni bir yüz göründü...\n\n` +
      `🏍️ **${member.user.tag}** clubhouse kapısını araladı.\n\n` +
      `Kendini kanıtla, sadakatini göster.\n` +
      `Yelek sırtına kolay gelmez.`
    )
    .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
    .setFooter({ text: `Üye #${member.guild.memberCount}` })
    .setTimestamp();

  channel.send({ embeds: [embed] });
});

// ═══════════════════════════════════════════════════════
// MESAJ EVENTİ (Prefix Komutları)
// ═══════════════════════════════════════════════════════
client.on('messageCreate', async (message) => {
  try {
    if (message.author.bot || !message.guild) return;

    // IC İsim Talebi Kanalı Kontrolü (Komut değilse)
    const icIsimChannelId = process.env.IC_ISIM_CHANNEL_ID;
    if ((message.channel.id === icIsimChannelId || message.channel.name === 'ic-isim') && !message.content.startsWith('.')) {
      const icName = message.content.trim();
      
      // Orijinal mesajı sil
      try {
        await message.delete();
      } catch (e) {}

      // İsim uzunluğu kontrolü
      if (icName.length < 3 || icName.length > 32) {
        const warnMsg = await message.channel.send({
          content: `❌ <@${message.author.id}>, girdiğiniz isim geçerli uzunlukta değil (3-32 karakter olmalıdır).`
        });
        setTimeout(() => warnMsg.delete().catch(() => {}), 5000);
        return;
      }

      // Embed ve butonları gönder
      const embed = new EmbedBuilder()
        .setColor(0x3498DB)
        .setTitle('📋 YENİ IC İSİM TALEBİ')
        .setDescription(
          `> <@${message.author.id}> yeni bir IC İsim talebi gönderdi.\n\n` +
          `👤 **Mevcut Adı:** \`${message.member.displayName}\`\n` +
          `✍️ **Talep Edilen İsim:** \`${icName}\`\n\n` +
          `*Yetkililer aşağıdaki butonları kullanarak onaylayabilir veya reddedebilir.*`
        )
        .setFooter({ text: `Kullanıcı ID: ${message.author.id}` })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`ic_isim_approve_${message.author.id}_${icName}`)
          .setLabel('Kabul Et')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`ic_isim_reject_${message.author.id}_${icName}`)
          .setLabel('Reddet')
          .setStyle(ButtonStyle.Danger)
      );

      await message.channel.send({ embeds: [embed], components: [row] });
      return;
    }

    const content = message.content.trim();
    if (!content.startsWith('.')) return;

    const args = content.slice(1).split(/ +/);
    const command = args.shift().toLowerCase();

    // Yetki Kontrolü
    const hasStaffPerm = message.member?.permissions.has(PermissionFlagsBits.ManageMessages) ||
                         message.member?.permissions.has(PermissionFlagsBits.Administrator) ||
                         (process.env.STAFF_ROLE_ID && message.member?.roles.cache.has(process.env.STAFF_ROLE_ID));

    // ─── .yardım ───
    if (command === 'yardım' || command === 'help') {
      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('⛓️ THE LOST MC — YARDIM MENÜSÜ')
        .setDescription(
          `> Botta bulunan tüm komutlar aşağıda listelenmiştir. Nokta **(.)** ile başlayanları direkt yazabilirsiniz, slash **(/)** olanları Discord menüsünden kullanabilirsiniz.\n\n` +
          `**⚙️ Kurulum & Yapılandırma**\n` +
          `• \`.kurulum\` / \`/kurulum\` : Adım adım bot kurulum ve kanal rehberini gösterir.\n` +
          `• \`.kurallar-kur\` / \`/kurallar-kur\` : Kulüp kurallarını ve sürüş düzenini kurar.\n` +
          `• \`.hiyerarsi-kur\` / \`/hiyerarsi-kur\` : Rütbe rehberini ve Patched Member tanımını kurar.\n` +
          `• \`.kanallar-kur\` / \`/kanallar-kur\` : Sunucu kanal ve log akış rehberini kurar.\n• \`.lore-kur\` / \`/lore-kur\` : Kulüp tarihçesini ve hikayesini kurar.\n• \`.haber-kur\` / \`/haber-kur\` : Duyuru ve haberler panosunu kurar.\n• \`.muttefik-kur\` / \`/muttefik-kur\` : Diplomasi ve müttefiklik yasalarını kurar.\n• \`.envanter-rehber-kur\` / \`/envanter-rehber-kur\` : Depo envanter kuralları ve fiyat rehberini kurar.\n\n` +
          `**🎫 Destek & Mazeret**\n` +
          `• \`.ticket-kur\` / \`/ticket-kur\` : Destek talebi paneli oluşturur.\n` +
          `• \`.mazeret-kur\` / \`/mazeret-kur\` : Mazeret bildirim paneli oluşturur.\n\n` +
          `**💼 Kulüp Yönetimi**\n` +
          `• \`.kasa-panel-kur\` / \`/kasa-panel-kur\` : Kasa yönetim paneli oluşturur.\n` +
          `• \`/satis-yap\` : İllegal satış kaydı girer.\n` +
          `• \`/kasa-durum\` : Kasa bakiyesini sorgular.\n` +
          `• \`/kasa-guncelle\` : Kasayı günceller.\n\n` +
          `**🏍️ Sürüş & Disiplin**\n` +
          `• \`/surus-planla\` : Toplu sürüş planı duyurur.\n` +
          `• \`/disiplin-cezasi\` : Disiplin cezası kaydeder.\n\n` +
          `**📢 İletişim & Bilgi**\n` +
          `• \`/duyuru\` : Kulüp duyurusu yapar.\n` +
          `• \`/toplanti\` : Toplantı çağrısı yapar.\n` +
          `• \`/kadro\` : Üye rütbelerini listeler.\n` +
          `• \`/uye-bilgi\` : Üye bilgilerini gösterir.\n\n` +
          `**🔨 Moderasyon**\n` +
          `• \`.sil <sayı>\` / \`/sil <sayı>\` : Belirtilen sayıda mesajı siler.\n` +
          `• \`/rutbe-ver\` / \`/rutbe-al\` : Üye rütbe yönetimi.\n` +
          `• \`/surgun\` : Üyeyi sürgün eder (Kick).\n` +
          `• \`/karaliste\` : Üyeyi yasaklar (Ban).`
        )
        .setFooter({ text: 'The Lost MC — Los Santos Chapter' })
        .setTimestamp();

      return await message.reply({ embeds: [embed] });
    }

    // ─── .sil <sayı> ───
    if (command === 'sil' || command === 'temizle') {
      if (!hasStaffPerm) {
        return await message.reply({ content: '❌ Bu komutu kullanmak için yetkiniz yok!' });
      }
      const sayi = parseInt(args[0]);
      if (isNaN(sayi) || sayi < 1 || sayi > 100) {
        return await message.reply({ content: '❌ Lütfen 1-100 arasında bir sayı girin! Örn: `.sil 15`' });
      }

      try {
        await message.delete();
      } catch (e) {}

      const deleted = await message.channel.bulkDelete(sayi, true);
      const replyMsg = await message.channel.send({ content: `🧹 **${deleted.size}** mesaj silindi.` });
      setTimeout(async () => {
        try {
          await replyMsg.delete();
        } catch (e) {}
      }, 3000);
      return;
    }

    // ─── .ticket-kur ───
    if (command === 'ticket-kur') {
      if (!hasStaffPerm) {
        return await message.reply({ content: '❌ Bu komutu kullanmak için yetkiniz yok!' });
      }
      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('⛓️ THE LOST MC — DESTEK SİSTEMİ')
        .setDescription(
          `> Sorunun mu var? Yardıma mı ihtiyacın var?\n\n` +
          `🏍️ Aşağıdaki butona tıklayarak bir **destek talebi** oluşturabilirsin.\n` +
          `Yetkililer en kısa sürede seninle ilgilenecek.\n\n` +
          `⚠️ *Gereksiz ticket açmak disiplin cezası gerektirir.*`
        )
        .setFooter({ text: 'The Lost MC — Los Santos Chapter' })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ticket_create')
          .setLabel('📩 Destek Talebi Oluştur')
          .setStyle(ButtonStyle.Secondary)
      );

      await message.channel.send({ embeds: [embed], components: [row] });
      try {
        await message.delete();
      } catch (e) {}
      return;
    }

    // ─── .mazeret-kur ───
    if (command === 'mazeret-kur') {
      if (!hasStaffPerm) {
        return await message.reply({ content: '❌ Bu komutu kullanmak için yetkiniz yok!' });
      }
      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('📋 THE LOST MC — MAZERET BİLDİRİM SİSTEMİ')
        .setDescription(
          `> Kulüp faaliyetlerine katılamayacak mısın?\n\n` +
          `🏍️ Aşağıdaki butona tıklayarak **mazeret bildirimini** ilet.\n` +
          `Mazeretini belirt, yönetim değerlendirsin.\n\n` +
          `⚠️ *Bildirimsiz devamsızlık disiplin işlemi gerektirir.*`
        )
        .setFooter({ text: 'The Lost MC — Los Santos Chapter' })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('mazeret_form')
          .setLabel('📋 Mazeret Bildir')
          .setStyle(ButtonStyle.Primary)
      );

      await message.channel.send({ embeds: [embed], components: [row] });
      try {
        await message.delete();
      } catch (e) {}
      return;
    }

    // ─── .kasa-panel-kur ───
    if (command === 'kasa-panel-kur') {
      if (!hasStaffPerm) {
        return await message.reply({ content: '❌ Bu komutu kullanmak için yetkiniz yok!' });
      }
      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('💰 THE LOST MC KASA YÖNETİMİ')
        .setDescription('Kulüp kasasını yönetmek için aşağıdaki butonları kullanabilirsiniz.')
        .addFields(
          { name: '💵 Bakiye Sorgula', value: 'Kasadaki mevcut nakit miktarını gösterir.', inline: false },
          { name: '📥 Para Ekle (Gelir)', value: 'Kasaya gelir/para girişi ekler.', inline: false },
          { name: '📤 Para Çek (Gider)', value: 'Kasadan gider/para çıkışı kaydeder.', inline: false }
        )
        .setFooter({ text: 'The Lost MC — Kasa Sistemi' })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('kasa_bakiye_sor')
          .setLabel('💰 Bakiye Sorgula')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('kasa_gelir_ekle')
          .setLabel('📥 Para Ekle (Gelir)')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('kasa_gider_cek')
          .setLabel('📤 Para Çek (Gider)')
          .setStyle(ButtonStyle.Danger)
      );

            await message.channel.send({ embeds: [embed], components: [row] });
      try {
        await message.delete();
      } catch (e) {}
      return;
    }

    // ─── .kurallar-kur ───
    if (command === 'kurallar-kur') {
      if (!hasStaffPerm) {
        return await message.reply({ content: '❌ Bu komutu kullanmak için yetkiniz yok!' });
      }
      const embedRules = new EmbedBuilder()
        .setColor(0x8B0000)
        .setTitle('💀 THE LOST MC — KULÜP ANA YASALARI')
        .setDescription(
          '• **Kardeşlik Esastır:** Kulüpte bulunan kişiler kardeştir ve katıldıkları üzere buna yemin etmişlerdir.\n' +
          '• **Görünüm & Aidiyet:** Kulübe üye olan her kişi sırtında **Reaper dövmesi** bulundurmak zorundadır; deri ceket giymeli, siyah ağırlıklı giyinmeli ve kulüp motorunu kullanmalıdır.\n' +
          '• **Görev Bilinci:** Herkes kendine verilen işi tamamlamak zorundadır.\n' +
          '• **Finans & Toplantı:** Para işleri her pazar yapılan toplantıda konuşulur ve yaptığınız iş icabı paranız verilir.\n' +
          '• **Sivil & Polis:** Los Santos\'ta sivilleri soymak, masumlara zarar vermek ve polise olaysız yere zorluk çıkarmak yasaktır.\n' +
          '• **Uyuşturucu Yasakları:** Uyuşturucu işi ile uğraşmak, sivillere satmak, ağır uyuşturucu kullanmak yasaktır.\n' +
          '• **Church (Toplantı):** Belirtilen her pazar yapılacak toplantıya katılım göstermek zorunludur.\n' +
          '• **Mertlik:** Motorcu merttir ve mert davranmalıdır, rolünüzle bunu kanıtlayın.\n' +
          '• **Birliktelik:** Hep beraber gezer, hep beraber yer içer, eğlenir ve çalışırız.\n' +
          '• **Anarşizm:** Genelde anarşist bir yol izleriz.\n\n' +
          '*Brothers for life.. LOST FOREVER.*'
        )
        .setFooter({ text: 'The Lost MC — Los Santos Chapter' })
        .setTimestamp();

      const embedFormation = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('🏍️ THE LOST MC — TOPLU SÜRÜŞ VE FORMASYON DÜZENİ')
        .setDescription(
          'Toplu sürüşlerde kulübün disiplin ve hiyerarşisini korumak amacıyla fermuar düzeni uygulanır.\n\n' +
          '**Formasyon Şeması:**\n' +
          '```text\n' +
          '         ▲ Ön (Yol Yönü)\n' +
          '         \n' +
          '         [ President ]\n' +
          '        /             \\\n' +
          '   [ Vice Pres ]    [ Sgt. At Arms ]\n' +
          '        |             |\n' +
          '    [ Member ]      [ Member ]\n' +
          '        |             |\n' +
          '    [ Member ]      [ Member ]\n' +
          '```\n' +
          '**Sürüş Kuralları:**\n' +
          '1. **Konvoy Lideri (President):** Konvoyun en önünde yer alır, hızı ve rotayı belirler.\n' +
          '2. **Kanatlar (VP & Sgt. At Arms):** President\'ın sağ ve sol arkasında koruma ve konvoy düzenini sağlar.\n' +
          '3. **Takip Düzeni (Members):** Diğer üyeler ikişerli sütun halinde izler.\n' +
          '4. **Sollama Yasaktır:** Konvoy esnasında sollama kesinlikle yasaktır.'
        );

      await message.channel.send({ embeds: [embedRules, embedFormation] });
      try {
        await message.delete();
      } catch (e) {}
      return;
    }

    // ─── .kurulum ───
    if (command === 'kurulum') {
      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('⚙️ THE LOST MC — BOT KURULUM VE KANAL REHBERİ')
        .setDescription(
          'Botumuzun sorunsuz çalışması ve logların doğru odalara düşmesi için aşağıdaki adımları ve kanal eşleşmelerini takip edin:\n\n' +
          '### 📢 1. Kurallar ve Sürüş Düzeni\n' +
          '• **Kanal:** `#rules` veya `#club-laws`\n' +
          '• **Komut:** `.kurallar-kur` veya `/kurallar-kur`\n\n' +
          '### 📩 2. Destek Talebi (Ticket) Sistemi\n' +
          '• **Kanal:** `#iletisim` veya `#the-gate`\n' +
          '• **Komut:** `.ticket-kur` veya `/ticket-kur`\n\n' +
          '### 📋 3. Mazeret Bildirim Sistemi\n' +
          '• **Kanal:** `#mazeret-log` dışında herhangi bir oda (örn: `#mazeret-bildir`).\n' +
          '• **Komut:** `.mazeret-kur` veya `/mazeret-kur`\n\n' +
          '### 💰 4. Kasa Yönetim Sistemi\n' +
          '• **Kanal:** `#moderator-only` veya `#vault-room` (Sadece yetkililerin görebildiği oda)\n' +
          '• **Komut:** `.kasa-panel-kur` veya `/kasa-panel-kur`\n\n' +
          '### 💼 5. Rol Yapma ve Kayıt Komutları\n' +
          'Herhangi bir kanalda kullanabilirsiniz, bot çıktısını otomatik olarak log odalarına gönderecektir:\n' +
          '• `/satis-yap` → Illegal ticareti kaydeder. Kayıt otomatik olarak **`#lost-logs`** kanalına düşer.\n' +
          '• `/disiplin-cezasi` → Verilen disiplin cezalarını kaydeder. Detaylar otomatik olarak **`#lost-logs`** kanalına düşer.\n' +
          '• `/surus-planla` → Konvoy planı oluşturur ve `@everyone` rolünü etiketleyerek duyuru geçer.\n\n' +
          '### 👑 6. Rütbe & Hiyerarşi Rehberi\n' +
          '• **Kanal:** `#hierarchy` veya `#roles`\n' +
          '• **Komut:** `.hiyerarsi-kur` veya `/hiyerarsi-kur`\n\n' +
          '### 🗺️ 7. Kanal ve Log Akış Rehberi\n' +
          '• **Kanal:** `#channel-guide` veya `#info`\n' +
          '• **Komut:** `.kanallar-kur` veya `/kanallar-kur` '
        )
        .setFooter({ text: 'The Lost MC — Kurulum Kılavuzu' })
        .setTimestamp();

      return await message.reply({ embeds: [embed] });
    }

    // ─── .hiyerarsi-kur ───
    if (command === 'hiyerarsi-kur') {
      if (!hasStaffPerm) {
        return await message.reply({ content: '❌ Bu komutu kullanmak için yetkiniz yok!' });
      }
      const embedHeader = new EmbedBuilder()
        .setColor(0x8B0000)
        .setTitle('💀 THE LOST MC — HİYERARŞİ VE RÜTBE DÜZENİ')
        .setDescription(
          '> **Kulüp Hiyerarşisi ve Sadakat Yönetmeliği**\n\n' +
          'The Lost Motorcycle Club içinde rütbeler, kulübe verilen emek, sadakat, cesaret ve kardeşlik bağı ile kazanılır. Aşağıda kulüp içi tüm rütbeler ve taşıdıkları anlamlar listelenmiştir.'
        )
        .addFields(
          {
            name: '👑 HIGH COMMAND (Üst Yönetim)',
            value: '• **President (Başkan):** Kulübün mutlak lideridir. Son söz ve kararlar ona aittir. Kulübü dışarıda temsil eder ve vizyonu belirler.\n' +
                   '• **Vice President (Başkan Yardımcısı):** President\'ın sağ koludur. Başkanın olmadığı durumlarda kulübü yönetir ve operasyonları koordine eder.\n' +
                   '• **Sergeant at Arms (Sgt. At Arms):** Kulüp içi disiplini, güvenliği ve yasalara uyulmasını sağlar. Cezaları uygular ve üyelerin yelek/silah düzenini denetler.\n' +
                   '• **Road Captain (Yol Kaptanı):** Toplu sürüşlerde rotayı belirler, formasyon düzenini sağlar ve konvoy güvenliğini yönetir.\n' +
                   '• **Nomads (Göçebeler):** Kulübe bağlı ancak belirli bir şubeye bağlı kalmadan seyahat eden, doğrudan üst yönetime çalışan tecrübeli üyeler.',
            inline: false
          },
          {
            name: '🛡️ CLUB OFFICERS (Kulüp Görevlileri)',
            value: '• **Roadbound Secretary (Yazıcı):** Kulüp toplantı kararlarını, resmi evrakları ve üye kayıtlarını tutar.\n' +
                   '• **Club Mom (Kulüp Annesi):** Clubhouse düzeninden, erzak tedariğinden ve bar yönetiminden sorumludur.\n' +
                   '• **Vault Keeper (Kasa Sorumlusu):** Kulüp kasasını ve illegal uyuşturucu/silah gelirlerinin kaydını tutar.\n' +
                   '• **Archivist (Arşivci):** Kulübün geçmişini, eski operasyon ve istihbarat belgelerini saklar.',
            inline: false
          },
          {
            name: '⚔️ COMBAT UNITS (Muharebe ve Operasyon Birimleri)',
            value: '• **Rear Lance / War Captain / Iron Watch / Marked Executive / Death Net:** Kulübün özel operasyonel, çatışma ve bölge koruma ekipleridir. Illegal sevkiyatların güvenliğini sağlarlar.',
            inline: false
          }
        )
        .setTimestamp();

      const embedPatched = new EmbedBuilder()
        .setColor(0x8B0000)
        .setTitle('🦅 YELEKLİ ÜYELER (PATCHED MEMBERS)')
        .setDescription(
          '> **🤔 PATCHED MEMBER (YELEKLİ ÜYE) NEDİR?**\n\n' +
          '**Patched Member (Yelekli Üye)**, kulübün tam ve resmi üyesidir. Adaylık (Prospect) sürecini başarıyla tamamlamış, sadakatini, cesaretini ve kulübe bağlılığını kanıtlayarak sırtında kulübün tam logosunu (**Reaper ve patch seti / colors**) taşımaya hak kazanmış kişidir. Kulüp içinde tam bir oy hakkına sahiptir ve diğer yeleklilerin resmi "kardeşi" (brother) olarak kabul edilir.\n\n' +
          '📋 **Yelekli Üyenin Hak ve Sorumlulukları:**\n' +
          '• **Church Katılımı:** Her pazar yapılan kulüp toplantılarına (Church) katılma ve kulüp kararlarında oy kullanma hakkına sahiptir.\n' +
          '• **Liderlik ve Denetim:** Adaylara (Prospects) emir verebilir, onları eğitebilir ve kulüp disiplinine uymalarını sağlayabilir.\n' +
          '• **Kardeşlik Bağı:** Diğer yelekli üyeleri korumak, kulüp sırlarını canı pahasına saklamak ve kulüp çıkarlarını her şeyin üstünde tutmakla yükümlüdür.\n' +
          '• **Görünüm:** Sırtındaki kulüp yamasını (colors) her zaman onurla taşımalı, kulüp motorunu kullanmalı ve kulüp tarzına uygun giyinmelidir.\n\n' +
          '🎖️ **Diğer Yelekli Dereceleri:**\n' +
          '• **Grave Historian:** Kulüp geleneklerini ve geçmişini koruyan tecrübeli yelekli.\n' +
          '• **Marked Brother:** Savaşta ve zorlu görevlerde rüştünü ispatlamış kıdemli kardeş.\n' +
          '• **Black Chaplain:** Kulübün manevi rehberi ve cenaze/bağlılık yeminlerini yöneten kişi.\n' +
          '• **MC Outlaws:** Kulüp içindeki kanunsuz sürüş ve aktif operasyon liderleri.'
        )
        .setTimestamp();

      const embedAdaylar = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('🥚 ADAYLAR, SEMPATİZANLAR VE TİCARİ BİRİMLER')
        .addFields(
          {
            name: '👥 Adaylar & Sempatizanlar',
            value: '• **Prospect (Aday Üye):** Kulübe girmek ve yelek almak için kendini kanıtlamaya çalışan adaylar. Sırtlarında logo taşıyamazlar. Yeleklilerin emirlerini yerine getirir, clubhouse işlerini yapar ve sadakat testinden geçerler.\n' +
                   '• **Hang Around (Takılan):** Sempatizanlar, gözlemlenen ve henüz resmi aday sürecine kabul edilmemiş kişiler.\n' +
                   '• **Supporter Group:** Dışarıdan kulübe destek veren siviller.\n' +
                   '• **MC Trainee:** Sürüş ve temel kuralları öğrenmekte olan çaylaklar.\n' +
                   '• **Retired Member (Emekli Üye):** Kulübe uzun yıllar onuruyla hizmet etmiş ve emekliye ayrılmış eski yelekliler.',
            inline: false
          },
          {
            name: '⚖️ Hukuk & İş Bölümü',
            value: '• **Club Lawyer / Legal Advisor:** Kulübün yasal süreçlerini yöneten avukatlar.\n' +
                   '• **Weapons / Drug Dealing / Materials Gather:** Kulübün uyuşturucu imalatı, silah ticareti ve hammadde toplama gibi illegal iş kollarını yürüten uzman kadrolar.',
            inline: false
          }
        )
        .setFooter({ text: 'The Lost MC — Hierarchy & Roles' })
        .setTimestamp();

      await message.channel.send({ embeds: [embedHeader, embedPatched, embedAdaylar] });
      try {
        await message.delete();
      } catch (e) {}
      return;
    }

    // ─── .kanallar-kur ───
    if (command === 'kanallar-kur') {
      if (!hasStaffPerm) {
        return await message.reply({ content: '❌ Bu komutu kullanmak için yetkiniz yok!' });
      }
      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('🗺️ THE LOST MC — SUNUCU KANAL VE LOG REHBERİ')
        .setDescription(
          'Sunucumuzdaki odaların kullanım amaçları, hangi odada hangi komutların çalıştırılması gerektiği ve logların otomatik olarak hangi kanala düşeceği aşağıda detaylandırılmıştır:\n\n' +
          '### 📜 1. Kurallar ve Sürüş Düzeni (`#rules` / `#club-laws`)\n' +
          '• **Amaç:** Kulüp ana yasalarını ve toplu sürüş formasyon şemasını barındırır.\n' +
          '• **Kurulum Komutu:** `/kurallar-kur` veya `.kurallar-kur`\n\n' +
          '### 📩 2. Destek Talebi Sistemi (`#iletisim` / `#the-gate`)\n' +
          '• **Amaç:** Üyelerin yönetimle özel görüşme başlatabileceği destek butonu yer alır. Açılan ticket\'lar otomatik olarak `TICKET_CATEGORY_ID` kategorisi altında yeni oda olarak açılır.\n' +
          '• **Kurulum Komutu:** `/ticket-kur` veya `.ticket-kur`\n\n' +
          '### 📋 3. Mazeret Bildirim Sistemi\n' +
          '• **Mazeret Bildir (`#mazeret-bildir`):** Üyelerin mazeret formu doldurduğu butonu barındırır. (Komut: `.mazeret-kur`)\n' +
          '• **Mazeret Log (`#mazeret-log`):** Sadece yetkililerin görebildiği, onay/red butonlu mazeretlerin düştüğü odadır.\n' +
          '• **Mazeret Sonuc (`#mazeret-sonuc`):** Sonuçlanan mazeretlerin üyeler etiketlenerek ilan edildiği yerdir.\n\n' +
          '### 💰 4. Kasa Yönetim Sistemi (`#vault-room` / `#moderator-only`)\n' +
          '• **Amaç:** Yetkililerin bakiye sorgulayıp, para giriş/çıkışı ekleyebileceği butonlu kasa panelini barındırır. Sadece yetkililere açıktır.\n' +
          '• **Kurulum Komutu:** `/kasa-panel-kur` veya `.kasa-panel-kur`\n\n' +
          '### 📝 5. Bot Aktivite ve İşlem Logları (`#lost-logs`)\n' +
          '• **Amaç:** Aşağıdaki tüm işlemler bot tarafından otomatik olarak bu odaya dekont/log halinde gönderilir:\n' +
          '  - Uyuşturucu/Silah satışı yapıldığında: `/satis-yap`\n' +
          '  - Kasadan para çekildiğinde veya eklendiğinde: `/kasa-guncelle` veya Kasa Paneli butonları\n' +
          '  - Sergeant at Arms tarafından ceza girildiğinde: `/disiplin-cezasi`\n\n' +
          '### 👑 6. Rütbeler & Hiyerarşi (`#hierarchy` / `#roles`)\n' +
          '• **Amaç:** Kulüp rütbelerini ve Patched Member tanımını barındırır.\n' +
          '• **Kurulum Komutu:** `/hiyerarsi-kur` veya `.hiyerarsi-kur`\n\n' +
          '### 🗺️ 7. Kanal Rehberi (`#channel-guide` / `#info`)\n' +
          '• **Amaç:** Şu an okumakta olduğunuz kanal rehberini kurar.\n' +
          '• **Kurulum Komutu:** `/kanallar-kur` veya `.kanallar-kur`'
        )
        .setFooter({ text: 'The Lost MC — Channel Guide' })
        .setTimestamp();

            await message.channel.send({ embeds: [embed] });
      try {
        await message.delete();
      } catch (e) {}
      return;
    }

    // ─── .lore-kur ───
    if (command === 'lore-kur') {
      if (!hasStaffPerm) {
        return await message.reply({ content: '❌ Bu komutu kullanmak için yetkiniz yok!' });
      }
      const embedHistory = new EmbedBuilder()
        .setColor(0x8B0000)
        .setTitle('🩸 THE LOST MC — TARİHÇE VE KÖKEN')
        .setDescription(
          '**Kuruluş (1964 — Alderney):**\n' +
          'The Lost Motorcycle Club, 1964 yılında Alderney\'de Vietnam Savaşı\'ndan dönen 8 eski ABD Deniz Piyadesi (Marines) tarafından kurulmuştur. Savaşın ardından topluma adapte olmakta zorlanan bu askerler, özgürlük ve kardeşlik arayışıyla bir araya gelmiş ve "The Lost" (Kayıp olanlar) adını almışlardır.\n\n' +
          '**Reaper Logosu ve Anlamı:**\n' +
          'Sırtımızda taşıdığımız **Reaper (Ölüm Meleği)** logosu, savaştaki kardeşlerimizin kaybını ve ölümle her an burun buruna yaşayan motorcu yaşam tarzını simgeler. Kartal kanatları özgürlüğü, yelek ise koşulsuz bağlılığı temsil eder.'
        )
        .setTimestamp();

      const embedChapter = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('🏍️ LOS SANTOS CHAPTER VE YENİ DÖNEM')
        .setDescription(
          'Alderney\'deki büyük savaşların ve Johnny Klebitz liderliğindeki efsanevi dönemin ardından, kulüp sınırlarını genişleterek Blaine County ve Los Santos şubelerini (Chapters) kurmuştur.\n\n' +
          '**Misyonumuz:**\n' +
          'Bizler sadece bir motor kulübü değiliz. Biz bir aile, bir kardeşlik bağıyız. Los Santos sokaklarında kendi kurallarımızla yaşar, anarşiyi ve özgürlüğü savunuruz. Bize saygı duyanlara saygı duyar, yolumuza taş koyanları ise Reaper ile tanıştırırız.\n\n' +
          '*Lost Forever, Forever Lost...*'
        )
        .setTimestamp();

      await message.channel.send({ embeds: [embedHistory, embedChapter] });
      try {
        await message.delete();
      } catch (e) {}
      return;
    }

    // ─── .haber-kur ───
    if (command === 'haber-kur') {
      if (!hasStaffPerm) {
        return await message.reply({ content: '❌ Bu komutu kullanmak için yetkiniz yok!' });
      }
      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('📢 THE LOST MC — DUYURULAR VE HABERLER')
        .setDescription(
          '> **Kulüp İçi Resmi İletişim Paneli**\n\n' +
          'Kulüple ilgili en son gelişmeler, kararlar, etkinlikler ve duyurular bu kanal üzerinden üyelerimize aktarılacaktır. Her yelekli üye ve aday bu kanalı takip etmekle yükümlüdür.\n\n' +
          '**📌 Duyuru Kategorileri:**\n' +
          '• 📢 **Genel Duyurular:** Toplantı saatleri, sürüş planları ve kulüp içi rütbe değişiklikleri.\n' +
          '• ⚔️ **Savaş ve Diplomasi:** Diğer ekiplerle yapılan anlaşmalar veya savaş durumları.\n' +
          '• 💸 **Ticari Güncellemeler:** Sevkiyatlar, mal fiyatları ve depo güncellemeleri.\n\n' +
          '*Unutmayın: Kulüp içi kararlar ve duyurular sızdırılamaz. Sızdıranlar hain ilan edilir.*'
        )
        .setFooter({ text: 'The Lost MC — Announcements' })
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
      try {
        await message.delete();
      } catch (e) {}
      return;
    }

    // ─── .muttefik-kur ───
    if (command === 'muttefik-kur') {
      if (!hasStaffPerm) {
        return await message.reply({ content: '❌ Bu komutu kullanmak için yetkiniz yok!' });
      }
      const embed = new EmbedBuilder()
        .setColor(0x8B0000)
        .setTitle('🤝 DİPLOMASİ VE MÜTTEFİKLİK YASALARI')
        .setDescription(
          '> **The Lost MC Diplomasi Yönetmeliği**\n\n' +
          'Dış ilişkiler kulübün bekası için hayati önem taşır. Diplomatik kararlar ve müttefiklik kuralları aşağıda belirtilmiştir:\n\n' +
          '**📜 Temel Diplomasi Kuralları:**\n' +
          '1. **Karar Mercii:** Müttefiklik, barış veya savaş kararları yalnızca **President** (Başkan) ve High Command onayıyla alınabilir.\n' +
          '2. **Saldırmazlık Paktı:** Resmi müttefiklerimizle veya saldırmazlık anlaşması (NAP) yaptığımız ekiplerle hiçbir şekilde çatışmaya girilemez, bölgelerinde illegal satış yapılamaz.\n' +
          '3. **Ortak Müdafaa:** Bir müttefikimize yapılan saldırı, doğrudan The Lost MC\'ye yapılmış sayılır. Çağrı halinde savaşa destek verilir.\n' +
          '4. **Diplomatik Dil:** Dışarıdaki ekiplerle yapılan tüm görüşmelerde kulübün ağırlığına yakışır, mert ve kararlı bir duruş sergilenmelidir.'
      )
        .setFooter({ text: 'The Lost MC — Diplomacy Department' })
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
      try {
        await message.delete();
      } catch (e) {}
      return;
    }

    // ─── .envanter-rehber-kur ───
    if (command === 'envanter-rehber-kur') {
      if (!hasStaffPerm) {
        return await message.reply({ content: '❌ Bu komutu kullanmak için yetkiniz yok!' });
      }
      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('📦 ENVANTER YÖNETİMİ VE TİCARET REHBERİ')
        .setDescription(
          '> **Silah & Uyuşturucu Sevkiyat Kuralları**\n\n' +
          'Kulübümüzün finansal gücünü sağlayan illegal ticaret ve silah deposunun kullanımı belirli kurallara bağlanmıştır:\n\n' +
          '**💊 Uyuşturucu Ticareti Kuralları:**\n' +
          '• Satış yapan üye, kazandığı paranın kulüp payını kasaya koymak zorundadır.\n' +
          '• Her uyuşturucu satışı yapıldığında **`/satis-yap`** komutu ile sisteme kaydedilmelidir.\n' +
          '• Müşterilere uygulanacak fiyat listesi High Command tarafından belirlenir ve dışına çıkılamaz.\n\n' +
          '**🔫 Silah Dağıtım Kuralları:**\n' +
          '• Ağır silahlar (Taramalı, Özel Tabanca vb.) yalnızca **Sergeant at Arms** ve üst yönetimin izniyle depodan alınabilir.\n' +
          '• Kaybedilen her silahın raporu Sgt. At Arms\'a verilmelidir.\n' +
          '• Kulüp üyelerine sağlanan silahlar hiçbir sivil veya yabancı kişiye satılamaz.'
        )
        .setFooter({ text: 'The Lost MC — Vault & Inventory' })
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
      try {
        await message.delete();
      } catch (e) {}
      return;
    }
  } catch (e) {
    console.error('Mesaj komut işleme hatası:', e.message);
  }
});

client.login(process.env.BOT_TOKEN);