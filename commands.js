// ═══════════════════════════════════════════════════════
// THE LOST MC — SLASH KOMUTLARI
// ═══════════════════════════════════════════════════════
const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = [
  // ─── TICKET PANEL KURMA ───
  {
    data: {
      name: 'ticket-kur',
      description: '📩 Ticket (destek) panelini bu kanala kurar.',
      default_member_permissions: String(PermissionFlagsBits.Administrator)
    }
  },
  // ─── MAZERET PANEL KURMA ───
  {
    data: {
      name: 'mazeret-kur',
      description: '📋 Mazeret bildirim panelini bu kanala kurar.',
      default_member_permissions: String(PermissionFlagsBits.Administrator)
    }
  },
  // ─── RÜTBE VER ───
  {
    data: {
      name: 'rutbe-ver',
      description: '🎖️ Bir üyeye rütbe/rol verir.',
      default_member_permissions: String(PermissionFlagsBits.ManageRoles),
      options: [
        {
          name: 'uye',
          description: 'Rütbe verilecek üye',
          type: ApplicationCommandOptionType.User,
          required: true
        },
        {
          name: 'rol',
          description: 'Verilecek rol',
          type: ApplicationCommandOptionType.Role,
          required: true
        }
      ]
    }
  },
  // ─── RÜTBE AL ───
  {
    data: {
      name: 'rutbe-al',
      description: '🎖️ Bir üyeden rütbe/rol alır.',
      default_member_permissions: String(PermissionFlagsBits.ManageRoles),
      options: [
        {
          name: 'uye',
          description: 'Rütbe alınacak üye',
          type: ApplicationCommandOptionType.User,
          required: true
        },
        {
          name: 'rol',
          description: 'Alınacak rol',
          type: ApplicationCommandOptionType.Role,
          required: true
        }
      ]
    }
  },
  // ─── DUYURU ───
  {
    data: {
      name: 'duyuru',
      description: '📢 Kulüp duyurusu yapar.',
      default_member_permissions: String(PermissionFlagsBits.ManageMessages),
      options: [
        {
          name: 'baslik',
          description: 'Duyuru başlığı',
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: 'icerik',
          description: 'Duyuru içeriği',
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: 'etiket',
          description: 'Etiketlenecek rol (opsiyonel)',
          type: ApplicationCommandOptionType.Role,
          required: false
        }
      ]
    }
  },
  // ─── TOPLANTI ───
  {
    data: {
      name: 'toplanti',
      description: '🏛️ Kulüp toplantısı (Church) çağrısı yapar.',
      default_member_permissions: String(PermissionFlagsBits.ManageMessages),
      options: [
        {
          name: 'saat',
          description: 'Toplantı saati (ör: 21:00)',
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: 'konu',
          description: 'Toplantı konusu',
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    }
  },
  // ─── KADRO ───
  {
    data: {
      name: 'kadro',
      description: '📜 Kulüp kadrosunu rütbelere göre listeler.',
      default_member_permissions: String(PermissionFlagsBits.ManageMessages)
    }
  },
  // ─── ÜYE BİLGİ ───
  {
    data: {
      name: 'uye-bilgi',
      description: '🔍 Bir üyenin bilgilerini gösterir.',
      options: [
        {
          name: 'uye',
          description: 'Bilgileri görülecek üye',
          type: ApplicationCommandOptionType.User,
          required: true
        }
      ]
    }
  },
  // ─── SÜRGÜN (KICK) ───
  {
    data: {
      name: 'surgun',
      description: '🚫 Bir üyeyi kulüpten sürgün eder (kick).',
      default_member_permissions: String(PermissionFlagsBits.KickMembers),
      options: [
        {
          name: 'uye',
          description: 'Sürgün edilecek üye',
          type: ApplicationCommandOptionType.User,
          required: true
        },
        {
          name: 'sebep',
          description: 'Sürgün sebebi',
          type: ApplicationCommandOptionType.String,
          required: false
        }
      ]
    }
  },
  // ─── KARA LİSTE (BAN) ───
  {
    data: {
      name: 'karaliste',
      description: '⛔ Bir üyeyi kara listeye alır (ban).',
      default_member_permissions: String(PermissionFlagsBits.BanMembers),
      options: [
        {
          name: 'uye',
          description: 'Yasaklanacak üye',
          type: ApplicationCommandOptionType.User,
          required: true
        },
        {
          name: 'sebep',
          description: 'Yasaklama sebebi',
          type: ApplicationCommandOptionType.String,
          required: false
        }
      ]
    }
  },
  // ─── TEMİZLE ───
  {
    data: {
      name: 'temizle',
      description: '🧹 Belirtilen sayıda mesajı siler.',
      default_member_permissions: String(PermissionFlagsBits.ManageMessages),
      options: [
        {
          name: 'sayi',
          description: 'Silinecek mesaj sayısı (1-100)',
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 1,
          max_value: 100
        }
      ]
    }
  },
  // ─── SATIŞ YAP ───
  {
    data: {
      name: 'satis-yap',
      description: '💼 Illegal ticaret satışı kaydeder.',
      options: [
        {
          name: 'musteri',
          description: 'Müşteri adı / çetesi',
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: 'urun',
          description: 'Satılan ürün (örn: SNS Pistol, Kokain)',
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: 'adet',
          description: 'Satılan adet',
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 1
        },
        {
          name: 'toplam_tutar',
          description: 'Kazanılan toplam para ($)',
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 0
        }
      ]
    }
  },
  // ─── SÜRÜŞ PLANLA ───
  {
    data: {
      name: 'surus-planla',
      description: '🏍️ Toplu sürüş / rota planlaması yapar.',
      options: [
        {
          name: 'rota',
          description: 'Sürüş rotası / bitiş noktası',
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: 'saat',
          description: 'Sürüş saati (örn: 22:30)',
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: 'detaylar',
          description: 'Yol kuralları, hız limiti vb. ek detaylar',
          type: ApplicationCommandOptionType.String,
          required: false
        }
      ]
    }
  },
  // ─── DİSİPLİN CEZASI ───
  {
    data: {
      name: 'disiplin-cezasi',
      description: '🦅 Sergeant at Arms disiplin cezası kaydeder.',
      options: [
        {
          name: 'uye',
          description: 'Ceza alan kulüp üyesi',
          type: ApplicationCommandOptionType.User,
          required: true
        },
        {
          name: 'ceza',
          description: 'Verilen ceza (örn: Prospect temizlik cezası, yelek uzaklaştırma)',
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: 'sebep',
          description: 'Cezanın sebebi',
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    }
  },
  // ─── KASA DURUM ───
  {
    data: {
      name: 'kasa-durum',
      description: '💰 Kulüp kasasındaki mevcut bakiyeyi sorgular.'
    }
  },
  // ─── KASA GÜNCELLE ───
  {
    data: {
      name: 'kasa-guncelle',
      description: '💰 Kulüp kasasına para ekler veya çıkarır.',
      options: [
        {
          name: 'tutar',
          description: 'İşlem yapılacak tutar ($)',
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 1
        },
        {
          name: 'islem_tipi',
          description: 'Yapılacak işlem',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: 'Gelir (Para Ekle)', value: 'gelir' },
            { name: 'Gider (Para Çıkar)', value: 'gider' }
          ]
        },
        {
          name: 'aciklama',
          description: 'Para giriş/çıkış sebebi',
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    }
  },
  // ─── SİL ───
  {
    data: {
      name: 'sil',
      description: '🧹 Belirtilen sayıda mesajı siler.',
      default_member_permissions: String(PermissionFlagsBits.ManageMessages),
      options: [
        {
          name: 'sayi',
          description: 'Silinecek mesaj sayısı (1-100)',
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 1,
          max_value: 100
        }
      ]
    }
  },
  // ─── KASA PANEL KURMA ───
  {
    data: {
      name: 'kasa-panel-kur',
      description: '💰 Kulüp kasa yönetim panelini bu kanala kurar.',
      default_member_permissions: String(PermissionFlagsBits.Administrator)
    }
  },
  // ─── KURALLAR PANEL KURMA ───
  {
    data: {
      name: 'kurallar-kur',
      description: '📜 Kulüp kurallarını ve sürüş düzenini bu kanala kurar.',
      default_member_permissions: String(PermissionFlagsBits.Administrator)
    }
  },
  // ─── KURULUM REHBERİ ───
  {
    data: {
      name: 'kurulum',
      description: '📖 Hangi komutun hangi kanalda kullanılacağını ve kurulum adımlarını gösterir.'
    }
  },
  // ─── HIYERARSI PANEL KURMA ───
  {
    data: {
      name: 'hiyerarsi-kur',
      description: '👑 Kulüp rütbelerini ve açıklamalarını (Yelekli Üye dahil) bu kanala kurar.',
      default_member_permissions: String(PermissionFlagsBits.Administrator)
    }
  },
  // ─── KANAL REHBERİ KURMA ───
  {
    data: {
      name: 'kanallar-kur',
      description: '🗺️ Hangi kanalın ne işe yaradığını ve logların nereye düştüğünü gösteren rehberi kurar.',
      default_member_permissions: String(PermissionFlagsBits.Administrator)
    }
  },
  // ─── LORE PANAL KURMA ───
  {
    data: {
      name: 'lore-kur',
      description: '🩸 Kulübün tarihçesini ve hikayesini bu kanala yazar.',
      default_member_permissions: String(PermissionFlagsBits.Administrator)
    }
  },
  // ─── HABER PANEL KURMA ───
  {
    data: {
      name: 'haber-kur',
      description: '📢 Kulüp duyuru panosu ve haberler rehberini bu kanala kurar.',
      default_member_permissions: String(PermissionFlagsBits.Administrator)
    }
  },
  // ─── MÜTTEFİK PANEL KURMA ───
  {
    data: {
      name: 'muttefik-kur',
      description: '🤝 Diplomasi ve müttefiklik kurallarını bu kanala kurar.',
      default_member_permissions: String(PermissionFlagsBits.Administrator)
    }
  },
  // ─── ENVANTER REHBERİ PANEL KURMA ───
  {
    data: {
      name: 'envanter-rehber-kur',
      description: '📦 Silah ve uyuşturucu envanter kuralları ile fiyatlarını kurar.',
      default_member_permissions: String(PermissionFlagsBits.Administrator)
    }
  }
];
