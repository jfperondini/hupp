"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import getBrand from "../service/brandService";
import getListImg from "../service/imageService";
import getListFeature from "@/service/featureService";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import getListNeighborhood from "@/service/neighborhoodService";
import getListCity from "@/service/cityService";

export default function Home() {
  const [brandSelect, setBrand] = useState({});
  const [logoSelect, setLogo] = useState({});
  const [imgSelect, setImg] = useState({});
  const [listFeature, setListFeature] = useState([]);
  const [citySelect, setCitySelect] = useState({});
  const [listBikeStation, setBikeStation] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandResult = await getBrand();
        setBrand(brandResult);

        if (brandResult.logo) {
          const logoResult = await getListImg(brandResult.logo);
          if (logoResult.length > 0) {
            setLogo(logoResult[0]);
          } else {
            console.error("not found logo");
          }
        }

        if (brandResult.img) {
          const imgResult = await getListImg(brandResult.img);
          if (imgResult.length > 0) {
            setImg(imgResult[0]);
          } else {
            console.error("not found image");
          }
        }

        const listFeatureResult = await getListFeature();
        setListFeature(listFeatureResult);

        for (let index = 0; index < listFeatureResult.length; index++) {
          const feature = listFeatureResult[index];
          const listImgFeatureResult = await getListImg(feature.img);
          listFeatureResult[index].img = listImgFeatureResult;
        }

        const cityResult = await getListCity();
        setCitySelect(cityResult);

        const listNeighborhoodResult = await getListNeighborhood(cityResult.id);
        const listBikeStationFilter = listNeighborhoodResult.flatMap(
          (nighborhood) => nighborhood.bikeStation
        );

        setBikeStation(listBikeStationFilter);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <header className="w-full bg-orange-500 shadow-lg bg-cover bg-center flex items-center justify-center relative">
        <div className="w-full max-w-6xl flex items-center px-6 relative">
          {/* Logo and Name */}
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl sm:text-4xl font-bold text-white">
              {brandSelect.name}
            </h1>
            {logoSelect.url ? (
              <div
                key={logoSelect.id}
                className="relative w-16 h-16 sm:w-20 sm:h-24"
              >
                <Image
                  src={logoSelect.url}
                  alt={logoSelect.alt || "Logo"}
                  width={160}
                  height={192}
                  className="rounded-md"
                  sizes="(max-width: 640px) 4rem, (max-width: 768px) 5rem, 6rem"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ) : (
              <div className="relative w-16 h-16 sm:w-20 sm:h-24 rounded-md bg-gray-200"></div>
            )}
          </div>
        </div>
      </header>

      <main className="w-full mx-auto">
        {/* Tagline, Description, and Image */}
        <div
          className={`relative bg-cover bg-center w-full h-80 ${
            imgSelect.url ? "" : "bg-gray-200"
          }`}
          style={{
            backgroundImage: imgSelect.url ? `url(${imgSelect.url})` : "none",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center">
            <div className="text-white p-12 max-w-2xl mx-12">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                {brandSelect.tagline}
              </h2>
              <p className="mt-4 text-base md:text-lg">
                {brandSelect.description}
              </p>
            </div>
          </div>
        </div>
        {/* Redline */}
        <section className="py-20 md:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 mx-auto max-w-4xl">
            {brandSelect.redline}
          </h1>
          <div className="w-60 h-4 mx-auto rounded-full bg-orange-500"></div>
        </section>
        {/* Feature 0 */}
        <section className="flex flex-col md:flex-row items-center justify-center p-4">
          {listFeature && listFeature.length > 0 && (
            <>
              <div className="flex-1 max-w-lg md:max-w-2xl">
                {listFeature[0].img && listFeature[0].img.length > 0 ? (
                  <Image
                    src={listFeature[0].img[0].url}
                    alt={listFeature[0].img[0].alt}
                    layout="responsive"
                    width={500}
                    height={300}
                    className="rounded-md"
                  />
                ) : (
                  <div className="relative w-20 h-24 rounded-md bg-gray-200"></div>
                )}
              </div>
              <div className="flex-1 max-w-lg px-4">
                <h2 className="text-4xl font-bold mb-4 text-center md:text-right">
                  {listFeature[0].slogan}
                </h2>
                <p className="text-lg md:text-xl text-center md:text-right mb-8">
                  {listFeature[0].tagline}
                </p>
                {listFeature[0].detail && listFeature[0].detail.length > 0 && (
                  <div className="text-center md:text-right">
                    {listFeature[0].detail.map((item, index) => (
                      <div
                        key={index}
                        className="mb-6 flex flex-col items-start md:items-end"
                      >
                        <div className="flex items-center mb-2 space-x-3">
                          <h3 className="text-xl font-semibold">
                            {item.title}
                          </h3>
                          <div className="w-10 h-4 flex items-center justify-center rounded-full bg-orange-500">
                            <div className="w-6 h-0.5 bg-white"></div>
                          </div>
                        </div>
                        <p className="text-base md:text-lg">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </section>
        {/* Feature 1 */}
        <section className="flex flex-col md:flex-row items-center justify-center p-4">
          {listFeature && listFeature.length > 1 && (
            <>
              <div className="flex-1 max-w-lg md:max-w-2xl p-4">
                <h2 className="text-4xl font-bold mb-4 text-center md:text-left">
                  {listFeature[1].slogan}
                </h2>
                <p className="text-lg md:text-xl text-center md:text-left mb-8">
                  {listFeature[1].tagline}
                </p>
                {listFeature[1]?.detail && listFeature[1].detail.length > 0 && (
                  <div className="flex flex-wrap justify-center mt-8">
                    {listFeature[1].detail.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 border border-gray-300 rounded-lg flex flex-col items-center justify-center m-4 p-4 w-64 h-64"
                      >
                        <div className="w-8 h-8 bg-orange-500 rounded-full mb-2 flex items-center justify-center">
                          <Image
                            src="svg/bike.svg"
                            alt="Icon"
                            width={32}
                            height={32}
                            className="w-4 h-4"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-center">
                          {item.title}
                        </h3>
                        <p className="text-sm text-center">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1 max-w-lg md:max-w-2xl p-4">
                {listFeature[1].img && listFeature[1].img.length > 0 ? (
                  <Image
                    src={listFeature[1].img[0].url}
                    alt={listFeature[1].img[0].alt || "Imagem"}
                    layout="responsive"
                    width={500}
                    height={300}
                    className="rounded-md"
                  />
                ) : (
                  <div className="relative w-20 h-24 rounded-md bg-gray-200"></div>
                )}
              </div>
            </>
          )}
        </section>
        {/* Feature 3 */}
        <section className="p-6 md:p-12">
          <h1 className="text-center text-3xl md:text-4xl font-bold mb-6 mx-auto max-w-4xl">
            {listFeature[3]?.slogan}
          </h1>
          {listFeature && listFeature.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {listFeature.slice(3, 4).map((feature, index) => (
                <>
                  {/* Quadrado 1: Imagem */}
                  <div
                    key={`image-${index * 2}`}
                    className="bg-gray-100 border border-gray-300 rounded-lg shadow-md overflow-hidden"
                  >
                    {feature.img && feature.img[0] ? (
                      <div className="relative w-full h-60">
                        <Image
                          src={feature.img[0].url}
                          alt={feature.img[0].alt}
                          layout="fill"
                          objectFit="cover"
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-60 bg-gray-200"></div>
                    )}
                  </div>
                  {/* Quadrado 2: Texto */}
                  <div
                    key={`text-${index * 2}`}
                    className="bg-gray-100 border border-orange-500 rounded-lg shadow-md p-6 flex items-center"
                  >
                    <div className="text-center w-full">
                      <h3 className="text-4xl font-bold text-gray-800 mb-1">
                        {feature.detail[0]?.title || "Título do Texto 1"}
                      </h3>
                      <p className=" text-lg text-gray-600">
                        {feature.detail[0]?.description ||
                          "Descrição ou conteúdo do texto 1."}
                      </p>
                    </div>
                  </div>
                  {/* Quadrado 3: Imagem */}
                  <div
                    key={`image-${index * 2 + 1}`}
                    className="bg-gray-100 border border-gray-300 rounded-lg shadow-md overflow-hidden"
                  >
                    {feature.img && feature.img[1] ? (
                      <div className="relative w-full h-60">
                        <Image
                          src={feature.img[1].url}
                          alt={feature.img[1].alt}
                          layout="fill"
                          objectFit="cover"
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-60 bg-gray-200"></div>
                    )}
                  </div>
                  {/* Quadrado 4: Texto */}
                  <div
                    key={`text-${index * 2 + 1}`}
                    className="bg-gray-100 border border-orange-500 rounded-lg shadow-md p-6 flex items-center"
                  >
                    <div className="text-center w-full">
                      <h3 className="text-4xl font-bold text-gray-800 mb-2">
                        {feature.detail[1]?.title || "Título do Texto 2"}
                      </h3>
                      <p className="text-lg text-gray-600">
                        {feature.detail[1]?.description ||
                          "Descrição ou conteúdo do texto 2."}
                      </p>
                    </div>
                  </div>
                </>
              ))}
            </div>
          )}
        </section>
        <div className="w-1/2 h-1 mx-auto rounded-full bg-orange-500"></div>
        {/* Feature 2 */}
        <section className="flex flex-col md:flex-row items-start justify-start p-4 py-20">
          {listFeature && listFeature.length > 2 && (
            <div className="flex-1 max-w-lg md:max-w-2xl px-10">
              <h2 className="text-4xl font-bold mb-4 text-left">
                {listFeature[2].slogan}
              </h2>
              <p className="text-lg md:text-xl text-left mb-8">
                {listFeature[2].tagline}
              </p>
            </div>
          )}
        </section>

        {listFeature &&
        listFeature.length > 2 &&
        listFeature[2].img &&
        listFeature[2].img.length > 0 ? (
          <section className="flex flex-col items-center mt-4">
            <div className="flex flex-wrap justify-center space-x-6 gap-4">
              {listFeature[2].img.map((image, index) => (
                <div key={index} className="relative w-36 h-36 md:w-48 md:h-48">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={250}
                    height={250}
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="relative w-20 h-24 rounded-md mt-6 bg-gray-200"></div>
        )}

        {/* Map */}
        <section className="flex flex-col md:flex-row items-start justify-start py-10 ">
          <div className="flex-1 max-w-lg md:max-w-2xl px-10">
            <h2 className="text-4xl font-bold text-center md:text-left whitespace-nowrap">
              {citySelect.description}
            </h2>
          </div>
        </section>
        <section className="relative w-full max-w-screen-2xl mx-auto mb-8">
          <MapContainer
            center={[49.2827, -123.1207]}
            zoom={14}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {listBikeStation.map((bikeStation) => (
              <Marker
                key={bikeStation.id}
                position={[bikeStation.location.lat, bikeStation.location.lng]}
                icon={L.icon({
                  iconUrl: "svg/marker-icon.svg",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
                })}
              >
                <Popup>
                  <strong>{bikeStation.name}</strong>
                  <br />
                  {bikeStation.address}
                  <br />
                  Bikes disponíveis: {bikeStation.availableQuantity}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      </main>

      <footer className="w-full bg-orange-500 text-white py-6">
        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm">{brandSelect.copyright}</p>
        </div>
      </footer>
    </>
  );
}
