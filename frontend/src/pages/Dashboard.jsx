import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus, FaTrash, FaCheckCircle, FaRegCircle, FaSignOutAlt,
  FaImage, FaChevronDown, FaCalendarAlt, FaStar, FaList,
  FaRegStar, FaTimes, FaExclamationTriangle, FaClock, FaSave, 
  FaBell, FaRobot, FaMagic, FaArrowRight, FaHome, FaFire, FaDumbbell
} from "react-icons/fa";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import LoadingScreen from "../components/LoadingScreen";
import { quotes } from "../quotes";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState("home");
  const [quote, setQuote] = useState("");
  const navigate = useNavigate();
  const workSectionRef = useRef(null);

  // --- STATE MODALS ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false); // <--- NEW SIGN OUT MODAL
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [notification, setNotification] = useState(null);

  // FORMS
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formImage, setFormImage] = useState(null);
  const [formDeadline, setFormDeadline] = useState("");
  const [formReminder, setFormReminder] = useState(1);
  
  // EDIT
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  // AI
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState([]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    fetchTasks();
  }, []);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    
    // --- HANDLING GUEST MODE (DATA DUMMY) ---
    if (token === 'GUEST_TOKEN') {
      const dummyTasks = [
        { id: 'g1', title: 'Welcome Guest!', description: 'This is a demo task.', isCompleted: false, isImportant: true, createdAt: new Date().toISOString(), deadline: new Date().toISOString() },
        { id: 'g2', title: 'Explore Features', description: 'Try adding a task or using AI.', isCompleted: true, isImportant: false, createdAt: new Date(Date.now() - 86400000).toISOString() }
      ];
      setTasks(dummyTasks);
      return;
    }
    // ----------------------------------------

    try {
      const res = await axios.get("http://localhost:5000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
      checkReminders(res.data);
    } catch (err) { console.error(err); }
  };

  const checkReminders = (taskList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const urgentList = taskList.filter((task) => {
      if (!task.deadline || task.isCompleted) return false;
      const deadlineDate = new Date(task.deadline);
      deadlineDate.setHours(0, 0, 0, 0);
      const reminderThreshold = task.reminderDays || 1;
      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= reminderThreshold && diffDays >= -1;
    });
    if (urgentList.length > 0) {
      setUrgentTasks(urgentList);
      setTimeout(() => setShowAlertModal(true), 1500);
    }
  };

  const formatDateIndo = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  // --- HANDLERS ---
  const handleCreateTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token === 'GUEST_TOKEN') { showToast("Guest Mode: Cannot Save", "error"); return; }

    const formData = new FormData();
    formData.append("title", formTitle);
    formData.append("description", formDesc);
    if (formDeadline) formData.append("deadline", formDeadline);
    formData.append("reminderDays", formReminder);
    if (formImage) formData.append("image", formImage);

    try {
      await axios.post("http://localhost:5000/tasks", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setFormTitle(""); setFormDesc(""); setFormImage(null); setFormDeadline("");
      setShowAddModal(false); showToast("Mission Created"); fetchTasks();
    } catch (err) { showToast("Failed", "error"); }
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!aiPrompt) return;
    const token = localStorage.getItem("token");
    if (token === 'GUEST_TOKEN') { alert("AI not available in Guest Mode"); return; }

    setAiLoading(true); setAiResults([]);
    try {
      const res = await axios.post("http://localhost:5000/ai/generate", 
        { prompt: aiPrompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiResults(res.data.tasks);
    } catch (err) { showToast("AI Offline", "error"); } 
    finally { setAiLoading(false); }
  };

  const handleAcceptAITasks = async () => {
    const token = localStorage.getItem("token");
    try {
      const promises = aiResults.map(task => {
        const formData = new FormData();
        formData.append("title", task.title);
        formData.append("description", task.description);
        formData.append("reminderDays", 1);
        return axios.post("http://localhost:5000/tasks", formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      });
      await Promise.all(promises);
      setShowAIModal(false); setAiPrompt(""); setAiResults([]);
      showToast("Protocols Initiated"); fetchTasks();
    } catch (err) { showToast("Failed", "error"); }
  };

  const handleSaveChanges = async () => {
    if (!selectedTask) return;
    const token = localStorage.getItem("token");
    if (token === 'GUEST_TOKEN') { showToast("Guest Mode: Read Only", "error"); return; }
    try {
      await axios.put(`http://localhost:5000/tasks/${selectedTask.id}`, 
        { title: editTitle, description: editDesc, deadline: editDeadline ? editDeadline : null }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowDetailModal(false); fetchTasks(); showToast("Updated");
    } catch (err) { showToast("Failed", "error"); }
  };

  const handleDeleteExecute = async () => {
    if (!selectedTask) return;
    const token = localStorage.getItem("token");
    if (token === 'GUEST_TOKEN') { showToast("Guest Mode: Read Only", "error"); return; }
    try {
      await axios.delete(`http://localhost:5000/tasks/${selectedTask.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setShowDeleteModal(false); setShowDetailModal(false); fetchTasks(); showToast("Deleted");
    } catch (err) { showToast("Failed", "error"); }
  };

  const handleUpdateStatus = async (id, field, currentValue) => {
    const token = localStorage.getItem("token");
    if (token === 'GUEST_TOKEN') { 
       // Simulasi update lokal untuk guest
       setTasks(tasks.map(t => t.id === id ? { ...t, [field]: !currentValue } : t));
       return; 
    }
    try {
      const updatedTasks = tasks.map((t) => t.id === id ? { ...t, [field]: !currentValue } : t);
      setTasks(updatedTasks);
      if (selectedTask && selectedTask.id === id) setSelectedTask({ ...selectedTask, [field]: !currentValue });
      await axios.put(`http://localhost:5000/tasks/${id}`, { [field]: !currentValue }, { headers: { Authorization: `Bearer ${token}` } });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const openDetail = (task) => {
    setSelectedTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description || "");
    setEditDeadline(task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "");
    setShowDetailModal(true);
  };

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/login"); };
  const scrollToWork = () => { workSectionRef.current?.scrollIntoView({ behavior: "smooth" }); };
  const getFilteredTasks = () => { if (activeTab === "important") return tasks.filter((task) => task.isImportant); return tasks; };

  if (loading) return <LoadingScreen onComplete={() => setLoading(false)} />;

  return (
    <div className="w-full bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-neon-orange selection:text-black">
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: -50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -50, x: "-50%" }} className="fixed top-6 left-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-full bg-black/80 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <div className={`w-2 h-2 rounded-full ${notification.type === 'error' ? 'bg-red-500' : 'bg-neon-orange'}`}></div>
            <span className="text-sm font-mono tracking-widest uppercase">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted className="w-full h-full object-cover opacity-50 grayscale">
            <source src="https://videos.pexels.com/video-files/5818973/5818973-uhd_2560_1440_24fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
        </div>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }} className="relative z-10 text-center px-4">
          <p className="text-neon-orange text-sm tracking-[0.8em] uppercase mb-8">Motive Log V2.4</p>
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mix-blend-overlay opacity-90">FOCUS</h1>
          <p className="text-gray-400 mt-8 text-lg tracking-widest max-w-2xl mx-auto leading-loose italic">"{quote}"</p>
        </motion.div>
        <motion.button onClick={scrollToWork} initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }} transition={{ delay: 2, duration: 2, repeat: Infinity }} className="absolute bottom-12 z-10 flex flex-col items-center gap-3 text-gray-400 hover:text-white cursor-pointer">
          <span className="text-xs uppercase tracking-widest">Enter Cockpit</span>
          <FaChevronDown className="text-xl" />
        </motion.button>
      </section>

      <section ref={workSectionRef} className="min-h-screen w-full bg-[#0a0a0a] flex flex-col md:flex-row relative z-20 border-t border-white/5">
        {/* SIDEBAR */}
        <div className="w-full md:w-80 bg-[#0F0F0F] border-r border-white/5 p-8 flex flex-col h-screen sticky top-0 z-30">
          <div className="flex items-center gap-5 mb-12 flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-neon-orange to-purple-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-neon-orange/20">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-xl text-white tracking-wide truncate">{user.username}</h3>
              <p className="text-sm text-gray-500 mt-1">{user.id === 'guest' ? 'Guest Access' : 'Pro Member'}</p>
            </div>
          </div>
          <div className="mb-10 flex-shrink-0">
            <button onClick={() => setShowAddModal(true)} className="w-full cursor-pointer py-4 bg-neon-orange text-white border hover:text-black font-bold text-lg rounded-xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-neon-orange/10 transform active:scale-95">
              <FaPlus /> New Task
            </button>
          </div>
          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
            <NavItem icon={<FaHome />} label="Home" isActive={activeTab === "home"} onClick={() => setActiveTab("home")} />
            <NavItem icon={<FaList />} label="My Tasks" isActive={activeTab === "list"} onClick={() => setActiveTab("list")} />
            <NavItem icon={<FaCalendarAlt />} label="Calendar" isActive={activeTab === "calendar"} onClick={() => setActiveTab("calendar")} />
            <NavItem icon={<FaStar />} label="Important" isActive={activeTab === "important"} onClick={() => setActiveTab("important")} />
            <div className="mt-6 pt-6 border-t border-white/5">
               <NavItem icon={<FaRobot />} label="AI Assistant" isActive={false} onClick={() => setShowAIModal(true)} />
            </div>
          </nav>
          
          {/* SIGN OUT BUTTON MEMICU MODAL */}
          <button onClick={() => setShowSignOutModal(true)} className="mt-auto flex items-center gap-3 text-gray-500 hover:text-red-500 text-base font-medium p-4 transition-colors flex-shrink-0 border-t border-white/5 cursor-pointer">
            <FaSignOutAlt className="text-lg" /> Sign Out
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-8 md:p-12 bg-[#0a0a0a] min-w-0">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                {activeTab === 'home' && "Command Center"}
                {activeTab === 'list' && "My Dashboard"}
                {activeTab === 'calendar' && "Schedule"}
                {activeTab === 'important' && "Important Tasks"}
              </h2>
              <p className="text-gray-500 text-lg">
                {activeTab === 'home' ? "Welcome to your HQ, Captain." : 
                 activeTab === 'calendar' ? "Overview of your month." : 
                 `You have ${getFilteredTasks().length} tasks pending.`}
              </p>
            </div>
          </div>

          {/* CONTENT SWITCHER */}
          {activeTab === 'home' ? (
             <HomeView tasks={tasks} /> 
          ) : activeTab === 'calendar' ? (
             <CalendarView tasks={tasks} onUpdateStatus={handleUpdateStatus} />
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {getFilteredTasks().length === 0 ? (
                <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-3xl text-gray-600">
                  <p className="text-xl">No tasks found.</p>
                </div>
              ) : (
                getFilteredTasks().map((task) => (
                  <motion.div key={task.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={() => openDetail(task)} className={`group flex items-center gap-6 p-6 rounded-2xl border transition-all cursor-pointer ${task.isCompleted ? "bg-[#141414]/50 border-transparent opacity-50" : "bg-[#141414] border-white/5 hover:border-neon-orange/50 hover:bg-[#1a1a1a]"}`}>
                    <button onClick={(e) => { e.stopPropagation(); handleUpdateStatus(task.id, "isCompleted", task.isCompleted); }} className={`text-3xl transition-transform active:scale-90 cursor-pointer ${task.isCompleted ? "text-neon-orange" : "text-gray-700 hover:text-gray-500"}`}>{task.isCompleted ? <FaCheckCircle /> : <FaRegCircle />}</button>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xl md:text-2xl font-medium tracking-wide truncate ${task.isCompleted ? "line-through text-gray-600" : "text-gray-200"}`}>{task.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        {task.deadline && <span className={`text-xs px-2 py-0.5 rounded border ${new Date(task.deadline) < new Date() && !task.isCompleted ? "bg-red-500/20 text-red-500 border-red-500/50" : "bg-white/5 text-gray-400 border-white/10"}`}><FaClock className="inline mr-1" /> {formatDateIndo(task.deadline)}</span>}
                      </div>
                    </div>
                    {task.imageUrl && <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0"><img src={`http://localhost:5000${task.imageUrl}`} className="w-full h-full object-cover" alt="Proof" /></div>}
                    <button onClick={(e) => { e.stopPropagation(); handleUpdateStatus(task.id, "isImportant", task.isImportant); }} className={`text-2xl p-2 transition-colors ${task.isImportant ? "text-yellow-400" : "text-gray-700 hover:text-yellow-400"}`}>{task.isImportant ? <FaStar /> : <FaRegStar />}</button>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedTask(task); setShowDeleteModal(true); }} className="p-3 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xl"><FaTrash /></button>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {/* SIGN OUT MODAL (NEW) */}
        {showSignOutModal && (
           <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSignOutModal(false)} />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#141414] border border-white/10 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
                 <div className="w-16 h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl"><FaSignOutAlt /></div>
                 <h3 className="text-2xl font-bold text-white mb-2">Ending Session?</h3>
                 <p className="text-gray-400 mb-8">You are about to disconnect from MotiveLog.</p>
                 <div className="flex gap-4">
                    <button onClick={() => setShowSignOutModal(false)} className="flex-1 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium">Stay</button>
                    <button onClick={() => { setShowSignOutModal(false); handleLogout(); }} className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 font-bold">Sign Out</button>
                 </div>
              </motion.div>
           </div>
        )}

        {showAddModal && (<Modal onClose={() => setShowAddModal(false)} title="Create New Mission"><form onSubmit={handleCreateTask} className="space-y-5"><div><label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Title</label><input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-neon-orange outline-none" /></div><div><label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Description</label><textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows="2" className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-neon-orange outline-none" /></div><div className="flex gap-4"><div className="flex-1"><label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Deadline</label><input type="date" value={formDeadline} onChange={(e) => setFormDeadline(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-neon-orange outline-none" /></div><div className="flex-1"><label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Remind Me</label><input type="number" min="0" max="7" value={formReminder} onChange={(e) => setFormReminder(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-neon-orange outline-none" /></div></div><div><label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Attachment</label><label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-white hover:bg-white/5 transition-all"><div className="text-center"><FaImage className="mx-auto text-2xl mb-2 text-gray-500" /><span className="text-sm text-gray-400">{formImage ? formImage.name : "Upload Evidence"}</span></div><input type="file" className="hidden" onChange={(e) => setFormImage(e.target.files[0])} /></label></div><button type="submit" className="w-full py-3 font-bold rounded-lg border border-[#FF6B00] text-[#FF6B00] bg-transparent hover:bg-[#FF6B00] hover:text-black transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_25px_rgba(255,107,0,0.6)]">LAUNCH</button></form></Modal>)}
        {showAIModal && (<div className="fixed inset-0 z-[80] flex items-center justify-center p-4"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowAIModal(false)} /><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#050505] border border-neon-cyan/50 w-full max-w-2xl rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden flex flex-col max-h-[80vh]"><div className="p-6 border-b border-neon-cyan/30 flex justify-between items-center bg-neon-cyan/5"><div className="flex items-center gap-3"><FaRobot className="text-2xl text-neon-cyan animate-pulse" /><h3 className="text-xl font-mono font-bold text-neon-cyan tracking-widest">AI COMMAND CENTER</h3></div><button onClick={() => setShowAIModal(false)} className="text-gray-500 hover:text-white"><FaTimes /></button></div><div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">{aiResults.length === 0 ? (<div className="text-center py-10 space-y-4"><FaMagic className="text-4xl text-gray-700 mx-auto" /><p className="text-gray-500 font-mono text-sm">"I am ready to organize your life, Captain."<br/>Type a goal (e.g. "Learn React", "Workout Plan").</p></div>) : (<div className="space-y-4"><p className="text-neon-cyan font-mono text-xs uppercase tracking-widest border-b border-neon-cyan/20 pb-2">Analysis Complete. Suggested Protocol:</p>{aiResults.map((task, idx) => (<motion.div key={idx} initial={{x: -20, opacity:0}} animate={{x:0, opacity:1}} transition={{delay: idx*0.1}} className="bg-white/5 border border-white/10 p-4 rounded-lg flex items-start gap-4"><div className="mt-1 text-neon-cyan">0{idx+1}</div><div><h4 className="font-bold text-white">{task.title}</h4><p className="text-xs text-gray-400">{task.description}</p></div></motion.div>))}</div>)}</div><div className="p-6 border-t border-white/10 bg-black">{aiResults.length > 0 ? (<div className="flex gap-4"><button onClick={() => setAiResults([])} className="flex-1 py-3 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-800 font-mono text-sm">RESET</button><button onClick={handleAcceptAITasks} className="flex-[2] py-3 bg-black border border-[#00F0FF] text-white font-bold rounded-lg hover:bg-[#00F0FF] hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] font-mono flex items-center justify-center gap-2 cursor-pointer"><FaPlus /> EXECUTE PROTOCOL</button></div>) : (<form onSubmit={handleAskAI} className="relative"><input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Command the AI..." className="w-full bg-[#111] border border-gray-700 rounded-xl p-4 pr-12 text-white focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] outline-none font-mono" disabled={aiLoading} /><button type="submit" disabled={aiLoading} className="absolute right-3 top-3 p-2 bg-neon-cyan text-black rounded-lg hover:bg-white transition-colors disabled:opacity-50">{aiLoading ? <span className="animate-spin block">⏳</span> : <FaArrowRight />}</button></form>)}</div></motion.div></div>)}
        {showAlertModal && urgentTasks.length > 0 && (<div className="fixed inset-0 z-[70] flex items-center justify-center p-4"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowAlertModal(false)} /><motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }} className="relative bg-[#141414] border border-neon-orange/50 p-8 rounded-2xl max-w-md w-full shadow-2xl shadow-neon-orange/20"><div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4"><div className="w-12 h-12 bg-neon-orange/20 text-neon-orange rounded-full flex items-center justify-center text-xl animate-pulse"><FaBell /></div><div><h3 className="text-xl font-bold text-white">Reminder Alert</h3><p className="text-xs text-gray-400">Deadlines are approaching.</p></div></div><div className="space-y-3 mb-8 max-h-60 overflow-y-auto custom-scrollbar">{urgentTasks.map((t) => (<div key={t.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border-l-4 border-red-500"><span className="text-white font-medium">{t.title}</span><span className="text-xs text-red-400 font-bold border border-red-500/30 px-2 py-1 rounded">{formatDateIndo(t.deadline)}</span></div>))}</div><button onClick={() => setShowAlertModal(false)} className="w-full py-3 font-bold rounded-lg border border-[#FF6B00] text-[#FF6B00] bg-transparent hover:bg-[#FF6B00] hover:text-black transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_25px_rgba(255,107,0,0.6)]">ACKNOWLEDGE</button></motion.div></div>)}
        {showDetailModal && selectedTask && (<Modal onClose={() => setShowDetailModal(false)} title="Mission Details"><div className="space-y-5"><div><label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Title</label><input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white text-xl font-bold focus:border-neon-orange outline-none" /></div><div className="flex gap-4"><div className="flex-1"><label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Status</label><button onClick={() => handleUpdateStatus(selectedTask.id, 'isCompleted', selectedTask.isCompleted)} className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${selectedTask.isCompleted ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>{selectedTask.isCompleted ? "Completed" : "In Progress"}</button></div><div className="flex-1"><label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Deadline (Edit)</label><input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-neon-orange outline-none" /></div></div>{selectedTask.imageUrl && <div className="w-full rounded-xl overflow-hidden border border-white/10"><img src={`http://localhost:5000${selectedTask.imageUrl}`} className="w-full object-cover max-h-64" alt="Proof" /></div>}<div><label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Description</label><textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows="3" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-gray-300 focus:border-neon-orange outline-none" /></div><div className="flex gap-4 pt-4 border-t border-white/10"><button onClick={handleSaveChanges} className="flex-1 py-3 bg-white text-black font-bold rounded-lg hover:bg-neon-orange transition-colors flex items-center justify-center gap-2 cursor:pointer"><FaSave /> Save Changes</button><button onClick={() => { setSelectedTask(selectedTask); setShowDeleteModal(true); }} className="px-4 py-3 bg-red-500/10 text-red-500 border border-red-500/50 rounded-lg hover:bg-red-500 hover:text-white transition-colors"><FaTrash /></button></div></div></Modal>)}
        {showDeleteModal && selectedTask && (<div className="fixed inset-0 z-[60] flex items-center justify-center p-4"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} /><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#141414] border border-red-500/30 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl shadow-red-900/20"><div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl"><FaExclamationTriangle /></div><h3 className="text-2xl font-bold text-white mb-2">Abort Mission?</h3><p className="text-gray-400 mb-8">Permanent delete <span className="text-white font-bold">"{selectedTask.title}"</span>?</p><div className="flex gap-4"><button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium">Cancel</button><button onClick={handleDeleteExecute} className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 font-bold">Delete</button></div></motion.div></div>)}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const Modal = ({ children, onClose, title }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
     <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative bg-[#0F0F0F] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5"><h3 className="text-xl font-bold text-white tracking-wide">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><FaTimes /></button></div>
        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
     </motion.div>
  </div>
);

const NavItem = ({ icon, label, isActive, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-white text-black font-bold shadow-lg shadow-white/10' : 'text-gray-500 hover:bg-white/5 hover:text-white font-medium'}`}>
    <span className={`text-xl ${isActive ? 'text-black' : 'text-neon-orange'}`}>{icon}</span><span className="text-lg">{label}</span>
  </div>
);

// --- INTELLIGENT CHART TOOLTIP ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dayData = payload[0].payload; // Ambil data lengkap hari itu (termasuk list tugas)
    return (
      <div className="bg-black/90 border border-white/10 p-4 rounded-xl shadow-xl backdrop-blur-md">
        <p className="font-bold text-neon-orange mb-2 border-b border-white/10 pb-1">{label}</p>
        {dayData.taskList.length > 0 ? (
          <ul className="text-xs text-gray-300 space-y-1">
            {dayData.taskList.map((t, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-neon-cyan rounded-full"></span> {t}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500 italic">No missions completed.</p>
        )}
      </div>
    );
  }
  return null;
};

const CalendarView = ({ tasks, onUpdateStatus }) => {
  const date = new Date();
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);
  const handleDayClick = (day, tasksOnDay) => { if (tasksOnDay.length > 0) { setSelectedDate(day); setTasksForSelectedDate(tasksOnDay); } };

  return (
    <>
      <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-2xl mx-auto overflow-hidden">
         <div className="flex justify-between items-center mb-6"><h3 className="text-xl md:text-2xl font-bold text-white tracking-widest">{date.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</h3></div>
         <div className="grid grid-cols-7 gap-1 text-center mb-4 pb-4 border-b border-white/5">{["S", "M", "T", "W", "T", "F", "S"].map((d) => (<div key={d} className="text-gray-500 text-xs uppercase tracking-widest font-bold">{d}</div>))}</div>
         <div className="grid grid-cols-7 gap-1">
            {blanks.map((blank) => <div key={`blank-${blank}`} className="aspect-square"></div>)}
            {days.map((day) => {
               const tasksOnThisDay = tasks.filter((t) => { if(!t.deadline) return false; const tDate = new Date(t.deadline); return tDate.getDate() === day && tDate.getMonth() === currentMonth; });
               const isToday = day === date.getDate();
               return (
                  <div key={day} onClick={() => handleDayClick(day, tasksOnThisDay)} className={`aspect-square rounded-lg border flex flex-col items-center justify-center p-1 md:p-2 relative transition-all cursor-pointer group text-center ${isToday ? "border-neon-orange bg-neon-orange/5" : "border-white/5 bg-[#0a0a0a] hover:bg-white/5"}`}>
                     <span className={`text-xs md:text-sm font-mono font-bold leading-none ${isToday ? "text-neon-orange" : "text-gray-400 group-hover:text-white"}`}>{day}</span>
                     <div className="mt-0.5 md:mt-1 flex gap-0.5 justify-center flex-wrap">{tasksOnThisDay.slice(0, 4).map((t, idx) => (<div key={idx} className={`w-0.5 h-0.5 md:w-1 md:h-1 rounded-full ${t.isCompleted ? "bg-green-500" : "bg-white"}`}></div>))}</div>
                  </div>
               );
            })}
         </div>
      </div>
      <AnimatePresence>
        {selectedDate && (<Modal onClose={() => setSelectedDate(null)} title={`Tugas: ${selectedDate} ${date.toLocaleString("id-ID", { month: "long" })}`}><div className="space-y-3">{tasksForSelectedDate.map((task) => (<div key={task.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5"><div className="flex items-center gap-3 overflow-hidden"><button onClick={() => onUpdateStatus(task.id, "isCompleted", task.isCompleted)} className={`text-xl ${task.isCompleted ? "text-neon-orange" : "text-gray-600 hover:text-gray-400"}`}>{task.isCompleted ? <FaCheckCircle /> : <FaRegCircle />}</button><span className={`text-sm truncate ${task.isCompleted ? "line-through text-gray-500" : "text-white"}`}>{task.title}</span></div></div>))}</div></Modal>)}
      </AnimatePresence>
    </>
  )
}

const HomeView = ({ tasks }) => {
  // MODIFIED DATA CHART: MENYIMPAN LIST TUGAS JUGA
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
    
    // Filter tugas di hari ini
    const todaysTasks = tasks.filter(t => new Date(t.createdAt).getDate() === d.getDate());
    
    return { 
      name: dayName, 
      tasks: todaysTasks.length,
      taskList: todaysTasks.map(t => t.title) // Simpan Judul Tugas untuk Tooltip
    };
  }).reverse();

  const legends = [
    { name: "Chris Bumstead", image: "https://wallpaperaccess.com/full/3702291.jpg", quote: "Standard is the standard." },
    { name: "Ronnie Coleman", image: "https://wallpaperaccess.com/full/1428035.jpg", quote: "Yeah buddy! Light weight!" },
    { name: "David Goggins", image: "https://wallpaperaccess.com/full/6278143.jpg", quote: "Stay hard." }
  ];
  const [legend, setLegend] = useState(legends[0]);

  useEffect(() => {
    setLegend(legends[Math.floor(Math.random() * legends.length)]);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-[#141414] border border-white/5 p-8 rounded-3xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-20"><FaFire className="text-6xl text-neon-orange" /></div>
           <h3 className="text-2xl font-bold text-white mb-1">Productivity Velocity</h3>
           <p className="text-gray-500 text-sm mb-6">Task completion rate (Last 7 Days)</p>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                 <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                 {/* PAKAI CUSTOM TOOLTIP DISINI */}
                 <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255, 107, 0, 0.1)'}} />
                 <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={index === 6 ? '#FF6B00' : '#333'} />))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
        <div className="bg-[#141414] border border-white/5 rounded-3xl overflow-hidden relative h-64 group">
           <video autoPlay loop muted className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500">
              <source src="https://assets.mixkit.co/videos/22960/22960-720.mp4" type="video/mp4" />
           </video>
           <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><FaDumbbell className="text-neon-cyan"/> Focus Theatre</h3>
              <p className="text-gray-300 text-xs mt-1">Pain is temporary. Glory is forever.</p>
           </div>
        </div>
      </div>
      <div className="lg:col-span-1">
         <div className="bg-[#141414] border border-white/5 p-2 rounded-3xl h-full flex flex-col text-center relative group">
            <div className="flex-1 w-full h-[500px] rounded-2xl overflow-hidden relative">
               <img src={legend.image} className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700" alt="Legend" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
               <div className="absolute bottom-6 left-0 w-full px-4">
                  <h2 className="text-3xl font-bold text-white uppercase tracking-tighter italic">{legend.name}</h2>
                  <div className="w-10 h-1 bg-neon-orange mx-auto my-4"></div>
                  <p className="text-gray-300 font-serif italic text-lg">"{legend.quote}"</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;