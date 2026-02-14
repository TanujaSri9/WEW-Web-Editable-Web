/* ============================================================
   TESTIMONIALS EDITOR – FIXED VERSION (ONLY 2 ISSUES FIXED)
   ============================================================ */

let currentTestiCard = null;
let currentTestiIndex = null;
let defaultsTesti = {};
let testiInterval;

/* ============================================================
   SLIDER FUNCTIONALITY
   ============================================================ */

function startTestimonialSlider() {
    stopTestimonialSlider();
    testiInterval = setInterval(() => moveTestimonial(1), 4000);
}
function stopTestimonialSlider() { clearInterval(testiInterval); }

function moveTestimonial(step) {
    const cards = document.querySelectorAll(".testimonial-card");
    const dots = document.querySelectorAll(".pagination-dot");
    if (cards.length === 0) return;

    let index = [...cards].findIndex(c => c.classList.contains("active"));
    if (index < 0) index = 0;

    cards[index].classList.remove("active");
    dots[index]?.classList.remove("active");

    let newIndex = (index + step + cards.length) % cards.length;
    cards[newIndex].classList.add("active");
    dots[newIndex]?.classList.add("active");
}

document.querySelector(".testimonials-wrapper")
    .addEventListener("mouseenter", stopTestimonialSlider);
document.querySelector(".testimonials-wrapper")
    .addEventListener("mouseleave", startTestimonialSlider);

startTestimonialSlider();

/* ============================================================
   CAPTURE DEFAULTS
   ============================================================ */

function captureTestimonialDefaults() {

    defaultsTesti.title = {
        text: document.querySelector(".testimonials-title").textContent.trim(),
        color: getComputedStyle(document.querySelector(".testimonials-title")).color,
        fontSize: getComputedStyle(document.querySelector(".testimonials-title")).fontSize,
        fontFamily: getComputedStyle(document.querySelector(".testimonials-title")).fontFamily,
        fontWeight: getComputedStyle(document.querySelector(".testimonials-title")).fontWeight,
        fontStyle: getComputedStyle(document.querySelector(".testimonials-title")).fontStyle
    };

    defaultsTesti.subtitle = {
        text: document.querySelector(".testimonials-subtitle").textContent.trim(),
        color: getComputedStyle(document.querySelector(".testimonials-subtitle")).color,
        fontSize: getComputedStyle(document.querySelector(".testimonials-subtitle")).fontSize,
        fontFamily: getComputedStyle(document.querySelector(".testimonials-subtitle")).fontFamily,
        fontWeight: getComputedStyle(document.querySelector(".testimonials-subtitle")).fontWeight,
        fontStyle: getComputedStyle(document.querySelector(".testimonials-subtitle")).fontStyle
    };

    defaultsTesti.section = {
        bgColor: getComputedStyle(document.querySelector(".testimonials-section")).backgroundColor,
        bgImage: ""
    };

    defaultsTesti.pagination = {
        active: "#A93451",
        inactive: "#ddd",
        size: 8
    };

    defaultsTesti.cards = [];

    document.querySelectorAll(".testimonial-card").forEach((card, i) => {
        const avatar = card.querySelector(".testimonial-avatar");
        const stars = card.querySelector(".testimonial-stars");
        const text = card.querySelector(".testimonial-text");
        const author = card.querySelector(".testimonial-author");

        defaultsTesti.cards.push({
            avatar: {
                text: avatar.textContent.trim(),
                color: getComputedStyle(avatar).color,
                bg: getComputedStyle(avatar).backgroundColor,
                size: parseInt(getComputedStyle(avatar).fontSize)
            },
            stars: {
                count: stars.textContent.length,
                color: getComputedStyle(stars).color
            },
            text: {
                content: text.textContent.trim(),
                color: getComputedStyle(text).color,
                fontSize: getComputedStyle(text).fontSize,
                fontFamily: getComputedStyle(text).fontFamily,
                fontStyle: getComputedStyle(text).fontStyle,
                fontWeight: getComputedStyle(text).fontWeight
            },
            author: { name: author.textContent.trim() },
            card: {
                bg: getComputedStyle(card).backgroundColor,
                radius: getComputedStyle(card).borderRadius,
                padding: parseInt(getComputedStyle(card).padding)
            }
        });
    });
}

/* ============================================================
   ADD TITLE & SUBTITLE PENCIL ICONS (FIX 1)
   ============================================================ */

function attachTestiTextIcon(el, type) {
    if (!el) return;

    el.style.position = "relative";

    if (el.querySelector(".testi-text-icon")) 
        el.querySelector(".testi-text-icon").remove();

    const icon = document.createElement("span");
    icon.classList.add("testi-text-icon");
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
        transition:0.3s;
        z-index:30;
    `;

    el.appendChild(icon);

    el.addEventListener("mouseenter", () => icon.style.opacity = 1);
    el.addEventListener("mouseleave", () => icon.style.opacity = 0);

    icon.onclick = e => {
        e.stopPropagation();
        openTestiTextEditor(el, type);
    };
}

function openTestiTextEditor(el, type) {
    currentTestiCard = el;
    currentTestiIndex = type;

    const s = getComputedStyle(el);

    document.getElementById("testiTextEditText").value = el.textContent.trim();
    document.getElementById("testiTextEditColor").value = rgbToHex(s.color);
    document.getElementById("testiTextEditFontSize").value = parseInt(s.fontSize);
    document.getElementById("testiTextEditFontFamily").value = s.fontFamily.replace(/"/g, "");
    document.getElementById("testiTextEditFontWeight").value = s.fontWeight;
    document.getElementById("testiTextEditFontStyle").value = s.fontStyle;

    document.getElementById("testiTextEditorPopup").style.display = "block";
}

document.getElementById("saveTestiTextEdit").onclick = () => {
    if (!currentTestiCard) return;

    currentTestiCard.textContent =
        document.getElementById("testiTextEditText").value;

    currentTestiCard.style.color =
        document.getElementById("testiTextEditColor").value;

    currentTestiCard.style.fontSize =
        document.getElementById("testiTextEditFontSize").value + "px";

    currentTestiCard.style.fontFamily =
        document.getElementById("testiTextEditFontFamily").value;

    currentTestiCard.style.fontWeight =
        document.getElementById("testiTextEditFontWeight").value;

    currentTestiCard.style.fontStyle =
        document.getElementById("testiTextEditFontStyle").value;

    closeTestiTextEditor();
    setupTestimonialsEditable();
};

document.getElementById("resetTestiTextEdit").onclick = () => {
    if (currentTestiIndex === "title") {
        restoreTestiTitle();
    } else {
        restoreTestiSubtitle();
    }

    closeTestiTextEditor();
    setupTestimonialsEditable();
};

function restoreTestiTitle() {
    const el = document.querySelector(".testimonials-title");
    const d = defaultsTesti.title;

    el.textContent = d.text;
    el.style.color = d.color;
    el.style.fontFamily = d.fontFamily;
    el.style.fontSize = d.fontSize;
    el.style.fontWeight = d.fontWeight;
    el.style.fontStyle = d.fontStyle;
}

function restoreTestiSubtitle() {
    const el = document.querySelector(".testimonials-subtitle");
    const d = defaultsTesti.subtitle;

    el.textContent = d.text;
    el.style.color = d.color;
    el.style.fontFamily = d.fontFamily;
    el.style.fontSize = d.fontSize;
    el.style.fontWeight = d.fontWeight;
    el.style.fontStyle = d.fontStyle;
}

function closeTestiTextEditor() {
    document.getElementById("testiTextEditorPopup").style.display = "none";
}

/* ============================================================
   EDITABLE ICON ATTACH
   ============================================================ */

function setupTestimonialsEditable() {
    document.querySelectorAll(".testimonial-card")
        .forEach((card, index) => attachTestiIcon(card, index));

    attachTestiTextIcon(document.querySelector(".testimonials-title"), "title");
    attachTestiTextIcon(document.querySelector(".testimonials-subtitle"), "subtitle");

    document.querySelectorAll(".testi-tab").forEach(tab => {
        tab.onclick = () => activateTestiTab(tab.dataset.tab);
    });
}

function attachTestiIcon(card, index) {
    card.style.position = "relative";

    const old = card.querySelector(".testi-edit-icon");
    if (old) old.remove();

    const icon = document.createElement("span");
    icon.classList.add("testi-edit-icon");
    icon.style.cssText = `
        position:absolute;
        top:12px;
        right:12px;
        width:18px;
        height:18px;
        background:#333;
        mask:url('https://cdn-icons-png.flaticon.com/512/84/84380.png') center/contain no-repeat;
        cursor:pointer;
        opacity:0;
        z-index:50;
        transition:0.3s;
    `;

    card.appendChild(icon);

    card.onmouseenter = () => icon.style.opacity = 1;
    card.onmouseleave = () => icon.style.opacity = 0;

    icon.onclick = e => {
        e.stopPropagation();
        openTestimonialEditor(card, index);
    };
}

/* ============================================================
   OPEN EDITOR
   ============================================================ */
function openTestimonialEditor(card, index) {
    currentTestiCard = card;
    currentTestiIndex = index;

    const avatar = card.querySelector(".testimonial-avatar");
    const stars = card.querySelector(".testimonial-stars");
    const text = card.querySelector(".testimonial-text");
    const author = card.querySelector(".testimonial-author");

    activateTestiTab("testi-tab-text");

    // TEXT TAB
    document.getElementById("testiEditAuthor").value = author.textContent.trim();
    document.getElementById("testiEditText").value = text.textContent.trim();

    const cs = getComputedStyle(text);
    document.getElementById("testiEditFontFamily").value = cs.fontFamily.replace(/"/g, "");
    document.getElementById("testiEditFontWeight").value = cs.fontWeight;
    document.getElementById("testiEditFontStyle").value = cs.fontStyle;
    document.getElementById("testiEditTextColor").value = rgbToHex(cs.color);
    document.getElementById("testiEditFontSize").value = parseInt(cs.fontSize);

    // AVATAR TAB
    const ca = getComputedStyle(avatar);
    document.getElementById("testiEditAvatarText").value = avatar.textContent;
    document.getElementById("testiEditAvatarBg").value = rgbToHex(ca.backgroundColor);
    document.getElementById("testiEditAvatarColor").value = rgbToHex(ca.color);
    document.getElementById("testiEditAvatarSize").value = parseInt(ca.fontSize);

    // STARS TAB
    document.getElementById("testiEditStars").value = stars.textContent.length;
    document.getElementById("testiEditStarColor").value = rgbToHex(getComputedStyle(stars).color);

    // CARD TAB
    document.getElementById("testiEditCardBg").value = rgbToHex(getComputedStyle(card).backgroundColor);
    document.getElementById("testiEditCardRadius").value = parseInt(getComputedStyle(card).borderRadius);
    document.getElementById("testiEditCardPadding").value = parseInt(getComputedStyle(card).padding);

    document.getElementById("testiEditorPopup").style.display = "block";
}

/* ============================================================
   SAVE CARD
   ============================================================ */

document.getElementById("saveTestiEdit").onclick = () => {
    const card = currentTestiCard;

    const avatar = card.querySelector(".testimonial-avatar");
    const stars = card.querySelector(".testimonial-stars");
    const text = card.querySelector(".testimonial-text");
    const author = card.querySelector(".testimonial-author");

    // TEXT
    author.textContent = document.getElementById("testiEditAuthor").value;
    text.textContent = document.getElementById("testiEditText").value;

    text.style.fontFamily = document.getElementById("testiEditFontFamily").value;
    text.style.fontWeight = document.getElementById("testiEditFontWeight").value;
    text.style.fontStyle = document.getElementById("testiEditFontStyle").value;
    text.style.color = document.getElementById("testiEditTextColor").value;
    text.style.fontSize = document.getElementById("testiEditFontSize").value + "px";

    // AVATAR
    avatar.textContent = document.getElementById("testiEditAvatarText").value;
    avatar.style.backgroundColor = document.getElementById("testiEditAvatarBg").value;
    avatar.style.color = document.getElementById("testiEditAvatarColor").value;
    avatar.style.fontSize = document.getElementById("testiEditAvatarSize").value + "px";

    // STARS
    const starCount = document.getElementById("testiEditStars").value;
    stars.textContent = "★".repeat(starCount);
    stars.style.color = document.getElementById("testiEditStarColor").value;

    // CARD
    card.style.backgroundColor = document.getElementById("testiEditCardBg").value;
    card.style.borderRadius = document.getElementById("testiEditCardRadius").value + "px";
    card.style.padding = document.getElementById("testiEditCardPadding").value + "px";

    closeTestiEditor();
    setupTestimonialsEditable();
};

/* ============================================================
   RESET (PER TAB)
   ============================================================ */

document.getElementById("resetTestiEdit").onclick = () => {
    const tab = document.querySelector(".testi-tab.active").dataset.tab;

    switch (tab) {
        case "testi-tab-text": resetTextTab(currentTestiIndex); break;
        case "testi-tab-avatar": resetAvatarTab(currentTestiIndex); break;
        case "testi-tab-stars": resetStarsTab(currentTestiIndex); break;
        case "testi-tab-card": resetCardTab(currentTestiIndex); break;
        case "testi-tab-section": resetSectionTab(); break;
        case "testi-tab-pagination": resetPaginationTab(); break;
    }

    closeTestiEditor();
    setupTestimonialsEditable();
};

function resetTextTab(i) {
    const card = document.querySelectorAll(".testimonial-card")[i];
    const d = defaultsTesti.cards[i];

    card.querySelector(".testimonial-author").textContent = d.author.name;
    card.querySelector(".testimonial-text").textContent = d.text.content;

    const txt = card.querySelector(".testimonial-text");
    txt.style.color = d.text.color;
    txt.style.fontSize = d.text.fontSize;
    txt.style.fontFamily = d.text.fontFamily;
    txt.style.fontStyle = d.text.fontStyle;
    txt.style.fontWeight = d.text.fontWeight;
}

function resetAvatarTab(i) {
    const card = document.querySelectorAll(".testimonial-card")[i];
    const avatar = card.querySelector(".testimonial-avatar");
    const d = defaultsTesti.cards[i].avatar;

    avatar.textContent = d.text;
    avatar.style.backgroundColor = d.bg;
    avatar.style.color = d.color;
    avatar.style.fontSize = d.size + "px";
}

function resetStarsTab(i) {
    const card = document.querySelectorAll(".testimonial-card")[i];
    const stars = card.querySelector(".testimonial-stars");
    const d = defaultsTesti.cards[i].stars;

    stars.textContent = "★".repeat(d.count);
    stars.style.color = d.color;
}

function resetCardTab(i) {
    const card = document.querySelectorAll(".testimonial-card")[i];
    const d = defaultsTesti.cards[i].card;

    card.style.backgroundColor = d.bg;
    card.style.borderRadius = d.radius;
    card.style.padding = d.padding + "px";
}

function resetSectionTab() {
    const section = document.querySelector(".testimonials-section");
    section.style.backgroundColor = defaultsTesti.section.bgColor;
    section.style.backgroundImage = "";
}

function resetPaginationTab() {
    const dots = document.querySelectorAll(".pagination-dot");
    dots.forEach(dot => {
        dot.style.background = defaultsTesti.pagination.inactive;
        dot.style.width = defaultsTesti.pagination.size + "px";
        dot.style.height = defaultsTesti.pagination.size + "px";
    });

    document.querySelector(".pagination-dot.active").style.background =
        defaultsTesti.pagination.active;
}

/* ============================================================
   DUPLICATE / DELETE – FIXED (ISSUE 2)
   ============================================================ */

function rebuildPaginationDots() {
    const wrapper = document.querySelector(".testimonials-pagination");
    if (!wrapper) return;

    const cardCount = document.querySelectorAll(".testimonial-card").length;

    wrapper.innerHTML = "";

    for (let i = 0; i < cardCount; i++) {
        const dot = document.createElement("span");
        dot.classList.add("pagination-dot");
        if (i === 0) dot.classList.add("active");
        wrapper.appendChild(dot);
    }
}

document.getElementById("duplicateTestiCard").onclick = () => {
    const clone = currentTestiCard.cloneNode(true);

    const existingIcon = clone.querySelector(".testi-edit-icon");
    if (existingIcon) existingIcon.remove();

    const wrapper = document.querySelector(".testimonials-wrapper");
    wrapper.appendChild(clone);

    rebuildPaginationDots();
    setupTestimonialsEditable();
    closeTestiEditor();
};

document.getElementById("deleteTestiCard").onclick = () => {
    currentTestiCard.remove();

    rebuildPaginationDots();

    const cards = document.querySelectorAll(".testimonial-card");
    if (cards.length > 0) cards[0].classList.add("active");

    setupTestimonialsEditable();
    closeTestiEditor();
};

/* ============================================================
   TAB SWITCH
   ============================================================ */

function activateTestiTab(id) {
    document.querySelectorAll(".testi-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".testi-tab-panel").forEach(p => p.classList.remove("active"));

    document.querySelector(`[data-tab="${id}"]`).classList.add("active");
    document.getElementById(id).classList.add("active");
}

/* ============================================================
   UTILS
   ============================================================ */

function closeTestiEditor() {
    document.getElementById("testiEditorPopup").style.display = "none";
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

captureTestimonialDefaults();
setupTestimonialsEditable();
