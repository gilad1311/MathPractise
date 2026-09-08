const TOPICS = [
  {id:"add20", icon:"➕", title:"חיבור וחיסור עד 20", desc:"עם ובלי מעבר/פריטה", gen:()=>{let a=rand(0,20),b=rand(0,20); if(Math.random()<.5){a=rand(0,20);b=rand(0,20-a)} return {q:`${a} + ${b}`,a:a+b}}, genSub:()=>{let a=rand(5,20),b=rand(0,a);return {q:`${a} − ${b}`,a:a-b}}},
  {id:"add100", icon:"💯", title:"חיבור וחיסור עד 100", desc:"עם ובלי מעבר/פריטה", gen:()=>{let a=rand(10,90),b=rand(0,100-a);return {q:`${a} + ${b}`,a:a+b}}, genSub:()=>{let a=rand(10,100),b=rand(0,a);return {q:`${a} − ${b}`,a:a-b}}},
  {id:"mult100", icon:"✖️", title:"כפל וחילוק עד 100", desc:"תרגילי כפל וחילוק", gen:()=>{let a=rand(2,10),b=rand(2,10);return {q:`${a} × ${b}`,a:a*b}}, genSub:()=>{let b=rand(2,10),ans=rand(2,10);return {q:`${b*ans} ÷ ${b}`,a:ans}}},
  {id:"numbers1000", icon:"🔢", title:"מספרים עד 1,000", desc:"מספרים ופעולות", gen:()=>{let a=rand(100,999),b=rand(1,Math.min(100,999-a));return {q:`${a} + ${b}`,a:a+b}}, genSub:()=>{let a=rand(100,999),b=rand(1,Math.min(100,a));return {q:`${a} − ${b}`,a:a-b}}},
  {id:"vertical", icon:"📏", title:"חיבור וחיסור במאונך", desc:"אותם תרגילים בתצוגה מסודרת", gen:()=>{let a=rand(100,999),b=rand(10,Math.min(999-a,300));return {q:`${a} + ${b}`,a:a+b,vertical:true}}, genSub:()=>{let a=rand(100,999),b=rand(10,a);return {q:`${a} − ${b}`,a:a-b,vertical:true}}},
  {id:"word", icon:"💬", title:"בעיות מילוליות", desc:"קריאה, הבנה ובחירת פעולה", gen:wordProblem},
  {id:"geometry", icon:"📐", title:"גיאומטריה ומדידות", desc:"אורך, מצולעים, זמן וגופים", gen:geometryProblem},
  {id:"mixed", icon:"🎯", title:"תרגול מעורב", desc:"שילוב מכל נושאי הלימוד", gen:()=>{const list=TOPICS.filter(t=>t.id!=="mixed"); const t=list[rand(0,list.length-1)]; return Math.random()<.5?t.gen():t.genSub?t.genSub():t.gen()}}
];

const state = {
  data: JSON.parse(localStorage.getItem("mathPracticeData") || "{}"),
  student:null, topic:null, question:null, attempts:0, completed:0, total:10, streak:0, selected:null
};
for(const s of ["עילאי","רואי"]) state.data[s] ||= {score:0,correct:0,questions:0,secondTry:0,byTopic:{},history:[]};

const $=id=>document.getElementById(id);
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const save=()=>localStorage.setItem("mathPracticeData",JSON.stringify(state.data));
const show=id=>{document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$(id).classList.add("active");scrollTo(0,0)};
const current=()=>state.data[state.student];

function wordProblem(){
  const type=rand(0,3);
  if(type===0){let n=rand(3,12),p=rand(2,8);return {q:`לעילאי היו ${n} מדבקות. הוא קיבל עוד ${p}. כמה מדבקות יש לו עכשיו?`,a:n+p,options:[n+p,n-p,n*p,n]}}
  if(type===1){let n=rand(12,30),p=rand(2,n-2);return {q:`לרואי היו ${n} סוכריות. הוא נתן ${p} לחבר. כמה נשארו?`,a:n-p,options:[n-p,n+p,p,n]}}
  if(type===2){let n=rand(2,10),p=rand(2,10);return {q:`יש ${n} שקיות ובכל שקית ${p} עפרונות. כמה עפרונות בסך הכול?`,a:n*p,options:[n*p,n+p,n-p,p]}}
  let total=rand(12,40),groups=rand(2,5); while(total%groups) total++; return {q:`יש ${total} עוגיות שמחלקים שווה בשווה בין ${groups} ילדים. כמה יקבל כל ילד?`,a:total/groups,options:[total/groups,total+groups,total-groups,groups]};
}
function geometryProblem(){
  const t=rand(0,3);
  if(t===0){let a=rand(2,20);return {q:`אורך עיפרון הוא ${a} ס״מ. איזה מדד מתאים לאורך עיפרון?`,a:"סנטימטרים",options:["סנטימטרים","קילוגרמים","שעות","ליטרים"]}}
  if(t===1){return {q:"כמה צלעות יש למלבן?",a:4,options:[3,4,5,6]}}
  if(t===2){let h=rand(1,12);return {q:`השעה עכשיו ${h}:00. בעוד שעתיים תהיה השעה...`,a:`${(h+2-1)%12+1}:00`,options:[`${(h+1-1)%12+1}:00`,`${(h+2-1)%12+1}:00`,`${(h+3-1)%12+1}:00`,`${h}:00`]}}
  return {q:"איזה גוף יש לו 6 פאות ריבועיות?",a:"קובייה",options:["קובייה","כדור","חרוט","גליל"]};
}

function updateScores(){
  for(const s of ["עילאי","רואי"]) $(`score-${s}`).textContent=`${state.data[s].score} ⭐`;
  if(state.student){$("currentScore").textContent=`${current().score} ⭐`; $("exerciseScore").textContent=`${current().score} ⭐`}
}
function renderTopics(){
  $("studentTitle").textContent=`שלום ${state.student}! 👋`;
  $("topicCards").innerHTML=TOPICS.map(t=>`<button class="topic-item" data-topic="${t.id}"><span class="topic-icon">${t.icon}</span><span><h3>${t.title}</h3><p>${t.desc}</p></span><span class="arrow">←</span></button>`).join("");
  document.querySelectorAll(".topic-item").forEach(b=>b.onclick=()=>startTopic(b.dataset.topic));
  updateScores();
}
function startTopic(id){
  state.topic=TOPICS.find(t=>t.id===id); state.completed=0; state.total=10; state.streak=0; show("exercise"); nextQuestion();
}
function nextQuestion(){
  if(state.completed>=state.total){finishSession();return}
  state.attempts=0;state.selected=null;
  const g=Math.random()<.5?state.topic.gen:state.topic.genSub||state.topic.gen;
  state.question=g();
  $("exerciseTopic").textContent=state.topic.title;
  $("progress").textContent=`תרגיל ${state.completed+1} מתוך ${state.total}`;
  $("question").textContent=state.question.q;
  $("feedback").textContent="";
  $("feedback").className="feedback";
  $("hint").classList.add("hidden");
  const q=state.question;
  if(q.options){
    const opts=[...q.options]; // preserve problem-generated options
    $("answerArea").innerHTML=`<div class="choice-grid">${opts.map((o,i)=>`<button class="choice" data-i="${i}">${o}</button>`).join("")}</div>`;
    document.querySelectorAll(".choice").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".choice").forEach(x=>x.classList.remove("selected"));btn.classList.add("selected");state.selected=btn.textContent});
  }else{
    $("answerArea").innerHTML=`<input id="answer" class="answer-input" inputmode="numeric" autocomplete="off" aria-label="תשובה" placeholder="?">`;
    $("answer").focus();
    $("answer").onkeydown=e=>{if(e.key==="Enter")checkAnswer()};
  }
  $("checkBtn").textContent="בדיקה ✓";
  updateScores();
}
function normalize(v){return String(v).trim().replace(/\s+/g,"").replace(":",":").toLowerCase()}
function checkAnswer(){
  let val=state.question.options ? state.selected : $("answer")?.value;
  if(val===null||val===undefined||val===""){toast("בחרו או כתבו תשובה 🙂");return}
  state.attempts++;
  const correct=normalize(val)===normalize(state.question.a);
  if(correct){
    current().correct++; current().questions++; current().score += state.attempts===1?10:5;
    if(state.attempts===2) current().secondTry++;
    const tid=state.topic.id; current().byTopic[tid] ||= {correct:0,questions:0}; current().byTopic[tid].correct++; current().byTopic[tid].questions++;
    state.completed++;state.streak++;
    feedbackSuccess(state.attempts===1);
    save();updateScores();
    setTimeout(nextQuestion,1200);
  }else if(state.attempts===1){
    $("feedback").innerHTML="כמעט! 💪 נסו שוב — אתם יכולים.";
    $("feedback").className="feedback failure";
    $("hint").textContent=`💡 תזכורת: בדקו את הפעולה והספרות. קחו נשימה ונסו פעם נוספת.`;
    $("hint").classList.remove("hidden");
    if($("answer")){$("answer").value="";$("answer").focus()}
    state.streak=0;
  }else{
    current().questions++;
    const tid=state.topic.id; current().byTopic[tid] ||= {correct:0,questions:0}; current().byTopic[tid].questions++;
    state.completed++;state.streak=0;
    $("feedback").innerHTML=`לא נורא! 🌱 <br>כל ניסיון מלמד אותנו משהו. ממשיכים לתרגיל הבא!`;
    $("feedback").className="feedback";
    save();setTimeout(nextQuestion,1600);
  }
}
function feedbackSuccess(first){
  $("feedback").innerHTML=first?"🎉 מצוין! תשובה נכונה! +10 ⭐":"🌟 כל הכבוד על הניסיון הנוסף! +5 ⭐";
  $("feedback").className="feedback success";confetti();
}
function finishSession(){
  const c=current();
  c.history.push({date:new Date().toISOString(),topic:state.topic.title,score:c.score,correct:c.correct,questions:c.questions});
  save(); updateScores();
  $("question").textContent="🏆 כל הכבוד!";
  $("answerArea").innerHTML=`<p style="font-size:1.2rem">סיימתם 10 תרגילים בנושא <strong>${state.topic.title}</strong>.</p>`;
  $("feedback").innerHTML=`${state.student} צבר/ה עד עכשיו <strong>${c.score} ⭐</strong>`;
  $("feedback").className="feedback success";
  $("checkBtn").textContent="חזרה לנושאים";
  $("checkBtn").onclick=()=>{ $("checkBtn").onclick=checkAnswer; show("topics"); renderTopics(); };
}
function confetti(){
  const host=$("confetti");host.innerHTML="";
  for(let i=0;i<70;i++){const p=document.createElement("i");p.className="piece";p.style.left=Math.random()*100+"%";p.style.top=(-10-Math.random()*20)+"%";p.style.background=`hsl(${Math.random()*360},85%,60%)`;p.style.transform=`rotate(${Math.random()*360}deg)`;p.style.animationDelay=(Math.random()*.15)+"s";host.appendChild(p)}
  setTimeout(()=>host.innerHTML="",1600);
}
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1800)}

function report(){
  const names=["עילאי","רואי"], totalScore=names.reduce((a,n)=>a+state.data[n].score,0);
  $("reportContent").innerHTML=`<div class="card" style="margin-top:18px;text-align:center"><div style="font-size:2.3rem;font-weight:900">${totalScore} ⭐</div><div style="color:var(--muted)">סה״כ ניקוד של שני התלמידים</div></div>
  <div class="report-grid">${names.map(n=>{
    const d=state.data[n], pct=d.questions?Math.round(d.correct/d.questions*100):0;
    const topics=TOPICS.map(t=>{const x=d.byTopic[t.id];return x?`<tr><td>${t.title}</td><td>${x.correct}</td><td>${x.questions}</td></tr>`:""}).join("");
    return `<div class="report-student"><h2>${n} ${d.score>=100?"🏆":""}</h2>
      <div class="stat-row"><span>ניקוד</span><strong>${d.score} ⭐</strong></div>
      <div class="stat-row"><span>תרגילים</span><strong>${d.questions}</strong></div>
      <div class="stat-row"><span>הצלחות</span><strong>${d.correct}</strong></div>
      <div class="stat-row"><span>דיוק</span><strong>${pct}%</strong></div>
      <div class="stat-row"><span>הצלחות בניסיון שני</span><strong>${d.secondTry}</strong></div>
      <div class="bar"><span style="width:${pct}%"></span></div>
      <details><summary>פירוט לפי נושא</summary><table class="report-table"><tr><th>נושא</th><th>נכון</th><th>תרגילים</th></tr>${topics||"<tr><td colspan=3>עדיין אין נתונים</td></tr>"}</table></details>
    </div>`}).join("")}</div>`;
}
function reportText(){
  return ["דוח התקדמות – מתרגלים ומצליחים","",...["עילאי","רואי"].map(n=>{const d=state.data[n],p=d.questions?Math.round(d.correct/d.questions*100):0;return `${n}: ${d.score} כוכבים | ${d.correct}/${d.questions} הצלחות | דיוק ${p}% | ניסיון שני: ${d.secondTry}`}),"",`סה"כ ניקוד: ${["עילאי","רואי"].reduce((a,n)=>a+state.data[n].score,0)} ⭐`].join("\n");
}

document.querySelectorAll(".student-card").forEach(b=>b.onclick=()=>{state.student=b.dataset.student;show("topics");renderTopics()});
$("reportHome").onclick=()=>{report();show("report")};
$("shareReport").onclick=async()=>{const txt=reportText();if(navigator.share){try{await navigator.share({title:"דוח התקדמות – מתרגלים ומצליחים",text:txt})}catch(e){}}else{await navigator.clipboard?.writeText(txt);toast("הדוח הועתק ללוח 📋")}};
$("printReport").onclick=()=>window.print();
$("resetAll").onclick=()=>{if(confirm("לאפס את כל נתוני עילאי ורואי?")){localStorage.removeItem("mathPracticeData");location.reload()}};
document.querySelectorAll("[data-back]").forEach(b=>b.onclick=()=>show(b.dataset.back));
$("checkBtn").onclick=checkAnswer;
updateScores();

let deferredPrompt;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installBtn").classList.remove("hidden")});
$("installBtn").onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("installBtn").classList.add("hidden")}else toast("בדפדפן זה אפשר להתקין דרך תפריט הדפדפן → הוספה למסך הבית")};
if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
