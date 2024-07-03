import React, { FormEvent, useEffect, useRef, useState } from "react";
import { contact } from "../util";
import { getContact, deleteContact } from "../api/contactService";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toastError, toastSuccess } from "../api/ToastService";

interface props {
  updateContact: (params: contact) => Promise<void>;
  updateImage: (params: FormData) => Promise<void>;
  refreshContacts: () => Promise<void>;
}
const ContactDetail: React.FC<props> = ({ updateContact, updateImage, refreshContacts }) => {
  const [contact, setContact] = useState<contact>({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    status: "",
    photoUrl: "",
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { id } = useParams<string>();
  const navigate = useNavigate();

  const fetchContact = async (id: string) => {
    try {
      const { data } = await getContact(id);
      setContact(data);
    } catch (err) {
      if (err instanceof Error) {
        toastError(err.message);
      } else {
        toastError("An unknown error occurred");
      }
    }
  };

  const selectImage = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  useEffect(() => {
    if (id) {
      fetchContact(id);
    }
  }, [id]);

  const updatePhoto = async (file: File) => {
    if (!id) return;
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("id", id);
      await updateImage(formData);
      setContact((prev) => ({
        ...prev,
        photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}`,
      }));
      toastSuccess("Photo Updated");
    } catch (err) {
      if (err instanceof Error) {
        toastError(err.message);
      } else {
        toastError("An unknown error occurred");
      }
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      updatePhoto(files[0]);
    }
  };
  const onUpdateContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateContact(contact);
    if (id) fetchContact(id);
    navigate("/");
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setContact({
      ...contact,
      [name]: value,
    });
  };

  const handleDelete = async () => {
    if (contact?.id) {
      await deleteContact(contact.id);
      refreshContacts();
      navigate("/");
    }
  };

  return (
    <div className="container">
      <Link to={"/"} className="link">
        {" "}
        <i className="bi bi-arrow-left"></i>Back to list
      </Link>

      <div className="profile">
        <div className="profile__details">
          <img
            src={contact.photoUrl}
            alt={`Profile photo of ${contact.name}`}
          />
          <div className="profile__metadata">
            <p className="profile__name">{contact.name}</p>
            <p className="profile__muted">
              {" "}
              JPG, GIF, or PNG. Max size of 10MG
            </p>
            <button onClick={selectImage} className="btn">
              <i className="bi bi-cloud-upload"></i>Change Photo
            </button>
          </div>
        </div>
        <div className="profile__settings">
          <div>
            <form onSubmit={onUpdateContact} className="form">
              <div className="user-details">
                <input
                  type="hidden"
                  defaultValue={contact.id}
                  name="id"
                  required
                />
                <div className="input-box">
                  <span className="details">Name</span>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={onChange}
                    name="name"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Email</span>
                  <input
                    type="text"
                    value={contact.email}
                    onChange={onChange}
                    name="email"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Phone</span>
                  <input
                    type="text"
                    value={contact.phone}
                    onChange={onChange}
                    name="phone"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Address</span>
                  <input
                    type="text"
                    value={contact.address}
                    onChange={onChange}
                    name="address"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Title</span>
                  <input
                    type="text"
                    value={contact.title}
                    onChange={onChange}
                    name="title"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Status</span>
                  <input
                    type="text"
                    value={contact.status}
                    onChange={onChange}
                    name="status"
                    required
                  />
                </div>
              </div>
              <div className="form_footer">
                <button type="submit" className="btn">
                  Save
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <form style={{ display: "none" }}>
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          name="file"
          accept="image/*"
        ></input>
      </form>
    </div>
  );
};

export default ContactDetail;
