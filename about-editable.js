/* ===== ABOUT EDITABLE SYSTEM — FINAL VERSION WITH RESET ===== */

let currentAboutElement = null;
let isAboutBackground = false;

/* Store original styles & text */
const aboutOriginalState = new WeakMap();

/* ===== Add Pencil Icons to About Text ===== */
function setupAboutEditable() {
    const els = [
        document.querySelector(".about-title"),
        document.querySelector(".about-tagline"),
        document.querySelector(".about-desc"),
    ];

    els.forEach(el => {
        if (!el) return;
        saveOriginalState(el);
        makeAboutEditable(el);
    });

    /* Save state of about section background */
    const section = document.querySelector(".about-section");
    if (section) saveOriginalState(section);
}

/* Save original text + styles */
function saveOriginalState(el) {
    aboutOriginalState.set(el, {
        text: el.childNodes[0]?.nodeValue || "",
        style: {
            color: el.style.color,
            fontSize: el.style.fontSize,
            fontFamily: el.style.fontFamily,
            fontWeight: el.style.fontWeight,
            fontStyle: el.style.fontStyle,
            lineHeight: el.style.lineHeight,
            background: el.style.background,
            backgroundColor: el.style.backgroundColor,
            backgroundImage: el.style.backgroundImage
        }
    });
}

/* Make text element editable */
function makeAboutEditable(el) {
    if (!el) return;

    el.classList.add("editable-about");

    if (!el.querySelector(".about-edit-icon")) {
        const icon = document.createElement("span");
        icon.classList.add("about-edit-icon");
        el.appendChild(icon);

        icon.addEventListener("click", e => {
            e.stopPropagation();
            openAboutEditor(el);
        });
    }
}

/* ========== OPEN TEXT EDITOR ========== */
function openAboutEditor(el) {
    currentAboutElement = el;
    isAboutBackground = false;

    const style = getComputedStyle(el);

    document.getElementById("aboutEditText").value =
        el.childNodes[0]?.nodeValue.trim() || "";
    document.getElementById("aboutEditTextColor").value = rgbToHex(style.color);
    document.getElementById("aboutEditFontSize").value = parseInt(style.fontSize);

    document.getElementById("aboutEditFontFamily").value =
        style.fontFamily.replace(/"/g, "");
    document.getElementById("aboutEditFontWeight").value = style.fontWeight;
    document.getElementById("aboutEditFontStyle").value = style.fontStyle;

    const lh = style.lineHeight === "normal" ? 1.5 : parseFloat(style.lineHeight);
    document.getElementById("aboutEditLineHeight").value = lh;

    showTextControls();
    hideBackgroundControls();

    document.getElementById("aboutEditorPopup").style.display = "block";
}

/* ========== BACKGROUND EDIT ICON ========== */
function setupAboutBackgroundEditable() {
    const section = document.querySelector(".about-section");
    if (!section) return;

    if (!section.querySelector(".about-bg-edit-icon")) {
        const icon = document.createElement("span");
        icon.classList.add("about-bg-edit-icon");
        section.appendChild(icon);

        icon.addEventListener("click", e => {
            e.stopPropagation();
            openAboutBackgroundEditor(section);
        });
    }
}

/* ========== OPEN BACKGROUND EDITOR ========== */
function openAboutBackgroundEditor(section) {
    currentAboutElement = section;
    isAboutBackground = true;

    hideTextControls();
    showBackgroundControls();

    document.getElementById("aboutBgColor").value =
        rgbToHex(getComputedStyle(section).backgroundColor);

    document.getElementById("aboutEditorPopup").style.display = "block";
}

/* ========== SAVE EDITS ========== */
document.getElementById("saveAboutEdit").onclick = () => {
    const el = currentAboutElement;

    /* ===== BACKGROUND ===== */
    if (isAboutBackground) {
        const type = document.getElementById("aboutBgType").value;

        el.style.background = "none";
        el.style.backgroundImage = "none";

        const oldVideo = el.querySelector(".about-bg-video");
        if (oldVideo) oldVideo.remove();

        if (type === "color") {
            el.style.backgroundColor = document.getElementById("aboutBgColor").value;
        }

        if (type === "image") {
            const url = document.getElementById("aboutBgImageURL").value.trim();
            el.style.backgroundImage = `url('${url}')`;
            el.style.backgroundSize = "cover";
            el.style.backgroundPosition = "center";
        }

        if (type === "video") {
            const url = document.getElementById("aboutBgVideoURL").value.trim();

            const video = document.createElement("video");
            video.classList.add("about-bg-video");
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;

            Object.assign(video.style, {
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: -1
            });

            const src = document.createElement("source");
            src.src = url;
            src.type = "video/mp4";
            video.appendChild(src);
            el.prepend(video);
        }

        closeAboutPopup();
        return;
    }

    /* ===== TEXT ===== */
    const text = document.getElementById("aboutEditText").value.trim();
    if (!text) return alert("Text cannot be empty!");

    el.childNodes[0].nodeValue = text;

    el.style.color = document.getElementById("aboutEditTextColor").value;
    el.style.fontSize = document.getElementById("aboutEditFontSize").value + "px";
    el.style.fontFamily = document.getElementById("aboutEditFontFamily").value;
    el.style.fontWeight = document.getElementById("aboutEditFontWeight").value;
    el.style.fontStyle = document.getElementById("aboutEditFontStyle").value;
    el.style.lineHeight = document.getElementById("aboutEditLineHeight").value;

    closeAboutPopup();
};

/* ========== RESET FUNCTIONALITY ========== */
document.getElementById("resetAboutEdit").onclick = () => {
    const el = currentAboutElement;
    if (!el) return;

    const original = aboutOriginalState.get(el);

    /* RESET TEXT */
    el.childNodes[0].nodeValue = original.text;

    /* RESET STYLES */
    el.style.color = original.style.color;
    el.style.fontSize = original.style.fontSize;
    el.style.fontFamily = original.style.fontFamily;
    el.style.fontWeight = original.style.fontWeight;
    el.style.fontStyle = original.style.fontStyle;
    el.style.lineHeight = original.style.lineHeight;

    /* RESET BACKGROUND */
    el.style.background = original.style.background;
    el.style.backgroundColor = original.style.backgroundColor;
    el.style.backgroundImage = original.style.backgroundImage;

    /* Remove any added video */
    const vid = el.querySelector(".about-bg-video");
    if (vid) vid.remove();

    closeAboutPopup();
};


/* ===== Utility ===== */

function hideTextControls() {
    [
        "aboutEditText",
        "aboutEditTextColor",
        "aboutEditFontSize",
        "aboutEditFontFamily",
        "aboutEditFontWeight",
        "aboutEditFontStyle",
        "aboutEditLineHeight"
    ].forEach(id => document.getElementById(id).parentElement.style.display = "none");
}

function showTextControls() {
    [
        "aboutEditText",
        "aboutEditTextColor",
        "aboutEditFontSize",
        "aboutEditFontFamily",
        "aboutEditFontWeight",
        "aboutEditFontStyle",
        "aboutEditLineHeight"
    ].forEach(id => document.getElementById(id).parentElement.style.display = "block");
}

function hideBackgroundControls() {
    [
        "aboutBgType",
        "aboutBgColor",
        "aboutBgImageURL",
        "aboutBgVideoURL"
    ].forEach(id => document.getElementById(id).parentElement.style.display = "none");
}

function showBackgroundControls() {
    [
        "aboutBgType",
        "aboutBgColor",
        "aboutBgImageURL",
        "aboutBgVideoURL"
    ].forEach(id => document.getElementById(id).parentElement.style.display = "block");
}

function closeAboutPopup() {
    document.getElementById("aboutEditorPopup").style.display = "none";
}

function rgbToHex(rgb) {
    const r = rgb.match(/\d+/g);
    return "#" + r.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, "0")).join("");
}

/* ===== Initialize ===== */
setupAboutEditable();
setupAboutBackgroundEditable();
