import React, { useState, useRef } from 'react';
import { 
  Users, 
  UserPlus, 
  UploadCloud, 
  Download, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  MessageSquare, 
  ExternalLink,
  RefreshCw,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Send,
  Info
} from 'lucide-react';
import { useCitizenStore } from '../store/useCitizenStore';
import { CitizenCategory, CitizenContact } from '../types';
import { OFFICIAL_WARDS } from '../data/officialDatasets';
import { generateSampleCsv, normalizeWhatsAppNumber } from '../utils/phoneUtils';

export default function CitizenDirectoryManager() {
  const { 
    contacts, 
    addContact, 
    updateContact, 
    deleteContact, 
    importCsvText, 
    resetToSample, 
    clearAll,
    loadCase1Preset,
    loadCase2Preset,
    searchQuery,
    setSearchQuery,
    selectedWardFilter,
    setSelectedWardFilter,
    selectedCategoryFilter,
    setSelectedCategoryFilter
  } = useCitizenStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  // Add Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [wardName, setWardName] = useState('Royapuram');
  const [category, setCategory] = useState<CitizenCategory>('OUTDOOR_WORKER');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // CSV Import State
  const [csvRawText, setCsvRawText] = useState('');
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [csvStatus, setCsvStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Phone preview validation
  const phoneValidation = normalizeWhatsAppNumber(phone);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (editingContactId) {
      updateContact(editingContactId, {
        name: name.trim(),
        phone: phone.trim(),
        wardName,
        category,
        notes: notes.trim() || undefined
      });
      setFormSuccess(`Updated "${name}" successfully!`);
      setEditingContactId(null);
      resetForm();
      setTimeout(() => setFormSuccess(null), 3000);
      return;
    }

    const res = addContact({
      name: name.trim(),
      phone: phone.trim(),
      wardName,
      category,
      notes: notes.trim() || undefined
    });

    if (res.success) {
      setFormSuccess(`Added "${name}" (${res.contact?.phone}) in ${wardName}!`);
      resetForm();
      setShowAddForm(false);
      setTimeout(() => setFormSuccess(null), 3500);
    } else {
      setFormError(res.error || 'Failed to add contact');
    }
  };

  const handleEditClick = (contact: CitizenContact) => {
    setEditingContactId(contact.id);
    setName(contact.name);
    setPhone(contact.phone);
    setWardName(contact.wardName);
    setCategory(contact.category);
    setNotes(contact.notes || '');
    setShowAddForm(true);
    setFormError(null);
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setWardName('Royapuram');
    setCategory('OUTDOOR_WORKER');
    setNotes('');
    setEditingContactId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvRawText(text);
    };
    reader.readAsText(file);
  };

  const handleProcessCsv = () => {
    if (!csvRawText.trim()) {
      setCsvStatus({ success: false, message: 'Please provide CSV content or select a file.' });
      return;
    }

    const res = importCsvText(csvRawText);
    if (res.success) {
      setCsvStatus({ 
        success: true, 
        message: `Successfully extracted and registered ${res.count} citizen phone numbers!` 
      });
      setTimeout(() => {
        setShowCsvModal(false);
        setCsvStatus(null);
        setCsvRawText('');
        setCsvFileName(null);
      }, 1800);
    } else {
      setCsvStatus({ 
        success: false, 
        message: res.errors.join('. ') || 'Could not parse contacts from CSV.' 
      });
    }
  };

  const handleDownloadSampleCsv = () => {
    const csvContent = generateSampleCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'heatguard_chennai_citizens_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick Direct WhatsApp Test
  const handleDirectWhatsApp = (contact: CitizenContact) => {
    const message = `🚨 *NDMA HEATWAVE ADVISORY: ${contact.wardName.toUpperCase()}*\n\nHello *${contact.name}*,\nSevere thermal stress (WBGT 33.4°C) has been detected in your location (*${contact.wardName}*).\n\n⚠️ *Key Directives:*\n• Mandatory outdoor rest in shade\n• Drink 2.5L water/electrolytes\n• Check on vulnerable family members\n\nEmergency Helpline: Dial *108* | GCC Mobile Clinic: *104*`;
    const waUrl = `https://wa.me/${contact.cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Filter contacts
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.cleanPhone.includes(searchQuery) ||
      c.wardName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesWard = selectedWardFilter === 'ALL' || c.wardName === selectedWardFilter;
    const matchesCat = selectedCategoryFilter === 'ALL' || c.category === selectedCategoryFilter;

    return matchesSearch && matchesWard && matchesCat;
  });

  // Ward counts
  const royapuramCount = contacts.filter(c => c.wardName === 'Royapuram').length;
  const adyarCount = contacts.filter(c => c.wardName === 'Adyar').length;
  const tondiarpetCount = contacts.filter(c => c.wardName === 'Tondiarpet').length;

  return (
    <div className="bg-[#0c1322] border border-slate-800 rounded-sm p-4 sm:p-5 shadow-lg space-y-6 font-mono">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-950/80 border border-emerald-800/60 rounded text-emerald-400">
              <Users className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Citizen Phone Directory & Location Registry
            </h2>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-slate-300 text-[10px] rounded-full font-bold">
              {contacts.length} Registered
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Manage citizen and worker mobile numbers tagged by Ward location for hyper-localized WhatsApp thermal warnings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (showAddForm && !editingContactId) {
                setShowAddForm(false);
              } else {
                resetForm();
                setShowAddForm(true);
              }
            }}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            {showAddForm && !editingContactId ? 'Close Form' : 'Add Citizen Phone'}
          </button>

          <button
            onClick={() => setShowCsvModal(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded text-[11px] font-bold flex items-center gap-1.5 transition"
          >
            <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
            Extract Numbers from CSV
          </button>

          <button
            onClick={handleDownloadSampleCsv}
            title="Download formatted CSV sample"
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 rounded text-[11px] flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Sample CSV
          </button>
        </div>
      </div>

      {/* QUICK PRESET SCENARIO BUTTONS (CASE 1 & CASE 2 TESTING) */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded p-3.5 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200 uppercase">
              Fast Location Targeting Presets:
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            Click to auto-populate directory for immediate testing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
          {/* Case 1 Preset Button */}
          <button
            onClick={loadCase1Preset}
            className="p-2.5 bg-slate-900/90 hover:bg-slate-800/90 border border-emerald-800/50 hover:border-emerald-500 rounded text-left transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Load Case 1: All in Problem Location (Royapuram)
              </span>
              <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-300 px-1.5 py-0.5 rounded">
                4 Friends
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Adds 4 friend contacts all residing in <strong className="text-slate-200">Royapuram (Ward 049)</strong>. When an alert triggers for Royapuram, <span className="text-emerald-400">all 4 receive the WhatsApp broadcast</span>.
            </p>
          </button>

          {/* Case 2 Preset Button */}
          <button
            onClick={loadCase2Preset}
            className="p-2.5 bg-slate-900/90 hover:bg-slate-800/90 border border-amber-800/50 hover:border-amber-500 rounded text-left transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Load Case 2: Multi-Location (2 Problem + 1 Different Loc)
              </span>
              <span className="text-[10px] bg-amber-950 border border-amber-800 text-amber-300 px-1.5 py-0.5 rounded">
                Targeted Test
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Adds 2 friends in <strong className="text-slate-200">Royapuram</strong> and 1 friend in <strong className="text-slate-200">Adyar</strong>. When Royapuram alert fires, <span className="text-amber-400">only the 2 in Royapuram receive it; the friend in Adyar is excluded</span>.
            </p>
          </button>
        </div>
      </div>

      {/* SUCCESS / ERROR NOTIFICATIONS */}
      {formSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs rounded flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}
      {formError && (
        <div className="p-3 bg-rose-950/80 border border-rose-700 text-rose-200 text-xs rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* ADD / EDIT CITIZEN FORM */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-slate-950 border border-slate-700 p-4 rounded space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase flex items-center gap-2">
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              {editingContactId ? 'Edit Citizen Details' : 'Register New Citizen / Friend Phone Number'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Name */}
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                Citizen / Friend Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Senthil Kumar"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            {/* Mobile / WhatsApp Number */}
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                WhatsApp Phone No. <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210 or 9876543210"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              />
              {phone && (
                <div className="text-[10px] mt-1 flex items-center gap-1">
                  {phoneValidation.isValid ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> WhatsApp Link: wa.me/{phoneValidation.clean}
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Enter 10-digit number or with country code
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Location / Ward */}
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                Assigned Ward / Location <span className="text-red-400">*</span>
              </label>
              <select
                value={wardName}
                onChange={(e) => setWardName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              >
                {OFFICIAL_WARDS.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name} ({w.zone})
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                Vulnerability Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CitizenCategory)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              >
                <option value="OUTDOOR_WORKER">Outdoor / Construction Labor</option>
                <option value="GIG_WORKER">Gig Delivery / Transport</option>
                <option value="ELDERLY">Senior Citizen / Chronic Patient</option>
                <option value="GENERAL_CITIZEN">General Resident / Citizen</option>
                <option value="EMERGENCY_VOLUNTEER">Emergency Volunteer / ASHA</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
              Location Landmark / Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Near Harbor Gate 4, Tin roof cluster, Port worker"
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {editingContactId ? 'Save Changes' : 'Register Citizen'}
            </button>
          </div>
        </form>
      )}

      {/* CSV EXTRACTION MODAL / PANEL */}
      {showCsvModal && (
        <div className="bg-slate-950 border border-blue-900/60 p-4 rounded space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-slate-200 uppercase">
                Extract Citizen Phone Numbers from CSV File
              </h3>
            </div>
            <button
              onClick={() => {
                setShowCsvModal(false);
                setCsvStatus(null);
              }}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              ✕ Close
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Upload or paste any CSV containing names, phone numbers, and wards. The parser automatically cleans phone formats, normalizes +91 country codes, and tags the designated Ward.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* File Upload Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded p-4 text-center cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition flex flex-col items-center justify-center space-y-2"
            >
              <UploadCloud className="w-8 h-8 text-blue-400" />
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  {csvFileName ? `Selected: ${csvFileName}` : 'Click to Browse or Drag CSV file'}
                </span>
                <span className="text-[10px] text-slate-400">Supports .csv, .txt tab/comma separated</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,text/plain"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Raw Text Paste */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">
                  Or Paste CSV Text Directly:
                </label>
                <button
                  type="button"
                  onClick={() => setCsvRawText(generateSampleCsv())}
                  className="text-[10px] text-blue-400 hover:underline"
                >
                  Insert Sample Data
                </button>
              </div>
              <textarea
                value={csvRawText}
                onChange={(e) => setCsvRawText(e.target.value)}
                placeholder="Name,Phone,Ward,Category&#10;Arun,+91 98765 43210,Royapuram,Outdoor Worker&#10;Balaji,+91 98765 43211,Royapuram,Gig Worker"
                rows={5}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-300 font-mono text-[10px] focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {csvStatus && (
            <div className={`p-2.5 rounded text-xs flex items-center gap-2 ${
              csvStatus.success ? 'bg-emerald-950 border border-emerald-700 text-emerald-200' : 'bg-rose-950 border border-rose-700 text-rose-200'
            }`}>
              {csvStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>{csvStatus.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleDownloadSampleCsv}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download Template CSV
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCsvModal(false);
                  setCsvStatus(null);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessCsv}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Extract & Register Numbers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECTORY STATS & SEARCH / FILTER TOOLBAR */}
      <div className="space-y-3">
        {/* Ward Distribution Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Quick Ward Count:</span>
          <button
            onClick={() => setSelectedWardFilter('Royapuram')}
            className={`px-2 py-0.5 rounded text-[10px] border flex items-center gap-1 transition ${
              selectedWardFilter === 'Royapuram' 
                ? 'bg-rose-950 border-rose-500 text-rose-200 font-bold' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Royapuram: <strong className="text-slate-200">{royapuramCount}</strong>
          </button>

          <button
            onClick={() => setSelectedWardFilter('Tondiarpet')}
            className={`px-2 py-0.5 rounded text-[10px] border flex items-center gap-1 transition ${
              selectedWardFilter === 'Tondiarpet' 
                ? 'bg-rose-950 border-rose-500 text-rose-200 font-bold' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Tondiarpet: <strong className="text-slate-200">{tondiarpetCount}</strong>
          </button>

          <button
            onClick={() => setSelectedWardFilter('Adyar')}
            className={`px-2 py-0.5 rounded text-[10px] border flex items-center gap-1 transition ${
              selectedWardFilter === 'Adyar' 
                ? 'bg-blue-950 border-blue-500 text-blue-200 font-bold' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Adyar: <strong className="text-slate-200">{adyarCount}</strong>
          </button>

          {selectedWardFilter !== 'ALL' && (
            <button
              onClick={() => setSelectedWardFilter('ALL')}
              className="text-[10px] text-slate-400 hover:text-slate-200 underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone (+91), or ward..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:outline-none focus:border-slate-700"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedWardFilter}
              onChange={(e) => setSelectedWardFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 text-xs focus:outline-none"
            >
              <option value="ALL">All Wards ({contacts.length})</option>
              {OFFICIAL_WARDS.map((w) => (
                <option key={w.id} value={w.name}>
                  {w.name}
                </option>
              ))}
            </select>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 text-xs focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="OUTDOOR_WORKER">Outdoor / Labor</option>
              <option value="GIG_WORKER">Gig Workers</option>
              <option value="ELDERLY">Senior Citizens</option>
              <option value="GENERAL_CITIZEN">General Citizens</option>
              <option value="EMERGENCY_VOLUNTEER">Volunteers</option>
            </select>

            <button
              onClick={resetToSample}
              title="Reset to default sample contacts"
              className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 rounded transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {contacts.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Clear all registered citizen phone numbers?')) {
                    clearAll();
                  }
                }}
                title="Clear all contacts"
                className="p-1.5 bg-slate-900 hover:bg-rose-950/80 border border-slate-800 hover:border-rose-800 text-slate-400 hover:text-rose-300 rounded transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* REGISTERED CITIZENS TABLE */}
      <div className="border border-slate-800 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 uppercase text-[9px] border-b border-slate-800">
                <th className="py-2.5 px-3">Citizen / Friend Name</th>
                <th className="py-2.5 px-3">Phone (WhatsApp Link)</th>
                <th className="py-2.5 px-3">Assigned Location</th>
                <th className="py-2.5 px-3">Demographic Cohort</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                    No citizen phone numbers found. Use "Add Citizen Phone", "Extract Numbers from CSV", or click one of the Presets above.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-900/50 transition">
                    {/* Name */}
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        {contact.name}
                      </div>
                      {contact.notes && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {contact.notes}
                        </span>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span className="text-slate-200 font-bold font-mono">
                          {contact.phone}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-500">
                        wa.me/{contact.cleanPhone}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span className="font-bold text-slate-200">{contact.wardName}</span>
                      </div>
                      <span className="text-[9px] text-slate-400">
                        {contact.wardId}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${
                        contact.category === 'OUTDOOR_WORKER' ? 'bg-amber-950/80 border-amber-800 text-amber-300' :
                        contact.category === 'GIG_WORKER' ? 'bg-blue-950/80 border-blue-800 text-blue-300' :
                        contact.category === 'ELDERLY' ? 'bg-purple-950/80 border-purple-800 text-purple-300' :
                        contact.category === 'EMERGENCY_VOLUNTEER' ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300' :
                        'bg-slate-900 border-slate-700 text-slate-300'
                      }`}>
                        {contact.category === 'OUTDOOR_WORKER' && 'Outdoor Labor'}
                        {contact.category === 'GIG_WORKER' && 'Gig Worker'}
                        {contact.category === 'ELDERLY' && 'Senior Citizen'}
                        {contact.category === 'GENERAL_CITIZEN' && 'General Citizen'}
                        {contact.category === 'EMERGENCY_VOLUNTEER' && 'Volunteer'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDirectWhatsApp(contact)}
                          title="Open direct WhatsApp with personalized advisory"
                          className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 hover:border-emerald-500 text-emerald-300 rounded text-[10px] font-bold flex items-center gap-1 transition"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-400" />
                          Send WhatsApp
                        </button>

                        <button
                          onClick={() => handleEditClick(contact)}
                          title="Edit contact"
                          className="p-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 rounded transition"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => deleteContact(contact.id)}
                          title="Delete contact"
                          className="p-1 bg-slate-900 hover:bg-rose-950 border border-slate-800 hover:border-rose-800 text-slate-400 hover:text-rose-400 rounded transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
