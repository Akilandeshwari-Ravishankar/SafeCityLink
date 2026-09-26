import React, { useMemo, useState } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bell, Check, ChevronDown, CircleHelp, Clock3, Crosshair, HeartPulse, Hospital, LocateFixed, Menu, Navigation, Radio, RotateCcw, Send, Shield, ShieldAlert, ShieldCheck, Signal, Siren, Waves, Wifi, Zap } from 'lucide-react';
import { initialLinks, initialNodes, findRoute } from './simulation.js';

const icons={control:Crosshair,relay:Radio,hospital:Hospital,ambulance:Navigation,fire:Siren,sensor:Activity,shelter:ShieldCheck};
const initialEvents=[
  ['SYSTEM','Network initialized · 12 nodes online'],
  ['ROUTING','All 6 emergency routes verified'],
  ['SECURITY','Trust baseline established · no threats'],
];
const messages=['Medical emergency','Fire detected','Flood warning','Evacuation required','Infrastructure failure'];

export default function App(){
  const [nodes,setNodes]=useState(initialNodes.map(n=>({...n,status:'healthy'})));
  const [links,setLinks]=useState(initialLinks);
  const [scenario,setScenario]=useState('normal');
  const [events,setEvents]=useState(initialEvents.map(([kind,text],i)=>({kind,text,time:time(-i*38)})));
  const [source,setSource]=useState('ambulance');const [message,setMessage]=useState(messages[0]);
  const [selected,setSelected]=useState('control'); const [notice,setNotice]=useState('');
  const [delivered,setDelivered]=useState(null);
  const linkUp=l=>l.active&&nodes.find(n=>n.id===l.source)?.status==='healthy'&&nodes.find(n=>n.id===l.target)?.status==='healthy';
  const addEvent=(kind,text)=>setEvents(prev=>[{kind,text,time:time(0)},...prev].slice(0,30));
  const routes=useMemo(()=>nodes.filter(n=>['ambulance','hospital','fire','shelter'].includes(n.type)).map(n=>({source:n.id,path:findRoute(nodes,links,n.id)})),[nodes,links]);
  const activePath=delivered?.path||routes.find(r=>r.source===selected)?.path||routes.find(r=>r.path)?.path||[];
  const routeEdges=new Set(activePath.slice(1).map((id,i)=>[activePath[i],id].sort().join('|')));
  const activeNodes=nodes.filter(n=>n.status!=='offline').length;
  const activeLinks=links.filter(linkUp).length;
  const threats=nodes.filter(n=>n.status==='suspicious'||n.status==='quarantined').length;
  const quarantined=nodes.filter(n=>n.status==='quarantined').length;
  const health=scenario==='normal'?98:scenario==='flood'?82:scenario==='failure'?89:scenario==='attack'?88:85;
  const delivery=scenario==='normal'?98:scenario==='flood'?84:scenario==='failure'?91:scenario==='attack'?89:86;
  const latency=scenario==='normal'?42:scenario==='flood'?91:scenario==='failure'?76:scenario==='attack'?68:81;
  const routeNames=activePath.map(id=>nodes.find(n=>n.id===id)?.name||id);
  function setToast(text){setNotice(text);window.clearTimeout(setToast.timer);setToast.timer=window.setTimeout(()=>setNotice(''),3600);}
  function reset(){setNodes(initialNodes.map(n=>({...n,status:'healthy'})));setLinks(initialLinks);setScenario('normal');setSelected('control');setDelivered(null);setEvents([{kind:'SYSTEM',text:'Network reset · 12 nodes online, no active threats',time:time(0)},...initialEvents.map(([kind,text])=>({kind,text,time:time(0)}))]);setToast('Network restored · all systems operational');}
  function flood(){const affected=['l0','l4','l12','l16'];setLinks(prev=>prev.map(l=>affected.includes(l.id)?{...l,active:false}:l));setNodes(prev=>prev.map(n=>['sensor2'].includes(n.id)?{...n,status:'offline'}:n));setScenario('flood');setDelivered(null);addEvent('DISASTER','Flood scenario activated · 4 wireless links disrupted');addEvent('ROUTING','Automatic recovery · emergency routes recalculated');setToast('Flood scenario active · resilient routes established');}
  function failure(){setLinks(prev=>prev.map(l=>l.id==='l7'?{...l,active:false}:l));setNodes(prev=>prev.map(n=>n.id==='b'?{...n,status:'offline'}:n));setScenario('failure');setDelivered(null);addEvent('FAILURE','Relay Bravo unavailable · primary backbone link lost');addEvent('ROUTING','Failover complete · alternate path established');setToast('Network failure simulated · failover complete');}
  function attack(){if(scenario==='attack')return;setNodes(prev=>prev.map(n=>n.id==='c'?{...n,status:'quarantined',trust:24,traffic:180}:n));setScenario('attack');setSelected('c');setDelivered(null);addEvent('SECURITY','Anomaly detected · Relay Charlie at 180 pkt/min (baseline 15)');addEvent('SECURITY','Trust reduced to 24% · node quarantined and excluded from routing');addEvent('ROUTING','Routes recalculated around isolated node');setToast('Threat contained · Relay Charlie quarantined');}
  function sendAlert(){const path=findRoute(nodes,links,source);if(!path){setDelivered(null);setToast('Message delivery failed · no route to control center');addEvent('ALERT',`${label(source)} · delivery failed, no available route`);return;}setDelivered({path,message,source});setSelected(source);addEvent('ALERT',`${label(source)} · ${message.toLowerCase()} delivered via ${path.length-1} hops`);setToast('Emergency alert delivered to City Control');}
  function label(id){return nodes.find(n=>n.id===id)?.name||id;}
  const nodePositions=Object.fromEntries(nodes.map(n=>[n.id,{x:34+n.x*7.35,y:22+n.y*4.75}]));
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Signal size={20}/></div><div><strong>SafeCity<span> Link</span></strong><small>RESILIENCE NETWORK</small></div></div>
      <div className="workspace-label">OPERATIONS CENTER</div><div className="side-active"><div className="side-icon"><Crosshair size={17}/></div><div><b>City Overview</b><small>Live network topology</small></div><i/></div>
      <div className="side-section">NETWORK STATUS</div><div className="side-stat"><span className="live-dot"/>Network online<span className="side-right">{activeNodes}/{nodes.length}</span></div><div className="side-stat"><ShieldCheck size={14}/>Threat monitoring<span className="side-right">{threats?`${threats} alert`:'Protected'}</span></div>
      <div className="side-section">QUICK ACCESS</div><button className="side-link" onClick={()=>document.getElementById('network')?.scrollIntoView({behavior:'smooth'})}><Radio size={16}/> Network topology</button><button className="side-link" onClick={()=>document.getElementById('alerts')?.scrollIntoView({behavior:'smooth'})}><Bell size={16}/> Emergency alerts</button><button className="side-link" onClick={()=>document.getElementById('events')?.scrollIntoView({behavior:'smooth'})}><Clock3 size={16}/> Event timeline</button>
      <div className="sidebar-bottom"><div className="sdg-mark">11</div><div><strong>UN Sustainable<br/>Development Goal</strong><small>SUSTAINABLE CITIES</small></div><ChevronDown size={15}/></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> <b>City Overview</b></div><div className="top-right"><div className="system-online"><span className="live-dot"/> ALL SYSTEMS {scenario==='normal'?'OPERATIONAL':'MONITORING'}</div><button className="icon-button" aria-label="Notifications"><Bell size={17}/>{threats>0&&<i/>}</button><div className="avatar">SC</div><div className="operator">City Operator<small>Emergency response</small></div></div></header>
      <div className="content">
        <section className="heading-row"><div><div className="eyebrow"><span className="live-dot"/> SMART CITY EMERGENCY NETWORK</div><h1>City Overview</h1><p>Secure emergency communication for resilient cities</p></div><div className="header-actions"><span className="sdg-pill"><span>11</span> UN SDG 11</span><button className="button secondary" onClick={reset}><RotateCcw size={15}/> Reset simulation</button></div></section>
        {notice&&<div className="toast"><Check size={17}/>{notice}<button onClick={()=>setNotice('')}>×</button></div>}
        {scenario!=='normal'&&<div className={`scenario-banner ${scenario}`}><div className="banner-symbol">{scenario==='flood'?<Waves/>:scenario==='attack'?<ShieldAlert/>:<Zap/>}</div><div><b>{scenario==='flood'?'FLOOD SCENARIO ACTIVE':scenario==='attack'?'SECURITY THREAT CONTAINED':'NETWORK FAILURE · FAILOVER ACTIVE'}</b><span>{scenario==='flood'?'4 links disrupted · emergency routes recovered':scenario==='attack'?'Relay Charlie isolated · traffic blocked':'Relay Bravo offline · alternate routes established'}</span></div><button onClick={reset}>Dismiss <span>·</span> Reset</button></div>}
        <section className="metrics-grid">
          <Metric icon={HeartPulse} label="Network health" value={`${health}%`} foot="Overall resilience" accent="green" trend="+2.4%"/>
          <Metric icon={Radio} label="Active nodes" value={`${activeNodes}`} suffix={`/ ${nodes.length}`} foot="Devices online" accent="blue"/>
          <Metric icon={Activity} label="Packet delivery" value={`${delivery}%`} foot="Successful transmission" accent="purple" trend="+1.8%"/>
          <Metric icon={Clock3} label="Average latency" value={`${latency}`} suffix="ms" foot="End-to-end delay" accent="amber"/>
          <Metric icon={ShieldAlert} label="Active threats" value={`${threats}`} foot={threats?'Requires attention':'No anomalies detected'} accent={threats?'red':'green'}/>
          <Metric icon={ShieldCheck} label="Quarantined" value={`${quarantined}`} foot="Nodes isolated" accent="teal"/>
        </section>
        <div className="dashboard-grid">
          <section className="panel network-panel" id="network"><div className="panel-head"><div><div className="panel-title"><h2>Network topology</h2><span className="live-tag"><i/> LIVE</span></div><p>Resilient mesh · {activeNodes} nodes · {activeLinks} active links</p></div><button className="more-button" title="Network visualization"><CircleHelp size={17}/></button></div>
            <div className="network-map"><div className="map-grid"/><div className="map-label label-north">NORTH DISTRICT</div><div className="map-label label-south">SOUTH DISTRICT</div><svg className="links-svg" viewBox="0 0 768 478" preserveAspectRatio="none" aria-label="Wireless network links">{links.map(l=>{const a=nodePositions[l.source],b=nodePositions[l.target],key=[l.source,l.target].sort().join('|'),up=linkUp(l);return <g key={l.id}><line x1={`${a.x/768*100}%`} y1={`${a.y/478*100}%`} x2={`${b.x/768*100}%`} y2={`${b.y/478*100}%`} className={`edge ${up?'':'edge-down'} ${routeEdges.has(key)&&up?'edge-route':''}`}/>{!up&&<circle cx={`${((a.x+b.x)/2)/768*100}%`} cy={`${((a.y+b.y)/2)/478*100}%`} r="4" className="failure-point"/>}</g>})}</svg>
              {nodes.map(n=>{const Icon=icons[n.type],p=nodePositions[n.id];return <button key={n.id} className={`map-node ${n.type} ${n.status} ${selected===n.id?'selected':''} ${activePath.includes(n.id)?'on-route':''}`} style={{left:`${p.x/768*100}%`,top:`${p.y/478*100}%`}} onClick={()=>{setSelected(n.id);if(['ambulance','hospital','fire','shelter'].includes(n.type))setSource(n.id);}} title={`${n.name} · Trust ${n.trust}% · ${n.status}`}><span className="node-core"><Icon size={n.type==='control'?20:17}/>{n.status==='quarantined'&&<i className="quarantine-mark">!</i>}</span><span className="node-caption"><b>{n.name}</b><small>{n.status==='quarantined'?'QUARANTINED':n.status==='offline'?'OFFLINE':n.type==='control'?'CONTROL CENTER':n.type.toUpperCase()}</small></span></button>})}
              <div className="map-controls"><button title="Center network"><LocateFixed size={15}/></button><span>SIMULATED COVERAGE</span></div><div className="map-legend"><span><i className="legend-green"/>Healthy</span><span><i className="legend-blue"/>Critical</span><span><i className="legend-orange"/>Disrupted</span></div>
            </div>
            <div className="route-footer"><div className="route-icon"><Navigation size={15}/></div><div className="route-detail"><small>ACTIVE ROUTE <span>·</span> LOW-LATENCY PATH</small><strong>{routeNames.length?routeNames.map((name,i)=><React.Fragment key={`${name}-${i}`}>{i>0&&<span className="route-arrow"> › </span>}{name}</React.Fragment>):'No active route to control center'}</strong></div><div className="route-hops">{activePath.length?`${activePath.length-1} HOPS`:'NO ROUTE'}</div></div>
          </section>
          <div className="right-column">
            <section className="panel actions-panel"><div className="panel-head compact"><div><h2>Scenario controls</h2><p>Test network resilience</p></div><span className="simulation-tag"><Activity size={12}/> SIMULATION</span></div><div className="scenario-buttons"><button className="scenario-button flood-button" onClick={flood}><span><Waves size={17}/></span><div><b>Simulate Flood</b><small>Disrupt infrastructure links</small></div><ArrowUpRight size={15}/></button><button className="scenario-button fail-button" onClick={failure}><span><Zap size={17}/></span><div><b>Network Failure</b><small>Take a relay offline</small></div><ArrowUpRight size={15}/></button><button className="scenario-button attack-button" onClick={attack} disabled={scenario==='attack'}><span><ShieldAlert size={17}/></span><div><b>Simulate Cyber Attack</b><small>Detect & quarantine threat</small></div><ArrowUpRight size={15}/></button></div><div className="rules-note"><ShieldCheck size={14}/><span>Trust below <b>30%</b> triggers automatic quarantine.</span></div></section>
            <section className="panel alert-panel" id="alerts"><div className="panel-head compact"><div><h2>Emergency alert</h2><p>Send a priority message to City Control</p></div><div className="alert-icon"><Bell size={15}/></div></div><label>MESSAGE SOURCE</label><div className="select-wrap"><select value={source} onChange={e=>setSource(e.target.value)}>{nodes.filter(n=>['ambulance','hospital','fire','shelter'].includes(n.type)).map(n=><option key={n.id} value={n.id}>{n.name}</option>)}</select><ChevronDown size={15}/></div><label>ALERT TYPE</label><div className="select-wrap"><select value={message} onChange={e=>setMessage(e.target.value)}>{messages.map(m=><option key={m}>{m}</option>)}</select><ChevronDown size={15}/></div><button className="send-button" onClick={sendAlert}><Send size={15}/> Send emergency alert <ArrowUpRight size={15}/></button>{delivered&&<div className="delivery-result"><span><Check size={13}/></span><div><b>ALERT DELIVERED</b><small>{delivered.message} · {delivered.path.length-1} hop route</small></div></div>}</section>
          </div>
        </div>
        <div className="lower-grid">
          <section className="panel comparison-panel"><div className="panel-head compact"><div><h2>Resilience overview</h2><p>Network performance across scenarios</p></div><span className="comparison-chip"><Activity size={12}/> REAL-TIME</span></div><div className="compare-head"><span>PERFORMANCE</span><span>BASELINE</span><span>CURRENT</span></div><Compare label="Active nodes" before="12 / 12" current={`${activeNodes} / 12`} pct={activeNodes/12*100} tone="blue"/><Compare label="Connected links" before="21" current={`${activeLinks}`} pct={activeLinks/21*100} tone="purple"/><Compare label="Packet delivery" before="98%" current={`${delivery}%`} pct={delivery} tone="green"/><Compare label="Average latency" before="42 ms" current={`${latency} ms`} pct={Math.min(100,42/latency*100)} tone="amber" inverse/><Compare label="Threats detected" before="0" current={`${threats}`} pct={threats?100:0} tone={threats?'red':'green'}/></section>
          <section className="panel log-panel" id="events"><div className="panel-head compact"><div><h2>Event timeline</h2><p>Live network activity</p></div><button className="view-all" onClick={()=>setEvents(initialEvents.map(([kind,text])=>({kind,text,time:time(0)})))}>Clear <ArrowUpRight size={13}/></button></div><div className="event-list">{events.map((e,i)=><div className="event-row" key={`${e.text}-${i}`}><div className={`event-dot ${e.kind.toLowerCase()}`}/><time>{e.time}</time><span className={`event-kind ${e.kind.toLowerCase()}`}>{e.kind}</span><p>{e.text}</p></div>)}</div></section>
        </div>
        <section className="sdg-info"><div className="sdg-icon">11</div><div className="sdg-copy"><span>BUILT FOR A MORE RESILIENT FUTURE</span><h3>How SafeCity Link supports SDG 11</h3><p>This prototype demonstrates one technological approach toward urban resilience: keeping emergency communication available through disasters, recovering routes around damaged infrastructure, and isolating compromised nodes to help protect continuity of critical city services.</p></div><div className="sdg-points"><div><Check size={14}/> Resilient infrastructure</div><div><Check size={14}/> Disaster response continuity</div><div><Check size={14}/> Safer, more resilient cities</div></div><div className="sdg-watermark">11</div></section>
        <footer><span><span className="live-dot"/> SAFE CITY LINK <i>·</i> SIMULATION ENVIRONMENT</span><span>SECURE COMMUNICATION FOR RESILIENT CITIES <b>·</b> SDG 11</span></footer>
      </div>
    </main>
  </div>
}
function time(offset){const d=new Date(Date.now()+offset);return d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});}
function Metric({icon:Icon,label,value,suffix,foot,accent,trend}){return <div className="metric-card"><div className={`metric-icon ${accent}`}><Icon size={17}/></div><span className="metric-label">{label}</span><div className="metric-value">{value}<small>{suffix}</small></div><div className="metric-foot">{trend&&<span className="trend"><ArrowUpRight size={12}/>{trend}</span>}{foot}</div></div>}
function Compare({label,before,current,pct,tone,inverse}){return <div className="compare-row"><span>{label}</span><span>{before}</span><div className="compare-current"><b>{current}</b><div className="progress"><i className={tone} style={{width:`${Math.max(pct,3)}%`}}/></div></div></div>}
