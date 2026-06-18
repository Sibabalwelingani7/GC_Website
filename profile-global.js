/**
 * Global Profile & Account Settings Module
 * Links seamlessly with Firebase Auth and Firestore 'members' collection
 */

let personalPhotoBase64 = "";
let isDirectAccountPropertiesView = false;

// 1. Automatically Inject the Account Settings Modal into the document body
document.addEventListener("DOMContentLoaded", () => {
    injectProfileModal();
    setupProfileClickListeners();
});

function injectProfileModal() {
    if (document.getElementById("view-member-modal")) return; // Prevent duplicate injection

    const modalHtml = `
    <div id="view-member-modal" class="hidden fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        <form id="view-member-edit-form" onsubmit="handlePersonalProfileSave(event)" class="bg-slate-900/40 border border-slate-800/80 rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative overflow-y-auto max-h-[95vh] space-y-6">
            <input type="hidden" id="view-member-doc-id" value="">
            
            <button type="button" onclick="closeViewModal()" class="text-slate-400 hover:text-white cursor-pointer flex items-center gap-2 text-xs font-medium bg-transparent border-0 p-0 mb-2">
                <i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Dashboard
            </button>
            
            <div class="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div class="relative group w-40 h-40 shrink-0">
                    <div id="view-avatar-box" class="w-40 h-40 rounded-xl bg-slate-700 border border-slate-600/50 overflow-hidden flex items-center justify-center text-4xl font-bold uppercase text-white shadow-md"></div>
                    <div id="view-avatar-upload-trigger" class="absolute inset-0 bg-black/60 rounded-xl items-center justify-center text-[10px] font-bold text-slate-200 cursor-pointer opacity-0 group-hover:opacity-100 transition flex">
                        Change Photo
                        <input type="file" accept="image/*" onchange="previewPersonalAvatarImage(event)" class="absolute inset-0 opacity-0 cursor-pointer">
                    </div>
                </div>
                
                <div class="flex-1 space-y-3 text-center sm:text-left w-full">
                    <div>
                        <h3 id="view-name-display" class="text-2xl font-bold text-white tracking-wide hidden"></h3>
                        <input type="text" id="view-name-input" required class="bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none w-full max-w-xs mt-1">
                        
                        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                            <span class="bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">Active</span>
                            <span id="view-badge-dept" class="bg-blue-950/60 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase"></span>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold pt-1">
                        <div class="flex items-center gap-1.5 text-sky-400 w-full sm:w-auto justify-center sm:justify-start">
                            <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                            <span id="view-phone-display" class="hidden"></span>
                            <input type="tel" id="view-phone-input" required class="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none max-w-[150px]">
                        </div>
                        <div class="flex items-center gap-1.5 text-emerald-400">
                            <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                            <span>WhatsApp</span>
                        </div>
                    </div>

                    <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-left space-y-1.5 w-full">
                        <p class="text-[11px] text-slate-400 font-medium">Attendance</p>
                        <p id="view-attendance-stats" class="text-xs font-medium text-slate-200">1 active out of 1 records</p>
                    </div>
                </div>
            </div>

            <div class="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <div class="text-slate-300 font-bold text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
                    <i data-lucide="user" class="w-4 h-4 text-orange-400"></i> Personal Info
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gender</p>
                        <p class="text-white font-bold text-sm mt-0.5">MALE</p>
                    </div>
                    <div>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date of Birth</p>
                        <p id="view-dob-display" class="text-white font-bold text-sm mt-0.5 hidden"></p>
                        <input type="date" id="view-dob-input" required class="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 focus:outline-none mt-1 w-full max-w-[180px]">
                    </div>
                    <div class="sm:col-span-2">
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Home Address</p>
                        <p id="view-address-display" class="text-slate-200 font-medium mt-0.5 hidden"></p>
                        <input type="text" id="view-address-input" required class="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none mt-1 w-full">
                    </div>
                    <div class="sm:col-span-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                        <p class="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Occupation & Affiliation</p>
                        <p id="view-affiliation" class="text-slate-100 font-medium mt-1 text-sm"></p>
                    </div>
                </div>
            </div>
            
            <div class="pt-2 flex justify-end gap-2">
                <button type="button" onclick="closeViewModal()" class="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold px-5 py-2 rounded-xl text-xs transition cursor-pointer">Close Profile</button>
                <button type="submit" class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2 rounded-xl text-xs transition cursor-pointer">Save Changes</button>
            </div>
        </form>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function setupProfileClickListeners() {
    document.addEventListener('click', function(e) {
        const dropMenu = document.getElementById("profile-dropdown-menu");
        const profileBtn = document.getElementById("profile-menu-button");
        if (dropMenu && profileBtn && !profileBtn.contains(e.target) && !dropMenu.contains(e.target)) {
            dropMenu.classList.add("hidden");
        }
    });
}

// 2. Dropdown Visibility Toggle
function toggleProfileDropdown(event) {
    if (event) event.stopPropagation();
    const dropMenu = document.getElementById("profile-dropdown-menu");
    if (dropMenu) dropMenu.classList.toggle("hidden");
}

// 3. Open Account Modal and Populating Values dynamically
function showCurrentUserProfile() {
    const dropMenu = document.getElementById("profile-dropdown-menu");
    if (dropMenu) dropMenu.classList.add("hidden");

    const user = firebase.auth().currentUser;
    if (!user) {
        alert("No active session found. Please log in.");
        return;
    }

    isDirectAccountPropertiesView = true;
    
    // Look for matching data inside Firestore members collection
    firebase.firestore().collection('members').get().then(snapshot => {
        let matchedProfile = null;
        snapshot.forEach(doc => {
            const data = doc.data();
            data.id = doc.id;
            if ((data.email && data.email.toLowerCase() === user.email.toLowerCase()) || 
                (data.name && user.email.toLowerCase().includes(data.name.split(' ')[0].toLowerCase()))) {
                matchedProfile = data;
            }
        });

        if (matchedProfile) {
            populateAndOpenModal(matchedProfile);
        } else {
            // Build fallback package from user session state if no member record exists yet
            let displayName = user.displayName;
            if (!displayName && user.email) {
                const localPart = user.email.split('@')[0];
                displayName = localPart.charAt(0).toUpperCase() + localPart.slice(1);
            }
            populateAndOpenModal({
                id: "firebase-auth-user",
                name: displayName,
                phone: user.phoneNumber || "",
                address: "",
                dob: "",
                dept: "Others",
                occ: "Work",
                target: "Not Configured",
                photo: ""
            });
        }
    }).catch(err => console.error("Error reading data profile registry:", err));
}

function populateAndOpenModal(m) {
    document.getElementById("view-member-doc-id").value = m.id;
    document.getElementById("view-name-input").value = m.name || "";
    document.getElementById("view-phone-input").value = m.phone || "";
    document.getElementById("view-dob-input").value = m.dob || "";
    document.getElementById("view-address-input").value = m.address || "";
    personalPhotoBase64 = m.photo || "";

    document.getElementById("view-badge-dept").innerText = m.dept || "Others";
    const affilText = m.subData ? `${m.occ || ""} (${m.target || ""} — ${m.subData})` : `${m.occ || ""} (${m.target || ""})`;
    document.getElementById("view-affiliation").innerText = affilText;
    document.getElementById("view-attendance-stats").innerText = `${m.attendance === "Inactive" ? '0' : '1'} active out of 1 records`;

    const avatarBox = document.getElementById("view-avatar-box");
    if (m.photo) {
        avatarBox.innerHTML = `<img src="${m.photo}" class="w-full h-full object-cover">`;
    } else {
        avatarBox.innerHTML = (m.name || "A").charAt(0).toUpperCase();
    }

    document.getElementById("view-member-modal").classList.remove("hidden");
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeViewModal() {
    isDirectAccountPropertiesView = false;
    document.getElementById("view-member-modal").classList.add("hidden");
}

function previewPersonalAvatarImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            personalPhotoBase64 = e.target.result;
            document.getElementById("view-avatar-box").innerHTML = `<img src="${personalPhotoBase64}" class="w-full h-full object-cover">`;
        }
        reader.readAsDataURL(file);
    }
}

// 4. Save updates to Firestore
function handlePersonalProfileSave(e) {
    e.preventDefault();
    const docId = document.getElementById("view-member-doc-id").value;
    if(!docId) return;

    const updatedPackage = {
        name: document.getElementById("view-name-input").value,
        phone: document.getElementById("view-phone-input").value,
        dob: document.getElementById("view-dob-input").value,
        address: document.getElementById("view-address-input").value,
        photo: personalPhotoBase64
    };

    const db = firebase.firestore();

    if (docId === "firebase-auth-user") {
        const user = firebase.auth().currentUser;
        if (user) {
            db.collection('members').add({
                ...updatedPackage,
                email: user.email,
                attendance: "Active",
                dept: "Others",
                occ: "Work",
                target: "Not Configured"
            })
            .then(() => {
                alert("Your profile settings have been updated successfully.");
                closeViewModal();
                location.reload();
            })
            .catch(err => alert("Error saving profile: " + err.message));
        }
    } else {
        db.collection('members').doc(docId).update(updatedPackage)
        .then(() => {
            alert("Your profile settings have been updated successfully.");
            closeViewModal();
            location.reload();
        })
        .catch(err => alert("Error updating personal configurations: " + err.message));
    }
}

// 5. Sign Out Action Routine
function handleSystemSignOut() {
    if (confirm("Are you sure you want to sign out?")) {
        firebase.auth().signOut()
            .then(() => { window.location.href = "login.html"; })
            .catch(err => alert("Error signing out: " + err.message));
    }
}