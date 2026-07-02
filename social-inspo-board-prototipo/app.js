const seedItems = [
  {
    id: crypto.randomUUID(),
    title: "Story lancio nuova collezione",
    sector: "Abbigliamento",
    format: "story",
    goal: "Lancio prodotto",
    style: "Street",
    tags: "drop, streetwear, countdown",
    notes: "Funziona perché crea attesa prima del lancio: prima slide teaser, seconda dettaglio prodotto, terza CTA con orario del drop.",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: crypto.randomUUID(),
    title: "Carosello educativo per brand",
    sector: "Ecommerce",
    format: "carosello",
    goal: "Brand awareness",
    style: "Minimal",
    tags: "tips, guida, carosello",
    notes: "Format utile per spiegare un prodotto o un servizio senza sembrare una vendita diretta.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: crypto.randomUUID(),
    title: "Promo weekend per locale",
    sector: "Locali",
    format: "post",
    goal: "Promo",
    style: "Vintage",
    tags: "evento, weekend, drink",
    notes: "Il visual è immediato e lavora bene con una CTA semplice: prenota, scrivici, passa stasera.",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: crypto.randomUUID(),
    title: "Reel prima/dopo palestra",
    sector: "Palestre",
    format: "reel",
    goal: "Engagement",
    style: "Sportivo",
    tags: "trasformazione, prima dopo, fitness",
    notes: "Il format prima/dopo è molto chiaro: mostra il risultato e rende facile commentare o condividere.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: crypto.randomUUID(),
    title: "Adv prodotto con headline secca",
    sector: "Beauty",
    format: "adv",
    goal: "Vendere",
    style: "Premium",
    tags: "adv, prodotto, headline",
    notes: "Funziona perché mette il prodotto al centro e usa un messaggio breve, leggibile anche da mobile.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80"
  }
];

let items = JSON.parse(localStorage.getItem("socialInspoItems") || "null") || seedItems;
let activeFormat = "all";
let activeBoard = "all";
let selectedId = null;

const grid = document.getElementById("grid");
const counter = document.getElementById("counter");
const searchInput = document.getElementById("searchInput");

function save(){
  localStorage.setItem("socialInspoItems", JSON.stringify(items));
}

function render(){
  const q = searchInput.value.trim().toLowerCase();

  const filtered = items.filter(item => {
    const matchesFormat = activeFormat === "all" || item.format === activeFormat;
    const matchesBoard = activeBoard === "all" || item.sector === activeBoard;
    const haystack = `${item.title} ${item.sector} ${item.format} ${item.goal} ${item.style} ${item.tags} ${item.notes}`.toLowerCase();
    const matchesSearch = !q || haystack.includes(q);
    return matchesFormat && matchesBoard && matchesSearch;
  });

  counter.textContent = `${filtered.length} idee`;
  grid.innerHTML = "";

  if(!filtered.length){
    grid.innerHTML = `<div class="empty">Nessuna idea trovata. Prova un’altra ricerca o carica una nuova ispirazione.</div>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.image}" alt="${escapeHtml(item.title)}">
      <div class="card-body">
        <h3>${escapeHtml(item.title)}</h3>
        <div class="meta">
          <span class="pill">${escapeHtml(item.format)}</span>
          <span class="pill">${escapeHtml(item.sector)}</span>
          <span class="pill">${escapeHtml(item.goal)}</span>
        </div>
      </div>
    `;
    card.addEventListener("click", () => openDetail(item.id));
    grid.appendChild(card);
  });
}

function openDetail(id){
  const item = items.find(x => x.id === id);
  if(!item) return;
  selectedId = id;
  document.getElementById("detailImage").src = item.image;
  document.getElementById("detailFormat").textContent = item.format;
  document.getElementById("detailTitle").textContent = item.title;
  document.getElementById("detailMeta").textContent = `${item.sector} · ${item.goal} · ${item.style} · ${item.tags}`;
  document.getElementById("detailNotes").textContent = item.notes || "Nessuna nota inserita.";
  document.getElementById("ideaOutput").style.display = "none";
  document.getElementById("detailModal").showModal();
}

function generateAdaptedIdea(){
  const item = items.find(x => x.id === selectedId);
  if(!item) return;
  const target = document.getElementById("adaptSector").value;

  const output = `
    <strong>Idea adattata per ${escapeHtml(target)}</strong><br><br>
    <strong>Format:</strong> ${escapeHtml(item.format)}<br>
    <strong>Struttura:</strong> Hook iniziale forte → visual prodotto/servizio → prova sociale o beneficio → CTA finale.<br><br>
    <strong>Esempio pratico:</strong><br>
    Slide/Reel 1: “Il dettaglio che cambia tutto.”<br>
    Slide/Reel 2: mostra il prodotto, servizio o atmosfera.<br>
    Slide/Reel 3: spiega il beneficio in modo secco.<br>
    Slide/Reel 4: “Scrivici / prenota / scopri la nuova uscita.”<br><br>
    <strong>Consiglio:</strong> non copiare il layout 1:1. Usa questa reference solo come direzione creativa.
  `;

  const box = document.getElementById("ideaOutput");
  box.innerHTML = output;
  box.style.display = "block";
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[s]));
}

document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFormat = btn.dataset.filter;
    render();
  });
});

document.querySelectorAll(".board-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".board-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeBoard = btn.dataset.board;
    render();
  });
});

searchInput.addEventListener("input", render);

const uploadModal = document.getElementById("uploadModal");
document.getElementById("openUpload").addEventListener("click", () => uploadModal.showModal());
document.getElementById("closeUpload").addEventListener("click", () => uploadModal.close());
document.getElementById("closeDetail").addEventListener("click", () => document.getElementById("detailModal").close());
document.getElementById("generateIdea").addEventListener("click", generateAdaptedIdea);

document.getElementById("deleteItem").addEventListener("click", () => {
  if(!selectedId) return;
  items = items.filter(x => x.id !== selectedId);
  save();
  document.getElementById("detailModal").close();
  render();
});

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("imageInput").files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const item = {
      id: crypto.randomUUID(),
      title: document.getElementById("titleInput").value,
      sector: document.getElementById("sectorInput").value,
      format: document.getElementById("formatInput").value,
      goal: document.getElementById("goalInput").value,
      style: document.getElementById("styleInput").value,
      tags: document.getElementById("tagsInput").value,
      notes: document.getElementById("notesInput").value,
      image: reader.result
    };
    items.unshift(item);
    save();
    e.target.reset();
    uploadModal.close();
    render();
  };
  reader.readAsDataURL(file);
});

render();
