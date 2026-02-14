/* ---------------- HERO EDITOR – FINAL VERSION WITH RESET ---------------- */

let currentHeroElement = null;
let isButton = false;
let isBackground = false;
let heroOriginalStyles = new WeakMap();

/* ================= INITIAL SETUP ================= */
function setupHeroEditable() {
    const title = document.querySelector(".hero-title");
    const subtitle = document.querySelector(".hero-subtitle");
    const button = document.querySelector(".hero-btn");

    [title, subtitle, button].forEach(el => {
        if (!el) return;

        storeOriginalHeroStyles(el);   // store default values
        makeHeroEditable(el, el === button);
    });
}

function makeHeroEditable(el, buttonMode) {
    if (!el) return;

    el.classList.add("editable-hero");

    if (!el.querySelector(".hero-edit-icon")) {
        const icon = document.createElement("span");
        icon.classList.add("hero-edit-icon");
        el.appendChild(icon);

        icon.addEventListener("click", (e) => {
            e.stopPropagation();
            openHeroEditor(el, buttonMode);
        });
    }
}

/* ================= STORE ORIGINAL VALUES ================= */
function storeOriginalHeroStyles(el) {
    const styles = window.getComputedStyle(el);

    heroOriginalStyles.set(el, {
        text: el.childNodes[0]?.nodeValue?.trim() || "",
        color: styles.color,
        fontSize: styles.fontSize,
        fontFamily: styles.fontFamily,
        fontWeight: styles.fontWeight,
        fontStyle: styles.fontStyle,
        background: styles.backgroundColor,
        borderColor: styles.borderColor
    });
}

/* ================= OPEN TEXT EDITOR ================= */
function openHeroEditor(el, buttonMode) {
    currentHeroElement = el;
    isBackground = false;
    isButton = buttonMode;

    const st = getComputedStyle(el);

    document.getElementById("heroEditText").value =
        el.childNodes[0]?.nodeValue.trim() || "";

    document.getElementById("heroEditTextColor").value = rgbToHex(st.color);
    document.getElementById("heroEditFontSize").value = parseInt(st.fontSize);
    document.getElementById("heroEditFontFamily").value = st.fontFamily;
    document.getElementById("heroEditFontWeight").value = st.fontWeight;
    document.getElementById("heroEditFontStyle").value = st.fontStyle;

    document.getElementById("heroEditBgColor").disabled = !buttonMode;
    document.getElementById("heroEditBorderColor").disabled = !buttonMode;

    if (buttonMode) {
        document.getElementById("heroEditBgColor").value = rgbToHex(st.backgroundColor);
        document.getElementById("heroEditBorderColor").value = rgbToHex(st.borderColor);
    }

    showTextControls();
    hideBackgroundControls();

    document.getElementById("heroEditorPopup").style.display = "block";
}

/* ================= OPEN BACKGROUND EDITOR ================= */
function openHeroBackgroundEditor(hero) {
    currentHeroElement = hero;
    isBackground = true;

    hideTextControls();
    showBackgroundControls();

    document.getElementById("heroEditorPopup").style.display = "block";
}

/* ================= SAVE CHANGES ================= */
document.getElementById("saveHeroEdit").onclick = () => {
    const el = currentHeroElement;

    /* ------ HERO BACKGROUND ------ */
    if (isBackground) {
        const type = document.getElementById("heroBgType").value;

        const gradient =
            "linear-gradient(rgba(72,69,70,0.65), rgba(145,32,64,0.65), rgba(86,80,82,0.65))";

        el.style.background = null;

        const oldVideo = el.querySelector(".hero-bg-video");
        if (oldVideo) oldVideo.remove();

        if (type === "color") {
            el.style.background = gradient + "," + document.getElementById("heroBgColor").value;
        }

        if (type === "image") {
            const url = document.getElementById("heroBgImageURL").value;
            el.style.background = `${gradient}, url('${url}')`;
            el.style.backgroundSize = "cover";
            el.style.backgroundPosition = "center";
        }

        if (type === "video") {
            const url = document.getElementById("heroBgVideoURL").value;
            const video = document.createElement("video");
            video.classList.add("hero-bg-video");
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;

            Object.assign(video.style, {
                position: "absolute",
                top: 0,
                left: 0,
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
            el.style.background = gradient;
        }

        closePopup();
        return;
    }

    /* ------ TEXT PROPERTIES ------ */
    el.childNodes[0].nodeValue = document.getElementById("heroEditText").value.trim();
    el.style.color = document.getElementById("heroEditTextColor").value;
    el.style.fontSize = document.getElementById("heroEditFontSize").value + "px";
    el.style.fontFamily = document.getElementById("heroEditFontFamily").value;
    el.style.fontWeight = document.getElementById("heroEditFontWeight").value;
    el.style.fontStyle = document.getElementById("heroEditFontStyle").value;

    if (isButton) {
        el.style.backgroundColor = document.getElementById("heroEditBgColor").value;
        el.style.borderColor = document.getElementById("heroEditBorderColor").value;
        el.style.borderStyle = "solid";
        el.style.borderWidth = "2px";
    }

    closePopup();
};

/* ================= RESET BUTTON ================= */
document.getElementById("resetHeroEdit").onclick = () => {
    const el = currentHeroElement;
    const original = heroOriginalStyles.get(el);

    if (!original) return;

    el.childNodes[0].nodeValue = original.text;
    el.style.color = original.color;
    el.style.fontSize = original.fontSize;
    el.style.fontFamily = original.fontFamily;
    el.style.fontWeight = original.fontWeight;
    el.style.fontStyle = original.fontStyle;

    if (isButton) {
        el.style.backgroundColor = original.background;
        el.style.borderColor = original.borderColor;
    }

    closePopup();
};

/* ================= HELPERS ================= */

function hideBackgroundControls() {
    ["heroBgType", "heroBgColor", "heroBgImageURL", "heroBgVideoURL"].forEach(id =>
        document.getElementById(id).parentElement.style.display = "none"
    );
}

function showBackgroundControls() {
    ["heroBgType", "heroBgColor", "heroBgImageURL", "heroBgVideoURL"].forEach(id =>
        document.getElementById(id).parentElement.style.display = "block"
    );
}

function hideTextControls() {
    ["heroEditText", "heroEditTextColor", "heroEditFontSize", "heroEditFontFamily",
        "heroEditFontWeight", "heroEditFontStyle"].forEach(id =>
        document.getElementById(id).parentElement.style.display = "none"
    );
}

function showTextControls() {
    ["heroEditText", "heroEditTextColor", "heroEditFontSize", "heroEditFontFamily",
        "heroEditFontWeight", "heroEditFontStyle"].forEach(id =>
        document.getElementById(id).parentElement.style.display = "block"
    );
}

function closePopup() {
    document.getElementById("heroEditorPopup").style.display = "none";
}

function rgbToHex(rgb) {
    const r = rgb.match(/\d+/g);
    return "#" + r.slice(0, 3).map(x => (+x).toString(16).padStart(2, "0")).join("");
}

/* ---------------- BACKGROUND ICON ---------------- */
function setupHeroBackgroundEditable() {
    const hero = document.querySelector(".hero-section");

    if (!hero.querySelector(".hero-bg-edit-icon")) {
        const icon = document.createElement("span");
        icon.classList.add("hero-bg-edit-icon");
        hero.appendChild(icon);

        icon.addEventListener("click", (e) => {
            e.stopPropagation();
            openHeroBackgroundEditor(hero);
        });
    }
}

/* ---------------- INITIALIZE ---------------- */
setupHeroEditable();
setupHeroBackgroundEditable();
