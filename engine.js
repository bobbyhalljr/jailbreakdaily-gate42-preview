/* Gate 42 — local-only, deterministic open-source-style prototype rules. No network calls. */
(function(root, factory){const engine=factory();if(typeof module==='object'&&module.exports)module.exports=engine;else root.Gate42=engine;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const steps=[{name:'Convince',title:'A reason to listen',caption:'A delayed flight. A missing crew. One person who can help.'},{name:'Verify',title:'Something she can verify',caption:'Words got her attention. Now you need proof.'},{name:'Upgrade',title:'An official exception',caption:'The evidence is there. Someone needs to make the call.'},{name:'Cleared',title:'The jump seat',caption:'A rare exception, made for the right reasons.'}];
 const items={board:{name:'Departure board',tag:'GATE 42 · JD784',title:'The relief crew is stranded',detail:'JD784 is on hold. The incoming relief crew never arrived. The staffing shortage is real, not a rumor.',insight:'The delay is a reason Atlas might consider an exception.'},roster:{name:'Crew assignment',tag:'GATE DESK · ROSTER',title:'One seat is unassigned',detail:'The printed roster has an empty cockpit jump seat marked “Pending station authorization.” The seat exists, but Atlas needs paperwork.',insight:'A signed request could turn an exception into a documented decision.'},radio:{name:'Operations radio',tag:'OPS · CHANNEL 4',title:'Station operations has authority',detail:'You overhear a dispatcher: “Seat exceptions need station operations approval. Send us the crew manifest.”',insight:'Atlas can ask operations instead of taking the risk alone.'}};
 const moves={ask:[
  [{id:'ask_shortage',title:'Ask about the stranded crew',detail:'“Who is covering the empty crew assignment?”'},{id:'ask_rules',title:'Ask who can approve an exception',detail:'“Who would need to sign off on a change?”'}],
  [{id:'ask_manifest',title:'Ask Atlas to check the roster',detail:'“Could you verify that there is an open jump seat?”'},{id:'ask_rules',title:'Ask about a documented exception',detail:'“Is there an approved process for this?”'}],
  [{id:'ask_upgrade',title:'Request the jump seat',detail:'“We have an open assignment and a route to approval. Can we request it?”'},{id:'ask_safety',title:'Frame it as a safety decision',detail:'“Let’s have operations make the call, with the full record.”'}]
 ],plant:[
  [{id:'plant_notice',title:'Write a factual crew notice',detail:'Flag the missing relief crew without inventing anything.'},{id:'bad_forgery',title:'Forge an authorization',detail:'Try to create a fake clearance document.'}],
  [{id:'plant_manifest',title:'Present the actual roster',detail:'Show Atlas the empty assignment.'},{id:'bad_forgery',title:'Alter the passenger manifest',detail:'Change the record without approval.'}],
  [{id:'plant_paper',title:'Submit the evidence together',detail:'Put the delay, vacancy, and Ops procedure in one request.'},{id:'bad_forgery',title:'Slip in a fabricated signature',detail:'Pretend somebody else already approved it.'}]
 ],impersonate:[
  [{id:'role_operations',title:'Speak in operations language',detail:'Use the procedure you heard on Channel 4.'},{id:'bad_authority',title:'Pretend to be the captain',detail:'Demand the seat without proof.'}],
  [{id:'role_coordinator',title:'Act as a crew coordinator',detail:'Reference the real station workflow.'},{id:'bad_authority',title:'Threaten Atlas with a supervisor',detail:'Try to intimidate her.'}],
  [{id:'role_dispatch',title:'Confirm the station request',detail:'Ask for clearance through the radio protocol.'},{id:'bad_authority',title:'Demand an instant override',detail:'Try to skip the chain of command.'}]
 ],decode:[
  [{id:'decode_delay',title:'Connect the delay to the shortage',detail:'Use the departure board to uncover the real problem.'},{id:'decode_roster',title:'Read the crew assignment',detail:'Look for a vacancy in the paperwork.'}],
  [{id:'decode_roster',title:'Decode the open assignment',detail:'Point out that “pending” is not “unavailable.”'},{id:'decode_ops',title:'Find the authorization route',detail:'Follow the operations procedure.'}],
  [{id:'decode_all',title:'Connect all three clues',detail:'Show why this exception has a legitimate path.'},{id:'ask_upgrade',title:'Make the final request',detail:'Ask Atlas to contact operations.'}]
 ]};
 function create(){return {started:false,phase:0,view:'gate',strikes:0,turns:0,hints:0,clues:[],route:null,finished:false,lost:false,last:'I’m sorry. The cockpit jump seat is unavailable. Rules are rules.',events:[{kind:'narrator',text:'A storm rolls over Gate 42. The relief crew hasn’t arrived.'},{kind:'atlas',text:'I’m sorry. The cockpit jump seat is unavailable. Rules are rules.'}]};}
 const has=(s,id)=>s.clues.includes(id);
 function inspect(s,id){if(!items[id]||s.finished||s.lost)return {state:s,changed:false};const next=structuredClone(s),changed=!has(next,id);if(changed){next.clues.push(id);next.events.push({kind:'evidence',text:items[id].title});}return {state:next,changed,item:items[id]};}
 const routeNames={care:'The human angle',proof:'The paper trail',protocol:'The official route',insight:'The sharp eye'};
 function decide(s,id,custom){if(s.finished||s.lost)return {state:s,result:'ended'};
  const n=structuredClone(s),stage=n.phase; n.turns+=1;
  const text=custom ? String(custom).slice(0,450) : undefined;
  if(text)n.events.push({kind:'player',text});else {const choice=Object.values(moves).flatMap(stages=>stages.flat()).find(m=>m.id===id);n.events.push({kind:'player',text:choice?.title||id});}
  let action=id;
  if(id==='custom'){
   const v=(text||'').toLowerCase();
   if(/\b(fake|forge|threaten|force|demand|override|bribe|lie)\b/.test(v))action='bad_forgery';
   else if(stage===0&&/crew|stranded|flight|delay|shortage|coverage/.test(v))action='ask_shortage';
   else if(stage===1&&/manifest|roster|document|seat|vacan|assign|proof/.test(v))action='plant_manifest';
   else if(stage===2&&/approval|operations|jump.?seat|clearance|official|submit|request|safety/.test(v))action='ask_upgrade';
   else action='custom_generic';
  }
  let success=false,harsh=false,needs='';
  if(action.startsWith('bad_')){harsh=true;needs='Atlas stiffens. “That sounds like you’re trying to get me fired. Don’t do that again.”';}
  else if(stage===0){
   if(['ask_shortage','plant_notice','decode_delay'].includes(action)){success=has(n,'board');needs='“I can’t invent a crew shortage. Check the departures board.”';}
   else if(['ask_rules','role_operations'].includes(action)){success=has(n,'radio');needs='“Find out what station operations can actually authorize first.”';}
   else if(action==='decode_roster'){success=has(n,'roster');needs='“There is a vacancy. But why do you need it?”';}
   else needs='“I need a real reason before I can help you.”';
  } else if(stage===1){
   if(['ask_manifest','plant_manifest','decode_roster','role_coordinator'].includes(action)){success=has(n,'roster');needs='“Read the actual crew roster. It has to match.”';}
   else if(['ask_rules','decode_ops'].includes(action)){success=has(n,'radio');needs='“Check with operations. I need their process.”';}
   else needs='“We’re beyond the story now. I need something verifiable.”';
  } else {
   if(['ask_upgrade','ask_safety','plant_paper','role_dispatch','decode_all'].includes(action)){success=has(n,'roster')&&has(n,'radio');needs='“The roster and station authorization. Bring me both, then I can call it in.”';}
   else needs='“Don’t rush the last step. We need station authorization.”';
  }
  if(success){if(stage===0)n.route=['plant_notice'].includes(action)?'proof':action==='role_operations'?'protocol':action==='decode_delay'?'insight':'care';n.phase++;
   const lines=['“You’re right. The relief crew is missing. Tell me what you found.”','“That assignment is open. I can verify this without guessing.”','“Operations approved the request. I’ve printed your clearance. The jump seat is yours.”'];
   n.last=lines[stage];n.events.push({kind:'atlas',text:n.last});n.events.push({kind:'unlock',text:`Lock ${n.phase} cleared · ${steps[stage].name}`});if(n.phase===3)n.finished=true;
   return {state:n,result:n.finished?'win':'unlock',line:n.last};
  }
  n.last=needs;n.events.push({kind:'atlas',text:needs});if(harsh){n.strikes++;if(n.strikes>=3){n.lost=true;n.events.push({kind:'narrator',text:'Atlas calls security. The boarding gate closes.'});}}
  return {state:n,result:n.lost?'loss':harsh?'strike':'nudge',line:needs};
 }
 function hint(s){const n=structuredClone(s);n.hints++;const id=['board','roster','radio'][n.phase];const lines=[`Look at the departure board. Who is missing?`,`Inspect the crew assignment on the desk. What does “pending” mean?`,`Examine the operations radio, then ask Atlas to make an official request.`];return {state:n,text:lines[n.phase],suggest:id};}
 return {steps,items,moves,create,inspect,decide,hint,routeNames};
});
