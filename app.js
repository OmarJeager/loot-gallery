(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const rootPicker = $("rootPicker"), mainFolder = $("mainFolder"), subFolder = $("subFolder");
  const searchInput = $("searchInput"), gallery = $("gallery");
  const IMAGE_EXT = /\.(avif|bmp|gif|jpe?g|jfif|png|svg|webp|tiff?)$/i;
  let allImages = [], visibleImages = [], currentIndex = 0, viewMode = "grid";
  let currentLanguage = "en";

  const translations = {
    en: {
      brand:"Asset Gallery",brandSub:"LOCAL LIBRARY · OFFLINE",offline:"Offline-ready",eyebrow:"YOUR LOCAL VISUAL WORKSPACE",
      heroTitle:'Every asset.<br><span>One clear view.</span>',heroText:"Browse Assembly and Cutting folders, preview images instantly, and find an asset by its filename — all on this computer.",
      statFolders:"Main folders",statImages:"Images indexed",statShown:"Currently shown",workspaceKicker:"BROWSE LIBRARY",workspaceTitle:"Find your asset",privacy:"Files stay on your device",
      chooseRoot:"Choose your main folder",rootHint:"Select C:\\Eren\\N. The app will read its folder structure locally.",selectFolder:"Select folder",notSelected:"No folder selected",
      mainFolderLabel:"Main folder",selectMain:"Select Assembly or Cutting…",mainFolderHint:"The first level inside your selected root",subFolderLabel:"Subfolder / asset group",
      allSubfolders:"All subfolders",subFolderHint:"Choose a folder to narrow the gallery",searchPlaceholder:"Search image name (e.g. g54644)...",allTypes:"All image types",
      sortName:"Name A–Z",sortNameDesc:"Name Z–A",sortFolder:"Folder",galleryTitle:"Image collection",galleryEmpty:"Select your folder to begin browsing.",
      emptyTitle:"Your gallery starts here",emptyText:"Select the N folder above to load your Assembly and Cutting image library.",
      footerText:"Private by design · No upload · No account · No server",loaded:"Loaded",folders:"folders",images:"images",shown:"shown",
      noImages:"No images found in this folder.",noResults:"No images match your search.",folderCount:"main folders found",preview:"Preview image",
      selectAgain:"Choose a folder to begin",rootName:"Selected folder",searching:"Search results",allFolders:"All folders"
    },
    fr: {
      brand:"Galerie d’images",brandSub:"BIBLIOTHÈQUE LOCALE · HORS LIGNE",offline:"Prêt hors ligne",eyebrow:"VOTRE ESPACE VISUEL LOCAL",
      heroTitle:'Chaque image.<br><span>Une vue claire.</span>',heroText:"Parcourez Assembly et Cutting, prévisualisez les images et trouvez un fichier par son nom — directement sur cet ordinateur.",
      statFolders:"Dossiers principaux",statImages:"Images indexées",statShown:"Images affichées",workspaceKicker:"PARCOURIR LA BIBLIOTHÈQUE",workspaceTitle:"Trouver un fichier",privacy:"Les fichiers restent sur votre appareil",
      chooseRoot:"Choisissez le dossier principal",rootHint:"Sélectionnez C:\\Eren\\N. La structure est lue localement.",selectFolder:"Choisir un dossier",notSelected:"Aucun dossier sélectionné",
      mainFolderLabel:"Dossier principal",selectMain:"Choisir Assembly ou Cutting…",mainFolderHint:"Premier niveau du dossier sélectionné",subFolderLabel:"Sous-dossier / groupe",
      allSubfolders:"Tous les sous-dossiers",subFolderHint:"Choisissez un dossier pour filtrer",searchPlaceholder:"Rechercher un nom (ex. g54644)...",allTypes:"Tous les formats",
      sortName:"Nom A–Z",sortNameDesc:"Nom Z–A",sortFolder:"Dossier",galleryTitle:"Collection d’images",galleryEmpty:"Sélectionnez un dossier pour commencer.",
      emptyTitle:"Votre galerie commence ici",emptyText:"Sélectionnez le dossier N ci-dessus pour charger Assembly et Cutting.",
      footerText:"Confidentiel · Aucun envoi · Aucun compte · Aucun serveur",loaded:"Chargé",folders:"dossiers",images:"images",shown:"affichées",
      noImages:"Aucune image dans ce dossier.",noResults:"Aucune image ne correspond à la recherche.",folderCount:"dossiers principaux trouvés",preview:"Prévisualiser",
      selectAgain:"Choisissez un dossier pour commencer",rootName:"Dossier sélectionné",searching:"Résultats",allFolders:"Tous les dossiers"
    },
    ar: {
      brand:"معرض الصور",brandSub:"مكتبة محلية · دون إنترنت",offline:"يعمل دون اتصال",eyebrow:"مساحة الصور المحلية",
      heroTitle:'كل الأصول.<br><span>في عرض واحد.</span>',heroText:"تصفح مجلدي Assembly وCutting، واعرض الصور وابحث باسم الملف على هذا الكمبيوتر.",
      statFolders:"المجلدات الرئيسية",statImages:"الصور المفهرسة",statShown:"الصور المعروضة",workspaceKicker:"تصفح المكتبة",workspaceTitle:"اعثر على الصورة",privacy:"تبقى الملفات على جهازك",
      chooseRoot:"اختر المجلد الرئيسي",rootHint:"اختر C:\\Eren\\N. سيقرأ التطبيق بنية المجلد محلياً.",selectFolder:"اختيار مجلد",notSelected:"لم يتم اختيار مجلد",
      mainFolderLabel:"المجلد الرئيسي",selectMain:"اختر Assembly أو Cutting…",mainFolderHint:"المستوى الأول داخل المجلد المحدد",subFolderLabel:"المجلد الفرعي / مجموعة الأصول",
      allSubfolders:"كل المجلدات الفرعية",subFolderHint:"اختر مجلداً لتصفية الصور",searchPlaceholder:"ابحث باسم الصورة (مثال g54644)...",allTypes:"كل أنواع الصور",
      sortName:"الاسم أ–ي",sortNameDesc:"الاسم ي–أ",sortFolder:"المجلد",galleryTitle:"مجموعة الصور",galleryEmpty:"اختر مجلداً للبدء.",
      emptyTitle:"معرضك يبدأ من هنا",emptyText:"اختر مجلد N لتحميل صور Assembly وCutting.",
      footerText:"خصوصية كاملة · دون رفع · دون حساب · دون خادم",loaded:"تم التحميل",folders:"مجلدات",images:"صور",shown:"معروضة",
      noImages:"لا توجد صور في هذا المجلد.",noResults:"لا توجد صور تطابق البحث.",folderCount:"مجلدات رئيسية",preview:"معاينة الصورة",
      selectAgain:"اختر مجلداً للبدء",rootName:"المجلد المحدد",searching:"نتائج البحث",allFolders:"كل المجلدات"
    }
  };
  const tr = key => (translations[currentLanguage] && translations[currentLanguage][key]) || translations.en[key] || key;
  function applyLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (translations[lang][key] !== undefined) el.innerHTML = translations[lang][key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => el.placeholder = tr(el.dataset.i18nPlaceholder));
    if (allImages.length) renderGallery(); else updateResultsText();
  }
  $("languageSelect").addEventListener("change", e => applyLanguage(e.target.value));
  $("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light");
    const light = document.body.classList.contains("light");
    $("themeToggle").textContent = light ? "☾" : "☼";
    $("themeToggle").title = light ? "Switch to dark mode" : "Switch to light mode";
    try { localStorage.setItem("n-gallery-theme", light ? "light" : "dark"); } catch (_) {}
  });
  try { if (localStorage.getItem("n-gallery-theme") === "light") { document.body.classList.add("light"); $("themeToggle").textContent = "☾"; } } catch (_) {}
  $("pickFolderBtn").addEventListener("click", () => rootPicker.click());
  rootPicker.addEventListener("change", () => {
    const files = Array.from(rootPicker.files || []);
    if (!files.length) return;
    allImages = files.filter(file => IMAGE_EXT.test(file.name)).map(file => {
      const parts = (file.webkitRelativePath || file.name).split("/");
      return { file, name: file.name, path: parts.slice(0,-1).join("/"), parts, main: parts[1] || parts[0] || "Other", sub: parts.slice(2,-1).join("/") || "(root folder)", url: URL.createObjectURL(file) };
    });
    // The first path part is the chosen root directory; the next part is Assembly/Cutting.
    const rootName = files[0].webkitRelativePath ? files[0].webkitRelativePath.split("/")[0] : "Selected folder";
    $("rootStatus").textContent = `${rootName} · ${allImages.length} ${tr("images")}`;
    mainFolder.disabled = false; searchInput.disabled = false; $("typeFilter").disabled = false;
    populateMainFolders();
    $("statImages").textContent = allImages.length.toLocaleString();
    $("statFolders").textContent = new Set(allImages.map(x => x.main)).size;
    renderGallery();
  });
  function populateMainFolders() {
    const names = [...new Set(allImages.map(x => x.main))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true,sensitivity:"base"}));
    mainFolder.innerHTML = `<option value="">${escapeHtml(tr("allFolders"))}</option>` + names.map(n=>`<option value="${escapeAttr(n)}">${escapeHtml(n)}</option>`).join("");
    mainFolder.value = "";
    populateSubFolders();
  }
  function populateSubFolders() {
    const main = mainFolder.value;
    const names = [...new Set(allImages.filter(x => !main || x.main === main).map(x => x.sub).filter(s => s !== "(root folder)"))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true,sensitivity:"base"}));
    subFolder.innerHTML = `<option value="">${escapeHtml(tr("allSubfolders"))}</option>` + names.map(n=>`<option value="${escapeAttr(n)}">${escapeHtml(n)}</option>`).join("");
    subFolder.disabled = names.length === 0;
  }
  mainFolder.addEventListener("change", () => { populateSubFolders(); renderGallery(); });
  subFolder.addEventListener("change", renderGallery);
  searchInput.addEventListener("input", () => { $("clearSearch").style.display = searchInput.value ? "block" : "none"; renderGallery(); });
  $("clearSearch").addEventListener("click", () => { searchInput.value = ""; $("clearSearch").style.display="none"; renderGallery(); searchInput.focus(); });
  $("typeFilter").addEventListener("change", renderGallery);
  $("sortSelect").addEventListener("change", renderGallery);
  $("gridView").addEventListener("click", () => setView("grid"));
  $("listView").addEventListener("click", () => setView("list"));
  function setView(mode) { viewMode=mode; gallery.classList.toggle("list-mode",mode==="list"); $("gridView").classList.toggle("active",mode==="grid"); $("listView").classList.toggle("active",mode==="list"); }
  function getFiltered() {
    const main = mainFolder.value, sub = subFolder.value, q = searchInput.value.trim().toLocaleLowerCase();
    let list = allImages.filter(x => (!main || x.main===main) && (!sub || x.sub===sub) && (!q || x.name.toLocaleLowerCase().includes(q) || x.path.toLocaleLowerCase().includes(q)));
    const sort = $("sortSelect").value;
    list.sort((a,b) => sort==="nameDesc" ? b.name.localeCompare(a.name,undefined,{numeric:true,sensitivity:"base"}) : sort==="folder" ? a.path.localeCompare(b.path,undefined,{numeric:true,sensitivity:"base"}) : a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:"base"}));
    return list;
  }
  function renderGallery() {
    visibleImages = getFiltered();
    $("statShown").textContent = visibleImages.length.toLocaleString();
    $("resultsText").textContent = `${visibleImages.length.toLocaleString()} ${tr("shown")} · ${allImages.length.toLocaleString()} ${tr("images")}`;
    if (!allImages.length) { showEmpty(tr("emptyTitle"), tr("emptyText")); return; }
    if (!visibleImages.length) { gallery.innerHTML = `<div class="no-results">${escapeHtml(searchInput.value ? tr("noResults") : tr("noImages"))}</div>`; return; }
    const frag = document.createDocumentFragment();
    visibleImages.forEach((item,index) => {
      const card = document.createElement("article"); card.className="image-card"; card.style.animationDelay=`${Math.min(index%24,12)*22}ms`; card.tabIndex=0;
      const preview = document.createElement("div"); preview.className="image-preview";
      const img = document.createElement("img"); img.loading="lazy"; img.src=item.url; img.alt=item.name;
      img.onerror=()=>{ img.style.display="none"; preview.insertAdjacentHTML("beforeend",`<span>${escapeHtml(item.name)}</span>`); };
      const ext=(item.name.split(".").pop()||"IMG").toUpperCase();
      const extTag=document.createElement("span"); extTag.className="file-ext"; extTag.textContent=ext;
      const zoom=document.createElement("span"); zoom.className="zoom-hint"; zoom.textContent="↗";
      preview.append(img,extTag,zoom);
      const meta=document.createElement("div");meta.className="image-meta";
      const name=document.createElement("span");name.className="image-name";name.textContent=item.name;
      const path=document.createElement("span");path.className="image-path";path.textContent=item.path;
      meta.append(name,path);card.append(preview,meta);
      card.addEventListener("click",()=>openLightbox(index));
      card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openLightbox(index);}});
      frag.appendChild(card);
    });
    gallery.replaceChildren(frag);
  }
  function showEmpty(title, text) { gallery.innerHTML=`<div class="empty-state"><div class="empty-illustration"><span>▧</span><i></i><i></i><i></i></div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div>`; }
  function updateResultsText() { $("resultsText").textContent = tr("galleryEmpty"); }
  function openLightbox(index) {
    currentIndex=index; const item=visibleImages[currentIndex]; if(!item)return;
    $("lightboxImage").src=item.url; $("lightboxImage").alt=item.name; $("lightboxName").textContent=item.name; $("lightboxPath").textContent=item.path;
    $("lightbox").classList.add("open"); $("lightbox").setAttribute("aria-hidden","false"); document.body.style.overflow="hidden";
  }
  function closeLightbox(){ $("lightbox").classList.remove("open"); $("lightbox").setAttribute("aria-hidden","true"); document.body.style.overflow=""; }
  function moveLightbox(delta){ if(!visibleImages.length)return; currentIndex=(currentIndex+delta+visibleImages.length)%visibleImages.length;openLightbox(currentIndex); }
  $("closeLightbox").addEventListener("click",closeLightbox); $("prevImage").addEventListener("click",()=>moveLightbox(-1)); $("nextImage").addEventListener("click",()=>moveLightbox(1));
  $("lightbox").addEventListener("click",e=>{if(e.target===$("lightbox"))closeLightbox();});
  document.addEventListener("keydown",e=>{if(!$("lightbox").classList.contains("open"))return;if(e.key==="Escape")closeLightbox();if(e.key==="ArrowLeft")moveLightbox(-1);if(e.key==="ArrowRight")moveLightbox(1);});
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function escapeAttr(s){return escapeHtml(s);}
  applyLanguage("en");
})();