/* ============================================================
   MENU EDITOR – FINAL STABLE VERSION WITH DESCRIPTION EDITING
   ============================================================ */

let currentMenuElement = null;
let currentEditType = null;   
let defaults = {};

/* ============================================================
   1) CAPTURE DEFAULTS
   ============================================================ */
function captureMenuDefaults() {
    const title = document.querySelector(".menu-title");
    const subtitle = document.querySelector(".menu-subtitle");
    const cards = document.querySelectorAll(".menu-card");

    defaults.title = {
        text: title.textContent.trim(),
        color: getComputedStyle(title).color,
        fontSize: getComputedStyle(title).fontSize,
        fontFamily: getComputedStyle(title).fontFamily,
        fontWeight: getComputedStyle(title).fontWeight,
        fontStyle: getComputedStyle(title).fontStyle
    };

    defaults.subtitle = {
        text: subtitle.textContent.trim(),
        color: getComputedStyle(subtitle).color,
        fontSize: getComputedStyle(subtitle).fontSize,
        fontFamily: getComputedStyle(subtitle).fontFamily,
        fontWeight: getComputedStyle(subtitle).fontWeight,
        fontStyle: getComputedStyle(subtitle).fontStyle
    };

    defaults.cards = [];

    cards.forEach((card, i) => {
        const img = card.querySelector("img");
        const label = card.querySelector(".menu-label");
        const title = card.querySelector("h3");
        const desc = card.querySelector("p");

        defaults.cards.push({
            text: {
                title: title.textContent,
                desc: desc.textContent,
                fontFamily: getComputedStyle(title).fontFamily,
                fontWeight: getComputedStyle(title).fontWeight,
                fontStyle: getComputedStyle(title).fontStyle,
                color: getComputedStyle(title).color,
                fontSize: getComputedStyle(title).fontSize,

                // NEW DEFAULTS
                descColor: getComputedStyle(desc).color,
                descFontSize: getComputedStyle(desc).fontSize
            },
            label: {
                text: label.textContent,
                bg: getComputedStyle(label).backgroundColor,
                color: getComputedStyle(label).color,
                radius: getComputedStyle(label).borderRadius
            },
            image: {
                url: img.src,
                height: getComputedStyle(img).height,
                fit: getComputedStyle(img).objectFit
            },
            card: {
                bg: getComputedStyle(card).backgroundColor,
                borderColor: getComputedStyle(card).borderColor,
                borderWidth: getComputedStyle(card).borderWidth,
                radius: getComputedStyle(card).borderRadius
            }
        });
    });

    defaults.section = {
        bgColor: "#fafafa",
        bgImage: "",
        bgVideo: ""
    };
}

/* ============================================================
   2) ATTACH EDITABLE ICONS
   ============================================================ */
function setupMenuEditable() {
    attachTextIcon(document.querySelector(".menu-title"), "title");
    attachTextIcon(document.querySelector(".menu-subtitle"), "subtitle");

    document.querySelectorAll(".menu-card").forEach((card, index) => {
        attachCardIcon(card, index);
    });

    document.querySelectorAll(".menu-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            activateTab(tab.dataset.tab);
        });
    });
}

/* ============================================================
   3) TITLE + SUBTITLE ICON
   ============================================================ */
function attachTextIcon(el, type) {
    if (!el) return;

    el.style.position = "relative";
    el.classList.add("menu-editable-hover");

    const oldIcon = el.querySelector(".menu-edit-icon");
    if (oldIcon) oldIcon.remove();

    const icon = document.createElement("span");
    icon.classList.add("menu-edit-icon");

    icon.style.cssText = `
        position:absolute;
        top:-5px;
        right:-28px;
        width:18px;
        height:18px;
        background:#333;
        mask:url('https://cdn-icons-png.flaticon.com/512/84/84380.png') center/contain no-repeat;
        cursor:pointer;
        opacity:0;
        transition:.3s;
    `;

    el.appendChild(icon);

    el.addEventListener("mouseenter", () => icon.style.opacity = 1);
    el.addEventListener("mouseleave", () => icon.style.opacity = 0);

    icon.addEventListener("click", e => {
        e.stopPropagation();
        openMenuTextEditor(el, type);
    });
}

/* ============================================================
   4) CARD ICON
   ============================================================ */
function attachCardIcon(card, index) {
    card.style.position = "relative";
    card.classList.add("menu-editable-hover");

    const existing = card.querySelector(".menu-edit-icon");
    if (existing) existing.remove();

    const icon = document.createElement("span");
    icon.classList.add("menu-edit-icon");

    icon.style.cssText = `
        position:absolute;
        top:10px;
        right:10px;
        width:18px;
        height:18px;
        background:#333;
        mask:url('https://cdn-icons-png.flaticon.com/512/84/84380.png') center/contain no-repeat;
        cursor:pointer;
        opacity:0;
        transition:.3s;
        z-index:30;
    `;

    card.appendChild(icon);

    card.addEventListener("mouseenter", () => icon.style.opacity = 1);
    card.addEventListener("mouseleave", () => icon.style.opacity = 0);

    icon.addEventListener("click", e => {
        e.stopPropagation();
        openMenuCardEditor(card, index);
    });
}

/* ============================================================
   5) OPEN TEXT EDITOR (TITLE/SUBTITLE)
   ============================================================ */
function openMenuTextEditor(el, type) {
    currentMenuElement = el;
    currentEditType = type;

    const s = getComputedStyle(el);

    document.getElementById("menuTextEditText").value = el.textContent.trim();
    document.getElementById("menuTextEditColor").value = rgbToHex(s.color);
    document.getElementById("menuTextEditFontSize").value = parseInt(s.fontSize);
    document.getElementById("menuTextEditFontFamily").value = s.fontFamily.replace(/"/g, "");
    document.getElementById("menuTextEditFontWeight").value = s.fontWeight;
    document.getElementById("menuTextEditFontStyle").value = s.fontStyle;

    document.getElementById("menuTextEditorPopup").style.display = "block";
}

/* ============================================================
   6) SAVE TEXT
   ============================================================ */
document.getElementById("saveMenuTextEdit").onclick = () => {
    if (!currentMenuElement) return;

    currentMenuElement.textContent =
        document.getElementById("menuTextEditText").value;

    currentMenuElement.style.color =
        document.getElementById("menuTextEditColor").value;

    currentMenuElement.style.fontSize =
        document.getElementById("menuTextEditFontSize").value + "px";

    currentMenuElement.style.fontFamily =
        document.getElementById("menuTextEditFontFamily").value;

    currentMenuElement.style.fontWeight =
        document.getElementById("menuTextEditFontWeight").value;

    currentMenuElement.style.fontStyle =
        document.getElementById("menuTextEditFontStyle").value;

    closeMenuTextEditor();
    setupMenuEditable();
};

/* ============================================================
   7) RESET TEXT
   ============================================================ */
document.getElementById("resetMenuTextEdit").onclick = () => {
    resetTitleOrSubtitle(currentEditType);
    closeMenuTextEditor();
    setupMenuEditable();
};

function resetTitleOrSubtitle(type) {
    const data = defaults[type];
    const el = document.querySelector(".menu-" + type);

    el.textContent = data.text;
    el.style.color = data.color;
    el.style.fontFamily = data.fontFamily;
    el.style.fontSize = data.fontSize;
    el.style.fontWeight = data.fontWeight;
    el.style.fontStyle = data.fontStyle;
}

/* ============================================================
   8) OPEN CARD EDITOR
   ============================================================ */
function openMenuCardEditor(card, index) {
    currentMenuElement = card;
    currentEditType = index;

    const img = card.querySelector("img");
    const label = card.querySelector(".menu-label");
    const title = card.querySelector("h3");
    const desc = card.querySelector("p");

    activateTab("tab-text");

    // TEXT
    document.getElementById("menuEditTitle").value = title.textContent;
    document.getElementById("menuEditDesc").value = desc.textContent;

    document.getElementById("menuEditFontFamily").value =
        getComputedStyle(title).fontFamily.replace(/"/g, "");

    document.getElementById("menuEditFontWeight").value = getComputedStyle(title).fontWeight;
    document.getElementById("menuEditFontStyle").value = getComputedStyle(title).fontStyle;
    document.getElementById("menuEditTextColor").value = rgbToHex(getComputedStyle(title).color);
    document.getElementById("menuEditFontSize").value = parseInt(getComputedStyle(title).fontSize);

    // NEW – Description styles
    document.getElementById("menuEditDescColor").value =
        rgbToHex(getComputedStyle(desc).color);

    document.getElementById("menuEditDescFontSize").value =
        parseInt(getComputedStyle(desc).fontSize);

    // LABEL
    document.getElementById("menuEditLabelText").value = label.textContent;
    document.getElementById("menuEditLabelBg").value = rgbToHex(getComputedStyle(label).backgroundColor);
    document.getElementById("menuEditLabelColor").value = rgbToHex(getComputedStyle(label).color);
    document.getElementById("menuEditLabelRadius").value = parseInt(getComputedStyle(label).borderRadius);

    // IMAGE
    document.getElementById("menuEditImageURL").value = img.src;
    document.getElementById("menuEditImageHeight").value = parseInt(getComputedStyle(img).height);
    document.getElementById("menuEditImageFit").value = getComputedStyle(img).objectFit;

    // CARD
    document.getElementById("menuEditCardBg").value = rgbToHex(getComputedStyle(card).backgroundColor);
    document.getElementById("menuEditCardBorder").value = rgbToHex(getComputedStyle(card).borderColor);
    document.getElementById("menuEditCardBorderWidth").value = parseInt(getComputedStyle(card).borderWidth);
    document.getElementById("menuEditCardRadius").value = parseInt(getComputedStyle(card).borderRadius);

    document.getElementById("menuEditorPopup").style.display = "block";
}

/* ============================================================
   9) SAVE CARD (ALL TABS)
   ============================================================ */
document.getElementById("saveMenuEdit").onclick = () => {
    const card = currentMenuElement;
    const img = card.querySelector("img");
    const label = card.querySelector(".menu-label");
    const title = card.querySelector("h3");
    const desc = card.querySelector("p");

    // TEXT
    title.textContent = document.getElementById("menuEditTitle").value;
    desc.textContent = document.getElementById("menuEditDesc").value;

    title.style.fontFamily = document.getElementById("menuEditFontFamily").value;
    title.style.fontWeight = document.getElementById("menuEditFontWeight").value;
    title.style.fontStyle = document.getElementById("menuEditFontStyle").value;
    title.style.color = document.getElementById("menuEditTextColor").value;
    title.style.fontSize =
        document.getElementById("menuEditFontSize").value + "px";

    // NEW – Description styles
    desc.style.color = document.getElementById("menuEditDescColor").value;
    desc.style.fontSize =
        document.getElementById("menuEditDescFontSize").value + "px";

    // LABEL
    label.textContent = document.getElementById("menuEditLabelText").value;
    label.style.backgroundColor = document.getElementById("menuEditLabelBg").value;
    label.style.color = document.getElementById("menuEditLabelColor").value;
    label.style.borderRadius =
        document.getElementById("menuEditLabelRadius").value + "px";

    // IMAGE
    img.src = document.getElementById("menuEditImageURL").value;
    img.style.height =
        document.getElementById("menuEditImageHeight").value + "px";
    img.style.objectFit = document.getElementById("menuEditImageFit").value;

    // CARD
    card.style.background = document.getElementById("menuEditCardBg").value;
    card.style.borderColor =
        document.getElementById("menuEditCardBorder").value;
    card.style.borderWidth =
        document.getElementById("menuEditCardBorderWidth").value + "px";
    card.style.borderRadius =
        document.getElementById("menuEditCardRadius").value + "px";

    closeCardEditor();
    setupMenuEditable();
};

/* ============================================================
   10) RESET TAB-WISE
   ============================================================ */
document.getElementById("resetMenuEdit").onclick = () => {
    const tab = document.querySelector(".menu-tab.active").dataset.tab;

    if (tab === "tab-text") resetCardText(currentEditType);
    else if (tab === "tab-label") resetCardLabel(currentEditType);
    else if (tab === "tab-image") resetCardImage(currentEditType);
    else if (tab === "tab-card") resetCardStyling(currentEditType);
    else if (tab === "tab-section") resetSectionBackground();

    closeCardEditor();
    setupMenuEditable();
};

function resetCardText(index) {
    const card = document.querySelectorAll(".menu-card")[index];
    const title = card.querySelector("h3");
    const desc = card.querySelector("p");
    const d = defaults.cards[index].text;

    title.textContent = d.title;
    desc.textContent = d.desc;

    title.style.fontFamily = d.fontFamily;
    title.style.fontWeight = d.fontWeight;
    title.style.fontStyle = d.fontStyle;
    title.style.color = d.color;
    title.style.fontSize = d.fontSize;

    // NEW DESCRIPTION RESET
    desc.style.color = d.descColor;
    desc.style.fontSize = d.descFontSize;
}

function resetCardLabel(index) {
    const card = document.querySelectorAll(".menu-card")[index];
    const label = card.querySelector(".menu-label");
    const d = defaults.cards[index].label;

    label.textContent = d.text;
    label.style.backgroundColor = d.bg;
    label.style.color = d.color;
    label.style.borderRadius = d.radius;
}

function resetCardImage(index) {
    const card = document.querySelectorAll(".menu-card")[index];
    const img = card.querySelector("img");
    const d = defaults.cards[index].image;

    img.src = d.url;
    img.style.height = d.height;
    img.style.objectFit = d.fit;
}

function resetCardStyling(index) {
    const card = document.querySelectorAll(".menu-card")[index];
    const d = defaults.cards[index].card;

    card.style.background = d.bg;
    card.style.borderColor = d.borderColor;
    card.style.borderWidth = d.borderWidth;
    card.style.borderRadius = d.radius;
}

function resetSectionBackground() {
    const section = document.querySelector(".menu-section");
    section.style.backgroundColor = defaults.section.bgColor;
    section.style.backgroundImage = "";
}

/* ============================================================
   11) FIXED DUPLICATE CARD
   ============================================================ */
document.getElementById("duplicateMenuCard").onclick = () => {
    const card = currentMenuElement;
    const clone = card.cloneNode(true);

    const oldIcon = clone.querySelector(".menu-edit-icon");
    if (oldIcon) oldIcon.remove();

    document.querySelector(".menu-grid").appendChild(clone);

    setupMenuEditable();
    closeCardEditor();
};

/* ============================================================
   12) DELETE CARD
   ============================================================ */
document.getElementById("deleteMenuCard").onclick = () => {
    const card = currentMenuElement;
    card.remove();

    setupMenuEditable();
    closeCardEditor();
};

/* ============================================================
   13) TABS
   ============================================================ */
function activateTab(tabId) {
    document.querySelectorAll(".menu-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".menu-tab-panel").forEach(p => p.classList.remove("active"));

    document.querySelector(`[data-tab="${tabId}"]`).classList.add("active");
    document.getElementById(tabId).classList.add("active");
}

/* ============================================================
   UTILS
   ============================================================ */
function closeMenuTextEditor() {
    document.getElementById("menuTextEditorPopup").style.display = "none";
}

function closeCardEditor() {
    document.getElementById("menuEditorPopup").style.display = "none";
}

function rgbToHex(rgb) {
    const r = rgb.match(/\d+/g);
    return "#" + r.slice(0, 3).map(v =>
        Number(v).toString(16).padStart(2, "0")
    ).join("");
}

/* ============================================================
   INIT
   ============================================================ */
captureMenuDefaults();
setupMenuEditable();
