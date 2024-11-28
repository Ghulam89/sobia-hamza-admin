import React, { useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";

const AddBrand = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  setUsers,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const bannerSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", e.target.name.value);
    formData.append("image", selectedImage);

    if (!formData.get("name")) {
      toast.error("Must enter a brand name!");
      return;
    }

    if (!formData.get("image")) {
      toast.error("Must upload an image!");
      return;
    }

    try {
      const response = await axios.post(`${Base_url}/brands/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
       

      if (response?.status ===200) {
        const res = await axios.get(`${Base_url}/brands/getAll`);
        setUsers(res.data?.data?.data);
        setIsModalOpen(false);
        toast(response.data.message);
      } else {
        toast(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div>
          <div className="p-3 flex justify-between items-center">
            <div></div>
            <h1 className="capitalize h4 font-semibold">Add Brand</h1>
            <MdClose onClick={() => setIsModalOpen(false)} size={25} />
          </div>
          <hr />
          <div className="p-5">
            <form onSubmit={bannerSubmit}>
              <div className="flex gap-5 flex-wrap">
                <div className="w-[100%]">
                  <Input
                    label={"Name"}
                    name={"name"}
                    className={"border w-full py-3"}
                  />
                </div>
                <div className="w-[100%]">
                  <Input
                    label={"Image"}
                    name={"image"}
                    type={'file'}
                    onChange={handleImageChange}
                    className={"border w-full py-3"}
                  />
                </div>
              </div>
              <Button
                label={"Submit"}
                type={"submit"}
                className={"bg-primary mt-3 uppercase text-white py-2 w-full"}
              />
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddBrand;
