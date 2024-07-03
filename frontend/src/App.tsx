import { FormEvent, useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import { getContacts, saveContact, updatePhoto } from "./api/contactService";
import { dataElement, contact } from "./util";
import ContactList from "./components/ContactList";
import { Navigate, Route, Routes } from "react-router-dom";
import ContactDetail from "./components/ContactDetail";
import { toastError, toastSuccess } from "./api/ToastService";
import { ToastContainer } from "react-toastify";

function App() {
  const [data, setData] = useState<dataElement>({
    totalElements: 0,
    totalPages: 0,
    content: [],
    numberOfElements: 0,
  });
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [file, setFile] = useState<File | null>(null);
  const [values, setValues] = useState<contact>({
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    status: "",
  });

  const toggleModal = (show: boolean) => {
    if (modalRef.current) {
      show ? modalRef.current.showModal() : modalRef.current.close();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    } else {
      setFile(null);
    }
  };

  const getAllContacts = async (page = 0, size = 5) => {
    try {
      setCurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data);
    } catch (err) {
      if (err instanceof Error) {
        toastError(err.message);
      } else {
        toastError("An unknown error occurred");
      }
    }
  };

  const handleNewContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await saveContact(values);

      if (file) {
        const formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("id", data.id);
        await updatePhoto(formData);
        toggleModal(false);
        setFile(null);
        if (fileRef.current) {
          fileRef.current.value = "";
        }
        setValues({
          name: "",
          email: "",
          phone: "",
          address: "",
          title: "",
          status: "",
        });
        getAllContacts();
        toastSuccess("Contacts Saved")

      }
    } catch (err) {
      if (err instanceof Error) {
        toastError(err.message);
      } else {
        toastError("An unknown error occurred");
      }
    }
  };

  const updateContact = async (contact: contact) => {
    try{
      await saveContact(contact)
      getAllContacts()
      toastSuccess("Contact Updated")
    }catch(err){
      if (err instanceof Error) {
        toastError(err.message);
      } else {
        toastError("An unknown error occurred");
      }
    }
  };
  
  const updateImage = async (formData: FormData) => {
    try{
      await updatePhoto(formData)
    }catch(err){
      if (err instanceof Error) {
        toastError(err.message);
      } else {
        toastError("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <>
      <Header toggleModal={toggleModal} contactNum={data.totalElements} />
      <main>
        <div className="main">
          <div className="container"></div>
          <Routes>
            <Route path="/" element={<Navigate to={"/contacts"} />} />
            <Route
              path="/contacts"
              element={
                <ContactList
                  data={data}
                  currentPage={currentPage}
                  getAllContacts={getAllContacts}
                />
              }
            />
            <Route path="/contacts/:id" element = {<ContactDetail updateContact={updateContact} updateImage={updateImage} refreshContacts ={getAllContacts}/>}/>
          </Routes>
        </div>
      </main>

      {/* {modal} */}
      <dialog className="modal" id="modal" ref={modalRef}>
        <div className="modal__header">
          <h3>New Contact</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewContact}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Name</span>
                <input
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  name="name"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input
                  type="text"
                  value={values.email}
                  onChange={handleChange}
                  name="email"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input
                  type="text"
                  value={values.title}
                  onChange={handleChange}
                  name="title"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input
                  type="text"
                  value={values.phone}
                  onChange={handleChange}
                  name="phone"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input
                  type="text"
                  value={values.address}
                  onChange={handleChange}
                  name="address"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Account Status</span>
                <input
                  type="text"
                  value={values.status}
                  onChange={handleChange}
                  name="status"
                  required
                />
              </div>
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  name="photo"
                  ref={fileRef}
                  required
                />
              </div>
            </div>
            <div className="form_footer">
              <button
                onClick={() => toggleModal(false)}
                type="button"
                className="btn btn-danger"
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Save
              </button>

 
            </div>
          </form>
        </div>
      </dialog>
      <ToastContainer />
    </>
  );
}

export default App;
