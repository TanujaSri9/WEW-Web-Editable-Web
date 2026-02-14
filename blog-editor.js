/* ============================================================
   BLOG EDITOR — FINAL PRODUCTION VERSION (BY JARVIS)
============================================================ */

let currentBlogElement = null;
let currentBlogIndex = null;
let blogDefaults = {};


/* ============================================================
   1) CAPTURE DEFAULTS ONCE
============================================================ */
function captureBlogDefaults() {
    const title = document.querySelector(".blog-title");
    const subtitle = document.querySelector(".blog-subtitle");
    const cards = document.querySelectorAll(".blog-card");

    blogDefaults.title = {
        text: title.textContent.trim(),
        color: getComputedStyle(title).color,
        size: getComputedStyle(title).fontSize,
        family: getComputedStyle(title).fontFamily,
        weight: getComputedStyle(title).fontWeight,
        style: getComputedStyle(title).fontStyle
    };

    blogDefaults.subtitle = {
        text: subtitle.textContent.trim(),
        color: getComputedStyle(subtitle).color,
        size: getComputedStyle(subtitle).fontSize,
        family: getComputedStyle(subtitle).fontFamily,
        weight: getComputedStyle(subtitle).fontWeight,
        style: getComputedStyle(subtitle).fontStyle
    };

    blogDefaults.cards = [];

    cards.forEach((card) => {
        const img = card.querySelector("img");
        const h2 = card.querySelector("h2");
        const p = card.querySelector("p");
        const btn = card.querySelector("a");

        blogDefaults.cards.push({
            text: {
                title: h2.textContent,
                desc: p.textContent
            },
            info: {
                full: card.dataset.fullText || p.textContent,
                btnText: btn.textContent,
                btnBg: getComputedStyle(btn).backgroundColor,
                btnColor: getComputedStyle(btn).color,
                btnRadius: getComputedStyle(btn).borderRadius,
                btnSize: getComputedStyle(btn).fontSize
            },
            image: {
                url: img.src,
                height: getComputedStyle(img).height,
                fit: getComputedStyle(img).objectFit
            },
            card: {
                bg: getComputedStyle(card).backgroundColor,
                border: getComputedStyle(card).borderColor,
                width: getComputedStyle(card).borderWidth,
                radius: getComputedStyle(card).borderRadius,
                shadow: getComputedStyle(card).boxShadow
            }
        });
    });

    blogDefaults.section = {
        bgColor: getComputedStyle(document.querySelector(".blog-section")).backgroundColor,
        bgImage: "",
        bgVideo: ""
    };
}


/* ============================================================
   2) SETUP EDITABLE ICONS (TITLE, SUBTITLE, CARDS)
============================================================ */
function setupBlogEditable() {

    attachBlogTextIcon(document.querySelector(".blog-title"), "title");
    attachBlogTextIcon(document.querySelector(".blog-subtitle"), "subtitle");

    document.querySelectorAll(".blog-card").forEach((card, index) => {
        attachBlogCardIcon(card, index);
    });

    document.querySelectorAll(".blog-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            activateBlogTab(tab.dataset.tab);
        });
    });
}


/* ============================================================
   3) TEXT ICON ATTACH
============================================================ */
function attachBlogTextIcon(el, type) {
    if (!el) return;

    el.style.position = "relative";
    el.classList.add("blog-editable-hover");

    const oldIcon = el.querySelector(".blog-edit-icon");
    if (oldIcon) oldIcon.remove();

    const icon = document.createElement("span");
    icon.classList.add("blog-edit-icon");

    icon.style.cssText = `
        position:absolute;
        top:-5px; right:-28px;
        width:18px; height:18px;
        background:#333;
        mask:url('https://cdn-icons-png.flaticon.com/512/84/84380.png') center/contain no-repeat;
        opacity:0; cursor:pointer; transition:.3s;
    `;

    el.appendChild(icon);

    el.addEventListener("mouseenter", () => icon.style.opacity = 1);
    el.addEventListener("mouseleave", () => icon.style.opacity = 0);

    icon.addEventListener("click", e => {
        e.stopPropagation();
        openBlogTextEditor(el, type);
    });
}


/* ============================================================
   4) CARD ICON ATTACH
============================================================ */
function attachBlogCardIcon(card, index) {
    card.style.position = "relative";

    const oldIcon = card.querySelector(".blog-edit-icon");
    if (oldIcon) oldIcon.remove();

    const icon = document.createElement("span");
    icon.classList.add("blog-edit-icon");

    icon.style.cssText = `
        position:absolute;
        top:10px; right:10px;
        width:20px; height:20px;
        background:#333;
        mask:url('https://cdn-icons-png.flaticon.com/512/84/84380.png') center/contain no-repeat;
        opacity:0; cursor:pointer; transition:.3s; z-index:50;
    `;

    card.appendChild(icon);

    card.addEventListener("mouseenter", () => icon.style.opacity = 1);
    card.addEventListener("mouseleave", () => icon.style.opacity = 0);

    icon.addEventListener("click", e => {
        e.stopPropagation();
        openBlogCardEditor(card, index);
    });
}


/* ============================================================
   5) OPEN TEXT EDITOR
============================================================ */
function openBlogTextEditor(el, type) {
    currentBlogElement = el;
    currentBlogIndex = type;

    const s = getComputedStyle(el);

    document.getElementById("blogTextEditText").value = el.textContent.trim();
    document.getElementById("blogTextEditColor").value = rgbToHex(s.color);
    document.getElementById("blogTextEditFontSize").value = parseInt(s.fontSize);
    document.getElementById("blogTextEditFontFamily").value = s.fontFamily.replace(/"/g, "");
    document.getElementById("blogTextEditFontWeight").value = s.fontWeight;
    document.getElementById("blogTextEditFontStyle").value = s.fontStyle;

    document.getElementById("blogTextEditorPopup").style.display = "block";
}


/* SAVE TEXT */
document.getElementById("saveBlogTextEdit").onclick = () => {
    if (!currentBlogElement) return;

    currentBlogElement.textContent = document.getElementById("blogTextEditText").value;
    currentBlogElement.style.color = document.getElementById("blogTextEditColor").value;
    currentBlogElement.style.fontSize = document.getElementById("blogTextEditFontSize").value + "px";
    currentBlogElement.style.fontFamily = document.getElementById("blogTextEditFontFamily").value;
    currentBlogElement.style.fontWeight = document.getElementById("blogTextEditFontWeight").value;
    currentBlogElement.style.fontStyle = document.getElementById("blogTextEditFontStyle").value;

    closeBlogTextEditor();
    setupBlogEditable();
};


/* RESET TEXT */
document.getElementById("resetBlogTextEdit").onclick = () => {

    const type = currentBlogIndex;
    const def = blogDefaults[type];

    const el = document.querySelector(`.blog-${type}`);

    el.textContent = def.text;
    el.style.color = def.color;
    el.style.fontSize = def.size;
    el.style.fontFamily = def.family;
    el.style.fontWeight = def.weight;
    el.style.fontStyle = def.style;

    closeBlogTextEditor();
};


/* ============================================================
   6) OPEN CARD EDITOR
============================================================ */
function openBlogCardEditor(card, index) {
    currentBlogElement = card;
    currentBlogIndex = index;

    const img = card.querySelector("img");
    const h2 = card.querySelector("h2");
    const p = card.querySelector("p");
    const btn = card.querySelector("a");

    activateBlogTab("blog-tab-text");

    // Text tab
    document.getElementById("blogEditTitle").value = h2.textContent;
    document.getElementById("blogEditShortText").value = p.textContent;

    document.getElementById("blogEditTitleColor").value = rgbToHex(getComputedStyle(h2).color);
    document.getElementById("blogEditDescColor").value = rgbToHex(getComputedStyle(p).color);

    document.getElementById("blogEditTitleSize").value = parseInt(getComputedStyle(h2).fontSize);
    document.getElementById("blogEditDescSize").value = parseInt(getComputedStyle(p).fontSize);

    // Info tab
    document.getElementById("blogEditFullText").value = card.dataset.fullText || p.textContent;
    document.getElementById("blogEditBtnText").value = btn.textContent;
    document.getElementById("blogEditBtnBg").value = rgbToHex(getComputedStyle(btn).backgroundColor);
    document.getElementById("blogEditBtnColor").value = rgbToHex(getComputedStyle(btn).color);
    document.getElementById("blogEditBtnRadius").value = parseInt(getComputedStyle(btn).borderRadius);
    document.getElementById("blogEditBtnSize").value = parseInt(getComputedStyle(btn).fontSize);

    // Image tab
    document.getElementById("blogEditImageURL").value = img.src;
    document.getElementById("blogEditImageHeight").value = parseInt(getComputedStyle(img).height);
    document.getElementById("blogEditImageFit").value = getComputedStyle(img).objectFit;

    // Card tab
    document.getElementById("blogEditCardBg").value = rgbToHex(getComputedStyle(card).backgroundColor);
    document.getElementById("blogEditCardBorder").value = rgbToHex(getComputedStyle(card).borderColor);
    document.getElementById("blogEditCardBorderWidth").value = parseInt(getComputedStyle(card).borderWidth);
    document.getElementById("blogEditCardRadius").value = parseInt(getComputedStyle(card).borderRadius);

    document.getElementById("blogEditorPopup").style.display = "block";
}


/* ============================================================
   7) SAVE CARD EDITS
============================================================ */
document.getElementById("saveBlogEdit").onclick = () => {

    const card = currentBlogElement;
    const img = card.querySelector("img");
    const h2 = card.querySelector("h2");
    const p = card.querySelector("p");
    const btn = card.querySelector("a");

    /* -------- TEXT TAB -------- */
    h2.textContent = document.getElementById("blogEditTitle").value;
    p.textContent = document.getElementById("blogEditShortText").value;

    h2.style.color = document.getElementById("blogEditTitleColor").value;
    p.style.color = document.getElementById("blogEditDescColor").value;

    h2.style.fontSize = document.getElementById("blogEditTitleSize").value + "px";
    p.style.fontSize = document.getElementById("blogEditDescSize").value + "px";

    /* -------- INFO TAB -------- */
    card.dataset.fullText = document.getElementById("blogEditFullText").value;

    btn.textContent = document.getElementById("blogEditBtnText").value;
    btn.style.backgroundColor = document.getElementById("blogEditBtnBg").value;
    btn.style.color = document.getElementById("blogEditBtnColor").value;
    btn.style.borderRadius = document.getElementById("blogEditBtnRadius").value + "px";
    btn.style.fontSize = document.getElementById("blogEditBtnSize").value + "px";

    /* -------- IMAGE TAB -------- */
    img.src = document.getElementById("blogEditImageURL").value;
    img.style.height = document.getElementById("blogEditImageHeight").value + "px";
    img.style.objectFit = document.getElementById("blogEditImageFit").value;

    /* -------- CARD TAB -------- */
    card.style.background = document.getElementById("blogEditCardBg").value;
    card.style.borderColor = document.getElementById("blogEditCardBorder").value;
    card.style.borderWidth = document.getElementById("blogEditCardBorderWidth").value + "px";
    card.style.borderRadius = document.getElementById("blogEditCardRadius").value + "px";

    closeBlogCardEditor();
    setupBlogEditable();
};


/* ============================================================
   8) RESET PER TAB
============================================================ */
document.getElementById("resetBlogEdit").onclick = () => {

    const tab = document.querySelector(".blog-tab.active").dataset.tab;

    if (tab === "blog-tab-text") resetBlogCardText(currentBlogIndex);
    else if (tab === "blog-tab-info") resetBlogCardInfo(currentBlogIndex);
    else if (tab === "blog-tab-image") resetBlogImage(currentBlogIndex);
    else if (tab === "blog-tab-card") resetBlogCardStyles(currentBlogIndex);
    else if (tab === "blog-tab-section") resetBlogSection();

    closeBlogCardEditor();
};


/* RESET FUNCTIONS */
function resetBlogCardText(index) {
    const card = document.querySelectorAll(".blog-card")[index];
    const h2 = card.querySelector("h2");
    const p = card.querySelector("p");
    const d = blogDefaults.cards[index].text;

    h2.textContent = d.title;
    p.textContent = d.desc;

    h2.style.color = "";
    p.style.color = "";
}

function resetBlogCardInfo(index) {
    const card = document.querySelectorAll(".blog-card")[index];
    const btn = card.querySelector("a");
    const d = blogDefaults.cards[index].info;

    card.dataset.fullText = d.full;

    btn.textContent = d.btnText;
    btn.style.backgroundColor = d.btnBg;
    btn.style.color = d.btnColor;
    btn.style.borderRadius = d.btnRadius;
    btn.style.fontSize = d.btnSize;
}

function resetBlogImage(index) {
    const card = document.querySelectorAll(".blog-card")[index];
    const img = card.querySelector("img");
    const d = blogDefaults.cards[index].image;

    img.src = d.url;
    img.style.height = d.height;
    img.style.objectFit = d.fit;
}

function resetBlogCardStyles(index) {
    const card = document.querySelectorAll(".blog-card")[index];
    const d = blogDefaults.cards[index].card;

    card.style.background = d.bg;
    card.style.borderColor = d.border;
    card.style.borderWidth = d.width;
    card.style.borderRadius = d.radius;
    card.style.boxShadow = d.shadow;
}

function resetBlogSection() {
    const s = document.querySelector(".blog-section");
    const d = blogDefaults.section;

    s.style.backgroundColor = d.bgColor;
    s.style.backgroundImage = "";
}


/* ============================================================
   9) DUPLICATE CARD — FIXED (Fresh Default, Correct Order)
============================================================ */
document.getElementById("duplicateBlogCard").onclick = () => {

    const card = currentBlogElement;
    const clone = card.cloneNode(true);

    const oldIcon = clone.querySelector(".blog-edit-icon");
    if (oldIcon) oldIcon.remove();

    document.querySelector(".blog-grid").appendChild(clone);

    setupBlogEditable();
    closeBlogCardEditor();
};


/* ============================================================
   10) DELETE CARD — FIXED
============================================================ */
document.getElementById("deleteBlogCard").onclick = () => {

    currentBlogElement.remove();

    setupBlogEditable();
    closeBlogCardEditor();
};


/* ============================================================
   11) TAB SWITCHING
============================================================ */
function activateBlogTab(id) {
    document.querySelectorAll(".blog-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".blog-tab-panel").forEach(p => p.classList.remove("active"));

    document.querySelector(`[data-tab="${id}"]`).classList.add("active");
    document.getElementById(id).classList.add("active");
}


/* ============================================================
   12) UTILS
============================================================ */
function closeBlogTextEditor() {
    document.getElementById("blogTextEditorPopup").style.display = "none";
}

function closeBlogCardEditor() {
    document.getElementById("blogEditorPopup").style.display = "none";
}

function rgbToHex(rgb) {
    const r = rgb.match(/\d+/g);
    return "#" + r.slice(0, 3).map(v =>
        Number(v).toString(16).padStart(2, "0")
    ).join("");
}


/* ============================================================
   13) INIT
============================================================ */
captureBlogDefaults();
setupBlogEditable();
