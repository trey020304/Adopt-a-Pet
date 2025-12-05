// Rescue form submission to Supabase

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('rescueForm');
    if (!form) return;

        // Handle file preview (supports multiple, max 4)
        const evidenceInput = form.querySelector('input[name="evidence"]');
        if (evidenceInput) {
            evidenceInput.addEventListener('change', (e) => {
                const files = e.target.files;
                if (files.length > 4) {
                    alert('Please select up to 4 files only.');
                    e.target.value = '';
                    document.getElementById('preview').innerHTML = '';
                    return;
                }
                previewFile(files, 'preview');
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
            alert('You must be logged in to submit a rescue request.');
            window.location.href = 'login.html';
            return;
        }

        // Debug: log current session user id so we can confirm against RLS
        try {
            console.log('[RescueForm] session.user.id ->', session.user.id);
        } catch (e) {
            console.warn('[RescueForm] no session.user.id available', e);
        }

        // Upload evidence files if provided (up to 4)
        let evidenceUrls = [];
        if (evidenceInput && evidenceInput.files.length > 0) {
            if (evidenceInput.files.length > 4) {
                alert('Please select up to 4 files only.');
                return;
            }
            const { urls, errors } = await uploadFilesToSupabase(evidenceInput.files, 'animal', 'rescue/evidence');
            if (errors && errors.length > 0) {
                console.error('Upload errors:', errors);
                const msgs = errors.map(e => `${e.file}: ${e.error}`).join('\n');
                alert('Upload failed:\n' + msgs);
                return;
            }
            evidenceUrls = urls;
        }

        // Gather form data
        const healthConditions = Array.from(form.querySelectorAll('input[name="health_condition"]:checked')).map(el => el.value);
        const behaviorConditions = Array.from(form.querySelectorAll('input[name="behavior_condition"]:checked')).map(el => el.value);

        const data = {
            user_id: session.user.id,
            reporter_full_name: form.reporter_full_name.value,
            reporter_phone: form.reporter_phone.value,
            reporter_email: form.reporter_email.value,
            preferred_contact_method: form.preferred_contact_method.value,
            relationship_to_animal: form.relationship_to_animal.value,
            animal_type: form.animal_type.value,
            estimated_age: form.estimated_age.value,
            size: form.size.value,
            sex: form.sex.value,
            breed: form.breed.value,
            location_details: form.location_details.value,
            animal_still_at_location: form.animal_still_at_location.value,
            safe_access: form.safe_access.value,
            health_condition: healthConditions,
            behavior_condition: behaviorConditions,
            urgency_level: form.urgency_level.value,
            evidence_url: JSON.stringify(evidenceUrls),
            created_at: new Date().toISOString()
        };

        // Verification prompt
        if (!confirm('Are you sure you want to submit your rescue request?')) {
            return;
        }

        // Debug: show payload just before insert
        console.log('[RescueForm] inserting rescue row', { user_id: data.user_id, evidence_url: data.evidence_url, created_at: data.created_at });

        // Insert into Supabase
        const { error } = await supabase.from('rescue').insert([data]);
        if (error) {
            console.error('[RescueForm] insert error ->', error);
            alert('Submission failed: ' + error.message);
            return;
        }

        alert('Rescue request submitted! A receipt will be sent to your email.');
        window.location.href = 'rescue.html';
    });
});
