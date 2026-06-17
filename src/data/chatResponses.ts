export interface ChatIntent {
  id: string;
  keywords: string[];
  response: string;
  responseSi?: string;
  quickReplies?: string[];
}

export const hasSinhala = (text: string) => /[඀-෿]/.test(text);

export const INTENTS: ChatIntent[] = [
  // ── GREETINGS ──────────────────────────────────────────────────────────────
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'ayubowan', 'vanakkam', 'start', 'help'],
    response: "Hello! Welcome to **Anura Tyres** 👋\n\nHow can I help you today?",
    responseSi: "ආයුබෝවන්! **Anura Tyres** වෙත සාදරයෙන් පිළිගනිමු 👋\n\nඅද ඔබට කෙසේ උදව් කළ හැකිද?",
    quickReplies: ['Services & pricing', 'Book appointment', 'Find branch', 'Emergency help'],
  },
  {
    id: 'good_morning',
    keywords: ['good morning', 'good afternoon', 'good evening', 'good day'],
    response: "Good morning/afternoon! ☀️ Welcome to **Anura Tyres**. How can we assist you today?",
    responseSi: "සුභ දවසක්! ☀️ **Anura Tyres** වෙත සාදරයෙන් පිළිගනිමු. අද ඔබට කෙසේ උදව් කළ හැකිද?",
    quickReplies: ['Our services', 'Book appointment', 'Find branch'],
  },
  {
    id: 'thanks',
    keywords: ['thanks', 'thank you', 'thank', 'great', 'perfect', 'awesome', 'helpful', 'appreciated'],
    response: "Thank you for contacting **Anura Tyres**! 🙏\n\nDrive safe and see you soon 🚗",
    responseSi: "**Anura Tyres** හා සම්බන්ධ වීමට ස්තූතියි! 🙏\n\nආරක්ෂාවෙන් යන්න 🚗",
    quickReplies: ['Book appointment', 'Find branch'],
  },
  {
    id: 'bye',
    keywords: ['bye', 'goodbye', 'see you', 'ok thanks', 'no thanks', "that's all", 'done'],
    response: "Thank you for choosing **Anura Tyres**! 👋\n\nDrive safe and visit us anytime. Have a great day! 🚗",
    responseSi: "**Anura Tyres** තෝරා ගැනීමට ස්තූතියි! 👋\n\nආරක්ෂාවෙන් යන්න! 🚗",
    quickReplies: ['Start new chat'],
  },

  // ── LOCATION & HOURS ───────────────────────────────────────────────────────
  {
    id: 'hours',
    keywords: ['opening hours', 'hour', 'working hours', 'what time', 'when open', 'closing time', 'open until'],
    response: "🕐 **Opening Hours:**\n\n• **Mon – Fri:** 8:00 AM – 6:00 PM\n• **Saturday:** 8:00 AM – 4:00 PM\n• **Sunday:** 9:00 AM – 2:00 PM *(essential services)*\n\n*Hours may vary by branch — call ahead to confirm.*",
    responseSi: "🕐 **විවෘත වේලාවන්:**\n\n• **සඳු – සිකු:** උදේ 8:00 – සවස 6:00\n• **සෙනසුරාදා:** 8:00 – 4:00\n• **ඉරිදා:** 9:00 – 2:00 *(අත්‍යවශ්‍ය සේවා)*\n\n*ශාඛා අනුව වෙනස් විය හැකිය.*",
    quickReplies: ['Find branch', 'Contact us', 'Book appointment'],
  },
  {
    id: 'open_today',
    keywords: ['open today', 'open now', 'are you open', 'currently open', 'open right now'],
    response: "✅ Yes, we are open today!\n\nCome visit between **8:00 AM – 6:00 PM** (Mon–Fri) or **8:00 AM – 4:00 PM** (Saturday).",
    responseSi: "✅ ඔව්, අද අපි විවෘතයි!\n\n**උදේ 8:00 – සවස 6:00** (සඳු–සිකු) හෝ **8:00 – 4:00** (සෙනසුරාදා) පැමිණෙන්න.",
    quickReplies: ['Find branch', 'Book appointment', 'Contact us'],
  },
  {
    id: 'open_sunday',
    keywords: ['sunday', 'open on sunday', 'weekend', 'sunday hours'],
    response: "☀️ **Yes! Open on Sundays.**\n\nSunday hours: **9:00 AM – 2:00 PM** for essential services.\n\n*Call ahead to confirm availability.*",
    responseSi: "☀️ **ඔව්! ඉරිදාද විවෘතයි.**\n\nඉරිදා: **9:00 – 2:00** (අත්‍යවශ්‍ය සේවා).\n\n*Availability confirm කිරීමට ඇමතීමෙ.*",
    quickReplies: ['Contact us', 'Find branch', 'Book appointment'],
  },
  {
    id: 'location',
    keywords: ['where', 'location', 'address', 'find us', 'near me', 'nearest', 'directions', 'map', 'pannipitiya', 'ratnapura', 'kalawana', 'nivithigala', 'located'],
    response: "📍 **Our Branches:**\n\n🏢 **Pannipitiya** *(Full Service)*\n278/2 High Level Rd — ☎ 077 578 5785\n\n🏢 **Ratnapura**\n151 Colombo Rd — ☎ 076 688 5885\n\n🏢 **Kalawana**\nRathnapura Road — ☎ 0777 32 95 32\n\n🏢 **Nivithigala**\nTiruwanaketiya-Agalawatte Rd — ☎ 045 227 9396",
    responseSi: "📍 **අපගේ ශාඛාවන්:**\n\n🏢 **පන්නිපිටිය** *(Full Service)*\n278/2 High Level Rd — ☎ 077 578 5785\n\n🏢 **රත්නපුර**\n151 Colombo Rd — ☎ 076 688 5885\n\n🏢 **කළවාන**\nරත්නපුර පාර — ☎ 0777 32 95 32\n\n🏢 **නිවිතිගල**\nTiruwanaketiya-Agalawatte Rd — ☎ 045 227 9396",
    quickReplies: ['View on map', 'Get directions', 'Book appointment'],
  },
  {
    id: 'branches',
    keywords: ['branch', 'branches', 'how many branch', 'another branch', 'which area'],
    response: "🏢 We have **4 branches** across Sri Lanka:\n\n1. **Pannipitiya** (Full Service) — 077 578 5785\n2. **Ratnapura** — 076 688 5885\n3. **Kalawana** — 0777 32 95 32\n4. **Nivithigala** — 045 227 9396",
    responseSi: "🏢 ශ්‍රී ලංකාව පුරා **ශාඛා 4**ක් ඇත:\n\n1. **පන්නිපිටිය** (Full Service) — 077 578 5785\n2. **රත්නපුර** — 076 688 5885\n3. **කළවාන** — 0777 32 95 32\n4. **නිවිතිගල** — 045 227 9396",
    quickReplies: ['View on map', 'Contact us', 'Book appointment'],
  },

  // ── TYRE SERVICES ──────────────────────────────────────────────────────────
  {
    id: 'tyre_fitting',
    keywords: ['tyre fitting', 'tire fitting', 'fit tyre', 'mount tyre', 'fitting price', 'fitting cost'],
    response: "🔧 **Tyre Fitting Prices:**\n\n• 13\" — LKR 300 per tyre\n• 14\" — LKR 350 per tyre\n• 15\" — LKR 400 per tyre\n• 16\"+ — LKR 500 per tyre\n\n*Tyre cost is separate. Call to confirm.*",
    responseSi: "🔧 **ටයර් සවි කිරීමේ මිල:**\n\n• 13\" — රු. 300 ටයරයකට\n• 14\" — රු. 350 ටයරයකට\n• 15\" — රු. 400 ටයරයකට\n• 16\"+ — රු. 500 ටයරයකට\n\n*ටයරය වෙනම. Confirm කිරීමට ඇමතීමෙ.*",
    quickReplies: ['Buy tyres', 'Book fitting', 'Wheel balancing', 'Find branch'],
  },
  {
    id: 'balancing',
    keywords: ['balancing', 'wheel balancing', 'balance', 'vibration', 'vibrat', 'shake', 'shaking', 'wobble'],
    response: "⚖️ **Wheel Balancing:**\n\n• LKR 250 per wheel\n• LKR 900 for all 4 wheels\n\nEliminates steering vibration. Available at **all branches**.",
    responseSi: "⚖️ **රෝදා සමතුලනය:**\n\n• රු. 250 රෝදයකට\n• රු. 900 රෝදා 4ටම\n\nSteering කම්පනය ඉවත් කරයි. **සෑම ශාඛාවකම** ලබාගත හැකිය.",
    quickReplies: ['Book service', 'Wheel alignment', 'Find branch'],
  },
  {
    id: 'alignment',
    keywords: ['alignment', 'wheel alignment', 'align', 'tracking', 'pull', 'pulling', 'drift', 'camber', 'steering'],
    response: "🎯 **Wheel Alignment:**\n\n• LKR 1,500 – LKR 2,000 depending on vehicle\n\n**Signs you need alignment:**\n• Car pulls to one side\n• Uneven tyre wear\n• Steering wheel off-center\n\nComputerized. Available at **all branches**.",
    responseSi: "🎯 **Wheel Alignment:**\n\n• රු. 1,500 – රු. 2,000 (වාහනය අනුව)\n\n**Alignment අවශ්‍ය ලකුණු:**\n• කාරය පැත්තකට ඇදෙනවා\n• ටයර් අසමාන ලෙස ගෙවෙනවා\n• Steering wheel නිවැරදි නැහැ\n\n**සෑම ශාඛාවකම** ලබාගත හැකිය.",
    quickReplies: ['Book alignment', 'Wheel balancing', 'Find branch'],
  },
  {
    id: 'buy_tyres',
    keywords: ['buy tyre', 'sell tyre', 'new tyre', 'tyre brand', 'tyre price', 'which tyre', 'tyre stock', 'apollo', 'bridgestone', 'michelin', 'ceat', 'mrf'],
    response: "🚗 We stock **premium tyres** for cars, SUVs, 3-wheelers, and 4x4 vehicles!\n\nBrands: **Apollo, CEAT, Bridgestone, MRF & Michelin**\n\nPrices from **LKR 8,500** — share your tyre size (e.g. 185/65R15) for an exact quote!",
    responseSi: "🚗 **Premium tyres** — car, SUV, 3-wheelers සහ 4x4 සඳහා!\n\nBrands: **Apollo, CEAT, Bridgestone, MRF & Michelin**\n\nමිල **රු. 8,500** සිට — ටයර් size (e.g. 185/65R15) දෙන්න, exact quote ලබාදෙමු!",
    quickReplies: ['View products', 'What size do I need?', 'Book fitting', 'Find branch'],
  },
  {
    id: 'puncture',
    keywords: ['puncture', 'flat tyre', 'flat tire', 'flat', 'puncture repair', 'nail', 'leak', 'slow leak', 'tube', 'patch'],
    response: "🔧 **Puncture Repair:**\n\n• LKR 350 – LKR 500 depending on size\n\nWe repair **tube and tubeless** tyres. Sidewall damage usually requires full replacement.\n\n✅ **Walk-ins welcome** at all branches!",
    responseSi: "🔧 **Puncture Repair:**\n\n• රු. 350 – රු. 500 (size අනුව)\n\n**Tube සහ tubeless** ටයර් දෙකම. Sidewall damage ට ටයරය මාරු කිරීම අවශ්‍ය.\n\n✅ සෑම ශාඛාවකටම **walk-in** ලැබේ!",
    quickReplies: ['Find nearest branch', 'Tyre replacement', 'Emergency help'],
  },

  // ── REPAIR SERVICES ────────────────────────────────────────────────────────
  {
    id: 'oil_change',
    keywords: ['oil change', 'engine oil', 'oil filter', 'motor oil', 'synthetic oil', 'semi synthetic', 'oil service'],
    response: "🛢️ **Oil Change Prices:**\n\n• Mineral: from **LKR 2,500** (inc. filter)\n• Semi-synthetic: from **LKR 3,500**\n• Full synthetic: from **LKR 5,000**\n\nRecommended every **5,000–10,000 km**.\nAvailable at **Pannipitiya** (Mechanix).",
    responseSi: "🛢️ **Oil Change මිල:**\n\n• Mineral: **රු. 2,500** සිට (filter සමග)\n• Semi-synthetic: **රු. 3,500** සිට\n• Full synthetic: **රු. 5,000** සිට\n\n**km 5,000–10,000** කිනුත් change කිරීම නිර්දේශ.\n**පන්නිපිටිය** (Mechanix) හි.",
    quickReplies: ['Book oil change', 'Full service', 'Find Pannipitiya'],
  },
  {
    id: 'brakes',
    keywords: ['brake', 'brakes', 'brake pad', 'disc', 'rotor', 'brake fluid', 'squeaking', 'grinding', 'stopping'],
    response: "🛑 **Brake Service:**\n\n• Pad replacement: from **LKR 3,500** per axle\n• Disc skimming: from **LKR 2,000**\n• Free brake inspection on every visit!\n\n**Signs:** squealing, grinding, soft pedal, car pulling.\n\nAvailable at **Pannipitiya** (Mechanix).",
    responseSi: "🛑 **Brake Service:**\n\n• Pad replacement: **රු. 3,500** සිට (axle)\n• Disc skimming: **රු. 2,000** සිට\n• සෑම visit කදීම නොමිලේ inspection!\n\n**Squealing, grinding, soft pedal** — ලකුණු ඇත නම් check කිරීමෙ.\n\n**පන්නිපිටිය** (Mechanix) හි.",
    quickReplies: ['Book brake service', 'Find Pannipitiya', 'Full service'],
  },
  {
    id: 'ac_service',
    keywords: ['ac', 'air condition', 'air con', 'cool', 'cooling', 'compressor', 'ac service', 'ac gas', 'aircon'],
    response: "❄️ **AC Service:**\n\n• Gas recharge: **LKR 4,500 – LKR 6,500**\n• Full AC service: from **LKR 8,000**\n  *(includes pressure check & leak test)*\n\nAvailable at **Pannipitiya** (Mechanix).",
    responseSi: "❄️ **AC Service:**\n\n• Gas recharge: **රු. 4,500 – රු. 6,500**\n• Full AC service: **රු. 8,000** සිට\n  *(pressure check & leak test ඇතුළත්)*\n\n**පන්නිපිටිය** (Mechanix) හි.",
    quickReplies: ['Book AC service', 'Find Pannipitiya', 'Full service'],
  },
  {
    id: 'full_service',
    keywords: ['full service', 'major service', 'complete service', 'general service', 'vehicle service', 'car service'],
    response: "🔩 **Full Vehicle Service — LKR 8,500+**\n\nIncludes:\n• Oil & filter change\n• Brake inspection\n• Tyre check & rotation\n• Fluid top-up\n• Safety inspection report\n\n**Book ahead to skip the queue!**",
    responseSi: "🔩 **Full Vehicle Service — රු. 8,500+**\n\nඇතුළත්:\n• Oil & filter change\n• Brake inspection\n• Tyre check & rotation\n• Fluid top-up\n• Safety inspection report\n\n**Queue skip කරන්න book කරන්න!**",
    quickReplies: ['Book service', 'Diagnostics', 'Find Pannipitiya'],
  },
  {
    id: 'suspension',
    keywords: ['suspension', 'shock absorber', 'shocks', 'strut', 'spring', 'rough ride', 'bumpy', 'pothole'],
    response: "🔩 **Suspension Service:**\n\n• Shock absorber: from **LKR 5,000** per unit\n• Free inspection included\n\nWorn shocks affect braking and handling — don't delay!\n\nAvailable at **Pannipitiya** (Mechanix).",
    responseSi: "🔩 **Suspension Service:**\n\n• Shock absorber: **රු. 5,000** සිට (unit)\n• නොමිලේ inspection ඇතුළත්\n\nWorn shocks brake හා steering ට බලපායි!\n\n**පන්නිපිටිය** (Mechanix) හි.",
    quickReplies: ['Book service', 'Find Pannipitiya', 'Full service'],
  },

  // ── ELECTRICAL ─────────────────────────────────────────────────────────────
  {
    id: 'battery',
    keywords: ['battery', 'batteries', 'dead battery', 'car battery', 'starting problem', "won't start", 'jump start', 'amaron', 'exide'],
    response: "🔋 **Battery Replacement:**\n\n• From **LKR 12,000 – LKR 22,000** (brand & CCA)\n• Brands: **Amaron, Exide & Motolite**\n• Free battery check on every visit!\n\nAvailable at **Pannipitiya** and **Ratnapura**.",
    responseSi: "🔋 **Battery Replacement:**\n\n• **රු. 12,000 – රු. 22,000** (brand & CCA)\n• Brands: **Amaron, Exide & Motolite**\n• සෑම visit කදීම නොමිලේ battery check!\n\n**පන්නිපිටිය** සහ **රත්නපුර** හි.",
    quickReplies: ['Book battery check', 'Find Pannipitiya', 'Emergency help'],
  },
  {
    id: 'electrical',
    keywords: ['electrical', 'electric', 'wiring', 'wire', 'fuse', 'short circuit', 'sensor', 'auto electric'],
    response: "🔌 **Electrical Services:**\n\n• Wiring faults & short circuits\n• Fuse and relay problems\n• Sensor replacements\n• ECU diagnostics\n\nDiagnostic scan: **LKR 1,500**\nAvailable at **Pannipitiya** (Mechanix).",
    responseSi: "🔌 **Electrical Services:**\n\n• Wiring faults & short circuits\n• Fuse සහ relay ගැටළු\n• Sensor replacements\n• ECU diagnostics\n\nDiagnostic scan: **රු. 1,500**\n**පන්නිපිටිය** (Mechanix) හි.",
    quickReplies: ['Book diagnostic', 'Find Pannipitiya', 'Check engine light'],
  },
  {
    id: 'diagnostics',
    keywords: ['diagnostic', 'diagnostics', 'scanner', 'check engine', 'warning light', 'ecu', 'obd', 'engine light', 'fault code'],
    response: "💻 **OBD Diagnostic Scan — LKR 1,500**\n\nWe identify the exact fault code and advise on repairs.\n\n**Don't panic about warning lights** — most aren't critical. Bring it in and we'll explain clearly.\n\nAvailable at **Pannipitiya** (Mechanix).",
    responseSi: "💻 **OBD Diagnostic Scan — රු. 1,500**\n\nනිශ්චිත fault code හඳුනාගෙන repairs ගැන advice.\n\n**Warning lights ගැන සිතාකල් නොවන්න** — බොහෝ critical නොවේ. ගෙනෙන්න, සෑම දෙයක්ම පැහැදිලිව කියාදෙමු.\n\n**පන්නිපිටිය** (Mechanix) හි.",
    quickReplies: ['Book diagnostic', 'Electrical faults', 'Find Pannipitiya'],
  },
  {
    id: 'lights',
    keywords: ['light', 'headlight', 'bulb', 'led', 'indicator', 'tail light', 'fog light'],
    response: "💡 **Car Light Services:**\n\n• Bulb replacement: from **LKR 500**\n• LED upgrades available\n• Headlight restoration: from **LKR 2,500**\n\nAvailable at **Pannipitiya** (Mechanix).",
    responseSi: "💡 **Car Light Services:**\n\n• Bulb replacement: **රු. 500** සිට\n• LED upgrades ලබාගත හැකිය\n• Headlight restoration: **රු. 2,500** සිට\n\n**පන්නිපිටිය** (Mechanix) හි.",
    quickReplies: ['Book service', 'Find Pannipitiya'],
  },
  {
    id: 'alloy',
    keywords: ['alloy', 'alloy wheel', 'rim', 'rims', 'mag wheel', 'wheel upgrade'],
    response: "✨ **Alloy Wheels** — upgrade your vehicle's look and performance!\n\nVariety of sizes and designs available. Our team will find the perfect fit.\n\nPrimarily at **Pannipitiya** — call **077 578 5785** for current stock.",
    responseSi: "✨ **Alloy Wheels** — රූපශ්‍රී හා performance upgrade!\n\nවිවිධ sizes සහ designs. ශාඛාවෙ team ගෙල ගෙල ගැළපෙන ඒවා සොයාදෙයි.\n\nප්‍රධාන වශයෙන් **පන්නිපිටිය** — **077 578 5785** ඇමතිය හැකිය.",
    quickReplies: ['Book consultation', 'Contact Pannipitiya', 'Find branch'],
  },

  // ── BOOKING ─────────────────────────────────────────────────────────────────
  {
    id: 'booking',
    keywords: ['book', 'booking', 'appointment', 'schedule', 'reserve', 'slot', 'make appointment', 'want to book'],
    response: "📅 **Book an Appointment** — skip the queue!\n\nBook online or call your nearest branch:\n\n📞 **Pannipitiya:** 077 578 5785\n📞 **Ratnapura:** 076 688 5885\n\nWhat service do you need?",
    responseSi: "📅 **Appointment Book කරන්න** — queue skip කරන්න!\n\nOnline book කරන්න හෝ ශාඛාවට ඇමතීමෙ:\n\n📞 **පන්නිපිටිය:** 077 578 5785\n📞 **රත්නපුර:** 076 688 5885\n\nකුමන සේවාවක් අවශ්‍යද?",
    quickReplies: ['Book online now', 'Tyre fitting', 'Full service', 'Find branch'],
    navAction: '/booking',
  },
  {
    id: 'how_long',
    keywords: ['how long', 'wait time', 'duration', 'how much time', 'takes long', 'waiting'],
    response: "⏱️ **Typical Service Times:**\n\n• Tyre fitting — 30 min\n• Wheel balancing — 30 min\n• Wheel alignment — 45 min\n• Puncture repair — 20 min\n• Oil change — 45 min\n• Full service — 2–3 hrs\n• Diagnostic scan — 1 hr\n\n*Booking ahead reduces waiting time.*",
    responseSi: "⏱️ **සාමාන්‍ය Service කාලය:**\n\n• Tyre fitting — 30 min\n• Wheel balancing — 30 min\n• Wheel alignment — 45 min\n• Puncture repair — 20 min\n• Oil change — 45 min\n• Full service — 2–3 hours\n• Diagnostic scan — 1 hr\n\n*Booking ahead wait time අඩු කරයි.*",
    quickReplies: ['Book appointment', 'Find branch'],
  },
  {
    id: 'walk_in',
    keywords: ['walk in', 'without booking', 'just come', 'can i come', 'no appointment', 'drop in'],
    response: "✅ **Yes! Walk-ins are always welcome.**\n\nHowever, booking ahead **guarantees your slot** and reduces waiting time — especially on busy days.",
    responseSi: "✅ **ඔව්! Walk-in සෑම විටෙකම ලැබේ.**\n\nකෙසේ වෙතත්, **advance booking** slot සහතික කරන අතර wait time අඩු කරයි.",
    quickReplies: ['Book appointment', 'Find branch', 'Contact us'],
  },
  {
    id: 'same_day',
    keywords: ['today', 'same day', 'urgent', 'as soon as', 'right now', 'can i come today'],
    response: "📞 **Same-Day Bookings Available!**\n\nSubject to slot availability. Call now:\n\n• **Pannipitiya:** 077 578 5785\n• **Ratnapura:** 076 688 5885\n• **Kalawana:** 0777 32 95 32",
    responseSi: "📞 **Same-Day Booking ලබාගත හැකිය!**\n\nSlot availability subject to. දැන් ඇමතීමෙ:\n\n• **පන්නිපිටිය:** 077 578 5785\n• **රත්නපුර:** 076 688 5885\n• **කළවාන:** 0777 32 95 32",
    quickReplies: ['Find branch', 'Emergency help'],
  },
  {
    id: 'waiting_area',
    keywords: ['wait', 'waiting area', 'can i stay', 'while serviced', 'sit', 'lounge', 'refreshment', 'wifi'],
    response: "☕ **Yes! Our waiting area is comfortable.**\n\n• WiFi available\n• Comfortable seating\n• Refreshments\n\nFor longer jobs we can drop you to a nearby location and call when ready! 🚗",
    responseSi: "☕ **ඔව්! Waiting area comfortable ය.**\n\n• WiFi ලබාගත හැකිය\n• Comfortable seating\n• Refreshments\n\nදිගු jobs සඳහා ළඟ ස්ථානයකට drop කර ready වූ විට ඇමතීමු! 🚗",
    quickReplies: ['Book appointment', 'How long will it take?', 'Find branch'],
  },
  {
    id: 'drop_collect',
    keywords: ['drop', 'collect', 'leave car', 'drop off', 'pick up', 'morning drop', 'leave vehicle'],
    response: "🚗 **Drop & Collect Available!**\n\nDrop your car in the morning, collect by evening. We'll call you when it's ready!\n\nJust let us know what services you need when dropping off.",
    responseSi: "🚗 **Drop & Collect Service ලබාගත හැකිය!**\n\nඋදෑසන car drop, සවස collect. Ready වූ විට ඇමතීමු!\n\nDrop-off දී අවශ්‍ය services ගැන කියාදෙන්න.",
    quickReplies: ['Book service', 'Opening hours', 'Find branch'],
  },

  // ── WARRANTY ───────────────────────────────────────────────────────────────
  {
    id: 'warranty',
    keywords: ['warranty', 'guarantee', 'how long warranty', 'warrantee'],
    response: "🛡️ **Our Warranty:**\n\n• **3-month / 5,000 km** on all labour\n• **Manufacturer's warranty** on all parts\n\nIf the same issue returns within the warranty period, we **fix it free** — just bring your job card.",
    responseSi: "🛡️ **Warranty:**\n\n• සෑම labour කටම **මාස 3 / km 5,000**\n• සෑම parts සඳහාම **manufacturer's warranty**\n\nWarranty ඇතුළත ගැටළුව නැවත ආවොත් **නොමිලේ fix** — job card ගෙනත් ෙදන්න.",
    quickReplies: ['Job card info', 'Contact branch', 'Book appointment'],
  },
  {
    id: 'comeback',
    keywords: ['comeback', 'return', 'same problem', 'problem again', 'still broken', 'not fixed'],
    response: "🔄 **We've got you covered!**\n\nIf the same issue returns within **3 months / 5,000 km**, bring your vehicle back with your **job card** and we'll fix it **at no charge**.\n\n📞 Call: **077 578 5785**",
    responseSi: "🔄 **කරදර නොවෙන්න!**\n\n**මාස 3 / km 5,000** ඇතුළත ගැටළුව නැවත ආවොත්, **job card** සමග ගෙනෙන්න — **නොමිලේ fix** කරමු.\n\n📞 **077 578 5785**",
    quickReplies: ['Contact Pannipitiya', 'Warranty info'],
  },
  {
    id: 'genuine_parts',
    keywords: ['genuine', 'original', 'fake', 'quality parts', 'oem', 'aftermarket', 'counterfeit'],
    response: "🔩 **100% Quality Parts Guaranteed.**\n\nWe use genuine OEM and quality aftermarket parts from trusted suppliers only. We **never fit substandard parts**.\n\nYour safety is our first priority.",
    responseSi: "🔩 **100% Quality Parts Guaranteed.**\n\nGenuine OEM සහ trusted suppliers වෙතින් quality aftermarket parts පමණක්. **Substandard parts කිසිසේත් fit නොකරමු**.\n\nඔබේ ආරක්ෂාව ප්‍රථම ප්‍රමුඛතාව.",
    quickReplies: ['Book service', 'Warranty info', 'Contact us'],
  },
  {
    id: 'job_card',
    keywords: ['job card', 'receipt', 'record', 'document', 'report'],
    response: "📋 **Yes! Every vehicle gets a Job Card.**\n\nIncludes:\n• All work performed\n• Parts used & costs\n• Labour charges\n• Technician's signature\n\nYou keep a copy — essential for warranty claims!",
    responseSi: "📋 **ඔව්! සෑම වාහනයකටම Job Card.**\n\nඇතුළත්:\n• සිදු කළ සියලු කාර්ය\n• Parts හා costs\n• Labour charges\n• Technician's signature\n\nCopy ඔබ ලඟ — warranty claims සඳහා!",
    quickReplies: ['Warranty info', 'Book service'],
  },

  // ── PAYMENT ────────────────────────────────────────────────────────────────
  {
    id: 'payment',
    keywords: ['pay', 'payment', 'how to pay', 'payment method', 'how can i pay'],
    response: "💳 **Payment Methods:**\n\n• 💵 **Cash**\n• 💳 **Visa / Mastercard** (debit & credit)\n• 📱 **PayHere** (online)\n• 🏦 **Bank transfer**\n\nAll payments receipted. VAT invoices available.",
    responseSi: "💳 **ගෙවීමේ ක්‍රම:**\n\n• 💵 **Cash**\n• 💳 **Visa / Mastercard**\n• 📱 **PayHere** (online)\n• 🏦 **Bank transfer**\n\nSaadem ගෙවීමකට receipt. VAT invoice request කළ හැකිය.",
    quickReplies: ['Online payment?', 'Installments?', 'Book service'],
  },
  {
    id: 'card_payment',
    keywords: ['card', 'visa', 'mastercard', 'credit card', 'debit card'],
    response: "💳 **Yes! We accept Visa & Mastercard** — both debit and credit — at all branches.",
    responseSi: "💳 **ඔව්! Visa & Mastercard** — debit සහ credit — සෑම ශාඛාවකදීම accept.",
    quickReplies: ['Other payment methods', 'Book service', 'Find branch'],
  },
  {
    id: 'online_payment',
    keywords: ['online payment', 'payhere', 'bank transfer', 'pay online', 'digital payment'],
    response: "📲 **Yes! Online payments accepted.**\n\n• **PayHere** — we send a payment link after the job\n• **Bank transfer** — details on request",
    responseSi: "📲 **ඔව්! Online ගෙවීම ලබාගත හැකිය.**\n\n• **PayHere** — job after payment link\n• **Bank transfer** — request කළ details",
    quickReplies: ['Payment methods', 'Book service', 'Contact us'],
  },
  {
    id: 'installment',
    keywords: ['installment', 'bnpl', 'split payment', 'pay later', 'credit plan'],
    response: "💰 **Installment Options Available!**\n\nFor bills over **LKR 15,000** we offer installment plans.\n\nAsk our service advisor at the branch for details.",
    responseSi: "💰 **Installment Options ලබාගත හැකිය!**\n\n**රු. 15,000** ඉක්මවූ ගාස්තු සඳහා installment. Branch service advisor ගෙන් details.",
    quickReplies: ['Payment methods', 'Find branch'],
  },
  {
    id: 'invoice',
    keywords: ['invoice', 'bill', 'vat invoice', 'tax invoice', 'get invoice'],
    response: "📄 **VAT-inclusive invoices** issued for all services.\n\nDigital copies via **email or WhatsApp** on request.",
    responseSi: "📄 **VAT-inclusive invoices** සෑම service කටම.\n\nRequest කළ **email හෝ WhatsApp** හරහා digital copy.",
    quickReplies: ['Book service', 'Payment methods'],
  },

  // ── EMERGENCY ──────────────────────────────────────────────────────────────
  {
    id: 'breakdown',
    keywords: ['broke down', 'breakdown', 'stuck', 'stranded', 'broken down', 'car broke'],
    response: "🚨 **Emergency — Call Now!**\n\n📞 **077 578 5785** (24/7 emergency line)\n\nTell us your **exact location** and describe the problem. We'll advise immediately!",
    responseSi: "🚨 **Emergency — දැන්ම ඇමතීමෙ!**\n\n📞 **077 578 5785** (24/7)\n\nඔබේ **නිශ්චිත ස්ථානය** සහ ගැටළුව කියන්න. Spot ගැනම advice ලබාදෙමු!",
    quickReplies: ['Call now', 'Tow truck', 'Find nearest branch'],
  },
  {
    id: 'flat_on_road',
    keywords: ['flat on road', 'roadside flat', 'puncture on road', 'stuck with flat'],
    response: "⚠️ **Flat tyre on the road?**\n\n1. **Pull over safely** to the roadside\n2. Turn on **hazard lights**\n3. Call: **📞 077 578 5785**\n\nWe offer roadside tyre assistance. Our team will advise on next steps!",
    responseSi: "⚠️ **Road ගාව flat tyre?**\n\n1. **Safely** roadside ට pull over\n2. **Hazard lights** on\n3. ඇමතීමෙ: **📞 077 578 5785**\n\nRoadside assistance. Team next steps ගැන advise කරයි!",
    quickReplies: ['Call now', 'Find nearest branch', 'Tow truck'],
  },
  {
    id: 'wont_start',
    keywords: ["won't start", 'wont start', 'not starting', 'dead car', 'crank', 'ignition', 'engine wont start'],
    response: "🔋 **Car won't start?**\n\nUsually a **battery or starter motor** issue.\n\n📞 Call: **077 578 5785**\n\nWe can arrange **jump-start or towing** to our garage.",
    responseSi: "🔋 **Car start නොවෙනවාද?**\n\nසාමාන්‍යයෙන් **battery හෝ starter motor** ගැටළුවකි.\n\n📞 **077 578 5785**\n\n**Jump-start හෝ towing** arrange කළ හැකිය.",
    quickReplies: ['Call now', 'Battery replacement', 'Tow truck'],
  },
  {
    id: 'tow_truck',
    keywords: ['tow', 'towing', 'tow truck', 'recovery', 'drag', 'breakdown recovery'],
    response: "🚛 **Tow / Recovery Service:**\n\n📞 **077 578 5785** — call immediately\n\nShare your **exact location** (GPS if possible) and we'll arrange towing to our nearest garage.",
    responseSi: "🚛 **Tow / Recovery Service:**\n\n📞 **077 578 5785** — දැන්ම ඇමතීමෙ\n\nඔබේ **GPS location** (හැකි නම්) දෙන්න — ළඟම garage ට towing arrange කරමු.",
    quickReplies: ['Call now', 'Find nearest branch'],
  },
  {
    id: 'overheat',
    keywords: ['overheat', 'overheating', 'temperature', 'hot', 'smoke', 'steam', 'radiator', 'engine hot'],
    response: "⚠️ **Engine overheating — act now!**\n\n1. **Pull over immediately**\n2. **Turn off the engine**\n3. Do **NOT** open the bonnet yet — wait to cool\n4. Call: **📞 077 578 5785**\n\nIgnoring overheating causes **serious engine damage!**",
    responseSi: "⚠️ **Engine overheat — දැන්ම!**\n\n1. **වහාම pull over**\n2. **Engine off**\n3. Bonnet **දැන් විවෘත නොකරන්න** — cool වෙන්නදෙන්න\n4. **📞 077 578 5785**\n\nNosalakā haruvot **engine damage**!",
    quickReplies: ['Call now', 'Diagnostics', 'Tow truck'],
  },

  // ── VEHICLE ADVICE ─────────────────────────────────────────────────────────
  {
    id: 'service_interval',
    keywords: ['how often', 'service interval', 'when to service', 'service schedule', 'next service', 'when service'],
    response: "📖 **Recommended Service Intervals:**\n\n• **Mineral oil:** every 5,000 km or 6 months\n• **Synthetic oil:** every 10,000 km or 12 months\n\nCheck your **owner's manual** for your specific model. We'll advise for free!",
    responseSi: "📖 **Service Intervals:**\n\n• **Mineral oil:** km 5,000 හෝ මාස 6\n• **Synthetic oil:** km 10,000 හෝ මාස 12\n\nNiශ්චිතව **owner's manual** බලන්න. Doubt නම් නොමිලේ advice!",
    quickReplies: ['Book service', 'Oil change pricing', 'Full service'],
  },
  {
    id: 'tyre_size',
    keywords: ['tyre size', 'what size', 'which size', 'my tyre size', 'tyre measurement'],
    response: "📏 **Finding Your Tyre Size:**\n\nYour tyre size is printed on the **sidewall** (e.g. **185/65R15**).\n\nAlso check the **door jamb sticker** or **fuel cap cover**.\n\nShare the size for an exact quote! 🚗",
    responseSi: "📏 **ටයර් Size සොයා ගන්නේ:**\n\nSize **ටයරයේ sidewall** ගාව ඇත (e.g. **185/65R15**).\n\n**Door jamb sticker** හෝ **fuel cap** ගාව ද ඇත.\n\nSize දෙන්න — exact quote! 🚗",
    quickReplies: ['Get tyre quote', 'View products', 'Book fitting'],
  },
  {
    id: 'brake_check',
    keywords: ['brake check', 'when change brake', 'brake worn', 'brake signs', 'need brake'],
    response: "🛑 **Signs Your Brakes Need Attention:**\n\n🔴 Squealing or grinding noise\n🔴 Car pulls to one side\n🔴 Soft or spongy pedal\n🔴 Vibration when braking\n🔴 Brake warning light on\n\nCome in for a **free brake inspection** — don't wait!",
    responseSi: "🛑 **Brake Attention ලැබිය යුතු ලකුණු:**\n\n🔴 Squealing/grinding ශබ්ද\n🔴 Car පැත්තකට ඇදෙනවා\n🔴 Pedal soft/spongy\n🔴 Brake දිවදී vibration\n🔴 Warning light on\n\n**නොමිලේ inspection** — delay නොකරන්න!",
    quickReplies: ['Book brake check', 'Brake pricing', 'Find branch'],
  },
  {
    id: 'tyre_pressure',
    keywords: ['tyre pressure', 'psi', 'inflate', 'air pressure', 'check pressure', 'air in tyre', 'low pressure'],
    response: "💨 **Tyre Pressure:**\n\nMost cars use **30–35 PSI** (check your door jamb sticker for exact spec).\n\n✅ We **check and inflate free** at every visit!\n\nCheck when tyres are **cold** for the most accurate reading.",
    responseSi: "💨 **Tyre Pressure:**\n\nBest cars **30–35 PSI** (door jamb sticker ගාව exact spec).\n\n✅ සෑම visit දීම **නොමිලේ check සහ inflate**!\n\nTyres **cold** (පැය 3+ drive නොකළ) වූ විට check කළ accurate.",
    quickReplies: ['Visit branch', 'Tyre fitting', 'Find branch'],
  },
  {
    id: 'car_noise',
    keywords: ['noise', 'sound', 'rattle', 'squeak', 'knock', 'clunk', 'grinding sound', 'strange sound', 'vibrating'],
    response: "🔍 **Strange noise from your car?**\n\nBring it in for a **free inspection** — describe:\n• When the noise happens (braking, turning, speed)\n• Where it seems to come from\n\nOur technicians will diagnose it accurately.",
    responseSi: "🔍 **නොදන්නා ශබ්දයක්?**\n\n**නොමිලේ inspection** සඳහා ගෙනෙන්න — describe කරන්න:\n• ශබ්ද එන වේලාව (brake, turn, speed)\n• ශබ්ද දිශාව\n\nTechnicians diagnose කරයි.",
    quickReplies: ['Book inspection', 'Diagnostics', 'Find branch'],
  },

  // ── CONTACT & TRUCKS ───────────────────────────────────────────────────────
  {
    id: 'contact',
    keywords: ['contact', 'phone number', 'call', 'number', 'whatsapp', 'email', 'reach', 'hotline', 'contact us'],
    response: "📞 **Contact Our Branches:**\n\n• **Pannipitiya:** 077 578 5785\n• **Ratnapura:** 076 688 5885\n• **Kalawana:** 0777 32 95 32\n• **Nivithigala:** 045 227 9396\n\nVisit our **Contact page** for WhatsApp details.",
    responseSi: "📞 **ශාඛා Contact:**\n\n• **පන්නිපිටිය:** 077 578 5785\n• **රත්නපුර:** 076 688 5885\n• **කළවාන:** 0777 32 95 32\n• **නිවිතිගල:** 045 227 9396\n\nWhatsApp details සඳහා **Contact page**.",
    quickReplies: ['Go to Contact page', 'Find branch', 'Book appointment'],
  },
  {
    id: 'truck_bus',
    keywords: ['truck', 'bus', 'lorry', 'heavy vehicle', 'commercial', 'fleet', 'transport'],
    response: "🚛 **Truck & Bus Services:**\n\n• Heavy-duty tyre fitting\n• Fleet maintenance contracts\n• Suspension & brake overhaul\n• Commercial diagnostics\n\nFor **fleet pricing & bulk orders**: 📞 **077 578 5785**",
    responseSi: "🚛 **Truck & Bus Services:**\n\n• Heavy-duty tyre fitting\n• Fleet maintenance contracts\n• Suspension & brake overhaul\n• Commercial diagnostics\n\n**Fleet pricing & bulk orders**: 📞 **077 578 5785**",
    quickReplies: ['Call for fleet quote', 'Find branch', 'Contact us'],
  },
];

export const FALLBACK: Record<'en' | 'si', string[]> = {
  en: [
    "Sorry, I didn't quite understand that 😊\n\nYou can:\n📞 **Call:** 077 578 5785\n💬 **WhatsApp:** 077 578 5785\n\nOr ask about: **services**, **pricing**, **branches**, or **bookings**",
    "I'm not sure about that! For specific queries, please **call or visit your nearest branch** — they'll be happy to help 🙏\n\n📞 Pannipitiya: **077 578 5785**",
  ],
  si: [
    "සමාවෙන්න, ඔබ කීවේ නොතේරිණි 😊\n\n📞 **ඇමතීමෙ:** 077 578 5785\n💬 **WhatsApp:** 077 578 5785\n\nහෝ **services**, **pricing**, **branches**, **bookings** ගැන අසන්න",
    "ඒ ගැටළුවට **branch team** හොඳින් help කරනු ඇත 🙏\n\n📞 **077 578 5785**",
  ],
};

export const WELCOME: Record<'en' | 'si', string> = {
  en: "👋 Hi! I'm the **Anura Tyres Assistant**.\n\nAsk me anything about tyres, services, pricing, bookings, or branches — in **English or Sinhala** 🇱🇰",
  si: "👋 ආයුබෝවන්! මම **Anura Tyres Assistant**.\n\n** සිංහල හෝ English** ෙ ටයර්, සේවා, මිල, bookings හෝ branches ගැන ඕනෑම දෙයක් අසන්න 🇱🇰",
};

export const NAV_LINKS: Record<string, string> = {
  'Book online now': '/booking',
  'View products': '/products',
  'View on map': '/branches',
  'Get directions': '/branches',
  'Find Pannipitiya': '/branches',
  'Find branch': '/branches',
  'Find nearest branch': '/branches',
  'Our services': '/services',
  'Services & pricing': '/services',
  'Go to Contact page': '/contact',
};
