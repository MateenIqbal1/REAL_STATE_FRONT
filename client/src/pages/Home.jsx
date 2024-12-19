import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { ClipLoader } from 'react-spinners';
import ListingItem from '../components/ListingItem';

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [loadingRents, setLoadingRents] = useState(true);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(
          'https://realstate4-q8lsvtei.b4a.run/api/listing/get?offer=true&limit=4'
        );
        const data = await res.json();
        setOfferListings(data);
        setLoadingOffers(false);
        fetchRentListings();
      } catch (error) {
        console.log(error);
        setLoadingOffers(false);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch(
          'https://realstate4-q8lsvtei.b4a.run/api/listing/get?type=rent&limit=4'
        );
        const data = await res.json();
        setRentListings(data);
        setLoadingRents(false);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
        setLoadingRents(false);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(
          'https://realstate4-q8lsvtei.b4a.run/api/listing/get?type=sale&limit=4'
        );
        const data = await res.json();
        setSaleListings(data);
        setLoadingSales(false);
      } catch (error) {
        console.log(error);
        setLoadingSales(false);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* Top Section */}
      <div className="flex flex-col gap-6 p-8 sm:p-6 lg:p-28 max-w-6xl">
        <h1 className="text-slate-700 font-bold text-2xl lg:text-6xl sm:text-sm">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs">
          Real estate is the best place to find your next perfect place to live
          <br />
          we have a wide range of properties for you to choose from
        </div>
        <Link
          to={'/search'}
          className="flex justify-center items-center text-xs p-1 sm:text-sm lg:text-lg text-white font-serif w-[40%] sm:w-[40%] md:w-[30%] lg:w-[20%] h-auto bg-[#FF0000] border border-black rounded-full font-semibold lg:font-bold hover:underline text-center whitespace-nowrap"
        >
          Let's get started
        </Link>
      </div>

      {/* Swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listings Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {/* Offers */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
          <Link
            className="text-sm text-blue-800 hover:underline"
            to={'/search?offer=true'}
          >
            Show more offers
          </Link>
          <div className="flex flex-wrap gap-4 mt-4">
            {loadingOffers ? (
              <div className="flex justify-center items-center w-full h-32">
                <ClipLoader color="#FF0000" size={50} />
              </div>
            ) : (
              offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))
            )}
          </div>
        </div>

        {/* Rentals */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-600">
            Recent Places for Rent
          </h2>
          <Link
            className="text-sm text-blue-800 hover:underline"
            to={'/search?type=rent'}
          >
            Show more places for rent
          </Link>
          <div className="flex flex-wrap gap-4 mt-4">
            {loadingRents ? (
              <div className="flex justify-center items-center w-full h-32">
                <ClipLoader color="#FF0000" size={50} />
              </div>
            ) : (
              rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))
            )}
          </div>
        </div>

        {/* Sales */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-600">
            Recent Places for Sale
          </h2>
          <Link
            className="text-sm text-blue-800 hover:underline"
            to={'/search?type=sale'}
          >
            Show more places for sale
          </Link>
          <div className="flex flex-wrap gap-4 mt-4">
            {loadingSales ? (
              <div className="flex justify-center items-center w-full h-32">
                <ClipLoader color="#FF0000" size={50} />
              </div>
            ) : (
              saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
