import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../components/Button";
import { MdClose } from "react-icons/md";
import Wrapper from "../Wrapper";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoader] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([
        "S", "M", "L", "XL", "XXL", "XXXL", 
        "28", "30", "32", "34", "36", "38", "40",
        "6", "7", "8", "9", "10", "11", "12"
    ]);
    const [discountPercentage, setDiscountPercentage] = useState(0);

    // Fetch categories and subcategories
    useEffect(() => {
        axios.get(`${Base_url}/category/getAll`).then((res) => setCategories(res.data.data)).catch(console.error);
        axios.get(`${Base_url}/subcategory/getAll`).then((res) => setSubCategories(res.data.data)).catch(console.error);
        axios.get(`${Base_url}/brands/getAll`).then((res) => setBrands(res.data.data)).catch(console.error);
    }, []);

    // Calculate discount percentage
    const calculateDiscount = (actualPrice, discountPrice) => {
        if (!actualPrice || !discountPrice) return 0;
        const actual = parseFloat(actualPrice);
        const discount = parseFloat(discountPrice);
        if (actual <= 0 || discount >= actual) return 0;
        return Math.round(((actual - discount) / actual) * 100);
    };

    // Image Preview Handler
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages((prevPreviews) => [...prevPreviews, ...previews]);
    };

    // Remove Image Handler
    const handleRemoveImage = (index) => {
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // Validation Schema
    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        actualPrice: Yup.string().required("Actual price is required"),
        // discountPrice: Yup.string().required("Discount price is required"),
        // gst: Yup.string().required("Gst is required"),
        description: Yup.string().required("Description is required"),
        categoryId: Yup.string().required("Category selection is required"),
        subCategoryId: Yup.string().required("Sub Category selection is required"),
        brandId: Yup.string().required("Brand selection is required"),
        // sizes: Yup.array().min(1, "At least one size is required"),
        images: Yup.array().min(1, "At least one image is required"),
    });

    const onSubmit = async (values, { resetForm }) => {
        console.log(values);
        
        setLoader(true);
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("images", file);
        });

        if (values.sizes && values.sizes.length > 0) {
            values.sizes.forEach((size) => {
                formData.append("size", size);
            });
        }

        Object.keys(values).forEach((key) => {
            if (key !== "images" && key !== "size" && key !=="gst") {
                formData.append(key, values[key]);
            }
        });

        formData.append("gst", discountPercentage);

        try {
            const response = await axios.post(`${Base_url}/products/create`, formData);
            if (response.status === 200) {
                toast.success(response.data.message);
                resetForm();
                setPreviewImages([]);
                setSelectedFiles([]);
                navigate('/customers');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            setLoader(false);
        }
    };

    return (
        <Wrapper>
            <div className="p-3 flex justify-between items-center">
                <h1 className="capitalize main_title font-semibold">Add Products</h1>
            </div>
            <div className="p-5 shadow-lg bg-white mt-4 rounded-md">
                <Formik
                    initialValues={{
                        title: "",
                        categoryId: "",
                        subCategoryId: "",
                        actualPrice: "",
                        discountPrice: "",
                        gst: "",
                        description: "",
                        sizes: [],
                        images: [],
                    }}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ handleSubmit, setFieldValue, values, handleChange }) => (
                        <Form onSubmit={handleSubmit}>
                            <div className="flex gap-5 justify-between flex-wrap">
                                {/* Title Input */}
                                <div className="w-[100%]">
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Product Name
                                    </label>
                                    <Field
                                        name="title"
                                        type="text"
                                        placeholder="Enter name"
                                        className="border w-full bg-lightGray py-3 px-2 rounded-md"
                                    />
                                    <ErrorMessage
                                        name="title"
                                        component="div"
                                        className="text-red text-sm mt-1"
                                    />
                                </div>

                                {/* Brand Select */}
                                <div className="w-[48%]">
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Brand</label>
                                    <Field
                                        as="select"
                                        name="brandId"
                                        className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                                    >
                                        <option value="" label="Select brand" />
                                        {brands.map((item) => (
                                            <option key={item._id} value={item._id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="brandId" component="div" className="text-red text-sm mt-1" />
                                </div>

                                {/* Category Select */}
                                <div className="w-[48%]">
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Categories</label>
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
                                    <ErrorMessage name="categoryId" component="div" className="text-red text-sm mt-1" />
                                </div>

                                {/* Sub Category Select */}
                                <div className="w-[48%]">
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Sub Categories</label>
                                    <Field
                                        as="select"
                                        name="subCategoryId"
                                        className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                                    >
                                        <option value="" label="Select sub categories" />
                                        {subcategories.map((item) => (
                                            <option key={item._id} value={item._id}>
                                                {item.title}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="subCategoryId" component="div" className="text-red text-sm mt-1" />
                                </div>

                                {/* Sizes Multi-select */}
                                <div className="w-[48%]">
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Available Sizes</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSizes.map((size) => (
                                            <div key={size} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`size-${size}`}
                                                    checked={values.sizes.includes(size)}
                                                    onChange={(e) => {
                                                        const newSizes = e.target.checked
                                                            ? [...values.sizes, size]
                                                            : values.sizes.filter(s => s !== size);
                                                        setFieldValue("sizes", newSizes);
                                                    }}
                                                    className="mr-1"
                                                />
                                                <label htmlFor={`size-${size}`}>{size}</label>
                                            </div>
                                        ))}
                                    </div>
                                    <ErrorMessage name="sizes" component="div" className="text-red text-sm mt-1" />
                                </div>

                                {/* Actual Price Input */}
                                <div className="w-[48%]">
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Actual Price
                                    </label>
                                    <Field
                                        name="actualPrice"
                                        type="number"
                                        placeholder="Enter Actual Price"
                                        className="border w-full bg-lightGray py-3 px-2 rounded-md"
                                        onChange={(e) => {
                                            handleChange(e);
                                            setDiscountPercentage(calculateDiscount(e.target.value, values.discountPrice));
                                        }}
                                    />
                                    <ErrorMessage
                                        name="actualPrice"
                                        component="div"
                                        className="text-red text-sm mt-1"
                                    />
                                </div>

                                {/* Discount Price Input */}
                                <div className="w-[48%]">
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Discount Price
                                    </label>
                                    <Field
                                        name="discountPrice"
                                        type="number"
                                        placeholder="Enter Discount Price"
                                        className="border w-full bg-lightGray py-3 px-2 rounded-md"
                                        onChange={(e) => {
                                            handleChange(e);
                                            setDiscountPercentage(calculateDiscount(values.actualPrice, e.target.value));
                                        }}
                                    />
                                    <ErrorMessage
                                        name="discountPrice"
                                        component="div"
                                        className="text-red text-sm mt-1"
                                    />
                                </div>

                                {/* GST Input with Discount Percentage */}
                                <div className="w-[49%]">
                                    <div className="flex justify-between items-center">
                                        <label className="block mb-2 text-sm font-medium text-gray-900">
                                            GST
                                        </label>
                                        {discountPercentage > 0 && (
                                            <span className="text-green-600 font-medium">
                                                {discountPercentage}% OFF
                                            </span>
                                        )}
                                    </div>
                                    <Field
                                        name="gst"
                                        type="text"
                                        value={discountPercentage}
                                        placeholder="Enter GST"
                                       className="border w-full bg-lightGray py-3 px-2 rounded-md disabled:opacity-75 disabled:cursor-not-allowed"
                                        disabled
                                    />
                                    <ErrorMessage
                                        name="gst"
                                        component="div"
                                        className="text-red text-sm mt-1"
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="w-[100%]">
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Upload Images</label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => {
                                            handleFileChange(e);
                                            setFieldValue("images", [...selectedFiles, ...Array.from(e.target.files)]);
                                        }}
                                        className="block w-full p-3 text-sm text-gray-900 border rounded-md cursor-pointer focus:outline-none"
                                    />
                                    <div className="flex flex-wrap gap-4 mt-3">
                                        {previewImages.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={image}
                                                    alt="Preview"
                                                    className="w-24 h-24 object-cover rounded-md shadow-md"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                                                    onClick={() => {
                                                        handleRemoveImage(index);
                                                        setFieldValue("images", selectedFiles.filter((_, i) => i !== index));
                                                    }}
                                                >
                                                    <MdClose size={20} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <ErrorMessage name="images" component="div" className="text-red text-sm mt-1" />
                                </div>

                                {/* Description Input */}
                                <div className="w-[100%]">
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Description
                                    </label>
                                    <Field
                                        as="textarea" 
                                        name="description"
                                        type="text"
                                        placeholder="Enter Description"
                                        className="border w-full bg-lightGray py-3 px-2 rounded-md"
                                    />
                                    <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="text-red text-sm mt-1"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center items-center">
                                {/* Submit Button */}
                                {loading ? (
                                    <button
                                        disabled
                                        type="button"
                                        className="h-11 bg-primary w-64 border-none outline-none rounded-lg mt-4 shadow-sm cursor-pointer text-lg text-white font-semibold"
                                    >
                                        Loading...
                                    </button>
                                ) : (
                                    <Button
                                        label="Submit"
                                        type="submit"
                                        className="bg-primary mt-3 uppercase w-64 text-white py-2"
                                    />
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Wrapper>
    );
};

export default AddProduct;