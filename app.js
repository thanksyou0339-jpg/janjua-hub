import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

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
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   FIREBASE
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


const app =
    initializeApp(
        firebaseConfig
    );


const auth =
    getAuth(
        app
    );


const db =
    getFirestore(
        app
    );


/* =========================================================
   SETTINGS
========================================================= */

const ADMIN_UID =
    "Va1ERyp4TJR8OVOf0MVjDYPC8hk2";


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

let authInitialized = false;


/* =========================================================
   DOM
========================================================= */

const loginScreen =
    document.getElementById(
        "loginScreen"
    );

const appShell =
    document.getElementById(
        "appShell"
    );

const loginForm =
    document.getElementById(
        "loginForm"
    );

const adminEmail =
    document.getElementById(
        "adminEmail"
    );

const adminPassword =
    document.getElementById(
        "adminPassword"
    );

const loginMessage =
    document.getElementById(
        "loginMessage"
    );

const loginBtn =
    document.getElementById(
        "loginBtn"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


/* =========================================================
   DASHBOARD STATS
========================================================= */

const totalCount =
    document.getElementById(
        "totalCount"
    );

const activeCount =
    document.getElementById(
        "activeCount"
    );

const pendingCount =
    document.getElementById(
        "pendingCount"
    );

const archivedCount =
    document.getElementById(
        "archivedCount"
    );

const totalMarketingCount =
    document.getElementById(
        "totalMarketingCount"
    );

const totalClicksCount =
    document.getElementById(
        "totalClicksCount"
    );


/* =========================================================
   SEARCH / FILTER
========================================================= */

const searchInput =
    document.getElementById(
        "searchInput"
    );

const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );

const statusFilter =
    document.getElementById(
        "statusFilter"
    );

const categoryBtn =
    document.getElementById(
        "categoryBtn"
    );

const resultCount =
    document.getElementById(
        "resultCount"
    );


/* =========================================================
   COMBO LIST
========================================================= */

const comboList =
    document.getElementById(
        "comboList"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const emptyAddBtn =
    document.getElementById(
        "emptyAddBtn"
    );


/* =========================================================
   MARKETING LINKS
========================================================= */

const marketingLinksList =
    document.getElementById(
        "marketingLinksList"
    );

const marketingEmptyState =
    document.getElementById(
        "marketingEmptyState"
    );

const refreshMarketingBtn =
    document.getElementById(
        "refreshMarketingBtn"
    );


/* =========================================================
   COMBO MODAL
========================================================= */

const comboModal =
    document.getElementById(
        "comboModal"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const comboForm =
    document.getElementById(
        "comboForm"
    );

const editId =
    document.getElementById(
        "editId"
    );

const comboName =
    document.getElementById(
        "comboName"
    );

const comboCategory =
    document.getElementById(
        "comboCategory"
    );

const mainLink =
    document.getElementById(
        "mainLink"
    );

const affiliateLink =
    document.getElementById(
        "affiliateLink"
    );

const comboNotes =
    document.getElementById(
        "comboNotes"
    );

const comboStatus =
    document.getElementById(
        "comboStatus"
    );

const cancelBtn =
    document.getElementById(
        "cancelBtn"
    );


/* =========================================================
   PASTE MODAL
========================================================= */

const pasteModal =
    document.getElementById(
        "pasteModal"
    );

const pasteBox =
    document.getElementById(
        "pasteBox"
    );

const cancelPasteBtn =
    document.getElementById(
        "cancelPasteBtn"
    );

const importPasteBtn =
    document.getElementById(
        "importPasteBtn"
    );


/* =========================================================
   CATEGORY MODAL
========================================================= */

const categoryModal =
    document.getElementById(
        "categoryModal"
    );

const newCategory =
    document.getElementById(
        "newCategory"
    );

const addCategoryBtn =
    document.getElementById(
        "addCategoryBtn"
    );

const categoryListView =
    document.getElementById(
        "categoryListView"
    );


/* =========================================================
   HELP CENTER
========================================================= */

const helpModal =
    document.getElementById(
        "helpModal"
    );

const closeHelpModal =
    document.getElementById(
        "closeHelpModal"
    );

const helpCenterBtn =
    document.getElementById(
        "helpCenterBtn"
    );


/* =========================================================
   GENERIC HELPERS
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


function normalizeText(value) {

    return String(
        value ?? ""
    ).trim();
}


function isValidUrl(value) {

    try {

        const url =
            new URL(
                String(value).trim()
            );

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );

    } catch {

        return false;
    }
}


function getMarketingTarget(combo) {

    const affiliate =
        normalizeText(
            combo.affiliateLink
        );

    const main =
        normalizeText(
            combo.mainLink
        );


    if (
        affiliate &&
        isValidUrl(
            affiliate
        )
    ) {

        return affiliate;
    }


    if (
        main &&
        isValidUrl(
            main
        )
    ) {

        return main;
    }


    return "";
}


function getComboStatus(combo) {

    return (
        normalizeText(
            combo.status
        ) ||
        "Active"
    );
}


function getMarketingStatus(link) {

    return (
        normalizeText(
            link?.status
        ) ||
        "Active"
    );
}


function formatDate(value) {

    if (!value) {
        return "—";
    }


    try {

        if (
            typeof value.toDate ===
            "function"
        ) {

            return value
                .toDate()
                .toLocaleString();
        }


        if (
            value instanceof Date
        ) {

            return value
                .toLocaleString();
        }


        const date =
            new Date(
                value
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "—";
        }


        return date.toLocaleString();

    } catch {

        return "—";
    }
}


/* =========================================================
   MARKETING URL
========================================================= */

function buildMarketingUrl(id) {

    return new URL(
        "go.html?id=" +
        encodeURIComponent(
            id
        ),
        window.location.href
    ).toString();
}


/* =========================================================
   LOGIN MESSAGE
========================================================= */

function setLoginMessage(
    text,
    type = ""
) {

    if (!loginMessage) {
        return;
    }


    loginMessage.textContent =
        text || "";


    loginMessage.className =
        "login-message";


    if (type) {

        loginMessage.classList.add(
            type
        );
    }
}


/* =========================================================
   SCREEN CONTROL
========================================================= */

function showLogin() {

    if (loginScreen) {

        loginScreen.classList.remove(
            "login-screen-hidden"
        );
    }


    if (appShell) {

        appShell.classList.add(
            "app-shell-hidden"
        );
    }
}


function showDashboard() {

    if (loginScreen) {

        loginScreen.classList.add(
            "login-screen-hidden"
        );
    }


    if (appShell) {

        appShell.classList.remove(
            "app-shell-hidden"
        );
    }


    if (adminEmail) {

        adminEmail.textContent =
            currentUser?.email ||
            "";
    }
}


/* =========================================================
   ADMIN CHECK
========================================================= */

async function checkAdmin(user) {

    if (!user) {
        return false;
    }


    /*
     * The Firebase Auth UID is the primary admin identity.
     * The Firestore users/{uid} document must also contain:
     *
     * role: "admin"
     *
     * This avoids depending on a hard-coded email address.
     */

    if (
        user.uid !==
        ADMIN_UID
    ) {

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

    } catch (error) {

        console.error(
            "Admin Check Error:",
            error
        );


        return false;
    }
}


/* =========================================================
   AUTH
========================================================= */

async function handleLogin(event) {

    event.preventDefault();


    const email =
        normalizeText(
            adminEmail?.value
        );


    const password =
        String(
            adminPassword?.value ||
            ""
        );


    if (
        !email ||
        !password
    ) {

        setLoginMessage(
            "Please enter your email and password.",
            "error"
        );


        return;
    }


    if (loginBtn) {

        loginBtn.disabled =
            true;

        loginBtn.textContent =
            "Signing in...";
    }


    setLoginMessage(
        "Checking your account..."
    );


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

            await signOut(
                auth
            );


            setLoginMessage(
                "This account is not authorized as an admin.",
                "error"
            );


            return;
        }


        setLoginMessage(
            "Login successful.",
            "success"
        );

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );


        let message =
            "Login failed. Please check your email and password.";


        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            message =
                "Incorrect email or password.";

        } else if (
            error.code ===
            "auth/too-many-requests"
        ) {

            message =
                "Too many attempts. Please try again later.";

        } else if (
            error.code ===
            "auth/network-request-failed"
        ) {

            message =
                "Network error. Please check your internet connection.";

        } else if (
            error.code ===
            "auth/user-disabled"
        ) {

            message =
                "This account has been disabled.";

        } else if (
            error.code ===
            "auth/user-not-found"
        ) {

            message =
                "No Firebase account was found for this email.";
        }


        setLoginMessage(
            message,
            "error"
        );

    } finally {

        if (loginBtn) {

            loginBtn.disabled =
                false;

            loginBtn.textContent =
                "Login";
        }
    }
}


async function handleLogout() {

    try {

        await signOut(
            auth
        );

    } catch (error) {

        console.error(
            "Logout Error:",
            error
        );
    }
}


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
                item => ({

                    id:
                        item.id,

                    ...item.data()

                })
            );


        render();

    } catch (error) {

        console.error(
            "Load Combos Error:",
            error
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
                item => ({

                    id:
                        item.id,

                    ...item.data()

                })
            );


        if (
            categories.length === 0
        ) {

            for (
                const name
                of DEFAULT_CATEGORIES
            ) {

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
                        );


                try {

                    await setDoc(
                        doc(
                            db,
                            "categories",
                            categoryId
                        ),
                        {

                            name,

                            createdAt:
                                serverTimestamp()

                        }
                    );

                } catch (error) {

                    console.warn(
                        "Default Category Warning:",
                        error
                    );
                }
            }


            const refreshed =
                await getDocs(
                    collection(
                        db,
                        "categories"
                    )
                );


            categories =
                refreshed.docs.map(
                    item => ({

                        id:
                            item.id,

                        ...item.data()

                    })
                );
        }


        renderCategoryOptions();

        renderCategoryList();

    } catch (error) {

        console.error(
            "Load Categories Error:",
            error
        );
    }
}


/* =========================================================
   LOAD MARKETING LINKS
========================================================= */

async function loadMarketingLinks() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "marketingLinks"
                )
            );


        marketingLinks = {};


        snapshot.docs.forEach(
            item => {

                marketingLinks[item.id] =
                    {

                        id:
                            item.id,

                        ...item.data()

                    };
            }
        );


        render();

    } catch (error) {

        console.error(
            "Load Marketing Links Error:",
            error
        );
    }
}


/* =========================================================
   LOAD EVERYTHING
========================================================= */

async function loadFirebaseData() {

    await Promise.all([

        loadCombos(),

        loadCategories(),

        loadMarketingLinks()

    ]);


    render();
}


/* =========================================================
   MARKETING STATS
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
            function(
                total,
                link
            ) {

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
   GENERAL STATS
========================================================= */

function updateStats() {

    const total =
        combos.length;


    const active =
        combos.filter(
            combo =>
                getComboStatus(
                    combo
                ) === "Active"
        ).length;


    const pending =
        combos.filter(
            combo =>
                getComboStatus(
                    combo
                ) === "Pending"
        ).length;


    const archived =
        combos.filter(
            combo =>
                getComboStatus(
                    combo
                ) === "Archived"
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
}


/* =========================================================
   RENDER CATEGORY OPTIONS
========================================================= */

function renderCategoryOptions() {

    if (!comboCategory) {
        return;
    }


    const current =
        comboCategory.value;


    const datalist =
        document.getElementById(
            "categoryOptions"
        );


    if (datalist) {

        datalist.innerHTML =
            categories
                .sort(
                    (a, b) =>
                        String(
                            a.name
                        ).localeCompare(
                            String(
                                b.name
                            )
                        )
                )
                .map(
                    category =>
                        `<option value="${escapeHTML(
                            category.name
                        )}"></option>`
                )
                )
                .join("");
    }


    comboCategory.value =
        current;
}


/* =========================================================
   RENDER CATEGORY FILTER
========================================================= */

function renderCategoryFilter() {

    if (!categoryFilter) {
        return;
    }


    const current =
        categoryFilter.value;


    const options = [

        `<option value="">All Categories</option>`,

        ...categories
            .sort(
                (a, b) =>
                    String(
                        a.name
                    ).localeCompare(
                        String(
                            b.name
                        )
                    )
            )
            .map(
                category =>
                    `<option value="${escapeHTML(
                        category.name
                    )}">${escapeHTML(
                        category.name
                    )}</option>`
            )

    ];


    categoryFilter.innerHTML =
        options.join("");


    if (
        [...categoryFilter.options]
            .some(
                option =>
                    option.value ===
                    current
            )
    ) {

        categoryFilter.value =
            current;
    }
}


/* =========================================================
   RENDER CATEGORIES
========================================================= */

function renderCategoryList() {

    if (!categoryListView) {
        return;
    }


    if (
        categories.length === 0
    ) {

        categoryListView.innerHTML =
            `<div class="empty-state">
                No categories yet.
            </div>`;

        return;
    }


    categoryListView.innerHTML =
        categories
            .sort(
                (a, b) =>
                    String(
                        a.name
                    ).localeCompare(
                        String(
                            b.name
                        )
                    )
            )
            .map(
                category => {

                    const used =
                        combos.filter(
                            combo =>
                                normalizeText(
                                    combo.category
                                ).toLowerCase() ===
                                normalizeText(
                                    category.name
                                ).toLowerCase()
                        ).length;


                    return `
                        <div class="category-row">

                            <div>

                                <strong>
                                    ${escapeHTML(
                                        category.name
                                    )}
                                </strong>

                                <small>
                                    ${used} combo${used === 1 ? "" : "s"}
                                </small>

                            </div>


                            <button
                                class="btn danger small"
                                data-delete-category="${escapeHTML(
                                    category.id
                                )}"
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
   OPEN COMBO MODAL
========================================================= */

function openComboModal(
    combo = null
) {

    if (!comboModal) {
        return;
    }


    if (combo) {

        if (modalTitle) {

            modalTitle.textContent =
                "Edit Combo";
        }


        if (editId) {

            editId.value =
                combo.id;
        }


        if (comboName) {

            comboName.value =
                combo.name || "";
        }


        if (comboCategory) {

            comboCategory.value =
                combo.category || "";
        }


        if (mainLink) {

            mainLink.value =
                combo.mainLink || "";
        }


        if (affiliateLink) {

            affiliateLink.value =
                combo.affiliateLink || "";
        }


        if (comboNotes) {

            comboNotes.value =
                combo.notes || "";
        }


        if (comboStatus) {

            comboStatus.value =
                getComboStatus(
                    combo
                );
        }

    } else {

        if (modalTitle) {

            modalTitle.textContent =
                "Add Combo";
        }


        if (editId) {

            editId.value =
                "";
        }


        if (comboForm) {

            comboForm.reset();
        }


        if (comboStatus) {

            comboStatus.value =
                "Active";
        }
    }


    comboModal.classList.remove(
        "hidden"
    );


    setTimeout(
        function() {

            comboName?.focus();

        },
        50
    );
}


/* =========================================================
   CLOSE COMBO MODAL
========================================================= */

function closeComboModal() {

    comboModal?.classList.add(
        "hidden"
    );
}


/* =========================================================
   SAVE COMBO
========================================================= */

async function saveCombo(event) {

    event.preventDefault();


    if (!currentUser) {
        return;
    }


    const id =
        normalizeText(
            editId?.value
        );


    const name =
        normalizeText(
            comboName?.value
        );


    const category =
        normalizeText(
            comboCategory?.value
        );


    const main =
        normalizeText(
            mainLink?.value
        );


    const affiliate =
        normalizeText(
            affiliateLink?.value
        );


    const notes =
        normalizeText(
            comboNotes?.value
        );


    const status =
        normalizeText(
            comboStatus?.value
        ) ||
        "Active";


    if (!name) {

        alert(
            "Combo name is required."
        );

        return;
    }


    if (
        main &&
        !isValidUrl(main)
    ) {

        alert(
            "Main Link must be a valid HTTP or HTTPS URL."
        );

        return;
    }


    if (
        affiliate &&
        !isValidUrl(affiliate)
    ) {

        alert(
            "Affiliate Link must be a valid HTTP or HTTPS URL."
        );

        return;
    }


    const submitButton =
        comboForm?.querySelector(
            'button[type="submit"]'
        );


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.textContent =
            "Saving...";
    }


    try {

        if (id) {

            const comboRef =
                doc(
                    db,
                    "combos",
                    id
                );


            await updateDoc(
                comboRef,
                {

                    name,

                    category,

                    mainLink:
                        main,

                    affiliateLink:
                        affiliate,

                    notes,

                    status,

                    updatedAt:
                        serverTimestamp()

                }
            );


            const existingMarketing =
                marketingLinks[id];


            if (existingMarketing) {

                const targetUrl =
                    getMarketingTarget({

                        name,

                        category,

                        mainLink:
                            main,

                        affiliateLink:
                            affiliate,

                        notes,

                        status

                    });


                if (targetUrl) {

                    await updateDoc(
                        doc(
                            db,
                            "marketingLinks",
                            id
                        ),
                        {

                            comboName:
                                name,

                            targetUrl,

                            status,

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

                            targetUrl,

                            status,

                            updatedAt:
                                serverTimestamp()

                        },
                        {
                            merge:
                                true
                        }
                    );

                } else {

                    await updateDoc(
                        doc(
                            db,
                            "marketingLinks",
                            id
                        ),
                        {

                            comboName:
                                name,

                            status:
                                "Archived",

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
                                "Archived",

                            updatedAt:
                                serverTimestamp()

                        },
                        {
                            merge:
                                true
                        }
                    );
                }
            }


            const index =
                combos.findIndex(
                    combo =>
                        combo.id === id
                );


            if (
                index !== -1
            ) {

                combos[index] = {

                    ...combos[index],

                    name,

                    category,

                    mainLink:
                        main,

                    affiliateLink:
                        affiliate,

                    notes,

                    status

                };
            }

        } else {

            const comboRef =
                await addDoc(
                    collection(
                        db,
                        "combos"
                    ),
                    {

                        name,

                        category,

                        mainLink:
                            main,

                        affiliateLink:
                            affiliate,

                        notes,

                        status,

                        createdAt:
                            serverTimestamp(),

                        updatedAt:
                            serverTimestamp()

                    }
                );


            combos.push({

                id:
                    comboRef.id,

                name,

                category,

                mainLink:
                    main,

                affiliateLink:
                    affiliate,

                notes,

                status

            });
        }


        closeComboModal();

        render();

    } catch (error) {

        console.error(
            "Save Combo Error:",
            error
        );


        alert(
            "Unable to save the combo. Please try again."
        );

    } finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                id
                    ? "Update Combo"
                    : "Save Combo";
        }
    }
}


/* =========================================================
   CREATE MARKETING LINK
========================================================= */

async function createMarketingLink(
    id
) {

    const combo =
        combos.find(
            item =>
                item.id === id
        );


    if (!combo) {

        alert(
            "Combo not found."
        );

        return;
    }


    const targetUrl =
        getMarketingTarget(
            combo
        );


    if (!targetUrl) {

        alert(
            "Please add a valid Main Link or Affiliate Link first."
        );

        return;
    }


    try {

        const marketingRef =
            doc(
                db,
                "marketingLinks",
                id
            );


        const existingSnap =
            await getDoc(
                marketingRef
            );


        const existing =
            existingSnap.exists()
                ? existingSnap.data()
                : {};


        const status =
            existing.status ||
            getComboStatus(
                combo
            );


        const clicks =
            Number(
                existing.clicks
            ) || 0;


        await setDoc(
            marketingRef,
            {

                comboId:
                    id,

                comboName:
                    combo.name || "",

                targetUrl,

                clicks,

                status,

                createdAt:
                    existing.createdAt ||
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp()

            },
            {
                merge:
                    true
            }
        );


        await setDoc(
            doc(
                db,
                "publicRedirects",
                id
            ),
            {

                targetUrl,

                status,

                updatedAt:
                    serverTimestamp()

            },
            {
                merge:
                    true
            }
        );


        marketingLinks[id] = {

            id,

            comboId:
                id,

            comboName:
                combo.name || "",

            targetUrl,

            clicks,

            status

        };


        renderMarketingLinks();

        render();


        const publicUrl =
            buildMarketingUrl(
                id
            );


        try {

            await navigator.clipboard.writeText(
                publicUrl
            );


            alert(
                "Marketing link created and copied:\n\n" +
                publicUrl
            );

        } catch {

            alert(
                "Marketing link created:\n\n" +
                publicUrl
            );
        }

    } catch (error) {

        console.error(
            "Create Marketing Link Error:",
            error
        );


        alert(
            "Unable to create the marketing link."
        );
    }
}


/* =========================================================
   UPDATE MARKETING LINK STATUS
========================================================= */

async function updateMarketingLinkStatus(
    id,
    newStatus
) {

    if (!marketingLinks[id]) {
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


        marketingLinks[id].status =
            newStatus;


        renderMarketingLinks();

        render();

    } catch (error) {

        console.error(
            "Marketing Status Error:",
            error
        );


        alert(
            "Unable to update marketing link status."
        );
    }
}


/* =========================================================
   DELETE MARKETING LINK
========================================================= */

async function deleteMarketingLink(
    id
) {

    const confirmed =
        confirm(
            "Delete this marketing link and its click history?"
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
            "Unable to delete the marketing link."
        );
    }
}


/* =========================================================
   COPY MARKETING LINK
========================================================= */

async function copyMarketingLink(
    id
) {

    const url =
        buildMarketingUrl(
            id
        );


    try {

        await navigator.clipboard.writeText(
            url
        );


        alert(
            "Marketing link copied."
        );

    } catch {

        prompt(
            "Copy this marketing link:",
            url
        );
    }
}


/* =========================================================
   OPEN MARKETING LINK
========================================================= */

function openMarketingLink(
    id
) {

    const url =
        buildMarketingUrl(
            id
        );


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}


/* =========================================================
   RENDER MARKETING LINKS
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

                    const aDate =
                        a.updatedAt?.toDate
                            ? a.updatedAt.toDate()
                            : new Date(
                                a.updatedAt || 0
                            );


                    const bDate =
                        b.updatedAt?.toDate
                            ? b.updatedAt.toDate()
                            : new Date(
                                b.updatedAt || 0
                            );


                    return (
                        bDate -
                        aDate
                    );
                }
            );


    if (
        links.length === 0
    ) {

        marketingLinksList.innerHTML =
            "";


        marketingEmptyState?.classList.remove(
            "hidden"
        );


        return;
    }


    marketingEmptyState?.classList.add(
        "hidden"
    );


    marketingLinksList.innerHTML =
        links
            .map(
                createMarketingLinkHTML
            )
            .join("");
}


/* =========================================================
   MARKETING LINK HTML
========================================================= */

function createMarketingLinkHTML(
    link
) {

    const combo =
        combos.find(
            item =>
                item.id ===
                link.comboId
        );


    const comboName =
        link.comboName ||
        combo?.name ||
        "Unknown Combo";


    const category =
        combo?.category ||
        "—";


    const status =
        getMarketingStatus(
            link
        );


    const clicks =
        Number(
            link.clicks
        ) || 0;


    const publicUrl =
        buildMarketingUrl(
            link.id
        );


    let statusAction =
        "";


    if (
        status === "Active"
    ) {

        statusAction = `
            <button
                class="btn secondary small"
                data-marketing-action="pause"
                data-id="${escapeHTML(
                    link.id
                )}"
            >
                Pause
            </button>
        `;

    } else if (
        status === "Paused"
    ) {

        statusAction = `
            <button
                class="btn primary small"
                data-marketing-action="activate"
                data-id="${escapeHTML(
                    link.id
                )}"
            >
                Activate
            </button>

            <button
                class="btn secondary small"
                data-marketing-action="archive"
                data-id="${escapeHTML(
                    link.id
                )}"
            >
                Archive
            </button>
        `;

    } else {

        statusAction = `
            <button
                class="btn primary small"
                data-marketing-action="restore"
                data-id="${escapeHTML(
                    link.id
                )}"
            >
                Restore
            </button>
        `;
    }


    return `
        <article class="marketing-link-card">

            <div class="marketing-link-head">

                <div>

                    <h3>
                        ${escapeHTML(
                            comboName
                        )}
                    </h3>

                    <div class="combo-meta">

                        <span>
                            ${escapeHTML(
                                category
                            )}
                        </span>

                        <span>
                            ${escapeHTML(
                                status
                            )}
                        </span>

                        <span>
                            ${clicks} clicks
                        </span>

                    </div>

                </div>

            </div>


            <div class="marketing-link-url">

                <strong>
                    Public Link
                </strong>

                <code>
                    ${escapeHTML(
                        publicUrl
                    )}
                </code>

            </div>


            <div class="marketing-link-url">

                <strong>
                    Destination
                </strong>

                <code>
                    ${escapeHTML(
                        link.targetUrl || "—"
                    )}
                </code>

            </div>


            <div class="card-actions">

                <button
                    class="btn secondary small"
                    data-marketing-action="copy"
                    data-id="${escapeHTML(
                        link.id
                    )}"
                >
                    Copy
                </button>


                <button
                    class="btn secondary small"
                    data-marketing-action="open"
                    data-id="${escapeHTML(
                        link.id
                    )}"
                >
                    Open
                </button>


                ${statusAction}


                <button
                    class="btn danger small"
                    data-marketing-action="delete"
                    data-id="${escapeHTML(
                        link.id
                    )}"
                >
                    Delete
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   DELETE COMBO
========================================================= */

async function deleteCombo(
    id
) {

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
            `Delete "${combo.name}"?\n\nThe combo will be removed. Its marketing history will be kept, but the public redirect will be disabled.`
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


        if (
            marketingLinks[id]
        ) {

            try {

                await updateDoc(
                    doc(
                        db,
                        "marketingLinks",
                        id
                    ),
                    {

                        status:
                            "Archived",

                        updatedAt:
                            serverTimestamp()

                    }
                );


                marketingLinks[id].status =
                    "Archived";

            } catch (historyError) {

                console.warn(
                    "Marketing History Update Warning:",
                    historyError
                );
            }


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
        }


        combos =
            combos.filter(
                item =>
                    item.id !== id
            );


        render();

        renderMarketingLinks();

    } catch (error) {

        console.error(
            "Delete Combo Error:",
            error
        );


        alert(
            "Unable to delete the combo."
        );
    }
}


/* =========================================================
   ARCHIVE COMBO
========================================================= */

async function archiveCombo(
    id
) {

    const combo =
        combos.find(
            item =>
                item.id === id
        );


    if (!combo) {
        return;
    }


    try {

        await updateDoc(
            doc(
                db,
                "combos",
                id
            ),
            {

                status:
                    "Archived",

                updatedAt:
                    serverTimestamp()

            }
        );


        const index =
            combos.findIndex(
                item =>
                    item.id === id
            );


        if (
            index !== -1
        ) {

            combos[index].status =
                "Archived";
        }


        if (
            marketingLinks[id]
        ) {

            await updateMarketingLinkStatus(
                id,
                "Archived"
            );

        } else {

            try {

                await setDoc(
                    doc(
                        db,
                        "publicRedirects",
                        id
                    ),
                    {

                        status:
                            "Archived",

                        updatedAt:
                            serverTimestamp()

                    },
                    {
                        merge:
                            true
                    }
                );

            } catch (publicError) {

                console.warn(
                    "Public Archive Warning:",
                    publicError
                );
            }
        }


        render();

    } catch (error) {

        console.error(
            "Archive Combo Error:",
            error
        );


        alert(
            "Unable to archive the combo."
        );
    }
}


/* =========================================================
   RESTORE COMBO
========================================================= */

async function restoreCombo(
    id
) {

    const combo =
        combos.find(
            item =>
                item.id === id
        );


    if (!combo) {
        return;
    }


    try {

        await updateDoc(
            doc(
                db,
                "combos",
                id
            ),
            {

                status:
                    "Active",

                updatedAt:
                    serverTimestamp()

            }
        );


        const index =
            combos.findIndex(
                item =>
                    item.id === id
            );


        if (
            index !== -1
        ) {

            combos[index].status =
                "Active";
        }


        if (
            marketingLinks[id]
        ) {

            await updateMarketingLinkStatus(
                id,
                "Active"
            );
        }


        render();

    } catch (error) {

        console.error(
            "Restore Combo Error:",
            error
        );


        alert(
            "Unable to restore the combo."
        );
    }
}


/* =========================================================
   CREATE COMBO HTML
========================================================= */

function createComboHTML(
    combo
) {

    const status =
        getComboStatus(
            combo
        );


    const marketing =
        marketingLinks[
            combo.id
        ];


    const clicks =
        Number(
            marketing?.clicks
        ) || 0;


    const hasMarketing =
        Boolean(
            marketing
        );


    const marketingButtons =
        hasMarketing
            ? `
                <button
                    class="btn secondary small"
                    data-combo-action="copy-marketing"
                    data-id="${escapeHTML(
                        combo.id
                    )}"
                >
                    Copy Marketing Link
                </button>

                <button
                    class="btn secondary small"
                    data-combo-action="open-marketing"
                    data-id="${escapeHTML(
                        combo.id
                    )}"
                >
                    Open Link
                </button>
            `
            : `
                <button
                    class="btn primary small"
                    data-combo-action="create-marketing"
                    data-id="${escapeHTML(
                        combo.id
                    )}"
                >
                    Create Marketing Link
                </button>
            `;


    const archiveButton =
        status === "Archived"
            ? `
                <button
                    class="btn primary small"
                    data-combo-action="restore"
                    data-id="${escapeHTML(
                        combo.id
                    )}"
                >
                    Restore
                </button>
            `
            : `
                <button
                    class="btn secondary small"
                    data-combo-action="archive"
                    data-id="${escapeHTML(
                        combo.id
                    )}"
                >
                    Archive
                </button>
            `;


    return `
        <article class="combo-card">

            <div class="combo-card-top">

                <div>

                    <h3>
                        ${escapeHTML(
                            combo.name
                        )}
                    </h3>

                    <div class="combo-meta">

                        <span>
                            ${escapeHTML(
                                combo.category ||
                                "Other"
                            )}
                        </span>

                        <span>
                            ${escapeHTML(
                                status
                            )}
                        </span>

                        <span>
                            ${clicks} clicks
                        </span>

                    </div>

                </div>

            </div>


            ${
                combo.notes
                    ? `
                        <p class="combo-notes">
                            ${escapeHTML(
                                combo.notes
                            )}
                        </p>
                    `
                    : ""
            }


            <div class="combo-links">

                ${
                    combo.mainLink
                        ? `
                            <div>

                                <strong>
                                    Main Link
                                </strong>

                                <a
                                    href="${escapeHTML(
                                        combo.mainLink
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    ${escapeHTML(
                                        combo.mainLink
                                    )}
                                </a>

                            </div>
                        `
                        : ""
                }


                ${
                    combo.affiliateLink
                        ? `
                            <div>

                                <strong>
                                    Affiliate Link
                                </strong>

                                <a
                                    href="${escapeHTML(
                                        combo.affiliateLink
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    ${escapeHTML(
                                        combo.affiliateLink
                                    )}
                                </a>

                            </div>
                        `
                        : ""
                }

            </div>


            <div class="marketing-box">

                <div>

                    <strong>
                        Marketing Link
                    </strong>

                    <span>
                        ${
                            hasMarketing
                                ? `${clicks} clicks`
                                : "Not created"
                        }
                    </span>

                </div>


                <div class="card-actions">

                    ${marketingButtons}

                </div>

            </div>


            <div class="card-actions">

                <button
                    class="btn secondary small"
                    data-combo-action="edit"
                    data-id="${escapeHTML(
                        combo.id
                    )}"
                >
                    Edit
                </button>


                ${archiveButton}


                <button
                    class="btn danger small"
                    data-combo-action="delete"
                    data-id="${escapeHTML(
                        combo.id
                    )}"
                >
                    Delete
                </button>

            </div>


            <div class="combo-dates">

                <span>
                    Created:
                    ${formatDate(
                        combo.createdAt
                    )}
                </span>

                <span>
                    Updated:
                    ${formatDate(
                        combo.updatedAt
                    )}
                </span>

            </div>

        </article>
    `;
}


/* =========================================================
   FILTER COMBOS
========================================================= */

function getFilteredCombos() {

    const search =
        normalizeText(
            searchInput?.value
        ).toLowerCase();


    const category =
        normalizeText(
            categoryFilter?.value
        ).toLowerCase();


    const status =
        normalizeText(
            statusFilter?.value
        ).toLowerCase();


    return combos.filter(
        combo => {

            const searchable =
                [

                    combo.name,

                    combo.category,

                    combo.mainLink,

                    combo.affiliateLink,

                    combo.notes

                ]
                    .map(
                        value =>
                            String(
                                value || ""
                            ).toLowerCase()
                    )
                    .join(" ");


            const comboCategory =
                normalizeText(
                    combo.category
                ).toLowerCase();


            const comboStatus =
                getComboStatus(
                    combo
                ).toLowerCase();


            const matchesSearch =
                !search ||
                searchable.includes(
                    search
                );


            const matchesCategory =
                !category ||
                comboCategory ===
                    category;


            const matchesStatus =
                !status ||
                comboStatus ===
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

function renderCombos() {

    if (!comboList) {
        return;
    }


    const filtered =
        getFilteredCombos();


    if (resultCount) {

        resultCount.textContent =
            `${filtered.length} result${
                filtered.length === 1
                    ? ""
                    : "s"
            }`;
    }


    if (
        filtered.length === 0
    ) {

        comboList.innerHTML =
            "";


        emptyState?.classList.remove(
            "hidden"
        );


        return;
    }


    emptyState?.classList.add(
        "hidden"
    );


    comboList.innerHTML =
        filtered
            .map(
                createComboHTML
            )
            .join("");
}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function render() {

    updateStats();

    renderCategoryFilter();

    renderCategoryOptions();

    renderCategoryList();

    renderCombos();

    renderMarketingLinks();
}


/* =========================================================
   PASTE / IMPORT
========================================================= */

function openPasteModal() {

    pasteModal?.classList.remove(
        "hidden"
    );

    pasteBox?.focus();
}


function closePasteModal() {

    pasteModal?.classList.add(
        "hidden"
    );
}


async function importPastedCombos() {

    const raw =
        String(
            pasteBox?.value ||
            ""
        ).trim();


    if (!raw) {

        alert(
            "Please paste combo data first."
        );

        return;
    }


    let parsed;


    try {

        parsed =
            JSON.parse(
                raw
            );

    } catch {

        alert(
            "Invalid JSON. Please paste valid combo JSON."
        );

        return;
    }


    const items =
        Array.isArray(
            parsed
        )
            ? parsed
            : [parsed];


    let imported =
        0;


    try {

        for (
            const item
            of items
        ) {

            if (
                !item ||
                typeof item !==
                "object"
            ) {

                continue;
            }


            const name =
                normalizeText(
                    item.name
                );


            if (!name) {
                continue;
            }


            const category =
                normalizeText(
                    item.category
                ) ||
                "Other";


            const main =
                normalizeText(
                    item.mainLink ||
                    item.main ||
                    item.url
                );


            const affiliate =
                normalizeText(
                    item.affiliateLink ||
                    item.affiliate
                );


            const notes =
                normalizeText(
                    item.notes ||
                    item.description
                );


            const status =
                normalizeText(
                    item.status
                ) ||
                "Active";


            const ref =
                await addDoc(
                    collection(
                        db,
                        "combos"
                    ),
                    {

                        name,

                        category,

                        mainLink:
                            main,

                        affiliateLink:
                            affiliate,

                        notes,

                        status,

                        createdAt:
                            serverTimestamp(),

                        updatedAt:
                            serverTimestamp()

                    }
                );


            combos.push({

                id:
                    ref.id,

                name,

                category,

                mainLink:
                    main,

                affiliateLink:
                    affiliate,

                notes,

                status

            });


            imported++;
        }


        closePasteModal();


        if (pasteBox) {

            pasteBox.value =
                "";
        }


        render();


        alert(
            `${imported} combo${
                imported === 1
                    ? ""
                    : "s"
            } imported successfully.`
        );

    } catch (error) {

        console.error(
            "Paste Import Error:",
            error
        );


        alert(
            "Unable to import the pasted data."
        );
    }
}


/* =========================================================
   CATEGORY MANAGEMENT
========================================================= */

function openCategoryModal() {

    categoryModal?.classList.remove(
        "hidden"
    );


    renderCategoryList();

    newCategory?.focus();
}


function closeCategoryModal() {

    categoryModal?.classList.add(
        "hidden"
    );
}


async function addNewCategory() {

    const name =
        normalizeText(
            newCategory?.value
        );


    if (!name) {

        alert(
            "Enter a category name."
        );

        return;
    }


    const exists =
        categories.some(
            category =>
                normalizeText(
                    category.name
                ).toLowerCase() ===
                name.toLowerCase()
        );


    if (exists) {

        alert(
            "This category already exists."
        );

        return;
    }


    const id =
        name
            .toLowerCase()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                "");


    try {

        let finalId =
            id ||
            `category-${Date.now()}`;


        const existingDoc =
            await getDoc(
                doc(
                    db,
                    "categories",
                    finalId
                )
            );


        if (
            existingDoc.exists()
        ) {

            finalId =
                `${finalId}-${Date.now()}`;
        }


        await setDoc(
            doc(
                db,
                "categories",
                finalId
            ),
            {

                name,

                createdAt:
                    serverTimestamp()

            }
        );


        categories.push({

            id:
                finalId,

            name

        });


        if (newCategory) {

            newCategory.value =
                "";
        }


        render();

    } catch (error) {

        console.error(
            "Add Category Error:",
            error
        );


        alert(
            "Unable to add category."
        );
    }
}


async function deleteCategory(
    id
) {

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
                normalizeText(
                    combo.category
                ).toLowerCase() ===
                normalizeText(
                    category.name
                ).toLowerCase()
        );


    if (used) {

        alert(
            "This category is being used by one or more combos. Change those combos first."
        );

        return;
    }


    const confirmed =
        confirm(
            `Delete category "${category.name}"?`
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


        render();

    } catch (error) {

        console.error(
            "Delete Category Error:",
            error
        );


        alert(
            "Unable to delete category."
        );
    }
}


/* =========================================================
   EVENT HANDLERS
========================================================= */

loginForm?.addEventListener(
    "submit",
    handleLogin
);


logoutBtn?.addEventListener(
    "click",
    handleLogout
);


comboForm?.addEventListener(
    "submit",
    saveCombo
);


closeModal?.addEventListener(
    "click",
    closeComboModal
);


cancelBtn?.addEventListener(
    "click",
    closeComboModal
);


document
    .getElementById(
        "addComboBtn"
    )
    ?.addEventListener(
        "click",
        () =>
            openComboModal()
    );


document
    .getElementById(
        "pasteComboBtn"
    )
    ?.addEventListener(
        "click",
        openPasteModal
    );


cancelPasteBtn?.addEventListener(
    "click",
    closePasteModal
);


importPasteBtn?.addEventListener(
    "click",
    importPastedCombos
);


categoryBtn?.addEventListener(
    "click",
    openCategoryModal
);


addCategoryBtn?.addEventListener(
    "click",
    addNewCategory
);


refreshMarketingBtn?.addEventListener(
    "click",
    async function() {

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

        } finally {

            if (
                refreshMarketingBtn
            ) {

                refreshMarketingBtn.disabled =
                    false;

                refreshMarketingBtn.textContent =
                    "Refresh";
            }
        }
    }
);


helpCenterBtn?.addEventListener(
    "click",
    function() {

        helpModal?.classList.remove(
            "hidden"
        );
    }
);


closeHelpModal?.addEventListener(
    "click",
    function() {

        helpModal?.classList.add(
            "hidden"
        );
    }
);


/* =========================================================
   SEARCH EVENTS
========================================================= */

searchInput?.addEventListener(
    "input",
    renderCombos
);


categoryFilter?.addEventListener(
    "change",
    renderCombos
);


statusFilter?.addEventListener(
    "change",
    renderCombos
);


emptyAddBtn?.addEventListener(
    "click",
    function() {

        openComboModal();
    }
);


/* =========================================================
   COMBO LIST ACTIONS
========================================================= */

comboList?.addEventListener(
    "click",
    async function(event) {

        const button =
            event.target.closest(
                "[data-combo-action]"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset
                .comboAction;


        const id =
            button.dataset.id;


        if (!id) {
            return;
        }


        if (
            action ===
            "edit"
        ) {

            const combo =
                combos.find(
                    item =>
                        item.id === id
                );


            if (combo) {

                openComboModal(
                    combo
                );
            }


        } else if (
            action ===
            "delete"
        ) {

            await deleteCombo(
                id
            );


        } else if (
            action ===
            "archive"
        ) {

            await archiveCombo(
                id
            );


        } else if (
            action ===
            "restore"
        ) {

            await restoreCombo(
                id
            );


        } else if (
            action ===
            "create-marketing"
        ) {

            await createMarketingLink(
                id
            );


        } else if (
            action ===
            "copy-marketing"
        ) {

            await copyMarketingLink(
                id
            );


        } else if (
            action ===
            "open-marketing"
        ) {

            openMarketingLink(
                id
            );
        }
    }
);


/* =========================================================
   MARKETING ACTIONS
========================================================= */

marketingLinksList?.addEventListener(
    "click",
    async function(event) {

        const button =
            event.target.closest(
                "[data-marketing-action]"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset
                .marketingAction;


        const id =
            button.dataset.id;


        if (!id) {
            return;
        }


        if (
            action ===
            "copy"
        ) {

            await copyMarketingLink(
                id
            );


        } else if (
            action ===
            "open"
        ) {

            openMarketingLink(
                id
            );


        } else if (
            action ===
            "pause"
        ) {

            await updateMarketingLinkStatus(
                id,
                "Paused"
            );


        } else if (
            action ===
            "activate"
        ) {

            await updateMarketingLinkStatus(
                id,
                "Active"
            );


        } else if (
            action ===
            "archive"
        ) {

            await updateMarketingLinkStatus(
                id,
                "Archived"
            );


        } else if (
            action ===
            "restore"
        ) {

            await updateMarketingLinkStatus(
                id,
                "Active"
            );


        } else if (
            action ===
            "delete"
        ) {

            await deleteMarketingLink(
                id
            );
        }
    }
);


/* =========================================================
   CATEGORY ACTIONS
========================================================= */

categoryListView?.addEventListener(
    "click",
    async function(event) {

        const button =
            event.target.closest(
                "[data-delete-category]"
            );


        if (!button) {
            return;
        }


        await deleteCategory(
            button.dataset
                .deleteCategory
        );
    }
);


/* =========================================================
   MODAL OUTSIDE CLICK
========================================================= */

[
    comboModal,
    pasteModal,
    categoryModal,
    helpModal
]
    .filter(Boolean)
    .forEach(
        modal => {

            modal.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        modal
                    ) {

                        modal.classList.add(
                            "hidden"
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
    function(event) {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }


        comboModal?.classList.add(
            "hidden"
        );

        pasteModal?.classList.add(
            "hidden"
        );

        categoryModal?.classList.add(
            "hidden"
        );

        helpModal?.classList.add(
            "hidden"
        );
    }
);


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
    auth,
    async function(user) {

        currentUser =
            user;


        if (!user) {

            showLogin();


            authInitialized =
                true;


            return;
        }


        const isAdmin =
            await checkAdmin(
                user
            );


        if (!isAdmin) {

            await signOut(
                auth
            );


            currentUser =
                null;


            showLogin();


            setLoginMessage(
                "This account is not authorized as an admin.",
                "error"
            );


            authInitialized =
                true;


            return;
        }


        showDashboard();


        if (
            !authInitialized
        ) {

            authInitialized =
                true;
        }


        await loadFirebaseData();
    }
);


/* =========================================================
   INITIAL SCREEN
========================================================= */

if (loginScreen) {

    loginScreen.classList.add(
        "login-screen-hidden"
    );
}


if (appShell) {

    appShell.classList.add(
        "app-shell-hidden"
    );
}


/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.JanjuaHub = {

    openComboModal,

    openPasteModal,

    openCategoryModal,

    createMarketingLink,

    copyMarketingLink,

    openMarketingLink,

    loadFirebaseData,

    render

};
