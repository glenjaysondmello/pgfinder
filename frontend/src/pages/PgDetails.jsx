import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getPg } from "../features/pgslice/pgSlice";
import Loader from "../animations/Loader";

const PgDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedPg, status, error } = useSelector((store) => store.pg);

  useEffect(() => {
    if (id) {
      dispatch(getPg(id)).unwrap();
    }
  }, [dispatch, id]);

  if (status === "loading")
    return (
      <div>
        <Loader />
      </div>
    );
  if (status === "error") return <p>Error:{error}</p>;

  return (
    <div>
      {selectedPg ? (
        <div>
          <h2>{selectedPg.name}</h2>
          <p>{selectedPg.location}</p>
          <p>{selectedPg.description}</p>
          {selectedPg.images?.length > 0 ? (
            selectedPg.images.map((image, index) => (
              <img key={index} src={image} alt={`PG ${selectedPg.name}`}/>
            ))
          ) : <p>No Images Available</p>}
        </div>
      ) : (
        <p>No PG Found</p>
      )}
    </div>
  );
};

export default PgDetails;
