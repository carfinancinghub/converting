// Shared rendering utilities for all roles

function renderDashboards() {
    console.log('Rendering dashboards for role:', currentUser ? currentUser.role : 'none');
    if (!currentUser) return;

    const role = currentUser.role;
    const profileDiv = document.getElementById(`${role}-profile`);
    if (profileDiv) {
        profileDiv.textContent = `Logged in as ${currentUser.userId}`;
    }

    const globalSearch = document.getElementById('global-search')?.value.toLowerCase() || '';

    switch (role) {
        case 'seller':
            renderSellerDashboard(globalSearch);
            break;
        case 'buyer':
            renderBuyerDashboard(globalSearch);
            break;
        default:
            console.error('Unknown role:', role);
    }

    renderNotifications(role);
}

function renderNotifications(role) {
    console.log(`Rendering notifications for ${role}`);
    const notificationCount = document.getElementById(`${role}-notifications`);
    const notificationLog = document.getElementById(`${role}-notification-log`);
    if (!notificationCount || !notificationLog) return;

    const notifications = jobsState.notifications[role] || [];
    notificationCount.textContent = notifications.length;

    notificationLog.innerHTML = '';
    notifications.forEach(notif => {
        const div = document.createElement('div');
        div.textContent = `${notif.message} - ${new Date(notif.timestamp).toLocaleString()}`;
        notificationLog.appendChild(div);
    });
}

function filterItems(items, role, globalSearch = '') {
    const searchInput = document.getElementById(`${role}-search`)?.value.toLowerCase() || '';
    const statusFilter = document.getElementById(`${role}-filter-status`)?.value || '';
    const locationFilter = document.getElementById(`${role}-filter-location`)?.value || '';
    const vehicleFilter = document.getElementById(`${role}-filter-vehicle`)?.value || '';

    return items.filter(item => {
        const localSearch = searchInput || globalSearch;
        const matchesSearch = (item.vehicle?.toLowerCase().includes(localSearch) ||
                              item.pickup?.toLowerCase().includes(localSearch) ||
                              item.delivery?.toLowerCase().includes(localSearch) ||
                              item.location?.toLowerCase().includes(localSearch));
        const matchesStatus = !statusFilter || item.status === statusFilter;
        const matchesLocation = !locationFilter || item.pickup === locationFilter || item.location === locationFilter;
        const matchesVehicle = !vehicleFilter || item.vehicle === vehicleFilter;

        return matchesSearch && matchesStatus && matchesLocation && matchesVehicle;
    });
}

// Export shared functions
window.renderDashboards = renderDashboards;
window.renderNotifications = renderNotifications;
window.filterItems = filterItems;