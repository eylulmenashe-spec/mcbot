// ═══════════════════════════════════════════════════════
// THE LOST MC — KOMUT İŞLEYİCİ (HANDLE COMMAND)
// ═══════════════════════════════════════════════════════
const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder,
  ButtonStyle, PermissionFlagsBits
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const kasaPath = path.join(__dirname, 'kasa.json');

function readKasa() {
  if (!fs.existsSync(kasaPath)) {
    fs.writeFileSync(kasaPath, JSON.stringify({ bakiye: 0, islemler: [] }, null, 2), 'utf8');
  }
  try {
    return JSON.parse(fs.readFileSync(kasaPath, 'utf8'));
  } catch (e) {
    return { bakiye: 0, islemler: [] };
  }
}

function writeKasa(data) {
  fs.writeFileSync(kasaPath, JSON.stringify(data, null, 2), 'utf8');
}

const ROLE_MAP = {
  'ROLE_PRESIDENT': '🛠️ President (Başkan)',
  'ROLE_VICE_PRESIDENT': '🛠️ Vice President',
  'ROLE_SERGEANT_AT_ARMS': '🛠️ Sergeant at Arms',
  'ROLE_ROAD_CAPTAIN': '🛠️ Road Captain',
  'ROLE_NOMADS': '🛠️ Nomads',
  'ROLE_ROADBOUND_SECRETARY': '🛡️ Roadbound Secretary',
  'ROLE_CLUB_MOM': '🛡️ Club Mom',
  'ROLE_VAULT_KEEPER': '🛡️ Vault Keeper',
  'ROLE_ARCHIVIST': '🛡️ Archivist',
  'ROLE_REAR_LANCE': '⚔️ Rear Lance',
  'ROLE_WAR_CAPTAIN': '⚔️ War Captain',
  'ROLE_IRON_WATCH': '⚔️ Iron Watch',
  'ROLE_MARKED_EXECUTIVE': '⚔️ Marked Executive',
  'ROLE_DEATH_NET': '⚔️ Death Net',
  'ROLE_PATCHED_MEMBER': '🦅 Patched Member',
  'ROLE_GRAVE_HISTORIAN': '🦅 Grave Historian',
  'ROLE_MARKED_BROTHER': '🦅 Marked Brother',
  'ROLE_BLACK_CHAPLAIN': '🦅 Black Chaplain',
  'ROLE_MC_OUTLAWS': '🦅 MC Outlaws',
  'ROLE_PROSPECT': '🦅 Prospect',
  'ROLE_HANG_AROUND': '🦅 Hang Around',
  'ROLE_SUPPORTER_GROUP': '🦅 Supporter Group',
  'ROLE_MC_TRAINEE': '🦅 MC Trainee',
  'ROLE_RETIRED_MEMBER': '🦅 Retired Member',
  'ROLE_CLUB_LAWYER': '⚖️ Club Lawyer',
  'ROLE_LEGAL_ADVISOR': '⚖️ Legal Advisor',
  'ROLE_WEAPONS_DEALING': '💼 Weapons Dealing',
  'ROLE_DRUG_DEALING': '💼 Drug Dealing',
  'ROLE_MATERIALS_GATHER': '💼 Materials Gather'
};

module.exports = async function handleCommand(interaction, commands) {
  const { commandName, options, guild, member } = interaction;

  // ─── TICKET KUR ───
  if (commandName === 'ticket-kur') {
    const embed = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle('⚖️ THE LOST MC — DESTEK SİSTEMİ')
      .setDescription(
        `> **Kulüp İçi Destek ve Bildirim Talebi**\n\n` +
        `Bir sorununuz, şikayetiniz veya yönetimle görüşmek istediğiniz bir konu varsa aşağıdaki butona tıklayarak özel destek kanalı açabilirsiniz.\n\n` +
        `📋 **Destek Kuralları:**\n` +
        `• **Saygı ve Düzen:** Yetkililerle olan iletişiminizde saygı çerçevesini aşmayın. Argo, hakaret ve kışkırtıcı tavırlar disiplin cezasına yol açar.\n` +
        `• **Sorunu Net Açıklama:** Destek kanalı açıldığında sorununuzu/talebinizi detaylı ve net bir şekilde tek seferde yazın.\n` +
        `• **Gereksiz Kullanım:** Eğlence veya test amaçlı destek talebi açmak yasaktır. Lüzumsuz açılan talepler cezalandırılır.\n` +
        `• **Sabırlı Olun:** Yetkililer de birer oyuncudur, destek talebinize anında yanıt gelmezse sabırla bekleyin ve yetkilileri etiketlemeyin.\n\n` +
        `🏍️ *Tüm kulüp üyeleri ve adayları (Prospects) bu kurallara uymakla yükümlüdür.*`
      )
      .setFooter({ text: 'The Lost MC — Los Santos Chapter' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket_create')
        .setLabel('📩 Destek Talebi Oluştur')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });
    return interaction.reply({ content: '✅ Ticket paneli kuruldu.', ephemeral: true });
  }

  // ─── MAZERET KUR ───
  if (commandName === 'mazeret-kur') {
    const embed = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle('📜 THE LOST MC — MAZERET BİLDİRİM SİSTEMİ')
      .setDescription(
        `> **Mazeret ve Devamsızlık Yönetmeliği**\n\n` +
        `Kulüp faaliyetlerine, toplantılarına (Church) veya planlı sürüşlere katılamayacak durumdaysanız aşağıdaki butonu kullanarak mazeretinizi iletiniz.\n\n` +
        `📋 **Mazeret Kuralları:**\n` +
        `• **Bildirim Süresi:** Planlı devamsızlıklarınızı en geç etkinlik saatinden **2 saat öncesine kadar** bildirmelisiniz. Sonrasında iletilen mazeretler geçersiz sayılacaktır.\n` +
        `• **Geçerli Nedenler:** Mazeret sebebini (iş, eğitim, sağlık vb.) detaylıca belirtin. Yetersiz açıklamalar yönetim tarafından reddedilebilir.\n` +
        `• **Maksimum Süre:** Kesintisiz mazeret süresi yönetim kurulunun özel izni olmadıkça **en fazla 7 gün** olabilir. Bu süreyi aşan durumlarda yelek askıya alınabilir.\n` +
        `• **Değerlendirme:** Bildirimleriniz Üst Yönetim tarafından incelenir ve onay/red durumu \`#mazeret-sonuc\` kanalından ilan edilir.\n\n` +
        `⚠️ *Mazeretsiz Church ve sürüş devamsızlığı kulüpten sürgün edilme (kick/ban) sebebidir.*`
      )
      .setFooter({ text: 'The Lost MC — Los Santos Chapter' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('mazeret_form')
        .setLabel('📋 Mazeret Formu Aç')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });
    return interaction.reply({ content: '✅ Mazeret paneli kuruldu.', ephemeral: true });
  }

  // ─── RÜTBE VER ───
  if (commandName === 'rutbe-ver') {
    const user = options.getMember('uye');
    const role = options.getRole('rol');
    try {
      await user.roles.add(role);
      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle('🎖️ Rütbe Verildi')
        .setDescription(`**${user.user.tag}** üyesine **${role.name}** rütbesi verildi.`)
        .addFields({ name: 'İşlemi Yapan', value: `${member.user.tag}`, inline: true })
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    } catch (e) {
      return interaction.reply({ content: `❌ Hata: ${e.message}`, ephemeral: true });
    }
  }

  // ─── RÜTBE AL ───
  if (commandName === 'rutbe-al') {
    const user = options.getMember('uye');
    const role = options.getRole('rol');
    try {
      await user.roles.remove(role);
      const embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle('🎖️ Rütbe Alındı')
        .setDescription(`**${user.user.tag}** üyesinden **${role.name}** rütbesi alındı.`)
        .addFields({ name: 'İşlemi Yapan', value: `${member.user.tag}`, inline: true })
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    } catch (e) {
      return interaction.reply({ content: `❌ Hata: ${e.message}`, ephemeral: true });
    }
  }

  // ─── DUYURU ───
  if (commandName === 'duyuru') {
    const baslik = options.getString('baslik');
    const icerik = options.getString('icerik');
    const etiket = options.getRole('etiket');

    const embed = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle(`📢 ${baslik}`)
      .setDescription(`${icerik}`)
      .setFooter({ text: `Duyuran: ${member.user.tag}` })
      .setTimestamp();

    const content = etiket ? `<@&${etiket.id}>` : '';
    await interaction.channel.send({ content, embeds: [embed] });
    return interaction.reply({ content: '✅ Duyuru yapıldı.', ephemeral: true });
  }

  // ─── TOPLANTI (CHURCH) ───
  if (commandName === 'toplanti') {
    const saat = options.getString('saat');
    const konu = options.getString('konu');

    const embed = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle('🏛️ CHURCH — KULÜP TOPLANTISI')
      .setDescription(
        `> Tüm üyeler dikkat!\n\n` +
        `🕐 **Saat:** ${saat}\n` +
        `📌 **Konu:** ${konu}\n\n` +
        `⚠️ *Katılım zorunludur. Katılamayacaklar mazeret bildirsin.*`
      )
      .setFooter({ text: `Çağıran: ${member.user.tag}` })
      .setTimestamp();

    await interaction.channel.send({ content: '@everyone', embeds: [embed] });
    return interaction.reply({ content: '✅ Toplantı çağrısı yapıldı.', ephemeral: true });
  }

  // ─── KADRO ───
  if (commandName === 'kadro') {
    await interaction.deferReply();
    await guild.members.fetch();

    let desc = '';
    for (const [envKey, label] of Object.entries(ROLE_MAP)) {
      const roleId = process.env[envKey];
      if (!roleId) continue;
      const role = guild.roles.cache.get(roleId);
      if (!role) continue;
      const members = role.members.map(m => m.user.tag);
      if (members.length > 0) {
        desc += `**${label}**\n${members.map(m => `> ${m}`).join('\n')}\n\n`;
      }
    }

    if (!desc) desc = '*Henüz .env dosyasında rol ID\'leri tanımlanmamış.*';

    const embed = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle('📜 THE LOST MC — KULÜP KADROSU')
      .setDescription(desc.substring(0, 4000))
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }

  // ─── ÜYE BİLGİ ───
  if (commandName === 'uye-bilgi') {
    const target = options.getMember('uye');
    const roles = target.roles.cache
      .filter(r => r.name !== '@everyone')
      .sort((a, b) => b.position - a.position)
      .map(r => `<@&${r.id}>`)
      .join(', ') || 'Yok';

    const embed = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle(`🔍 Üye Bilgisi — ${target.user.tag}`)
      .setThumbnail(target.user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: '📛 Kullanıcı', value: `<@${target.id}>`, inline: true },
        { name: '🆔 ID', value: target.id, inline: true },
        { name: '📅 Sunucuya Katılma', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: '📅 Hesap Oluşturma', value: `<t:${Math.floor(target.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '🎖️ Roller', value: roles }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }

  // ─── SÜRGÜN (KICK) ───
  if (commandName === 'surgun') {
    const target = options.getMember('uye');
    const sebep = options.getString('sebep') || 'Belirtilmedi';
    try {
      await target.kick(sebep);
      const embed = new EmbedBuilder()
        .setColor(0xFEE75C)
        .setTitle('🚫 Üye Sürgün Edildi')
        .setDescription(`**${target.user.tag}** kulüpten sürgün edildi.`)
        .addFields(
          { name: 'Sebep', value: sebep },
          { name: 'İşlemi Yapan', value: member.user.tag }
        )
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    } catch (e) {
      return interaction.reply({ content: `❌ Hata: ${e.message}`, ephemeral: true });
    }
  }

  // ─── KARA LİSTE (BAN) ───
  if (commandName === 'karaliste') {
    const target = options.getMember('uye');
    const sebep = options.getString('sebep') || 'Belirtilmedi';
    try {
      await target.ban({ reason: sebep });
      const embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle('⛔ Üye Kara Listeye Alındı')
        .setDescription(`**${target.user.tag}** kara listeye alındı (ban).`)
        .addFields(
          { name: 'Sebep', value: sebep },
          { name: 'İşlemi Yapan', value: member.user.tag }
        )
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    } catch (e) {
      return interaction.reply({ content: `❌ Hata: ${e.message}`, ephemeral: true });
    }
  }

  // ─── TEMİZLE / SİL ───
  if (commandName === 'temizle' || commandName === 'sil') {
    const sayi = options.getInteger('sayi');
    try {
      const deleted = await interaction.channel.bulkDelete(sayi, true);
      return interaction.reply({
        content: `🧹 **${deleted.size}** mesaj silindi.`,
        ephemeral: true
      });
    } catch (e) {
      return interaction.reply({ content: `❌ Hata: ${e.message}`, ephemeral: true });
    }
  }

  // ─── SATIŞ YAP ───
  if (commandName === 'satis-yap') {
    const musteri = options.getString('musteri');
    const urun = options.getString('urun');
    const adet = options.getInteger('adet');
    const toplam = options.getInteger('toplam_tutar');

    const embed = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle('💼 İLLEGAL TİCARET SATIŞ KAYDI')
      .addFields(
        { name: '👤 İşlemi Yapan', value: `${member.user.tag}`, inline: true },
        { name: '🤝 Alıcı / Çete', value: musteri, inline: true },
        { name: '📦 Ürün', value: `${adet}x ${urun}`, inline: true },
        { name: '💰 Toplam Tutar', value: `$${toplam.toLocaleString()}`, inline: true }
      )
      .setFooter({ text: 'The Lost MC — Ticaret Kayıt' })
      .setTimestamp();

    // Log kanalına gönder
    const logChannelId = process.env.LOG_CHANNEL_ID;
    if (logChannelId) {
      const logChannel = guild.channels.cache.get(logChannelId);
      if (logChannel) {
        logChannel.send({ embeds: [embed] });
      }
    }

    return interaction.reply({ content: '✅ Satış kaydı başarıyla loglandı.', embeds: [embed] });
  }

  // ─── SÜRÜŞ PLANLA ───
  if (commandName === 'surus-planla') {
    const rota = options.getString('rota');
    const saat = options.getString('saat');
    const detaylar = options.getString('detaylar') || 'Hız limiti ve sürüş düzenine uyulacaktır.';

    const embed = new EmbedBuilder()
      .setColor(0xE67E22)
      .setTitle('🏍️ TOPLU SÜRÜŞ PLANI')
      .setDescription(
        `> Kulüp üyeleri ve yelekliler için sürüş planlanmıştır.\n\n` +
        `📍 **Rota/Bitiş:** ${rota}\n` +
        `⏰ **Hareket Saati:** ${saat}\n\n` +
        `📝 **Detaylar:** ${detaylar}`
      )
      .setFooter({ text: `Planlayan: ${member.user.tag}` })
      .setTimestamp();

    await interaction.channel.send({ content: '@everyone', embeds: [embed] });
    return interaction.reply({ content: '✅ Sürüş planı başarıyla paylaşıldı.', ephemeral: true });
  }

  // ─── DİSİPLİN CEZASI ───
  if (commandName === 'disiplin-cezasi') {
    const target = options.getMember('uye');
    const ceza = options.getString('ceza');
    const sebep = options.getString('sebep');

    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setTitle('🦅 DİSİPLİN CEZASI KAYDI')
      .setDescription(`**${target.user.tag}** adlı üyeye Sergeant at Arms tarafından ceza verilmiştir.`)
      .addFields(
        { name: 'Cezalandırılan Üye', value: `<@${target.id}>`, inline: true },
        { name: 'Cezayı Veren', value: `${member.user.tag}`, inline: true },
        { name: '⚖️ Verilen Ceza', value: ceza, inline: false },
        { name: '📝 Sebep', value: sebep, inline: false }
      )
      .setTimestamp();

    // Log kanalına gönder
    const logChannelId = process.env.LOG_CHANNEL_ID;
    if (logChannelId) {
      const logChannel = guild.channels.cache.get(logChannelId);
      if (logChannel) {
        logChannel.send({ embeds: [embed] });
      }
    }

    return interaction.reply({ content: '✅ Disiplin cezası başarıyla loglandı.', embeds: [embed] });
  }

  // ─── KASA DURUM ───
  if (commandName === 'kasa-durum') {
    const data = readKasa();
    const embed = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle('💰 KULÜP KASASI BAKİYESİ')
      .setDescription(`Mevcut kasa bakiyesi: **$${data.bakiye.toLocaleString()}**`)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }

  // ─── KASA GÜNCELLE ───
  if (commandName === 'kasa-guncelle') {
    const tutar = options.getInteger('tutar');
    const islem = options.getString('islem_tipi');
    const aciklama = options.getString('aciklama');

    const data = readKasa();
    if (islem === 'gelir') {
      data.bakiye += tutar;
    } else {
      if (data.bakiye < tutar) {
        return interaction.reply({ content: `❌ Kasada yeterli para yok! Mevcut kasa: **$${data.bakiye.toLocaleString()}**`, ephemeral: true });
      }
      data.bakiye -= tutar;
    }

    data.islemler.push({
      tarih: new Date().toISOString(),
      yapan: member.user.tag,
      islem,
      tutar,
      aciklama
    });

    if (data.islemler.length > 50) data.islemler.shift();

    writeKasa(data);

    const embed = new EmbedBuilder()
      .setColor(islem === 'gelir' ? 0x57F287 : 0xED4245)
      .setTitle('💰 KULÜP KASASI GÜNCELLEME')
      .setDescription(`Kasa başarıyla güncellendi.`)
      .addFields(
        { name: 'İşlem Tipi', value: islem === 'gelir' ? '🟢 Gelir (Para Ekleme)' : '🔴 Gider (Para Çıkarma)', inline: true },
        { name: 'Tutar', value: `$${tutar.toLocaleString()}`, inline: true },
        { name: 'Açıklama', value: aciklama, inline: false },
        { name: 'Yeni Kasa Bakiyesi', value: `**$${data.bakiye.toLocaleString()}**`, inline: false }
      )
      .setTimestamp();

    // Log kanalına gönder
    const logChannelId = process.env.LOG_CHANNEL_ID;
    if (logChannelId) {
      const logChannel = guild.channels.cache.get(logChannelId);
      if (logChannel) {
        logChannel.send({ embeds: [embed] });
      }
    }

    return interaction.reply({ embeds: [embed] });
  }

  // ─── KASA PANEL KURMA ───
  if (commandName === 'kasa-panel-kur') {
    const embed = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle('💰 THE LOST MC — KASA YÖNETİM PANELİ')
      .setDescription(
        `> **Kulüp Kasası ve Finansal Yönergeler**\n\n` +
        `Kulüp kasasına para eklemek, bakiye sorgulamak veya para çekim kaydı oluşturmak için aşağıdaki butonları kullanabilirsiniz.\n\n` +
        `📋 **Finansal Kurallar:**\n` +
        `• **Kasa Yetkisi:** Kasa işlemleri yapma yetkisi sadece **Vault Keeper** (Kasa Sorumlusu) ve **High Command** (Üst Yönetim) üyelerine aittir. Yetkisiz müdahaleler ağır yaptırımlarla sonuçlanır.\n` +
        `• **Kayıt Zorunluluğu:** Kulüp adına yapılan tüm illegal ticaret (silah, uyuşturucu vb.) gelirleri ile harcamalar eksiksiz olarak kasaya işlenmelidir.\n` +
        `• **Açıklama Detayı:** Kasa işlemlerinde açıklama kısmına işlemi yapan kişinin adı, işlem nedeni ve paranın kaynağı net yazılmalıdır.\n\n` +
        `💵 *Güçlü bir kulüp, güçlü bir kasa ve sarsılmaz bir sadakatle ayakta kalır.*`
      )
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

    return interaction.reply({ embeds: [embed], components: [row] });
  }

  // ─── KURALLAR PANEL KURMA ───
  if (commandName === 'kurallar-kur') {
    const embedRules = new EmbedBuilder()
      .setColor(0x8B0000)
      .setTitle('💀 THE LOST MC — KULÜP ANA YASALARI')
      .setDescription(
        `• **Kardeşlik Esastır:** Kulüpte bulunan kişiler kardeştir ve katıldıkları üzere buna yemin etmişlerdir.\n` +
        `• **Görünüm ve Aidiyet:** Kulübe üye olan her kişi sırtında **Reaper dövmesi** bulundurmak zorundadır; kulübe uygun seçilmiş deri ceketlerden birini giymeli, daha çok siyah ağırlıklı giyinmeli ve kulübe tabii edilmiş motoru kullanmak zorundadır.\n` +
        `• **Görev Bilinci:** Herkes kendine verilen işi tamamlamak zorundadır.\n` +
        `• **Finans ve Toplantı:** Para vb. işler her pazar yapılan kulüp toplantısında konuşulur ve yaptığınız iş icabı paranız verilir.\n` +
        `• **Sivil ve Polis İlişkileri:** Los Santos'ta bulunan sivilleri soymak, masumlara zarar vermek ve polise ters yapıp olaysız yere zorluk çıkarmak yasaktır.\n` +
        `• **Uyuşturucu Yasakları:** Uyuşturucu işi ile uğraşmak, sivillere satmak, ağır uyuşturucu kullanmak yasaktır.\n` +
        `• **Church (Toplantı) Katılımı:** Belirtilen her pazar yapılacak olan toplantıya katılım göstermek zorunludur (saat durumlara göre değişmektedir).\n` +
        `• **Mertlik:** Motorcu merttir ve mert davranmalıdır, rolünüzle bunu kanıtlayın.\n` +
        `• **Birliktelik:** Hep beraber gezer, hep beraber yer içer, eğlenir ve çalışırız.\n` +
        `• **Anarşizm:** Genelde anarşist bir yol izleriz.\n\n` +
        `*Brothers for life.. LOST FOREVER.*`
      )
      .setFooter({ text: 'The Lost MC — Los Santos Chapter' })
      .setTimestamp();

    const embedFormation = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle('🏍️ THE LOST MC — TOPLU SÜRÜŞ VE FORMASYON DÜZENİ')
      .setDescription(
        `Toplu sürüşlerde kulübün disiplin ve hiyerarşisini korumak amacıyla fermuar düzeni uygulanır.\n\n` +
        `**Formasyon Şeması:**\n` +
        `\`\`\`text\n` +
        `         ▲ Ön (Yol Yönü)\n` +
        `         \n` +
        `         [ President ]\n` +
        `        /             \\\n` +
        `   [ Vice Pres ]    [ Sgt. At Arms ]\n` +
        `        |             |\n` +
        `    [ Member ]      [ Member ]\n` +
        `        |             |\n` +
        `    [ Member ]      [ Member ]\n` +
        `\`\`\`\n` +
        `**Sürüş Kuralları:**\n` +
        `1. **Konvoy Lideri (President):** Konvoyun en önünde yer alır, hızı ve rotayı belirler.\n` +
        `2. **Kanatlar (VP & Sgt. At Arms):** President'ın sağ ve sol arkasında koruma ve konvoy düzenini sağlar.\n` +
        `3. **Takip Düzeni (Members):** Diğer yelekliler ve adaylar konvoyu ikişerli sütun halinde, takip mesafesini koruyarak izler.\n` +
        `4. **Sollama Yasaktır:** Konvoy esnasında geçerli bir mazeret olmadıkça önünüzdeki kulüp üyesini sollamak kesinlikle yasaktır.`
      );

    await interaction.channel.send({ embeds: [embedRules, embedFormation] });
    return interaction.reply({ content: '✅ Kulüp kuralları ve sürüş düzeni paneli başarıyla kuruldu.', ephemeral: true });
  }

  // ─── KURULUM REHBERİ ───
  if (commandName === 'kurulum') {
    const embed = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle('⚙️ THE LOST MC — BOT KURULUM VE KANAL REHBERİ')
      .setDescription(
        `Botumuzun sorunsuz çalışması ve logların doğru odalara düşmesi için aşağıdaki adımları ve kanal eşleşmelerini takip edin:\n\n` +
        `### 📢 1. Kurallar ve Sürüş Düzeni\n` +
        `• **Kanal:** \`#rules\` veya \`#club-laws\`\n` +
        `• **Komut:** \`.kurallar-kur\` veya \`/kurallar-kur\`\n` +
        `• **Açıklama:** Kulübün yasal kurallarını ve toplu sürüş formasyon şemasını bu odaya sabitler.\n\n` +
        `### 📩 2. Destek Talebi (Ticket) Sistemi\n` +
        `• **Kanal:** \`#iletisim\` veya \`#the-gate\`\n` +
        `• **Komut:** \`.ticket-kur\` veya \`/ticket-kur\`\n` +
        `• **Açıklama:** Üyelerin destek talebi açabileceği butonu oluşturur. Açılan ticket'lar otomatik olarak \`TICKET_CATEGORY_ID\` kategorisi altında yeni oda olarak açılır.\n\n` +
        `### 📋 3. Mazeret Bildirim Sistemi\n` +
        `• **Kanal:** \`#mazeret-log\` dışında herhangi bir kanal (örn: \`#mazeret-bildir\`).\n` +
        `• **Komut:** \`.mazeret-kur\` veya \`/mazeret-kur\`\n` +
        `• **Açıklama:** Üyelerin mazeret formu doldurabileceği butonu oluşturur.\n` +
        `• **Akış & Loglar:**\n` +
        `  - Üye formu doldurduğunda mazeret detayları onay/red butonlarıyla birlikte **\`#mazeret-log\`** kanalına düşer.\n` +
        `  - Yetkili onay veya red butonuna bastığında, sonuç **\`#mazeret-sonuc\`** kanalında üyeyi etiketleyerek duyurulur ve üyeye DM gönderilir.\n\n` +
        `### 💰 4. Kasa Yönetim Sistemi\n` +
        `• **Kanal:** \`#moderator-only\` veya \`#vault-room\` (Sadece yetkililerin görebildiği oda)\n` +
        `• **Komut:** \`.kasa-panel-kur\` veya \`/kasa-panel-kur\`\n` +
        `• **Açıklama:** Kasa bakiyesi sorgulama, gelir ekleme ve gider çekme işlemlerini gerçekleştirmek için butonlu kasa yönetim panelini kurar.\n` +
        `• **Akış & Loglar:** Kasada yapılan tüm işlemler dekontlar halinde otomatik olarak **\`#lost-logs\`** kanalına gönderilir.\n\n` +
        `### 💼 5. Rol Yapma ve Kayıt Komutları\n` +
        `Herhangi bir kanalda kullanabilirsiniz, bot çıktısını otomatik olarak log odalarına gönderecektir:\n` +
        `• \`/satis-yap\` → Yapılan illegal uyuşturucu/silah ticaretini kaydeder. Kayıt otomatik olarak **\`#lost-logs\`** kanalına düşer.\n` +
        `• \`/disiplin-cezasi\` → Verilen cezaları kaydeder. Detaylar otomatik olarak **\`#lost-logs\`** kanalına düşer.\n` +
        `• \`/surus-planla\` → Konvoy planı oluşturur ve \`@everyone\` rolünü etiketleyerek duyuru geçer.\n\n` +
        `### 👑 6. Rütbe & Hiyerarşi Rehberi\n` +
        `• **Kanal:** \`#hierarchy\` veya \`#roles\`\n` +
        `• **Komut:** \`.hiyerarsi-kur\` veya \`/hiyerarsi-kur\`\n` +
        `• **Açıklama:** Kulüp hiyerarşisini, tüm rütbelerin anlamlarını ve Patched Member tanımını gönderir.\n\n` +
        `### 🗺️ 7. Kanal ve Log Akış Rehberi\n` +
        `• **Kanal:** \`#channel-guide\` veya \`#info\`\n` +
        `• **Komut:** \`.kanallar-kur\` veya \`/kanallar-kur\`\n` +
        `• **Açıklama:** Sunucudaki odaların hangi amaçla kullanılacağını ve hangi işlemin hangi log odasına düşeceğini gösteren rehberi yayınlar.`
      )
      .setFooter({ text: 'The Lost MC — Kurulum Kılavuzu' })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }

  // ─── HIYERARSI PANEL KURMA ───
  if (commandName === 'hiyerarsi-kur') {
    const embedHeader = new EmbedBuilder()
      .setColor(0x8B0000)
      .setTitle('💀 THE LOST MC — HİYERARŞİ VE RÜTBE DÜZENİ')
      .setDescription(
        `> **Kulüp Hiyerarşisi ve Sadakat Yönetmeliği**\n\n` +
        `The Lost Motorcycle Club içinde rütbeler, kulübe verilen emek, sadakat, cesaret ve kardeşlik bağı ile kazanılır. Aşağıda kulüp içi tüm rütbeler ve taşıdıkları anlamlar listelenmiştir.`
      )
      .addFields(
        {
          name: '👑 HIGH COMMAND (Üst Yönetim)',
          value: `• **President (Başkan):** Kulübün mutlak lideridir. Son söz ve kararlar ona aittir. Kulübü dışarıda temsil eder ve vizyonu belirler.\n` +
                 `• **Vice President (Başkan Yardımcısı):** President'ın sağ koludur. Başkanın olmadığı durumlarda kulübü yönetir ve operasyonları koordine eder.\n` +
                 `• **Sergeant at Arms (Sgt. At Arms):** Kulüp içi disiplini, güvenliği ve yasalara uyulmasını sağlar. Cezaları uygular ve üyelerin yelek/silah düzenini denetler.\n` +
                 `• **Road Captain (Yol Kaptanı):** Toplu sürüşlerde rotayı belirler, formasyon düzenini sağlar ve konvoy güvenliğini yönetir.\n` +
                 `• **Nomads (Göçebeler):** Kulübe bağlı ancak belirli bir şubeye bağlı kalmadan seyahat eden, doğrudan üst yönetime çalışan tecrübeli üyeler.`,
          inline: false
        },
        {
          name: '🛡️ CLUB OFFICERS (Kulüp Görevlileri)',
          value: `• **Roadbound Secretary (Yazıcı):** Kulüp toplantı kararlarını, resmi evrakları ve üye kayıtlarını tutar.\n` +
                 `• **Club Mom (Kulüp Annesi):** Clubhouse düzeninden, erzak tedariğinden ve bar yönetiminden sorumludur.\n` +
                 `• **Vault Keeper (Kasa Sorumlusu):** Kulüp kasasını ve illegal uyuşturucu/silah gelirlerinin kaydını tutar.\n` +
                 `• **Archivist (Arşivci):** Kulübün geçmişini, eski operasyon ve istihbarat belgelerini saklar.`,
          inline: false
        },
        {
          name: '⚔️ COMBAT UNITS (Muharebe ve Operasyon Birimleri)',
          value: `• **Rear Lance / War Captain / Iron Watch / Marked Executive / Death Net:** Kulübün özel operasyonel, çatışma ve bölge koruma ekipleridir. Illegal sevkiyatların güvenliğini sağlarlar.`,
          inline: false
        }
      )
      .setTimestamp();

    const embedPatched = new EmbedBuilder()
      .setColor(0x8B0000)
      .setTitle('🦅 YELEKLİ ÜYELER (PATCHED MEMBERS)')
      .setDescription(
        `> **🤔 PATCHED MEMBER (YELEKLİ ÜYE) NEDİR?**\n\n` +
        `**Patched Member (Yelekli Üye)**, kulübün tam ve resmi üyesidir. Adaylık (Prospect) sürecini başarıyla tamamlamış, sadakatini, cesaretini ve kulübe bağlılığını kanıtlayarak sırtında kulübün tam logosunu (**Reaper ve patch seti / colors**) taşımaya hak kazanmış kişidir. Kulüp içinde tam bir oy hakkına sahiptir ve diğer yeleklilerin resmi "kardeşi" (brother) olarak kabul edilir.\n\n` +
        `📋 **Yelekli Üyenin Hak ve Sorumlulukları:**\n` +
        `• **Church Katılımı:** Her pazar yapılan kulüp toplantılarına (Church) katılma ve kulüp kararlarında oy kullanma hakkına sahiptir.\n` +
        `• **Liderlik ve Denetim:** Adaylara (Prospects) emir verebilir, onları eğitebilir ve kulüp disiplinine uymalarını sağlayabilir.\n` +
        `• **Kardeşlik Bağı:** Diğer yelekli üyeleri korumak, kulüp sırlarını canı pahasına saklamak ve kulüp çıkarlarını her şeyin üstünde tutmakla yükümlüdür.\n` +
        `• **Görünüm:** Sırtındaki kulüp yamasını (colors) her zaman onurla taşımalı, kulüp motorunu kullanmalı ve kulüp tarzına uygun giyinmelidir.\n\n` +
        `🎖️ **Diğer Yelekli Dereceleri:**\n` +
        `• **Grave Historian:** Kulüp geleneklerini ve geçmişini koruyan tecrübeli yelekli.\n` +
        `• **Marked Brother:** Savaşta ve zorlu görevlerde rüştünü ispatlamış kıdemli kardeş.\n` +
        `• **Black Chaplain:** Kulübün manevi rehberi ve cenaze/bağlılık yeminlerini yöneten kişi.\n` +
        `• **MC Outlaws:** Kulüp içindeki kanunsuz sürüş ve aktif operasyon liderleri.`
      )
      .setTimestamp();

    const embedAdaylar = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle('🥚 ADAYLAR, SEMPATİZANLAR VE TİCARİ BİRİMLER')
      .addFields(
        {
          name: '👥 Adaylar & Sempatizanlar',
          value: `• **Prospect (Aday Üye):** Kulübe girmek ve yelek almak için kendini kanıtlamaya çalışan adaylar. Sırtlarında logo taşıyamazlar. Yeleklilerin emirlerini yerine getirir, clubhouse işlerini yapar ve sadakat testinden geçerler.\n` +
                 `• **Hang Around (Takılan):** Sempatizanlar, gözlemlenen ve henüz resmi aday sürecine kabul edilmemiş kişiler.\n` +
                 `• **Supporter Group:** Dışarıdan kulübe destek veren siviller.\n` +
                 `• **MC Trainee:** Sürüş ve temel kuralları öğrenmekte olan çaylaklar.\n` +
                 `• **Retired Member (Emekli Üye):** Kulübe uzun yıllar onuruyla hizmet etmiş ve emekliye ayrılmış eski yelekliler.`,
          inline: false
        },
        {
          name: '⚖️ Hukuk & İş Bölümü',
          value: `• **Club Lawyer / Legal Advisor:** Kulübün yasal süreçlerini yöneten avukatlar.\n` +
                 `• **Weapons / Drug Dealing / Materials Gather:** Kulübün uyuşturucu imalatı, silah ticareti ve hammadde toplama gibi illegal iş kollarını yürüten uzman kadrolar.`,
          inline: false
        }
      )
      .setFooter({ text: 'The Lost MC — Hierarchy & Roles' })
      .setTimestamp();

    await interaction.channel.send({ embeds: [embedHeader, embedPatched, embedAdaylar] });
    return interaction.reply({ content: '✅ Kulüp hiyerarşisi ve rütbe rehberi başarıyla kuruldu.', ephemeral: true });
  }

  // ─── KANAL REHBERİ KURMA ───
  if (commandName === 'kanallar-kur') {
    const embed = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle('🗺️ THE LOST MC — SUNUCU KANAL VE LOG REHBERİ')
      .setDescription(
        `Sunucumuzdaki odaların kullanım amaçları, hangi odada hangi komutların çalıştırılması gerektiği ve logların otomatik olarak hangi kanala düşeceği aşağıda detaylandırılmıştır:\n\n` +
        `### 📜 1. Kurallar ve Sürüş Düzeni (\`#rules\` / \`#club-laws\`)\n` +
        `• **Amaç:** Kulüp ana yasalarını ve toplu sürüş formasyon şemasını barındırır.\n` +
        `• **Kurulum Komutu:** \`/kurallar-kur\` veya \`.kurallar-kur\`\n\n` +
        `### 📩 2. Destek Talebi Sistemi (\`#iletisim\` / \`#the-gate\`)\n` +
        `• **Amaç:** Üyelerin yönetimle özel görüşme başlatabileceği destek butonu yer alır. Açılan ticket'lar otomatik olarak \`TICKET_CATEGORY_ID\` kategorisi altında yeni oda olarak açılır.\n` +
        `• **Kurulum Komutu:** \`/ticket-kur\` veya \`.ticket-kur\`\n\n` +
        `### 📋 3. Mazeret Bildirim Sistemi\n` +
        `• **Mazeret Bildir (\`#mazeret-bildir\`):** Üyelerin mazeret formu doldurduğu butonu barındırır. (Komut: \`/mazeret-kur\`)\n` +
        `• **Mazeret Log (\`#mazeret-log\`):** Sadece yetkililerin görebildiği, onay/red butonlu mazeretlerin düştüğü odadır.\n` +
        `• **Mazeret Sonuç (\`#mazeret-sonuc\`):** Sonuçlanan mazeretlerin üyeler etiketlenerek ilan edildiği yerdir.\n\n` +
        `### 💰 4. Kasa Yönetim Sistemi (\`#vault-room\` / \`#moderator-only\`)\n` +
        `• **Amaç:** Yetkililerin bakiye sorgulayıp, para giriş/çıkışı ekleyebileceği butonlu kasa panelini barındırır. Sadece yetkililere açıktır.\n` +
        `• **Kurulum Komutu:** \`/kasa-panel-kur\` veya \`.kasa-panel-kur\`\n\n` +
        `### 📝 5. Bot Aktivite ve İşlem Logları (\`#lost-logs\`)\n` +
        `• **Amaç:** Aşağıdaki tüm işlemler bot tarafından otomatik olarak bu odaya dekont/log halinde gönderilir:\n` +
        `  - Uyuşturucu/Silah satışı yapıldığında: \`/satis-yap\`\n` +
        `  - Kasadan para çekildiğinde veya eklendiğinde: \`/kasa-guncelle\` veya Kasa Paneli butonları\n` +
        `  - Sergeant at Arms tarafından ceza girildiğinde: \`/disiplin-cezasi\`\n\n` +
        `### 👑 6. Rütbeler & Hiyerarşi (\`#hierarchy\` / \`#roles\`)\n` +
        `• **Amaç:** Kulüp rütbelerini ve Patched Member tanımını barındırır.\n` +
        `• **Kurulum Komutu:** \`/hiyerarsi-kur\` veya \`.hiyerarsi-kur\`\n\n` +
        `### 🗺️ 7. Kanal Rehberi (\`#channel-guide\` / \`#info\`)\n` +
        `• **Amaç:** Şu an okumakta olduğunuz kanal rehberini kurar.\n` +
        `• **Kurulum Komutu:** \`/kanallar-kur\` veya \`.kanallar-kur\``
      )
      .setFooter({ text: 'The Lost MC — Channel Guide' })
      .setTimestamp();

        await interaction.channel.send({ embeds: [embed] });
    return interaction.reply({ content: '✅ Sunucu kanal ve log rehberi başarıyla kuruldu.', ephemeral: true });
  }

  // ─── LORE (TARİHÇE) KURMA ───
  if (commandName === 'lore-kur') {
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
        'Alderney\'deki büyük savaşların ve Johnny Klebitz liderliğindeki efsanevi dönemin ardından, kulüp sınırlarını genişleterek Blaine County and Los Santos şubelerini (Chapters) kurmuştur.\n\n' +
        '**Misyonumuz:**\n' +
        'Bizler sadece bir motor kulübü değiliz. Biz bir aile, bir kardeşlik bağıyız. Los Santos sokaklarında kendi kurallarımızla yaşar, anarşiyi ve özgürlüğü savunuruz. Bize saygı duyanlara saygı duyar, yolumuza taş koyanları ise Reaper ile tanıştırırız.\n\n' +
        '*Lost Forever, Forever Lost...*'
      )
      .setTimestamp();

    await interaction.channel.send({ embeds: [embedHistory, embedChapter] });
    return interaction.reply({ content: '✅ Kulüp tarihçesi (lore) başarıyla kuruldu.', ephemeral: true });
  }

  // ─── HABER PANOSU KURMA ───
  if (commandName === 'haber-kur') {
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

    await interaction.channel.send({ embeds: [embed] });
    return interaction.reply({ content: '✅ Haber ve duyuru panosu başarıyla kuruldu.', ephemeral: true });
  }

  // ─── MÜTTEFİK (DİPLOMASİ) KURMA ───
  if (commandName === 'muttefik-kur') {
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

    await interaction.channel.send({ embeds: [embed] });
    return interaction.reply({ content: '✅ Diplomasi ve müttefiklik paneli başarıyla kuruldu.', ephemeral: true });
  }

  // ─── ENVANTER REHBERİ KURMA ───
  if (commandName === 'envanter-rehber-kur') {
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

    await interaction.channel.send({ embeds: [embed] });
    return interaction.reply({ content: '✅ Envanter ve ticaret rehberi paneli başarıyla kuruldu.', ephemeral: true });
  }
};