/* ============================================================
   NAVBAR EDITOR – FULL SYSTEM (SYNCED DESKTOP + DRAWER)
   ============================================================ */

let currentNavTarget = null;
let navDefaults = [];

/* Utility */
function rgbToHex(rgb) {
    let r = rgb.match(/\d+/g);
    return "#" + r.slice(0, 3).map(v =>
        Number(v).toString(16).padStart(2, "0")
    ).join("");
}

/* ============================================================
   1) CAPTURE DEFAULT VALUES
   ============================================================ */
function captureNavbarDefaults() {
    const desktop = document.querySelectorAll(".nav-links a");
    const drawer = document.querySelectorAll(".drawer-links a");

    navDefaults = [];

    desktop.forEach((el, i) => {
        navDefaults.push({
            text: el.textContent.trim(),
            color: getComputedStyle(el).color,
            fontSize: getComputedStyle(el).fontSize,
            fontWeight: getComputedStyle(el).fontWeight,
            fontStyle: getComputedStyle(el).fontStyle,
            fontFamily: getComputedStyle(el).fontFamily,
            link: drawer[i].getAttribute("href")
        });
    });

    // Logo defaults
    const logo = document.querySelector(".logo");
    navDefaults.unshift({
        text: logo.textContent.trim(),
        color: getComputedStyle(logo).color,
        fontSize: getComputedStyle(logo).fontSize,
        fontWeight: getComputedStyle(logo).fontWeight,
        fontStyle: getComputedStyle(logo).fontStyle,
        fontFamily: getComputedStyle(logo).fontFamily,
        link: null
    });
}

/* ============================================================
   2) ATTACH EDIT ICONS
   ============================================================ */
function setupNavbarEditable() {

    document.querySelectorAll(".edit-icon").forEach(e => e.remove());

    const desktop = document.querySelectorAll(".nav-links a");
    const drawer = document.querySelectorAll(".drawer-links a");
    const logo = document.querySelector(".logo");

    /* Logo */
    attachNavIcon(logo, 0);

    /* Desktop items */
    desktop.forEach((item, index) => {
        attachNavIcon(item, index + 1); // +1 because 0 is logo
    });
}

/* Attach pencil icon */
function attachNavIcon(el, index) {
    el.classList.add("editable-navbar");

    const icon = document.createElement("span");
    icon.classList.add("edit-icon");
    el.appendChild(icon);

    icon.addEventListener("click", e => {
        e.stopPropagation();
        openNavbarEditor(index);
    });
}

/* ============================================================
   3) OPEN EDITOR POPUP
   ============================================================ */
function openNavbarEditor(index) {
    currentNavTarget = index;

    const logo = document.querySelector(".logo");
    const desktop = document.querySelectorAll(".nav-links a");
    const drawer = document.querySelectorAll(".drawer-links a");

    const isLogo = index === 0;
    const targetEl = isLogo ? logo : desktop[index - 1];

    const d = navDefaults[index];

    /* Load Text */
    document.getElementById("navbarEditText").value = d.text;

    /* Load Color */
    document.getElementById("navbarEditColor").value = rgbToHex(d.color);

    /* Font Load */
    document.getElementById("navbarEditFontSize").value = parseInt(d.fontSize);
    document.getElementById("navbarEditFontFamily").value = d.fontFamily.replace(/"/g, "");
    document.getElementById("navbarEditFontWeight").value = d.fontWeight;
    document.getElementById("navbarEditFontStyle").value = d.fontStyle;

    /* If logo → hide LINK tab */
    document.querySelector("[data-tab='nav-tab-link']").style.display = isLogo ? "none" : "block";

    /* If not logo → load link */
    if (!isLogo) {
        document.getElementById("navbarEditLink").value = d.link;
    }

    activateNavbarTab("nav-tab-text");
    document.getElementById("navbarEditorPopup").style.display = "block";
}

/* ============================================================
   4) SAVE ENTRY
   ============================================================ */
document.getElementById("saveNavbarEdit").onclick = () => {
    const index = currentNavTarget;
    const isLogo = index === 0;

    const logo = document.querySelector(".logo");
    const desktop = document.querySelectorAll(".nav-links a");
    const drawer = document.querySelectorAll(".drawer-links a");

    const text = document.getElementById("navbarEditText").value.trim();
    const color = document.getElementById("navbarEditColor").value;
    const fs = document.getElementById("navbarEditFontSize").value + "px";
    const family = document.getElementById("navbarEditFontFamily").value;
    const fw = document.getElementById("navbarEditFontWeight").value;
    const fstyle = document.getElementById("navbarEditFontStyle").value;

    if (text === "") {
        alert("Text cannot be empty!");
        return;
    }

    if (isLogo) {
        logo.textContent = text;
        logo.style.color = color;
        logo.style.fontSize = fs;
        logo.style.fontFamily = family;
        logo.style.fontWeight = fw;
        logo.style.fontStyle = fstyle;
    } else {
        desktop[index - 1].textContent = text;
        drawer[index - 1].textContent = text;

        desktop[index - 1].style.color = color;
        drawer[index - 1].style.color = color;

        desktop[index - 1].style.fontSize = fs;
        drawer[index - 1].style.fontSize = fs;

        desktop[index - 1].style.fontFamily = family;
        drawer[index - 1].style.fontFamily = family;

        desktop[index - 1].style.fontWeight = fw;
        drawer[index - 1].style.fontWeight = fw;

        desktop[index - 1].style.fontStyle = fstyle;
        drawer[index - 1].style.fontStyle = fstyle;

        /* Save link */
        const link = document.getElementById("navbarEditLink").value;
        desktop[index - 1].setAttribute("href", link);
        drawer[index - 1].setAttribute("href", link);
    }

    document.getElementById("navbarEditorPopup").style.display = "none";
    setupNavbarEditable();
};

/* ============================================================
   5) RESET ITEM
   ============================================================ */
document.getElementById("resetNavbarItem").onclick = () => {
    const index = currentNavTarget;
    const d = navDefaults[index];

    const logo = document.querySelector(".logo");
    const desktop = document.querySelectorAll(".nav-links a");
    const drawer = document.querySelectorAll(".drawer-links a");

    if (index === 0) {
        logo.textContent = d.text;
        logo.style.color = d.color;
        logo.style.fontSize = d.fontSize;
        logo.style.fontFamily = d.fontFamily;
        logo.style.fontWeight = d.fontWeight;
        logo.style.fontStyle = d.fontStyle;
    } else {
        desktop[index - 1].textContent = d.text;
        drawer[index - 1].textContent = d.text;

        desktop[index - 1].style.color = d.color;
        drawer[index - 1].style.color = d.color;

        desktop[index - 1].style.fontSize = d.fontSize;
        drawer[index - 1].style.fontSize = d.fontSize;

        desktop[index - 1].style.fontFamily = d.fontFamily;
        drawer[index - 1].style.fontFamily = d.fontFamily;

        desktop[index - 1].style.fontWeight = d.fontWeight;
        drawer[index - 1].style.fontWeight = d.fontWeight;

        desktop[index - 1].style.fontStyle = d.fontStyle;
        drawer[index - 1].style.fontStyle = d.fontStyle;

        desktop[index - 1].setAttribute("href", d.link);
        drawer[index - 1].setAttribute("href", d.link);
    }

    document.getElementById("navbarEditorPopup").style.display = "none";
    setupNavbarEditable();
};

/* ============================================================
   6) DELETE ITEM
   ============================================================ */
document.getElementById("deleteNavbarItem").onclick = () => {
    const index = currentNavTarget;
    if (index === 0) {
        alert("Logo cannot be deleted!");
        return;
    }

    const desktop = document.querySelectorAll(".nav-links a");
    const drawer = document.querySelectorAll(".drawer-links a");

    desktop[index - 1].parentElement.remove();
    drawer[index - 1].parentElement.remove();

    document.getElementById("navbarEditorPopup").style.display = "none";
    setupNavbarEditable();
};

/* ============================================================
   7) TAB SWITCH
   ============================================================ */
function activateNavbarTab(id) {
    document.querySelectorAll(".navbar-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".navbar-tab-panel").forEach(p => p.classList.remove("active"));

    document.querySelector(`[data-tab="${id}"]`).classList.add("active");
    document.getElementById(id).classList.add("active");
}

document.querySelectorAll(".navbar-tab").forEach(tab => {
    tab.addEventListener("click", () => activateNavbarTab(tab.dataset.tab));
});

/* ============================================================
   INIT
   ============================================================ */
captureNavbarDefaults();
setupNavbarEditable();
