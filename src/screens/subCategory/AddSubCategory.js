import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../components/Button";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";

const AddSubCategory = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  setUsers,
}) => {
  const [loading, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    axios
      .get(`${Base_url}/category/getAll`)
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    categoryId: Yup.string().required("Category selection is required"),
  });

  // Form Submit Handler
  const onSubmit = async (values, { resetForm }) => {
    setLoader(true);

    try {
      const response = await axios.post(`${Base_url}/subcategory/create`, values);
      if (response.status === 200) {
        const res = await axios.get(`${Base_url}/subcategory/getAll`);
        setUsers(res.data.data);
        setIsModalOpen(false);
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal} className={"rounded-md"}>
        <div>
          <div className="p-3 flex justify-between items-center">
            <h1 className="capitalize h4 font-semibold">Add Sub Categories</h1>
            <MdClose
              className="cursor-pointer"
              onClick={() => setIsModalOpen(false)}
              size={25}
            />
          </div>
          <hr />
          <div className="p-5">
            <Formik
              initialValues={{
                title: "",
                categoryId: "",
              }}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="flex gap-5 flex-wrap">
                    {/* Category Select */}
                    <div className="w-[100%]">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Categories
                      </label>
                      <Field
                        as="select"
                        name="categoryId"
                        className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                      >
                        <option value="" label="Select categories" />
                        {categories.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.title}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="categoryId"
                        component="div"
                        className="text-red text-sm mt-1"
                      />
                    </div>

                    {/* Title Input */}
                    <div className="w-[100%]">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Title
                      </label>
                      <Field
                        name="title"
                        type="text"
                        placeholder="Enter title"
                        className="border w-full py-3 px-2 rounded-md"
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="text-red text-sm mt-1"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  {loading ? (
                    <button
                      disabled
                      type="button"
                      className="w-full h-11 bg-primary border-none outline-none rounded-lg mt-4 shadow-sm cursor-pointer text-lg text-white font-semibold"
                    >
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 mr-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      Loading...
                    </button>
                  ) : (
                    <Button
                      label={"Submit"}
                      type={"submit"}
                      className={"bg-primary mt-3 uppercase text-white py-2 w-full"}
                    />
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddSubCategory;
