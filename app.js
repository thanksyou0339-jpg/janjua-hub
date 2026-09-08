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
   FIREBASE
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyBpGwssnPxdEVJPiMsrhJNSJc_l_Nj8CME",
    authDomain: "all-in-one-marketing.firebaseapp.com",
    projectId: "all-in-one-marketing",
    storageBucket: "all-in-one-marketing.firebasestorage.app",
    messagingSenderId: "701353417673",
    appId: "1:701353417673:web:84b5cce6029f98b89fa618"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


/* =========================================================
   SETTINGS
========================================================= */

const ADMIN_EMAIL = "thanksyou0339@gmail.com";

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
   STATE
========================================================= */

let combos = [];
let categories = [];
let marketingLinks = {};

let currentUser = null;


/* =========================================================
   DOM
========================================================= */

const loginScreen =
    document.getElementById("loginScreen");

const loginForm =
    document.getElementById("loginForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const loginMessage =
    document.getElementById("loginMessage");

const appShell =
    document.getElementById("appShell");

const adminEmailDisplay =
    document.getElementById("adminEmailDisplay");

const logoutBtn =
    document.getElementById("logoutBtn");

const helpBtn =
    document.getElementById("helpBtn");

const addBtn =
    document.getElementById("addBtn");

const pasteBtn =
    document.getElementById("pasteBtn");


/* =========================================================
   STATS
========================================================= */

const totalCount =
    document.getElementById("totalCount");

const activeCount =
    document.getElementById("activeCount");

const pendingCount =
    document.getElementById("pendingCount");

const archivedCount =
    document.getElementById("archivedCount");

const totalMarketingCount =
    document.getElementById("totalMarketingCount");

const totalClicksCount =
    document.getElementById("totalClicksCount");


/* =========================================================
   FILTERS
========================================================= */

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const statusFilter =
    document.getElementById("statusFilter");

const categoryBtn =
    document.getElementById("categoryBtn");


/* =========================================================
   COMBO LIST
========================================================= */

const resultCount =
    document.getElementById("resultCount");

const comboList =
    document.getElementById("comboList");

const emptyState =
    document.getElementById("emptyState");

const emptyAddBtn =
    document.getElementById("emptyAddBtn");


/* =========================================================
   MARKETING LINKS CONTROL
========================================================= */

const refreshMarketingBtn =
    document.getElementById("refreshMarketingBtn");

const marketingLinksList =
    document.getElementById("marketingLinksList");

const marketingEmptyState =
    document.getElementById("marketingEmptyState");


/* =========================================================
   COMBO MODAL
========================================================= */

const comboModal =
    document.getElementById("comboModal");

const closeModal =
    document.getElementById("closeModal");

const comboForm =
    document.getElementById("comboForm");

const editId =
    document.getElementById("editId");

const modalTitle =
    document.getElementById("modalTitle");

const comboName =
    document.getElementById("comboName");

const comboCategory =
    document.getElementById("comboCategory");

const categoryList =
    document.getElementById("categoryList");

const mainLink =
    document.getElementById("mainLink");

const affiliateLink =
    document.getElementById("affiliateLink");

const comboNotes =
    document.getElementById("comboNotes");

const comboStatus =
    document.getElementById("comboStatus");

const cancelBtn =
    document.getElementById("cancelBtn");


/* =========================================================
   PASTE MODAL
========================================================= */

const pasteModal =
    document.getElementById("pasteModal");

const closePasteModal =
    document.getElementById("closePasteModal");

const pasteBox =
    document.getElementById("pasteBox");

const cancelPasteBtn =
    document.getElementById("cancelPasteBtn");

const importPasteBtn =
    document.getElementById("importPasteBtn");


/* =========================================================
   CATEGORY MODAL
========================================================= */

const categoryModal =
    document.getElementById("categoryModal");

const closeCategoryModal =
    document.getElementById("closeCategoryModal");

const newCategory =
    document.getElementById("newCategory");

const addCategoryBtn =
    document.getElementById("addCategoryBtn");

const categoryListView =
    document.getElementById("categoryListView");


/* =========================================================
   HELP MODAL
========================================================= */

const helpModal =
    document.getElementById("helpModal");

const closeHelpModal =
    document.getElementById("closeHelpModal");


/* =========================================================
   AUTH SCREEN CONTROL
========================================================= */

function bootApp() {

    document.body.classList.add(
        "auth-booting"
    );

    if (loginScreen) {
        loginScreen.classList.add(
            "hidden"
        );
    }

    if (appShell) {
        appShell.classList.add(
            "app-shell-hidden"
        );
    }
}


function showLogin() {

    document.body.classList.remove(
        "auth-booting"
    );

    if (loginScreen) {
        loginScreen.classList.remove(
            "hidden"
        );
    }

    if (appShell) {
        appShell.classList.add(
            "app-shell-hidden"
        );
    }

    if (loginMessage) {
        loginMessage.textContent = "";
        loginMessage.className =
            "login-message";
    }
}


function showDashboard() {

    document.body.classList.remove(
        "auth-booting"
    );

    if (loginScreen) {
        loginScreen.classList.add(
            "hidden"
        );
    }

    if (appShell) {
        appShell.classList.remove(
            "app-shell-hidden"
        );
    }

    if (
        adminEmailDisplay &&
        currentUser
    ) {
        adminEmailDisplay.textContent =
            currentUser.email ||
            ADMIN_EMAIL;
    }
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   URL VALIDATION
========================================================= */

function isValidHttpUrl(value) {

    try {

        const url =
            new URL(value);

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );

    } catch (error) {

        return false;
    }
}


/* =========================================================
   MARKETING LINK HELPERS
========================================================= */

function getMarketingTarget(combo) {

    if (!combo) {
        return "";
    }

    const affiliate =
        String(
            combo.affiliateLink || ""
        ).trim();

    const main =
        String(
            combo.mainLink || ""
        ).trim();

    if (
        affiliate &&
        isValidHttpUrl(affiliate)
    ) {
        return affiliate;
    }

    if (
        main &&
        isValidHttpUrl(main)
    ) {
        return main;
    }

    return "";
}


function buildMarketingUrl(id) {

    const goUrl =
        new URL(
            "go.html",
            window.location.href
        );

    goUrl.searchParams.set(
        "id",
        id
    );

    return goUrl.toString();
}


/* =========================================================
   MARKETING STATUS
========================================================= */

function getMarketingStatus(link) {

    if (!link) {
        return "Active";
    }

    return (
        link.status ||
        "Active"
    );
}


function getMarketingStatusClass(status) {

    return String(
        status || "Active"
    )
        .toLowerCase()
        .replace(/\s+/g, "-");
}


/* =========================================================
   DISPLAY HELPERS
========================================================= */

function shortenUrl(
    url,
    maxLength = 75
) {

    const value =
        String(url || "");

    if (
        value.length <=
        maxLength
    ) {
        return value;
    }

    return (
        value.slice(
            0,
            maxLength
        ) +
        "..."
    );
}


function truncateText(
    value,
    maxLength = 90
) {

    const text =
        String(value || "");

    if (
        text.length <=
        maxLength
    ) {
        return text;
    }

    return (
        text.slice(
            0,
            maxLength
        ) +
        "…"
    );
}


function getTimeValue(value) {

    if (!value) {
        return 0;
    }

    if (
        typeof value === "object" &&
        typeof value.toDate === "function"
    ) {

        return value
            .toDate()
            .getTime();
    }

    if (
        value instanceof Date
    ) {

        return value.getTime();
    }

    const parsed =
        new Date(value).getTime();

    return Number.isNaN(parsed)
        ? 0
        : parsed;
}


/* =========================================================
   DASHBOARD MARKETING STATS
========================================================= */

function updateMarketingStats() {

    const links =
        Object.values(
            marketingLinks
        );

    const totalLinks =
        links.length;

    const totalClicks =
        links.reduce(
            function(total, link) {

                return (
                    total +
                    (
                        Number(
                            link?.clicks
                        ) || 0
                    )
                );
            },
            0
        );

    if (totalMarketingCount) {

        totalMarketingCount.textContent =
            totalLinks;
    }

    if (totalClicksCount) {

        totalClicksCount.textContent =
            totalClicks;
    }
}


/* =========================================================
   MODALS
========================================================= */

function openComboModal(combo = null) {

    if (!comboModal) {
        return;
    }

    if (combo) {

        modalTitle.textContent =
            "Edit Combo";

        editId.value =
            combo.id || "";

        comboName.value =
            combo.name || "";

        comboCategory.value =
            combo.category || "";

        mainLink.value =
            combo.mainLink || "";

        affiliateLink.value =
            combo.affiliateLink || "";

        comboNotes.value =
            combo.notes || "";

        comboStatus.value =
            combo.status ||
            "Active";

    } else {

        modalTitle.textContent =
            "Add Combo";

        editId.value = "";

        comboForm.reset();

        comboStatus.value =
            "Active";
    }

    renderCategoryOptions();

    comboModal.classList.remove(
        "hidden"
    );
}


function closeComboModal() {

    if (comboModal) {

        comboModal.classList.add(
            "hidden"
        );
    }
}


function openPasteModal() {

    if (!pasteModal) {
        return;
    }

    pasteBox.value = "";

    pasteModal.classList.remove(
        "hidden"
    );
}


function closePaste() {

    if (pasteModal) {

        pasteModal.classList.add(
            "hidden"
        );
    }
}


function openCategoryModal() {

    if (!categoryModal) {
        return;
    }

    renderCategoryList();

    categoryModal.classList.remove(
        "hidden"
    );
}


function closeCategory() {

    if (categoryModal) {

        categoryModal.classList.add(
            "hidden"
        );
    }
}


function openHelpModal() {

    if (helpModal) {

        helpModal.classList.remove(
            "hidden"
        );
    }
}


function closeHelp() {

    if (helpModal) {

        helpModal.classList.add(
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
        async function(event) {

            event.preventDefault();

            const email =
                loginEmail.value.trim();

            const password =
                loginPassword.value;

            if (
                !email ||
                !password
            ) {

                loginMessage.textContent =
                    "Email اور Password دونوں درج کریں۔";

                loginMessage.className =
                    "login-message error";

                return;
            }

            loginMessage.textContent =
                "Login ہو رہا ہے...";

            loginMessage.className =
                "login-message loading";

            const submitButton =
                loginForm.querySelector(
                    "button[type='submit']"
                );

            if (submitButton) {
                submitButton.disabled =
                    true;
            }

            try {

                const credential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                const isAdmin =
                    await checkAdmin(
                        credential.user
                    );

                if (!isAdmin) {

                    await signOut(auth);

                    loginMessage.textContent =
                        "یہ اکاؤنٹ Admin نہیں ہے۔";

                    loginMessage.className =
                        "login-message error";

                    return;
                }

                loginMessage.textContent =
                    "Login کامیاب۔";

                loginMessage.className =
                    "login-message success";

            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );

                let message =
                    "Login ناکام ہوا۔ Email یا Password چیک کریں۔";

                if (
                    error.code ===
                        "auth/invalid-credential" ||
                    error.code ===
                        "auth/wrong-password" ||
                    error.code ===
                        "auth/user-not-found"
                ) {

                    message =
                        "Email یا Password غلط ہے۔";
                }

                if (
                    error.code ===
                    "auth/too-many-requests"
                ) {

                    message =
                        "کئی کوششیں ہو چکی ہیں۔ کچھ دیر بعد دوبارہ کوشش کریں۔";
                }

                loginMessage.textContent =
                    message;

                loginMessage.className =
                    "login-message error";

            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;
                }
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
        async function() {

            try {

                await signOut(auth);

            } catch (error) {

                console.error(
                    "Logout Error:",
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

    const userRef =
        doc(
            db,
            "users",
            user.uid
        );

    const userSnap =
        await getDoc(
            userRef
        );

    if (
        !userSnap.exists()
    ) {
        return false;
    }

    const data =
        userSnap.data();

    return (
        data.role ===
        "admin"
    );
}


/* =========================================================
   AUTH STATE
========================================================= */

bootApp();

onAuthStateChanged(
    auth,
    async function(user) {

        if (!user) {

            currentUser = null;

            showLogin();

            return;
        }

        try {

            const isAdmin =
                await checkAdmin(
                    user
                );

            if (!isAdmin) {

                await signOut(auth);

                currentUser = null;

                showLogin();

                return;
            }

            currentUser =
                user;

            showDashboard();

            await loadFirebaseData();

        } catch (error) {

            console.error(
                "Authentication verification error:",
                error
            );

            await signOut(auth);

            currentUser = null;

            showLogin();
        }
    }
);


/* =========================================================
   FIRESTORE - LOAD COMBOS
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
                function(item) {

                    return {
                        id:
                            item.id,

                        ...item.data()
                    };
                }
            );

    } catch (error) {

        console.error(
            "Load Combos Error:",
            error
        );

        combos = [];
    }
}


/* =========================================================
   FIRESTORE - LOAD CATEGORIES
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
                function(item) {

                    return {
                        id:
                            item.id,

                        ...item.data()
                    };
                }
            );

        if (
            !categories.length
        ) {

            categories =
                DEFAULT_CATEGORIES.map(
                    function(name) {

                        return {
                            id:
                                name.toLowerCase(),

                            name:
                                name
                        };
                    }
                );
        }

    } catch (error) {

        console.error(
            "Load Categories Error:",
            error
        );

        categories =
            DEFAULT_CATEGORIES.map(
                function(name) {

                    return {
                        id:
                            name.toLowerCase(),

                        name:
                            name
                    };
                }
            );
    }
}


/* =========================================================
   FIRESTORE - LOAD MARKETING LINKS
========================================================= */

async function loadMarketingLinks() {

    marketingLinks = {};

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "marketingLinks"
                )
            );

        snapshot.docs.forEach(
            function(item) {

                marketingLinks[
                    item.id
                ] = {
                    id:
                        item.id,

                    ...item.data()
                };
            }
        );

    } catch (error) {

        console.error(
            "Load Marketing Links Error:",
            error
        );

        marketingLinks = {};
    }
}


/* =========================================================
   LOAD ALL FIREBASE DATA
========================================================= */

async function loadFirebaseData() {

    await Promise.all([
        loadCombos(),
        loadCategories(),
        loadMarketingLinks()
    ]);

    renderCategoryOptions();
    renderCategoryFilter();
    renderCategoryList();

    render();
    renderMarketingLinks();
}


/* =========================================================
   ADD / SAVE COMBO
========================================================= */

if (comboForm) {

    comboForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const name =
                comboName.value.trim();

            const category =
                comboCategory.value.trim();

            const main =
                mainLink.value.trim();

            const affiliate =
                affiliateLink.value.trim();

            const notes =
                comboNotes.value.trim();

            const status =
                comboStatus.value ||
                "Active";

            if (!name) {

                alert(
                    "Combo Name ضروری ہے۔"
                );

                return;
            }

            const existingId =
                editId.value.trim();

            try {

                if (existingId) {

                    const comboRef =
                        doc(
                            db,
                            "combos",
                            existingId
                        );

                    await updateDoc(
                        comboRef,
                        {
                            name:
                                name,

                            category:
                                category,

                            mainLink:
                                main,

                            affiliateLink:
                                affiliate,

                            notes:
                                notes,

                            status:
                                status,

                            updatedAt:
                                serverTimestamp()
                        }
                    );

                    const index =
                        combos.findIndex(
                            item =>
                                item.id ===
                                existingId
                        );

                    if (
                        index !== -1
                    ) {

                        combos[index] = {
                            ...combos[index],

                            name:
                                name,

                            category:
                                category,

                            mainLink:
                                main,

                            affiliateLink:
                                affiliate,

                            notes:
                                notes,

                            status:
                                status
                        };
                    }


                    /* =========================================
                       EXISTING MARKETING LINK SYNC
                    ========================================= */

                    if (
                        marketingLinks[
                            existingId
                        ]
                    ) {

                        const updatedCombo = {
                            id:
                                existingId,

                            name:
                                name,

                            category:
                                category,

                            mainLink:
                                main,

                            affiliateLink:
                                affiliate,

                            notes:
                                notes,

                            status:
                                status
                        };

                        const newTarget =
                            getMarketingTarget(
                                updatedCombo
                            );

                        const linkRef =
                            doc(
                                db,
                                "marketingLinks",
                                existingId
                            );

                        const publicRef =
                            doc(
                                db,
                                "publicRedirects",
                                existingId
                            );

                        const existingLink =
                            marketingLinks[
                                existingId
                            ];

                        await updateDoc(
                            linkRef,
                            {
                                comboName:
                                    name,

                                targetUrl:
                                    newTarget ||
                                    existingLink.targetUrl ||
                                    "",

                                updatedAt:
                                    serverTimestamp()
                            }
                        );


                        /*
                           Always make sure the public
                           redirect exists and is synced.
                        */

                        await setDoc(
                            publicRef,
                            {
                                targetUrl:
                                    newTarget ||
                                    existingLink.targetUrl ||
                                    "",

                                status:
                                    existingLink.status ||
                                    "Active",

                                updatedAt:
                                    serverTimestamp()
                            },
                            {
                                merge:
                                    true
                            }
                        );


                        marketingLinks[
                            existingId
                        ] = {
                            ...existingLink,

                            comboName:
                                name,

                            targetUrl:
                                newTarget ||
                                existingLink.targetUrl ||
                                "",

                            updatedAt:
                                new Date()
                        };
                    }

                } else {

                    const newCombo = {

                        name:
                            name,

                        category:
                            category,

                        mainLink:
                            main,

                        affiliateLink:
                            affiliate,

                        notes:
                            notes,

                        status:
                            status,

                        createdAt:
                            serverTimestamp(),

                        updatedAt:
                            serverTimestamp()
                    };

                    const created =
                        await addDoc(
                            collection(
                                db,
                                "combos"
                            ),
                            newCombo
                        );

                    combos.push({

                        id:
                            created.id,

                        ...newCombo,

                        createdAt:
                            new Date(),

                        updatedAt:
                            new Date()
                    });
                }

                closeComboModal();

                render();
                renderMarketingLinks();

            } catch (error) {

                console.error(
                    "Save Combo Error:",
                    error
                );

                alert(
                    "Combo save نہیں ہو سکا۔"
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
            item =>
                item.id === id
        );

    if (!combo) {
        return;
    }

    openComboModal(combo);
}


/* =========================================================
   DELETE COMBO
========================================================= */

async function deleteCombo(id) {

    const combo =
        combos.find(
            item =>
                item.id === id
        );

    if (!combo) {
        return;
    }

    const confirmed =
        confirm(
            `"${combo.name}" کو delete کرنا ہے؟`
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


        try {

            await deleteDoc(
                doc(
                    db,
                    "publicRedirects",
                    id
                )
            );

        } catch (publicDeleteError) {

            console.warn(
                "Public Redirect Delete Warning:",
                publicDeleteError
            );
        }


        combos =
            combos.filter(
                item =>
                    item.id !== id
            );

        /*
           Local marketing link remove کریں۔
           Firestore marketingLinks history محفوظ رہ سکتی ہے۔
        */

        delete marketingLinks[id];

        render();
        renderMarketingLinks();

    } catch (error) {

        console.error(
            "Delete Combo Error:",
            error
        );

        alert(
            "Combo delete نہیں ہو سکا۔"
        );
    }
}


/* =========================================================
   ARCHIVE / RESTORE COMBO
========================================================= */

async function archiveCombo(id) {

    const combo =
        combos.find(
            item =>
                item.id === id
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

        combo.status =
            newStatus;


        if (
            marketingLinks[id]
        ) {

            await updateDoc(
                doc(
                    db,
                    "marketingLinks",
                    id
                ),
                {
                    status:
                        newStatus,

                    updatedAt:
                        serverTimestamp()
                }
            );


            await setDoc(
                doc(
                    db,
                    "publicRedirects",
                    id
                ),
                {
                    status:
                        newStatus,

                    updatedAt:
                        serverTimestamp()
                },
                {
                    merge:
                        true
                }
            );


            marketingLinks[id].status =
                newStatus;
        }

        render();
        renderMarketingLinks();

    } catch (error) {

        console.error(
            "Archive Error:",
            error
        );

        alert(
            "Status update نہیں ہو سکا۔"
        );
    }
}


/* =========================================================
   PASTE / IMPORT COMBOS
========================================================= */

if (importPasteBtn) {

    importPasteBtn.addEventListener(
        "click",
        async function() {

            const raw =
                pasteBox.value.trim();

            if (!raw) {

                alert(
                    "Paste box خالی ہے۔"
                );

                return;
            }

            let data;

            try {

                data =
                    JSON.parse(raw);

            } catch (error) {

                alert(
                    "JSON format درست نہیں ہے۔"
                );

                return;
            }

            let items =
                data;

            if (
                !Array.isArray(items)
            ) {

                if (
                    data &&
                    Array.isArray(
                        data.combos
                    )
                ) {

                    items =
                        data.combos;

                } else {

                    items =
                        [data];
                }
            }

            let imported = 0;

            try {

                for (
                    const item of items
                ) {

                    if (
                        !item ||
                        typeof item !==
                        "object"
                    ) {
                        continue;
                    }

                    const newCombo = {

                        name:
                            String(
                                item.name ||
                                ""
                            ).trim(),

                        category:
                            String(
                                item.category ||
                                "Other"
                            ).trim(),

                        mainLink:
                            String(
                                item.mainLink ||
                                item.main_link ||
                                ""
                            ).trim(),

                        affiliateLink:
                            String(
                                item.affiliateLink ||
                                item.affiliate_link ||
                                ""
                            ).trim(),

                        notes:
                            String(
                                item.notes ||
                                item.description ||
                                ""
                            ).trim(),

                        status:
                            String(
                                item.status ||
                                "Active"
                            ).trim(),

                        createdAt:
                            serverTimestamp(),

                        updatedAt:
                            serverTimestamp()
                    };

                    if (
                        !newCombo.name
                    ) {
                        continue;
                    }

                    const created =
                        await addDoc(
                            collection(
                                db,
                                "combos"
                            ),
                            newCombo
                        );

                    combos.push({

                        id:
                            created.id,

                        ...newCombo,

                        createdAt:
                            new Date(),

                        updatedAt:
                            new Date()
                    });

                    imported++;
                }

                closePaste();

                render();
                renderMarketingLinks();

                alert(
                    `${imported} Combo import ہو گئے۔`
                );

            } catch (error) {

                console.error(
                    "Import Error:",
                    error
                );

                alert(
                    "Import کے دوران مسئلہ آیا۔"
                );
            }
        }
    );
}


/* =========================================================
   CATEGORY OPTIONS
========================================================= */

function renderCategoryOptions() {

    if (
        !comboCategory ||
        !categoryList
    ) {
        return;
    }

    const current =
        comboCategory.value;

    comboCategory.innerHTML =
        "";

    const emptyOption =
        document.createElement(
            "option"
        );

    emptyOption.value =
        "";

    emptyOption.textContent =
        "Select Category";

    comboCategory.appendChild(
        emptyOption
    );

    categories
        .slice()
        .sort(
            (a, b) =>
                String(a.name)
                    .localeCompare(
                        String(b.name)
                    )
        )
        .forEach(
            function(category) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    category.name;

                option.textContent =
                    category.name;

                comboCategory.appendChild(
                    option
                );
            }
        );

    if (current) {

        comboCategory.value =
            current;
    }

    categoryList.innerHTML =
        categories
            .map(
                function(category) {

                    return `
                        <option value="${escapeHTML(
                            category.name
                        )}">
                        `;
                }
            )
            .join("");
}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function renderCategoryFilter() {

    if (!categoryFilter) {
        return;
    }

    const current =
        categoryFilter.value;

    categoryFilter.innerHTML =
        `<option value="">All Categories</option>`;

    categories
        .slice()
        .sort(
            (a, b) =>
                String(a.name)
                    .localeCompare(
                        String(b.name)
                    )
        )
        .forEach(
            function(category) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    category.name;

                option.textContent =
                    category.name;

                categoryFilter.appendChild(
                    option
                );
            }
        );

    if (current) {

        categoryFilter.value =
            current;
    }
}


/* =========================================================
   CATEGORY LIST
========================================================= */

function renderCategoryList() {

    if (!categoryListView) {
        return;
    }

    if (
        !categories.length
    ) {

        categoryListView.innerHTML =
            `<div class="empty-state">No categories.</div>`;

        return;
    }

    categoryListView.innerHTML =
        categories
            .slice()
            .sort(
                (a, b) =>
                    String(a.name)
                        .localeCompare(
                            String(b.name)
                        )
            )
            .map(
                function(category) {

                    return `
                        <div class="category-item">

                            <span>
                                ${escapeHTML(
                                    category.name
                                )}
                            </span>

                            <button
                                type="button"
                                class="btn danger"
                                onclick="removeCategory('${escapeHTML(
                                    category.id
                                )}')"
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
   ADD CATEGORY
========================================================= */

if (addCategoryBtn) {

    addCategoryBtn.addEventListener(
        "click",
        async function() {

            const name =
                newCategory.value.trim();

            if (!name) {

                alert(
                    "Category name درج کریں۔"
                );

                return;
            }

            const exists =
                categories.some(
                    item =>
                        String(
                            item.name
                        ).toLowerCase() ===
                        name.toLowerCase()
                );

            if (exists) {

                alert(
                    "یہ category پہلے سے موجود ہے۔"
                );

                return;
            }

            try {

                const categoryId =
                    name
                        .toLowerCase()
                        .replace(
                            /[^a-z0-9]+/g,
                            "-"
                        )
                        .replace(
                            /^-+|-+$/g,
                            ""
                        )
                        .slice(
                            0,
                            100
                        ) ||
                    `category-${Date.now()}`;

                const categoryRef =
                    doc(
                        db,
                        "categories",
                        categoryId
                    );

                await setDoc(
                    categoryRef,
                    {
                        name:
                            name,

                        createdAt:
                            serverTimestamp()
                    }
                );

                categories.push({

                    id:
                        categoryId,

                    name:
                        name
                });

                newCategory.value =
                    "";

                renderCategoryOptions();
                renderCategoryFilter();
                renderCategoryList();
                render();

            } catch (error) {

                console.error(
                    "Add Category Error:",
                    error
                );

                alert(
                    "Category add نہیں ہو سکی۔"
                );
            }
        }
    );
}


/* =========================================================
   DELETE CATEGORY
========================================================= */

async function removeCategory(id) {

    const category =
        categories.find(
            item =>
                item.id === id
        );

    if (!category) {
        return;
    }

    const used =
        combos.some(
            combo =>
                String(
                    combo.category || ""
                ).toLowerCase() ===
                String(
                    category.name || ""
                ).toLowerCase()
        );

    if (used) {

        alert(
            "یہ category ایک یا زیادہ Combos میں استعمال ہو رہی ہے، پہلے Combo کی category تبدیل کریں۔"
        );

        return;
    }

    const confirmed =
        confirm(
            `"${category.name}" category delete کرنی ہے؟`
        );

    if (!confirmed) {
        return;
    }

    try {

        await deleteDoc(
            doc(
                db,
                "categories",
                id
            )
        );

        categories =
            categories.filter(
                item =>
                    item.id !== id
            );

        renderCategoryOptions();
        renderCategoryFilter();
        renderCategoryList();
        render();

    } catch (error) {

        console.error(
            "Delete Category Error:",
            error
        );

        alert(
            "Category delete نہیں ہو سکی۔"
        );
    }
}


/* =========================================================
   CREATE / UPDATE MARKETING LINK
========================================================= */

async function createMarketingLink(id) {

    const combo =
        combos.find(
            item =>
                item.id === id
        );

    if (!combo) {

        alert(
            "Combo نہیں ملا۔"
        );

        return;
    }

    const target =
        getMarketingTarget(
            combo
        );

    if (!target) {

        alert(
            "Marketing Link بنانے کے لیے پہلے Affiliate Link یا Main Link درج کریں۔"
        );

        return;
    }

    try {

        const linkRef =
            doc(
                db,
                "marketingLinks",
                id
            );

        const publicRef =
            doc(
                db,
                "publicRedirects",
                id
            );

        const existing =
            await getDoc(
                linkRef
            );

        const existingData =
            existing.exists()
                ? existing.data()
                : {};

        const oldClicks =
            typeof existingData.clicks ===
            "number"
                ? existingData.clicks
                : 0;

        const oldStatus =
            existingData.status ||
            combo.status ||
            "Active";


        /* ==============================================
           PRIVATE MARKETING LINK
        ============================================== */

        await setDoc(
            linkRef,
            {
                comboId:
                    id,

                comboName:
                    combo.name || "",

                targetUrl:
                    target,

                clicks:
                    oldClicks,

                status:
                    oldStatus,

                createdAt:
                    existingData.createdAt ||
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp()
            },
            {
                merge:
                    true
            }
        );


        /* ==============================================
           PUBLIC REDIRECT MAP
        ============================================== */

        await setDoc(
            publicRef,
            {
                targetUrl:
                    target,

                status:
                    oldStatus,

                updatedAt:
                    serverTimestamp()
            },
            {
                merge:
                    true
            }
        );


        marketingLinks[id] = {

            id:
                id,

            comboId:
                id,

            comboName:
                combo.name || "",

            targetUrl:
                target,

            clicks:
                oldClicks,

            status:
                oldStatus,

            createdAt:
                existingData.createdAt,

            updatedAt:
                new Date()
        };


        const publicUrl =
            buildMarketingUrl(
                id
            );


        try {

            await navigator.clipboard.writeText(
                publicUrl
            );

            alert(
                "Marketing Link تیار ہو گیا اور Clipboard میں Copy ہو گیا۔"
            );

        } catch (clipboardError) {

            window.prompt(
                "Marketing Link:",
                publicUrl
            );
        }

        render();
        renderMarketingLinks();

    } catch (error) {

        console.error(
            "Create Marketing Link Error:",
            error
        );

        alert(
            "Marketing Link create نہیں ہو سکا۔"
        );
    }
}


/* =========================================================
   COPY MARKETING LINK
========================================================= */

async function copyMarketingLink(id) {

    const link =
        marketingLinks[id];

    if (!link) {

        alert(
            "Marketing Link موجود نہیں ہے۔"
        );

        return;
    }

    const publicUrl =
        buildMarketingUrl(id);

    try {

        await navigator.clipboard.writeText(
            publicUrl
        );

        alert(
            "Marketing Link Copy ہو گیا۔"
        );

    } catch (error) {

        window.prompt(
            "Marketing Link:",
            publicUrl
        );
    }
}


/* =========================================================
   OPEN MARKETING LINK
========================================================= */

function openMarketingLink(id) {

    const link =
        marketingLinks[id];

    if (!link) {

        alert(
            "Marketing Link پہلے Create کریں۔"
        );

        return;
    }

    const publicUrl =
        buildMarketingUrl(id);

    window.open(
        publicUrl,
        "_blank"
    );
}


/* =========================================================
   UPDATE MARKETING LINK STATUS
========================================================= */

async function updateMarketingLinkStatus(
    id,
    newStatus
) {

    const link =
        marketingLinks[id];

    if (!link) {

        alert(
            "Marketing Link موجود نہیں ہے۔"
        );

        return;
    }

    const allowedStatuses = [
        "Active",
        "Paused",
        "Archived"
    ];

    if (
        !allowedStatuses.includes(
            newStatus
        )
    ) {
        return;
    }

    try {

        await updateDoc(
            doc(
                db,
                "marketingLinks",
                id
            ),
            {
                status:
                    newStatus,

                updatedAt:
                    serverTimestamp()
            }
        );


        await setDoc(
            doc(
                db,
                "publicRedirects",
                id
            ),
            {
                status:
                    newStatus,

                updatedAt:
                    serverTimestamp()
            },
            {
                merge:
                    true
            }
        );


        marketingLinks[id] = {
            ...marketingLinks[id],

            status:
                newStatus,

            updatedAt:
                new Date()
        };

        renderMarketingLinks();
        render();

    } catch (error) {

        console.error(
            "Marketing Link Status Error:",
            error
        );

        alert(
            "Marketing Link status update نہیں ہو سکا۔"
        );
    }
}


/* =========================================================
   DELETE MARKETING LINK
========================================================= */

async function deleteMarketingLink(id) {

    const link =
        marketingLinks[id];

    if (!link) {
        return;
    }

    const confirmed =
        confirm(
            `"${link.comboName || "Marketing Link"}" کا Marketing Link delete کرنا ہے؟`
        );

    if (!confirmed) {
        return;
    }

    try {

        await deleteDoc(
            doc(
                db,
                "marketingLinks",
                id
            )
        );


        /*
           اگر public redirect پہلے ہی موجود نہ ہو
           تو private link delete پھر بھی successful
           سمجھا جائے گا۔
        */

        try {

            await deleteDoc(
                doc(
                    db,
                    "publicRedirects",
                    id
                )
            );

        } catch (publicDeleteError) {

            console.warn(
                "Public Redirect Delete Warning:",
                publicDeleteError
            );
        }


        delete marketingLinks[id];

        renderMarketingLinks();
        render();

    } catch (error) {

        console.error(
            "Delete Marketing Link Error:",
            error
        );

        alert(
            "Marketing Link delete نہیں ہو سکا۔"
        );
    }
}


/* =========================================================
   MARKETING LINKS CONTROL RENDER
========================================================= */

function renderMarketingLinks() {

    updateMarketingStats();

    if (!marketingLinksList) {
        return;
    }

    const links =
        Object.values(
            marketingLinks
        )
            .sort(
                function(a, b) {

                    return (
                        getTimeValue(
                            b.updatedAt
                        ) -
                        getTimeValue(
                            a.updatedAt
                        )
                    );
                }
            );

    if (!links.length) {

        marketingLinksList.innerHTML =
            "";

        if (
            marketingEmptyState
        ) {

            marketingEmptyState.classList.remove(
                "hidden"
            );
        }

        return;
    }

    if (
        marketingEmptyState
    ) {

        marketingEmptyState.classList.add(
            "hidden"
        );
    }

    marketingLinksList.innerHTML =
        links
            .map(
                createMarketingLinkHTML
            )
            .join("");
}


/* =========================================================
   MARKETING LINK CONTROL HTML
========================================================= */

function createMarketingLinkHTML(link) {

    const id =
        link.id;

    const combo =
        combos.find(
            item =>
                item.id === id
        );

    const comboName =
        link.comboName ||
        combo?.name ||
        "Unknown Combo";

    const clicks =
        typeof link.clicks ===
        "number"
            ? link.clicks
            : 0;

    const status =
        getMarketingStatus(link);

    const statusClass =
        getMarketingStatusClass(status);

    const target =
        link.targetUrl ||
        getMarketingTarget(combo);

    const publicUrl =
        buildMarketingUrl(id);

    let statusAction = "";

    if (
        status === "Active"
    ) {

        statusAction = `
            <button
                type="button"
                class="btn"
                onclick="updateMarketingLinkStatus(
                    '${escapeHTML(id)}',
                    'Paused'
                )"
            >
                Pause
            </button>
        `;

    } else if (
        status === "Paused"
    ) {

        statusAction = `
            <button
                type="button"
                class="btn"
                onclick="updateMarketingLinkStatus(
                    '${escapeHTML(id)}',
                    'Active'
                )"
            >
                Activate
            </button>

            <button
                type="button"
                class="btn"
                onclick="updateMarketingLinkStatus(
                    '${escapeHTML(id)}',
                    'Archived'
                )"
            >
                Archive
            </button>
        `;

    } else {

        statusAction = `
            <button
                type="button"
                class="btn"
                onclick="updateMarketingLinkStatus(
                    '${escapeHTML(id)}',
                    'Active'
                )"
            >
                Restore
            </button>
        `;
    }

    return `
        <article class="combo">

            <div>

                <h4>
                    ${escapeHTML(
                        comboName
                    )}
                </h4>

                <div class="meta">

                    <span class="tag">
                        Marketing Link
                    </span>

                    <span class="tag ${escapeHTML(
                        statusClass
                    )}">
                        ${escapeHTML(
                            status
                        )}
                    </span>

                    <span class="tag">
                        Clicks: ${clicks}
                    </span>

                </div>

                ${
                    combo?.category
                        ? `
                            <div class="notes">
                                Category:
                                ${escapeHTML(
                                    combo.category
                                )}
                            </div>
                        `
                        : ""
                }

                ${
                    target
                        ? `
                            <div class="notes">
                                Target:
                                ${escapeHTML(
                                    shortenUrl(
                                        target
                                    )
                                )}
                            </div>
                        `
                        : `
                            <div class="notes">
                                Target URL موجود نہیں ہے۔
                            </div>
                        `
                }

                <div class="notes">
                    Public Link:
                    ${escapeHTML(
                        truncateText(
                            publicUrl,
                            120
                        )
                    )}
                </div>

            </div>


            <div class="actions">

                <button
                    type="button"
                    class="btn"
                    onclick="copyMarketingLink(
                        '${escapeHTML(id)}'
                    )"
                >
                    Copy
                </button>

                <button
                    type="button"
                    class="btn"
                    onclick="openMarketingLink(
                        '${escapeHTML(id)}'
                    )"
                >
                    Open
                </button>

                <button
                    type="button"
                    class="btn"
                    onclick="createMarketingLink(
                        '${escapeHTML(id)}'
                    )"
                >
                    Update
                </button>

                ${statusAction}

                <button
                    type="button"
                    class="btn danger"
                    onclick="deleteMarketingLink(
                        '${escapeHTML(id)}'
                    )"
                >
                    Delete
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   REFRESH MARKETING LINKS
========================================================= */

async function refreshMarketingLinks() {

    if (
        refreshMarketingBtn
    ) {

        refreshMarketingBtn.disabled =
            true;

        refreshMarketingBtn.textContent =
            "Refreshing...";
    }

    try {

        await loadMarketingLinks();

        renderMarketingLinks();

        render();

    } catch (error) {

        console.error(
            "Refresh Marketing Links Error:",
            error
        );

        alert(
            "Marketing Links refresh نہیں ہو سکے۔"
        );

    } finally {

        if (
            refreshMarketingBtn
        ) {

            refreshMarketingBtn.disabled =
                false;

            refreshMarketingBtn.textContent =
                "Refresh Links";
        }
    }
}


if (
    refreshMarketingBtn
) {

    refreshMarketingBtn.addEventListener(
        "click",
        refreshMarketingLinks
    );
}


/* =========================================================
   RENDER COMBOS
========================================================= */

function render() {

    const search =
        String(
            searchInput?.value ||
            ""
        )
            .trim()
            .toLowerCase();

    const category =
        String(
            categoryFilter?.value ||
            ""
        );

    const status =
        String(
            statusFilter?.value ||
            ""
        );

    const filtered =
        combos
            .filter(
                function(combo) {

                    if (search) {

                        const text =
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

                        if (
                            !text.includes(
                                search
                            )
                        ) {
                            return false;
                        }
                    }

                    if (
                        category &&
                        combo.category !==
                        category
                    ) {

                        return false;
                    }

                    if (
                        status &&
                        combo.status !==
                        status
                    ) {

                        return false;
                    }

                    return true;
                }
            )
            .sort(
                function(a, b) {

                    return (
                        getTimeValue(
                            b.updatedAt
                        ) -
                        getTimeValue(
                            a.updatedAt
                        )
                    );
                }
            );


    /* =====================================================
       COUNTS
    ===================================================== */

    const total =
        combos.length;

    const active =
        combos.filter(
            item =>
                item.status ===
                "Active"
        ).length;

    const pending =
        combos.filter(
            item =>
                item.status ===
                "Pending"
        ).length;

    const archived =
        combos.filter(
            item =>
                item.status ===
                "Archived"
        ).length;


    if (totalCount) {

        totalCount.textContent =
            total;
    }

    if (activeCount) {

        activeCount.textContent =
            active;
    }

    if (pendingCount) {

        pendingCount.textContent =
            pending;
    }

    if (archivedCount) {

        archivedCount.textContent =
            archived;
    }


    updateMarketingStats();


    if (resultCount) {

        resultCount.textContent =
            `${filtered.length} result${
                filtered.length === 1
                    ? ""
                    : "s"
            }`;
    }


    /* =====================================================
       EMPTY / LIST
    ===================================================== */

    if (!comboList) {
        return;
    }

    if (
        !filtered.length
    ) {

        comboList.innerHTML =
            "";

        if (emptyState) {

            emptyState.classList.remove(
                "hidden"
            );
        }

        return;
    }

    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );
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

    const marketing =
        marketingLinks[
            combo.id
        ];

    const clicks =
        marketing &&
        typeof marketing.clicks ===
        "number"
            ? marketing.clicks
            : 0;

    const hasMarketing =
        Boolean(
            marketing
        );

    const marketingUrl =
        hasMarketing
            ? buildMarketingUrl(
                combo.id
            )
            : "";

    const statusClass =
        String(
            combo.status ||
            "Active"
        )
            .toLowerCase()
            .replace(
                /\s+/g,
                "-"
            );

    return `
        <article class="combo-card">

            <div class="combo-card-header">

                <div>

                    <h3>
                        ${escapeHTML(
                            combo.name ||
                            "Untitled Combo"
                        )}
                    </h3>

                    <div class="tags">

                        <span class="tag">
                            ${escapeHTML(
                                combo.category ||
                                "Other"
                            )}
                        </span>

                        <span class="tag ${escapeHTML(
                            statusClass
                        )}">
                            ${escapeHTML(
                                combo.status ||
                                "Active"
                            )}
                        </span>

                    </div>

                </div>

            </div>


            ${
                combo.notes
                    ? `
                        <div class="combo-notes">
                            ${escapeHTML(
                                combo.notes
                            )}
                        </div>
                    `
                    : ""
            }


            <div class="combo-links">

                ${
                    combo.mainLink
                        ? `
                            <a
                                href="${escapeHTML(
                                    combo.mainLink
                                )}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Main Link
                            </a>
                        `
                        : ""
                }


                ${
                    combo.affiliateLink
                        ? `
                            <a
                                href="${escapeHTML(
                                    combo.affiliateLink
                                )}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Affiliate Link
                            </a>
                        `
                        : ""
                }

            </div>


            <div class="marketing-box">

                <div class="section-heading">

                    <strong>
                        Marketing Link
                    </strong>

                    ${
                        hasMarketing
                            ? `
                                <span class="tag">
                                    Clicks: ${clicks}
                                </span>
                            `
                            : `
                                <span class="tag">
                                    Not Created
                                </span>
                            `
                    }

                </div>


                <div class="actions">

                    ${
                        hasMarketing
                            ? `
                                <button
                                    type="button"
                                    class="btn"
                                    onclick="copyMarketingLink(
                                        '${escapeHTML(
                                            combo.id
                                        )}'
                                    )"
                                >
                                    Copy Link
                                </button>

                                <button
                                    type="button"
                                    class="btn"
                                    onclick="openMarketingLink(
                                        '${escapeHTML(
                                            combo.id
                                        )}'
                                    )"
                                >
                                    Open Link
                                </button>

                                <button
                                    type="button"
                                    class="btn"
                                    onclick="createMarketingLink(
                                        '${escapeHTML(
                                            combo.id
                                        )}'
                                    )"
                                >
                                    Update Link
                                </button>
                            `
                            : `
                                <button
                                    type="button"
                                    class="btn"
                                    onclick="createMarketingLink(
                                        '${escapeHTML(
                                            combo.id
                                        )}'
                                    )"
                                >
                                    Create Marketing Link
                                </button>
                            `
                    }

                </div>


                ${
                    hasMarketing
                        ? `
                            <div class="combo-notes">
                                ${escapeHTML(
                                    marketingUrl
                                )}
                            </div>
                        `
                        : ""
                }

            </div>


            <div class="actions">

                <button
                    type="button"
                    class="btn"
                    onclick="editCombo(
                        '${escapeHTML(
                            combo.id
                        )}'
                    )"
                >
                    Edit
                </button>


                <button
                    type="button"
                    class="btn"
                    onclick="archiveCombo(
                        '${escapeHTML(
                            combo.id
                        )}'
                    )"
                >
                    ${
                        combo.status ===
                        "Archived"
                            ? "Restore"
                            : "Archive"
                    }
                </button>


                <button
                    type="button"
                    class="btn danger"
                    onclick="deleteCombo(
                        '${escapeHTML(
                            combo.id
                        )}'
                    )"
                >
                    Delete
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   SEARCH / FILTER EVENTS
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
   BUTTON EVENTS
========================================================= */

if (addBtn) {

    addBtn.addEventListener(
        "click",
        function() {

            openComboModal();
        }
    );
}


if (emptyAddBtn) {

    emptyAddBtn.addEventListener(
        "click",
        function() {

            openComboModal();
        }
    );
}


if (pasteBtn) {

    pasteBtn.addEventListener(
        "click",
        openPasteModal
    );
}


if (categoryBtn) {

    categoryBtn.addEventListener(
        "click",
        openCategoryModal
    );
}


if (helpBtn) {

    helpBtn.addEventListener(
        "click",
        openHelpModal
    );
}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeComboModal
    );
}


if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        closeComboModal
    );
}


if (closePasteModal) {

    closePasteModal.addEventListener(
        "click",
        closePaste
    );
}


if (cancelPasteBtn) {

    cancelPasteBtn.addEventListener(
        "click",
        closePaste
    );
}


if (closeCategoryModal) {

    closeCategoryModal.addEventListener(
        "click",
        closeCategory
    );
}


if (closeHelpModal) {

    closeHelpModal.addEventListener(
        "click",
        closeHelp
    );
}


/* =========================================================
   CLICK OUTSIDE MODALS
========================================================= */

if (comboModal) {

    comboModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                comboModal
            ) {

                closeComboModal();
            }
        }
    );
}


if (pasteModal) {

    pasteModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                pasteModal
            ) {

                closePaste();
            }
        }
    );
}


if (categoryModal) {

    categoryModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                categoryModal
            ) {

                closeCategory();
            }
        }
    );
}


if (helpModal) {

    helpModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                helpModal
            ) {

                closeHelp();
            }
        }
    );
}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }

        closeComboModal();
        closePaste();
        closeCategory();
        closeHelp();
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

window.createMarketingLink =
    createMarketingLink;

window.copyMarketingLink =
    copyMarketingLink;

window.openMarketingLink =
    openMarketingLink;

window.updateMarketingLinkStatus =
    updateMarketingLinkStatus;

window.deleteMarketingLink =
    deleteMarketingLink;
