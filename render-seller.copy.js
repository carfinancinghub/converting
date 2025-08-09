// Seller-specific rendering functions

function renderSellerDashboard(globalSearch) {
    console.log('Rendering seller dashboard');
    const draftsDiv = document.getElementById('seller-drafts');
    const listingsDiv = document.getElementById('seller-listings');
    const historyDiv = document.getElementById('seller-job-history');
    if (!draftsDiv || !listingsDiv || !historyDiv) return;

    const drafts = filterItems(jobsState.listings.filter(listing => listing.sellerId === currentUser.userId && (listing.status === 'Draft' || listing.status === 'Pending Inspection')), 'seller', globalSearch);
    const myListings = filterItems(jobsState.listings.filter(listing => listing.sellerId === currentUser.userId && listing.status === 'Listed'), 'seller', globalSearch);
    const soldListings = filterItems(jobsState.listings.filter(listing => listing.sellerId === currentUser.userId && (listing.status === 'Sold' || listing.status === 'In Transit')), 'seller', globalSearch);

    draftsDiv.innerHTML = '';
    if (drafts.length === 0) {
        draftsDiv.innerHTML = '<p>No drafts match your search.</p>';
    } else {
        drafts.forEach(listing => {
            const card = createSellerListingCard(listing);
            draftsDiv.appendChild(card);
        });
    }

    listingsDiv.innerHTML = '';
    if (myListings.length === 0) {
        listingsDiv.innerHTML = '<p>No active listings match your search.</p>';
    } else {
        myListings.forEach(listing => {
            const card = createSellerListingCard(listing);
            listingsDiv.appendChild(card);
        });
    }

    historyDiv.innerHTML = '';
    if (soldListings.length === 0) {
        historyDiv.innerHTML = '<p>No sold or in-transit vehicles match your search.</p>';
    } else {
        soldListings.forEach(listing => {
            const card = createSellerListingCard(listing);
            historyDiv.appendChild(card);
        });
    }
}

function createSellerListingCard(listing) {
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

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';
    let buttons = `<button onclick="editListing('${listing.id}')">Edit</button>`;
    if (listing.status === 'Draft' || listing.status === 'Pending Inspection') {
        buttons += `<button onclick="openListNowModal('${listing.id}')">List Now</button>`;
    } else if (listing.status === 'Listed') {
        buttons += `<button onclick="openDeliveryModal('${listing.id}')">Post Delivery</button>`;
    }
    actionsDiv.innerHTML = buttons;
    card.appendChild(actionsDiv);

    card.addEventListener('mouseenter', () => card.classList.add('show-popup'));
    card.addEventListener('mouseleave', () => card.classList.remove('show-popup'));
    return card;
}

// Export Seller-specific functions
window.renderSellerDashboard = renderSellerDashboard;