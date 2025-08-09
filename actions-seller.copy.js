// Seller-specific action functions

function createListing() {
    console.log('Creating new listing');
    const listingId = document.getElementById('seller-listing-id').value;
    const vehicle = document.getElementById('seller-vehicle').value;
    const price = document.getElementById('seller-price').value;
    const location = document.getElementById('seller-location').value;
    const condition = document.getElementById('seller-condition').value;

    if (!vehicle) {
        alert('Please enter at least a vehicle to save a draft.');
        return;
    }

    if (listingId) {
        const listing = jobsState.listings.find(l => l.id === listingId);
        if (!listing) {
            alert('Listing not found.');
            return;
        }
        listing.vehicle = vehicle || listing.vehicle;
        listing.price = price || listing.price;
        listing.location = location || listing.location;
        listing.condition = condition || listing.condition;
        addNotification('seller', `Draft updated: ${vehicle}`);
    } else {
        const listing = {
            id: `listing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            vehicle,
            price: price || '',
            location: location || '',
            condition: condition || '',
            status: 'Draft',
            sellerId: currentUser.userId,
            buyerId: null,
            verified: false
        };
        jobsState.listings.push(listing);
        addNotification('seller', `New draft created: ${vehicle}`);
    }

    saveState();
    setView('seller', 'drafts');
    renderDashboards();
    resetSellerForm();
}

function editListing(listingId) {
    console.log(`Editing listing ID: ${listingId}`);
    const listing = jobsState.listings.find(l => l.id === listingId);
    if (!listing) return;

    document.getElementById('seller-form-title').textContent = 'Edit Listing';
    document.getElementById('seller-listing-id').value = listing.id;
    document.getElementById('seller-vehicle').value = listing.vehicle;
    document.getElementById('seller-price').value = listing.price;
    document.getElementById('seller-location').value = listing.location;
    document.getElementById('seller-condition').value = listing.condition;
    document.getElementById('seller-form-submit').textContent = 'Update Draft';
}

function openListNowModal(listingId) {
    console.log(`Opening list now modal for listing ID: ${listingId}`);
    const modal = document.getElementById('list-now-modal');
    document.getElementById('list-now-listing-id').value = listingId;
    modal.style.display = 'block';
}

function closeListNowModal() {
    console.log('Closing list now modal');
    const modal = document.getElementById('list-now-modal');
    modal.style.display = 'none';
    document.getElementById('list-now-form').reset();
}

function listNow() {
    console.log('Confirming listing');
    const listingId = document.getElementById('list-now-listing-id').value;
    const deliverToMechanic = document.getElementById('list-now-mechanic').checked;

    const listing = jobsState.listings.find(l => l.id === listingId);
    if (!listing) {
        alert('Listing not found.');
        return;
    }

    if (!listing.price || !listing.location || !listing.condition) {
        alert('Please complete all fields before listing.');
        return;
    }

    if (deliverToMechanic) {
        listing.status = 'Pending Inspection';
        const inspection = {
            id: `inspection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            vehicle: listing.vehicle,
            location: listing.location,
            status: 'Pending',
            listingId,
            mechanicId: null,
            result: null
        };
        jobsState.inspections.push(inspection);
        addNotification('seller', `Inspection requested for ${listing.vehicle}`);
        addNotification('mechanic', `New inspection available: ${listing.vehicle}`);
    } else {
        listing.status = 'Listed';
        addNotification('seller', `Listing published: ${listing.vehicle}`);
    }

    saveState();
    closeListNowModal();
    setView('seller', deliverToMechanic ? 'drafts' : 'active');
    renderDashboards();
}

function openDeliveryModal(listingId) {
    console.log(`Opening delivery modal for listing ID: ${listingId}`);
    const modal = document.getElementById('delivery-modal');
    const listing = jobsState.listings.find(l => l.id === listingId);
    if (!listing) return;

    document.getElementById('delivery-job-id').value = listingId;
    document.getElementById('delivery-pickup').value = listing.location;
    modal.style.display = 'block';
}

function closeDeliveryModal() {
    console.log('Closing delivery modal');
    const modal = document.getElementById('delivery-modal');
    modal.style.display = 'none';
    document.getElementById('delivery-form').reset();
}

function postDeliveryJob() {
    console.log('Posting delivery job');
    const listingId = document.getElementById('delivery-job-id').value;
    const pickup = document.getElementById('delivery-pickup').value;
    const delivery = document.getElementById('delivery-delivery').value;
    const distance = document.getElementById('delivery-distance').value;
    const enclosed = document.getElementById('delivery-enclosed').checked;
    const photosRequired = document.getElementById('delivery-photos').checked;
    const mechanicInspection = document.getElementById('delivery-mechanic').checked;
    const insuranceRequired = document.getElementById('delivery-insurance').checked;
    const financing = document.getElementById('delivery-financing').value;
    const escrowAmount = document.getElementById('delivery-escrow').value;

    if (!pickup || !delivery || !distance) {
        alert('Please fill in all required fields (Pickup, Delivery, Distance).');
        return;
    }

    const listing = jobsState.listings.find(l => l.id === listingId);
    if (!listing) {
        alert('Listing not found.');
        return;
    }

    const deliveryJob = {
        id: `delivery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        vehicle: listing.vehicle,
        pickup,
        delivery,
        distance: parseInt(distance),
        enclosed,
        photosRequired,
        mechanicInspection,
        insuranceRequired,
        financing: financing !== 'None' ? financing : null,
        escrowAmount: escrowAmount ? parseInt(escrowAmount) : null,
        status: 'Pending',
        listingId,
        haulerId: null,
        sellerId: currentUser.userId
    };

    jobsState.deliveryJobs.push(deliveryJob);
    listing.status = 'In Transit';
    addNotification('seller', `Delivery job posted for ${listing.vehicle} from ${pickup} to ${delivery}`);
    addNotification('hauler', `New delivery job available: ${listing.vehicle} from ${pickup} to ${delivery}`);
    if (mechanicInspection) {
        const inspection = {
            id: `inspection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            vehicle: listing.vehicle,
            location: delivery,
            status: 'Pending',
            listingId,
            mechanicId: null,
            result: null
        };
        jobsState.inspections.push(inspection);
        addNotification('mechanic', `New inspection available: ${listing.vehicle}`);
    }
    if (insuranceRequired) {
        addNotification('insurer', `Insurance quote requested for: ${listing.vehicle}`);
    }
    if (escrowAmount) {
        addNotification('freighttrust', `Escrow requested for: ${listing.vehicle} - $${escrowAmount}`);
    }

    saveState();
    closeDeliveryModal();
    renderDashboards();
}

function completeInspection(inspectionId, result) {
    console.log(`Completing inspection ID: ${inspectionId} with result: ${result}`);
    const inspection = jobsState.inspections.find(i => i.id === inspectionId);
    if (!inspection || inspection.status !== 'Pending') {
        alert('This inspection is no longer available.');
        return;
    }

    inspection.status = 'Completed';
    inspection.mechanicId = currentUser.userId;
    inspection.result = result;

    const listing = jobsState.listings.find(l => l.id === inspection.listingId);
    if (listing && listing.status === 'Pending Inspection') {
        listing.status = 'Listed';
        listing.verified = result === 'Pass';
        addNotification('seller', `Inspection completed for ${listing.vehicle}: ${result}. Listing is now live.`);
    }

    addNotification('mechanic', `Inspection completed for ${inspection.vehicle}: ${result}`);
    addNotification('seller', `Inspection for ${inspection.vehicle} completed: ${result}`);
    saveState();
    renderDashboards();
}

// Export Seller-specific functions
window.createListing = createListing;
window.editListing = editListing;
window.openListNowModal = openListNowModal;
window.closeListNowModal = closeListNowModal;
window.listNow = listNow;
window.openDeliveryModal = openDeliveryModal;
window.closeDeliveryModal = closeDeliveryModal;
window.postDeliveryJob = postDeliveryJob;
window.completeInspection = completeInspection;