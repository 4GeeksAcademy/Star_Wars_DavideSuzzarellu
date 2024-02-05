import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router";
import { Pagination } from 'react-bootstrap';

export const Species = () => {
    const { store, actions } = useContext(Context);
    const { species, favorites } = store;
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = async (page) => {
        const response = await fetch(`https://www.swapi.tech/api/species?page=${page}&limit=10`);
        if (!response.ok) return [];
        const result = await response.json();
        setData(result.results);
        setTotalPages(result.total_pages);
    };

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage);
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handleDetails = (id) => {
        actions.getDetailsSpecies(id);
        navigate(`/species/${id}`);
    };

    const handleFavorites = (item) => {
        actions.addFavorites(item);
    };

    return (
        <main className="container">
            <section className="row ">
                <div className="d-flex justify-content-center align-items-center text-warning">
                    <h1>Species</h1>
                </div>
                <div className="mt-2 d-flex align-items-center justify-content-center">
                    <Pagination>
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {[...Array(totalPages).keys()].map((page) => (
                            <Pagination.Item
                                key={page + 1}
                                active={page + 1 === currentPage}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                {page + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            </section>
            <section className="row">
                {data.map((specie) => (
                    <div key={specie.uid} className="col-xs-4 col-sm-5 col-md-4 col-lg-3 col-xl-2 mb-3">
                        <div className={`card h-100 ${favorites.includes(specie.name) ? 'border-success border-3' : ''}`}>
                            <div>
                                <img onError={actions.handleErrorImg} className="img-fluid" src={`https://starwars-visualguide.com/assets/img/species/${specie.uid}.jpg`} alt="" />
                            </div>
                            <div className="card-body">
                                <h4 className="card-title">{specie.name}</h4>
                            </div>
                            <hr className="text-warning" />
                            <footer className="footer gap-2 d-flex align-items-center justify-content-between p-3">
                                <span onClick={() => handleFavorites(specie.name)} className="d-flex justify-content-center align-items-center">
                                    {favorites.includes(specie.name) ? (
                                        <i className="fa-solid fa-heart fa-lg text-success"></i>
                                    ) : (
                                        <i className="fa-regular fa-heart fa-lg"></i>
                                    )}
                                </span>
                                <button onClick={() => handleDetails(specie.uid)} className="btn rounded bg-warning">
                                    Details
                                </button>
                            </footer>
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
};
