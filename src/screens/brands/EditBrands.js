import React from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Base_url } from "../../utils/Base_url";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";

const EditBrands = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  setUsers,
  singleUser
}) => {
  
  const bannerSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Construct the payload
    const parms = {
      name: formData.get("name"),
    };

    // Append the file if available
    const file = formData.get("image");
    if (file) {
      formData.append("image", file);
    }

    try {
      const response = await axios.put(
        `${Base_url}/brands/update/${singleUser?._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      if (response.data.status === "ok") {
        const res = await axios.get(`${Base_url}/brands/getAll`);
        setUsers(res.data.data.data);
        setIsModalOpen(false);
        toast.success('Brand updated successfully!');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Update Brand</h1>
          <MdClose 
            onClick={() => setIsModalOpen(false)} 
            size={25} 
            className="cursor-pointer"
          />
        </div>
        <hr />
        <form onSubmit={bannerSubmit} className="mt-5">
          <div className="flex gap-5 flex-wrap">
            <div className="w-full  mb-4">
              <Input
                label="Name"
                name="name"
                className="border w-full py-3 px-2"
                defaultValue={singleUser?.name || ""}
              />
            </div>
            <div className="w-full  mb-4">
              <Input
                label="Image"
                name="image"
                className="border w-full py-3 px-2"
                type="file" // Handle file input
              />
            </div>
          </div>
          <Button
            label="Update"
            type="submit"
            className="bg-primary mt-3 uppercase text-white py-2 px-4 w-full"
          />
        </form>
      </div>
    </Modal>
  );
};

export default EditBrands;
