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
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);


/* =========================================================
   ADMIN SETTINGS
========================================================= */

const ADMIN_UID =
    "Va1ERyp4TJR8OVOf0MVjDYPC8hk2";

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
    document.getElementById("loginScreen");

const appShell =
    document.getElementById("appShell");

const loginForm =
    document.getElementById("loginForm");

const adminEmail =
    document.getElementById("adminEmail");

const adminPassword =
    document.getElementById("adminPassword");

const loginMessage =
    document.getElementById("loginMessage");

const loginBtn =
    document.getElementById("loginBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


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


const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const statusFilter =
    document.getElementById("statusFilter");

const categoryBtn =
    document.getElementById("categoryBtn");

const resultCount =
    document.getElementById("resultCount");


const comboList =
    document.getElementById("comboList");

const emptyState =
    document.getElementById("emptyState");

const emptyAddBtn =
    document.getElementById("emptyAddBtn");


const marketingLinksList =
    document.getElementById("marketingLinksList");

const marketingEmptyState =
    document.getElementById("marketingEmptyState");

const refreshMarketingBtn =
    document.getElementById("refreshMarketingBtn");


const comboModal =
    document.getElementById("comboModal");

const modalTitle =
    document.getElementById("modalTitle");

const closeModal =
    document.getElementById("closeModal");

const comboForm =
    document.getElementById("comboForm");

const editId =
    document.getElementById("editId");

const comboName =
    document.getElementById("comboName");

const comboCategory =
    document.getElementById("comboCategory");

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


const pasteModal =
    document.getElementById("pasteModal");

const pasteBox =
    document.getElementById("pasteBox");

const cancelPasteBtn =
    document.getElementById("cancelPasteBtn");

const importPasteBtn =
    document.getElementById("importPasteBtn");


const categoryModal =
    document.getElementById("categoryModal");

const newCategory =
    document.getElementById("newCategory");

const addCategoryBtn =
    document.getElementById("addCategoryBtn");

const categoryListView =
    document.getElementById("categoryListView");


const helpModal =
    document.getElementById("helpModal");

const closeHelpModal =
    document.getElementById("closeHelpModal");

const helpCenterBtn =
    document.getElementById("helpCenterBtn");


/* =========================================================
   PASSWORD SHOW / HIDE
========================================================= */

function addPasswordToggle() {

    if (!adminPassword) {
        return;
    }

    if (
        document.getElementById(
            "passwordToggleBtn"
        )
    ) {
        return;
    }

    const wrapper =
        document.createElement("div");

    wrapper.style.position =
        "relative";

    wrapper.style.width =
        "100%";

    adminPassword.parentNode.insertBefore(
        wrapper,
        adminPassword
    );

    wrapper.appendChild(
        adminPassword
    );

    adminPassword.style.width =
        "100%";

    adminPassword.style.paddingRight =
        "75px";

    const button =
        document.createElement("button");

    button.type =
        "button";

    button.id =
        "passwordToggleBtn";

    button.textContent =
        "Show";

    button.setAttribute(
        "aria-label",
        "Show password"
    );

    button.style.position =
        "absolute";

    button.style.right =
        "10px";

    button.style.top =
        "50%";

    button.style.transform =
        "translateY(-50%)";

    button.style.border =
        "0";

    button.style.background =
        "transparent";

    button.style.color =
        "inherit";

    button.style.cursor =
        "pointer";

    button.style.fontWeight =
        "700";

    button.style.fontSize =
        "13px";

    button.style.padding =
        "6px 8px";

    button.style.zIndex =
        "5";

    button.addEventListener(
        "click",
        function() {

            if (
                adminPassword.type ===
                "password"
            ) {

                adminPassword.type =
                    "text";

                button.textContent =
                    "Hide";

                button.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                adminPassword.type =
                    "password";

                button.textContent =
                    "Show";

                button.setAttribute(
                    "aria-label",
                    "Show password"
                );
            }
        }
    );

    wrapper.appendChild(
        button
    );
}

addPasswordToggle();


/* =========================================================
   UID DIAGNOSTIC
   FIXED VERSION
========================================================= */

function createUidDiagnostic() {

    if (!loginScreen) {
        return;
    }

    if (
        document.getElementById(
            "uidDiagnostic"
        )
    ) {
        return;
    }

    const box =
        document.createElement("div");

    box.id =
        "uidDiagnostic";

    box.style.marginTop =
        "16px";

    box.style.padding =
        "16px";

    box.style.border =
        "1px solid rgba(255,255,255,0.16)";

    box.style.borderRadius =
        "14px";

    box.style.background =
        "rgba(0,0,0,0.18)";

    box.style.fontSize =
        "13px";

    box.style.lineHeight =
        "1.6";

    box.style.textAlign =
        "left";

    box.style.wordBreak =
        "break-word";

    box.style.boxSizing =
        "border-box";

    box.style.width =
        "100%";

    box.innerHTML = `

        <div style="
            font-weight:900;
            font-size:15px;
            margin-bottom:14px;
        ">
            🔐 Admin UID Diagnostic
        </div>


        <!-- ADMIN EMAIL -->

        <div style="
            margin-bottom:12px;
        ">

            <div style="
                font-weight:800;
                margin-bottom:5px;
            ">
                Admin Gmail:
            </div>

            <div style="
                padding:10px;
                border-radius:8px;
                background:rgba(255,255,255,0.06);
                border:1px solid rgba(255,255,255,0.10);
                word-break:break-all;
            ">
                ${escapeHTML(ADMIN_EMAIL)}
            </div>

        </div>


        <!-- EXPECTED UID -->

        <div style="
            margin-bottom:12px;
        ">

            <div style="
                font-weight:800;
                margin-bottom:5px;
            ">
                Expected Admin UID:
            </div>

            <div style="
                display:flex;
                gap:7px;
                align-items:stretch;
                flex-wrap:wrap;
            ">

                <div
                    id="uidExpectedDisplay"
                    style="
                        flex:1 1 220px;
                        min-width:0;
                        padding:11px;
                        border-radius:8px;
                        border:1px solid rgba(80,200,255,0.35);
                        background:rgba(0,100,180,0.12);
                        color:#ffffff;
                        font-family:monospace;
                        font-size:13px;
                        font-weight:800;
                        word-break:break-all;
                        box-sizing:border-box;
                    "
                >
                    ${escapeHTML(ADMIN_UID)}
                </div>

                <button
                    type="button"
                    id="copyExpectedUidBtn"
                    style="
                        border:0;
                        border-radius:8px;
                        padding:10px 12px;
                        cursor:pointer;
                        font-weight:800;
                        white-space:nowrap;
                    "
                >
                    Copy UID
                </button>

            </div>

        </div>


        <!-- PASTE UID -->

        <div style="
            margin-bottom:12px;
        ">

            <div style="
                font-weight:800;
                margin-bottom:5px;
            ">
                Firebase UID paste/check:
            </div>

            <div style="
                display:flex;
                gap:7px;
                align-items:stretch;
                flex-wrap:wrap;
            ">

                <input
                    id="uidCheckInput"
                    type="text"
                    autocomplete="off"
                    spellcheck="false"
                    placeholder="Firebase UID یہاں paste کریں"
                    style="
                        flex:1 1 220px;
                        min-width:0;
                        box-sizing:border-box;
                        padding:11px;
                        border-radius:8px;
                        border:1px solid rgba(255,255,255,.16);
                        background:rgba(0,0,0,.25);
                        color:#ffffff;
                        font-family:monospace;
                        font-size:12px;
                        outline:none;
                    "
                >

                <button
                    type="button"
                    id="checkUidBtn"
                    style="
                        border:0;
                        border-radius:8px;
                        padding:10px 12px;
                        cursor:pointer;
                        font-weight:800;
                        white-space:nowrap;
                    "
                >
                    Check UID
                </button>

            </div>

        </div>


        <!-- ACTUAL FIREBASE UID -->

        <div style="
            margin-bottom:12px;
        ">

            <div style="
                font-weight:800;
                margin-bottom:5px;
            ">
                Actual Firebase UID:
            </div>

            <input
                id="uidActualInput"
                type="text"
                readonly
                spellcheck="false"
                placeholder="Successful Firebase Login کے بعد UID آئے گی"
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:11px;
                    border-radius:8px;
                    border:1px solid rgba(255,255,255,.16);
                    background:rgba(0,0,0,.25);
                    color:#ffffff;
                    font-family:monospace;
                    font-size:12px;
                "
            >

        </div>


        <!-- STATUS -->

        <div
            id="uidMatchStatus"
            style="
                margin-top:10px;
                padding:10px;
                border-radius:8px;
                background:rgba(255,255,255,.05);
                border:1px solid rgba(255,255,255,.08);
                font-weight:800;
                word-break:break-word;
            "
        >
            Status: ⚠️ UID check کے لیے تیار ہے۔
        </div>


        <div style="
            margin-top:9px;
            opacity:.72;
            font-size:11px;
        ">
            نوٹ: UID صرف diagnostic کے لیے ہے۔ اسے Password کے متبادل کے طور پر استعمال نہیں کیا جاتا۔
        </div>

    `;


    /*
     * Diagnostic login form کے اندر رہے گا۔
     */

    if (loginForm) {

        loginForm.appendChild(
            box
        );

    } else {

        loginScreen.appendChild(
            box
        );
    }


    const copyExpectedUidBtn =
        document.getElementById(
            "copyExpectedUidBtn"
        );

    const checkUidBtn =
        document.getElementById(
            "checkUidBtn"
        );

    const uidCheckInput =
        document.getElementById(
            "uidCheckInput"
        );


    /* -----------------------------------------
       COPY EXPECTED UID
    ----------------------------------------- */

    copyExpectedUidBtn?.addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    ADMIN_UID
                );

                copyExpectedUidBtn.textContent =
                    "Copied ✓";

                setTimeout(
                    () => {

                        copyExpectedUidBtn.textContent =
                            "Copy UID";

                    },
                    1500
                );

            } catch {

                prompt(
                    "Copy this Expected Admin UID:",
                    ADMIN_UID
                );
            }
        }
    );


    /* -----------------------------------------
       CHECK PASTED UID
    ----------------------------------------- */

    checkUidBtn?.addEventListener(
        "click",
        () => {

            const pastedUid =
                normalizeText(
                    uidCheckInput?.value
                );

            const statusElement =
                document.getElementById(
                    "uidMatchStatus"
                );

            if (!statusElement) {
                return;
            }


            if (!pastedUid) {

                statusElement.textContent =
                    "Status: ⚠️ Firebase UID paste کریں۔";

                return;
            }


            if (
                pastedUid ===
                ADMIN_UID
            ) {

                statusElement.textContent =
                    "Status: ✅ UID MATCH — یہ UID بالکل درست ہے۔";

            } else {

                statusElement.textContent =
                    "Status: ❌ UID MISMATCH — Firebase UID Expected Admin UID سے مختلف ہے۔";

            }

        }
    );


    /* -----------------------------------------
       ENTER TO CHECK
    ----------------------------------------- */

    uidCheckInput?.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                checkUidBtn?.click();
            }

        }
    );
}


/* =========================================================
   UPDATE UID DIAGNOSTIC
========================================================= */

function updateUidDiagnostic(
    user
) {

    const uidActualInput =
        document.getElementById(
            "uidActualInput"
        );

    const uidCheckInput =
        document.getElementById(
            "uidCheckInput"
        );

    const statusElement =
        document.getElementById(
            "uidMatchStatus"
        );


    if (
        !uidActualInput ||
        !statusElement
    ) {
        return;
    }


    if (!user) {

        uidActualInput.value =
            "";

        /*
         * Paste field کو clear نہیں کر رہے،
         * تاکہ user manually UID check کر سکے۔
         */

        statusElement.textContent =
            "Status: ⚠️ Firebase Login ابھی نہیں ہوا۔ Expected UID اوپر موجود ہے۔";

        return;
    }


    const actualUid =
        String(
            user.uid || ""
        ).trim();


    uidActualInput.value =
        actualUid;


    /*
     * Successful Firebase login کے بعد
     * actual UID automatically check field
     * میں بھی آئے گی۔
     */

    if (uidCheckInput) {

        uidCheckInput.value =
            actualUid;
    }


    if (
        actualUid ===
        ADMIN_UID
    ) {

        statusElement.textContent =
            "Status: ✅ UID MATCH — Firebase UID Admin UID کے ساتھ match کرتی ہے۔";

    } else {

        statusElement.textContent =
            "Status: ❌ UID MISMATCH — Firebase نے مختلف UID دی ہے۔";
    }
}


createUidDiagnostic();


/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
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
                String(
                    value
                ).trim()
            );

        return (
            url.protocol ===
                "http:" ||
            url.protocol ===
                "https:"
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

            return value.toLocaleString();
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

    loginScreen?.classList.remove(
        "login-screen-hidden"
    );

    appShell?.classList.add(
        "app-shell-hidden"
    );


    const uidDiagnostic =
        document.getElementById(
            "uidDiagnostic"
        );

    if (uidDiagnostic) {

        uidDiagnostic.style.display =
            "block";
    }


    /*
     * Expected UID ہمیشہ screen پر موجود رہے گی۔
     */

    updateUidDiagnostic(
        null
    );
}


function showDashboard() {

    loginScreen?.classList.add(
        "login-screen-hidden"
    );

    appShell?.classList.remove(
        "app-shell-hidden"
    );


    const uidDiagnostic =
        document.getElementById(
            "uidDiagnostic"
        );

    if (uidDiagnostic) {

        uidDiagnostic.style.display =
            "none";
    }


    if (adminEmail) {

        adminEmail.textContent =
            currentUser?.email || "";
    }
}


/* =========================================================
   ADMIN CHECK
========================================================= */

async function checkAdmin(user) {

    if (!user) {
        return false;
    }


    console.log(
        "Firebase Auth User:",
        {
            email:
                user.email,
            uid:
                user.uid
        }
    );


    updateUidDiagnostic(
        user
    );


    /*
     * Firebase UID must exactly match
     * configured Admin UID.
     */

    if (
        user.uid !== ADMIN_UID
    ) {

        console.error(
            "ADMIN UID MISMATCH",
            {
                expected:
                    ADMIN_UID,
                actual:
                    user.uid,
                email:
                    user.email
            }
        );

        return false;
    }


    /*
     * Firestore users document
     * must exist and role must be admin.
     */

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

            console.error(
                "Admin Firestore document does not exist:",
                user.uid
            );

            return false;
        }


        const data =
            userSnap.data();


        console.log(
            "Admin Firestore Profile:",
            {
                email:
                    data.email || "",
                role:
                    data.role || ""
            }
        );


        if (
            data.role !==
            "admin"
        ) {

            console.error(
                "Firestore role is not admin:",
                data.role
            );

            return false;
        }


        return true;

    } catch (error) {

        console.error(
            "Admin Check Error:",
            error
        );

        return false;
    }
}


/* =========================================================
   AUTH ERROR MESSAGE
========================================================= */

function getAuthErrorMessage(
    error
) {

    const code =
        error?.code || "";


    switch (code) {

        case "auth/invalid-credential":

            return (
                "Email یا Password غلط ہے۔ Password دوبارہ Show کرکے چیک کریں۔ Firebase نے اس کوشش میں UID نہیں دی۔"
            );


        case "auth/wrong-password":

            return (
                "Password غلط ہے۔"
            );


        case "auth/user-not-found":

            return (
                "اس Email کا Firebase Authentication account نہیں ملا۔"
            );


        case "auth/user-disabled":

            return (
                "یہ Firebase account disabled ہے۔"
            );


        case "auth/too-many-requests":

            return (
                "بہت زیادہ Login کوششیں ہو چکی ہیں۔ کچھ دیر بعد دوبارہ کوشش کریں۔"
            );


        case "auth/network-request-failed":

            return (
                "Internet یا network connection کا مسئلہ ہے۔"
            );


        case "auth/operation-not-allowed":

            return (
                "Firebase میں Email/Password Login enabled نہیں ہے۔"
            );


        case "auth/invalid-api-key":

            return (
                "Firebase API configuration میں مسئلہ ہے۔"
            );


        case "auth/app-not-authorized":

            return (
                "یہ website Firebase Authentication کے لیے authorized نہیں ہے۔"
            );


        case "auth/invalid-email":

            return (
                "Email address درست format میں نہیں ہے۔"
            );


        case "auth/user-token-expired":

            return (
                "Firebase session expire ہو گیا ہے۔ دوبارہ Login کریں۔"
            );


        default:

            return (
                "Login failed۔ Firebase error: " +
                (
                    code ||
                    "unknown-error"
                )
            );
    }
}


/* =========================================================
   LOGIN
========================================================= */

async function handleLogin(
    event
) {

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
            "Email اور Password دونوں درج کریں۔",
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
        "Firebase account چیک ہو رہا ہے..."
    );


    try {

        const credential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        /*
         * Firebase login successful۔
         * اصل UID اب دستیاب ہے۔
         */

        updateUidDiagnostic(
            credential.user
        );


        console.log(
            "Firebase Login Successful:",
            {
                email:
                    credential.user.email,
                uid:
                    credential.user.uid
            }
        );


        /*
         * Email verify کریں۔
         */

        if (
            credential.user.email
                ?.toLowerCase() !==
            ADMIN_EMAIL.toLowerCase()
        ) {

            const actualUid =
                credential.user.uid;


            await signOut(
                auth
            );


            currentUser =
                null;


            setLoginMessage(
                "Firebase Login کامیاب ہے، لیکن یہ Email Janjua Hub Admin Email نہیں ہے۔ UID: " +
                actualUid,
                "error"
            );


            /*
             * Actual UID diagnostic میں برقرار رکھیں۔
             */

            setDiagnosticAfterLogout(
                actualUid
            );


            return;
        }


        const isAdmin =
            await checkAdmin(
                credential.user
            );


        if (!isAdmin) {

            const actualUid =
                credential.user.uid;


            await signOut(
                auth
            );


            currentUser =
                null;


            setLoginMessage(
                "Firebase Login کامیاب ہے، لیکن UID/Admin Role match نہیں کر رہا۔ UID: " +
                actualUid,
                "error"
            );


            /*
             * Actual UID diagnostic میں برقرار رکھیں۔
             */

            setDiagnosticAfterLogout(
                actualUid
            );


            return;
        }


        currentUser =
            credential.user;


        setLoginMessage(
            "Login successful.",
            "success"
        );

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );


        /*
         * Firebase authentication fail ہونے پر
         * authenticated user/UID دستیاب نہیں ہوتی۔
         */

        updateUidDiagnostic(
            null
        );


        setLoginMessage(
            getAuthErrorMessage(
                error
            ),
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


/* =========================================================
   KEEP UID AFTER AUTHORIZATION FAILURE
========================================================= */

function setDiagnosticAfterLogout(
    uid
) {

    const actualUidInput =
        document.getElementById(
            "uidActualInput"
        );

    const uidCheckInput =
        document.getElementById(
            "uidCheckInput"
        );

    const uidStatus =
        document.getElementById(
            "uidMatchStatus"
        );


    const actual =
        String(
            uid || ""
        ).trim();


    if (actualUidInput) {

        actualUidInput.value =
            actual;
    }


    if (uidCheckInput) {

        uidCheckInput.value =
            actual;
    }


    if (uidStatus) {

        if (
            actual ===
            ADMIN_UID
        ) {

            uidStatus.textContent =
                "Status: ✅ UID MATCH — UID درست ہے، مسئلہ Email/Admin authorization/Firestore role میں ہو سکتا ہے۔";

        } else {

            uidStatus.textContent =
                "Status: ❌ UID MISMATCH — Firebase account کی UID Expected Admin UID سے مختلف ہے.";
        }
    }
}


/* =========================================================
   LOGOUT
========================================================= */

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

        let snapshot =
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


            snapshot =
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
        }

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
   STATS
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
            (
                total,
                link
            ) => {

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


    if (
        totalMarketingCount
    ) {

        totalMarketingCount.textContent =
            totalLinks;
    }


    if (
        totalClicksCount
    ) {

        totalClicksCount.textContent =
            totalClicks;
    }
}


function updateStats() {

    const total =
        combos.length;


    const active =
        combos.filter(
            combo =>
                getComboStatus(
                    combo
                ) ===
                "Active"
        ).length;


    const pending =
        combos.filter(
            combo =>
                getComboStatus(
                    combo
                ) ===
                "Pending"
        ).length;


    const archived =
        combos.filter(
            combo =>
                getComboStatus(
                    combo
                ) ===
                "Archived"
        ).length;


    if (
        totalCount
    ) {

        totalCount.textContent =
            total;
    }


    if (
        activeCount
    ) {

        activeCount.textContent =
            active;
    }


    if (
        pendingCount
    ) {

        pendingCount.textContent =
            pending;
    }


    if (
        archivedCount
    ) {

        archivedCount.textContent =
            archived;
    }


    updateMarketingStats();
}


/* =========================================================
   CATEGORY RENDERING
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
            [...categories]
                .sort(
                    (
                        a,
                        b
                    ) =>
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
                        `
                        <option value="${escapeHTML(
                            category.name
                        )}"></option>
                        `
                )
                .join("");
    }


    comboCategory.value =
        current;
}


function renderCategoryFilter() {

    if (!categoryFilter) {
        return;
    }


    const current =
        categoryFilter.value;


    categoryFilter.innerHTML =
        `
        <option value="">
            All Categories
        </option>
        ` +
        [...categories]
            .sort(
                (
                    a,
                    b
                ) =>
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
                    `
                    <option value="${escapeHTML(
                        category.name
                    )}">
                        ${escapeHTML(
                            category.name
                        )}
                    </option>
                    `
            )
            .join("");


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


function renderCategoryList() {

    if (!categoryListView) {
        return;
    }


    if (
        categories.length === 0
    ) {

        categoryListView.innerHTML =
            `
            <div class="empty-state">
                No categories yet.
            </div>
            `;

        return;
    }


    categoryListView.innerHTML =
        [...categories]
            .sort(
                (
                    a,
                    b
                ) =>
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
                                ${used}
                                combo${
                                    used ===
                                    1
                                        ? ""
                                        : "s"
                                }
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
   COMBO MODAL
========================================================= */

function openComboModal(
    combo = null
) {

    if (!comboModal) {
        return;
    }


    if (combo) {

        modalTitle.textContent =
            "Edit Combo";

        editId.value =
            combo.id;

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
            getComboStatus(
                combo
            );

    } else {

        modalTitle.textContent =
            "Add Combo";

        editId.value =
            "";

        comboForm.reset();

        comboStatus.value =
            "Active";
    }


    comboModal.classList.remove(
        "hidden"
    );


    setTimeout(
        () =>
            comboName?.focus(),
        50
    );
}


function closeComboModal() {

    comboModal?.classList.add(
        "hidden"
    );
}


/* =========================================================
   SAVE COMBO
========================================================= */

async function saveCombo(
    event
) {

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
        !isValidUrl(
            main
        )
    ) {

        alert(
            "Main Link must be a valid HTTP or HTTPS URL."
        );

        return;
    }


    if (
        affiliate &&
        !isValidUrl(
            affiliate
        )
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

            await updateDoc(
                doc(
                    db,
                    "combos",
                    id
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
                    updatedAt:
                        serverTimestamp()
                }
            );


            const existingMarketing =
                marketingLinks[
                    id
                ];


            if (
                existingMarketing
            ) {

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
                        combo.id ===
                        id
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
   MARKETING LINK
========================================================= */

async function createMarketingLink(
    id
) {

    const combo =
        combos.find(
            item =>
                item.id ===
                id
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


async function updateMarketingLinkStatus(
    id,
    newStatus
) {

    if (
        !marketingLinks[id]
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


        marketingLinks[id].status =
            newStatus;


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


async function deleteMarketingLink(
    id
) {

    if (
        !confirm(
            "Delete this marketing link and its click history?"
        )
    ) {
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

        } catch (error) {

            console.warn(
                "Public Redirect Delete Warning:",
                error
            );
        }


        delete marketingLinks[
            id
        ];


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
   MARKETING RENDER
========================================================= */

function renderMarketingLinks() {

    updateMarketingStats();


    if (
        !marketingLinksList
    ) {
        return;
    }


    const links =
        Object.values(
            marketingLinks
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
            .sort(
                (
                    a,
                    b
                ) => {

                    const aDate =
                        a.updatedAt?.toDate
                            ? a.updatedAt.toDate()
                            : new Date(
                                a.updatedAt ||
                                0
                            );


                    const bDate =
                        b.updatedAt?.toDate
                            ? b.updatedAt.toDate()
                            : new Date(
                                b.updatedAt ||
                                0
                            );


                    return (
                        bDate -
                        aDate
                    );
                }
            )
            .map(
                createMarketingLinkHTML
            )
            .join("");
}


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
        status ===
        "Active"
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
        status ===
        "Paused"
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
                            ${clicks}
                            clicks
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
                        link.targetUrl ||
                        "—"
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
   COMBO DELETE / ARCHIVE / RESTORE
========================================================= */

async function deleteCombo(
    id
) {

    const combo =
        combos.find(
            item =>
                item.id ===
                id
        );


    if (!combo) {
        return;
    }


    if (
        !confirm(
            `Delete "${combo.name}"?\n\nThe combo will be removed. Its marketing history will be kept, but the public redirect will be disabled.`
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

            } catch (error) {

                console.warn(
                    "Marketing History Warning:",
                    error
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

            } catch (error) {

                console.warn(
                    "Public Redirect Warning:",
                    error
                );
            }
        }


        combos =
            combos.filter(
                item =>
                    item.id !==
                    id
            );


        render();

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


async function archiveCombo(
    id
) {

    const combo =
        combos.find(
            item =>
                item.id ===
                id
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
                    item.id ===
                    id
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


async function restoreCombo(
    id
) {

    const combo =
        combos.find(
            item =>
                item.id ===
                id
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
                    item.id ===
                    id
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
   COMBO HTML
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
        status ===
        "Archived"
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
                            ${clicks}
                            clicks
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
   FILTER / RENDER
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
                                value ||
                                ""
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


            return (
                (
                    !search ||
                    searchable.includes(
                        search
                    )
                ) &&
                (
                    !category ||
                    comboCategory ===
                        category
                ) &&
                (
                    !status ||
                    comboStatus ===
                        status
                )
            );
        }
    );
}


function renderCombos() {

    if (!comboList) {
        return;
    }


    const filtered =
        getFilteredCombos();


    if (resultCount) {

        resultCount.textContent =
            `${filtered.length} result${
                filtered.length ===
                1
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


    let imported = 0;


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
                imported ===
                1
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
                ""
            );


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
                item.id ===
                id
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


        categories =
            categories.filter(
                item =>
                    item.id !==
                    id
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
   EVENTS
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
    async () => {

        refreshMarketingBtn.disabled =
            true;

        refreshMarketingBtn.textContent =
            "Refreshing...";


        try {

            await loadMarketingLinks();

            render();

        } finally {

            refreshMarketingBtn.disabled =
                false;

            refreshMarketingBtn.textContent =
                "Refresh";
        }
    }
);


helpCenterBtn?.addEventListener(
    "click",
    () => {

        helpModal?.classList.remove(
            "hidden"
        );
    }
);


closeHelpModal?.addEventListener(
    "click",
    () => {

        helpModal?.classList.add(
            "hidden"
        );
    }
);


/* =========================================================
   SEARCH
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
    () =>
        openComboModal()
);


/* =========================================================
   COMBO ACTIONS
========================================================= */

comboList?.addEventListener(
    "click",
    async event => {

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
                        item.id ===
                        id
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
    async event => {

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
    async event => {

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
   MODAL CLICK
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
                event => {

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
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    event => {

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
    async user => {

        currentUser =
            user;


        updateUidDiagnostic(
            user
        );


        if (!user) {

            showLogin();

            authInitialized =
                true;

            return;
        }


        /*
         * Firebase Auth نے اصل user اور UID دے دی۔
         */

        updateUidDiagnostic(
            user
        );


        const isAdmin =
            await checkAdmin(
                user
            );


        if (!isAdmin) {

            const uid =
                user.uid;


            await signOut(
                auth
            );


            currentUser =
                null;


            showLogin();


            setLoginMessage(
                "یہ Firebase account Admin کے طور پر authorized نہیں ہے۔ UID: " +
                uid,
                "error"
            );


            /*
             * signOut کے بعد UID کو دوبارہ diagnostic
             * میں دکھائیں تاکہ ہمیں اصل Firebase UID
             * نظر آتی رہے۔
             */

            setDiagnosticAfterLogout(
                uid
            );


            authInitialized =
                true;

            return;
        }


        showDashboard();


        authInitialized =
            true;


        await loadFirebaseData();
    }
);


/* =========================================================
   INITIAL SCREEN
========================================================= */

loginScreen?.classList.add(
    "login-screen-hidden"
);


appShell?.classList.add(
    "app-shell-hidden"
);


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

    render,

    updateUidDiagnostic

};
