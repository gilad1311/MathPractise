const TOPICS=[
{id:"add20",icon:"➕",title:"חיבור וחיסור עד 20",desc:"מתחילים במספרים קטנים ומתקדמים בהדרגה",make:l=>{l=levelIndex(l);let a,b; if(l===0){a=r(0,5);b=r(0,5-a)} else if(l===1){a=r(0,10);b=r(0,10-a)} else if(l===2){a=r(0,20);b=r(0,20-a)} else {a=r(8,20);b=r(1,20-a)} return Math.random()<.5?{q:`${a} + ${b}`,a:a+b}:{q:`${a+b} − ${a}`,a:b}}},
{id:"add100",icon:"💯",title:"חיבור וחיסור עד 100",desc:"עולים בהדרגה ממספרים קטנים לחיבור ופריטה",make:l=>{l=levelIndex(l);let a,b;if(l===0){a=r(1,10);b=r(1,10)}else if(l===1){a=r(1,30);b=r(1,30)}else if(l===2){a=r(10,70);b=r(1,100-a)}else{a=r(30,90);b=r(1,100-a)}return Math.random()<.5?{q:`${a} + ${b}`,a:a+b}:{q:`${a+b} − ${b}`,a:a}}},
{id:"mult100",icon:"✖️",title:"כפל וחילוק עד 100",desc:"מתחילים בלוחות קטנים ומתקדמים",make:l=>{l=levelIndex(l);let x,y;if(l===0){x=r(2,3);y=r(2,5)}else if(l===1){x=r(2,5);y=r(2,5)}else if(l===2){x=r(2,10);y=r(2,10)}else{x=r(2,12);y=r(2,10)}return Math.random()<.5?{q:`${x} × ${y}`,a:x*y}:{q:`${x*y} ÷ ${x}`,a:y}}},
{id:"numbers1000",icon:"🔢",title:"מספרים עד 1,000",desc:"מתקדמים בהדרגה למספרים ופעולות גדולים",make:l=>{l=levelIndex(l);let a,b;if(l===0){a=r(1,20);b=r(1,20)}else if(l===1){a=r(10,100);b=r(1,50)}else if(l===2){a=r(100,500);b=r(10,100)}else{a=r(200,900);b=r(10,Math.max(10,Math.min(200,999-a)))}return Math.random()<.5?{q:`${a} + ${b}`,a:a+b}:{q:`${a+b} − ${b}`,a:a}}},
{id:"vertical",icon:"📏",title:"חיבור וחיסור במאונך",desc:"מתחילים בתרגילים קצרים ומתקדמים",make:l=>{l=levelIndex(l);let a,b;if(l===0){a=r(10,40);b=r(1,a)}else if(l===1){a=r(20,99);b=r(1,a)}else if(l===2){a=r(100,500);b=r(10,Math.min(100,a))}else{a=r(100,900);b=r(10,Math.min(200,a))}return Math.random()<.5?{q:`${a} + ${b}`,a:a+b}:{q:`${a} − ${b}`,a:a-b}}},
{id:"word",icon:"💬",title:"בעיות מילוליות",desc:"מתחילים בסיפורים קצרים וברורים",make:l=>word(levelIndex(l))},
{id:"geometry",icon:"📐",title:"גיאומטריה ומדידות",desc:"אורך, מצולעים, זמן וגופים",make:l=>geo(levelIndex(l))},
{id:"mixed",icon:"🎯",title:"תרגול מעורב",desc:"שילוב מכל נושאי הלימוד",make:l=>{const t=TOPICS[r(0,6)];return t.make(levelIndex(l))}}
];
const LEVELS=["התחלה","קל","בינוני","מתקדם"];
let data=JSON.parse(localStorage.getItem("practiceV2")||"{}");
for(const n of ["עילאי","רואי"]){
  data[n] ||= {score:0,correct:0,questions:0,secondTry:0,byTopic:{},sessions:[],goal:100,levels:{}};
  data[n].levels ||= {};
  data[n].sessions ||= [];
}
const levelName=i=>LEVELS[Math.max(0,Math.min(LEVELS.length-1,i))];
const levelIndex=l=>typeof l==='number'?l:Math.max(0,LEVELS.indexOf(l));
let S={student:null,topic:null,levelIndex:0,q:null,attempt:0,done:0,total:10,streak:0};
const $=id=>document.getElementById(id), r=(a,b)=>Math.floor(Math.random()*(b-a+1))+a, save=()=>localStorage.setItem("practiceV2",JSON.stringify(data));
function show(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$(id).classList.add("active");scrollTo(0,0)}
function updateHome(){for(const n of ["עילאי","רואי"])$(`homeScore-${n}`).textContent=`${data[n].score} ⭐`}
function word(l=0){
  let t=r(0,3),n,p;
  if(t===0){n=r(2, l===0?5:l===1?10:l===2?20:30);p=r(1,Math.min(5,n));return{q:`לעילאי היו ${n} מדבקות והוא קיבל עוד ${p}. כמה יש עכשיו?`,a:n+p}}
  if(t===1){n=r(l===0?5:l===1?10:l===2?15:25,l===0?10:l===1?25:l===2?40:60);p=r(1,Math.max(1,n-2));return{q:`לרואי היו ${n} סוכריות והוא נתן ${p}. כמה נשארו?`,a:n-p}}
  if(t===2){n=r(2,l===0?3:l===1?5:l===2?8:10);p=r(2,l===0?3:l===1?5:l===2?10:12);return{q:`יש ${n} שקיות ובכל שקית ${p} עפרונות. כמה עפרונות בסך הכול?`,a:n*p}}
  n=r(2,l===0?4:l===1?6:l===2?8:10);p=r(2,l===0?3:l===1?5:l===2?8:10);return{q:`יש ${n*p} עוגיות שמחלקים שווה בשווה בין ${n} ילדים. כמה לכל ילד?`,a:p}
}
function geo(l=0){
  let t=r(0,3);
  if(t===0){let x=r(2,l===0?10:l===1?20:50);return{q:`אורך עיפרון הוא ${x} __. איזו יחידת מידה מתאימה?`,a:"סנטימטרים",opts:["סנטימטרים","קילוגרמים","שעות","ליטרים"]}}
  if(t===1)return{q:"כמה צלעות יש למלבן?",a:4,opts:[3,4,5,6]};
  if(t===2){let h=r(1,10);let ans=(h+2)%12||12;return{q:`השעה ${h}:00. בעוד שעתיים תהיה השעה...`,a:`${ans}:00`,opts:[`${h}:00`,`${(h%12)+1}:00`,`${ans}:00`,`${((h+2)%12)+1}:00`]}}
  return{q:"איזה גוף יש לו 6 פאות ריבועיות?",a:"קובייה",opts:["קובייה","כדור","חרוט","גליל"]}
}
function renderTopics(){
  const d=data[S.student];
  $("studentTitle").textContent=`שלום ${S.student}! 👋`;
  $("topicScore").textContent=`${d.score} ⭐`;
  $("levelCards").innerHTML=`<div class="adaptive-note">🧠 <strong>למידה חכמה:</strong> מתחילים בדרגת <strong>התחלה</strong>. אחרי 3 תשובות נכונות ברצף המערכת מעלה בעדינות את רמת הקושי. אם יש טעות, נשארים באותה מדרגה עד שמתחזקים.</div>`;
  $("topicCards").innerHTML=TOPICS.map(t=>{let li=d.levels[t.id]||0;return`<button class="topic-item" data-id="${t.id}"><span class="topic-icon">${t.icon}</span><span><b>${t.title}</b><small>${t.desc} • רמה: ${levelName(li)}</small></span><em>←</em></button>`}).join("");
  document.querySelectorAll(".topic-item").forEach(b=>b.onclick=()=>start(b.dataset.id));
}
function start(id){
  S.topic=TOPICS.find(t=>t.id===id);
  S.done=0;
  S.levelIndex=data[S.student].levels[S.topic.id]||0;
  S.streak=0;
  show("exercise");
  next();
}
function next(){
  if(S.done>=S.total){finish();return}
  S.attempt=0;
  S.q=S.topic.make(S.levelIndex);
  $("exerciseTopic").textContent=`${S.topic.icon} ${S.topic.title} • ${levelName(S.levelIndex)}`;
  $("progress").textContent=`תרגיל ${S.done+1} מתוך ${S.total}`;
  $("question").textContent=S.q.q;
  $("feedback").textContent="";$("feedback").className="feedback";$("hint").classList.add("hidden");$("streak").textContent=S.streak?`🔥 ${S.streak}/3 הצלחות רצופות לשלב הבא`:"";$("checkBtn").textContent="בדיקה ✓";$("checkBtn").onclick=check;
  if(S.q.opts){$("answerArea").innerHTML=`<div class="choices">${S.q.opts.map(x=>`<button class="choice">${x}</button>`).join("")}</div>`;document.querySelectorAll(".choice").forEach(b=>b.onclick=()=>{document.querySelectorAll(".choice").forEach(x=>x.classList.remove("selected"));b.classList.add("selected")})}else{$("answerArea").innerHTML=`<input id="answer" class="answer-input" inputmode="numeric" autocomplete="off" placeholder="?" autofocus>`;$("answer").onkeydown=e=>e.key==="Enter"&&check()}
}
function val(){const c=document.querySelector(".choice.selected");return c?c.textContent:$("answer")?.value||""}
function norm(x){return String(x).trim().replace(/\s/g,"").toLowerCase()}
function advanceIfReady(){
  if(S.streak>=3 && S.levelIndex<LEVELS.length-1){
    S.levelIndex++;
    data[S.student].levels[S.topic.id]=S.levelIndex;
    S.streak=0;
    save();
    toast(`🚀 מצוין! עליתם לדרגת ${levelName(S.levelIndex)}`);
    return true;
  }
  return false;
}
function check(){
  const v=val();
  if(!v)return toast("בחרו או כתבו תשובה 🙂");
  S.attempt++;
  if(norm(v)===norm(S.q.a)){
    const d=data[S.student];d.correct++;d.questions++;d.score+=S.attempt===1?10:5;if(S.attempt===2)d.secondTry++;d.byTopic[S.topic.id] ||= {correct:0,questions:0};d.byTopic[S.topic.id].correct++;d.byTopic[S.topic.id].questions++;
    if(S.attempt===1)S.streak++;else S.streak=0;
    d.levels[S.topic.id]=S.levelIndex;
    S.done++;save();
    const promoted=advanceIfReady();
    success(S.attempt===1,promoted);
    setTimeout(next,1200);
  }else if(S.attempt===1){
    S.streak=0;
    $("feedback").textContent="כמעט! 💪 קחו נשימה ונסו שוב.";$("feedback").className="feedback failure";$("hint").textContent="💡 בדקו שוב את הפעולה, הסימנים והספרות.";$("hint").classList.remove("hidden");if($("answer")){$("answer").value="";$("answer").focus()}
  }else{
    const d=data[S.student];d.questions++;d.byTopic[S.topic.id] ||= {correct:0,questions:0};d.byTopic[S.topic.id].questions++;S.streak=0;S.done++;save();$("feedback").innerHTML="🌱 לא נורא! כל ניסיון מלמד אותנו משהו. נשארים כרגע באותה מדרגה וממשיכים הלאה.";setTimeout(next,1500)
  }
}
function finish(){const d=data[S.student];d.sessions.push({date:new Date().toISOString(),topic:S.topic.title,level:levelName(S.levelIndex)});save();$("question").textContent="🏆 סיימתם!";$("answerArea").innerHTML=`<p>סיימתם 10 תרגילים ב<strong>${S.topic.title}</strong>.</p><p>רמת הסיום: <strong>${levelName(S.levelIndex)}</strong></p><p>הניקוד של ${S.student}: <strong>${d.score} ⭐</strong></p>`;$("feedback").innerHTML="מעולה! אפשר לחזור לנושאים.";$("checkBtn").textContent="חזרה לנושאים";$("checkBtn").onclick=()=>{show("topics");renderTopics()}}
function success(first,promoted=false){$("feedback").innerHTML=promoted?`🚀 מעולה! התקדמתם לדרגת ${levelName(S.levelIndex)}! ⭐`:first?"🎉 מצוין! +10 ⭐":"🌟 כל הכבוד על הניסיון הנוסף! +5 ⭐";$("feedback").className="feedback success";confetti()}
function finish(){const d=data[S.student];d.sessions.push({date:new Date().toISOString(),topic:S.topic.title,level:S.level});save();$("question").textContent="🏆 סיימתם!";$("answerArea").innerHTML=`<p>סיימתם 10 תרגילים ב<strong>${S.topic.title}</strong>.</p><p>הניקוד של ${S.student}: <strong>${d.score} ⭐</strong></p>`;$("feedback").innerHTML="מעולה! אפשר לחזור לנושאים.";$("checkBtn").textContent="חזרה לנושאים";$("checkBtn").onclick=()=>{show("topics");$("checkBtn").onclick=check;renderTopics()}}
function confetti(){const h=$("confetti");h.innerHTML="";for(let i=0;i<65;i++){let p=document.createElement("i");p.className="piece";p.style.left=Math.random()*100+"%";p.style.top="-20px";p.style.background=`hsl(${Math.random()*360},85%,60%)`;p.style.animationDelay=Math.random()*.12+"s";h.appendChild(p)}setTimeout(()=>h.innerHTML="",1500)}
function pct(d){return d.questions?Math.round(d.correct/d.questions*100):0}
function renderDashboard(){$("dashboard").innerHTML=["עילאי","רואי"].map(n=>{let d=data[n],p=pct(d),goal=Math.max(1,d.goal);return`<div class="person"><h2>${n}<span>${d.score} ⭐</span></h2><div class="stat"><span>תרגילים</span><b>${d.questions}</b></div><div class="stat"><span>הצלחות</span><b>${d.correct}</b></div><div class="stat"><span>דיוק</span><b>${p}%</b></div><div class="stat"><span>ניסיון שני</span><b>${d.secondTry}</b></div><div class="bar"><span style="width:${p}%"></span></div><small>יעד ניקוד: ${goal} ⭐</small></div>`}).join("");$("goals").innerHTML=["עילאי","רואי"].map(n=>`<div class="goal"><label>יעד ניקוד ל-${n}</label><span><input type="number" min="10" step="10" data-goal="${n}" value="${data[n].goal}"> ⭐</span></div>`).join("");document.querySelectorAll("[data-goal]").forEach(i=>i.onchange=()=>{data[i.dataset.goal].goal=Number(i.value)||100;save();renderDashboard()})}
function fullReport(){let total=data["עילאי"].score+data["רואי"].score;$("reportContent").innerHTML=`<div class="card report-card"><h1 class="report-title">📊 דוח התקדמות</h1><p>דוח מסכם לעילאי ורואי</p><div style="font-size:2rem;font-weight:900">${total} ⭐</div><div>סה״כ ניקוד</div></div>${["עילאי","רואי"].map(n=>{let d=data[n];return`<div class="card report-card"><h2>${n} ${d.score>=d.goal?"🏆":""}</h2><div class="stat"><span>ניקוד</span><b>${d.score} ⭐</b></div><div class="stat"><span>תרגילים</span><b>${d.questions}</b></div><div class="stat"><span>הצלחות</span><b>${d.correct}</b></div><div class="stat"><span>דיוק</span><b>${pct(d)}%</b></div><div class="stat"><span>הצלחות בניסיון שני</span><b>${d.secondTry}</b></div><table class="report-table"><tr><th>נושא</th><th>נכון</th><th>סה״כ</th></tr>${TOPICS.map(t=>{let x=d.byTopic[t.id];return x?`<tr><td>${t.title}</td><td>${x.correct}</td><td>${x.questions}</td></tr>`:""}).join("")}</table></div>`}).join("")}`;show("report")}
function reportText(){return["דוח התקדמות – מתרגלים ומצליחים","",...["עילאי","רואי"].map(n=>{let d=data[n];return`${n}: ${d.score} כוכבים | ${d.correct}/${d.questions} הצלחות | דיוק ${pct(d)}% | ניסיון שני ${d.secondTry}`}),"",`סה״כ: ${data["עילאי"].score+data["רואי"].score} כוכבים`].join("\n")}
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1700)}
document.querySelectorAll(".student-card").forEach(b=>b.onclick=()=>{S.student=b.dataset.student;show("topics");renderTopics()});
$("teacherBtn").onclick=()=>{renderDashboard();show("teacher")};$("teacherReport").onclick=fullReport;
$("shareTeacher").onclick=async()=>{let t=reportText();if(navigator.share){try{await navigator.share({title:"דוח התקדמות",text:t})}catch(e){}}else{await navigator.clipboard?.writeText(t);toast("הדוח הועתק ללוח 📋")}};
$("printTeacher").onclick=()=>{fullReport();setTimeout(()=>window.print(),100)};
$("resetData").onclick=()=>{if(confirm("לאפס את כל נתוני התלמידים?")){localStorage.removeItem("practiceV2");location.reload()}};
document.querySelectorAll("[data-back]").forEach(b=>b.onclick=()=>show(b.dataset.back));$("checkBtn").onclick=check;updateHome();
let dp;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();dp=e;$("installBtn").classList.remove("hidden")});$("installBtn").onclick=async()=>{if(dp){dp.prompt();await dp.userChoice;dp=null;$("installBtn").classList.add("hidden")}else toast("פתחו את תפריט הדפדפן ובחרו הוספה למסך הבית")};
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
