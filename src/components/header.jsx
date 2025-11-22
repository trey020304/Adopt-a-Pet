import React from "react";

export const Header = (props) => {
  const boldText = "you're not just helping cats and dogs";
  const paragraph = props.data ? props.data.paragraph : "Loading";

  let paragraphNode;
  if (props.data && paragraph.includes(boldText)) {
    const parts = paragraph.split(boldText);
    paragraphNode = (
      <p>
        {parts[0]}
        <strong>{boldText}</strong>
        {parts.slice(1).join(boldText)}
      </p>
    );
  } else {
    paragraphNode = <p>{paragraph}</p>;
  }

  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                {paragraphNode}
                <a
                  href="#features"
                  className="btn btn-custom btn-lg page-scroll"
                >
                  Learn More
                </a>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
