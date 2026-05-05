import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Search, Menu, 
  Phone, Mail, MapPin, ChevronRight, FileText, 
  Briefcase, HeartPulse, Loader2
} from 'lucide-react';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Halo! Saya JemberBot. Mengusung semangat "Semua Karena Cinta", saya siap melayani informasi publik Kabupaten Jember untuk Anda. Ada yang bisa saya bantu hari ini?' 
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

  const fetchGeminiResponse = async (userText) => {

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const systemPrompt = `Anda adalah JemberBot, asisten virtual resmi Pemerintah Kabupaten Jember. 
    Selalu bersikap ramah, hangat, dan sangat sopan. Jargon Kabupaten Jember adalah "Semua Karena Cinta". 
    Bantu warga dengan informasi layanan publik (KTP, KK, Izin Usaha, Bantuan Sosial, Kesehatan). 
    Jawablah dengan singkat, padat, dan jelas.`;

    const conversationHistory = messages.map(m => `${m.sender === 'user' ? 'Warga' : 'JemberBot'}: ${m.text}`).join('\n');

    const payload = {
      contents: [{ 
        parts: [{ 
          text: `${systemPrompt}\n\nRiwayat Percakapan:\n${conversationHistory}\n\nWarga: ${userText}\nJemberBot:` 
        }] 
      }]
    };

    const fetchWithRetry = async (retries = 2, delay = 1000) => {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.error?.message || "";
          
          // Deteksi error kuota / token habis
          if (errorMessage.toLowerCase().includes("quota") || response.status === 429) {
            throw new Error("QUOTA_EXCEEDED");
          }
          
          throw new Error(errorMessage || 'Gagal terhubung.');
        }
        
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, bisa diulangi?";
      } catch (error) {
        // Pesan khusus jika kuota habis
        if (error.message === "QUOTA_EXCEEDED") {
          return "Aduh, sepertinya JemberBot sedang sangat sibuk melayani banyak warga saat ini. Mohon tunggu beberapa saat lagi ya, Semua Karena Cinta! 🌹";
        }

        if (retries > 0) {
          await new Promise(res => setTimeout(res, delay));
          return fetchWithRetry(retries - 1, delay * 2);
        }
        return `[SISTEM]: ${error.message}.`;
      }
    };

    return await fetchWithRetry();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputText('');
    setIsLoading(true);

    const botResponse = await fetchGeminiResponse(userMessage);
    
    setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      <div className="bg-rose-900 text-rose-100 text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p>Bersama mewujudkan Jember yang lebih baik. Semua Karena Cinta.</p>
          <div className="flex space-x-4 font-bold tracking-widest text-[10px]">
            <span className="hover:text-white cursor-pointer uppercase">FB</span>
            <span className="hover:text-white cursor-pointer uppercase">IG</span>
            <span className="hover:text-white cursor-pointer uppercase">X</span>
            <span className="hover:text-white cursor-pointer uppercase">YT</span>
          </div>
        </div>
      </div>

      <header className="bg-white py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-14 h-14 overflow-hidden flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Logo Jember" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/60?text=JBR"; // Fallback jika logo belum ada
                }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-black text-rose-900 leading-tight tracking-tight uppercase">Kabupaten Jember</h1>
              <p className="text-sm font-semibold text-rose-500 italic">Semua Karena Cinta</p>
            </div>
          </div>

          <div className="hidden md:flex space-x-8 text-sm">
            <div className="flex items-center space-x-3">
              <Phone className="text-rose-600" size={24} />
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Call Center</p>
                <p className="font-bold text-gray-800">0811-3-11111-08</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="text-rose-600" size={24} />
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Email Us</p>
                <p className="font-bold text-gray-800">diskominfo@jemberkab.go.id</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="text-rose-600" size={24} />
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Lokasi Kami</p>
                <p className="font-bold text-gray-800">Jl. Dewi Sartika No.54</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-rose-700 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="hidden md:flex">
            <a href="#" className="px-5 py-4 font-bold text-xs tracking-widest bg-rose-800 hover:bg-rose-900 transition uppercase">Beranda</a>
            <a href="#" className="px-5 py-4 font-bold text-xs tracking-widest hover:bg-rose-600 transition uppercase">Profil Daerah</a>
            <a href="#" className="px-5 py-4 font-bold text-xs tracking-widest hover:bg-rose-600 transition flex items-center uppercase">Layanan Publik <ChevronRight size={14} className="ml-1 rotate-90"/></a>
            <a href="#" className="px-5 py-4 font-bold text-xs tracking-widest hover:bg-rose-600 transition uppercase">Berita</a>
            <a href="#" className="px-5 py-4 font-bold text-xs tracking-widest hover:bg-rose-600 transition uppercase">Transparansi</a>
          </div>
          <div className="md:hidden py-3">
            <button className="flex items-center space-x-2 bg-rose-800 px-4 py-2 rounded font-bold text-xs">
              <Menu size={18} /> <span>MENU</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="relative">
        <div className="h-[450px] overflow-hidden relative">
          <img 
            className="w-full h-full object-cover" 
            src="/bg-jember.jpg" 
            alt="Jember Background" 
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-rose-900/90 to-transparent"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-rose-300 font-bold tracking-widest mb-2 uppercase text-sm drop-shadow-md">Pelayanan Publik Prima</p>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight max-w-2xl uppercase drop-shadow-lg">
            Selamat Datang di<br/><span className="text-rose-400">Kabupaten Jember</span>
          </h2>
          <button className="bg-rose-600 text-white font-bold px-8 py-4 rounded hover:bg-rose-500 transition flex items-center self-start shadow-xl uppercase text-xs tracking-widest">
            Lihat Layanan Kami <ChevronRight size={18} className="ml-2" />
          </button>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 -mt-24 z-10 hidden md:block">
          <div className="grid grid-cols-3 gap-0 shadow-2xl overflow-hidden rounded-lg">
            <div className="bg-white/95 backdrop-blur-md p-8 text-rose-900 hover:bg-rose-600 hover:text-white transition cursor-pointer group flex items-center space-x-4 border-r border-gray-100">
              <FileText size={40} className="text-rose-600 group-hover:text-white" />
              <div>
                <h3 className="font-black text-sm tracking-widest uppercase">Dukcapil</h3>
                <p className="text-[10px] font-bold opacity-60 uppercase">Administrasi Warga</p>
              </div>
            </div>
            <div className="bg-white/95 backdrop-blur-md p-8 text-rose-900 hover:bg-rose-600 hover:text-white transition cursor-pointer group flex items-center space-x-4 border-r border-gray-100">
              <Briefcase size={40} className="text-rose-600 group-hover:text-white" />
              <div>
                <h3 className="font-black text-sm tracking-widest uppercase">Perizinan</h3>
                <p className="text-[10px] font-bold opacity-60 uppercase">Mal Pelayanan Publik</p>
              </div>
            </div>
            <div className="bg-white/95 backdrop-blur-md p-8 text-rose-900 hover:bg-rose-600 hover:text-white transition cursor-pointer group flex items-center space-x-4">
              <HeartPulse size={40} className="text-rose-600 group-hover:text-white" />
              <div>
                <h3 className="font-black text-sm tracking-widest uppercase">Kesehatan</h3>
                <p className="text-[10px] font-bold opacity-60 uppercase">Layanan J-HUR</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-gray-100 pb-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Berita Utama</h2>
            <p className="text-rose-600 font-bold text-sm italic">Informasi terkini seputar Kabupaten Jember</p>
          </div>
          <button className="text-xs font-bold text-gray-400 hover:text-rose-600 transition uppercase tracking-widest">Lihat Semua Berita</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="group cursor-pointer">
            <div className="overflow-hidden rounded-lg mb-6 shadow-lg h-56">
              <img src="/ikd.png" alt="News" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-rose-600 transition uppercase leading-tight">Aktivasi IKD Serentak di Kecamatan</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">Layanan jemput bola administrasi kependudukan digital terus ditingkatkan untuk memudahkan warga Jember.</p>
            <span className="text-rose-600 font-black text-xs tracking-widest uppercase flex items-center">Baca Detail <ChevronRight size={14} className="ml-1"/></span>
          </div>

          <div className="group cursor-pointer">
            <div className="overflow-hidden rounded-lg mb-6 shadow-lg h-56">
              <img src="/bansos.webp" alt="News" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-rose-600 transition uppercase leading-tight">Penyaluran Bansos UMKM Tahap II</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">Sebagai komitmen Semua Karena Cinta, bantuan modal disalurkan kepada ribuan pelaku usaha kecil di daerah.</p>
            <span className="text-rose-600 font-black text-xs tracking-widest uppercase flex items-center">Baca Detail <ChevronRight size={14} className="ml-1"/></span>
          </div>

          <div className="group cursor-pointer">
            <div className="overflow-hidden rounded-lg mb-6 shadow-lg h-56">
              <img src="/blusukan.png" alt="News" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-rose-600 transition uppercase leading-tight">Jember Hadir Untuk Rakyat (J-HUR)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">Bupati Jember kembali turun ke desa-desa untuk memastikan layanan kesehatan gratis tepat sasaran bagi warga.</p>
            <span className="text-rose-600 font-black text-xs tracking-widest uppercase flex items-center">Baca Detail <ChevronRight size={14} className="ml-1"/></span>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-12 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 overflow-hidden flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <h2 className="font-black uppercase tracking-tighter text-xl">Kabupaten Jember</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">Pemerintah Kabupaten Jember terus berkomitmen memberikan pelayanan publik yang ramah, inovatif, dan penuh cinta bagi seluruh masyarakat.</p>
          </div>
          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-6 text-rose-500">Link Terkait</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-bold uppercase tracking-widest">
              <li className="hover:text-white cursor-pointer transition">Dispendukcapil</li>
              <li className="hover:text-white cursor-pointer transition">Mal Pelayanan Publik</li>
              <li className="hover:text-white cursor-pointer transition">Portal Data</li>
              <li className="hover:text-white cursor-pointer transition">E-Lapor</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-6 text-rose-500">Berita Terkini</h4>
            <div className="flex shadow-lg overflow-hidden rounded-lg">
              <input type="email" placeholder="Email Anda" className="bg-white/5 border border-white/10 px-4 py-3 text-sm w-full focus:outline-none focus:ring-1 focus:ring-rose-500" />
              <button className="bg-rose-600 px-6 py-3 hover:bg-rose-500 transition"><Send size={18}/></button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-[10px] font-bold tracking-widest uppercase">
          &copy; 2026 Pemerintah Kabupaten Jember. Dikembangkan untuk Tugas Akhir E-Government.
        </div>
      </footer>

      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 bg-rose-600 text-white p-5 rounded-full shadow-[0_10px_30px_rgba(225,29,72,0.5)] hover:bg-rose-700 hover:scale-110 transition-all z-50 animate-bounce"
        >
          <MessageSquare size={32} />
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-8 right-8 w-80 sm:w-96 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col z-50 overflow-hidden" style={{ height: '550px', maxHeight: '85vh' }}>
          
          <div className="bg-gradient-to-r from-rose-700 to-rose-600 p-5 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full overflow-hidden flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
              </div>
              <div>
                <h3 className="font-black text-xs tracking-widest uppercase">JemberBot AI</h3>
                <p className="text-[10px] font-bold text-rose-100 flex items-center uppercase">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse shadow-[0_0_5px_#4ade80]"></span> Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="hover:rotate-90 transition duration-300 bg-white/10 p-2 rounded-full"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 bg-rose-50/20 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm leading-relaxed font-medium ${
                    msg.sender === 'user' 
                      ? 'bg-rose-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-rose-100 rounded-bl-none shadow-sm'
                  }`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-rose-50 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center space-x-2 text-rose-600 font-bold text-[10px] uppercase">
                  <Loader2 size={14} className="animate-spin" />
                  <span>JemberBot Sedang Berpikir...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-5 py-3 bg-white border-t border-rose-50 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <button onClick={() => setInputText('Cara buat KTP')} className="text-[10px] font-bold border border-rose-100 text-rose-700 px-4 py-2 rounded-full hover:bg-rose-600 hover:text-white transition uppercase tracking-widest">Cara KTP</button>
            <button onClick={() => setInputText('Info Bansos')} className="text-[10px] font-bold border border-rose-100 text-rose-700 px-4 py-2 rounded-full hover:bg-rose-600 hover:text-white transition uppercase tracking-widest">Info Bansos</button>
            <button onClick={() => setInputText('Izin Usaha')} className="text-[10px] font-bold border border-rose-100 text-rose-700 px-4 py-2 rounded-full hover:bg-rose-600 hover:text-white transition uppercase tracking-widest">Izin Usaha</button>
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-rose-50 flex items-center space-x-2">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tulis pesan anda..." 
              className="flex-1 border-none bg-gray-100 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-12 h-12 bg-rose-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-rose-700 transition flex-shrink-0 shadow-lg shadow-rose-200"
            >
              <Send size={20} className="ml-1" />
            </button>
          </form>
          
        </div>
      )}

    </div>
  );
}