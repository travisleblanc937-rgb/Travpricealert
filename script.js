// Sample dataset (fastest path for now)
const sampleCards = [
  {id:1,name:'Charizard Holo',price:350.00,history:[320,330,340,350]},
  {id:2,name:'Pikachu Promo',price:45.50,history:[40,42,44,45.5]},
  {id:3,name:'Blastoise Holo',price:125.00,history:[120,122,124,125]},
  {id:4,name:'Umbreon GX',price:78.25,history:[70,72,75,78.25]},
  {id:5,name:'Gengar VMAX',price:210.00,history:[200,205,208,210]}
];

let cards = JSON.parse(JSON.stringify(sampleCards)); // clone for runtime
const alertsDiv = document.getElementById('alerts');
const listEl = document.getElementById('cardList');
const sortSelect = document.getElementById('sortSelect');
const simulateBtn = document.getElementById('simulateBtn');

// Chart
const ctx = document.getElementById('priceChart').getContext('2d');
let priceChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: cards.map(c=>c.name),
    datasets: [{ label: 'Price (USD)', data: cards.map(c=>c.price), borderRadius:6 }]
  },
  options: {
    responsive:true,
    plugins:{legend:{display:false}},
    scales:{y:{beginAtZero:true}}
  }
});

function renderList(){
  listEl.innerHTML='';
  const dir = sortSelect.value;
  const sorted = [...cards].sort((a,b)=> dir==='desc' ? b.price-a.price : a.price-b.price);
  for(const c of sorted){
    const li = document.createElement('li');
    li.className='card-item';
    li.innerHTML = `<div><div class="card-name">${c.name}</div><div class="small">id: ${c.id}</div></div><div class="price">$${c.price.toFixed(2)}</div>`;
    listEl.appendChild(li);
  }
}

function updateChart(){
  priceChart.data.labels = cards.map(c=>c.name);
  priceChart.data.datasets[0].data = cards.map(c=>c.price);
  priceChart.update();
}

function addAlert(msg){
  const el = document.createElement('div');
  el.className='alert';
  el.textContent = msg;
  alertsDiv.prepend(el);
  setTimeout(()=> el.remove(),12000);
}

function simulatePriceChange(){
  const idx = Math.floor(Math.random()*cards.length);
  const card = cards[idx];
  const changePct = (Math.random()*40 - 20)/100; // -20% to +20%
  const old = card.price;
  const neu = Math.max(0.5, +(card.price * (1+changePct)).toFixed(2));
  card.price = neu;
  card.history.push(neu);
  updateChart();
  renderList();
  const pct = ((neu-old)/old*100).toFixed(1);
  if(Math.abs(pct) >= 10){
    addAlert(`${card.name} moved ${pct}% — $${old.toFixed(2)} → $${neu.toFixed(2)}`);
  } else {
    addAlert(`${card.name} updated ${pct}% — $${old.toFixed(2)} → $${neu.toFixed(2)}`);
  }
}

renderList();
sortSelect.addEventListener('change', ()=> { renderList(); updateChart(); });
simulateBtn.addEventListener('click', simulatePriceChange);
let autoSim = setInterval(simulatePriceChange, 35000);
