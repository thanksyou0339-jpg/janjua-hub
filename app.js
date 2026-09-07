/* =========================================================
   JANJUA HUB — APP.JS
   Firebase Authentication + Firestore
   Universal Combo Manager
   ========================================================= */

import { initializeApp }
    from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
}
    from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
}
    from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
   ========================================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyBpGwssnPxdEVJPiMsrhJNSJc_l_Nj8CME",

    authDomain:
        "all-in-one-marketing.firebaseapp.com",

    projectId:
        "all-in-one-marketing",

    storageBucket:
        "all-in-one-marketing.firebasestorage.app",

    messagingSenderId:
        "701353417673",

    appId:
        "1:701353417673:web:84b5cce6029f98b89fa618"
};


/* =========================================================
   INITIALIZE FIREBASE
   ========================================================= */

const firebaseApp =
    initializeApp(firebaseConfig);

const auth =
    getAuth(firebaseApp);

const db =
    getFirestore(firebaseApp);


/* =========================================================
   SETTINGS
   ========================================================= */

const ADMIN_EMAIL =
    "thanksyou0339@gmail.com";

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
   DATA
   ========================================================= */

let combos = [];

let categories = [];


/* =========================================================
   DOM
   ========================================================= */

const loginScreen =
    document.getElementById("loginScreen");

const appShell =
    document.getElementById("appShell");

const loginForm =
    document.getElementById("loginForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const loginMessage =
    document.getElementById("loginMessage");

const logoutBtn =
    document.getElementById("logoutBtn");

const adminEmailDisplay =
    document.getElementById("adminEmailDisplay");


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


const comboModal =
    document.getElementById("comboModal");

const pasteModal =
    document.getElementById("pasteModal");

const categoryModal =
    document.getElementById("categoryModal");

const helpModal =
    document.getElementById("helpModal");


/* =========================================================
   HTML SECURITY
   ========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
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
   MODALS
   ========================================================= */

function openModal(modal) {

    if (modal) {

        modal.classList.remove(
            "hidden"
        );

    }
}


function closeModal(modal) {

    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }
}


/* =========================================================
   LOGIN
   ========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                loginEmail.value.trim();

            const password =
                loginPassword.value;

            if (!email || !password) {

                loginMessage.textContent =
                    "Please enter email and password.";

                return;
            }

            loginMessage.textContent =
                "Signing in...";

            try {

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                loginPassword.value = "";

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                loginMessage.textContent =
                    "Login failed. Please check your email and password.";

            }

        }
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            try {

                await signOut(auth);

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}


/* =========================================================
   ADMIN CHECK
   ========================================================= */

async function checkAdmin(user) {

    if (!user) {

        return false;

    }

    try {

        const userRef =
            doc(
                db,
                "users",
                user.uid
            );

        const userSnap =
            await getDoc(userRef);

        if (!userSnap.exists()) {

            return false;

        }

        const data =
            userSnap.data();

        return (
            data.role === "admin"
        );

    } catch (error) {

        console.error(
            "Admin check error:",
            error
        );

        return false;

    }

}


/* =========================================================
   AUTH STATE
   ========================================================= */

onAuthStateChanged(
    auth,
    async function (user) {

        if (!user) {

            appShell.style.display =
                "none";

            loginScreen.classList.remove(
                "hidden"
            );

            loginScreen.style.display =
                "flex";

            loginMessage.textContent =
                "";

            return;

        }


        const admin =
            await checkAdmin(user);


        if (!admin) {

            alert(
                "This account does not have Janjua Hub admin access."
            );

            await signOut(auth);

            return;

        }


        loginScreen.classList.add(
            "hidden"
        );

        loginScreen.style.display =
            "none";

        appShell.style.display =
            "block";


        if (adminEmailDisplay) {

            adminEmailDisplay.textContent =
                user.email || ADMIN_EMAIL;

        }


        await loadFirebaseData();

    }
);


/* =========================================================
   LOAD COMBOS
   ========================================================= */

async function loadCombos() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "combos"
                )
            );

        combos =
            snapshot.docs.map(
                function (item) {

                    const data =
                        item.data();

                    return {

                        id: item.id,

                        name:
                            data.name || "",

                        category:
                            data.category || "Other",

                        mainLink:
                            data.mainLink || "",

                        affiliateLink:
                            data.affiliateLink || "",

                        notes:
                            data.notes || "",

                        status:
                            data.status || "Active",

                        createdAt:
                            data.createdAt || null,

                        updatedAt:
                            data.updatedAt || null

                    };

                }
            );

        combos.sort(
            function (a, b) {

                const aTime =
                    getTimeValue(
                        a.createdAt
                    );

                const bTime =
                    getTimeValue(
                        b.createdAt
                    );

                return bTime - aTime;

            }
        );

    } catch (error) {

        console.error(
            "Could not load combos:",
            error
        );

        alert(
            "Could not load Combos from Firebase."
        );

    }

}


/* =========================================================
   LOAD CATEGORIES
   ========================================================= */

async function loadCategories() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "categories"
                )
            );

        categories =
            snapshot.docs.map(
                function (item) {

                    const data =
                        item.data();

                    return (
                        data.name ||
                        item.id
                    );

                }
            );


        if (
            categories.length === 0
        ) {

            categories =
                [
                    ...DEFAULT_CATEGORIES
                ];


            for (
                const category
                of categories
            ) {

                const categoryId =
                    category
                        .toLowerCase()
                        .replace(
                            /[^a-z0-9]+/g,
                            "-"
                        )
                        .replace(
                            /^-|-$/g,
                            ""
                        );

                await setDoc(
                    doc(
                        db,
                        "categories",
                        categoryId
                    ),
                    {
                        name: category,
                        createdAt:
                            serverTimestamp()
                    }
                );

            }

        }

        categories =
            [...new Set(categories)];


        categories.sort(
            function (a, b) {

                return a.localeCompare(b);

            }
        );

    } catch (error) {

        console.error(
            "Could not load categories:",
            error
        );

        categories =
            [
                ...DEFAULT_CATEGORIES
            ];

    }

}


/* =========================================================
   LOAD ALL FIREBASE DATA
   ========================================================= */

async function loadFirebaseData() {

    await loadCategories();

    await loadCombos();

    render();

}


/* =========================================================
   TIME HELPER
   ========================================================= */

function getTimeValue(value) {

    if (!value) {

        return 0;

    }

    if (
        typeof value.toMillis ===
        "function"
    ) {

        return value.toMillis();

    }

    if (
        value.seconds !==
        undefined
    ) {

        return value.seconds * 1000;

    }

    const parsed =
        new Date(value).getTime();

    return isNaN(parsed)
        ? 0
        : parsed;

}


/* =========================================================
   ADD BUTTON
   ========================================================= */

const addBtn =
    document.getElementById("addBtn");

const emptyAddBtn =
    document.getElementById("emptyAddBtn");


if (addBtn) {

    addBtn.addEventListener(
        "click",
        openAddComboModal
    );

}


if (emptyAddBtn) {

    emptyAddBtn.addEventListener(
        "click",
        openAddComboModal
    );

}


/* =========================================================
   ADD MODAL
   ========================================================= */

function openAddComboModal() {

    const form =
        document.getElementById(
            "comboForm"
        );

    if (form) {

        form.reset();

    }


    document.getElementById(
        "editId"
    ).value = "";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Combo";


    document.getElementById(
        "comboStatus"
    ).value =
        "Active";


    openModal(
        comboModal
    );

}


/* =========================================================
   SAVE COMBO
   ========================================================= */

const comboForm =
    document.getElementById(
        "comboForm"
    );


if (comboForm) {

    comboForm.addEventListener(
        "submit",
        async function (event) {

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


            try {

                /* =====================
                   EDIT
                ===================== */

                if (editId) {

                    await updateDoc(
                        doc(
                            db,
                            "combos",
                            editId
                        ),
                        {

                            name: name,

                            category: category,

                            mainLink:
                                mainLink,

                            affiliateLink:
                                affiliateLink,

                            notes: notes,

                            status: status,

                            updatedAt:
                                serverTimestamp()

                        }
                    );

                }


                /* =====================
                   ADD
                ===================== */

                else {

                    await addDoc(
                        collection(
                            db,
                            "combos"
                        ),
                        {

                            name: name,

                            category: category,

                            mainLink:
                                mainLink,

                            affiliateLink:
                                affiliateLink,

                            notes: notes,

                            status: status,

                            createdAt:
                                serverTimestamp(),

                            updatedAt:
                                serverTimestamp()

                        }
                    );

                }


                /* Automatically create
                   category if missing */

                if (
                    !categories.some(
                        function (item) {

                            return (
                                item.toLowerCase() ===
                                category.toLowerCase()
                            );

                        }
                    )
                ) {

                    await createCategory(
                        category
                    );

                }


                closeModal(
                    comboModal
                );


                await loadFirebaseData();


            } catch (error) {

                console.error(
                    "Save Combo error:",
                    error
                );

                alert(
                    "Could not save Combo to Firebase."
                );

            }

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
    ).value =
        combo.id;


    document.getElementById(
        "comboName"
    ).value =
        combo.name || "";


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

async function deleteCombo(id) {

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


    try {

        await deleteDoc(
            doc(
                db,
                "combos",
                id
            )
        );


        await loadFirebaseData();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );

        alert(
            "Could not delete Combo."
        );

    }

}


/* =========================================================
   ARCHIVE / RESTORE
   ========================================================= */

async function archiveCombo(id) {

    const combo =
        combos.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!combo) {

        return;

    }


    const newStatus =
        combo.status === "Archived"
            ? "Active"
            : "Archived";


    try {

        await updateDoc(
            doc(
                db,
                "combos",
                id
            ),
            {

                status:
                    newStatus,

                updatedAt:
                    serverTimestamp()

            }
        );


        await loadFirebaseData();


    } catch (error) {

        console.error(
            "Archive error:",
            error
        );

        alert(
            "Could not update Combo."
        );

    }

}


/* =========================================================
   PASTE COMBO
   ========================================================= */

const pasteBtn =
    document.getElementById(
        "pasteBtn"
    );


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
   IMPORT PASTE
   ========================================================= */

const importPasteBtn =
    document.getElementById(
        "importPasteBtn"
    );


if (importPasteBtn) {

    importPasteBtn.addEventListener(
        "click",
        async function () {

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


            try {

                for (
                    const item
                    of data
                ) {

                    if (
                        !item ||
                        typeof item !==
                        "object"
                    ) {

                        continue;

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


                    await addDoc(
                        collection(
                            db,
                            "combos"
                        ),
                        {

                            name: name,

                            category:
                                category,

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
                                serverTimestamp(),

                            updatedAt:
                                serverTimestamp()

                        }
                    );


                    if (
                        !categories.some(
                            function (item) {

                                return (
                                    item.toLowerCase() ===
                                    category.toLowerCase()
                                );

                            }
                        )
                    ) {

                        await createCategory(
                            category
                        );

                    }


                    imported++;

                }


                if (
                    imported === 0
                ) {

                    alert(
                        "No valid Combo records were found."
                    );

                    return;

                }


                closeModal(
                    pasteModal
                );


                await loadFirebaseData();


                alert(
                    `${imported} Combo(s) imported successfully.`
                );


            } catch (error) {

                console.error(
                    "Import error:",
                    error
                );

                alert(
                    "Some Combo data could not be imported."
                );

            }

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
   CREATE CATEGORY
   ========================================================= */

async function createCategory(category) {

    const cleanName =
        String(
            category
        ).trim();


    if (!cleanName) {

        return;

    }


    const exists =
        categories.some(
            function (item) {

                return (
                    item.toLowerCase() ===
                    cleanName.toLowerCase()
                );

            }
        );


    if (exists) {

        return;

    }


    const categoryId =
        cleanName
            .toLowerCase()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-|-$/g,
                ""
            );


    await setDoc(
        doc(
            db,
            "categories",
            categoryId
        ),
        {

            name:
                cleanName,

            createdAt:
                serverTimestamp()

        }
    );


    categories.push(
        cleanName
    );

}


/* =========================================================
   ADD CATEGORY BUTTON
   ========================================================= */

const addCategoryBtn =
    document.getElementById(
        "addCategoryBtn"
    );


if (addCategoryBtn) {

    addCategoryBtn.addEventListener(
        "click",
        async function () {

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


            try {

                await createCategory(
                    category
                );


                input.value = "";


                renderCategories();

                render();


            } catch (error) {

                console.error(
                    "Category error:",
                    error
                );

                alert(
                    "Could not create category."
                );

            }

        }
    );

}


/* =========================================================
   DELETE CATEGORY
   ========================================================= */

async function removeCategory(index) {

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


    try {

        const categoryId =
            category
                .toLowerCase()
                .replace(
                    /[^a-z0-9]+/g,
                    "-"
                )
                .replace(
                    /^-|-$/g,
                    ""
                );


        await deleteDoc(
            doc(
                db,
                "categories",
                categoryId
            )
        );


        categories =
            categories.filter(
                function (item) {

                    return (
                        item !== category
                    );

                }
            );


        renderCategories();

        render();


    } catch (error) {

        console.error(
            "Delete category error:",
            error
        );

        alert(
            "Could not delete category."
        );

    }

}


/* =========================================================
   RENDER CATEGORIES
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
                function (
                    category,
                    index
                ) {

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
   CATEGORY FILTER
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
                        <option
                            value="${escapeHTML(category)}"
                        >
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
   CATEGORY DATALIST
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
                        <option
                            value="${escapeHTML(category)}"
                        >
                    `;

                }
            )
            .join("");

}


/* =========================================================
   SEARCH
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
   FILTER
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
   RENDER
   ========================================================= */

function render() {

    renderCategoryFilters();

    renderCategoryDatalist();


    const filtered =
        getFilteredCombos();


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


    if (resultCount) {

        resultCount.textContent =
            `${filtered.length} record${
                filtered.length === 1
                    ? ""
                    : "s"
            }`;

    }


    if (emptyState) {

        emptyState.style.display =
            filtered.length === 0
                ? "block"
                : "none";

    }


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
   COMBO HTML
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
                    onclick="archiveCombo('${escapeHTML(combo.id)}')"
                >
                    Restore
                </button>
            `

            : `
                <button
                    type="button"
                    onclick="archiveCombo('${escapeHTML(combo.id)}')"
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
                    onclick="editCombo('${escapeHTML(combo.id)}')"
                >
                    Edit
                </button>


                ${archiveButton}


                <button
                    type="button"
                    onclick="deleteCombo('${escapeHTML(combo.id)}')"
                >
                    Delete
                </button>

            </div>

        </article>

    `;

}


/* =========================================================
   HELP
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
   CLOSE BUTTONS
   ========================================================= */

const closeModalBtn =
    document.getElementById(
        "closeModal"
    );

const cancelBtn =
    document.getElementById(
        "cancelBtn"
    );


if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        function () {

            closeModal(
                comboModal
            );

        }
    );

}


if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        function () {

            closeModal(
                comboModal
            );

        }
    );

}


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
        function (event) {

            event.preventDefault();

            closeModal(
                pasteModal
            );

        }
    );

}


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
   CLICK OUTSIDE MODALS
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
   ESC KEY
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
