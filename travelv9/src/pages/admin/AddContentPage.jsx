import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import PlainCard from "../../components/Admin/PlainCard";
import SelectInput from "../../components/Admin/SelectInput";
import LabelInput from "../../components/Admin/LabelInput";
import { Button } from "flowbite-react";
import { FaPlus, FaTrash } from "react-icons/fa6";

const AddContentPage = () => {
  const [formData, setFormData] = useState({
    destination_city: "",
    destinationId: "",
    link_images: [],
    video_contents: {
      title: "",
      url: "",
      description: "",
    },
  });

  const [cities, setCities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [previews, setPreviews] = useState({
    images: [],
    video: "",
  });

  const navigate = useNavigate();

  const addImageLink = () => {
    if (formData.link_images.length < 3) {
      setFormData((prev) => ({
        ...prev,
        link_images: [...prev.link_images, ""],
      }));

      setPreviews((prev) => ({
        ...prev,
        images: [...prev.images, ""],
      }));
    }
  };

  const removeImageLink = (index) => {
    setFormData((prev) => {
      const newLinkImages = [...prev.link_images];
      newLinkImages.splice(index, 1);
      return {
        ...prev,
        link_images: newLinkImages,
      };
    });

    setPreviews((prev) => {
      const newPreviews = [...prev.images];
      newPreviews.splice(index, 1);
      return {
        ...prev,
        images: newPreviews,
      };
    });
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const cityResponse = await axiosInstance.get("/city");
        setCities(cityResponse.data.cities || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchInitialData();
  }, []);

  const fetchDestinationsByCity = async (cityName) => {
    if (!cityName) {
      setDestinations([]);
      return;
    }

    try {
      const response = await axiosInstance.get("/destination", {
        params: { city: cityName },
      });

      const fetchedDestinations = response.data.destinations || [];
      setDestinations(fetchedDestinations);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setDestinations([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "destination_city") {
      setFormData((prev) => ({
        ...prev,
        destination_city: value,
        destinationId: "",
      }));

      fetchDestinationsByCity(value);
    } else if (name.startsWith("link_images")) {
      const index = parseInt(name.match(/\[(\d+)\]/)[1]);

      setFormData((prev) => {
        const newLinkImages = [...prev.link_images];
        newLinkImages[index] = value;
        return {
          ...prev,
          link_images: newLinkImages,
        };
      });

      setPreviews((prev) => {
        const newPreviews = [...prev.images];
        newPreviews[index] = value;
        return {
          ...prev,
          images: newPreviews,
        };
      });
    } else if (["title", "url", "description"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        video_contents: {
          ...prev.video_contents,
          [name]: value,
        },
      }));

      if (name === "url") {
        setPreviews((prev) => ({
          ...prev,
          video: value,
        }));
      }
    } else if (name === "destinationId") {
      setFormData((prev) => ({
        ...prev,
        destinationId: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.destinationId) {
      alert("Pilih destinasi terlebih dahulu");
      return;
    }

    const filteredImageLinks = formData.link_images.filter(
      (link) => link.trim() !== ""
    );

    const payload = {
      destinationID: parseInt(formData.destinationId),
      image: filteredImageLinks,
      video_contents: [
        {
          title: formData.video_contents.title,
          url: formData.video_contents.url,
          description: formData.video_contents.description,
        },
      ],
    };

    try {
      console.log(payload);
      const response = await axiosInstance.post("/destination/assets", payload);
      navigate("/admin/content");
    } catch (error) {
      console.error(
        "Error adding content:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Gagal menambahkan konten");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PlainCard
        className="py-2"
        title="Add Content"
        description="Add Content Details"
      />
      <div className="flex md:flex-row flex-col my-5 gap-5 bg-white rounded-3xl shadow-lg p-6 w-full">
        <div className="lg:w-2/5 w-full px-5">
          <div className="grid grid-cols-1 gap-4">
            {formData.link_images.map((link, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex-grow">
                  <LabelInput
                    label={`Link Image ${index + 1}`}
                    name={`link_images[${index}]`}
                    type="text"
                    value={link}
                    onChange={handleInputChange}
                  />
                </div>
                {formData.link_images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageLink(index)}
                    className="text-red-500 hover:text-red-700 mt-6"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}

            {formData.link_images.length < 3 && (
              <button
                type="button"
                onClick={addImageLink}
                className="flex items-center text-blue-500 hover:text-blue-700 mt-2"
              >
                <FaPlus className="mr-2" /> Tambah Link Gambar
              </button>
            )}

            {/* Preview Gambar */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {previews.images.map(
                (preview, index) =>
                  preview && (
                    <div
                      key={index}
                      className="border rounded-lg overflow-hidden"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.png";
                        }}
                      />
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
        <div className="space-y-6 w-full px-4">
          <SelectInput
            label="Destination City"
            id="destination_city"
            name="destination_city"
            placeholder="Select Destination City"
            options={cities.map((city) => city.name)}
            onChange={handleInputChange}
            value={formData.destination_city}
          />
          <SelectInput
            label="Destination"
            id="destinationId"
            name="destinationId"
            placeholder="Select Destination"
            options={destinations?.map((dest) => ({
              value: dest.id,
              label: dest.name,
            }))}
            onChange={handleInputChange}
            value={formData.destinationId}
            disabled={!formData.destination_city}
          />
          <LabelInput
            label="Video Title"
            name="title"
            type="text"
            value={formData.video_contents.title}
            onChange={handleInputChange}
          />
          <LabelInput
            label="Video Description"
            name="description"
            type="text"
            value={formData.video_contents.description}
            onChange={handleInputChange}
          />
          <LabelInput
            label="Link Content (Video URL)"
            name="url"
            type="text"
            value={formData.video_contents.url}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button color="gray" onClick={handleBack}>
          Kembali
        </Button>
        <Button type="submit" color="blue">
          Simpan
        </Button>
      </div>
    </form>
  );
};

export default AddContentPage;