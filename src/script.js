(function(){
  var valEl=document.getElementById('val'), exprEl=document.getElementById('expr');
  var cur='0', prev=null, op=null, fresh=false;
  var sym={'+':'+','-':'\u2212','*':'\u00d7','/':'\u00f7'};

  function fmt(s){
    if(s==='Error') return s;
    var neg=s[0]==='-', t=neg?s.slice(1):s, p=t.split('.');
    p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');
    return (neg?'-':'')+p.join('.');
  }
  function fit(){
    var n=fmt(cur).length, size=n>16?26:n>12?34:n>9?42:54;
    valEl.style.fontSize=size+'px';
  }
  function render(){
    valEl.textContent=fmt(cur); fit();
    exprEl.innerHTML=(prev!==null&&op)?fmt(prev)+' '+sym[op]+(fresh?'':''):'&nbsp;';
    document.querySelectorAll('.op').forEach(function(b){
      b.classList.toggle('active',!!op&&fresh&&b.dataset.k===op);
    });
  }
  function calc(a,b,o){
    a=parseFloat(a);b=parseFloat(b);var r;
    if(o==='+')r=a+b;else if(o==='-')r=a-b;else if(o==='*')r=a*b;else{ if(b===0)return 'Error'; r=a/b;}
    return String(parseFloat(r.toPrecision(12)));
  }
  function digit(d){
    if(cur==='Error'){cur='0';prev=null;op=null;}
    if(fresh){cur='0';fresh=false;}
    if(d==='.'){ if(cur.indexOf('.')>-1)return; cur+='.'; }
    else if(cur==='0') cur=d;
    else if(cur.replace(/[-.]/g,'').length<15) cur+=d;
  }
  function operator(o){
    if(cur==='Error')return;
    if(op&&!fresh){ cur=calc(prev,cur,op); if(cur==='Error'){prev=null;op=null;return;} }
    prev=cur;op=o;fresh=true;
  }
  function equals(){
    if(!op||cur==='Error')return;
    var e=fmt(prev)+' '+sym[op]+' '+fmt(cur);
    var r=calc(prev,cur,op);
    cur=r;prev=null;op=null;fresh=true;
    render();exprEl.textContent=e+' =';return true;
  }
  function press(k){
    var keep=false;
    if(/^[0-9.]$/.test(k))digit(k);
    else if('+-*/'.indexOf(k)>-1)operator(k);
    else if(k==='='||k==='Enter')keep=equals();
    else if(k==='C'){cur='0';prev=null;op=null;fresh=false;}
    else if(k==='Backspace'){
      if(fresh||cur==='Error')return;
      cur=cur.length>1?cur.slice(0,-1):'0'; if(cur==='-')cur='0';
    }
    if(!keep)render();
  }
  document.getElementById('pad').addEventListener('click',function(e){
    var b=e.target.closest('button'); if(b)press(b.dataset.k);
  });
  document.addEventListener('keydown',function(e){
    var k=e.key; if(e.metaKey||e.ctrlKey||e.altKey)return;
    if(k==='Escape'||k==='c'||k==='C')k='C';
    if(k==='x'||k==='X')k='*';
    if(k===','){k='.';}
    var sel=k==='Enter'?'=':k;
    var b=document.querySelector('button[data-k="'+sel+'"]');
    if(!b)return;
    e.preventDefault();
    b.classList.add('press');setTimeout(function(){b.classList.remove('press')},110);
    press(k);
  });
  render();
})();
