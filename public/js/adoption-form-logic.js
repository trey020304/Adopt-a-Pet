// Adoption form submission to Supabase

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('adoptionForm');
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
            alert('You must be logged in to submit an adoption application.');
            window.location.href = 'login.html';
            return;
        }

        // Gather form data
        const data = {
            user_id: session.user.id,
            full_name: form.fullName.value,
            phone_number: form.phone.value,
            email_address: form.email.value,
            home_address: form.address.value,
            preferred_contact_method: form.contactMethod.value,
            other_pets: form.havePets.value === 'Yes',
            pets_vaccinated_spayed: form.vaccinatedStatus.value,
            experience_with_pets: form.experience.value,
            hours_pet_left_alone: parseInt(form.hoursAlone.value, 10),
            pet_stay_location: form.dayNight.value,
            preferred_energy_level: form.energy.value,
            reason_for_adoption: form.reason.value,
            can_cover_costs: form.coverCosts.value === 'Yes',
            willing_vet_checkups: form.vetCheckups.value === 'Yes',
            agree_terms: form.agreePolicy.checked,
            created_at: new Date().toISOString()
        };

        // Verification prompt
        if (!confirm('Are you sure you want to submit your adoption application?')) {
            return;
        }

        // Insert into Supabase
        const { error } = await supabase.from('adopt').insert([data]);
        if (error) {
            alert('Submission failed: ' + error.message);
            return;
        }

        alert('Application submitted! A receipt will be sent to your email.');
        window.location.href = 'adoption.html';
    });
});
