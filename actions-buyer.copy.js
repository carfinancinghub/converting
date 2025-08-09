// Buyer-specific action functions

function requestVerification(listingId) {
    console.log(`Requesting verification for listing ID: ${listingId}`);
    const listing = jobsState.listings.find(l => l.id === listingId);
    if (!listing || listing.status !== 'Listed') {
        alert('This listing is not available for verification.');
        return;
    }

    addNotification('seller', `Buyer requested verification for ${listing.vehicle}`);
    addNotification('buyer', `Verification requested for ${listing.vehicle}`);
}

function buyVehicle(listingId) {
    console.log(`Buying vehicle with listing ID: ${listingId}`);
    const listing = jobsState.listings.find(l => l.id === listingId);
    if (!listing || listing.status !== 'Listed') {
        alert('This listing is no longer available.');
        return;
    }

    listing.status = 'Sold';
    listing.buyerId = currentUser.userId;
    addNotification('seller', `Your vehicle ${listing.vehicle} has been sold to ${currentUser.userId}`);
    addNotification('buyer', `You purchased ${listing.vehicle} for ${listing.price}`);
    saveState();
    renderDashboards();
}

// Export Buyer-specific functions
window.requestVerification = requestVerification;
window.buyVehicle = buyVehicle;