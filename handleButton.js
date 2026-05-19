// ═══════════════════════════════════════════════════════
// THE LOST MC — BUTON İŞLEYİCİ (HANDLE BUTTON)
// ═══════════════════════════════════════════════════════
const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder,
  ButtonStyle, ModalBuilder, TextInputBuilder,
  TextInputStyle, ChannelType, PermissionFlagsBits
} = require('discord.js');

module.exports = async function handleButton(interaction) {
  const { customId, guild, member } = interaction;

  // ─── IC İSİM KABUL ET / REDDET ───
  if (customId.startsWith('ic_isim_approve_')) {
    const parts = customId.split('_');
    const targetUserId = parts[3];
    const targetName = parts.slice(4).join('_');
    
    // Yetki kontrolü
    if (!member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return interaction.reply({ content: '❌ Bu işlemi yapmak için yetkiniz yok.', ephemeral: true });
    }

    try {
      const targetMember = await guild.members.fetch(targetUserId);
      if (targetMember) {
        await targetMember.setNickname(targetName);
        await targetMember.send(`✅ **IC İsim Talebiniz Onaylandı!** Yeni isminiz: \`${targetName}\``).catch(() => {});
        await interaction.update({ content: `✅ <@${targetUserId}> adlı kullanıcının ismi **${targetName}** olarak ayarlandı. (Onaylayan: <@${member.id}>)`, embeds: [], components: [] });
      }
    } catch (e) {
      console.error(e);
      return interaction.reply({ content: '❌ İsim değiştirilirken bir hata oluştu. (Rolüm bu kullanıcının üstünde olmayabilir)', ephemeral: true });
    }
    return;
  }

  if (customId.startsWith('ic_isim_reject_')) {
    const parts = customId.split('_');
    const targetUserId = parts[3];
    
    if (!member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return interaction.reply({ content: '❌ Bu işlemi yapmak için yetkiniz yok.', ephemeral: true });
    }

    try {
      const targetMember = await guild.members.fetch(targetUserId);
      if (targetMember) {
        await targetMember.send(`❌ **IC İsim Talebiniz Reddedildi!** Lütfen kurallara uygun geçerli bir isim belirleyip tekrar talep gönderin.`).catch(() => {});
      }
      await interaction.update({ content: `❌ <@${targetUserId}> kullanıcısının IC İsim talebi reddedildi. (Reddeden: <@${member.id}>)`, embeds: [], components: [] });
    } catch (e) {
      console.error(e);
    }
    return;
  }

  // ─── TICKET OLUŞTUR ───
  if (customId === 'ticket_create') {
    // Aynı kişinin açık ticketı var mı kontrol et
    const existing = guild.channels.cache.find(
      ch => ch.name === `ticket-${member.user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`
    );
    if (existing) {
      return interaction.reply({
        content: `❌ Zaten açık bir ticket'ın var: <#${existing.id}>`,
        ephemeral: true
      });
    }

    const categoryId = process.env.TICKET_CATEGORY_ID;
    const staffRoleId = process.env.STAFF_ROLE_ID;

    // Yetki ayarları
    const permissionOverwrites = [
      {
        id: guild.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: member.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory
        ]
      }
    ];

    // Staff rolü varsa onu da ekle
    if (staffRoleId) {
      permissionOverwrites.push({
        id: staffRoleId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory
        ]
      });
    }

    try {
      const channelOptions = {
        name: `ticket-${member.user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        type: ChannelType.GuildText,
        permissionOverwrites
      };

      if (categoryId) {
        channelOptions.parent = categoryId;
      }

      const ticketChannel = await guild.channels.create(channelOptions);

      const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('⛓️ THE LOST MC — DESTEK TALEBİ')
        .setDescription(
          `> Ticket açıldı.\n\n` +
          `🏍️ **Açan:** <@${member.id}>\n\n` +
          `Sorununu buraya yaz, yetkili en kısa sürede ilgilenecek.\n` +
          `İşin bittiğinde aşağıdaki butona basarak ticket'ı kapatabilirsin.`
        )
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ticket_close')
          .setLabel('🔒 Ticket Kapat')
          .setStyle(ButtonStyle.Danger)
      );

      await ticketChannel.send({
        content: staffRoleId ? `<@&${staffRoleId}>` : '',
        embeds: [embed],
        components: [row]
      });

      return interaction.reply({
        content: `✅ Ticket oluşturuldu: <#${ticketChannel.id}>`,
        ephemeral: true
      });
    } catch (e) {
      console.error('Ticket oluşturma hatası:', e);
      return interaction.reply({
        content: `❌ Ticket oluşturulamadı: ${e.message}`,
        ephemeral: true
      });
    }
  }

  // ─── TICKET KAPAT ───
  if (customId === 'ticket_close') {
    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setTitle('🔒 Ticket Kapatılıyor')
      .setDescription(
        `Bu ticket **${member.user.tag}** tarafından kapatıldı.\n` +
        `Kanal 5 saniye içinde silinecek.`
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    setTimeout(async () => {
      try {
        await interaction.channel.delete();
      } catch (e) {
        console.error('Ticket silme hatası:', e);
      }
    }, 5000);
    return;
  }

  // ─── MAZERET FORM AÇMA ───
  if (customId === 'mazeret_form') {
    const modal = new ModalBuilder()
      .setCustomId('mazeret_submit')
      .setTitle('📋 Mazeret Bildirim Formu');

    const isimInput = new TextInputBuilder()
      .setCustomId('mazeret_isim')
      .setLabel('IC İsim / Kulüp İçi İsim')
      .setPlaceholder('Örn: Johnny Klebitz')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const tarihInput = new TextInputBuilder()
      .setCustomId('mazeret_tarih')
      .setLabel('Mazeret Tarihi / Süresi')
      .setPlaceholder('Örn: 20.05.2026 - 25.05.2026')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const sebepInput = new TextInputBuilder()
      .setCustomId('mazeret_sebep')
      .setLabel('Mazeret Sebebi')
      .setPlaceholder('Mazeretinizi detaylı açıklayın...')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const notInput = new TextInputBuilder()
      .setCustomId('mazeret_not')
      .setLabel('Ek Not (Opsiyonel)')
      .setPlaceholder('Eklemek istediğiniz bir not varsa yazın...')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    modal.addComponents(
      new (require('discord.js').ActionRowBuilder)().addComponents(isimInput),
      new (require('discord.js').ActionRowBuilder)().addComponents(tarihInput),
      new (require('discord.js').ActionRowBuilder)().addComponents(sebepInput),
      new (require('discord.js').ActionRowBuilder)().addComponents(notInput)
    );

    return interaction.showModal(modal);
  }

  // ─── MAZERET ONAY / RED ───
  if (customId.startsWith('mazeret_approve_') || customId.startsWith('mazeret_reject_')) {
    const isApprove = customId.startsWith('mazeret_approve_');
    const targetUserId = customId.split('_')[2];
    
    // Yetki Kontrolü
    const staffRoleId = process.env.STAFF_ROLE_ID;
    const isStaff = staffRoleId && member.roles.cache.has(staffRoleId);
    const isAdmin = member.permissions.has(PermissionFlagsBits.Administrator);
    
    if (!isStaff && !isAdmin) {
      return interaction.reply({
        content: '❌ Bu işlemi gerçekleştirmek için yetkiniz yok!',
        ephemeral: true
      });
    }

    // Embed'i güncelle
    const originalEmbed = interaction.message.embeds[0];
    if (!originalEmbed) return;

    const newEmbed = EmbedBuilder.from(originalEmbed)
      .setColor(isApprove ? 0x57F287 : 0xED4245)
      .addFields(
        { 
          name: 'Değerlendirme', 
          value: isApprove 
            ? `🟢 **ONAYLANDI** (Onaylayan: <@${member.id}>)` 
            : `🔴 **REDDEDİLDİ** (Reddeden: <@${member.id}>)`, 
          inline: false 
        }
      );

    // Butonları devre dışı bırak
    const disabledRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`mazeret_approved_done`)
        .setLabel(isApprove ? '🟢 Onaylandı' : 'Onaylandı')
        .setStyle(ButtonStyle.Success)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId(`mazeret_rejected_done`)
        .setLabel(isApprove ? 'Reddet' : '🔴 Reddedildi')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true)
    );

    await interaction.update({ embeds: [newEmbed], components: [disabledRow] });

    // Sonuç kanalına gönder
    let statusMessage = "";
    try {
      const sonucChannelId = process.env.MAZERET_SONUC_CHANNEL_ID;
      const sonucChannel = guild.channels.cache.get(sonucChannelId);
      
      if (sonucChannel) {
        const textMsg = isApprove
          ? `Merhaba <@${targetUserId}>, **The Lost MC** sunucusundaki izin talebiniz **ONAYLANDI**. (Onaylayan: <@${member.id}>)`
          : `Merhaba <@${targetUserId}>, **The Lost MC** sunucusundaki izin talebiniz **REDDEDİLDİ**. (Reddeden: <@${member.id}>)`;
        
        await sonucChannel.send({ content: textMsg });
        statusMessage = `📢 Sonuç <#${sonucChannelId}> kanalında yayınlandı.`;
      } else {
        statusMessage = "⚠️ Mazeret sonuç bildirim kanalı bulunamadı!";
      }
    } catch (e) {
      console.error('Sonuç kanalına mesaj gönderilemedi:', e.message);
      statusMessage = `⚠️ Sonuç bildirilemedi! (Sebep: ${e.message})`;
    }

    // Durumu embed'e ekleyip mesajı tekrar güncelle
    const updatedEmbed = EmbedBuilder.from(newEmbed)
      .addFields({ name: 'Bildirim Durumu', value: statusMessage, inline: false });

    await interaction.editReply({ embeds: [updatedEmbed] });
  }

  // ─── IC İSİM ONAY / RED ───
  if (customId.startsWith('ic_isim_approve_') || customId.startsWith('ic_isim_reject_')) {
    const isApprove = customId.startsWith('ic_isim_approve_');
    const parts = customId.split('_');
    const targetUserId = parts[3];
    const icName = parts.slice(4).join('_');
    
    // Yetki Kontrolü
    const staffRoleId = process.env.STAFF_ROLE_ID;
    const isStaff = staffRoleId && member.roles.cache.has(staffRoleId);
    const isAdmin = member.permissions.has(PermissionFlagsBits.Administrator);
    
    if (!isStaff && !isAdmin) {
      return interaction.reply({
        content: '❌ Bu işlemi gerçekleştirmek için yetkiniz yok!',
        ephemeral: true
      });
    }

    const originalEmbed = interaction.message.embeds[0];
    if (!originalEmbed) return;

    let targetMember;
    try {
      targetMember = await guild.members.fetch(targetUserId);
    } catch (e) {
      console.error('İsim değişikliği için hedef üye bulunamadı:', e.message);
    }

    let statusMsg = "";
    if (isApprove) {
      if (targetMember) {
        try {
          await targetMember.setNickname(icName);
          statusMsg = `🟢 **KABUL EDİLDİ & İSİM DEĞİŞTİRİLDİ**\n> **Değiştiren Yetkili:** <@${member.id}>\n> **Yeni İsim:** \`${icName}\``;
          
          await targetMember.send({
            content: `🔊 **The Lost MC:** IC isim talebiniz onaylandı ve sunucu takma adınız **${icName}** olarak güncellendi!`
          }).catch(() => {});
        } catch (e) {
          console.error('Kullanıcı adı değiştirme hatası:', e.message);
          statusMsg = `🟢 **KABUL EDİLDİ (İsim yetki yetersizliğinden otomatik değiştirilemedi)**\n> **Yetkili:** <@${member.id}>\n> **Hata:** \`${e.message}\` (Lütfen ismi elle \`${icName}\` yapın)`;
          
          await targetMember.send({
            content: `🔊 **The Lost MC:** IC isim talebiniz onaylandı! Ancak bot yetki sırasından dolayı adınızı otomatik değiştiremedi, yetkililer elle güncelleyecektir.`
          }).catch(() => {});
        }
      } else {
        statusMsg = `🟢 **KABUL EDİLDİ (Kullanıcı sunucudan ayrılmış)**\n> **Yetkili:** <@${member.id}>`;
      }
    } else {
      statusMsg = `🔴 **REDDEDİLDİ**\n> **Reddeden Yetkili:** <@${member.id}>`;
      if (targetMember) {
        await targetMember.send({
          content: `🔊 **The Lost MC:** IC isim talebiniz reddedildi.`
        }).catch(() => {});
      }
    }

    const newEmbed = EmbedBuilder.from(originalEmbed)
      .setColor(isApprove ? 0x57F287 : 0xED4245)
      .addFields(
        { 
          name: 'Değerlendirme Sonucu', 
          value: statusMsg, 
          inline: false 
        }
      );

    const disabledRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`ic_isim_approved_done`)
        .setLabel(isApprove ? '🟢 Kabul Edildi' : 'Kabul Et')
        .setStyle(ButtonStyle.Success)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId(`ic_isim_rejected_done`)
        .setLabel(isApprove ? 'Reddet' : '🔴 Reddedildi')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true)
    );

    return await interaction.update({ embeds: [newEmbed], components: [disabledRow] });
  }

  // ─── KASA BAKİYE SORGULA ───
  if (customId === 'kasa_bakiye_sor') {
    // Yetki Kontrolü
    const staffRoleId = process.env.STAFF_ROLE_ID;
    const isStaff = staffRoleId && member.roles.cache.has(staffRoleId);
    const isAdmin = member.permissions.has(PermissionFlagsBits.Administrator);
    
    if (!isStaff && !isAdmin) {
      return interaction.reply({
        content: '❌ Kasa bakiyesini sorgulamak için yetkiniz yok!',
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

    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle('💰 KULÜP KASASI BAKİYESİ')
      .setDescription(`Kulüp kasasındaki güncel bakiye: **$${data.bakiye.toLocaleString()}**`)
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // ─── KASA PARA EKLE (GELİR) / PARA ÇEK (GİDER) MODAL AÇMA ───
  if (customId === 'kasa_gelir_ekle' || customId === 'kasa_gider_cek') {
    const isGelir = customId === 'kasa_gelir_ekle';
    
    // Yetki Kontrolü
    const staffRoleId = process.env.STAFF_ROLE_ID;
    const isStaff = staffRoleId && member.roles.cache.has(staffRoleId);
    const isAdmin = member.permissions.has(PermissionFlagsBits.Administrator);
    
    if (!isStaff && !isAdmin) {
      return interaction.reply({
        content: `❌ Kasa işlemi gerçekleştirmek için yetkiniz yok!`,
        ephemeral: true
      });
    }

    const modal = new ModalBuilder()
      .setCustomId(isGelir ? 'kasa_gelir_submit' : 'kasa_gider_submit')
      .setTitle(isGelir ? '💰 Kasa Para Ekle (Gelir)' : '💰 Kasa Para Çek (Gider)');

    const tutarInput = new TextInputBuilder()
      .setCustomId('kasa_tutar')
      .setLabel('Tutar ($)')
      .setPlaceholder('Örn: 50000 (Sadece sayı girin)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const aciklamaInput = new TextInputBuilder()
      .setCustomId('kasa_aciklama')
      .setLabel('İşlem Açıklaması / Detaylar')
      .setPlaceholder(isGelir ? 'Örn: Silah satışı geliri' : 'Örn: Üye ödemeleri, motor bakımı')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(tutarInput),
      new ActionRowBuilder().addComponents(aciklamaInput)
    );

    return interaction.showModal(modal);
  }
};
