import React, { useEffect, useState } from 'react';

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);

  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
        console.log(listing.userRef);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandLord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className="">
          <p>
            Contact <span>{landlord.username}</span>
            <span> about {listing.name.toLowerCase()}</span>
          </p>
        </div>
      )}
    </>
  );
};

export default Contact;
