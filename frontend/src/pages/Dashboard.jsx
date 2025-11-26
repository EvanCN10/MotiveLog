import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaCheckCircle, FaRegCircle, FaSignOutAlt, FaImage, FaChevronDown, FaCalendarAlt, FaStar, FaList, FaRegStar } from 'react-icons/fa';
import LoadingScreen from '../components/LoadingScreen';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'calendar', 'important'
  const navigate = useNavigate();
  const workSectionRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title);
    if (image) formData.append('image', image);
    try {
      await axios.post('http://localhost:5000/tasks', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setTitle(''); setImage(null); fetchTasks();
    } catch (err) { alert("Gagal"); }
  };

  const handleDelete = async (id) => {
    if(!confirm("Hapus tugas ini?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) { alert("Gagal hapus"); }
  };

  const handleUpdateStatus = async (id, field, currentValue) => {
    const token = localStorage.getItem('token');
    try {
       // Optimistic UI Update (Biar terasa cepat)
       const updatedTasks = tasks.map(t => 
         t.id === id ? { ...t, [field]: !currentValue } : t
       );
       setTasks(updatedTasks);

       // Tembak API
       await axios.put(`http://localhost:5000/tasks/${id}`, 
        { [field]: !currentValue }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchTasks(); // Refresh untuk memastikan data sinkron
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const scrollToWork = () => {
    workSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- LOGIC FILTER TABS ---
  const getFilteredTasks = () => {
    if (activeTab === 'important') {
      return tasks.filter(task => task.isImportant);
    }
    // Calendar view logic (Simplified: Show all for now, logic below handles UI)
    return tasks; 
  };

  if (loading) return <LoadingScreen onComplete={() => setLoading(false)} />;

  return (
    <div className="w-full bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-neon-orange selection:text-black">
      
      {/* SECTION 1: LANDING INTRO */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted className="w-full h-full object-cover opacity-50 grayscale">
            <source src="https://videos.pexels.com/video-files/5818973/5818973-uhd_2560_1440_24fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          <p className="text-neon-orange text-sm md:text-base tracking-[0.8em] uppercase mb-8">Motive Log System</p>
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mix-blend-overlay opacity-90">
            FOCUS
          </h1>
          <p className="text-gray-400 mt-8 text-lg tracking-widest max-w-lg mx-auto leading-loose">
            "Your future is created by what you do today."
          </p>
        </motion.div>

        <motion.button 
          onClick={scrollToWork}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          className="absolute bottom-12 z-10 flex flex-col items-center gap-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <span className="text-xs uppercase tracking-widest">Hop On Board</span>
          <FaChevronDown className="text-xl" />
        </motion.button>
      </section>


      {/* SECTION 2: WORKSPACE (ZOOMED UI MODE) */}
      <section ref={workSectionRef} className="min-h-screen w-full bg-[#0a0a0a] flex flex-col md:flex-row relative z-20 border-t border-white/5">
        
        {/* --- SIDEBAR (KIRI) --- */}
        <div className="w-full md:w-80 bg-[#0F0F0F] border-r border-white/5 p-8 flex flex-col h-auto md:h-screen sticky top-0">
          
          <div className="flex items-center gap-5 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-neon-orange to-purple-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-neon-orange/20">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-xl text-white tracking-wide">{user.username}</h3>
              <p className="text-sm text-gray-500 mt-1">Pro Member</p>
            </div>
          </div>

          <div className="mb-10">
             <button className="w-full py-4 bg-neon-orange text-black font-bold text-lg rounded-xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-neon-orange/10 transform active:scale-95">
                <FaPlus /> New Task
             </button>
             
             {/* Input Form Mini */}
             <form onSubmit={handleCreateTask} className="mt-6 p-5 bg-black/40 rounded-xl border border-white/5 space-y-4">
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title..." 
                  className="w-full bg-transparent text-base border-b border-gray-700 focus:border-neon-orange outline-none pb-3 placeholder-gray-600"
                />
                <label className="flex items-center gap-3 text-sm text-gray-500 cursor-pointer hover:text-white transition-colors">
                  <FaImage className="text-lg" /> 
                  <span className="truncate">{image ? image.name : "Attach Image"}</span>
                  <input type="file" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
                </label>
                <button type="submit" className="text-sm text-neon-orange font-bold uppercase tracking-widest hover:text-white pt-2">ADD +</button>
             </form>
          </div>

          {/* Navigation Menu (ZOOMED SIZE) */}
          <nav className="flex-1 space-y-2">
            <NavItem 
              icon={<FaList />} 
              label="My Tasks" 
              isActive={activeTab === 'list'} 
              onClick={() => setActiveTab('list')} 
            />
            <NavItem 
              icon={<FaCalendarAlt />} 
              label="Calendar" 
              isActive={activeTab === 'calendar'} 
              onClick={() => setActiveTab('calendar')} 
            />
            <NavItem 
              icon={<FaStar />} 
              label="Important" 
              isActive={activeTab === 'important'} 
              onClick={() => setActiveTab('important')} 
            />
          </nav>

          <button onClick={handleLogout} className="mt-auto flex items-center gap-3 text-gray-500 hover:text-red-500 text-base font-medium p-4 transition-colors">
            <FaSignOutAlt className="text-lg" /> Sign Out
          </button>
        </div>


        {/* --- MAIN CONTENT (KANAN) --- */}
        <div className="flex-1 p-8 md:p-16 bg-[#0a0a0a]">
          
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                {activeTab === 'list' && "My Dashboard"}
                {activeTab === 'calendar' && "Schedule"}
                {activeTab === 'important' && "Important Tasks"}
              </h2>
              <p className="text-gray-500 text-lg">
                {activeTab === 'calendar' 
                  ? new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
                  : `You have ${getFilteredTasks().length} tasks pending.`
                }
              </p>
            </div>
          </div>

          {/* CONTENT SWITCHER */}
          {activeTab === 'calendar' ? (
            <CalendarView tasks={tasks} />
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {getFilteredTasks().length === 0 ? (
                 <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-3xl text-gray-600">
                    <p className="text-xl">No tasks found in this view.</p>
                 </div>
              ) : (
                getFilteredTasks().map((task) => (
                  <motion.div 
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`group flex items-center gap-6 p-6 rounded-2xl border transition-all cursor-pointer ${
                      task.isCompleted 
                        ? 'bg-[#141414]/50 border-transparent opacity-50' 
                        : 'bg-[#141414] border-white/5 hover:border-neon-orange/50 hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {/* Checkbox Besar */}
                    <button 
                      onClick={() => handleUpdateStatus(task.id, 'isCompleted', task.isCompleted)}
                      className={`text-3xl transition-transform active:scale-90 ${task.isCompleted ? 'text-neon-orange' : 'text-gray-700 hover:text-gray-500'}`}
                    >
                      {task.isCompleted ? <FaCheckCircle /> : <FaRegCircle />}
                    </button>

                    <div className="flex-1">
                      <h4 className={`text-xl md:text-2xl font-medium tracking-wide ${task.isCompleted ? 'line-through text-gray-600' : 'text-gray-200'}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-gray-600 uppercase tracking-wider font-medium">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                        {task.imageUrl && (
                          <span className="text-[10px] bg-neon-cyan/10 text-neon-cyan px-2 py-1 rounded border border-neon-cyan/20 uppercase tracking-wider">
                            Image
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Thumbnail Image Besar */}
                    {task.imageUrl && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 group-hover:border-white/30 transition-all">
                        <img src={`http://localhost:5000${task.imageUrl}`} className="w-full h-full object-cover" alt="Proof" />
                      </div>
                    )}

                    {/* Star Button (Important) */}
                    <button 
                      onClick={() => handleUpdateStatus(task.id, 'isImportant', task.isImportant)}
                      className={`text-2xl p-2 transition-colors ${task.isImportant ? 'text-yellow-400' : 'text-gray-700 hover:text-yellow-400'}`}
                    >
                      {task.isImportant ? <FaStar /> : <FaRegStar />}
                    </button>

                    {/* Delete Button */}
                    <button onClick={() => handleDelete(task.id)} className="p-3 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xl">
                      <FaTrash />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// --- SUB-COMPONENTS (Biar kode rapi) ---

// 1. Menu Item (Zoomed Size)
const NavItem = ({ icon, label, isActive, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
      isActive 
        ? 'bg-white text-black font-bold shadow-lg shadow-white/10' 
        : 'text-gray-500 hover:bg-white/5 hover:text-white font-medium'
    }`}
  >
    <span className={`text-xl ${isActive ? 'text-black' : 'text-neon-orange'}`}>{icon}</span> 
    <span className="text-lg">{label}</span>
  </div>
);

// 2. Simple Calendar View (Visual Only for Vibe)
const CalendarView = ({ tasks }) => {
  // Generate days for visual demo
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <div className="bg-[#141414] border border-white/5 rounded-3xl p-8">
       <div className="grid grid-cols-7 gap-4 text-center mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-gray-500 text-sm uppercase tracking-widest">{d}</div>
          ))}
       </div>
       <div className="grid grid-cols-7 gap-4">
          {days.map(day => {
            // Cek apakah ada tugas di hari ini (Simulasi acak/modulus untuk demo)
            const hasTask = tasks.some(t => new Date(t.createdAt).getDate() === day);
            return (
              <div key={day} className={`aspect-square rounded-xl border border-white/5 flex flex-col items-center justify-center relative hover:bg-white/5 transition-colors ${hasTask ? 'bg-white/5' : ''}`}>
                 <span className="text-lg text-gray-300 font-mono">{day}</span>
                 {hasTask && <div className="w-1.5 h-1.5 bg-neon-orange rounded-full mt-2"></div>}
              </div>
            )
          })}
       </div>
    </div>
  )
}

export default Dashboard;