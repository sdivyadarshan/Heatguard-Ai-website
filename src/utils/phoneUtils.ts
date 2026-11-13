import { CitizenContact } from '../types';

/**
 * Normalizes phone numbers to standard WhatsApp format (digits only with country code)
 * Defaults to +91 (India) if 10-digit number is provided
 */
export function normalizeWhatsAppNumber(raw: string): { display: string; clean: string; isValid: boolean } {
  if (!raw) return { display: '', clean: '', isValid: false };

  // Strip all non-digit characters except leading +
  let cleaned = raw.trim().replace(/[^\d+]/g, '');

  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // If 10 digits (standard Indian mobile e.g. 9876543210), prepend 91
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    cleaned = `91${cleaned}`;
  }

  // Check if valid international mobile (usually 10-15 digits)
  const isValid = /^\d{10,15}$/.test(cleaned);

  // Format display phone
  let display = raw.trim();
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    display = `+91 ${cleaned.substring(2, 7)} ${cleaned.substring(7)}`;
  } else if (!display.startsWith('+') && cleaned.length > 0) {
    display = `+${cleaned}`;
  }

  return {
    display,
    clean: cleaned,
    isValid
  };
}

/**
 * Parses CSV text to extract citizen contacts with ward assignment
 */
export function parseCitizenCSV(csvContent: string): {
  success: boolean;
  contacts: Omit<CitizenContact, 'id' | 'dateAdded'>[];
  errors: string[];
  totalParsed: number;
} {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) {
    return { success: false, contacts: [], errors: ['CSV file is empty'], totalParsed: 0 };
  }

  const errors: string[] = [];
  const contacts: Omit<CitizenContact, 'id' | 'dateAdded'>[] = [];

  // Parse header
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map(h => h.toLowerCase().trim().replace(/['"]/g, ''));

  // Find column indices
  let nameIdx: number = headers.findIndex(h => h.includes('name') || h.includes('citizen') || h.includes('person'));
  let phoneIdx: number = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('contact') || h.includes('cell') || h.includes('number') || h.includes('whatsapp'));
  let wardIdx: number = headers.findIndex(h => h.includes('ward') || h.includes('location') || h.includes('area') || h.includes('zone') || h.includes('city') || h.includes('place'));
  let catIdx: number = headers.findIndex(h => h.includes('cat') || h.includes('role') || h.includes('type') || h.includes('demographic') || h.includes('occupation'));
  let notesIdx: number = headers.findIndex(h => h.includes('note') || h.includes('remark') || h.includes('tag'));

  // Fallbacks if header line doesn't match standard names or if header is just row 1
  if (phoneIdx === -1 && lines.length > 1) {
    // If no header found, inspect row 1 to guess column types
    const firstRow = parseCSVLine(lines[0]);
    let detectedPhoneIdx = -1;
    for (let idx = 0; idx < firstRow.length; idx++) {
      const { isValid } = normalizeWhatsAppNumber(firstRow[idx]);
      if (isValid) {
        detectedPhoneIdx = idx;
        break;
      }
    }
    if (detectedPhoneIdx !== -1) {
      phoneIdx = detectedPhoneIdx;
    }
    if (nameIdx === -1) {
      nameIdx = phoneIdx !== 0 ? 0 : 1;
    }
    if (wardIdx === -1) {
      wardIdx = phoneIdx === 1 || nameIdx === 1 ? 2 : 1;
    }
  }

  const startIndex = (nameIdx !== -1 || phoneIdx !== -1) && isHeaderRow(headers) ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    const cols = parseCSVLine(rawLine);
    if (cols.length === 0) continue;

    const rawName = nameIdx !== -1 && cols[nameIdx] ? cols[nameIdx].trim() : `Citizen ${i + 1}`;
    const rawPhone = phoneIdx !== -1 && cols[phoneIdx] ? cols[phoneIdx].trim() : cols.find(c => /\d{7,}/.test(c)) || '';
    const rawWard = wardIdx !== -1 && cols[wardIdx] ? cols[wardIdx].trim() : 'Royapuram';
    const rawCat = catIdx !== -1 && cols[catIdx] ? cols[catIdx].trim().toUpperCase() : 'GENERAL_CITIZEN';
    const rawNotes = notesIdx !== -1 && cols[notesIdx] ? cols[notesIdx].trim() : '';

    const { display, clean, isValid } = normalizeWhatsAppNumber(rawPhone);

    if (!isValid || clean.length < 9) {
      errors.push(`Row ${i + 1}: Invalid or missing phone number "${rawPhone}"`);
      continue;
    }

    // Map Category
    let category: CitizenContact['category'] = 'GENERAL_CITIZEN';
    const catStr = rawCat.toLowerCase();
    if (catStr.includes('outdoor') || catStr.includes('labor') || catStr.includes('construct') || catStr.includes('port')) {
      category = 'OUTDOOR_WORKER';
    } else if (catStr.includes('gig') || catStr.includes('delivery') || catStr.includes('driver') || catStr.includes('transport')) {
      category = 'GIG_WORKER';
    } else if (catStr.includes('elder') || catStr.includes('senior') || catStr.includes('geriatric') || catStr.includes('old') || catStr.includes('60')) {
      category = 'ELDERLY';
    } else if (catStr.includes('volunteer') || catStr.includes('emergency') || catStr.includes('responder') || catStr.includes('asha')) {
      category = 'EMERGENCY_VOLUNTEER';
    }

    // Standardize Ward
    const wardName = standardizeWardName(rawWard);
    const wardId = getWardIdFromName(wardName);

    contacts.push({
      name: rawName.replace(/^["']|["']$/g, ''),
      phone: display,
      cleanPhone: clean,
      wardId,
      wardName,
      category,
      notes: rawNotes.replace(/^["']|["']$/g, '') || undefined
    });
  }

  return {
    success: contacts.length > 0,
    contacts,
    errors,
    totalParsed: contacts.length
  };
}

function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if ((char === ',' || char === '\t' || char === ';') && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function isHeaderRow(cols: string[]): boolean {
  return cols.some(c => 
    c.includes('name') || 
    c.includes('phone') || 
    c.includes('ward') || 
    c.includes('mobile') || 
    c.includes('contact') || 
    c.includes('location')
  );
}

export function standardizeWardName(raw: string): string {
  const cleaned = raw.toLowerCase().trim();
  if (cleaned.includes('tondiar') || cleaned.includes('w001') || cleaned.includes('38')) return 'Tondiarpet';
  if (cleaned.includes('roya') || cleaned.includes('w002') || cleaned.includes('49')) return 'Royapuram';
  if (cleaned.includes('thiru') || cleaned.includes('vika') || cleaned.includes('w003')) return 'Thiru. Vi. Ka Nagar';
  if (cleaned.includes('anna') || cleaned.includes('w004')) return 'Anna Nagar';
  if (cleaned.includes('teynam') || cleaned.includes('w005')) return 'Teynampet';
  if (cleaned.includes('kodam') || cleaned.includes('w006')) return 'Kodambakkam';
  if (cleaned.includes('adyar') || cleaned.includes('w007') || cleaned.includes('170')) return 'Adyar';
  if (cleaned.includes('perun') || cleaned.includes('w008')) return 'Perungudi';
  if (cleaned.includes('shol') || cleaned.includes('w009')) return 'Sholinganallur';
  if (cleaned.includes('alan') || cleaned.includes('w010')) return 'Alandur';
  if (cleaned.includes('tiruvot') || cleaned.includes('w011')) return 'Tiruvottiyur';
  if (cleaned.includes('manali') || cleaned.includes('w012') || cleaned.includes('15')) return 'Manali';
  if (cleaned.includes('madhava') || cleaned.includes('w013')) return 'Madhavaram';
  if (cleaned.includes('ambat') || cleaned.includes('w014')) return 'Ambattur';
  if (cleaned.includes('valasa') || cleaned.includes('w015')) return 'Valasaravakkam';
  if (cleaned.includes('myla') || cleaned.includes('w016') || cleaned.includes('122')) return 'Mylapore';
  if (cleaned.includes('george') || cleaned.includes('central') || cleaned.includes('w017') || cleaned.includes('58')) return 'Central / George Town';

  // Capitalize word
  return raw.trim() || 'Royapuram';
}

export function getWardIdFromName(name: string): string {
  const map: Record<string, string> = {
    'Tondiarpet': 'W001',
    'Royapuram': 'W002',
    'Thiru. Vi. Ka Nagar': 'W003',
    'Anna Nagar': 'W004',
    'Teynampet': 'W005',
    'Kodambakkam': 'W006',
    'Adyar': 'W007',
    'Perungudi': 'W008',
    'Sholinganallur': 'W009',
    'Alandur': 'W010',
    'Tiruvottiyur': 'W011',
    'Manali': 'W012',
    'Madhavaram': 'W013',
    'Ambattur': 'W014',
    'Valasaravakkam': 'W015',
    'Mylapore': 'W016',
    'Central / George Town': 'W017'
  };
  return map[name] || 'W002';
}

export function generateSampleCsv(): string {
  return `Name,Phone,Ward,Category,Notes
Senthil Kumar,+91 98765 43210,Royapuram,Outdoor Worker,Port labor group lead
Praveen Raj,+91 98765 43211,Royapuram,Gig Worker,Swiggy / Zomato courier
Ananya Sharma,+91 98765 43212,Royapuram,Elderly,Senior citizen resident
Kavitha Raman,+91 98765 43213,Adyar,General Citizen,Safe coastal zone friend
Manoj Sundaram,+91 98765 43214,Tondiarpet,Outdoor Worker,Construction site supervisor
Deepak Venkat,+91 98765 43215,Anna Nagar,General Citizen,Central residential`;
}
