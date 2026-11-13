import { create } from 'zustand';
import { CitizenContact, CitizenCategory, WhatsAppDispatchRecord } from '../types';
import { normalizeWhatsAppNumber, parseCitizenCSV, standardizeWardName, getWardIdFromName } from '../utils/phoneUtils';

const STORAGE_KEY = 'heatguard_citizen_directory_v1';
const HISTORY_KEY = 'heatguard_whatsapp_history_v1';

const INITIAL_SAMPLE_CONTACTS: CitizenContact[] = [
  {
    id: 'ct-primary',
    name: 'Me (Verified Primary)',
    phone: '+91 73581 89640',
    cleanPhone: '917358189640',
    wardId: 'W002',
    wardName: 'Royapuram',
    category: 'GENERAL_CITIZEN',
    notes: 'Twilio Verified Caller ID (+91 73581 89640)',
    dateAdded: '2024-05-15 08:00'
  },
  {
    id: 'ct-esp32',
    name: 'Esp32 Temp Monitor',
    phone: '+91 90805 46938',
    cleanPhone: '919080546938',
    wardId: 'W002',
    wardName: 'Royapuram',
    category: 'OUTDOOR_WORKER',
    notes: 'Twilio Verified Caller ID (+91 90805 46938) - Sensor Node',
    dateAdded: '2024-05-15 08:15'
  },
  {
    id: 'ct-harinee',
    name: 'Harinee',
    phone: '+91 78458 47314',
    cleanPhone: '917845847314',
    wardId: 'W002',
    wardName: 'Royapuram',
    category: 'OUTDOOR_WORKER',
    notes: 'Twilio Verified Caller ID (+91 78458 47314)',
    dateAdded: '2024-05-15 08:30'
  },
  {
    id: 'ct-devesh',
    name: 'Devesh',
    phone: '+91 88385 68868',
    cleanPhone: '918838568868',
    wardId: 'W002',
    wardName: 'Royapuram',
    category: 'GIG_WORKER',
    notes: 'Twilio Verified Caller ID (+91 88385 68868)',
    dateAdded: '2024-05-15 08:35'
  },
  {
    id: 'ct-nithilan',
    name: 'Nithilan (in Adyar)',
    phone: '+91 98845 50457',
    cleanPhone: '919884550457',
    wardId: 'W007',
    wardName: 'Adyar',
    category: 'GENERAL_CITIZEN',
    notes: 'Twilio Verified Caller ID (+91 98845 50457) - Different location (Adyar)',
    dateAdded: '2024-05-15 08:45'
  }
];

function loadSavedContacts(): CitizenContact[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load saved citizen directory from localStorage', e);
  }
  return INITIAL_SAMPLE_CONTACTS;
}

function saveContacts(contacts: CitizenContact[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  } catch (e) {
    console.error('Failed to save citizen directory to localStorage', e);
  }
}

function loadSavedHistory(): WhatsAppDispatchRecord[] {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load WhatsApp dispatch history', e);
  }
  return [];
}

function saveHistory(history: WhatsAppDispatchRecord[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100))); // Keep last 100
  } catch (e) {
    console.error('Failed to save WhatsApp history', e);
  }
}

interface CitizenDirectoryState {
  contacts: CitizenContact[];
  dispatchHistory: WhatsAppDispatchRecord[];
  searchQuery: string;
  selectedWardFilter: string;
  selectedCategoryFilter: string;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedWardFilter: (ward: string) => void;
  setSelectedCategoryFilter: (category: string) => void;
  
  addContact: (data: { name: string; phone: string; wardName: string; category: CitizenCategory; notes?: string }) => { success: boolean; error?: string; contact?: CitizenContact };
  updateContact: (id: string, data: Partial<CitizenContact>) => void;
  deleteContact: (id: string) => void;
  
  importCsvText: (csvText: string) => { success: boolean; count: number; errors: string[] };
  resetToSample: () => void;
  clearAll: () => void;
  
  // Preset scenarios for user testing
  loadCase1Preset: () => void; // All 4 members in Royapuram (Problem location)
  loadCase2Preset: () => void; // 2 in Royapuram, 1 in Adyar (Different location), 1 in Tondiarpet
  
  // Dispatch recording & WhatsApp trigger
  recordDispatch: (record: WhatsAppDispatchRecord) => void;
  recordBatchDispatch: (records: WhatsAppDispatchRecord[]) => void;
  clearHistory: () => void;
}

export const useCitizenStore = create<CitizenDirectoryState>((set, get) => ({
  contacts: loadSavedContacts(),
  dispatchHistory: loadSavedHistory(),
  searchQuery: '',
  selectedWardFilter: 'ALL',
  selectedCategoryFilter: 'ALL',

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedWardFilter: (ward: string) => set({ selectedWardFilter: ward }),
  setSelectedCategoryFilter: (category: string) => set({ selectedCategoryFilter: category }),

  addContact: ({ name, phone, wardName, category, notes }) => {
    const { display, clean, isValid } = normalizeWhatsAppNumber(phone);
    if (!isValid || clean.length < 9) {
      return { success: false, error: 'Please enter a valid mobile number (e.g. +91 9876543210 or 9876543210)' };
    }
    if (!name.trim()) {
      return { success: false, error: 'Please enter the citizen or friend name' };
    }

    const standardizedWard = standardizeWardName(wardName);
    const wardId = getWardIdFromName(standardizedWard);

    const newContact: CitizenContact = {
      id: `ct-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      phone: display,
      cleanPhone: clean,
      wardId,
      wardName: standardizedWard,
      category: category || 'GENERAL_CITIZEN',
      notes: notes?.trim(),
      dateAdded: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    set((state) => {
      // Check for duplicate phone
      const filtered = state.contacts.filter(c => c.cleanPhone !== clean);
      const updated = [newContact, ...filtered];
      saveContacts(updated);
      return { contacts: updated };
    });

    return { success: true, contact: newContact };
  },

  updateContact: (id, data) => {
    set((state) => {
      const updated = state.contacts.map((c) => {
        if (c.id !== id) return c;
        const next = { ...c, ...data };
        if (data.phone) {
          const { display, clean, isValid } = normalizeWhatsAppNumber(data.phone);
          if (isValid) {
            next.phone = display;
            next.cleanPhone = clean;
          }
        }
        if (data.wardName) {
          next.wardName = standardizeWardName(data.wardName);
          next.wardId = getWardIdFromName(next.wardName);
        }
        return next;
      });
      saveContacts(updated);
      return { contacts: updated };
    });
  },

  deleteContact: (id) => {
    set((state) => {
      const updated = state.contacts.filter(c => c.id !== id);
      saveContacts(updated);
      return { contacts: updated };
    });
  },

  importCsvText: (csvText) => {
    const result = parseCitizenCSV(csvText);
    if (!result.success || result.contacts.length === 0) {
      return { success: false, count: 0, errors: result.errors.length ? result.errors : ['No valid contact records found in CSV'] };
    }

    set((state) => {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const newItems: CitizenContact[] = result.contacts.map((c, i) => ({
        ...c,
        id: `ct-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`,
        dateAdded: now
      }));

      // Merge by phone number deduplication
      const existingCleanPhones = new Set(newItems.map(item => item.cleanPhone));
      const remainingExisting = state.contacts.filter(c => !existingCleanPhones.has(c.cleanPhone));
      const updated = [...newItems, ...remainingExisting];
      saveContacts(updated);
      return { contacts: updated };
    });

    return { success: true, count: result.contacts.length, errors: result.errors };
  },

  resetToSample: () => {
    set({ contacts: INITIAL_SAMPLE_CONTACTS });
    saveContacts(INITIAL_SAMPLE_CONTACTS);
  },

  clearAll: () => {
    set({ contacts: [] });
    saveContacts([]);
  },

  loadCase1Preset: () => {
    // Case 1: All 4 members located in Royapuram (Problem Location)
    const case1Contacts: CitizenContact[] = [
      {
        id: 'case1-1',
        name: 'Me (Verified Primary)',
        phone: '+91 73581 89640',
        cleanPhone: '917358189640',
        wardId: 'W002',
        wardName: 'Royapuram',
        category: 'GENERAL_CITIZEN',
        notes: 'Case 1: Royapuram Problem Zone (Verified +91 73581 89640)',
        dateAdded: 'Just now'
      },
      {
        id: 'case1-2',
        name: 'Harinee',
        phone: '+91 78458 47314',
        cleanPhone: '917845847314',
        wardId: 'W002',
        wardName: 'Royapuram',
        category: 'OUTDOOR_WORKER',
        notes: 'Case 1: Royapuram Problem Zone (Verified +91 78458 47314)',
        dateAdded: 'Just now'
      },
      {
        id: 'case1-3',
        name: 'Devesh',
        phone: '+91 88385 68868',
        cleanPhone: '918838568868',
        wardId: 'W002',
        wardName: 'Royapuram',
        category: 'GIG_WORKER',
        notes: 'Case 1: Royapuram Problem Zone (Verified +91 88385 68868)',
        dateAdded: 'Just now'
      },
      {
        id: 'case1-4',
        name: 'Esp32 Temp Monitor',
        phone: '+91 90805 46938',
        cleanPhone: '919080546938',
        wardId: 'W002',
        wardName: 'Royapuram',
        category: 'OUTDOOR_WORKER',
        notes: 'Case 1: Royapuram Problem Zone (Verified +91 90805 46938)',
        dateAdded: 'Just now'
      }
    ];
    set({ contacts: case1Contacts });
    saveContacts(case1Contacts);
  },

  loadCase2Preset: () => {
    // Case 2: 3 members in Royapuram (Problem location), 1 member in Adyar (Different/Safe location)
    const case2Contacts: CitizenContact[] = [
      {
        id: 'case2-1',
        name: 'Me (Verified Primary)',
        phone: '+91 73581 89640',
        cleanPhone: '917358189640',
        wardId: 'W002',
        wardName: 'Royapuram',
        category: 'GENERAL_CITIZEN',
        notes: 'Targeted: In Problem Location (Royapuram)',
        dateAdded: 'Just now'
      },
      {
        id: 'case2-2',
        name: 'Harinee',
        phone: '+91 78458 47314',
        cleanPhone: '917845847314',
        wardId: 'W002',
        wardName: 'Royapuram',
        category: 'OUTDOOR_WORKER',
        notes: 'Targeted: In Problem Location (Royapuram)',
        dateAdded: 'Just now'
      },
      {
        id: 'case2-3',
        name: 'Nithilan (in Adyar)',
        phone: '+91 98845 50457',
        cleanPhone: '919884550457',
        wardId: 'W007',
        wardName: 'Adyar',
        category: 'GENERAL_CITIZEN',
        notes: 'Different location (Adyar) - WILL BE EXCLUDED when targeting Royapuram',
        dateAdded: 'Just now'
      },
      {
        id: 'case2-4',
        name: 'Devesh',
        phone: '+91 88385 68868',
        cleanPhone: '918838568868',
        wardId: 'W002',
        wardName: 'Royapuram',
        category: 'GIG_WORKER',
        notes: 'Targeted: In Problem Location (Royapuram)',
        dateAdded: 'Just now'
      }
    ];
    set({ contacts: case2Contacts });
    saveContacts(case2Contacts);
  },

  recordDispatch: (record) => {
    set((state) => {
      const updated = [record, ...state.dispatchHistory].slice(0, 100);
      saveHistory(updated);
      return { dispatchHistory: updated };
    });
  },

  recordBatchDispatch: (records) => {
    set((state) => {
      const updated = [...records, ...state.dispatchHistory].slice(0, 100);
      saveHistory(updated);
      return { dispatchHistory: updated };
    });
  },

  clearHistory: () => {
    set({ dispatchHistory: [] });
    saveHistory([]);
  }
}));
