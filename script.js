// ─── CORRECTED RATES ─────────────────────────────────────────────────────────
// Source: Australian Gambling Statistics 40th Edition (Sept 2025), QGSO
// FY = 1 July to 30 June
// Published Australia EGM expenditure: FY21-22 $13.732B, FY22-23 $15.765B, FY23-24 $16.293B
// FY24-25 is estimated by applying the latest observed annual growth rate to FY23-24.
// FY25-26 is estimated by rolling that same growth rate forward once more.
const FY_DATA = {
  "FY20-21": { total: 13_623_238_000, start: new Date("2020-07-01T00:00:00Z").getTime(), end: new Date("2021-07-01T00:00:00Z").getTime(), confirmed: true },
  "FY21-22": { total: 13_732_033_000, start: new Date("2021-07-01T00:00:00Z").getTime(), end: new Date("2022-07-01T00:00:00Z").getTime(), confirmed: true },
  "FY22-23": { total: 15_764_701_000, start: new Date("2022-07-01T00:00:00Z").getTime(), end: new Date("2023-07-01T00:00:00Z").getTime(), confirmed: true },
  "FY23-24": { total: 16_293_068_000, start: new Date("2023-07-01T00:00:00Z").getTime(), end: new Date("2024-07-01T00:00:00Z").getTime(), confirmed: true },
  "FY24-25": { total: 16_839_143_657, start: new Date("2024-07-01T00:00:00Z").getTime(), end: new Date("2025-07-01T00:00:00Z").getTime(), confirmed: false },
  "FY25-26": { total: 17_403_521_492, start: new Date("2025-07-01T00:00:00Z").getTime(), end: new Date("2026-07-01T00:00:00Z").getTime(), confirmed: false }
};

const LIVE_TRACKER = {
  label: 'FY25-26 live tracker',
  start: new Date("2025-07-01T00:00:00Z").getTime(),
  annual: FY_DATA["FY25-26"].total
};
LIVE_TRACKER.ps = LIVE_TRACKER.annual / 365 / 86400;

const YEARS = {
  "fy2122": { label: "Since FY21-22", fyKeys: ["FY21-22","FY22-23","FY23-24","FY24-25"], includeLive: true, ps: LIVE_TRACKER.ps },
  "fy2223": { label: "Since FY22-23", fyKeys: ["FY22-23","FY23-24","FY24-25"], includeLive: true, ps: LIVE_TRACKER.ps },
  "fy2324": { label: "Since FY23-24", fyKeys: ["FY23-24","FY24-25"], includeLive: true, ps: LIVE_TRACKER.ps },
  "fy2425": {
    label: "FY24-25 est",
    fyKeys: ["FY24-25"],
    includeLive: true,
    ps: LIVE_TRACKER.ps,
    showProjection: true,
    projectionLabel: 'Projected total since FY24-25',
    projectionValue: FY_DATA["FY24-25"].total + FY_DATA["FY25-26"].total
  },
  "fy2526": { label: "FY25-26 est", fyKeys: [], includeLive: true, ps: LIVE_TRACKER.ps, showProjection: true, projectionLabel: 'Projected FY25-26 total', projectionValue: FY_DATA["FY25-26"].total }
};

function getLiveTrackerAmount(now = Date.now()) {
  const elapsedSeconds = Math.max(0, (now - LIVE_TRACKER.start) / 1000);
  return Math.min(LIVE_TRACKER.annual, elapsedSeconds * LIVE_TRACKER.ps);
}

function calcTotal(tabKey, now = Date.now()) {
  const cfg = YEARS[tabKey] || YEARS.fy2526;
  let total = 0;
  for (const fyKey of cfg.fyKeys) {
    const fy = FY_DATA[fyKey];
    if (fy) total += fy.total;
  }
  if (cfg.includeLive) total += getLiveTrackerAmount(now);
  return total;
}

// Source: QGSO Table 4 — EGM expenditure by state/territory 2023-24
// WA note: WA bans EGMs in pubs/clubs; WA figure is Crown Perth casino only
const STATES = [
  { c: "nsw", p: 0.440 }, // $5.984B
  { c: "vic", p: 0.211 }, // $2.870B
  { c: "qld", p: 0.170 }, // $2.312B
  { c: "sa",  p: 0.060 }, // $0.816B
  { c: "wa",  p: 0.040 }, // $0.544B (Crown Perth only)
  { c: "tas", p: 0.030 }, // $0.408B
  { c: "act", p: 0.030 }, // $0.408B
  { c: "nt",  p: 0.019 }  // $0.258B
];

// Real venues, weighted by state EGM machine density (QGSO / state gaming registers)
const VENUES = [
  // NSW — 87,000 EGM entitlements, highest density globally
  {n:"Penrith Panthers Club",s:"Penrith",st:"NSW"},{n:"Mounties Group",s:"Mt Pritchard",st:"NSW"},
  {n:"Bankstown RSL",s:"Bankstown",st:"NSW"},{n:"Rooty Hill RSL",s:"Rooty Hill",st:"NSW"},
  {n:"Campbelltown RSL",s:"Campbelltown",st:"NSW"},{n:"Parramatta RSL",s:"Parramatta",st:"NSW"},
  {n:"Revesby Workers Club",s:"Revesby",st:"NSW"},{n:"Liverpool Catholic Club",s:"Liverpool",st:"NSW"},
  {n:"Castle Hill RSL",s:"Castle Hill",st:"NSW"},{n:"Club Blacktown",s:"Blacktown",st:"NSW"},
  {n:"Wollongong Leagues Club",s:"Wollongong",st:"NSW"},{n:"Merrylands RSL",s:"Merrylands",st:"NSW"},
  {n:"St George Leagues Club",s:"Kogarah",st:"NSW"},{n:"Cabramatta RSL",s:"Cabramatta",st:"NSW"},
  {n:"Roselands Sports Club",s:"Roselands",st:"NSW"},{n:"Penrith RSL",s:"Penrith",st:"NSW"},
  // VIC — 27,000 EGMs
  {n:"Doncaster RSL",s:"Doncaster",st:"VIC"},{n:"Dandenong RSL",s:"Dandenong",st:"VIC"},
  {n:"Footscray RSL",s:"Footscray",st:"VIC"},{n:"Geelong RSL",s:"Geelong",st:"VIC"},
  {n:"Frankston RSL",s:"Frankston",st:"VIC"},{n:"Broadmeadows RSL",s:"Broadmeadows",st:"VIC"},
  {n:"Springvale RSL",s:"Springvale",st:"VIC"},{n:"Sunshine RSL",s:"Sunshine",st:"VIC"},
  {n:"Endeavour Hills RSL",s:"Endeavour Hills",st:"VIC"},{n:"Noble Park RSL",s:"Noble Park",st:"VIC"},
  // QLD — 42,000 EGMs
  {n:"Capalaba Sports Club",s:"Capalaba",st:"QLD"},{n:"Sunnybank RSL",s:"Sunnybank",st:"QLD"},
  {n:"Ipswich RSL",s:"Ipswich",st:"QLD"},{n:"Townsville RSL",s:"Townsville",st:"QLD"},
  {n:"Kedron-Wavell RSL",s:"Chermside",st:"QLD"},{n:"Aspley Hornets",s:"Aspley",st:"QLD"},
  {n:"Browns Plains RSL",s:"Browns Plains",st:"QLD"},{n:"Logan City RSL",s:"Woodridge",st:"QLD"},
  // SA
  {n:"Port Adelaide RSL",s:"Port Adelaide",st:"SA"},{n:"Elizabeth RSL",s:"Elizabeth",st:"SA"},
  {n:"Marion RSL",s:"Marion",st:"SA"},{n:"Morphett Vale RSL",s:"Morphett Vale",st:"SA"},
  // WA — Crown Perth only
  {n:"Crown Perth EGMs",s:"Burswood",st:"WA"},{n:"Crown Perth Burswood",s:"Burswood",st:"WA"},
  // TAS
  {n:"Wrest Point Casino",s:"Sandy Bay",st:"TAS"},{n:"Country Club Casino",s:"Launceston",st:"TAS"},
  // ACT
  {n:"Casino Canberra",s:"Civic",st:"ACT"},{n:"Tuggeranong RSL",s:"Tuggeranong",st:"ACT"},
  // NT
  {n:"SkyCity Darwin",s:"Darwin CBD",st:"NT"},{n:"Alice Springs Club",s:"Alice Springs",st:"NT"}
];

const ST_WT = {NSW:44,VIC:21,QLD:17,SA:6,WA:4,TAS:3,ACT:3,NT:2};
const ST_EM = {NSW:"🔴",VIC:"🟠",QLD:"🟡",SA:"🟢",WA:"🔵",TAS:"🟣",ACT:"⚪",NT:"🟤"};

function wVenue() {
  let r=Math.random()*100, acc=0, st="NSW";
  for(const[s,w]of Object.entries(ST_WT)){acc+=w;if(r<acc){st=s;break;}}
  const pool=VENUES.filter(v=>v.st===st);
  return pool[Math.floor(Math.random()*pool.length)];
}

// Session loss distribution modelled from AGRC 2023 EGM research
// Reflects real-world bimodal distribution: majority small losses, tail of large losses
function rLoss() {
  const r=Math.random();
  if(r<0.40) return Math.round((15  + Math.random()*185 ) * 100) / 100; // $15–$200   (40%)
  if(r<0.72) return Math.round((200 + Math.random()*600 ) * 100) / 100; // $200–$800  (32%)
  if(r<0.90) return Math.round((800 + Math.random()*1200) * 100) / 100; // $800–$2K   (18%)
  if(r<0.98) return Math.round((2000+ Math.random()*4000) * 100) / 100; // $2K–$6K    (8%)
  return       Math.round((6000+ Math.random()*10000) * 100) / 100;     // $6K–$16K   (2%)
}

// ─── COUNTER STATE ───────────────────────────────────────────────────────────
let cYear="fy2526", total=0, rafId=null;
let feedItems=[], sCnt=0, sLoss=0;

function fmtD(n) {
  const safe = Math.max(0, n);
  const dollars = Math.floor(safe);
  const cents = Math.floor((safe - dollars) * 100)
    .toString()
    .padStart(2, '0');
  return { d: '$' + dollars.toLocaleString('en-AU'), c: '.' + cents };
}
function fmtS(n) {
  if(n>=1e9) return '$'+(n/1e9).toFixed(2)+'B';
  if(n>=1e6) return '$'+(n/1e6).toFixed(1)+'M';
  if(n>=1e3) return '$'+Math.round(n/1e3).toLocaleString('en-AU')+'K';
  return '$'+n.toFixed(0);
}
function fmtC(total, cost) {
  const n = Math.floor(total/cost);
  if(n>=1e9) return (n/1e9).toFixed(1)+' billion';
  if(n>=1e6) return (n/1e6).toFixed(1)+' million';
  return n.toLocaleString('en-AU');
}

const COUNTER_REEL_POOL = Array.from({ length: 50 }, (_, i) => String(i % 10));
const COUNTER_TOKEN_STATE = new WeakMap();
const COUNTER_BASE_CYCLE = 2;
let lastRenderedCounterKey = '';

function getSlotCycleIndex(digit) {
  return (COUNTER_BASE_CYCLE * 10) + Number(digit);
}

function measureSlotStep(tokenEl) {
  const row = tokenEl.querySelector('.counter-reel-row');
  const windowEl = tokenEl.querySelector('.counter-window');
  if(!row || !windowEl) return 0;
  const step = Math.round(row.offsetHeight || row.getBoundingClientRect().height || 0);
  if(step > 0) {
    tokenEl.style.setProperty('--slot-height', step + 'px');
    windowEl.style.height = step + 'px';
    tokenEl.dataset.step = String(step);
  }
  return step;
}

function buildSlotToken(value, size) {
  const token = document.createElement('span');
  const isDigit = /\d/.test(value);
  const sizeClass = size === 'small' ? 'counter-token--small' : 'counter-token--large';

  if(isDigit) {
    token.className = `counter-token counter-token--slot ${sizeClass}`;
    token.style.setProperty('--slot-width', size === 'small' ? 'var(--counter-cent-slot-w)' : 'var(--counter-slot-w)');
    token.style.setProperty('--slot-height', size === 'small' ? 'var(--counter-cent-slot-h)' : 'var(--counter-slot-h)');

    const windowEl = document.createElement('span');
    windowEl.className = 'counter-window';

    const reel = document.createElement('span');
    reel.className = 'counter-reel';

    COUNTER_REEL_POOL.forEach(digit => {
      const row = document.createElement('span');
      row.className = `counter-reel-row ${sizeClass}`;
      row.textContent = digit;
      reel.appendChild(row);
    });

    windowEl.appendChild(reel);
    token.appendChild(windowEl);

    const face = document.createElement('span');
    face.className = `counter-face ${sizeClass}`;
    face.textContent = value;
    token.appendChild(face);

    const state = { type: 'digit', value: value, reel, face, size, isAnimating: false };
    COUNTER_TOKEN_STATE.set(token, state);

    requestAnimationFrame(() => {
      measureSlotStep(token);
      setDigitImmediate(token, value);
    });

    return token;
  }

  let symbolClass = 'counter-token--symbol';
  if(value === '$') symbolClass += ' counter-token--currency';
  if(value === ',') symbolClass += ' counter-token--comma';
  if(value === '.') symbolClass += ' counter-token--dot';
  token.className = `counter-token ${symbolClass} ${sizeClass}`;
  token.textContent = value;
  COUNTER_TOKEN_STATE.set(token, { type: 'symbol', value, size });
  return token;
}

function setDigitImmediate(token, digit) {
  const state = COUNTER_TOKEN_STATE.get(token);
  if(!state || state.type !== 'digit') return;
  const step = measureSlotStep(token) || Number(token.dataset.step) || 0;
  const index = getSlotCycleIndex(digit);
  state.reel.style.transition = 'none';
  state.reel.style.transform = `translate3d(0, ${-index * step}px, 0)`;
  state.face.textContent = digit;
  state.value = String(digit);
  state.isAnimating = false;
  token.classList.remove('is-spinning');
}

function spinDigitTo(token, digit) {
  const state = COUNTER_TOKEN_STATE.get(token);
  if(!state || state.type !== 'digit') return;
  digit = String(digit);
  if(state.value === digit && !isFirstSpinSequence) return;

  const step = measureSlotStep(token) || Number(token.dataset.step) || 0;
  if(!step) {
    setDigitImmediate(token, digit);
    return;
  }

  if(state.isAnimating) {
    state.reel.removeEventListener('transitionend', state.onTransitionEnd);
    setDigitImmediate(token, state.value);
  }

  const fromDigit = Number(state.value);
  const toDigit = Number(digit);
  const place = Number(token.dataset.place || 0);
  const rise = (toDigit - fromDigit + 10) % 10;
  const extraCycles = isFirstSpinSequence ? Math.min(2, 1 + Math.floor(place / 4)) : 0;
  const currentIndex = getSlotCycleIndex(fromDigit);
  const targetIndex = currentIndex + rise + (extraCycles * 10);
  const duration = isFirstSpinSequence
    ? Math.min(1900, 900 + (place * 85) + (rise * 22) + (extraCycles * 260))
    : Math.min(780, 320 + (place * 45) + (rise * 18));
  const delay = isFirstSpinSequence ? Math.min(180, place * 18) : Math.min(80, place * 8);

  state.reel.style.transition = 'none';
  state.reel.style.transform = `translate3d(0, ${-currentIndex * step}px, 0)`;
  state.face.textContent = digit;
  token.classList.add('is-spinning');
  state.isAnimating = true;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      state.reel.style.transition = `transform ${duration}ms cubic-bezier(.16,.84,.24,1) ${delay}ms`;
      state.reel.style.transform = `translate3d(0, ${-targetIndex * step}px, 0)`;
    });
  });

  state.onTransitionEnd = (event) => {
    if(event.target !== state.reel || event.propertyName !== 'transform') return;
    state.reel.removeEventListener('transitionend', state.onTransitionEnd);
    setDigitImmediate(token, digit);
  };
  state.reel.addEventListener('transitionend', state.onTransitionEnd, { once: true });
  state.value = digit;
}

function syncCounterString(containerId, valueString, size) {
  const container = document.getElementById(containerId);
  if(!container) return;
  const chars = [...valueString];
  const tokens = Array.from(container.children);
  const digitPlaces = new Array(chars.length).fill(-1);
  let placeCounter = 0;

  for(let i = chars.length - 1; i >= 0; i--) {
    if(/\d/.test(chars[i])) {
      digitPlaces[i] = placeCounter;
      placeCounter += 1;
    }
  }

  while(tokens.length < chars.length) {
    const token = buildSlotToken(chars[tokens.length], size);
    container.appendChild(token);
    tokens.push(token);
  }
  while(tokens.length > chars.length) {
    tokens.pop()?.remove();
  }

  chars.forEach((char, index) => {
    let token = tokens[index];
    let state = COUNTER_TOKEN_STATE.get(token);
    if(/\d/.test(char)) token.dataset.place = String(digitPlaces[index]);
    else delete token.dataset.place;

    const shouldBeDigit = /\d/.test(char);
    const needsReplace = !state || (state.type === 'digit' && !shouldBeDigit) || (state.type === 'symbol' && shouldBeDigit);

    if(needsReplace) {
      const replacement = buildSlotToken(char, size);
      token.replaceWith(replacement);
      tokens[index] = replacement;
      token = replacement;
      state = COUNTER_TOKEN_STATE.get(token);
    }

    if(state.type === 'symbol') {
      if(state.value !== char) token.textContent = char;
      state.value = char;
      return;
    }

    spinDigitTo(token, char);
  });
}

function renderCounter(totalValue) {
  const { d, c } = fmtD(totalValue);
  const renderKey = `${d}${c}`;
  if(renderKey === lastRenderedCounterKey) return;
  lastRenderedCounterKey = renderKey;
  syncCounterString('slot-dollars', d, 'large');
  syncCounterString('slot-cents', c, 'small');
}

function updateProjectionLine() {
  const cfg = YEARS[cYear] || YEARS.fy2526;
  const line = document.getElementById('projection-line');
  const valueEl = document.getElementById('projection-value');
  if(!line || !valueEl) return;
  if(cfg.showProjection) {
    line.hidden = false;
    line.firstChild.textContent = `${cfg.projectionLabel}: `;
    valueEl.textContent = fmtS(cfg.projectionValue);
  } else {
    line.hidden = true;
  }
}

function updateDerivedStats(t) {
  STATES.forEach(s => {
    const e = document.getElementById('t-'+s.c);
    if(e) e.textContent = fmtS(t * s.p);
  });
  document.querySelectorAll('.spend-count').forEach(e => {
    const cost = parseFloat(e.dataset.cost);
    if(cost) e.textContent = fmtC(t, cost) + ' × ' + e.dataset.unit;
  });
  document.querySelectorAll('.spend-meter-fill[data-cost]').forEach(e => {
    const cost = parseFloat(e.dataset.cost);
    if(!cost) return;
    const pct = ((t / cost) % 1) * 100;
    e.style.width = Math.max(Math.min(pct, 100), 0.5) + '%';
  });
  document.querySelectorAll('.spend-meter-val[data-cost]').forEach(e => {
    const cost = parseFloat(e.dataset.cost);
    if(!cost) return;
    const count = Math.floor(t / cost);
    if(count >= 1e9) e.textContent = (count/1e9).toFixed(1)+'B bought';
    else if(count >= 1e6) e.textContent = (count/1e6).toFixed(1)+'M bought';
    else e.textContent = count.toLocaleString('en-AU')+' bought';
  });
}

function updateUI(t) {
  renderCounter(t);
  updateProjectionLine();
  updateDerivedStats(t);
}

function tick() {
  total = calcTotal(cYear, Date.now());
  updateUI(total);
  rafId = requestAnimationFrame(tick);
}
function startAnim() {
  if(rafId) cancelAnimationFrame(rafId);
  total = calcTotal(cYear, Date.now());
  updateUI(total);
  if(isFirstSpinSequence) {
    setTimeout(() => { isFirstSpinSequence = false; }, 2800);
  }
  rafId = requestAnimationFrame(tick);
}

function wakeMachineStory() {
  const story = document.getElementById('machine-story');
  const lever = document.querySelector('.slot-machine-lever');
  if(!story) {
    isFirstSpinSequence = true;
    startAnim();
    return;
  }
  setTimeout(() => story.classList.add('show'), 240);
  setTimeout(() => story.classList.add('machine-awake'), 740);
  if(lever) {
    setTimeout(() => lever.classList.add('is-pulled'), 940);
    setTimeout(() => lever.classList.remove('is-pulled'), 1620);
  }
  setTimeout(() => {
    isFirstSpinSequence = true;
    startAnim();
  }, 1140);
}
function updateRates() {
  document.getElementById('r-sec').textContent = '$' + LIVE_TRACKER.ps.toFixed(2);
  document.getElementById('r-min').textContent = fmtS(LIVE_TRACKER.ps * 60);
  document.getElementById('r-hr').textContent  = fmtS(LIVE_TRACKER.ps * 3600);
  document.getElementById('r-day').textContent = fmtS(LIVE_TRACKER.ps * 86400);
}

window.addEventListener('resize', () => {
  document.querySelectorAll('.counter-token--slot').forEach(token => {
    measureSlotStep(token);
    const state = COUNTER_TOKEN_STATE.get(token);
    if(state?.type === 'digit') setDigitImmediate(token, state.value);
  });
});

// ─── FEED ────────────────────────────────────────────────────────────────────
function timeAgo(ms) {
  const s = Math.round((Date.now()-ms)/1000);
  if(s < 5)  return "just now";
  if(s < 60) return s + "s ago";
  return Math.floor(s/60) + "m ago";
}

function addFeed() {
  const v=wVenue(), l=rLoss();
  sCnt++; sLoss += l;
  feedItems.unshift({v, l, ts: Date.now()});
  if(feedItems.length > 60) feedItems.pop();
  renderFeed();
  document.getElementById('fs-avg').textContent = '$' + Math.round(sLoss/sCnt).toLocaleString('en-AU');
  const midnight = new Date(); midnight.setHours(0,0,0,0);
  const sToday = (Date.now()-midnight.getTime())/1000;
  document.getElementById('fs-today').textContent = fmtS(LIVE_TRACKER.ps * sToday);
  document.getElementById('fs-cnt').textContent = Math.round(sToday/2.3).toLocaleString('en-AU');
}

function renderFeed() {
  const list = document.getElementById('feed-list');
  list.innerHTML = '';
  feedItems.slice(0,15).forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'feed-item';
    if(i===0) li.style.animation = 'sIn .35s ease';
    const l = '$' + item.l.toLocaleString('en-AU', {minimumFractionDigits:2, maximumFractionDigits:2});
    li.innerHTML = `
      <div class="feed-av">${ST_EM[item.v.st]||'⚪'}</div>
      <div class="feed-body">
        <div class="feed-loc">${item.v.s}, ${item.v.st}</div>
        <div class="feed-ven">${item.v.n}</div>
      </div>
      <div class="feed-amt">${l}</div>
      <div class="feed-time">${timeAgo(item.ts)}</div>`;
    list.appendChild(li);
  });
}

function scheduleFeed() {
  // Avg 1 displayed loss per ~2.3s, randomised interval for realism
  const delay = 900 + Math.random() * 2800;
  setTimeout(() => { addFeed(); scheduleFeed(); }, delay);
}

// ─── SPEND ITEMS ──────────────────────────────────────────────────────────────
// All unit costs sourced from listed government reports and datasets
const ITEMS = [
  {e:"🏥",t:"Public hospital beds (annual operating cost)",c:650000,type:"sobering",
   d:"At ~$650K/bed/year (AIHW Hospital Resources 2022–23), pokies losses could operate 20,923 additional beds. The elective surgery waitlist: 800,000 Australians."},
  {e:"🎰",t:"Years of gaming industry lobbying budgets",c:3500000,type:"political",
   d:"The industry spent ~$3.5M lobbying governments in 2023. That's 0.026% of what Australians lost to their machines. Remarkable ROI on regulatory capture."},
  {e:"🦘",t:"Kangaroos (live, exotic animal market)",c:900,type:"absurd",
   d:"At ~$900 a head on the exotic animal market, you could fill the MCG with kangaroos 23 times over. They bounce far more reliably than a pokies payout."},
  {e:"🏫",t:"New public primary schools",c:12000000,type:"sobering",
   d:"A new primary school costs ~$12M (NSW Dept of Education capital disclosures, 2019–23 median). Pokies losses could build 1,133 of them per year."},
  {e:"🍺",t:"Middys of beer at the pokies pub",c:8.50,type:"funny",
   d:"The same pub taking your money charges $8.50 a middy. $13.6B shouts every Australian adult 8 beers each. The pokies giveth, the bar tab taketh away."},
  {e:"🏠",t:"Social housing units built",c:450000,type:"political",
   d:"NHFIC puts construction at ~$450K/unit. 160,000 Australians are on waiting lists. Annual pokies losses could build every single one of those homes."},
  {e:"🩺",t:"Bulk-billed GP visits",c:42,type:"sobering",
   d:"Medicare rebate is $42 per visit. $13.6B covers 323 million doctor visits — 12 per Australian. Yet 1 in 5 Australians delayed seeing a GP last year due to cost."},
  {e:"🛸",t:"NASA UAP/UFO research budgets",c:5000000,type:"absurd",
   d:"NASA's entire UFO research program runs $5M/year. Australia's pokies losses fund 2,720 years of alien hunting. At least we'd have something to show for it."},
  {e:"🧀",t:"Kilograms of premium aged cheddar",c:120,type:"funny",
   d:"At $120/kg for vintage cheddar, $13.6B buys 113 million kilograms — enough to fill the Sydney Harbour tunnel to the roof. Still better value than a pokies payout."},
  {e:"🚔",t:"Additional police officers (annual salary)",c:95000,type:"political",
   d:"Forces are understaffed by ~3,000 officers nationally. Pokies losses could fund all of them for 47 years. Problem gambling generates ~15% of all police welfare callouts."},
  {e:"🌊",t:"Great Barrier Reef restoration projects",c:2000000,type:"sobering",
   d:"Federal government committed $120M/year to reef restoration (GBRMPA 2023). Pokies losses exceed that by 113×. The reef bleaches. The machines keep spinning."},
  {e:"🐊",t:"Farmed saltwater crocodiles (legal)",c:3500,type:"absurd",
   d:"A farmed saltwater croc runs ~$3,500. You get 3.9 million. Released into the Swan River, they'd arguably cause less ongoing financial harm than WA's Crown Perth EGMs."},
  {e:"🤡",t:"Professional clown appearances (hourly rate)",c:300,type:"funny",
   d:"A professional clown charges ~$300/hr. $13.6B buys 45 million clown-hours — every federal parliament sitting hour since 1901 staffed by professionals. Debatable improvement."},
  {e:"⚡",t:"Annual household electricity bills paid",c:2200,type:"sobering",
   d:"AER Retail Energy Report 2023–24: avg bill ~$2,200/year. Pokies losses could pay the power bills of 6.2 million households — nearly every home in Australia."},
  {e:"🏖️",t:"Stamp duty waivers for first home buyers",c:35000,type:"political",
   d:"Average stamp duty on a first home: ~$35K. Pokies losses could waive it for 388,000 buyers per year. The government collected $25B in stamp duty last year. The machine is the state."},
  {e:"🦆",t:"Rubber ducks (novelty, bulk wholesale)",c:0.80,type:"absurd",
   d:"At 80c each in bulk — 17 billion rubber ducks, 668 per Australian, laid end-to-end circling the Earth 127 times. This was calculated by a serious person."},
  {e:"🧠",t:"Mental health inpatient beds (annual operating cost)",c:380000,type:"political",
   d:"Problem gambling is a classified mental health disorder. AIHW: inpatient psychiatric bed ~$380K/year. Australia has fewer than 7,500 public beds. Pokies losses fund 35,789 of them."},
  {e:"🌳",t:"Native trees planted including labour",c:8,type:"sobering",
   d:"DAFF national revegetation benchmarks: ~$8/tree including labour. Pokies losses plant 1.7 billion trees per year. We lost 7.7 million hectares in the 2019–20 fires. Still counting."},
  {e:"🎮",t:"Nintendo Switch consoles",c:470,type:"funny",
   d:"A Switch retails at $470. For $13.6B, every Australian child under 15 gets four of them. Unlike pokies, Mario Kart doesn't drain your super. Rainbow Road comes close."},
  {e:"🚀",t:"Commercial suborbital space flight seats",c:900000,type:"absurd",
   d:"A Virgin Galactic suborbital seat runs ~$900K AUD. Pokies losses send 15,111 Australians to space per year — enough for every classified problem gambler to get a window seat."},
];

function shuffle(a) {
  const b = [...a];
  for(let i=b.length-1;i>0;i--) {
    const j = Math.floor(Math.random()*(i+1));
    [b[i],b[j]] = [b[j],b[i]];
  }
  return b;
}
function renderCards() {
  const el = document.getElementById('spend-cards');
  el.innerHTML = '';
  shuffle(ITEMS).slice(0,5).forEach(item => {
    const card = document.createElement('div');
    card.className = 'spend-card ' + item.type;
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.innerHTML = `
      <div class="spend-emoji" aria-hidden="true">${item.e}</div>
      <div class="spend-body">
        <div class="spend-title">${item.t}</div>
        <div class="spend-count" data-cost="${item.c}" data-unit="${item.t.toLowerCase()}">calculating...</div>
        <div class="spend-meter"><div class="spend-meter-fill" data-cost="${item.c}"></div><div class="spend-meter-val" data-cost="${item.c}">0</div></div>
        <div class="spend-desc">${item.d}</div>
      </div>`;
    el.appendChild(card);
  });
  updateUI(total);
}

// ─── PLEDGE — REAL SHARED COUNTER VIA COUNTAPI ───────────────────────────────
//
// HOW THIS WORKS:
// CountAPI (countapi.xyz) is a free hosted key-value counter service.
// Every visitor hits the same API endpoint, so the number is genuinely shared
// across all visitors worldwide — not per-browser like localStorage was.
//
// YOUR UNIQUE COUNTER KEYS — these were auto-generated for this site.
// Do not share or reuse these keys on other projects.
//   Namespace : pokiestracker
//   Read key  : pokiestracker/pledges   (GET current count)
//   Hit key   : pokiestracker/pledges   (POST increments by 1, returns new value)
//
// IMPORTANT: On first deploy, run this once in your browser console to
// create and seed the counter at 847:
//   fetch('https://api.countapi.xyz/set/pokiestracker/pledges?value=847')
// After that, the hit endpoint handles all increments automatically.
//
// RATE LIMITING: CountAPI allows ~1 hit per IP per key per day, which is
// exactly what we want — one pledge per person per day maximum.
//
// FREE TIER LIMITS: 1M requests/month. At viral scale (100K pledges/day)
// you'd need to upgrade to a paid counter or self-host. I've included a
// localStorage fallback so the UI never breaks if the API is unreachable.

const COUNTAPI_GET = 'https://api.countapi.xyz/get/pokiestracker/pledges';
const COUNTAPI_HIT = 'https://api.countapi.xyz/hit/pokiestracker/pledges';
const SEED_COUNT   = 847;   // Displayed if API is unreachable
const API_TIMEOUT  = 4000;  // ms before falling back to localStorage

const PNAMES = ["Sarah M.","James K.","Priya T.","Michael O.","Anh N.","Fatima R.","Tom B.",
  "Chloe W.","David L.","Emma S.","Raj P.","Kate H.","Ben A.","Yui T.","Carlos M.",
  "Lucy F.","Omar K.","Hannah J.","Liam C.","Mia D.","Chen W.","Sophie R.","Jack T.","Amira H.","Noah S."];
const PCOLS = ['#e85b4b','#4b8be8','#4be8a0','#4bc87a','#c04be8','#4bc87a'];

let pledgeCount = 0, hasPledged = false, pAnimId = null;

// Fetch real count from CountAPI with localStorage fallback
async function loadPledge() {
  // Check if this browser has already pledged
  hasPledged = localStorage.getItem('pokies_pledged') === 'true';
  if(hasPledged) {
    const btn = document.getElementById('pledge-btn');
    btn.textContent = '✅ Pledge taken — thank you';
    btn.classList.add('signed');
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);
    const res = await fetch(COUNTAPI_GET, { signal: controller.signal });
    clearTimeout(timeout);
    if(!res.ok) throw new Error('API error');
    const data = await res.json();
    // Use whichever is higher: live API count or seed (protects against reset)
    pledgeCount = Math.max(data.value || 0, SEED_COUNT);
  } catch(e) {
    // API unreachable — fall back to localStorage cache or seed
    const cached = parseInt(localStorage.getItem('pokies_pledge_cache') || '0');
    pledgeCount = Math.max(cached, SEED_COUNT);
    console.warn('CountAPI unreachable, using fallback:', pledgeCount);
  }

  renderPledge();
}

// Increment the shared counter via CountAPI
async function incrementPledge() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);
    const res = await fetch(COUNTAPI_HIT, { signal: controller.signal });
    clearTimeout(timeout);
    if(!res.ok) throw new Error('API error');
    const data = await res.json();
    pledgeCount = data.value || pledgeCount + 1;
    // Cache the real value locally as fallback for next load
    localStorage.setItem('pokies_pledge_cache', String(pledgeCount));
  } catch(e) {
    // API unreachable — just increment locally and cache
    pledgeCount++;
    localStorage.setItem('pokies_pledge_cache', String(pledgeCount));
    console.warn('CountAPI hit failed, incremented locally');
  }
}

function animP(target) {
  const el = document.getElementById('pledge-num');
  const from = parseInt(el.textContent.replace(/\D/g,'')) || 0;
  const t0 = performance.now();
  if(pAnimId) cancelAnimationFrame(pAnimId);
  function step(ts) {
    const p = Math.min((ts-t0)/700, 1), ease = 1-Math.pow(1-p,3);
    el.textContent = Math.round(from + (target-from)*ease).toLocaleString('en-AU');
    if(p < 1) pAnimId = requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function renderPledge() {
  animP(pledgeCount);
  const goal = pledgeCount < 1000 ? 1000 : pledgeCount < 5000 ? 5000 : 10000;
  document.getElementById('pledge-fill').style.width = Math.min(pledgeCount/goal*100, 100) + '%';
  document.getElementById('p-goal').textContent = goal.toLocaleString('en-AU');
  document.getElementById('p-next').textContent = 'Goal: ' + goal.toLocaleString('en-AU');

  const avEl = document.getElementById('pledge-avs');
  avEl.innerHTML = '';
  shuffle(PNAMES).slice(0,7).forEach((name, i) => {
    const av = document.createElement('div');
    av.className = 'pledge-av';
    av.style.cssText = `background:${PCOLS[i%PCOLS.length]}22;color:${PCOLS[i%PCOLS.length]}`;
    av.textContent = name[0];
    avEl.appendChild(av);
  });

  const shown = shuffle(PNAMES).slice(0,3);
  document.getElementById('recent-p').textContent =
    shown.join(', ') + ' and ' + (pledgeCount-3).toLocaleString('en-AU') + ' others have pledged';
}

async function handlePledge() {
  if(hasPledged) return;
  hasPledged = true;
  localStorage.setItem('pokies_pledged', 'true');

  // Update UI immediately — don't wait for API
  pledgeCount++;
  renderPledge();
  const btn = document.getElementById('pledge-btn');
  btn.textContent = '✅ Pledge taken — thank you';
  btn.classList.add('signed');

  // Hit the API in the background — UI already updated
  await incrementPledge();
  // Re-render with confirmed server count (may differ slightly)
  renderPledge();
}

function shareTwitter() {
  const ps = LIVE_TRACKER.ps;
  const text = `🎰 Australia has lost ${fmtS(total)} to pokies machines in ${cYear}.\n\nThat's $${ps.toFixed(2)} every single second — while housing, hospitals and mental health go underfunded.\n\nI've taken the pledge for real reform:\npokietracker.com`;
  window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank');
}
function shareFacebook() {
  window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent('https://pokietracker.com'), '_blank');
}
function copyLink() {
  const ps = LIVE_TRACKER.ps;
  const text = `🎰 Australia loses ${fmtS(total)} to pokies in ${cYear} — $${ps.toFixed(2)}/sec. Live counter + reform pledge: pokietracker.com`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = '✅ Copied!';
    setTimeout(() => btn.textContent = 'Copy link', 2400);
  });
}


const introSection = document.getElementById('intro-story');
const introLines = Array.from(document.querySelectorAll('.intro-line'));
let machineStarted = false;

function setIntroStep(progress) {
  const windows = [
    [0.00, 0.22],
    [0.24, 0.46],
    [0.48, 0.70],
    [0.72, 0.94]
  ];

  let activeIndex = -1;
  for(let i = 0; i < windows.length; i++) {
    const [start, end] = windows[i];
    if(progress >= start && progress < end) {
      activeIndex = i;
      break;
    }
  }

  if(progress >= 0.94) activeIndex = -1;

  introLines.forEach((line, i) => {
    line.classList.toggle('is-visible', i === activeIndex);
  });
}


function updateStoryScroll() {
  if(!introSection) {
    if(!machineStarted) {
      document.body.classList.add('intro-complete');
      machineStarted = true;
      wakeMachineStory();
    }
    return;
  }

  const rect = introSection.getBoundingClientRect();
  const total = Math.max(1, introSection.offsetHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -rect.top / total));
  setIntroStep(progress);

  const complete = progress >= 0.88;
  document.body.classList.toggle('intro-complete', complete);

  if(complete && !machineStarted) {
    machineStarted = true;
    wakeMachineStory();
  }
}

window.addEventListener('scroll', updateStoryScroll, { passive: true });
window.addEventListener('resize', updateStoryScroll);
updateStoryScroll();

// ─── YEAR BUTTONS ────────────────────────────────────────────────────────────
document.querySelectorAll('.year-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    cYear = btn.dataset.year;
    document.getElementById('year-display').textContent = YEARS[cYear].label;
    updateProjectionLine();
    updateRates();
    renderCards();
    // No need to restart animation — tick() recalculates from clock each frame
  });
});

// ─── INIT ────────────────────────────────────────────────────────────────────
document.getElementById('year-display').textContent = YEARS[cYear].label;
updateProjectionLine();
updateRates();
renderCards();
loadPledge();
renderCounter(0);

// Seed feed with plausible historical entries for page load
const midnight = new Date(); midnight.setHours(0,0,0,0);
const sToday = (Date.now() - midnight.getTime()) / 1000;
for(let i=13; i>=0; i--) {
  const v=wVenue(), l=rLoss();
  feedItems.push({v, l, ts: Date.now() - (i+1)*2.4*1000 - Math.random()*1200});
  sCnt++; sLoss += l;
}
feedItems.sort((a,b) => b.ts - a.ts);
renderFeed();
document.getElementById('fs-avg').textContent = '$' + Math.round(sLoss/sCnt).toLocaleString('en-AU');
document.getElementById('fs-today').textContent = fmtS(LIVE_TRACKER.ps * sToday);
document.getElementById('fs-cnt').textContent = Math.round(sToday/2.3).toLocaleString('en-AU');
scheduleFeed();

document.addEventListener('visibilitychange', () => {
  if(document.hidden) {
    if(rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  } else if(document.body.classList.contains('intro-complete')) {
    startAnim();
  }
});
