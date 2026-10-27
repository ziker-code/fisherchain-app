import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  ActivityIndicator 
} from 'react-native';
import { Send, ArrowLeft, Camera, Phone, MoreVertical } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function WASimulatorScreen({ route, navigation }) {
  const { addNewStock } = useApp();
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Halo Pak Nelayan! Selamat datang di Bot Fisherchain.id. 🤝\n\nKirimkan foto ikan tangkapan Anda tepat di atas timbangan untuk pencatatan stok otomatis ke Koperasi.',
      time: '11:40',
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  
  const scrollViewRef = useRef();

  // Listen to autoStartCapture param from camera
  React.useEffect(() => {
    if (route?.params?.autoStartCapture) {
      // Clear route parameters so it doesn't trigger on every re-mount
      route.params.autoStartCapture = false;
      handleSendImage();
    }
  }, [route?.params?.autoStartCapture]);

  const handleSendImage = () => {
    // 1. Add user image message with a very clear local raw fish photo
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      image: require('../assets/kakap.jpg'),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setShowOptions(false);
    setIsProcessing(true);

    // 2. Simulate AI Processing (CV and OCR)
    setTimeout(() => {
      setIsProcessing(false);
      
      const botResponse = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '🤖 *AI DETEKSI HASIL TANGKAPAN*\n\n• Jenis Ikan: *Kakap Merah*\n• Berat Timbangan: *12.5 kg*\n\nApakah data tangkapan di atas sudah benar?\n\nBalas *YA* untuk konfirmasi atau *TIDAK* untuk foto ulang.',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isConfirmation: true
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 2500);
  };

  const handleConfirmation = (confirm) => {
    const userReply = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: confirm ? 'YA' : 'TIDAK',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userReply]);

    setTimeout(() => {
      if (confirm) {
        // Add new fish stock dynamically to global AppContext state
        const newProductObj = {
          id: `new-${Date.now()}`,
          name: 'Kakap Merah Premium',
          price: 85000,
          originalPrice: 95000,
          unit: 'kg',
          rating: 5.0,
          reviews: 1,
          koperasi: 'Koperasi Nelayan Indramayu',
          verified: true,
          location: 'Karangsong, Indramayu',
          image: require('../assets/kakap.jpg'),
          description: 'Kakap merah segar hasil timbangan digital otomatis 12.5 kg dari Nelayan Pak Ahmad via WhatsApp Bot.',
          nelayan: 'Nelayan Pak Ahmad',
          tanggalTangkap: 'Hari Ini',
          tpi: 'TPI Karangsong',
          tempC: '2°C',
          storageTime: '0 jam',
          avgTemp: '1.5°C',
          category: 'Kakap'
        };

        addNewStock(newProductObj);

        const successResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: '✅ *PENCATATAN SUKSES!*\n\nData stok *Kakap Merah 12.5 kg* telah masuk ke Koperasi Nelayan Indramayu & Database Agregat Nasional KNMP.\n\n📈 *INFO HARGA (Price Intelligence)*:\nHarga Kakap Merah di TPI Karangsong hari ini naik 12% menjadi *Rp 85.000/kg*!',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, successResponse]);
      } else {
        const cancelResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Pencatatan dibatalkan. Silakan kirim ulang foto timbangan ikan tangkapan Anda dengan pencahayaan yang jelas.',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, cancelResponse]);
        setShowOptions(true);
      }
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* WhatsApp Header bar */}
      <View style={styles.chatHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={{ marginRight: 8, padding: 4 }}
            onPress={() => navigation.replace('Login')}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>FC</Text>
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.profileMeta}>
            <Text style={styles.profileName}>Fisherchain.id Bot</Text>
            <Text style={styles.profileStatus}>Online (AI Agent)</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Phone size={18} color={COLORS.white} style={{ marginRight: 16 }} />
          <MoreVertical size={18} color={COLORS.white} />
        </View>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView 
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        style={styles.chatArea}
        contentContainerStyle={{ paddingVertical: 16 }}
      >
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          
          return (
            <View key={msg.id} style={[
              styles.messageBubble,
              isBot ? styles.botBubble : styles.userBubble
            ]}>
              {msg.image && (
                <Image source={typeof msg.image === 'string' && (msg.image.startsWith('http') || msg.image.startsWith('https')) ? { uri: msg.image } : msg.image} style={styles.messageImage} />
              )}
              
              {msg.text && (
                <Text style={[
                  styles.messageText,
                  { color: isBot ? COLORS.textPrimary : COLORS.white }
                ]}>
                  {msg.text}
                </Text>
              )}
              
              <Text style={[
                styles.messageTime,
                { color: isBot ? COLORS.textSecondary : 'rgba(255,255,255,0.7)' }
              ]}>
                {msg.time}
              </Text>

              {/* Bot Confirmation Buttons Inline */}
              {isBot && msg.isConfirmation && (
                <View style={styles.confirmRow}>
                  <TouchableOpacity 
                    style={[styles.confirmBtn, styles.btnYes]}
                    onPress={() => handleConfirmation(true)}
                  >
                    <Text style={styles.btnTextYes}>YA (Simpan)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.confirmBtn, styles.btnNo]}
                    onPress={() => handleConfirmation(false)}
                  >
                    <Text style={styles.btnTextNo}>TIDAK</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {isProcessing && (
          <View style={[styles.messageBubble, styles.botBubble, styles.loadingBubble]}>
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={styles.loadingText}>AI sedang membaca jenis ikan & timbangan...</Text>
          </View>
        )}
      </ScrollView>

      {/* WhatsApp Input options */}
      <View style={styles.chatInputContainer}>
        {showOptions ? (
          <TouchableOpacity 
            style={styles.cameraActionBtn}
            onPress={handleSendImage}
            activeOpacity={0.8}
          >
            <Camera size={20} color={COLORS.white} style={{ marginRight: 8 }} />
            <Text style={styles.cameraActionText}>Kirim Foto Tangkapan (AI Capture)</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.disabledInputRow}>
            <Text style={styles.disabledInputText}>Pilih respon di atas...</Text>
            <TouchableOpacity style={styles.sendIconBtn} disabled>
              <Send size={18} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ECE5DD', // Classic WhatsApp background gray
  },
  chatHeader: {
    height: 60,
    backgroundColor: '#075E54', // Classic WhatsApp dark green
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    color: '#075E54',
    fontWeight: 'bold',
    fontSize: 14,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
    borderWidth: 1.5,
    borderColor: '#075E54',
  },
  profileMeta: {
    marginLeft: 10,
  },
  profileName: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  profileStatus: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  botBubble: {
    backgroundColor: COLORS.white,
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  userBubble: {
    backgroundColor: '#DCF8C6', // Classic WhatsApp green bubble
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  messageImage: {
    width: 220,
    height: 150,
    borderRadius: 8,
    marginBottom: 6,
    resizeMode: 'cover',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 19,
  },
  messageTime: {
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  confirmRow: {
    flexDirection: 'row',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  confirmBtn: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  btnYes: {
    backgroundColor: COLORS.primary,
  },
  btnTextYes: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  btnNo: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnTextNo: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  chatInputContainer: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraActionBtn: {
    flex: 1,
    backgroundColor: '#128C7E', // WhatsApp accent green
    height: 46,
    borderRadius: 23,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraActionText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  disabledInputRow: {
    flex: 1,
    backgroundColor: COLORS.white,
    height: 42,
    borderRadius: 21,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledInputText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontStyle: 'italic',
  },
  sendIconBtn: {
    padding: 4,
  },
});
