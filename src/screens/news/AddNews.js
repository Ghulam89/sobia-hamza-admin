import React, { useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddNews = ({ isModalOpen, setIsModalOpen, closeModal, setUsers }) => {
  const [loading, setLoading] = useState(false);
  const [additionalImage, setAdditionalImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subContent, setSubContent] = useState("");

  // Quill editor configuration
  const modules = {
    toolbar: [
      [{ 'font': [] }, { 'size': [] }],
      [{ 'header': '1' }, { 'header': '2' }, { 'header': [3, 4, 5, 6] }, { 'font': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'link', 'image', 'video', 'color', 'background', 'align'
  ];

  const handleAdditionalImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setAdditionalImage(URL.createObjectURL(file));
      setImageFile(file);
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const handleContentChange = (value) => {
    setSubContent(value);
  };

  // Submit form and upload image
  const bannerSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!content.trim()) {
      toast.error("Content is required.");
      return;
    }
    if (!imageFile) {
      toast.error("An image is required.");
      return;
    }

    setLoading(true);

    // Creating a FormData object for the API call
    const params = new FormData();
    params.append('title', title);
    params.append('content', subContent);
    params.append('shortDescription', content);
    params.append('image', imageFile);

    try {
      // API call to submit the data
      const res = await axios.post(`${Base_url}/blog/create`, params, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res?.data?.status === 'success') {
        toast.success(res.data?.message);

        // Fetch updated blogs
        const blogsRes = await axios.get(`${Base_url}/blog/getAll?page=1`);
        setUsers(blogsRes?.data?.data);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Blog post submission failed:", error);
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div>
          <div className="p-3 flex justify-between items-center">
            <h1 className="capitalize h4 font-semibold">Add Blogs</h1>
            <MdClose onClick={() => setIsModalOpen(false)} size={25} />
          </div>
          <hr />
          <div className="p-5">
            <form onSubmit={bannerSubmit}>
              <div className="flex gap-5 flex-wrap">
                <div className="md:w-[100%] w-[100%]">
                  <Input
                    label={"Title"}
                    placeholder={"Enter title"}
                    name={"title"}
                    className={"border w-full py-3"}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="md:w-[100%] w-[100%]">
                  <Input
                    label={"Small Description"}
                    placeholder={"Enter Description"}
                    name={"content"}
                    className={"border w-full py-3"}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className="my-2 w-full">
                  <label htmlFor="additionalImageInput" className="block mt-2">
                    Blog Image
                  </label>
                  <input
                    accept="image/*"
                    onChange={handleAdditionalImageChange}
                    name="additionalImage"
                    type="file"
                    id="additionalImageInput"
                    className="border bg-lightGray w-full py-3 rounded-md px-3"
                  />
                  {additionalImage && (
                    <div className="mt-4 flex justify-start">
                      <img src={additionalImage} className="w-20 h-20 rounded-xl m-1" alt="Additional" />
                    </div>
                  )}
                </div>

                <div className="md:w-[100%] w-[100%]">
                  <label htmlFor="description" className="block mt-2">
                    Details
                  </label>

                  <ReactQuill
                    theme="snow"
                    value={subContent}
                    onChange={handleContentChange}
                    placeholder="Start writing your blog post here..."
                    modules={modules}
                    formats={formats}
                  />
                </div>
              </div>
              {loading ? (
                <button
                  disabled
                  type="button"
                  className="w-full h-11 bg-primary border-none outline-none rounded-lg mt-4 shadow-sm cursor-pointer text-lg text-white font-semibold"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5533C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7237 75.2124 7.5536C69.5422 4.3835 63.2754 2.54662 56.7378 2.13328C51.7663 1.79038 46.7978 2.57991 42.0635 4.46458C39.5147 5.48402 38.0532 8.01753 38.6903 10.4429C39.3274 12.8683 41.7717 14.3357 44.3205 13.7049C47.179 13.0359 50.2144 13.0398 52.9867 14.1086C55.759 15.1774 58.1379 17.7133 58.5379 21.0085C58.8836 23.7369 60.3949 26.1248 63.0482 27.7113C65.2906 29.0068 68.3964 28.8415 70.2979 27.2106C72.1994 25.5797 73.1596 22.9998 73.1105 20.3667C73.0394 18.8367 72.2063 17.3599 71.0174 16.5188C69.8285 15.6777 68.2963 15.6458 66.8527 16.4293C65.1907 17.2629 63.9637 18.7032 63.2429 20.3495C62.0532 21.9268 61.4738 23.6741 61.5761 25.5223C61.7132 26.7577 63.2326 27.9727 64.8664 27.6927C66.4481 27.4127 67.6917 26.4406 68.3413 25.1637C69.2448 23.3799 70.8157 21.5763 72.8223 20.7678C74.9535 19.9258 77.5063 19.2202 80.2829 19.4235C83.5221 19.6496 86.3895 21.3129 88.3674 23.8246C91.7197 28.4157 93.9689 34.7398 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Loading...
                </button>
              ) : (
                <Button
                  label={"Save"}
                  className="btn-primary bg-primary w-full mt-3"
                  type="submit"
                />
              )}
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddNews;
