const seedItems = [
  {
    id: "seed-1",
    title: "Story lancio nuova collezione",
    sector: "Abbigliamento",
    format: "story",
    goal: "Lancio prodotto",
    style: "Street",
    tags: "drop, streetwear, countdown",
    notes: "Funziona perché crea attesa prima del lancio: prima slide teaser, seconda dettaglio prodotto, terza CTA con orario del drop.",
    image_url: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "seed-2",
    title: "Carosello educativo per brand",
    sector: "Ecommerce",
    format: "carosello",
    goal: "Brand awareness",
    style: "Minimal",
    tags: "tips, guida, carosello",
    notes: "Format utile per spiegare un prodotto o un servizio senza sembrare una vendita diretta.",
    image_url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "seed-3",
    title: "Promo weekend per locale",
    sector: "Locali",
    format: "post",
    goal: "Promo",
    style: "Vintage",
    tags: "evento, weekend, drink",
    notes: "Il visual è immediato e lavora bene con una CTA semplice: prenota, scrivici, passa stasera.",
    image_url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "seed-4",
    title: "Reel prima/dopo palestra",
    sector: "Palestre",
    format: "reel",
    goal: "Engagement",
    style: "Sportivo",
    tags: "trasformazione, prima dopo, fitness",
    notes: "Il format prima/dopo è molto chiaro: mostra il risultato e rende facile commentare o condividere.",
    image_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "seed-5",
    title: "Adv prodotto con headline secca",
    sector: "Beauty",
    format: "adv",
    goal: "Vendere",
    style: "Premium",
    tags: "adv, prodotto, headline",
    notes: "Funziona perché mette il prodotto al centro e usa un messaggio breve, leggibile anche da mobile.",
    image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80"
  }
];

let supabaseClient = null;
let items = [];
let activeFormat = "all";
let activeBoard = "all";
let selectedId = null;

const grid = document.getElementById("grid");
const counter = document.getElementById("counter");
const searchInput = document.getElementById("searchInput");
const statusBox = document.getElementById("statusBox");
const saveButton = document.getElementById("saveButton");

function initSupabase(){
  if(!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes("INCOLLA_QUI") || SUPABASE_ANON_KEY.includes("INCOLLA_QUI")){
    setStatus("Database non configurato: inserisci URL e ANON KEY in config.js", "err");
    items = seedItems;
    render();
    return;
  }

  try{
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    setStatus("Database collegato", "ok");
    loadItems();
  }catch(err){
    console.error(err);
    setStatus("Errore connessione Supabase", "err");
    items = seedItems;
    render();
  }
}

function setStatus(text, type){
  statusBox.textContent = text;
  statusBox.className = `status ${type || ""}`;
}

async function loadItems(){
  grid.innerHTML = `<div class="loading">Caricamento ispirazioni dal database...</div>`;

  const { data, error } = await supabaseClient
    .from("inspirations")
    .select("*")
    .order("created_at", { ascending: false });

  if(error){
    console.error(error);
    setStatus("Errore nel caricamento dati", "err");
    items = seedItems;
  }else{
    items = data && data.length ? data : seedItems;
    setStatus(`Database collegato · ${data ? data.length : 0} contenuti online`, "ok");
  }

  render();
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
    grid.innerHTML = `<div class="empty">Nessuna idea trovata. Carica la prima ispirazione pubblica.</div>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.image_url}" alt="${escapeHtml(item.title)}">
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
  const item = items.find(x => String(x.id) === String(id));
  if(!item) return;
  selectedId = id;
  document.getElementById("detailImage").src = item.image_url;
  document.getElementById("detailFormat").textContent = item.format;
  document.getElementById("detailTitle").textContent = item.title;
  document.getElementById("detailMeta").textContent = `${item.sector} · ${item.goal} · ${item.style} · ${item.tags || ""}`;
  document.getElementById("detailNotes").textContent = item.notes || "Nessuna nota inserita.";
  document.getElementById("ideaOutput").style.display = "none";
  document.getElementById("detailModal").showModal();
}

function generateAdaptedIdea(){
  const item = items.find(x => String(x.id) === String(selectedId));
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
  return String(str || "").replace(/[&<>"']/g, s => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[s]));
}

async function uploadImage(file){
  const ext = file.name.split(".").pop().toLowerCase();
  const safeExt = ext || "jpg";
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${safeExt}`;

  const { error: uploadError } = await supabaseClient.storage
    .from("inspo-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false
    });

  if(uploadError){
    throw uploadError;
  }

  const { data } = supabaseClient.storage
    .from("inspo-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

async function saveInspiration(event){
  event.preventDefault();

  if(!supabaseClient){
    alert("Prima devi configurare Supabase in config.js.");
    return;
  }

  const file = document.getElementById("imageInput").files[0];
  if(!file) return;

  try{
    saveButton.disabled = true;
    saveButton.textContent = "Pubblicazione...";

    const imageUrl = await uploadImage(file);

    const newItem = {
      title: document.getElementById("titleInput").value,
      sector: document.getElementById("sectorInput").value,
      format: document.getElementById("formatInput").value,
      goal: document.getElementById("goalInput").value,
      style: document.getElementById("styleInput").value,
      tags: document.getElementById("tagsInput").value,
      notes: document.getElementById("notesInput").value,
      image_url: imageUrl
    };

    const { error } = await supabaseClient
      .from("inspirations")
      .insert(newItem);

    if(error){
      throw error;
    }

    document.getElementById("uploadForm").reset();
    document.getElementById("uploadModal").close();
    await loadItems();

  }catch(err){
    console.error(err);
    alert("Errore durante il caricamento. Controlla le policy Supabase e riprova.");
  }finally{
    saveButton.disabled = false;
    saveButton.textContent = "Pubblica ispirazione";
  }
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
document.getElementById("uploadForm").addEventListener("submit", saveInspiration);

initSupabase();
