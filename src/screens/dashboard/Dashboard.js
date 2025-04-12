import React, { useEffect, useState } from "react";
import Wrapper from "../Wrapper";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import { MdSupport } from "react-icons/md";
import LineChart from "../../chart/LineChart";
import BarChart from "../../chart/BarChart";
const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  useEffect(() => {
    axios
      .get(`${Base_url}/brands/getAll`)
      .then((res) => {
        console.log(res);
        setRooms(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${Base_url}/category/getAll`)
      .then((res) => {
        console.log(res);
        setCategory(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${Base_url}/products/getAll`)
      .then((res) => {
        console.log(res);
        setSubCategory(res?.data?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Wrapper>
      <h2 className="main_title">Dashboard</h2>

      <section>
        <div className=" py-4  w-full grid  grid-cols-1  xl:grid-cols-3 md:grid-cols-2 gap-5">

          <div className=" w-full">
            <div className=" bg-white shadow-md  flex justify-between p-5 rounded-lg">
              <div>
                <h2 className=" text-black font-bold">Brands</h2>
                <div className=" pt-2 flex items-center gap-3">
                  <p className="text-4xl text-black">{rooms?.length}</p>
                </div>
              </div>
              <div>
                <MdSupport size={80} className="  text-primary" />
              </div>
            </div>
          </div>
          <div className=" w-full">
            <div className=" bg-white shadow-md text-black flex justify-between p-5 rounded-lg">
              <div>
                <h2 className=" text-black font-bold">Categories</h2>
                <div className=" pt-2 flex items-center gap-3">
                  <p className="text-4xl text-black">{category?.length}</p>
                </div>
              </div>
              <div>
                <MdSupport size={80} className=" text-primary" />
              </div>
            </div>
          </div>
          <div className=" w-full">
            <div className=" bg-white shadow-md text-black flex justify-between p-5 rounded-lg">
              <div>
                <h2 className=" text-black font-bold">Products</h2>
                <div className=" pt-2 flex items-center gap-3">
                  <p className="text-4xl text-black">{subCategory?.length}</p>
                </div>
              </div>
              <div>
                <MdSupport size={80} className=" text-primary" />
              </div>
            </div>
          </div>
        </div>


      </section>

      <div className=" grid sm:grid-cols-2 grid-cols-1 gap-8 mt-4 w-full">


        <LineChart />
        <BarChart />
      </div>


    </Wrapper>
  );
};

export default Dashboard;
