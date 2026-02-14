/* ============================================================
   CONTACT EDITOR – FINAL STABLE VERSION BY JARVIS
   ============================================================ */

let currentContactElement = null;
let currentContactType = null;
let contactDefaults = {};

/* ============================================================
   1) CAPTURE DEFAULTS
   ============================================================ */
function captureContactDefaults() {

    const title = document.querySelector(".contact-title");
    const subtitle = document.querySelector(".contact-subtitle");
    const followTitle = document.querySelector(".follow-section h3");
    const footer = document.querySelector(".footer p");

    contactDefaults.title = extractTextDefaults(title);
    contactDefaults.subtitle = extractTextDefaults(subtitle);
    contactDefaults.follow = extractTextDefaults(followTitle);
    contactDefaults.footer = extractTextDefaults(footer);

    // INFO ITEMS
    const infoItems = document.querySelectorAll(".info-item");
    contactDefaults.info = [];

    infoItems.forEach((item, i) => {
        const iconWrap = item.querySelector(".icon");
        const icon = iconWrap.querySelector("i");
        const heading = item.querySelector("h4");
        const text = item.querySelector("p");

        contactDefaults.info.push({
            icon: {
                class: icon.className,
                color: getComputedStyle(icon).color,
                bg: getComputedStyle(iconWrap).backgroundColor,
                size: getComputedStyle(icon).fontSize,
                radius: getComputedStyle(iconWrap).borderRadius
            },
            text: {
                heading: heading.textContent.trim(),
                sub: text.textContent.trim(),
                color: getComputedStyle(heading).color,
                family: getComputedStyle(heading).fontFamily,
                weight: getComputedStyle(heading).fontWeight,
                style: getComputedStyle(heading).fontStyle,
                size: getComputedStyle(heading).fontSize
            },
            card: {
                bg: getComputedStyle(item).backgroundColor,
                borderColor: getComputedStyle(item).borderColor,
                borderWidth: getComputedStyle(item).borderWidth,
                radius: getComputedStyle(item).borderRadius
            }
        });
    });

    // SOCIAL ICONS
    const socials = document.querySelectorAll(".social");
    contactDefaults.social = [];

    socials.forEach(s => {
        const icon = s.querySelector("i");

        contactDefaults.social.push({
            class: icon.className,
            color: getComputedStyle(icon).color,
            bg: getComputedStyle(s).backgroundColor,
            size: getComputedStyle(icon).fontSize,
            radius: getComputedStyle(s).borderRadius
        });
    });

    // SECTION
    const section = document.querySelector(".contact-section");
    contactDefaults.section = {
        bg: getComputedStyle(section).backgroundColor,
        image: "",
        video: ""
    };
}

function extractTextDefaults(el) {
    return {
        text: el.textContent.trim(),
        color: getComputedStyle(el).color,
        size: getComputedStyle(el).fontSize,
        family: getComputedStyle(el).fontFamily,
        weight: getComputedStyle(el).fontWeight,
        style: getComputedStyle(el).fontStyle
    };
}

/* ============================================================
   2) ATTACH PENCIL ICONS
   ============================================================ */
function setupContactEditable() {

    attachContactTitleIcon(document.querySelector(".contact-title"), "title");
    attachContactTitleIcon(document.querySelector(".contact-subtitle"), "subtitle");
    attachContactTitleIcon(document.querySelector(".follow-section h3"), "follow");
    attachContactTitleIcon(document.querySelector(".footer p"), "footer");

    // info items
    document.querySelectorAll(".info-item").forEach((item, index) => {
        attachContactItemIcon(item, index);
    });

    // social icons
    document.querySelectorAll(".social").forEach((item, index) => {
        attachContactItemIcon(item, "social-" + index);
    });

    // Tabs
    document.querySelectorAll(".contact-tab").forEach(tab => {
        tab.addEventListener("click", () => activateContactTab(tab.dataset.tab));
    });
}

function attachContactTitleIcon(el, type) {
    el.style.position = "relative";

    const old = el.querySelector(".contact-edit-icon");
    if (old) old.remove();

    const icon = document.createElement("span");
    icon.classList.add("contact-edit-icon");

    icon.style.cssText = `
        position:absolute; top:-5px; right:-28px;
        width:18px; height:18px; background:#333;
        mask:url('https://cdn-icons-png.flaticon.com/512/84/84380.png') center/contain no-repeat;
        cursor:pointer; opacity:0; transition:.3s;
    `;

    el.appendChild(icon);

    el.addEventListener("mouseenter", () => icon.style.opacity = 1);
    el.addEventListener("mouseleave", () => icon.style.opacity = 0);

    icon.addEventListener("click", e => {
        e.stopPropagation();
        openContactTextEditor(el, type);
    });
}

function attachContactItemIcon(card, index) {

    card.style.position = "relative";

    const old = card.querySelector(".contact-edit-icon");
    if (old) old.remove();

    const icon = document.createElement("span");
    icon.classList.add("contact-edit-icon");

    icon.style.cssText = `
        position:absolute; top:10px; right:10px;
        width:18px; height:18px; background:#333;
        mask:url('https://cdn-icons-png.flaticon.com/512/84/84380.png') center/contain no-repeat;
        cursor:pointer; opacity:0; transition:.3s; z-index:20;
    `;

    card.appendChild(icon);

    card.addEventListener("mouseenter", () => icon.style.opacity = 1);
    card.addEventListener("mouseleave", () => icon.style.opacity = 0);

    icon.addEventListener("click", e => {
        e.stopPropagation();
        openContactItemEditor(card, index);
    });
}

/* ============================================================
   3) TEXT EDITOR POPUP (Title / Subtitle / Follow / Footer)
   ============================================================ */
function openContactTextEditor(el, type) {
    currentContactElement = el;
    currentContactType = type;

    const s = getComputedStyle(el);

    document.getElementById("contactTextEditText").value = el.textContent.trim();
    document.getElementById("contactTextEditColor").value = rgbToHex(s.color);
    document.getElementById("contactTextEditFontSize").value = parseInt(s.fontSize);
    document.getElementById("contactTextEditFontFamily").value = s.fontFamily.replace(/"/g, "");
    document.getElementById("contactTextEditFontWeight").value = s.fontWeight;
    document.getElementById("contactTextEditFontStyle").value = s.fontStyle;

    document.getElementById("contactTextEditorPopup").style.display = "block";
}

/* SAVE TEXT */
document.getElementById("saveContactTextEdit").onclick = () => {
    const el = currentContactElement;

    el.textContent = document.getElementById("contactTextEditText").value;
    el.style.color = document.getElementById("contactTextEditColor").value;
    el.style.fontSize = document.getElementById("contactTextEditFontSize").value + "px";
    el.style.fontFamily = document.getElementById("contactTextEditFontFamily").value;
    el.style.fontWeight = document.getElementById("contactTextEditFontWeight").value;
    el.style.fontStyle = document.getElementById("contactTextEditFontStyle").value;

    closeContactTextEditor();
    setupContactEditable();
};

/* RESET TEXT */
document.getElementById("resetContactTextEdit").onclick = () => {
    resetContactText(currentContactType);
    closeContactTextEditor();
    setupContactEditable();
};

function resetContactText(type) {
    const d = contactDefaults[type];
    const el = document.querySelector(".contact-" + type) ||
               document.querySelector(".follow-section h3") ||
               document.querySelector(".footer p");

    el.textContent = d.text;
    el.style.color = d.color;
    el.style.fontSize = d.size;
    el.style.fontFamily = d.family;
    el.style.fontWeight = d.weight;
    el.style.fontStyle = d.style;
}

function closeContactTextEditor() {
    document.getElementById("contactTextEditorPopup").style.display = "none";
}

/* ============================================================
   4) FULL ITEM EDITOR (Info Items + Social Icons)
   ============================================================ */
function openContactItemEditor(card, index) {
    currentContactElement = card;
    currentContactType = index;

    let isSocial = (typeof index === "string" && index.startsWith("social"));

    activateContactTab("c-tab-text");

    if (!isSocial) {
        const iconWrap = card.querySelector(".icon");
        const icon = iconWrap.querySelector("i");
        const title = card.querySelector("h4");
        const text = card.querySelector("p");

       // TEXT TAB — HEADING
document.getElementById("contactEditHeading").value = title.textContent.trim();
document.getElementById("contactEditHeadingColor").value = rgbToHex(getComputedStyle(title).color);
document.getElementById("contactEditHeadingFontFamily").value = getComputedStyle(title).fontFamily.replace(/"/g, "");
document.getElementById("contactEditHeadingFontWeight").value = getComputedStyle(title).fontWeight;
document.getElementById("contactEditHeadingFontStyle").value = getComputedStyle(title).fontStyle;
document.getElementById("contactEditHeadingFontSize").value = parseInt(getComputedStyle(title).fontSize);


// TEXT TAB — SUBTEXT (NEW)
document.getElementById("contactEditSubtext").value = text.textContent.trim();
document.getElementById("contactEditSubColor").value = rgbToHex(getComputedStyle(text).color);
document.getElementById("contactEditSubFontFamily").value = getComputedStyle(text).fontFamily.replace(/"/g, "");
document.getElementById("contactEditSubFontWeight").value = getComputedStyle(text).fontWeight;
document.getElementById("contactEditSubFontStyle").value = getComputedStyle(text).fontStyle;
document.getElementById("contactEditSubFontSize").value = parseInt(getComputedStyle(text).fontSize);


        // ICON TAB
        document.getElementById("contactEditIconClass").value = icon.className;
        document.getElementById("contactEditIconColor").value = rgbToHex(getComputedStyle(icon).color);
        document.getElementById("contactEditIconBg").value = rgbToHex(getComputedStyle(iconWrap).backgroundColor);
        document.getElementById("contactEditIconSize").value = parseInt(getComputedStyle(icon).fontSize);
        document.getElementById("contactEditIconRadius").value = parseInt(getComputedStyle(iconWrap).borderRadius);

        // CARD TAB
        document.getElementById("contactEditCardBg").value = rgbToHex(getComputedStyle(card).backgroundColor);
        document.getElementById("contactEditCardBorder").value = rgbToHex(getComputedStyle(card).borderColor);
        document.getElementById("contactEditCardBorderWidth").value = parseInt(getComputedStyle(card).borderWidth);
        document.getElementById("contactEditCardRadius").value = parseInt(getComputedStyle(card).borderRadius);

    }

    // SECTION TAB
    const section = document.querySelector(".contact-section");
    document.getElementById("contactSectionBgColor").value = rgbToHex(getComputedStyle(section).backgroundColor);
    document.getElementById("contactSectionBgImage").value = "";
    document.getElementById("contactSectionBgVideo").value = "";

    document.getElementById("contactEditorPopup").style.display = "block";
}

/* ============================================================
   5) SAVE ITEM EDITOR
   ============================================================ */
document.getElementById("saveContactEdit").onclick = () => {

    const el = currentContactElement;

    if (el.classList.contains("info-item")) saveInfoItem(el);
    if (el.classList.contains("social")) saveSocialItem(el);

    closeContactEditor();
    setupContactEditable();
};

function saveInfoItem(card) {
    const iconWrap = card.querySelector(".icon");
    const icon = iconWrap.querySelector("i");
    const heading = card.querySelector("h4");
    const text = card.querySelector("p");
// SAVE HEADING
heading.textContent = document.getElementById("contactEditHeading").value;
heading.style.color = document.getElementById("contactEditHeadingColor").value;
heading.style.fontSize = document.getElementById("contactEditHeadingFontSize").value + "px";
heading.style.fontFamily = document.getElementById("contactEditHeadingFontFamily").value;
heading.style.fontWeight = document.getElementById("contactEditHeadingFontWeight").value;
heading.style.fontStyle = document.getElementById("contactEditHeadingFontStyle").value;

// SAVE SUBTEXT
text.textContent = document.getElementById("contactEditSubtext").value;
text.style.color = document.getElementById("contactEditSubColor").value;
text.style.fontSize = document.getElementById("contactEditSubFontSize").value + "px";
text.style.fontFamily = document.getElementById("contactEditSubFontFamily").value;
text.style.fontWeight = document.getElementById("contactEditSubFontWeight").value;
text.style.fontStyle = document.getElementById("contactEditSubFontStyle").value;


    // ICON
    icon.className = document.getElementById("contactEditIconClass").value;
    icon.style.color = document.getElementById("contactEditIconColor").value;
    iconWrap.style.backgroundColor = document.getElementById("contactEditIconBg").value;
    icon.style.fontSize = document.getElementById("contactEditIconSize").value + "px";
    iconWrap.style.borderRadius = document.getElementById("contactEditIconRadius").value + "px";

    // CARD
    card.style.background = document.getElementById("contactEditCardBg").value;
    card.style.borderColor = document.getElementById("contactEditCardBorder").value;
    card.style.borderWidth = document.getElementById("contactEditCardBorderWidth").value + "px";
    card.style.borderRadius = document.getElementById("contactEditCardRadius").value + "px";
}

function saveSocialItem(card) {
    const icon = card.querySelector("i");

    icon.className = document.getElementById("contactEditIconClass").value;
    icon.style.color = document.getElementById("contactEditIconColor").value;
    card.style.background = document.getElementById("contactEditIconBg").value;
    icon.style.fontSize = document.getElementById("contactEditIconSize").value + "px";
    card.style.borderRadius = document.getElementById("contactEditIconRadius").value + "px";
}

/* ============================================================
   6) SECTION SAVE
   ============================================================ */
document.getElementById("contactSectionBgColor").addEventListener("change", () => {
    document.querySelector(".contact-section").style.backgroundColor =
        document.getElementById("contactSectionBgColor").value;
});

/* ============================================================
   7) RESET ITEM
   ============================================================ */
document.getElementById("resetContactEdit").onclick = () => {
    const tab = document.querySelector(".contact-tab.active").dataset.tab;
    const idx = currentContactType;

    if (tab === "c-tab-text") resetInfoText(idx);
    else if (tab === "c-tab-icon") resetInfoIcon(idx);
    else if (tab === "c-tab-card") resetInfoCard(idx);
    else if (tab === "c-tab-section") resetContactSection();

    closeContactEditor();
    setupContactEditable();
};

function resetInfoText(i) {
    const card = document.querySelectorAll(".info-item")[i];
    const d = contactDefaults.info[i].text;

    const heading = card.querySelector("h4");
    const text = card.querySelector("p");

    heading.textContent = d.heading;
    text.textContent = d.sub;

    heading.style.color = d.color;
    heading.style.fontFamily = d.family;
    heading.style.fontWeight = d.weight;
    heading.style.fontStyle = d.style;
    heading.style.fontSize = d.size;
}

function resetInfoIcon(i) {
    const card = document.querySelectorAll(".info-item")[i];
    const d = contactDefaults.info[i].icon;

    const iconWrap = card.querySelector(".icon");
    const icon = iconWrap.querySelector("i");

    icon.className = d.class;
    icon.style.color = d.color;
    icon.style.fontSize = d.size;
    iconWrap.style.background = d.bg;
    iconWrap.style.borderRadius = d.radius;
}

function resetInfoCard(i) {
    const card = document.querySelectorAll(".info-item")[i];
    const d = contactDefaults.info[i].card;

    card.style.background = d.bg;
    card.style.borderColor = d.borderColor;
    card.style.borderWidth = d.borderWidth;
    card.style.borderRadius = d.radius;
}

function resetContactSection() {
    const section = document.querySelector(".contact-section");
    const d = contactDefaults.section;

    section.style.backgroundColor = d.bg;
    section.style.backgroundImage = "";
}

/* ============================================================
   8) ACTIONS TAB – DUPLICATE / DELETE
   ============================================================ */
document.getElementById("duplicateContactItem").onclick = () => {

    const el = currentContactElement;
    const clone = el.cloneNode(true);

    const oldIcon = clone.querySelector(".contact-edit-icon");
    if (oldIcon) oldIcon.remove();

    if (el.classList.contains("info-item")) {
        document.querySelector(".contact-info").appendChild(clone);
    } else if (el.classList.contains("social")) {
        document.querySelector(".social-icons").appendChild(clone);
    }

    setupContactEditable();
    closeContactEditor();
};

document.getElementById("deleteContactItem").onclick = () => {
    const el = currentContactElement;
    el.remove();
    setupContactEditable();
    closeContactEditor();
};

/* ============================================================
   9) UTILS
   ============================================================ */
function activateContactTab(tabId) {
    document.querySelectorAll(".contact-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".contact-tab-panel").forEach(p => p.classList.remove("active"));

    document.querySelector(`[data-tab="${tabId}"]`).classList.add("active");
    document.getElementById(tabId).classList.add("active");
}

function closeContactEditor() {
    document.getElementById("contactEditorPopup").style.display = "none";
}

function rgbToHex(rgb) {
    const r = rgb.match(/\d+/g);
    return "#" + r.slice(0, 3).map(v => Number(v).toString(16).padStart(2, "0")).join("");
}

/* ============================================================
   INIT
   ============================================================ */
captureContactDefaults();
setupContactEditable();
