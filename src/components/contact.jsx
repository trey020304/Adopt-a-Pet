
import React from "react";

export const Contact = () => {
  return (
    <div>
      <div id="contact">
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <div className="section-title text-center">
                <h2>Contact Information</h2>
                <p>
                  Reach out to us for website support. Below are our main contacts and developer team details.
                </p>
              </div>
              <div className="contact-info-list">
                <div className="contact-item">
                  <h3>Main Contact</h3>
                  <p>
                    <span><i className="fa fa-envelope-o"></i> Email:</span> adoptapet@petrescue.com
                  </p>
                  <p>
                    <span><i className="fa fa-phone"></i> Phone:</span> (555) 123-4567
                  </p>
                </div>
                <div className="contact-item">
                  <h3>Developer Team</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="dev-contact">
                        <strong>Mark Wilhelm Trevor K. Marcos</strong>
                        <p><i className="fa fa-envelope-o"></i> 22-04183@g.batstate-u.edu.ph</p>
                        <p><i className="fa fa-github"></i> <a href="https://github.com/trey020304" target="_blank" rel="noopener noreferrer">trey020304</a></p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="dev-contact">
                        <strong>Ron Gabriel B. Del Mundo</strong>
                        <p><i className="fa fa-envelope-o"></i> 22-02794@g.batstate-u.edu.ph</p>
                        <p><i className="fa fa-github"></i> <a href="https://github.com/Ronnieee1" target="_blank" rel="noopener noreferrer">Ronnieee1</a></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer">
        <div className="container text-center">
          <p>
            &copy; 2025 Adopt a Pet.
          </p>
        </div>
      </div>
    </div>
  );
};
