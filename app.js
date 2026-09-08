// ============================================================
// JANJUA HUB
// Universal Combo Manager
// Firebase + Firestore + Authentication
// ============================================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
} from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ============================================================
// FIREBASE CONFIG
// ============================================================

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


// ============================================================
// FIREBASE INITIALIZE
// ============================================================

const firebaseApp =
    initializeApp(firebaseConfig);

const auth =
    getAuth(firebaseApp);

const db =
    getFirestore(firebaseApp);


// ============================================================
// ADMIN CONFIG
// ============================================================

const ADMIN_UID =
    "CIBDAEAysWajofKyAKa1Mzf70rB2";

const ADMIN_EMAIL =
    "thanksyou0339@gmail.com";

const ADMIN_NAME =
    "Admin";


// ============================================================
// DEFAULT CATEGORIES
// ============================================================

const DEFAULT_CATEGORIES = [
    "Finance",
    "Software",
    "Products",
    "Services",
    "Marketing",
    "Business",
    "Other"
];


// ============================================================
// APPLICATION STATE
// ============================================================

let combos = [];

let categories = [];

let marketingLinks = [];

let currentUser = null;

let editingComboId = null;


// ============================================================
// DOM HELPER
// ============================================================

function $(id) {
    return document.getElementById(id);
}


// ============================================================
// LOGIN INPUTS
// ============================================================

function getLoginInputs() {

    const loginForm =
        $("loginForm");

    if (!loginForm) {

        return {
            form: null,
            emailInput: null,
            passwordInput: null
        };
    }


    let emailInput =
        $("loginEmail");


    if (!emailInput && loginForm.elements) {

        emailInput =
            loginForm.elements.namedItem(
                "loginEmail"
            ) ||
            loginForm.elements.namedItem(
                "email"
            );
    }


    if (!emailInput) {

        emailInput =
            loginForm.querySelector(
                'input[type="email"]'
            );
    }


    let passwordInput =
        $("loginPassword");


    if (!passwordInput && loginForm.elements) {

        passwordInput =
            loginForm.elements.namedItem(
                "loginPassword"
            ) ||
            loginForm.elements.namedItem(
                "password"
            );
    }


    if (!passwordInput) {

        passwordInput =
            loginForm.querySelector(
                'input[type="password"]'
            );
    }


    if (!passwordInput) {

        passwordInput =
            loginForm.querySelector(
                'input[autocomplete="current-password"]'
            );
    }


    if (!passwordInput) {

        const inputs =
            Array.from(
                loginForm.querySelectorAll(
                    "input"
                )
            );

        passwordInput =
            inputs.find(
                input =>
                    input !== emailInput
            ) || null;
    }


    return {
        form: loginForm,
        emailInput,
        passwordInput
    };
}


// ============================================================
// LOGIN MESSAGE
// ============================================================

function setLoginMessage(
    message,
    type = ""
) {

    const el =
        $("loginMessage");

    if (!el) return;

    el.textContent =
        message;

    el.className =
        "login-message" +
        (
            type
                ? ` ${type}`
                : ""
        );
}


// ============================================================
// LOGIN USER NAME
// ============================================================

function createLoginUserName() {

    const loginForm =
        $("loginForm");

    if (!loginForm) return;

    if (
        $("loginUserName")
    ) {

        return;
    }


    const nameElement =
        document.createElement(
            "div"
        );

    nameElement.id =
        "loginUserName";

    nameElement.textContent =
        ADMIN_NAME;


    nameElement.style.margin =
        "0 0 14px";

    nameElement.style.textAlign =
        "center";

    nameElement.style.fontWeight =
        "700";

    nameElement.style.fontSize =
        "18px";

    nameElement.style.letterSpacing =
        ".3px";


    loginForm.parentNode.insertBefore(
        nameElement,
        loginForm
    );
}


// ============================================================
// PASSWORD SHOW / HIDE + FORGOT PASSWORD UI
// ============================================================

function createPasswordControls() {

    const passwordInput =
        $("loginPassword");

    if (!passwordInput) return;


    const passwordField =
        passwordInput.closest(
            ".login-field"
        );


    if (!passwordField) return;


    const inputWrap =
        passwordInput.closest(
            ".input-wrap"
        );


    if (!inputWrap) return;


    // --------------------------------------------------------
    // Make room for password button
    // --------------------------------------------------------

    inputWrap.style.position =
        "relative";


    passwordInput.style.paddingRight =
        "90px";


    // --------------------------------------------------------
    // SHOW / HIDE BUTTON
    // --------------------------------------------------------

    let toggleButton =
        $("togglePassword");


    if (!toggleButton) {

        toggleButton =
            document.createElement(
                "button"
            );

        toggleButton.type =
            "button";

        toggleButton.id =
            "togglePassword";

        toggleButton.className =
            "password-toggle";

        toggleButton.textContent =
            "Show";

        toggleButton.setAttribute(
            "aria-label",
            "Show password"
        );

        toggleButton.title =
            "Show password";


        toggleButton.style.position =
            "absolute";

        toggleButton.style.right =
            "8px";

        toggleButton.style.top =
            "50%";

        toggleButton.style.transform =
            "translateY(-50%)";

        toggleButton.style.border =
            "none";

        toggleButton.style.background =
            "transparent";

        toggleButton.style.cursor =
            "pointer";

        toggleButton.style.fontWeight =
            "600";

        toggleButton.style.padding =
            "6px 8px";


        inputWrap.appendChild(
            toggleButton
        );
    }


    if (
        !toggleButton.dataset.bound
    ) {

        toggleButton.dataset.bound =
            "true";


        toggleButton.addEventListener(
            "click",
            () => {

                const isHidden =
                    passwordInput.type ===
                    "password";


                passwordInput.type =
                    isHidden
                        ? "text"
                        : "password";


                toggleButton.textContent =
                    isHidden
                        ? "Hide"
                        : "Show";


                toggleButton.setAttribute(
                    "aria-label",
                    isHidden
                        ? "Hide password"
                        : "Show password"
                );


                toggleButton.title =
                    isHidden
                        ? "Hide password"
                        : "Show password";
            }
        );
    }


    // --------------------------------------------------------
    // FORGOT PASSWORD
    // --------------------------------------------------------

    let forgotButton =
        $("forgotPasswordBtn");


    if (!forgotButton) {

        forgotButton =
            document.createElement(
                "button"
            );

        forgotButton.type =
            "button";

        forgotButton.id =
            "forgotPasswordBtn";

        forgotButton.className =
            "forgot-password-btn";

        forgotButton.textContent =
            "Forgot Password?";


        forgotButton.style.display =
            "block";

        forgotButton.style.margin =
            "12px auto 0";

        forgotButton.style.border =
            "none";

        forgotButton.style.background =
            "transparent";

        forgotButton.style.cursor =
            "pointer";

        forgotButton.style.fontWeight =
            "600";

        forgotButton.style.padding =
            "6px 10px";


        passwordField.appendChild(
            forgotButton
        );
    }


    if (
        !forgotButton.dataset.bound
    ) {

        forgotButton.dataset.bound =
            "true";


        forgotButton.addEventListener(
            "click",
            handleForgotPassword
        );
    }
}


// ============================================================
// FORGOT PASSWORD
// ============================================================

async function handleForgotPassword() {

    const {
        emailInput
    } =
        getLoginInputs();


    let email =
        String(
            emailInput?.value || ""
        ).trim();


    // If email field is empty,
    // use the registered Admin Gmail.
    if (!email) {

        email =
            ADMIN_EMAIL;

        if (emailInput) {

            emailInput.value =
                ADMIN_EMAIL;
        }
    }


    if (
        email.toLowerCase() !==
        ADMIN_EMAIL.toLowerCase()
    ) {

        setLoginMessage(
            "Password reset کے لیے Admin Gmail استعمال کریں۔",
            "error"
        );

        emailInput?.focus();

        return;
    }


    setLoginMessage(
        "Password reset email بھیجی جا رہی ہے...",
        ""
    );


    try {

        await sendPasswordResetEmail(
            auth,
            ADMIN_EMAIL
        );


        setLoginMessage(
            "Password reset email بھیج دی گئی ہے۔ Gmail اور Spam/Junk folder چیک کریں۔",
            "success"
        );


    } catch (error) {

        console.error(
            "Password reset error:",
            error.code || error.message
        );


        let message =
            "Password reset نہیں ہو سکا۔";


        switch (
            error.code
        ) {

            case "auth/invalid-email":

                message =
                    "Admin Gmail درست نہیں ہے۔";

                break;


            case "auth/user-not-found":

                message =
                    "یہ Admin Gmail Firebase میں موجود نہیں ہے۔";

                break;


            case "auth/too-many-requests":

                message =
                    "بہت زیادہ کوششیں ہو چکی ہیں۔ کچھ دیر بعد دوبارہ کوشش کریں۔";

                break;


            case "auth/network-request-failed":

                message =
                    "Internet/Firebase network مسئلہ ہے۔";

                break;


            default:

                message =
                    error.message ||
                    "Password reset failed.";
        }


        setLoginMessage(
            message,
            "error"
        );
    }
}


// ============================================================
// LOGIN
// ============================================================

async function handleLogin(
    event
) {

    event.preventDefault();


    const {
        form,
        emailInput,
        passwordInput
    } =
        getLoginInputs();


    if (!form) {

        setLoginMessage(
            "Login form نہیں مل رہا۔",
            "error"
        );

        return;
    }


    if (!emailInput) {

        setLoginMessage(
            "Email field نہیں مل رہی۔",
            "error"
        );

        return;
    }


    if (!passwordInput) {

        setLoginMessage(
            "Password field نہیں مل رہی۔",
            "error"
        );

        return;
    }


    const email =
        String(
            emailInput.value || ""
        ).trim();


    const password =
        String(
            passwordInput.value || ""
        );


    if (!email && !password) {

        setLoginMessage(
            "Email اور Password دونوں درج کریں۔",
            "error"
        );

        return;
    }


    if (!email) {

        setLoginMessage(
            "Email درج کریں۔",
            "error"
        );

        emailInput.focus();

        return;
    }


    if (!password) {

        setLoginMessage(
            "Password درج کریں۔",
            "error"
        );

        passwordInput.focus();

        return;
    }


    if (
        email.toLowerCase() !==
        ADMIN_EMAIL.toLowerCase()
    ) {

        setLoginMessage(
            "یہ Admin Email نہیں ہے۔",
            "error"
        );

        return;
    }


    setLoginMessage(
        "Firebase سے login ہو رہا ہے...",
        ""
    );


    try {

        const credential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            credential.user;


        if (
            user.uid !==
            ADMIN_UID
        ) {

            setLoginMessage(
                "یہ account Janjua Hub Admin کے لیے authorized نہیں ہے۔",
                "error"
            );

            await signOut(
                auth
            );

            return;
        }


        const isAdmin =
            await checkAdmin(
                user
            );


        if (!isAdmin) {

            setLoginMessage(
                "Admin account verify نہیں ہو سکا۔",
                "error"
            );

            await signOut(
                auth
            );

            return;
        }


        setLoginMessage(
            "Login successful.",
            "success"
        );


    } catch (error) {

        console.error(
            "Firebase Login Error:",
            error.code || error.message
        );


        let message =
            "Login failed.";


        switch (
            error.code
        ) {

            case "auth/invalid-credential":

                message =
                    "Email یا Password غلط ہے۔";

                break;


            case "auth/invalid-api-key":

                message =
                    "Firebase API Key غلط ہے۔";

                break;


            case "auth/user-not-found":

                message =
                    "یہ Firebase user موجود نہیں ہے۔";

                break;


            case "auth/wrong-password":

                message =
                    "Password غلط ہے۔";

                break;


            case "auth/too-many-requests":

                message =
                    "بہت زیادہ login attempts ہو چکی ہیں۔ کچھ دیر بعد دوبارہ کوشش کریں۔";

                break;


            case "auth/network-request-failed":

                message =
                    "Internet/Firebase network مسئلہ ہے۔";

                break;


            default:

                message =
                    error.message ||
                    "Firebase login failed.";
        }


        setLoginMessage(
            message,
            "error"
        );
    }
}


// ============================================================
// ADMIN CHECK
// ============================================================

async function checkAdmin(
    user
) {

    if (!user) return false;


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


        const snapshot =
            await getDoc(
                userRef
            );


        if (!snapshot.exists()) {

            return false;
        }


        const data =
            snapshot.data();


        if (
            data.role !==
            "admin"
        ) {

            return false;
        }


        return true;


    } catch (error) {

        console.error(
            "Admin check error:",
            error.message
        );

        return false;
    }
}


// ============================================================
// SHOW DASHBOARD
// ============================================================

function showDashboard() {

    const loginScreen =
        $("loginScreen");

    const appShell =
        $("appShell");


    if (loginScreen) {

        loginScreen.style.display =
            "none";

        loginScreen.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    if (appShell) {

        appShell.classList.remove(
            "app-shell-hidden"
        );

        appShell.style.display =
            "";

        appShell.setAttribute(
            "aria-hidden",
            "false"
        );
    }


    const emailDisplay =
        $("adminEmailDisplay");


    if (emailDisplay) {

        emailDisplay.textContent =
            currentUser?.email ||
            ADMIN_EMAIL;
    }
}


// ============================================================
// SHOW LOGIN
// ============================================================

function showLogin() {

    const loginScreen =
        $("loginScreen");

    const appShell =
        $("appShell");


    if (loginScreen) {

        loginScreen.style.display =
            "";

        loginScreen.setAttribute(
            "aria-hidden",
            "false"
        );
    }


    if (appShell) {

        appShell.classList.add(
            "app-shell-hidden"
        );

        appShell.style.display =
            "none";

        appShell.setAttribute(
            "aria-hidden",
            "true"
        );
    }
}


// ============================================================
// LOAD CATEGORIES
// ============================================================

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
                    id: item.id,
                    ...item.data()
                })
            );


        if (!categories.length) {

            categories =
                DEFAULT_CATEGORIES.map(
                    name => ({
                        id:
                            name
                                .toLowerCase()
                                .replace(
                                    /[^a-z0-9]+/g,
                                    "-"
                                ),
                        name
                    })
                );
        }


    } catch (error) {

        console.error(
            "Categories load error:",
            error.message
        );


        categories =
            DEFAULT_CATEGORIES.map(
                name => ({
                    id:
                        name
                            .toLowerCase()
                            .replace(
                                /[^a-z0-9]+/g,
                                "-"
                            ),
                    name
                })
            );
    }


    renderCategories();
    renderCategoryFilter();
    renderCategoryList();
}


// ============================================================
// LOAD COMBOS
// ============================================================

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
                    id: item.id,
                    ...item.data()
                })
            );


        combos.sort(
            (a, b) => {

                const aDate =
                    a.updatedAt?.toMillis?.() ||
                    a.createdAt?.toMillis?.() ||
                    0;


                const bDate =
                    b.updatedAt?.toMillis?.() ||
                    b.createdAt?.toMillis?.() ||
                    0;


                return bDate - aDate;
            }
        );


        renderCombos();
        updateStats();


    } catch (error) {

        console.error(
            "Combos load error:",
            error.message
        );


        combos = [];

        renderCombos();
        updateStats();
    }
}


// ============================================================
// LOAD MARKETING LINKS
// ============================================================

async function loadMarketingLinks() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "marketingLinks"
                )
            );


        marketingLinks =
            snapshot.docs.map(
                item => ({
                    id: item.id,
                    ...item.data()
                })
            );


        marketingLinks.sort(
            (a, b) => {

                const aDate =
                    a.createdAt?.toMillis?.() ||
                    0;


                const bDate =
                    b.createdAt?.toMillis?.() ||
                    0;


                return bDate - aDate;
            }
        );


        renderMarketingLinks();
        updateStats();


    } catch (error) {

        console.error(
            "Marketing links load error:",
            error.message
        );


        marketingLinks = [];

        renderMarketingLinks();
        updateStats();
    }
}


// ============================================================
// LOAD ALL DATA
// ============================================================

async function loadAllData() {

    await Promise.all([
        loadCategories(),
        loadCombos(),
        loadMarketingLinks()
    ]);
}


// ============================================================
// RENDER CATEGORIES
// ============================================================

function renderCategories() {

    const list =
        $("categoryList");

    if (!list) return;


    list.innerHTML = "";


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category.name || "";


            list.appendChild(
                option
            );
        }
    );
}


// ============================================================
// CATEGORY FILTER
// ============================================================

function renderCategoryFilter() {

    const select =
        $("categoryFilter");

    if (!select) return;


    const current =
        select.value;


    select.innerHTML =
        `<option value="">All Categories</option>`;


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category.name;


            option.textContent =
                category.name;


            select.appendChild(
                option
            );
        }
    );


    select.value =
        current;
}


// ============================================================
// CATEGORY LIST
// ============================================================

function renderCategoryList() {

    const container =
        $("categoryListView");

    if (!container) return;


    container.innerHTML = "";


    categories.forEach(
        category => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "category-item";


            row.innerHTML = `

                <span>
                    ${escapeHtml(
                        category.name || ""
                    )}
                </span>

                <button
                    type="button"
                    class="ghost-btn"
                    data-delete-category="${category.id}"
                >
                    Delete
                </button>

            `;


            container.appendChild(
                row
            );
        }
    );


    container
        .querySelectorAll(
            "[data-delete-category]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () =>
                        deleteCategory(
                            button.dataset
                                .deleteCategory
                        )
                );
            }
        );
}


// ============================================================
// ADD CATEGORY
// ============================================================

async function addCategory() {

    const input =
        $("newCategory");

    if (!input) return;


    const name =
        input.value.trim();


    if (!name) {

        alert(
            "Category name درج کریں۔"
        );

        return;
    }


    const exists =
        categories.some(
            category =>
                String(
                    category.name || ""
                ).toLowerCase() ===
                name.toLowerCase()
        );


    if (exists) {

        alert(
            "یہ Category پہلے سے موجود ہے۔"
        );

        return;
    }


    try {

        await addDoc(
            collection(
                db,
                "categories"
            ),
            {
                name,
                createdAt:
                    serverTimestamp()
            }
        );


        input.value =
            "";


        await loadCategories();


    } catch (error) {

        console.error(
            "Add category error:",
            error.message
        );

        alert(
            error.message
        );
    }
}


// ============================================================
// DELETE CATEGORY
// ============================================================

async function deleteCategory(
    id
) {

    if (!id) return;


    const category =
        categories.find(
            item =>
                item.id === id
        );


    if (!category) return;


    if (
        !confirm(
            `Delete category "${category.name}"?`
        )
    ) {

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


        await loadCategories();


    } catch (error) {

        console.error(
            "Delete category error:",
            error.message
        );

        alert(
            error.message
        );
    }
}


// ============================================================
// RENDER COMBOS
// ============================================================

function renderCombos() {

    const container =
        $("comboList");

    const empty =
        $("emptyState");

    const resultCount =
        $("resultCount");


    if (!container) return;


    const search =
        (
            $("searchInput")?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const category =
        $("categoryFilter")?.value ||
        "";


    const status =
        $("statusFilter")?.value ||
        "";


    const filtered =
        combos.filter(
            combo => {

                const text =
                    [
                        combo.name,
                        combo.category,
                        combo.mainLink,
                        combo.affiliateLink,
                        combo.notes
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                const searchMatch =
                    !search ||
                    text.includes(
                        search
                    );


                const categoryMatch =
                    !category ||
                    combo.category ===
                    category;


                const statusMatch =
                    !status ||
                    combo.status ===
                    status;


                return (
                    searchMatch &&
                    categoryMatch &&
                    statusMatch
                );
            }
        );


    container.innerHTML =
        "";


    filtered.forEach(
        combo => {

            container.appendChild(
                createComboCard(
                    combo
                )
            );
        }
    );


    if (resultCount) {

        resultCount.textContent =
            `${filtered.length} record${
                filtered.length === 1
                    ? ""
                    : "s"
            }`;
    }


    if (empty) {

        empty.classList.toggle(
            "hidden",
            combos.length !== 0
        );
    }
}


// ============================================================
// CREATE COMBO CARD
// ============================================================

function createComboCard(
    combo
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "combo-card";


    const status =
        combo.status ||
        "Active";


    card.innerHTML = `

        <div class="combo-card-header">

            <div>

                <h3>
                    ${escapeHtml(
                        combo.name ||
                        "Untitled Combo"
                    )}
                </h3>

                <span class="combo-category">
                    ${escapeHtml(
                        combo.category ||
                        "Other"
                    )}
                </span>

            </div>

            <span class="status-badge status-${status.toLowerCase()}">
                ${escapeHtml(status)}
            </span>

        </div>


        <div class="combo-links">

            ${
                combo.mainLink
                    ? `
                        <a
                            href="${safeUrl(
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
                            href="${safeUrl(
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


        ${
            combo.notes
                ? `
                    <p class="combo-notes">
                        ${escapeHtml(
                            combo.notes
                        )}
                    </p>
                `
                : ""
        }


        <div class="combo-actions">

            <button
                type="button"
                class="secondary-btn"
                data-edit="${combo.id}"
            >
                Edit
            </button>

            <button
                type="button"
                class="secondary-btn"
                data-marketing="${combo.id}"
            >
                Marketing Link
            </button>

            <button
                type="button"
                class="ghost-btn"
                data-delete="${combo.id}"
            >
                Delete
            </button>

        </div>

    `;


    card
        .querySelector(
            "[data-edit]"
        )
        ?.addEventListener(
            "click",
            () =>
                openEditCombo(
                    combo.id
                )
        );


    card
        .querySelector(
            "[data-marketing]"
        )
        ?.addEventListener(
            "click",
            () =>
                createMarketingLink(
                    combo
                )
        );


    card
        .querySelector(
            "[data-delete]"
        )
        ?.addEventListener(
            "click",
            () =>
                deleteCombo(
                    combo.id
                )
        );


    return card;
}


// ============================================================
// OPEN ADD COMBO
// ============================================================

function openAddCombo() {

    editingComboId =
        null;


    $("comboForm")?.reset();


    $("editId").value =
        "";


    $("modalTitle").textContent =
        "Add Combo";


    $("comboStatus").value =
        "Active";


    openModal(
        "comboModal"
    );
}


// ============================================================
// OPEN EDIT COMBO
// ============================================================

function openEditCombo(
    id
) {

    const combo =
        combos.find(
            item =>
                item.id === id
        );


    if (!combo) return;


    editingComboId =
        id;


    $("editId").value =
        id;


    $("comboName").value =
        combo.name || "";


    $("comboCategory").value =
        combo.category || "";


    $("mainLink").value =
        combo.mainLink || "";


    $("affiliateLink").value =
        combo.affiliateLink || "";


    $("comboNotes").value =
        combo.notes || "";


    $("comboStatus").value =
        combo.status ||
        "Active";


    $("modalTitle").textContent =
        "Edit Combo";


    openModal(
        "comboModal"
    );
}


// ============================================================
// SAVE COMBO
// ============================================================

async function saveCombo(
    event
) {

    event.preventDefault();


    const name =
        $("comboName")
            ?.value
            .trim();


    const category =
        $("comboCategory")
            ?.value
            .trim();


    const mainLink =
        $("mainLink")
            ?.value
            .trim();


    const affiliateLink =
        $("affiliateLink")
            ?.value
            .trim();


    const notes =
        $("comboNotes")
            ?.value
            .trim();


    const status =
        $("comboStatus")
            ?.value ||
        "Active";


    if (!name || !category) {

        alert(
            "Combo Name اور Category ضروری ہیں۔"
        );

        return;
    }


    const data = {

        name,

        category,

        mainLink,

        affiliateLink,

        notes,

        status,

        updatedAt:
            serverTimestamp()
    };


    try {

        if (editingComboId) {

            await updateDoc(
                doc(
                    db,
                    "combos",
                    editingComboId
                ),
                data
            );

        } else {

            await addDoc(
                collection(
                    db,
                    "combos"
                ),
                {
                    ...data,
                    createdAt:
                        serverTimestamp()
                }
            );
        }


        closeModal(
            "comboModal"
        );


        editingComboId =
            null;


        await loadCombos();


    } catch (error) {

        console.error(
            "Save combo error:",
            error.message
        );

        alert(
            error.message
        );
    }
}


// ============================================================
// DELETE COMBO
// ============================================================

async function deleteCombo(
    id
) {

    if (!id) return;


    const combo =
        combos.find(
            item =>
                item.id === id
        );


    if (!combo) return;


    if (
        !confirm(
            `Delete "${combo.name}"?`
        )
    ) {

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


        await loadCombos();


    } catch (error) {

        console.error(
            "Delete combo error:",
            error.message
        );

        alert(
            error.message
        );
    }
}


// ============================================================
// PASTE COMBO
// ============================================================

function openPasteCombo() {

    const box =
        $("pasteBox");


    if (box) {

        box.value =
            "";
    }


    openModal(
        "pasteModal"
    );
}


// ============================================================
// IMPORT PASTE COMBO
// ============================================================

async function importPasteCombo() {

    const box =
        $("pasteBox");

    if (!box) return;


    const text =
        box.value.trim();


    if (!text) {

        alert(
            "Combo JSON paste کریں۔"
        );

        return;
    }


    try {

        const parsed =
            JSON.parse(
                text
            );


        const items =
            Array.isArray(
                parsed
            )
                ? parsed
                : [parsed];


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


            await addDoc(
                collection(
                    db,
                    "combos"
                ),
                {

                    name:
                        item.name ||
                        item.comboName ||
                        "Untitled Combo",

                    category:
                        item.category ||
                        "Other",

                    mainLink:
                        item.mainLink ||
                        item.main_link ||
                        "",

                    affiliateLink:
                        item.affiliateLink ||
                        item.affiliate_link ||
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
        }


        closeModal(
            "pasteModal"
        );


        await loadCombos();


    } catch (error) {

        console.error(
            "Paste import error:",
            error.message
        );

        alert(
            "Invalid JSON یا Combo data۔"
        );
    }
}


// ============================================================
// CREATE MARKETING LINK
// ============================================================

async function createMarketingLink(
    combo
) {

    if (!combo?.id) return;


    const targetUrl =
        combo.affiliateLink ||
        combo.mainLink ||
        "";


    if (!targetUrl) {

        alert(
            "اس Combo میں Main Link یا Affiliate Link موجود نہیں ہے۔"
        );

        return;
    }


    try {

        const linkDoc =
            await addDoc(
                collection(
                    db,
                    "marketingLinks"
                ),
                {

                    comboId:
                        combo.id,

                    comboName:
                        combo.name ||
                        "",

                    targetUrl,

                    clicks:
                        0,

                    status:
                        "Active",

                    createdAt:
                        serverTimestamp()
                }
            );


        const base =
            window.location.origin +
            window.location.pathname
                .replace(
                    /[^/]*$/,
                    ""
                );


        const redirectUrl =
            `${base}go.html?id=${encodeURIComponent(
                linkDoc.id
            )}`;


        await setDoc(
            doc(
                db,
                "publicRedirects",
                linkDoc.id
            ),
            {

                targetUrl,

                comboId:
                    combo.id,

                active:
                    true,

                createdAt:
                    serverTimestamp()
            }
        );


        await navigator.clipboard
            .writeText(
                redirectUrl
            )
            .catch(
                () => {}
            );


        alert(
            `Marketing Link created:\n\n${redirectUrl}`
        );


        await loadMarketingLinks();


    } catch (error) {

        console.error(
            "Marketing link error:",
            error.message
        );

        alert(
            error.message
        );
    }
}


// ============================================================
// RENDER MARKETING LINKS
// ============================================================

function renderMarketingLinks() {

    const container =
        $("marketingLinksList");

    const empty =
        $("marketingEmptyState");


    if (!container) return;


    container.innerHTML =
        "";


    marketingLinks.forEach(
        link => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "marketing-link-card";


            const base =
                window.location.origin +
                window.location.pathname
                    .replace(
                        /[^/]*$/,
                        ""
                    );


            const redirectUrl =
                `${base}go.html?id=${encodeURIComponent(
                    link.id
                )}`;


            card.innerHTML = `

                <div>

                    <strong>
                        ${escapeHtml(
                            link.comboName ||
                            "Marketing Link"
                        )}
                    </strong>

                    <p>
                        ${escapeHtml(
                            redirectUrl
                        )}
                    </p>

                </div>


                <div>

                    <span>
                        Clicks:
                        ${Number(
                            link.clicks || 0
                        )}
                    </span>


                    <button
                        type="button"
                        class="secondary-btn"
                        data-copy-link="${link.id}"
                    >
                        Copy
                    </button>

                </div>

            `;


            container.appendChild(
                card
            );
        }
    );


    if (empty) {

        empty.classList.toggle(
            "hidden",
            marketingLinks.length !== 0
        );
    }
}


// ============================================================
// COPY MARKETING LINK
// ============================================================

async function copyMarketingLink(
    id
) {

    const base =
        window.location.origin +
        window.location.pathname
            .replace(
                /[^/]*$/,
                ""
            );


    const url =
        `${base}go.html?id=${encodeURIComponent(
            id
        )}`;


    try {

        await navigator.clipboard.writeText(
            url
        );


        alert(
            "Marketing Link copied."
        );


    } catch {

        window.prompt(
            "Copy Marketing Link:",
            url
        );
    }
}


// ============================================================
// STATS
// ============================================================

function updateStats() {

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


    const totalClicks =
        marketingLinks.reduce(
            (
                sum,
                item
            ) =>
                sum +
                Number(
                    item.clicks || 0
                ),
            0
        );


    if ($("totalCount"))
        $("totalCount").textContent =
            total;


    if ($("activeCount"))
        $("activeCount").textContent =
            active;


    if ($("pendingCount"))
        $("pendingCount").textContent =
            pending;


    if ($("archivedCount"))
        $("archivedCount").textContent =
            archived;


    if ($("totalMarketingCount"))
        $("totalMarketingCount").textContent =
            marketingLinks.length;


    if ($("totalClicksCount"))
        $("totalClicksCount").textContent =
            totalClicks;
}


// ============================================================
// MODALS
// ============================================================

function openModal(
    id
) {

    const modal =
        $(id);

    if (!modal) return;


    modal.classList.remove(
        "hidden"
    );
}


function closeModal(
    id
) {

    const modal =
        $(id);

    if (!modal) return;


    modal.classList.add(
        "hidden"
    );
}


// ============================================================
// HELP
// ============================================================

function openHelp() {

    openModal(
        "helpModal"
    );
}


// ============================================================
// EVENT LISTENERS
// ============================================================

function setupEvents() {

    const loginForm =
        $("loginForm");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleLogin
        );
    }


    $("logoutBtn")
        ?.addEventListener(
            "click",
            async () => {

                try {

                    await signOut(
                        auth
                    );

                } catch (error) {

                    console.error(
                        "Logout error:",
                        error.message
                    );
                }
            }
        );


    $("addBtn")
        ?.addEventListener(
            "click",
            openAddCombo
        );


    $("emptyAddBtn")
        ?.addEventListener(
            "click",
            openAddCombo
        );


    $("pasteBtn")
        ?.addEventListener(
            "click",
            openPasteCombo
        );


    $("comboForm")
        ?.addEventListener(
            "submit",
            saveCombo
        );


    $("closeModal")
        ?.addEventListener(
            "click",
            () =>
                closeModal(
                    "comboModal"
                )
        );


    $("cancelBtn")
        ?.addEventListener(
            "click",
            () =>
                closeModal(
                    "comboModal"
                )
        );


    $("closePasteModal")
        ?.addEventListener(
            "click",
            () =>
                closeModal(
                    "pasteModal"
                )
        );


    $("cancelPasteBtn")
        ?.addEventListener(
            "click",
            () =>
                closeModal(
                    "pasteModal"
                )
        );


    $("importPasteBtn")
        ?.addEventListener(
            "click",
            importPasteCombo
        );


    $("categoryBtn")
        ?.addEventListener(
            "click",
            () =>
                openModal(
                    "categoryModal"
                )
        );


    $("closeCategoryModal")
        ?.addEventListener(
            "click",
            () =>
                closeModal(
                    "categoryModal"
                )
        );


    $("addCategoryBtn")
        ?.addEventListener(
            "click",
            addCategory
        );


    $("closeHelpModal")
        ?.addEventListener(
            "click",
            () =>
                closeModal(
                    "helpModal"
                )
        );


    $("helpBtn")
        ?.addEventListener(
            "click",
            openHelp
        );


    $("refreshMarketingBtn")
        ?.addEventListener(
            "click",
            loadMarketingLinks
        );


    $("searchInput")
        ?.addEventListener(
            "input",
            renderCombos
        );


    $("categoryFilter")
        ?.addEventListener(
            "change",
            renderCombos
        );


    $("statusFilter")
        ?.addEventListener(
            "change",
            renderCombos
        );


    $("marketingLinksList")
        ?.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-copy-link]"
                    );


                if (!button) return;


                copyMarketingLink(
                    button.dataset.copyLink
                );
            }
        );


    createLoginUserName();

    createPasswordControls();
}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(
    value
) {

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


// ============================================================
// SAFE URL
// ============================================================

function safeUrl(
    value
) {

    const text =
        String(
            value || ""
        ).trim();


    if (!text) return "#";


    try {

        const url =
            new URL(
                text,
                window.location.origin
            );


        if (
            url.protocol === "http:" ||
            url.protocol === "https:"
        ) {

            return url.href;
        }


    } catch {
        // Invalid URL.
    }


    return "#";
}


// ============================================================
// FIREBASE AUTH STATE
// ============================================================

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            currentUser =
                null;

            showLogin();

            return;
        }


        const isAdmin =
            await checkAdmin(
                user
            );


        if (!isAdmin) {

            currentUser =
                null;


            setLoginMessage(
                "یہ account Janjua Hub Admin نہیں ہے۔",
                "error"
            );


            await signOut(
                auth
            );


            showLogin();

            return;
        }


        currentUser =
            user;


        showDashboard();


        await loadAllData();
    }
);


// ============================================================
// START APPLICATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupEvents();

        showLogin();

        // Put the Admin email in the login field
        // without requiring the user to type it every time.
        const {
            emailInput
        } =
            getLoginInputs();


        if (emailInput) {

            emailInput.value =
                ADMIN_EMAIL;
        }
    }
);
