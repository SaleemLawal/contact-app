import React from "react";

interface HeaderProps {
  toggleModal: (param: boolean) => void;
  contactNum: number;
}

const Header: React.FC<HeaderProps> = ({ toggleModal, contactNum }) => {
  return (
    <div>
      <header className="header">
        <div className="container">
          <h3>Contact List ({contactNum})</h3>
          <button onClick={() => toggleModal(true)} className="btn">
            <i className="bi bi-plus-square"></i>Add New Contact
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;
