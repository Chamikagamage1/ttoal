document.addEventListener("DOMContentLoaded", function () {
    // Login Form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLoginFormSubmit);
    }

    // Register Form
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegisterFormSubmit);
    }

    // Admin Dashboard
    const adminDashboard = document.getElementById("adminDashboard");
    if (adminDashboard) {
        loadRegisteredUsers();
    }

    // Sidebar Account Summary Link
    const accountSummaryLink = document.querySelector(".sidebar a[href='account-summary.html']");
    if (accountSummaryLink) {
        accountSummaryLink.addEventListener("click", function () {
            window.location.href = "account-summary.html";
        });
    }
});

function handleLoginFormSubmit(event) {
    event.preventDefault();
    const vehicle = document.getElementById("vehicle").value.toUpperCase();
    const password = document.getElementById("password").value;
    const user = JSON.parse(localStorage.getItem(vehicle));

    if (user && user.password === password) {
        localStorage.setItem('currentUser', vehicle);
        window.location.href = 'profile.html';
    } else {
        alert('Invalid vehicle number or password');
    }
}

function handleRegisterFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const nic = document.getElementById("nic").value;
    const vehicleModel = document.getElementById("vehicleModel").value;
    const vehicle = document.getElementById("vehicle").value.toUpperCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const user = {
        name,
        email,
        phone,
        nic,
        vehicleModel,
        vehicle,
        password
    };

    localStorage.setItem(vehicle, JSON.stringify(user));
    alert("Registration successful! Please sign in.");
    window.location.href = "index.html";
}

function loadRegisteredUsers() {
    const usersTableBody = document.getElementById("usersTableBody");
    usersTableBody.innerHTML = "";

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const user = JSON.parse(localStorage.getItem(key));

        if (user && user.vehicle) {
            const row = `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.vehicle}</td>
                    <td><button onclick="viewUser('${user.vehicle}')">View</button></td>
                </tr>
            `;
            usersTableBody.innerHTML += row;
        }
    }
}

function viewUser(vehicle) {
    localStorage.setItem("selectedUser", vehicle);
    window.location.href = "userdetails.html";
}

function loadUserDetails() {
    const vehicle = localStorage.getItem("selectedUser");
    const user = JSON.parse(localStorage.getItem(vehicle));
    if (user) {
        document.getElementById("userName").value = user.name;
        document.getElementById("userEmail").value = user.email;
        document.getElementById("userPhone").value = user.phone;
        document.getElementById("userNIC").value = user.nic;
        document.getElementById("userVehicleModel").value = user.vehicleModel;
        document.getElementById("userVehicle").value = user.vehicle;
    }
}

function togglePaymentOptions() {
    const paymentType = document.getElementById("paymentType").value;
    const northSailOptions = document.getElementById("northSailOptions");
    const otherHireOptions = document.getElementById("otherHireOptions");

    if (paymentType === "northSail") {
        northSailOptions.style.display = "block";
        otherHireOptions.style.display = "none";
        populateVehicleTypes();
    } else if (paymentType === "otherHire") {
        northSailOptions.style.display = "none";
        otherHireOptions.style.display = "block";
    } else {
        northSailOptions.style.display = "none";
        otherHireOptions.style.display = "none";
    }
}

function populateVehicleTypes() {
    const vehicleTypeSelect = document.getElementById("paymentVehicleType");
    vehicleTypeSelect.innerHTML = '<option value="">Select Vehicle Type</option>';
    const routes = JSON.parse(localStorage.getItem("routes")) || [];
    const vehicleTypes = [...new Set(routes.map(route => route.vehicleType))];
    vehicleTypes.forEach(vehicleType => {
        const option = document.createElement("option");
        option.value = vehicleType;
        option.textContent = vehicleType;
        vehicleTypeSelect.appendChild(option);
    });
}

function populateRouteNumbers() {
    const vehicleType = document.getElementById("paymentVehicleType").value;
    const routeNumberSelect = document.getElementById("paymentRouteNumber");
    routeNumberSelect.innerHTML = '<option value="">Select Route Number</option>';
    const routes = JSON.parse(localStorage.getItem("routes")) || [];
    const filteredRoutes = routes.filter(route => route.vehicleType === vehicleType);
    filteredRoutes.forEach(route => {
        const option = document.createElement("option");
        option.value = route.routeNumber;
        option.textContent = route.routeNumber;
        routeNumberSelect.appendChild(option);
    });
}

function populateRouteAmount() {
    const vehicleType = document.getElementById("paymentVehicleType").value;
    const routeNumber = document.getElementById("paymentRouteNumber").value;
    const routes = JSON.parse(localStorage.getItem("routes")) || [];
    const selectedRoute = routes.find(route => route.vehicleType === vehicleType && route.routeNumber === routeNumber);
    if (selectedRoute) {
        document.getElementById("amount").value = selectedRoute.routeAmount;
    } else {
        document.getElementById("amount").value = "";
    }
}

function addPayment() {
    const paymentType = document.getElementById("paymentType").value;
    let payment = {};

    if (paymentType === "northSail") {
        payment = {
            type: "North Sail",
            date: document.getElementById("northSailDate").value,
            inOut: document.getElementById("inOut").value,
            route: document.getElementById("paymentRouteNumber").value,
            amount: document.getElementById("amount").value,
            transactionDate: new Date().toLocaleDateString(),
            paymentDate: document.getElementById("northSailPaymentDate").value,
            vehicle: localStorage.getItem("selectedUser"),
            madeByAdmin: true
        };
    } else if (paymentType === "otherHire") {
        payment = {
            type: "Other Hire",
            reason: document.getElementById("reason").value,
            amount: document.getElementById("otherAmount").value,
            transactionDate: new Date().toLocaleDateString(),
            paymentDate: document.getElementById("otherHirePaymentDate").value,
            vehicle: localStorage.getItem("selectedUser"),
            madeByAdmin: true
        };
    } else {
        alert("Please select a payment type.");
        return;
    }

    const vehicle = localStorage.getItem("selectedUser");
    let user = JSON.parse(localStorage.getItem(vehicle));
    if (!user) {
        alert("User details not found.");
        return;
    }
    if (!user.payments) {
        user.payments = [];
    }
    user.payments.push(payment);
    localStorage.setItem(vehicle, JSON.stringify(user));
    alert("Payment added successfully!");

    // Clear all selections except payment type
    document.getElementById("northSailDate").value = "";
    document.getElementById("inOut").value = "";
    document.getElementById("paymentVehicleType").value = "";
    document.getElementById("paymentRouteNumber").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("northSailPaymentDate").value = "";
    document.getElementById("reason").value = "";
    document.getElementById("otherAmount").value = "";
    document.getElementById("otherHirePaymentDate").value = "";

    // Refresh the user details in the admin dashboard
    loadRegisteredUsers();
}

function togglePaymentHistory() {
    const paymentHistoryTable = document.getElementById("paymentHistoryTable");
    if (paymentHistoryTable.style.display === "none" || paymentHistoryTable.style.display === "") {
        viewPaymentHistory();
        paymentHistoryTable.style.display = "block";
    } else {
        paymentHistoryTable.style.display = "none";
    }
}

function viewPaymentHistory() {
    const selectedUserVehicle = localStorage.getItem("selectedUser");
    const user = JSON.parse(localStorage.getItem(selectedUserVehicle));
    const northSailHistoryBody = document.getElementById("northSailHistoryBody");
    const otherHireHistoryBody = document.getElementById("otherHireHistoryBody");
    const northSailMonthlyTotal = document.getElementById("northSailMonthlyTotal");
    const otherHireMonthlyTotal = document.getElementById("otherHireMonthlyTotal");
    northSailHistoryBody.innerHTML = "";
    otherHireHistoryBody.innerHTML = "";
    northSailMonthlyTotal.innerHTML = "";
    otherHireMonthlyTotal.innerHTML = "";

    const northSailTotals = {};
    const otherHireTotals = {};

    if (user && user.payments) {
        user.payments.slice().reverse().forEach(payment => {
            if (payment.vehicle === selectedUserVehicle) {
                const paymentMonth = new Date(payment.paymentDate).toLocaleString('default', { month: 'long', year: 'numeric' });

                if (payment.type === "North Sail") {
                    const row = `<tr>
                        <td>${payment.type}</td>
                        <td>${payment.date || ''}</td>
                        <td>${payment.inOut || ''}</td>
                        <td>${payment.route || ''}</td>
                        <td>${payment.amount}</td>
                        <td>${payment.paymentDate || ''}</td>
                    </tr>`;
                    northSailHistoryBody.innerHTML += row;

                    if (!northSailTotals[paymentMonth]) {
                        northSailTotals[paymentMonth] = 0;
                    }
                    northSailTotals[paymentMonth] += parseFloat(payment.amount);
                } else if (payment.type === "Other Hire") {
                    const row = `<tr>
                        <td>${payment.type}</td>
                        <td>${payment.reason || ''}</td>
                        <td>${payment.amount}</td>
                        <td>${payment.paymentDate || ''}</td>
                    </tr>`;
                    otherHireHistoryBody.innerHTML += row;

                    if (!otherHireTotals[paymentMonth]) {
                        otherHireTotals[paymentMonth] = 0;
                    }
                    otherHireTotals[paymentMonth] += parseFloat(payment.amount);
                }
            }
        });

        for (const [month, total] of Object.entries(northSailTotals)) {
            northSailMonthlyTotal.innerHTML += `<div>North Sail - ${month}: LKR ${total.toFixed(2)}</div>`;
        }

        for (const [month, total] of Object.entries(otherHireTotals)) {
            otherHireMonthlyTotal.innerHTML += `<div>Other Hire - ${month}: LKR ${total.toFixed(2)}</div>`;
        }
    }
}

// Load account summary and payment history
function loadAccountSummary() {
    const selectedUserVehicle = localStorage.getItem("selectedUser");
    if (!selectedUserVehicle) {
        window.location.href = "adminview.html"; // Redirect to admin view if no user is selected
        return;
    }

    const user = JSON.parse(localStorage.getItem(selectedUserVehicle));
    if (user) {
        // Update sidebar details
        document.getElementById("sidebarEmail").textContent = user.email;
        document.getElementById("sidebarPhone").textContent = user.phone;
    }

    // Load monthly income
    loadMonthlyIncome();
}

// Load monthly income (25th to 25th)
function loadMonthlyIncome() {
    const selectedUserVehicle = localStorage.getItem("selectedUser");
    const user = JSON.parse(localStorage.getItem(selectedUserVehicle));
    const payments = user.payments || [];

    // Group payments by month (25th to 25th)
    const monthlyIncome = {};
    payments.forEach(payment => {
        const paymentDate = new Date(payment.date);
        const monthStart = new Date(paymentDate);
        monthStart.setDate(25);
        if (paymentDate.getDate() < 25) {
            monthStart.setMonth(paymentDate.getMonth() - 1);
        }
        const monthKey = `${monthStart.getFullYear()}-${monthStart.getMonth() + 1}`;

        if (!monthlyIncome[monthKey]) {
            monthlyIncome[monthKey] = { total: 0, payments: [] };
        }
        monthlyIncome[monthKey].total += parseFloat(payment.amount);
        monthlyIncome[monthKey].payments.push(payment);
    });

    // Display monthly income
    const monthlyIncomeDiv = document.getElementById("monthlyIncome");
    let monthlyIncomeHTML = "";
    for (const [monthKey, data] of Object.entries(monthlyIncome)) {
        monthlyIncomeHTML += `
            <button onclick="toggleMonthHistory('${monthKey}')">
                ${monthKey} - LKR ${data.total.toFixed(2)}
            </button>
        `;
    }
    monthlyIncomeDiv.innerHTML = monthlyIncomeHTML;
}

// Toggle payment history and category breakdown for a specific month
function toggleMonthHistory(monthKey) {
    const paymentHistorySection = document.getElementById("paymentHistorySection");
    const categorySummary = document.getElementById("categorySummary");
    const isVisible = paymentHistorySection.style.display !== "none";

    if (isVisible) {
        paymentHistorySection.style.display = "none";
        categorySummary.style.display = "none";
    } else {
        viewMonthHistory(monthKey);
        paymentHistorySection.style.display = "block";
        categorySummary.style.display = "block";
    }
}

// View payment history for a specific month
function viewMonthHistory(monthKey) {
    const selectedUserVehicle = localStorage.getItem("selectedUser");
    const user = JSON.parse(localStorage.getItem(selectedUserVehicle));
    const payments = user.payments || [];

    const monthlyPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.date);
        const monthStart = new Date(paymentDate);
        monthStart.setDate(25);
        if (paymentDate.getDate() < 25) {
            monthStart.setMonth(paymentDate.getMonth() - 1);
        }
        const currentMonthKey = `${monthStart.getFullYear()}-${monthStart.getMonth() + 1}`;
        return currentMonthKey === monthKey;
    });

    // Show category summary
    const categoryTotalDiv = document.getElementById("categoryTotal");
    const northSailTotal = monthlyPayments.filter(p => p.type === "North Sail").reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const otherTotal = monthlyPayments.filter(p => p.type !== "North Sail").reduce((sum, p) => sum + parseFloat(p.amount), 0);
    categoryTotalDiv.innerHTML = `
        <p>North Sail Total: LKR ${northSailTotal.toFixed(2)}</p>
        <p>Other Hire Total: LKR ${otherTotal.toFixed(2)}</p>
    `;

    // Show payment history
    const paymentHistory = document.getElementById("paymentHistory");
    let paymentList = "";
    monthlyPayments.forEach(payment => {
        paymentList += `
            <li>
                <div class="transaction-date">${payment.date}</div>
                <div class="transaction-detail">${payment.type} ${payment.route ? `- Route: ${payment.route}` : ''} ${payment.reason ? `- Reason: ${payment.reason}` : ''}</div>
                <div class="transaction-amount">LKR ${payment.amount}</div>
            </li>
        `;
    });
    paymentHistory.innerHTML = paymentList;
}

// View payment history for a specific category
function viewCategoryHistory(category) {
    const selectedUserVehicle = localStorage.getItem("selectedUser");
    const user = JSON.parse(localStorage.getItem(selectedUserVehicle));
    const payments = user.payments || [];

    const categoryPayments = payments.filter(payment => payment.type === category);

    // Show payment history
    const paymentHistory = document.getElementById("paymentHistory");
    let paymentList = "";
    categoryPayments.forEach(payment => {
        paymentList += `
            <li>
                <div class="transaction-date">${payment.date}</div>
                <div class="transaction-detail">${payment.type} ${payment.route ? `- Route: ${payment.route}` : ''} ${payment.reason ? `- Reason: ${payment.reason}` : ''}</div>
                <div class="transaction-amount">LKR ${payment.amount}</div>
            </li>
        `;
    });
    paymentHistory.innerHTML = paymentList;
}

// Open sidebar
function openSidebar() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("summaryContainer").style.filter = "blur(5px)";
}

// Close sidebar
function closeSidebar() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("summaryContainer").style.filter = "blur(0px)";
}

// Logout
function logout() {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        const user = JSON.parse(localStorage.getItem(currentUser));
        localStorage.setItem(currentUser, JSON.stringify(user));
    }
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

document.addEventListener("click", function (event) {
    const sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "250px" && !sidebar.contains(event.target) && !event.target.classList.contains("menu-icon")) {
        closeSidebar();
    }
});