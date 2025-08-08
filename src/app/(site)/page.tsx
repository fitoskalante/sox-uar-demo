"use client";
import React, { useMemo, useRef, useState } from 'react';
import { Upload, Image as ImageIcon, FileSpreadsheet, FileText, Paperclip, Eye, Send, Bot, User, CheckCircle2, ChevronRight, ChevronDown, ChevronUp, Home, LayoutDashboard, FolderOpen, FileCheck2, Settings, HelpCircle, ShieldCheck, Mic, X as XIcon } from 'lucide-react';

// Types
 type AutoRunMode = 'manual' | 'assisted' | 'full';

// Branding colors
const RSM_COLORS = { grey: '#83858F', green: '#7AB800', blue: '#00A1DE' };

// UI primitive replacements
function Card(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props} className={"rounded-2xl border bg-white shadow-sm " + (props.className||'')} />; }
function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props} className={"px-4 pt-4 " + (props.className||'')} />; }
function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) { return <h3 {...props} className={"font-semibold leading-tight " + (props.className||'')} />; }
function CardContent(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props} className={"px-4 pb-4 space-y-4 " + (props.className||'')} />; }
function CardFooter(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props} className={"px-4 pb-4 pt-2 flex " + (props.className||'')} />; }
function Button({ variant='default', size='md', className='', ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default'|'secondary'|'outline'|'ghost'; size?: 'md'|'sm'|'icon'; }) {
  const base = 'inline-flex items-center justify-center rounded-xl font-medium transition text-sm disabled:opacity-50 disabled:pointer-events-none';
  const variants: Record<string,string> = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-500',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    outline: 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700',
    ghost: 'hover:bg-slate-100 text-slate-700'
  };
  const sizes: Record<string,string> = {
    md: 'h-9 px-3 gap-1',
    sm: 'h-8 px-2 text-xs gap-1',
    icon: 'h-9 w-9'
  };
  return <button className={[base, variants[variant], sizes[size], className].join(' ')} {...rest} />;
}
function Badge({ variant='default', className='', ...rest }: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default'|'secondary'|'outline'; }) {
  const variants: Record<string,string> = {
    default: 'bg-indigo-600 text-white',
    secondary: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
    outline: 'border border-slate-300 text-slate-700'
  };
  return <span {...rest} className={"inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium " + variants[variant] + ' ' + className} />;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={"h-9 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 " + (props.className||'')} />; }
function Progress({ value }: { value: number }) { return <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-indigo-500 transition-all" style={{ width: value + '%' }} /></div>; }
function ScrollArea(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props} className={"overflow-y-auto " + (props.className||'')} />; }

function RSMBrand({ compact=false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-stretch gap-1">
        <span className="h-4 w-5 rounded-sm" style={{ background: RSM_COLORS.grey }} />
        <span className="h-4 w-5 rounded-sm" style={{ background: RSM_COLORS.green }} />
        <span className="h-4 w-5 rounded-sm" style={{ background: RSM_COLORS.blue }} />
      </div>
      {!compact && <span className="text-base font-extrabold tracking-wide">RSM</span>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="h-5 w-1.5 rounded bg-indigo-500" />
      <h3 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">{children}</h3>
    </div>
  );
}

function Dropzone({ label, accept, onFiles }: { label: string; accept?: string; onFiles: (files: File[]) => void; }) {
  const inputRef = useRef<HTMLInputElement|null>(null);
  const [isOver, setOver] = useState(false);
  return (
    <div
      onDragOver={e=>{ e.preventDefault(); setOver(true); }}
      onDragLeave={()=>setOver(false)}
      onDrop={e=>{ e.preventDefault(); setOver(false); const dtFiles = Array.from(e.dataTransfer.files||[]); if(dtFiles.length) onFiles(dtFiles as File[]); }}
      onClick={()=>inputRef.current?.click()}
      className={"group relative flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed " + (isOver ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50')}
    >
      <Upload className="mb-1 h-5 w-5 opacity-90" />
      <p className="text-xs font-medium">{label}</p>
      <p className="mt-0.5 text-[10px] text-slate-500">Drag & drop or click to upload</p>
      <input ref={inputRef} type="file" accept={accept} multiple className="hidden" onChange={e=>{ const files = Array.from(e.target.files||[]); if(files.length) onFiles(files as File[]); }} />
    </div>
  );
}

function FileChip({ name, type }: { name: string; type: 'image'|'excel'|'doc'|'other'; }) {
  const Icon = type === 'image' ? ImageIcon : type === 'excel' ? FileSpreadsheet : type === 'doc' ? FileText : Paperclip;
  return <Badge variant="secondary" className="gap-1 rounded-full px-2 py-1 text-[11px]"><Icon className="h-3.5 w-3.5" />{name}</Badge>;
}

function EvidenceThumb({ src, caption, onOpen }: { src: string; caption: string; onOpen: () => void; }) {
  return (
    <button onClick={onOpen} className="group relative aspect-video w-36 overflow-hidden rounded-xl border border-slate-200 shadow-sm" title={caption}>
      <img src={src} alt={caption} className="h-full w-full object-cover transition group-hover:scale-[1.02]" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
        <Eye className="h-5 w-5 text-white" />
      </div>
    </button>
  );
}

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode; }) {
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 max-h-[85vh] w-[92vw] max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="text-sm font-semibold">Evidence preview</span>
          <Button size="icon" variant="ghost" onClick={onClose}><XIcon className="h-4 w-4" /></Button>
        </div>
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
}

function Round({ label, children, tone='indigo' as 'indigo'|'emerald'|'amber' }) {
  const ring = tone === 'emerald' ? 'ring-emerald-200 bg-emerald-50' : tone === 'amber' ? 'ring-amber-200 bg-amber-50' : 'ring-indigo-200 bg-indigo-50';
  const dot = tone === 'emerald' ? 'bg-emerald-500' : tone === 'amber' ? 'bg-amber-500' : 'bg-indigo-500';
  return (
    <div className={`rounded-xl ${ring} p-3 ring-1`}>
      <div className="mb-1 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">{label}</p>
      </div>
      <div className="prose prose-sm max-w-none leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}

function ProgressSteps({ current=1, total=7 }: { current: number; total: number; }) {
  const pct = Math.round((current/total)*100);
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold">Progress ({current} / {total} Steps)</div>
        <div className="text-xs text-slate-500">{pct}%</div>
      </div>
      <Progress value={pct} />
      <div className="mt-3 grid grid-cols-7 gap-1">
        {Array.from({length: total}).map((_,i)=>(
          <div key={i} className={"h-2 rounded-full "+(i<current?"bg-indigo-500":"bg-slate-200")} />
        ))}
      </div>
    </div>
  );
}

function ChatMessage({ role, text }: { role: 'user'|'assistant'; text: string; }) {
  const isUser = role === 'user';
  const Avatar = isUser ? User : Bot;
  return (
    <div className={`flex items-start gap-3 ${isUser?"justify-end":"justify-start"}`}>
      {!isUser && <div className="mt-0.5 rounded-full bg-indigo-50 p-1.5"><Avatar className="h-4 w-4 text-indigo-600" /></div>}
      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow ${isUser?"bg-slate-900 text-white":"bg-white"}`}>{text}</div>
      {isUser && <div className="mt-0.5 rounded-full bg-slate-100 p-1.5"><Avatar className="h-4 w-4 text-slate-600" /></div>}
    </div>
  );
}

function ChatPanel({ messages, setMessages }: { messages: { role: 'user'|'assistant'; text: string; }[]; setMessages: React.Dispatch<React.SetStateAction<{ role: 'user' | 'assistant'; text: string; }[]>>; }) {
  const [draft,setDraft] = useState('');
  function send(){
    if(!draft.trim()) return;
    setMessages(m=>[...m,{role:'user',text:draft.trim()}]);
    setDraft('');
    setTimeout(()=>{
      setMessages(m=>[...m,{role:'assistant',text:'Thanks! I’ll proceed with the exclusion filter: Participant Status = All (non-exclusionary).'}]);
    },600);
  }
  return (
    <Card className="h-[640px] overflow-hidden">
      <CardHeader className="pb-2"><CardTitle className="text-base">Chat</CardTitle></CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[520px] px-4">
          <div className="flex flex-col gap-3 pb-4">
            {messages.map((m,i)=>(<ChatMessage key={i} role={m.role} text={m.text} />))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="gap-2">
        <Input placeholder="Type a message…" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} />
        <Button variant="outline" size="icon" title="Voice input (coming soon)"><Mic className="h-4 w-4" /></Button>
        <Button onClick={send} className="gap-1"><Send className="h-4 w-4" /> Send</Button>
      </CardFooter>
    </Card>
  );
}

function LeftNav(){
  const items = [
    { icon: Home, label: 'Home' },
    { icon: LayoutDashboard, label: 'Processes' },
    { icon: FolderOpen, label: 'Evidence' },
    { icon: FileCheck2, label: 'Templates' },
    { icon: ShieldCheck, label: 'Controls' },
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Help' },
  ];
  return (
    <aside className="hidden md:flex md:w-16 md:flex-col md:items-center md:border-r md:bg-white">
      <div className="flex w-full items-center justify-center border-b py-3"><RSMBrand compact /></div>
      <nav className="flex-1 py-3">
        <ul className="flex flex-col items-center gap-1">
          {items.map((item,i)=>(
            <li key={i}>
              <a href="#" onClick={e=>e.preventDefault()} title={item.label} aria-label={item.label} className={`flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100 ${i===1?'bg-slate-100':''}`}><item.icon className="h-4 w-4 text-slate-700" /></a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="w-full border-t p-2 text-center text-[10px] text-slate-500">v0.1</div>
    </aside>
  );
}

function AutoRunControl({ mode, setMode }: { mode: AutoRunMode; setMode: (m: AutoRunMode) => void; }) {
  function opt(key: AutoRunMode, label: string, hint: string){
    return (
      <button onClick={()=>setMode(key)} title={hint} aria-label={`${label} mode`} className={`rounded-xl px-2.5 py-1 text-xs ring-1 transition ${mode===key?'bg-slate-900 text-white ring-slate-900':'bg-white text-slate-700 ring-slate-300 hover:bg-slate-50'}`}>{label}</button>
    );
  }
  return (
    <div className="flex items-center gap-1 rounded-2xl bg-white p-1 ring-1 ring-slate-300">
      {opt('manual','Manual','High user input; confirm each step')}
      {opt('assisted','Assisted','Fewer prompts; only key confirmations')}
      {opt('full','Full Auto','Run end‑to‑end with minimal interaction')}
    </div>
  );
}

function TopHeader({ mode, setMode }: { mode: AutoRunMode; setMode: (m: AutoRunMode) => void; }) {
  return (
    <header className="sticky top-0 z-40 h-14 w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="md:hidden"><RSMBrand compact /></div>
          <div className="text-sm font-semibold">AI Recertification · SOX UAR</div>
          <Badge variant="secondary" className="ml-1">Demo</Badge>
        </div>
        <div className="flex items-center gap-3">
          <AutoRunControl mode={mode} setMode={setMode} />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">JG</div>
        </div>
      </div>
    </header>
  );
}

export default function Page(){
  const [evidenceFiles,setEvidenceFiles] = useState<{ name: string; type: 'image'|'excel'|'doc'|'other'; }[]>([
    { name: 'Excel • page 1', type: 'excel' },
    { name: 'Email approval screenshot', type: 'image' },
  ]);
  const [templateFiles,setTemplateFiles] = useState<{ name: string; type: 'doc'|'other'; }[]>([
    { name: 'UAR Template v3.docx', type: 'doc' },
  ]);
  const [viewer,setViewer] = useState<null | { src: string; caption: string; }>(null);
  const [mode,setMode] = useState<AutoRunMode>('manual');
  const [uploadOpen,setUploadOpen] = useState(false);
  const [currentStep,setCurrentStep] = useState<number>(1);
  const [chatMessages,setChatMessages] = useState<{ role: 'user'|'assistant'; text: string; }[]>([
    { role: 'user', text: 'Hi, upload completed.' },
    { role: 'assistant', text: 'Great — I’ve validated file types. Starting Step 1: Review for accuracy & completeness.' },
    { role: 'assistant', text: 'Quick question: does your scope exclude privileged contractors for Q1 2024?' },
  ]);

  function nextStep(){
    if(currentStep>=2) return;
    setCurrentStep(2);
    setChatMessages(m=>[...m,
      { role: 'assistant', text: 'Step 1 complete ✅ — results posted in the panel.' },
      { role: 'assistant', text: 'Moving to Step 2: Verify precision of the user access review report (headers/columns & review format). I’ll check export provenance and whether roles + identifiers are present.' },
      { role: 'assistant', text: 'Before I run the checks: Is per‑row certification required this quarter, or is an overall user‑level attestation acceptable?' },
    ]);
  }

  const thumbs = useMemo(()=>{
    const excelSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><defs><style>.t{font: 12px sans-serif; fill:#1f2937}</style></defs><rect width='100%' height='100%' fill='#ffffff'/><rect x='0' y='0' width='800' height='60' fill='${RSM_COLORS.green}'/><text x='16' y='38' fill='white' font-size='18' font-family='Arial' font-weight='700'>Excel — Export (Page 1)</text><g transform='translate(16,80)'><rect width='768' height='384' fill='#f8fafc' stroke='#e2e8f0'/>${Array.from({length:12}).map((_,i)=>`<line x1='${64*i}' y1='0' x2='${64*i}' y2='384' stroke='#e2e8f0'/>`).join('')}${Array.from({length:8}).map((_,i)=>`<line x1='0' y1='${48*i}' x2='768' y2='${48*i}' stroke='#e2e8f0'/>`).join('')}<text class='t' x='8' y='20'>System</text><text class='t' x='160' y='20'>Date Range</text><text class='t' x='320' y='20'>Frequency</text><text class='t' x='480' y='20'>Status</text><rect x='0' y='24' width='128' height='24' fill='#ecfeff' stroke='#bae6fd' /><text class='t' x='8' y='40'>Certent</text><rect x='128' y='24' width='160' height='24' fill='#ecfeff' stroke='#bae6fd' /><text class='t' x='136' y='40'>01/01/1900 – 03/01/2024</text><rect x='288' y='24' width='160' height='24' fill='#ecfeff' stroke='#bae6fd' /><text class='t' x='296' y='40'>Yearly</text><rect x='448' y='24' width='160' height='24' fill='#ecfeff' stroke='#bae6fd' /><text class='t' x='456' y='40'>All (non-exclusionary)</text></g></svg>`;
    const emailSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='#ffffff'/><rect x='0' y='0' width='800' height='52' fill='${RSM_COLORS.grey}'/><text x='16' y='34' fill='white' font-size='16' font-family='Arial' font-weight='700'>Email — Approval Evidence</text><rect x='0' y='52' width='220' height='448' fill='#f1f5f9'/><rect x='220' y='52' width='580' height='60' fill='#f8fafc' stroke='#e2e8f0'/><text x='236' y='80' fill='#1f2937' font-size='14' font-family='Arial'>Subject: Access Approval — Certent</text><text x='236' y='96' fill='#475569' font-size='12' font-family='Arial'>From: approver@company.com · To: owner@company.com · Date: 03/02/2024</text><g transform='translate(220,120)'>${Array.from({length:12}).map((_,i)=>`<rect x='16' y='${24*i+20}' width='520' height='10' fill='#e2e8f0'/>`).join('')}</g></svg>`;
    const portalSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='#ffffff'/><rect x='0' y='0' width='800' height='56' fill='${RSM_COLORS.blue}'/><text x='16' y='36' fill='white' font-size='18' font-family='Arial' font-weight='700'>Portal UI — Report Configuration</text><g transform='translate(24,80)'><rect width='752' height='360' fill='#f8fafc' stroke='#e2e8f0'/><rect x='24' y='24' width='220' height='28' fill='#ffffff' stroke='#cbd5e1'/><text x='28' y='42' fill='#334155' font-size='12' font-family='Arial'>Date Range</text><rect x='260' y='24' width='180' height='28' fill='#ecfeff' stroke='#bae6fd'/><text x='268' y='42' fill='#1f2937' font-size='12' font-family='Arial'>01/01/1900 – 03/01/2024</text><rect x='24' y='72' width='220' height='28' fill='#ffffff' stroke='#cbd5e1'/><text x='28' y='90' fill='#334155' font-size='12' font-family='Arial'>Participant Status</text><rect x='260' y='72' width='180' height='28' fill='#ecfeff' stroke='#bae6fd'/><text x='268' y='90' fill='#1f2937' font-size='12' font-family='Arial'>All (non-exclusionary)</text></g></svg>`;
    const enc = (s: string) => `data:image/svg+xml;utf8,${encodeURIComponent(s)}`;
    return [
      { src: enc(excelSvg), caption: 'Excel export — page 1' },
      { src: enc(emailSvg), caption: 'Email approval — subject & headers' },
      { src: enc(portalSvg), caption: 'Portal UI — report configuration' },
    ];
  },[]);

  function EvidenceChips({ files }: { files: string[] }) {
    return (
      <div className="mb-2 flex flex-wrap gap-2">
        {files.map((f,i)=>(<FileChip key={i} name={f} type={f.toLowerCase().endsWith('.png')?'image':'other'} />))}
      </div>
    );
  }

  function StepOne(){
    return (
      <>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-1 text-xs text-slate-500">Current Step</div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold">Step 1 · Review information for accuracy and completeness</div>
            <div className="flex items-center gap-2"><Badge className="gap-1" variant="secondary"><CheckCircle2 className="h-3.5 w-3.5" /> Complete</Badge></div>
          </div>
        </div>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-base">Substep 1</CardTitle><Badge variant="outline">feature: system_name</Badge></div></CardHeader>
          <CardContent className="space-y-4">
            <div><SectionTitle>Instructions</SectionTitle><p className="text-sm text-slate-700">From the provided evidence, identify the <span className="font-medium">System under review</span> and verify that the name matches across the Portal UI and the Excel export. Record any discrepancies.</p></div>
            <div><SectionTitle>Answer</SectionTitle><div className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200">Certent</div></div>
            <div><SectionTitle>Evidence</SectionTitle><div className="mb-2 flex flex-wrap gap-2"><FileChip name="Excel • Page 1" type="excel" /><FileChip name="Portal UI" type="image" /><FileChip name="Email approval" type="image" /></div><div className="flex flex-wrap gap-3">{thumbs.map((t,i)=>(<EvidenceThumb key={i} src={t.src} caption={t.caption} onOpen={()=>setViewer(t)} />))}</div></div>
            <div><SectionTitle>Reasoning</SectionTitle><div className="space-y-3"><Round label="Round 1" tone="indigo"><ul><li>System name detected on Excel header → <code>Certent</code>.</li><li>Portal UI screenshot cross-checked with export metadata.</li></ul><p className="mt-2">Conclusion: The system under review is <strong>Certent</strong>.</p></Round><Round label="Round 2" tone="emerald"><ul><li>Verified consistency: UI label matches export field <code>System</code>.</li><li>No conflicting references across evidence set.</li></ul></Round></div></div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-base">Substep 2</CardTitle><Badge variant="outline">feature: report_parameters</Badge></div></CardHeader>
          <CardContent className="space-y-4">
            <div><SectionTitle>Instructions</SectionTitle><p className="text-sm text-slate-700">Confirm the report’s exclusionary filters and date range. Ensure the parameters match the template: Date Range =<em>01/01/1900–03/01/2024</em>, Participant Status = <em>All (non‑exclusionary)</em>, Frequency = <em>Yearly</em>.</p></div>
            <div><SectionTitle>Answer</SectionTitle><div className="rounded-xl bg-blue-50 p-3 text-sm text-blue-900 ring-1 ring-blue-200">Exclusionary filters: <strong>Date range 01/01/1900–03/01/2024</strong>. Participant Status = <strong>All (non‑exclusionary)</strong>. No other exclusionary filters found.</div></div>
            <div><SectionTitle>Evidence</SectionTitle><div className="mb-2 flex flex-wrap gap-2"><FileChip name="Excel • Page 1" type="excel" /><FileChip name="Report Form (UI)" type="image" /></div><div className="flex flex-wrap gap-3">{thumbs.map((t,i)=>(<EvidenceThumb key={i} src={t.src} caption={t.caption} onOpen={()=>setViewer(t)} />))}</div></div>
            <div><SectionTitle>Reasoning</SectionTitle><div className="space-y-3"><Round label="Round 1" tone="indigo"><ul><li>Date range read from UI: <code>01/01/1900–12/31/2023</code> (initial note).</li><li>Export metadata shows: Date Range <code>01/01/1900–03/01/2024</code> • Freq: <code>Yearly</code> • Status: <code>All Verified</code>.</li></ul></Round><Round label="Round 2" tone="amber"><ul><li>Reconciliation: updated end date <strong>03/01/2024</strong> matches export.</li><li>Conclusion: Only exclusionary filter is the date range; participant status is non‑exclusionary.</li></ul></Round></div></div>
          </CardContent>
        </Card>
      </>
    );
  }

  function StepTwo(){
    return (
      <>
        <div className="rounded-2xl border bg-white p-4 shadow-sm"><div className="mb-1 text-xs text-slate-500">Current Step</div><div className="flex flex-wrap items-center justify-between gap-2"><div className="text-sm font-semibold">Step 2 · Verify report precision & review format</div><div className="flex items-center gap-2"><Badge className="gap-1" variant="secondary"><CheckCircle2 className="h-3.5 w-3.5" /> In progress</Badge></div></div></div>
        <Card className="overflow-hidden"><CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-base">Substep: Headers & Columns</CardTitle><Badge variant="outline">feature: headers_columns</Badge></div></CardHeader><CardContent className="space-y-4"><div><SectionTitle>Instructions</SectionTitle><p className="text-sm text-slate-700">Verify the level of precision of the user access review report.</p></div><div><SectionTitle>Answer</SectionTitle><div className="rounded-xl bg-emerald-50 p-3 text-sm ring-1 ring-emerald-200">The listing is an Excel spreadsheet export from Certent. Columns explicitly include <strong>ROLENAME</strong> and <strong>SECURITYLEVEL</strong>, along with user identifiers (e.g., <strong>NAME</strong>, <strong>LOGINID</strong>). Roles are therefore included, and the export provides sufficient precision to analyze user-to-role mappings.</div></div><div><SectionTitle>Evidence</SectionTitle><EvidenceChips files={["excel_Test of One_r70_c1_img_2.png - p1","excel_Test of One_r269_c2_img_9.png - p1","excel_Test of One_r269_c6_img_10.png - p1","excel_Test of One_r39_c2_img_1.png - p1","excel_Test of One_r11_c2_img_0.png - p1"]} /><div className="flex flex-wrap gap-3">{thumbs.map((t,i)=>(<EvidenceThumb key={i} src={t.src} caption={t.caption} onOpen={()=>setViewer(t)} />))}</div></div><div><SectionTitle>Reasoning</SectionTitle><div className="space-y-3"><Round label="Round 1" tone="indigo"><ul><li>Determined the system under review is <strong>Certent</strong> and reports originate from the Certent Reports module.</li><li>Identified the exported listing is a system‑generated Excel/CSV with broad date filters.</li></ul></Round><Round label="Round 2" tone="emerald"><ul><li>Located Excel export “<em>User Login Role and Access Summary</em>” showing dataset structure; read column headers directly.</li><li>Confirmed presence of <strong>ROLENAME</strong> and <strong>SECURITYLEVEL</strong> (filters visible via Excel AutoFilter).</li><li>Verified provenance via screenshots of Certent “Run Report” (Excel CSV) and worksheet metadata (report code <code>ADMIN007</code>, date range, run date).</li></ul></Round></div></div></CardContent></Card>
        <Card className="overflow-hidden"><CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-base">Substep: Review Format (User names)</CardTitle><Badge variant="outline">feature: user_names</Badge></div></CardHeader><CardContent className="space-y-4"><div><SectionTitle>Instructions</SectionTitle><p className="text-sm text-slate-700">Verify the level of precision of the user access review report, by evaluating the format of the report reviewed.</p></div><div><SectionTitle>Answer</SectionTitle><div className="rounded-xl bg-blue-50 p-3 text-sm ring-1 ring-blue-200"><ul className="list-disc pl-5"><li><strong>Inclusion of all users:</strong> The export lists users with their roles; AuditBoard task records overall approval; vendor email confirms vendor users. No per‑row certification marker in the sheet.</li><li><strong>Level of detail:</strong> The review appears at the <em>user level</em> (overall attestation), not per user‑role row within the spreadsheet.</li></ul></div></div><div><SectionTitle>Evidence</SectionTitle><EvidenceChips files={["excel_Test of One_r70_c1_img_2.png - p1","excel_Test of One_r130_c2_img_5.png - p1","excel_Test of One_r154_c2_img_6.png - p1","excel_Test of One_r179_c2_img_7.png - p1","excel_Test of One_r290_c2_img_11.png - p1","excel_Test of One_r308_c2_img_12.png - p1"]} /><div className="flex flex-wrap gap-3">{thumbs.map((t,i)=>(<EvidenceThumb key={i} src={t.src} caption={t.caption} onOpen={()=>setViewer(t)} />))}</div></div><div><SectionTitle>Reasoning</SectionTitle><div className="space-y-3"><Round label="Round 1" tone="indigo"><ul><li>Objective: confirm coverage of the UAR against the exported user‑and‑role listing.</li><li>No explicit per‑row review column identified previously.</li></ul></Round><Round label="Round 2" tone="amber"><ul><li>Searched the export for review/approval columns or annotations — none visible in provided extract.</li><li>Reviewed AuditBoard Task #410: overall approval with no changes; second reviewer note; final sign‑off.</li><li>Examined vendor confirmation email: vendor attests the subset of vendor users’ access is accurate.</li><li>Conclusion: evidence supports overall (user‑level) attestation rather than per‑row certification within the sheet.</li></ul></Round></div></div></CardContent></Card>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <LeftNav />
        <div className="flex min-h-screen flex-1 flex-col">
          <TopHeader mode={mode} setMode={setMode} />
          <main className="mx-auto w-full max-w-7xl p-6">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 space-y-6 md:col-span-5 lg:col-span-4">
                <Card>
                  <CardHeader className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-2"><CardTitle className="text-base">Upload Files</CardTitle><Badge variant="secondary" className="text-[10px]">{evidenceFiles.length} evidence · {templateFiles.length} template</Badge></div>
                    <Button variant="ghost" size="sm" onClick={()=>setUploadOpen(v=>!v)} className="gap-1">{uploadOpen ? <><ChevronUp className="h-4 w-4" /> Hide</> : <><ChevronDown className="h-4 w-4" /> Show</>}</Button>
                  </CardHeader>
                  {uploadOpen && (
                    <CardContent className="space-y-4 pt-0">
                      <Dropzone label="Evidence (images, csv, xlsx, pdf)" accept="image/*,.csv,.xlsx,application/pdf" onFiles={(files)=>setEvidenceFiles(prev=>[...Array.from(files).map(f=>({ name: f.name, type: f.type.includes('image')?'image': f.name.endsWith('.xlsx')?'excel': f.name.endsWith('.docx')?'doc':'other'})), ...prev])} />
                      <div className="flex flex-wrap gap-2">{evidenceFiles.map((f,i)=>(<FileChip key={i} name={f.name} type={f.type} />))}</div>
                      <div className="h-px w-full bg-slate-200" />
                      <Dropzone label="Template (instructions)" accept=".doc,.docx,.md,.txt,.pdf" onFiles={(files)=>setTemplateFiles(prev=>[...Array.from(files).map(f=>({ name: f.name, type: 'doc' as const })), ...prev])} />
                      <div className="flex flex-wrap gap-2">{templateFiles.map((f,i)=>(<FileChip key={i} name={f.name} type={'doc'} />))}</div>
                    </CardContent>
                  )}
                </Card>
                <ChatPanel messages={chatMessages} setMessages={setChatMessages} />
              </div>
              <div className="col-span-12 space-y-6 md:col-span-7 lg:col-span-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                  <div className="grow">
                    <Card className="border-indigo-100">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">AI Recertification Process</CardTitle>
                          <div className="flex gap-2">
                            <Button variant="secondary" onClick={()=>nextStep()}>Run All</Button>
                            <Button className="gap-1" onClick={()=>nextStep()} disabled={currentStep>=2}>Next Step<ChevronRight className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <ProgressSteps current={currentStep} total={7} />
                        {currentStep===1 ? <StepOne /> : <StepTwo />}
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <div>Mode: <strong className="uppercase">{mode}</strong> — Manual (confirm each step) · Assisted (key confirmations) · Full Auto (run E2E).</div>
                          <div className="flex items-center gap-2">
                            <Button variant="secondary">Run Step</Button>
                            <Button className="gap-1" onClick={()=>nextStep()} disabled={currentStep>=2}>Next Step <ChevronRight className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Modal open={!!viewer} onClose={()=>setViewer(null)}>
            {viewer && (
              <div className="grid grid-cols-1 gap-3 p-2 md:grid-cols-2">
                <img src={viewer.src} alt={viewer.caption} className="max-h-[68vh] w-full rounded-xl object-contain" />
                <div className="space-y-3 p-2">
                  <h4 className="text-sm font-semibold">{viewer.caption}</h4>
                  <div className="rounded-xl bg-slate-50 p-3 text-sm ring-1 ring-slate-200">
                    <p className="mb-1 font-medium">Source details</p>
                    <ul className="list-disc pl-5 text-slate-700"><li>Filetype: Screenshot (SVG preview)</li><li>Origin: Export / Portal UI / Email</li><li>Detected page: 1</li></ul>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-sm ring-1 ring-slate-200">
                    <p className="mb-1 font-medium">Why it matters</p>
                    <p className="text-slate-700">Confirms that the configured report parameters match the expected audit template for Step 1.</p>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}
