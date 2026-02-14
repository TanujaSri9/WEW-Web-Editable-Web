// =============================================================
// J A R V I S   –   SIMPLE CLEAN EXPORT ENGINE (Final Version)
// =============================================================

document.getElementById("exportNowBtn").addEventListener("click", exportCleanSite);

async function exportCleanSite() {

    const zip = new JSZip();

    // =============================
    // 1. Export index.html EXACTLY
    // =============================
    let cleanHTML = document.documentElement.cloneNode(true);

    // Remove editor things
    cleanHTML.querySelectorAll(".edit-icon").forEach(e => e.remove());
    cleanHTML.querySelectorAll(".editable-navbar").forEach(e => e.classList.remove("editable-navbar"));
    cleanHTML.querySelectorAll("[id*='EditorPopup']").forEach(e => e.remove());

    // Remove export button from final download
    cleanHTML.querySelector(".export-btn")?.remove();

    // Save clean HTML
    zip.file("index.html", "<!DOCTYPE html>\n" + cleanHTML.outerHTML);


    // =============================
    // 2. EXPORT ALL CSS FILES
    // =============================
    const cssFiles = [
        "style.css",
        "about-editable.css",
        "contact-editable.css",
        "menu-editable.css",
        "navbar-editable.css",
        "team-editable.css",
        "testimonials-editable.css",
        "hero-editable.css",
        "blog-editable.css"
    ];

    for (let file of cssFiles) {
        try {
            let res = await fetch(file);
            let txt = await res.text();
            zip.file(file, txt);
        } catch {
            console.warn("CSS Missing:", file);
        }
    }


    // =============================
    // 3. EXPORT ALL JS FILES
    // =============================
    const jsFiles = [
        "about-editable.js",
        "contact-editable.js",
        "menu-editable.js",
        "navbar-editable.js",
        "team-editable.js",
        "testimonials-editor.js",
        "testimonials-sliding.js",
        "hero-editable.js",
        "blog-editor.js"
    ];

    for (let file of jsFiles) {
        try {
            let res = await fetch(file);
            let txt = await res.text();
            zip.file(file, txt);
        } catch {
            console.warn("JS Missing:", file);
        }
    }


    // =============================
    // 4. EXPORT ALL IMAGES USED
    // =============================
    const imgFolder = zip.folder("images");
    const imgs = document.querySelectorAll("img");

    for (let img of imgs) {
        try {
            let url = img.src;
            let name = url.split("/").pop();
            let blob = await fetch(url).then(r => r.blob());
            imgFolder.file(name, blob);
        } catch { }
    }


    // =============================
    // 5. BUILD ZIP
    // =============================
    zip.generateAsync({ type: "blob" }).then(content => {
        saveAs(content, "Website-Export.zip");
    });

    alert("Your website has been exported successfully!");
}
