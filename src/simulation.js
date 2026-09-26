// The topology is an in-browser simulation. Trust is reduced deterministically
// for abnormal traffic, and nodes below 30 trust are excluded from routing.
export const initialNodes = [
  {id:'control', name:'City Control', type:'control', x:50, y:52, trust:100, traffic:24},
  {id:'a', name:'Relay Alpha', type:'relay', x:29, y:26, trust:96, traffic:14},
  {id:'b', name:'Relay Bravo', type:'relay', x:49, y:20, trust:94, traffic:16},
  {id:'c', name:'Relay Charlie', type:'relay', x:72, y:28, trust:93, traffic:15},
  {id:'d', name:'Relay Delta', type:'relay', x:29, y:72, trust:97, traffic:12},
  {id:'e', name:'Relay Echo', type:'relay', x:71, y:72, trust:95, traffic:13},
  {id:'hospital', name:'Central Hospital', type:'hospital', x:12, y:49, trust:99, traffic:20},
  {id:'ambulance', name:'Ambulance 07', type:'ambulance', x:13, y:84, trust:97, traffic:18},
  {id:'fire', name:'Fire Station 4', type:'fire', x:88, y:51, trust:98, traffic:17},
  {id:'sensor', name:'Flood Sensor 12', type:'sensor', x:49, y:88, trust:91, traffic:15},
  {id:'shelter', name:'Safe Shelter', type:'shelter', x:87, y:86, trust:96, traffic:11},
  {id:'sensor2', name:'Air Sensor 03', type:'sensor', x:89, y:13, trust:92, traffic:13},
];
export const initialLinks = [
  ['hospital','a',34],['hospital','d',45],['ambulance','d',28],['ambulance','sensor',48],['a','b',22],['a','d',31],['a','control',54],['b','control',24],['b','c',26],['b','sensor',39],['c','control',38],['c','fire',31],['c','sensor2',36],['d','sensor',25],['d','e',43],['e','sensor',27],['e','control',52],['e','fire',33],['e','shelter',24],['fire','shelter',27],['b','sensor2',57]
].map(([source,target,latency], i)=>({id:`l${i}`,source,target,latency,active:true}));

export function findRoute(nodes, links, source, target='control') {
  const usable = new Set(nodes.filter(n=>n.status!=='offline'&&n.status!=='quarantined').map(n=>n.id));
  if (!usable.has(source)||!usable.has(target)) return null;
  // Dijkstra's algorithm finds the lowest-latency path over live, trusted nodes.
  const dist=new Map([...usable].map(id=>[id,Infinity])), prev=new Map(), remaining=new Set(usable);
  dist.set(source,0);
  while(remaining.size){
    let current=null, best=Infinity;
    for(const id of remaining) if(dist.get(id)<best){best=dist.get(id);current=id;}
    if(current===null||best===Infinity) break;
    remaining.delete(current); if(current===target) break;
    for(const edge of links){if(!edge.active)continue;const next=edge.source===current?edge.target:edge.target===current?edge.source:null;if(!next||!remaining.has(next))continue;const cost=best+edge.latency;if(cost<dist.get(next)){dist.set(next,cost);prev.set(next,current);}}
  }
  if(!prev.has(target)&&source!==target)return null;
  const route=[target];while(route[0]!==source){const p=prev.get(route[0]);if(!p)return null;route.unshift(p);}return route;
}
