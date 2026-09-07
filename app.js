/* =========================================================
   JANJUA HUB — APP.JS
   Universal Combo Manager — V1
   ========================================================= */


/* =========================================================
   STORAGE
   ========================================================= */

const COMBO_STORAGE_KEY = "janjuaHubCombos_v1";
const CATEGORY_STORAGE_KEY = "janjuaHubCategories_v1";


/* =========================================================
   DEFAULT CATEGORIES
   ========================================================= */

const DEFAULT_CATEGORIES = [
    "Finance",
    "Software",
    "Products",
    "Services",
    "Marketing",
    "Business",
    "Other"
];


/* =========================================================
   LOAD DATA
   ========================================================= */

let combos = loadCombos();
let categories = loadCategories();


function loadCombos() {

    try {

        const saved =
            localStorage.getItem(COMBO_STORAGE_KEY);

        return saved
            ? JSON.parse(saved)
            : [];

    } catch (error) {

        console.error(
            "Could not load combos:",
            error
        );

        return [];
    }
}


function loadCategories() {

    try {

        const saved =
            localStorage.getItem(CATEGORY_STORAGE_KEY);

        return saved
            ? JSON.parse(saved)
            : [...DEFAULT_CATEGORIES];

    } catch (error) {

        console.error(
            "Could not load categories:",
            error
        );

        return [...DEFAULT_CATEGORIES];
    }
}


/* =========================================================
   SAVE DATA
   ========================================================= */

function saveCombos() {

    localStorage.setItem(
        COMBO_STORAGE_KEY,
        JSON.stringify(combos)
    );
}


function saveCategories() {

    localStorage.setItem(
        CATEGORY_STORAGE_KEY,
        JSON.stringify(categories)
    );
}


/* =========================================================
   HELPERS
   ========================================================= */

function generateId() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );
}


function currentDate() {

    return new Date().toISOString();
}


/* =========================================================
   HTML SECURITY
   ========================================================= */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value).replace(
        /[&<>"']/g,
        function (character) {

            const map = {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            };

            return map[character];
        }
    );
}


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const comboList =
    document.getElementById("comboList");

const emptyState =
    document.getElementById("emptyState");

const totalCount =
    document.getElementById("totalCount");

const activeCount =
    document.getElementById("activeCount");

const pendingCount =
    document.getElementById("pendingCount");

const archivedCount =
    document.getElementById("archivedCount");

const resultCount =
    document.getElementById("resultCount");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const statusFilter =
    document.getElementById("statusFilter");


/* =========================================================
   MODALS
   ========================================================= */

const comboModal =
    document.getElementById("comboModal");

const pasteModal =
    document.getElementById("pasteModal");

const categoryModal =
    document.getElementById("categoryModal");

const helpModal =
    document.getElementById("helpModal");


/* =========================================================
   OPEN / CLOSE MODALS
   ========================================================= */

function openModal(modal) {

    if (modal) {
        modal.classList.remove("hidden");
    }
}


function closeModal(modal) {

    if (modal) {
        modal.classList.add("hidden");
    }
}


/* =========================================================
   ADD COMBO BUTTON
   ========================================================= */

const addBtn =
    document.getElementById("addBtn");

const emptyAddBtn =
    document.getElementById("emptyAddBtn");


if (addBtn) {

    addBtn.addEventListener(
        "click",
        function () {

            openAddComboModal();

        }
    );
}


if (emptyAddBtn) {

    emptyAddBtn.addEventListener(
        "click",
        function () {

            openAddComboModal();

        }
    );
}


/* =========================================================
   OPEN ADD COMBO
   ========================================================= */

function openAddComboModal() {

    const form =
        document.getElementById("comboForm");

    if (form) {
        form.reset();
    }


    document.getElementById(
        "editId"
    ).value = "";


    document.getElementById(
        "modalTitle"
    ).textContent = "Add Combo";


    document.getElementById(
        "comboStatus"
    ).value = "Active";


    openModal(comboModal);
}


/* =========================================================
   CLOSE ADD / EDIT MODAL
   ========================================================= */

const closeModalBtn =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");


if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        function () {

            closeModal(comboModal);

        }
    );
}


if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        function () {

            closeModal(comboModal);

        }
    );
}


/* =========================================================
   SAVE COMBO
   ========================================================= */

const comboForm =
    document.getElementById("comboForm");


if (comboForm) {

    comboForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const editId =
                document.getElementById(
                    "editId"
                ).value;


            const name =
                document.getElementById(
                    "comboName"
                ).value.trim();


            const category =
                document.getElementById(
                    "comboCategory"
                ).value.trim();


            const mainLink =
                document.getElementById(
                    "mainLink"
                ).value.trim();


            const affiliateLink =
                document.getElementById(
                    "affiliateLink"
                ).value.trim();


            const notes =
                document.getElementById(
                    "comboNotes"
                ).value.trim();


            const status =
                document.getElementById(
                    "comboStatus"
                ).value;


            if (!name) {

                alert(
                    "Please enter a Combo name."
                );

                return;
            }


            if (!category) {

                alert(
                    "Please enter a Category."
                );

                return;
            }


            const now =
                currentDate();


            /* EDIT EXISTING */

            if (editId) {

                const index =
                    combos.findIndex(
                        function (combo) {

                            return combo.id === editId;

                        }
                    );


                if (index !== -1) {

                    combos[index] = {

                        ...combos[index],

                        name: name,

                        category: category,

                        mainLink: mainLink,

                        affiliateLink:
                            affiliateLink,

                        notes: notes,

                        status: status,

                        updatedAt: now

                    };

                }

            }


            /* ADD NEW */

            else {

                const newCombo = {

                    id: generateId(),

                    name: name,

                    category: category,

                    mainLink: mainLink,

                    affiliateLink:
                        affiliateLink,

                    notes: notes,

                    status: status,

                    createdAt: now,

                    updatedAt: now

                };


                combos.unshift(
                    newCombo
                );


                /* Automatically add new category */

                if (
                    !categories.includes(
                        category
                    )
                ) {

                    categories.push(
                        category
                    );

                    saveCategories();

                }

            }


            saveCombos();


            closeModal(
                comboModal
            );


            render();

        }
    );
}


/* =========================================================
   EDIT COMBO
   ========================================================= */

function editCombo(id) {

    const combo =
        combos.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!combo) {
        return;
    }


    document.getElementById(
        "editId"
    ).value = combo.id;


    document.getElementById(
        "comboName"
    ).value = combo.name || "";


    document.getElementById(
        "comboCategory"
    ).value =
        combo.category || "";


    document.getElementById(
        "mainLink"
    ).value =
        combo.mainLink || "";


    document.getElementById(
        "affiliateLink"
    ).value =
        combo.affiliateLink || "";


    document.getElementById(
        "comboNotes"
    ).value =
        combo.notes || "";


    document.getElementById(
        "comboStatus"
    ).value =
        combo.status || "Active";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Combo";


    openModal(
        comboModal
    );
}


/* =========================================================
   DELETE COMBO
   ========================================================= */

function deleteCombo(id) {

    const combo =
        combos.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!combo) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${combo.name}" permanently?`
        );


    if (!confirmed) {
        return;
    }


    combos =
        combos.filter(
            function (item) {

                return item.id !== id;

            }
        );


    saveCombos();

    render();
}


/* =========================================================
   ARCHIVE / RESTORE
   ========================================================= */

function archiveCombo(id) {

    const combo =
        combos.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!combo) {
        return;
    }


    if (
        combo.status ===
        "Archived"
    ) {

        combo.status =
            "Active";

    } else {

        combo.status =
            "Archived";

    }


    combo.updatedAt =
        currentDate();


    saveCombos();

    render();
}


/* =========================================================
   PASTE COMBO
   ========================================================= */

const pasteBtn =
    document.getElementById("pasteBtn");


if (pasteBtn) {

    pasteBtn.addEventListener(
        "click",
        function () {

            document.getElementById(
                "pasteBox"
            ).value = "";


            openModal(
                pasteModal
            );

        }
    );
}


/* =========================================================
   CLOSE PASTE MODAL
   ========================================================= */

const closePasteModal =
    document.getElementById(
        "closePasteModal"
    );

const cancelPasteBtn =
    document.getElementById(
        "cancelPasteBtn"
    );


if (closePasteModal) {

    closePasteModal.addEventListener(
        "click",
        function () {

            closeModal(
                pasteModal
            );

        }
    );
}


if (cancelPasteBtn) {

    cancelPasteBtn.addEventListener(
        "click",
        function () {

            closeModal(
                pasteModal
            );

        }
    );
}


/* =========================================================
   IMPORT PASTED COMBOS
   ========================================================= */

const importPasteBtn =
    document.getElementById(
        "importPasteBtn"
    );


if (importPasteBtn) {

    importPasteBtn.addEventListener(
        "click",
        function () {

            const box =
                document.getElementById(
                    "pasteBox"
                );


            const text =
                box.value.trim();


            if (!text) {

                alert(
                    "Please paste Combo data first."
                );

                return;
            }


            let data;


            try {

                data =
                    JSON.parse(text);

            } catch (error) {

                alert(
                    "Invalid JSON. Please check the pasted data."
                );

                return;
            }


            if (
                !Array.isArray(data)
            ) {

                data = [data];

            }


            let imported = 0;


            data.forEach(
                function (item) {

                    if (
                        !item ||
                        typeof item !==
                        "object"
                    ) {

                        return;

                    }


                    const name =
                        String(
                            item.name ||
                            item.title ||
                            "Untitled Combo"
                        ).trim();


                    const category =
                        String(
                            item.category ||
                            "Other"
                        ).trim();


                    const combo = {

                        id: generateId(),

                        name: name,

                        category: category,

                        mainLink:
                            item.mainLink ||
                            item.main_link ||
                            item.website ||
                            "",

                        affiliateLink:
                            item.affiliateLink ||
                            item.affiliate_link ||
                            item.affiliate ||
                            "",

                        notes:
                            item.notes ||
                            item.description ||
                            "",

                        status:
                            item.status ||
                            "Active",

                        createdAt:
                            currentDate(),

                        updatedAt:
                            currentDate()

                    };


                    combos.unshift(
                        combo
                    );


                    if (
                        !categories.includes(
                            category
                        )
                    ) {

                        categories.push(
                            category
                        );

                    }


                    imported++;

                }
            );


            if (
                imported === 0
            ) {

                alert(
                    "No valid Combo records were found."
                );

                return;
            }


            saveCombos();

            saveCategories();


            closeModal(
                pasteModal
            );


            render();


            alert(
                `${imported} Combo(s) imported successfully.`
            );

        }
    );
}


/* =========================================================
   CATEGORY MANAGEMENT
   ========================================================= */

const categoryBtn =
    document.getElementById(
        "categoryBtn"
    );


if (categoryBtn) {

    categoryBtn.addEventListener(
        "click",
        function () {

            renderCategories();

            openModal(
                categoryModal
            );

        }
    );
}


/* =========================================================
   CLOSE CATEGORY MODAL
   ========================================================= */

const closeCategoryModal =
    document.getElementById(
        "closeCategoryModal"
    );


if (closeCategoryModal) {

    closeCategoryModal.addEventListener(
        "click",
        function () {

            closeModal(
                categoryModal
            );

        }
    );
}


/* =========================================================
   ADD CATEGORY
   ========================================================= */

const addCategoryBtn =
    document.getElementById(
        "addCategoryBtn"
    );


if (addCategoryBtn) {

    addCategoryBtn.addEventListener(
        "click",
        function () {

            const input =
                document.getElementById(
                    "newCategory"
                );


            const category =
                input.value.trim();


            if (!category) {

                alert(
                    "Please enter a category name."
                );

                return;
            }


            const exists =
                categories.some(
                    function (item) {

                        return (
                            item.toLowerCase() ===
                            category.toLowerCase()
                        );

                    }
                );


            if (exists) {

                alert(
                    "This category already exists."
                );

                return;
            }


            categories.push(
                category
            );


            saveCategories();


            input.value = "";


            renderCategories();

            render();

        }
    );
}


/* =========================================================
   DELETE CATEGORY
   ========================================================= */

function removeCategory(index) {

    if (
        index < 0 ||
        index >= categories.length
    ) {

        return;

    }


    const category =
        categories[index];


    const used =
        combos.some(
            function (combo) {

                return (
                    combo.category ===
                    category
                );

            }
        );


    let message =
        `Delete category "${category}"?`;


    if (used) {

        message +=
            "\n\nExisting Combos will NOT be deleted. Their category text will remain.";

    }


    if (
        !confirm(message)
    ) {

        return;

    }


    categories.splice(
        index,
        1
    );


    saveCategories();


    renderCategories();

    render();
}


/* =========================================================
   RENDER CATEGORY LIST
   ========================================================= */

function renderCategories() {

    const list =
        document.getElementById(
            "categoryListView"
        );


    if (!list) {
        return;
    }


    if (
        categories.length === 0
    ) {

        list.innerHTML = `
            <p class="muted">
                No categories yet.
            </p>
        `;

        return;
    }


    list.innerHTML =
        categories
            .map(
                function (category, index) {

                    return `

                        <div class="cat-row">

                            <span>
                                ${escapeHTML(category)}
                            </span>

                            <button
                                type="button"
                                onclick="removeCategory(${index})"
                            >
                                Delete
                            </button>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   UPDATE CATEGORY FILTER
   ========================================================= */

function renderCategoryFilters() {

    if (!categoryFilter) {
        return;
    }


    const currentValue =
        categoryFilter.value;


    categoryFilter.innerHTML =
        `
        <option value="">
            All Categories
        </option>
        ` +
        categories
            .map(
                function (category) {

                    return `
                        <option value="${escapeHTML(category)}">
                            ${escapeHTML(category)}
                        </option>
                    `;

                }
            )
            .join("");


    if (
        categories.includes(
            currentValue
        )
    ) {

        categoryFilter.value =
            currentValue;

    }

}


/* =========================================================
   UPDATE CATEGORY DATALIST
   ========================================================= */

function renderCategoryDatalist() {

    const datalist =
        document.getElementById(
            "categoryList"
        );


    if (!datalist) {
        return;
    }


    datalist.innerHTML =
        categories
            .map(
                function (category) {

                    return `
                        <option value="${escapeHTML(category)}">
                    `;

                }
            )
            .join("");

}


/* =========================================================
   SEARCH / FILTER
   ========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        render
    );

}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        render
    );

}


if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        render
    );

}


/* =========================================================
   GET FILTERED COMBOS
   ========================================================= */

function getFilteredCombos() {

    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const category =
        categoryFilter
            ? categoryFilter.value
            : "";


    const status =
        statusFilter
            ? statusFilter.value
            : "";


    return combos.filter(
        function (combo) {

            const searchableText =
                [

                    combo.name,

                    combo.category,

                    combo.mainLink,

                    combo.affiliateLink,

                    combo.notes,

                    combo.status

                ]
                    .join(" ")
                    .toLowerCase();


            const matchesSearch =
                !search ||
                searchableText.includes(
                    search
                );


            const matchesCategory =
                !category ||
                combo.category ===
                category;


            const matchesStatus =
                !status ||
                combo.status ===
                status;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );

        }
    );

}


/* =========================================================
   RENDER COMBOS
   ========================================================= */

function render() {

    renderCategoryFilters();

    renderCategoryDatalist();


    const filtered =
        getFilteredCombos();


    /* DASHBOARD COUNTS */

    if (totalCount) {

        totalCount.textContent =
            combos.length;

    }


    if (activeCount) {

        activeCount.textContent =
            combos.filter(
                function (combo) {

                    return (
                        combo.status ===
                        "Active"
                    );

                }
            ).length;

    }


    if (pendingCount) {

        pendingCount.textContent =
            combos.filter(
                function (combo) {

                    return (
                        combo.status ===
                        "Pending"
                    );

                }
            ).length;

    }


    if (archivedCount) {

        archivedCount.textContent =
            combos.filter(
                function (combo) {

                    return (
                        combo.status ===
                        "Archived"
                    );

                }
            ).length;

    }


    /* RESULT COUNT */

    if (resultCount) {

        resultCount.textContent =
            `${filtered.length} record${
                filtered.length === 1
                    ? ""
                    : "s"
            }`;

    }


    /* EMPTY STATE */

    if (emptyState) {

        emptyState.style.display =
            filtered.length === 0
                ? "block"
                : "none";

    }


    /* COMBO LIST */

    if (!comboList) {
        return;
    }


    comboList.innerHTML =
        filtered
            .map(
                createComboHTML
            )
            .join("");

}


/* =========================================================
   CREATE COMBO HTML
   ========================================================= */

function createComboHTML(combo) {

    const mainLink =
        combo.mainLink
            ? `
                <a
                    href="${escapeHTML(combo.mainLink)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Main Link ↗
                </a>
            `
            : "";


    const affiliateLink =
        combo.affiliateLink
            ? `
                <a
                    href="${escapeHTML(combo.affiliateLink)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Affiliate Link ↗
                </a>
            `
            : "";


    const notes =
        combo.notes
            ? escapeHTML(
                combo.notes
            )
            : "No notes added.";


    const archiveButton =
        combo.status ===
        "Archived"

            ? `
                <button
                    type="button"
                    onclick="archiveCombo('${combo.id}')"
                >
                    Restore
                </button>
            `

            : `
                <button
                    type="button"
                    onclick="archiveCombo('${combo.id}')"
                >
                    Archive
                </button>
            `;


    return `

        <article class="combo">

            <div>

                <h4>
                    ${escapeHTML(combo.name)}
                </h4>


                <div class="meta">

                    <span class="tag">
                        ${escapeHTML(
                            combo.category
                        )}
                    </span>


                    <span class="tag">
                        ${escapeHTML(
                            combo.status
                        )}
                    </span>

                </div>


                <div class="notes">
                    ${notes}
                </div>


                <div class="links">

                    ${mainLink}

                    ${affiliateLink}

                </div>

            </div>


            <div class="actions">

                <button
                    type="button"
                    onclick="editCombo('${combo.id}')"
                >
                    Edit
                </button>


                ${archiveButton}


                <button
                    type="button"
                    onclick="deleteCombo('${combo.id}')"
                >
                    Delete
                </button>

            </div>

        </article>

    `;

}


/* =========================================================
   HELP CENTER
   ========================================================= */

const helpBtn =
    document.getElementById(
        "helpBtn"
    );


if (helpBtn) {

    helpBtn.addEventListener(
        "click",
        function () {

            openModal(
                helpModal
            );

        }
    );

}


/* =========================================================
   CLOSE HELP CENTER
   ========================================================= */

const closeHelpModal =
    document.getElementById(
        "closeHelpModal"
    );


if (closeHelpModal) {

    closeHelpModal.addEventListener(
        "click",
        function () {

            closeModal(
                helpModal
            );

        }
    );

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
   ========================================================= */

[
    comboModal,
    pasteModal,
    categoryModal,
    helpModal

].forEach(
    function (modal) {

        if (!modal) {
            return;
        }


        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    modal
                ) {

                    closeModal(
                        modal
                    );

                }

            }
        );

    }
);


/* =========================================================
   ESC KEY CLOSE
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        [
            comboModal,
            pasteModal,
            categoryModal,
            helpModal

        ].forEach(
            function (modal) {

                closeModal(
                    modal
                );

            }
        );

    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

render();


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.editCombo =
    editCombo;

window.deleteCombo =
    deleteCombo;

window.archiveCombo =
    archiveCombo;

window.removeCategory =
    removeCategory;


/* =========================================================
   END
   ========================================================= */
