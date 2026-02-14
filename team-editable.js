/* ============================================================
   TEAM EDITOR (FINAL STABLE VERSION + NEW INFO TAB)
   ============================================================ */

let currentTeamElement = null;
let currentTeamIndex = null;
let teamDefaults = {};

/* ============================================================
   1) CAPTURE DEFAULTS
   ============================================================ */
function captureTeamDefaults() {

    const title = document.querySelector(".team-title");
    const subtitle = document.querySelector(".team-subtitle");
    const cards = document.querySelectorAll(".team-card");

    teamDefaults.title = {
        text: title.textContent.trim(),
        color: getComputedStyle(title).color,
        fontSize: getComputedStyle(title).fontSize,
        fontFamily: getComputedStyle(title).fontFamily,
        fontWeight: getComputedStyle(title).fontWeight,
        fontStyle: getComputedStyle(title).fontStyle
    };

    teamDefaults.subtitle = {
        text: subtitle.textContent.trim(),
        color: getComputedStyle(subtitle).color,
        fontSize: getComputedStyle(subtitle).fontSize,
        fontFamily: getComputedStyle(subtitle).fontFamily,
        fontWeight: getComputedStyle(subtitle).fontWeight,
        fontStyle: getComputedStyle(subtitle).fontStyle
    };

    teamDefaults.cards = [];

    cards.forEach(card => {
        const img = card.querySelector("img");
        const name = card.querySelector("h3");
        const role = card.querySelector("h4");
        const desc = card.querySelector("p");

        teamDefaults.cards.push({
            name: name.textContent,
            role: role.textContent,
            desc: desc.textContent,

            nameStyle: {
                family: getComputedStyle(name).fontFamily,
                weight: getComputedStyle(name).fontWeight,
                style: getComputedStyle(name).fontStyle,
                color: getComputedStyle(name).color,
                size: getComputedStyle(name).fontSize
            },

            roleStyle: {
                color: getComputedStyle(role).color,
                size: getComputedStyle(role).fontSize
            },

            descStyle: {
                color: getComputedStyle(desc).color,
                size: getComputedStyle(desc).fontSize
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

    teamDefaults.section = {
        bgColor: "#fff",
        bgImage: "",
        bgVideo: ""
    };
}

/* ============================================================
   2) ATTACH EDITABLE ICONS
   ============================================================ */
function setupTeamEditable() {

    attachTeamTextIcon(document.querySelector(".team-title"), "title");
    attachTeamTextIcon(document.querySelector(".team-subtitle"), "subtitle");

    document.querySelectorAll(".team-card").forEach((card, index) => {
        attachTeamCardIcon(card, index);
    });

    document.querySelectorAll(".team-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            activateTeamTab(tab.dataset.tab);
        });
    });
}

/* ============================================================
   3) TEXT ICON
   ============================================================ */
function attachTeamTextIcon(el, type) {

    el.style.position = "relative";

    const old = el.querySelector(".team-edit-icon");
    if (old) old.remove();

    const icon = document.createElement("span");
    icon.classList.add("team-edit-icon");
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
        openTeamTextEditor(el, type);
    });
}

/* ============================================================
   4) CARD ICON
   ============================================================ */
function attachTeamCardIcon(card, index) {

    card.style.position = "relative";

    const old = card.querySelector(".team-edit-icon");
    if (old) old.remove();

    const icon = document.createElement("span");
    icon.classList.add("team-edit-icon");

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
        z-index:40;
    `;

    card.appendChild(icon);

    card.addEventListener("mouseenter", () => icon.style.opacity = 1);
    card.addEventListener("mouseleave", () => icon.style.opacity = 0);

    icon.addEventListener("click", e => {
        e.stopPropagation();
        openTeamCardEditor(card, index);
    });
}

/* ============================================================
   5) OPEN TEXT EDITOR
   ============================================================ */
function openTeamTextEditor(el, type) {
    currentTeamElement = el;
    currentTeamIndex = type;

    const s = getComputedStyle(el);

    document.getElementById("teamTextEditText").value = el.textContent.trim();
    document.getElementById("teamTextEditColor").value = rgbToHex(s.color);
    document.getElementById("teamTextEditFontSize").value = parseInt(s.fontSize);
    document.getElementById("teamTextEditFontFamily").value = s.fontFamily;
    document.getElementById("teamTextEditFontWeight").value = s.fontWeight;
    document.getElementById("teamTextEditFontStyle").value = s.fontStyle;

    document.getElementById("teamTextEditorPopup").style.display = "block";
}

/* ============================================================
   6) SAVE TITLE / SUBTITLE
   ============================================================ */
document.getElementById("saveTeamTextEdit").onclick = () => {

    const el = currentTeamElement;

    el.textContent = document.getElementById("teamTextEditText").value;
    el.style.color = document.getElementById("teamTextEditColor").value;
    el.style.fontSize =
        document.getElementById("teamTextEditFontSize").value + "px";
    el.style.fontFamily = document.getElementById("teamTextEditFontFamily").value;
    el.style.fontWeight = document.getElementById("teamTextEditFontWeight").value;
    el.style.fontStyle = document.getElementById("teamTextEditFontStyle").value;

    closeTeamTextEditor();
    setupTeamEditable();
};

document.getElementById("resetTeamTextEdit").onclick = () => {
    resetTeamTitleSubtitle(currentTeamIndex);
    closeTeamTextEditor();
    setupTeamEditable();
};

function resetTeamTitleSubtitle(type) {
    const el = document.querySelector(".team-" + type);
    const d = teamDefaults[type];

    el.textContent = d.text;
    el.style.color = d.color;
    el.style.fontFamily = d.fontFamily;
    el.style.fontSize = d.fontSize;
    el.style.fontWeight = d.fontWeight;
    el.style.fontStyle = d.fontStyle;
}

/* ============================================================
   7) OPEN TEAM CARD EDITOR
   ============================================================ */
function openTeamCardEditor(card, index) {

    currentTeamElement = card;
    currentTeamIndex = index;

    const name = card.querySelector("h3");
    const role = card.querySelector("h4");
    const desc = card.querySelector("p");
    const img = card.querySelector("img");

    activateTeamTab("team-tab-text");

    // TEXT TAB
    document.getElementById("teamEditName").value = name.textContent;
    document.getElementById("teamEditRole").value = role.textContent;
    document.getElementById("teamEditDesc").value = desc.textContent;

    document.getElementById("teamEditFontFamily").value =
        getComputedStyle(name).fontFamily;

    document.getElementById("teamEditFontWeight").value =
        getComputedStyle(name).fontWeight;

    document.getElementById("teamEditFontStyle").value =
        getComputedStyle(name).fontStyle;

    document.getElementById("teamEditTextColor").value =
        rgbToHex(getComputedStyle(name).color);

    document.getElementById("teamEditFontSize").value =
        parseInt(getComputedStyle(name).fontSize);

    // INFO TAB
    document.getElementById("teamEditRoleOnly").value = role.textContent;
    document.getElementById("teamEditDescOnly").value = desc.textContent;

    document.getElementById("teamEditRoleColor").value =
        rgbToHex(getComputedStyle(role).color);

    document.getElementById("teamEditDescColor").value =
        rgbToHex(getComputedStyle(desc).color);

    document.getElementById("teamEditRoleSize").value =
        parseInt(getComputedStyle(role).fontSize);

    document.getElementById("teamEditDescSize").value =
        parseInt(getComputedStyle(desc).fontSize);

    // IMAGE TAB
    document.getElementById("teamEditImageURL").value = img.src;
    document.getElementById("teamEditImageHeight").value =
        parseInt(getComputedStyle(img).height);
    document.getElementById("teamEditImageFit").value =
        getComputedStyle(img).objectFit;

    // CARD TAB
    document.getElementById("teamEditCardBg").value =
        rgbToHex(getComputedStyle(card).backgroundColor);

    document.getElementById("teamEditCardBorder").value =
        rgbToHex(getComputedStyle(card).borderColor);

    document.getElementById("teamEditCardBorderWidth").value =
        parseInt(getComputedStyle(card).borderWidth);

    document.getElementById("teamEditCardRadius").value =
        parseInt(getComputedStyle(card).borderRadius);

    document.getElementById("teamEditorPopup").style.display = "block";
}

/* ============================================================
   8) SAVE CARD (ALL TABS)
   ============================================================ */
document.getElementById("saveTeamEdit").onclick = () => {

    const card = currentTeamElement;

    const name = card.querySelector("h3");
    const role = card.querySelector("h4");
    const desc = card.querySelector("p");
    const img = card.querySelector("img");

    /* TEXT TAB */
    name.textContent = document.getElementById("teamEditName").value;
    role.textContent = document.getElementById("teamEditRole").value;
    desc.textContent = document.getElementById("teamEditDesc").value;

    name.style.fontFamily = document.getElementById("teamEditFontFamily").value;
    name.style.fontWeight = document.getElementById("teamEditFontWeight").value;
    name.style.fontStyle = document.getElementById("teamEditFontStyle").value;
    name.style.color = document.getElementById("teamEditTextColor").value;
    name.style.fontSize =
        document.getElementById("teamEditFontSize").value + "px";

    /* INFO TAB */
    role.textContent = document.getElementById("teamEditRoleOnly").value;
    desc.textContent = document.getElementById("teamEditDescOnly").value;

    role.style.color = document.getElementById("teamEditRoleColor").value;
    desc.style.color = document.getElementById("teamEditDescColor").value;

    role.style.fontSize =
        document.getElementById("teamEditRoleSize").value + "px";

    desc.style.fontSize =
        document.getElementById("teamEditDescSize").value + "px";

    /* IMAGE */
    img.src = document.getElementById("teamEditImageURL").value;
    img.style.height =
        document.getElementById("teamEditImageHeight").value + "px";
    img.style.objectFit = document.getElementById("teamEditImageFit").value;

    /* CARD */
    card.style.background = document.getElementById("teamEditCardBg").value;
    card.style.borderColor =
        document.getElementById("teamEditCardBorder").value;
    card.style.borderWidth =
        document.getElementById("teamEditCardBorderWidth").value + "px";
    card.style.borderRadius =
        document.getElementById("teamEditCardRadius").value + "px";

    closeTeamCardEditor();
    setupTeamEditable();
};

/* ============================================================
   9) RESET (TAB-WISE)
   ============================================================ */
document.getElementById("resetTeamEdit").onclick = () => {

    const tab = document.querySelector(".team-tab.active").dataset.tab;

    if (tab === "team-tab-text") resetTeamText(currentTeamIndex);
    else if (tab === "team-tab-info") resetTeamInfo(currentTeamIndex);
    else if (tab === "team-tab-image") resetTeamImage(currentTeamIndex);
    else if (tab === "team-tab-card") resetTeamCardStyling(currentTeamIndex);
    else if (tab === "team-tab-section") resetTeamSection();

    closeTeamCardEditor();
    setupTeamEditable();
};

/* TEXT RESET */
function resetTeamText(i) {
    const card = document.querySelectorAll(".team-card")[i];
    const name = card.querySelector("h3");
    const role = card.querySelector("h4");
    const desc = card.querySelector("p");

    const d = teamDefaults.cards[i];

    name.textContent = d.name;
    role.textContent = d.role;
    desc.textContent = d.desc;

    name.style.fontFamily = d.nameStyle.family;
    name.style.fontWeight = d.nameStyle.weight;
    name.style.fontStyle = d.nameStyle.style;
    name.style.color = d.nameStyle.color;
    name.style.fontSize = d.nameStyle.size;
}

/* INFO RESET */
function resetTeamInfo(i) {
    const card = document.querySelectorAll(".team-card")[i];
    const role = card.querySelector("h4");
    const desc = card.querySelector("p");

    const d = teamDefaults.cards[i];

    role.textContent = d.role;
    desc.textContent = d.desc;

    role.style.color = d.roleStyle.color;
    desc.style.color = d.descStyle.color;

    role.style.fontSize = d.roleStyle.size;
    desc.style.fontSize = d.descStyle.size;
}

/* IMAGE RESET */
function resetTeamImage(i) {
    const card = document.querySelectorAll(".team-card")[i];
    const img = card.querySelector("img");
    const d = teamDefaults.cards[i].image;

    img.src = d.url;
    img.style.height = d.height;
    img.style.objectFit = d.fit;
}

/* CARD RESET */
function resetTeamCardStyling(i) {
    const card = document.querySelectorAll(".team-card")[i];
    const d = teamDefaults.cards[i].card;

    card.style.background = d.bg;
    card.style.borderColor = d.borderColor;
    card.style.borderWidth = d.borderWidth;
    card.style.borderRadius = d.radius;
}

/* SECTION RESET */
function resetTeamSection() {
    const section = document.querySelector(".team-section");
    section.style.backgroundColor = teamDefaults.section.bgColor;
    section.style.backgroundImage = "";
}

/* ============================================================
   10) DUPLICATE
   ============================================================ */
document.getElementById("duplicateTeamCard").onclick = () => {

    const card = currentTeamElement;
    const clone = card.cloneNode(true);

    const oldIcon = clone.querySelector(".team-edit-icon");
    if (oldIcon) oldIcon.remove();

    document.querySelector(".team-grid").appendChild(clone);

    setupTeamEditable();
    closeTeamCardEditor();
};

/* ============================================================
   11) DELETE
   ============================================================ */
document.getElementById("deleteTeamCard").onclick = () => {
    currentTeamElement.remove();
    setupTeamEditable();
    closeTeamCardEditor();
};

/* ============================================================
   12) TAB CONTROLLER
   ============================================================ */
function activateTeamTab(tabId) {

    document.querySelectorAll(".team-tab")
        .forEach(t => t.classList.remove("active"));

    document.querySelectorAll(".team-tab-panel")
        .forEach(p => p.classList.remove("active"));

    document.querySelector(`[data-tab="${tabId}"]`).classList.add("active");
    document.getElementById(tabId).classList.add("active");
}

/* ============================================================
   UTIL FUNCTIONS
   ============================================================ */
function closeTeamTextEditor() {
    document.getElementById("teamTextEditorPopup").style.display = "none";
}

function closeTeamCardEditor() {
    document.getElementById("teamEditorPopup").style.display = "none";
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
captureTeamDefaults();
setupTeamEditable();
