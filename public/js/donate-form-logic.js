// Donate form submission to Supabase

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('donateForm');
    if (!form) return;

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

        // Gather form data
        const data = {
            user_id: session.user.id,
            donor_full_name: form.donor_full_name.value,
            donor_phone: form.donor_phone.value,
            donor_email: form.donor_email.value,
            preferred_contact_method: form.preferred_contact_method.value,
            item_type: form.item_type.value,
            item_specific: form.item_specific.value,
            quantity: parseInt(form.quantity.value, 10),
            item_condition: form.item_condition.value,
            donation_method: form.donation_method.value,
            pickup_dropoff_address: form.pickup_dropoff_address.value,
            preferred_date_time: form.preferred_date_time.value,
            notes: form.notes.value,
            evidence_url: form.evidence_url.value,
            created_at: new Date().toISOString()
        };

        // Verification prompt
        if (!confirm('Are you sure you want to submit your donation?')) {
            return;
        }

        // Insert into Supabase
        const { error } = await supabase.from('donate').insert([data]);
        if (error) {
            alert('Submission failed: ' + error.message);
            return;
        }

        alert('Donation submitted! A receipt will be sent to your email.');
        window.location.href = 'donate.html';
    });
});
