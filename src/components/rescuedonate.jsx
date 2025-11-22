import React from "react";

export const RescueDonate = () => {
  return (
    <div id="rescue-donate-section" className="rescuedonate-bg">
      <div className="container">
        <div className="section-title rescuedonate-title text-center">
          <h2>Rescue &amp; Donate</h2>
          <p>
            Support our mission by rescuing animals in need or donating to help us continue our work.
          </p>
        </div>
        <div className="rescuedonate-row" style={{display: 'flex', justifyContent: 'center', alignItems: 'stretch', gap: '40px', flexWrap: 'wrap'}}>
          <div className="rescuedonate-col rescue-col" style={{background: 'rgba(255, 255, 255, 0.25)', borderRadius: '24px', padding: '40px 32px', boxShadow: '0 2px 24px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '280px', maxWidth: '420px', flex: '1 1 320px'}}>
            <img src="/img/sample_service/rescue.jpg" alt="Rescue" className="rescuedonate-img" style={{width: '320px', height: '200px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)'}} />
            <h3 className="rescuedonate-header text-center">Rescue</h3>
            <p className="rescuedonate-desc text-center">Join our rescue efforts to save and protect animals in need. Your support helps us provide shelter, medical care, and a second chance for every rescued pet.</p>
            <a href="/rescue.html" className="btn btn-custom rescuedonate-btn">Rescue</a>
          </div>
          <div className="rescuedonate-col donate-col" style={{background: 'rgba(255, 255, 255, 0.25)', borderRadius: '24px', padding: '40px 32px', boxShadow: '0 2px 24px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '280px', maxWidth: '420px', flex: '1 1 320px'}}>
            <img src="/img/sample_service/donate.jpg" alt="Donate" className="rescuedonate-img" style={{width: '320px', height: '200px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)'}} />
            <h3 className="rescuedonate-header text-center">Donate</h3>
            <p className="rescuedonate-desc text-center">Help us continue our mission by donating. Every contribution goes directly to the care, rescue, and adoption of animals, making a real difference in their lives.</p>
            <a href="/donate.html" className="btn btn-custom rescuedonate-btn">Donate</a>
          </div>
        </div>
      </div>
    </div>
  );
};
