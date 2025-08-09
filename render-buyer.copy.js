// Buyer-specific rendering functions

function renderBuyerDashboard(globalSearch) {
    console.log('Rendering buyer dashboard');
    const listingsDiv = document.getElementById('buyer-listings');
    const historyDiv = document.getElementById('buyer-job-history');
    if (!listingsDiv || !historyDiv) {
        console.error('Buyer dashboard elements missing');
        return;
    }

    const activeListings = filterItems(jobsState.listings.filter(listing => listing.status === 'Listed'), 'buyer', globalSearch);
    const purchaseHistory = filterItems(jobsState.listings.filter(listing => listing.status === 'Sold' && listing.buyerId === currentUser.userId), 'buyer', globalSearch);

    console.log('Active Listings:', activeListings.length, activeListings);
    console.log('Purchase History:', purchaseHistory.length, purchaseHistory);

    listingsDiv.innerHTML = '';
    if (activeListings.length === 0) {
        listingsDiv.innerHTML = '<p>No listings match your search.</p>';
    } else {
        activeListings.forEach(listing => {
            const card = createBuyerListingCard(listing);
            listingsDiv.appendChild(card);
        });
    }

    historyDiv.innerHTML = '';
    if (purchaseHistory.length === 0) {
        historyDiv.innerHTML = '<p>No purchase history matches your search.</p>';
    } else {
        purchaseHistory.forEach(listing => {
            const card = createBuyerListingCard(listing);
            historyDiv.appendChild(card);
        });
    }
}

function createBuyerListingCard(listing) {
    const card = document.createElement('div');
    card.className = 'listing-card';
    card.innerHTML = `
        <div class="top">
            <span>${listing.vehicle}</span>
            <span>${listing.status}${listing.verified ? ' (Verified)' : ''}</span>
        </div>
        <div class="details">
            <span>Price: ${listing.price || 'TBD'}</span>
            <span>Location: ${listing.location || 'TBD'}</span>
            <span>Condition: ${listing.condition || 'TBD'}</span>
        </div>
        <div class="popup">Details: ${listing.vehicle} - ${listing.price || 'TBD'}</div>
    `;

    if (listing.status === 'Listed') {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';
        actionsDiv.innerHTML = `
            <button onclick="buyVehicle('${listing.id}')">Buy Now</button>
            ${!listing.verified ? `<button onclick="requestVerification('${listing.id}')">Request Verification</button>` : ''}
        `;
        card.appendChild(actionsDiv);
    }

    card.addEventListener('mouseenter', () => card.classList.add('show-popup'));
    card.addEventListener('mouseleave', () => card.classList.remove('show-popup'));
    return card;
}

// Export Buyer-specific functions
window.renderBuyerDashboard = renderBuyerDashboard;