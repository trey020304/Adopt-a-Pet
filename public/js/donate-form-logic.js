// Donate form submission to Supabase

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('donateForm');
    if (!form) return;

        // Handle file preview (supports multiple, max 4)
        const photoInput = form.querySelector('input[name="donation_photo"]');
        if (photoInput) {
            photoInput.addEventListener('change', (e) => {
                const files = e.target.files;
                if (files.length > 4) {
                    alert('Please select up to 4 images only.');
                    e.target.value = '';
                    document.getElementById('donationPreview').innerHTML = '';
                    return;
                }
                previewFile(files, 'donationPreview');
            });
        }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
            alert('You must be logged in to submit a donation.');
            window.location.href = 'login.html';
            return;
        }

        // Debug: log current session user id
        try {
            console.log('[DonateForm] session.user.id ->', session.user.id);
        } catch (e) {
            console.warn('[DonateForm] no session.user.id available', e);
        }

        // Upload photos if provided (up to 4)
        let photoUrls = [];
        if (photoInput && photoInput.files.length > 0) {
            if (photoInput.files.length > 4) {
                alert('Please select up to 4 images only.');
                return;
            }
            const { urls, errors } = await uploadFilesToSupabase(photoInput.files, 'donation', 'donate/photos');
            if (errors && errors.length > 0) {
                console.error('Upload errors:', errors);
                const msgs = errors.map(e => `${e.file}: ${e.error}`).join('\n');
                alert('Upload failed:\n' + msgs);
                return;
            }
            photoUrls = urls;
        }

        // Collect all selected donation items
        const items = [];
        
        // Map of item names for the form
        const itemNames = {
            'item_pet_food_cat': 'Pet Food (Cat)',
            'item_pet_food_dog': 'Pet Food (Dog)',
            'item_bowls': 'Bowls',
            'item_toys': 'Toys',
            'item_leashes': 'Leashes',
            'item_collars': 'Collars',
            'item_litter': 'Litter',
            'item_blankets': 'Blankets',
            'item_bedding': 'Bedding',
            'item_medicine': 'Medicine',
            'item_grooming': 'Grooming supplies',
            'item_crates': 'Crates/Cages',
            'item_cleaning': 'Cleaning supplies'
        };

        // Collect items from checkboxes
        for (const [fieldName, displayName] of Object.entries(itemNames)) {
            const checkbox = form.querySelector(`input[name="${fieldName}"]`);
            const qtyFieldName = fieldName.replace('item_', 'qty_');
            const qtyInput = form.querySelector(`input[name="${qtyFieldName}"]`);
            
            if (checkbox && checkbox.checked && qtyInput && qtyInput.value) {
                items.push({
                    name: displayName,
                    quantity: parseInt(qtyInput.value, 10)
                });
            }
        }

        // Check for "Other" item
        const otherCheckbox = form.querySelector('input[name="item_other_check"]');
        const otherDesc = form.querySelector('input[name="item_other"]');
        const otherQty = form.querySelector('input[name="qty_other"]');
        if (otherCheckbox && otherCheckbox.checked && otherDesc && otherDesc.value && otherQty && otherQty.value) {
            items.push({
                name: 'Other',
                description: otherDesc.value,
                quantity: parseInt(otherQty.value, 10)
            });
        }

        // Validate that at least one item was selected
        if (items.length === 0) {
            alert('Please select at least one item to donate.');
            return;
        }

        // Gather form data
        const data = {
            user_id: session.user.id,
            donor_full_name: form.donor_full_name.value,
            donor_phone: form.donor_phone.value,
            donor_email: form.donor_email.value,
            preferred_contact_method: form.preferred_contact_method.value,
            items: items, // New: array of items with quantities
            donation_method: form.donation_method.value,
            pickup_dropoff_address: form.pickup_dropoff_address.value,
            preferred_date_time: form.preferred_date_time.value,
            notes: form.notes.value,
            evidence_url: JSON.stringify(photoUrls),
            created_at: new Date().toISOString()
        };

        // Verification prompt
        if (!confirm('Are you sure you want to submit your donation?')) {
            return;
        }

        // Debug: show payload just before insert
        console.log('[DonateForm] inserting donation row', { user_id: data.user_id, items: data.items, evidence_url: data.evidence_url, created_at: data.created_at });

        // Insert into Supabase
        const { error } = await supabase.from('donate').insert([data]);
        if (error) {
            console.error('[DonateForm] insert error ->', error);
            alert('Submission failed: ' + error.message);
            return;
        }

        alert('Donation submitted! A receipt will be sent to your email.');
        window.location.href = 'donate.html';
    });
});
