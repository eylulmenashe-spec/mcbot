// ═══════════════════════════════════════════════════════
// THE LOST MC — MODAL İŞLEYİCİ (HANDLE MODAL)
// ═══════════════════════════════════════════════════════
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async function handleModal(interaction) {
  const { customId, member, guild } = interaction;

  // ─── MAZERET FORMU SUBMIT ───
  if (customId === 'mazeret_submit') {
    const isim = interaction.fields.getTextInputValue('mazeret_isim');
    const tarih = interaction.fields.getTextInputValue('mazeret_tarih');
    const sebep = interaction.fields.getTextInputValue('mazeret_sebep');
    const not = interaction.fields.getTextInputValue('mazeret_not') || 'Yok';

    // Kullanıcıya onay mesajı
    await interaction.reply({
      content: '✅ Mazeret bildiriminiz başarıyla iletildi. Yönetim en kısa sürede değerlendirecektir.',
      ephemeral: true
    });

    // Log kanalına gönder
    const logChannelId = process.env.MAZERET_LOG_CHANNEL_ID || process.env.LOG_CHANNEL_ID;
    if (!logChannelId) return;

    const logChannel = guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle('📋 YENİ MAZERET BİLDİRİMİ')
      .setThumbnail(member.user.displayAvatarURL({ size: 128 }))
      .addFields(
        { name: '👤 Discord', value: `<@${member.id}> (${member.user.tag})`, inline: true },
        { name: '📛 IC İsim', value: isim, inline: true },
        { name: '📅 Tarih / Süre', value: tarih, inline: false },
        { name: '📝 Sebep', value: sebep, inline: false },
        { name: '💬 Ek Not', value: not, inline: false }
      )
      .setFooter({ text: 'The Lost MC — Mazeret Sistemi' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`mazeret_approve_${member.id}`)
        .setLabel('🟢 Onayla')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`mazeret_reject_${member.id}`)
        .setLabel('🔴 Reddet')
        .setStyle(ButtonStyle.Danger)
    );

    logChannel.send({ embeds: [embed], components: [row] });
  }

  // ─── KASA GELİR / GİDER SUBMIT ───
  if (customId === 'kasa_gelir_submit' || customId === 'kasa_gider_submit') {
    const isGelir = customId === 'kasa_gelir_submit';
    const tutarStr = interaction.fields.getTextInputValue('kasa_tutar');
    const aciklama = interaction.fields.getTextInputValue('kasa_aciklama');

    const tutar = parseInt(tutarStr.replace(/[^0-9]/g, ''));
    if (isNaN(tutar) || tutar <= 0) {
      return interaction.reply({
        content: '❌ Lütfen geçerli bir sayısal tutar girin!',
        ephemeral: true
      });
    }

    const fs = require('fs');
    const path = require('path');
    const kasaPath = path.join(__dirname, 'kasa.json');

    let data = { bakiye: 0 };
    if (fs.existsSync(kasaPath)) {
      try {
        data = JSON.parse(fs.readFileSync(kasaPath, 'utf8'));
      } catch (e) {}
    }

    if (!isGelir && data.bakiye < tutar) {
      return interaction.reply({
        content: `❌ Yetersiz bakiye! Kasada sadece **$${data.bakiye.toLocaleString()}** bulunuyor.`,
        ephemeral: true
      });
    }

    if (isGelir) {
      data.bakiye += tutar;
    } else {
      data.bakiye -= tutar;
    }

    fs.writeFileSync(kasaPath, JSON.stringify(data, null, 2), 'utf8');

    const embed = new EmbedBuilder()
      .setColor(isGelir ? 0x57F287 : 0xED4245)
      .setTitle('💰 KULÜP KASASI GÜNCELLEME')
      .setDescription(`Kasa başarıyla güncellendi.`)
      .addFields(
        { name: 'İşlem Tipi', value: isGelir ? '🟢 Gelir (Para Ekleme)' : '🔴 Gider (Para Çıkarma)', inline: true },
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

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
