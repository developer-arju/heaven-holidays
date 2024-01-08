import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { setAccessToken, getRequest, postRequest } from "../../utils/axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const EditPackageBasicInfo = () => {
  const { packageId } = useParams();
  const { authData } = useSelector((state) => state.provider);
  const navigate = useNavigate();
  const [existCoverImages, setExistCoverImages] = useState([]);
  const form = useForm({
    defaultValues: {
      packageName: "",
      summary: "",
      phoneNumbers: ["", ""],
      adults: 0,
      children: 0,
      coverImage: [],
      price: 0,
    },
  });
  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;

  useEffect(() => {
    (async () => {
      setAccessToken(authData.token);
      const { data, error } = await getRequest(
        `/provider/package/${packageId}`
      );
      if (data) {
        setExistCoverImages(data.coverImage);
        reset({
          packageName: data.packageName || "",
          summary: data.summary || "",
          phoneNumbers: data.phoneNumbers || ["", ""],
          adults: parseInt(data.adults) || 0,
          children: parseInt(data.children) || 0,
          price: parseInt(data.price) || 0,
        });
      }
      if (error) {
        console.log(error?.message);
      }
    })();
  }, []);

  const formSubmit = async (data) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    for (let key in data) {
      if (key !== "coverImage") {
        formData.append(key, data[key]);
      } else {
        for (let i = 0; i < data[key].length; i++) {
          formData.append(key, data[key][i]);
        }
      }
    }
    setAccessToken(authData.token);
    const { data: responseData, error } = await postRequest(
      `/provider/package/edit/${packageId}`,
      formData,
      headers
    );
    if (responseData) {
      console.log(responseData?.message);
      navigate("/provider/packages?update=success");
    }
    if (error) {
      console.log(error?.message);
    }
  };

  const imageUploadHandler = async (e) => {
    const files = e.target.files;
    const allowedImageTypes = ["image/jpeg", "image/png"];
    const urls = [];
    if (files.length < 1) return toast.error("add minimum one image");
    if (files.length > 2) return toast.error("maximum two images allowed");

    for (let i = 0; i < files.length; i++) {
      if (!allowedImageTypes.includes(files[i].type)) {
        return toast.error("png or jpg format is only allowed");
      }
      urls.push(URL.createObjectURL(files[i]));
    }
    setExistCoverImages([...urls]);
  };

  return (
    <div className="grid md:grid-cols-2 gap-2.5">
      <div className="border-b md:col-span-2 border-stroke py-4 px-6">
        <h3 className="font-medium text-black text-center">
          Edit Package Basic Details
        </h3>
      </div>
      <div className="rounded-sm col-span-1  border border-stroke bg-white shadow-default ">
        <div className="flex flex-col gap-3 p-6 font-body text-sm">
          <div>
            <label className="mb-1 block font-medium text-black">
              Package Name
            </label>
            <input
              type="text"
              placeholder="Package Name"
              {...register("packageName", {
                required: "package name is required",
              })}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1.5 px-2.5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            />
            <p className="text-red-600 text-xs ps-2 pt-1">
              {errors.packageName?.message}
            </p>
          </div>
          <div>
            <label className="mb-1 block font-medium text-black">
              Contact One
            </label>
            <input
              type="text"
              placeholder="Contact One"
              {...register("phoneNumbers.0", {
                required: "support contact number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "enter a valid mobile number",
                },
              })}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1.5 px-2.5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            />
            <p className="text-red-600 text-xs ps-2 pt-1">
              {errors.phoneNumbers?.[0]?.message}
            </p>
          </div>
          <div>
            <label className="mb-1 block font-medium text-black">
              Contact Two
            </label>
            <input
              type="text"
              placeholder="Contact Two"
              {...register("phoneNumbers.1", {
                pattern: {
                  value: /^\d{10}$/,
                  message: "enter a valid mobile number",
                },
              })}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1.5 px-2.5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            />
            <p className="text-red-600 text-xs ps-2 pt-1">
              {errors.phoneNumbers?.[1]?.message}
            </p>
          </div>

          <div className="flex gap-2 w-full justify-between items-center">
            <div className="flex-grow flex-shrink">
              <label className="mb-1 block font-medium text-black">
                Adults Count
              </label>
              <input
                type="text"
                placeholder="Adults Count"
                {...register("adults", {
                  valueAsNumber: true,
                  required: "adults count is required",
                  validate: (data) => data > 0 || "add allowed person count",
                })}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1.5 px-2.5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
              <p className="text-red-600 text-xs ps-2 pt-1">
                {errors.adults?.message}
              </p>
            </div>
            <div className="flex-grow flex-shrink">
              <label className="mb-1 block font-medium text-black">
                Children Count
              </label>
              <input
                type="text"
                placeholder="Children Count"
                {...register("children", {
                  valueAsNumber: true,
                  required: "children count is required",
                })}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1.5 px-2.5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
              <p className="text-red-600 text-xs ps-2 pt-1">
                {errors.children?.message}
              </p>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-black font-medium">
              Package Summary
            </label>
            <textarea
              rows={2}
              placeholder="Summary"
              {...register("summary", {
                required: "please describe about the package",
              })}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1.5 px-2.5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            ></textarea>
            <p className="text-red-600 text-xs ps-2 pt-1">
              {errors.summary?.message}
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-sm col-span-1  border border-stroke bg-white shadow-default ">
        <div className="flex flex-col gap-5 p-4 font-body text-sm">
          <div
            id="FileUpload"
            className="relative mb-5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray p-4 sm:py-7"
          >
            <input
              type="file"
              accept="image/*"
              {...register("coverImage", {
                validate: (files) => {
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const allowedImageTypes = ["image/jpeg", "image/png"];

                    if (!allowedImageTypes.includes(file.type)) {
                      return "Please upload only images (JPEG, PNG)";
                    }
                  }

                  return files.length <= 2;
                },
              })}
              className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
              onChange={imageUploadHandler}
              multiple
            />
            <div className="flex flex-col items-center justify-center space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                    fill="#3C50E0"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                    fill="#3C50E0"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                    fill="#3C50E0"
                  />
                </svg>
              </span>
              <p>
                <span className="text-primary">Click to upload</span> or drag
                and drop
              </p>
              <p className="my-2">PNG or JPG</p>
              <div className="flex justify-center items-center gap-3">
                {existCoverImages.length > 0 &&
                  existCoverImages.map((imgPath) => {
                    return (
                      <img
                        key={imgPath}
                        className="w-[40%] aspect-video rounded-md shadow-default"
                        src={
                          /^blob/.test(imgPath)
                            ? imgPath
                            : `https://holidays.digimartshopy.shop/${imgPath}`
                        }
                        alt="coverImage"
                      />
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div>
              <label className="mb-1.5 block text-black font-medium font-body">
                Price
              </label>
              <input
                type="number"
                placeholder="Price"
                {...register("price", {
                  valueAsNumber: true,
                  required: "package price must be required",
                })}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
              <p className="text-red-600 text-xs ps-2 pt-1">
                {errors.price?.message}
              </p>
            </div>
            <div className="flex-grow flex items-center justify-center gap-3">
              <Link
                className="flex mt-6 justify-center rounded border border-stroke py-3 px-6 font-medium text-black hover:shadow-1"
                to="/provider/packages"
              >
                Cancel
              </Link>
              <button
                onClick={handleSubmit(formSubmit)}
                className="flex flex-grow mt-6 justify-center rounded bg-primary py-3 px-6 font-medium text-whiter hover:text-black hover:bg-opacity-70"
                type="submit"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPackageBasicInfo;
