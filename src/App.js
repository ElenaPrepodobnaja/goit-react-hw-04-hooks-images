/* eslint-disable no-use-before-define */
import { useState, useEffect } from 'react';
import 'lazysizes';
import { ToastContainer, toast } from 'react-toastify';
import LoaderSpinner from './components/Loader';
import Seachbar from './components/Searchbar';
import Button from './components/Button';
import fetchGallery from './services/services';
import ImageGallery from './components/ImageGallery';
import Section from './components/Section';
import Modal from './components/Modal';
import DefaultEmptyField from './components/DefaultEmpyField';
import authContext from './components/Context';

export default function App() {
  const [gallery, setGallery] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImgURL, setSelectedImgURL] = useState('');
  const [selectedLowQImgUrl, setSelectedLowQImgUrl] = useState('');

  useEffect(() => {
    fetchPictures();
  }, [search]);

  const fetchPictures = () => {
    setIsLoading(true);

    fetchGallery(search, currentPage)
      .then(images => {
        setGallery(gallery => [...gallery, ...images]);
        setCurrentPage(currentPage => currentPage + 1);
      })
      .catch(error => setError(error))
      .finally(() => {
        onLoadMoreBtnClick();
        setIsLoading(false);
      });
  };

  const handleSubmit = query => {
    if (query !== search) {
      setGallery([]);
      setSearch(query);
      setCurrentPage(1);
      setError(null);
    }

    if (!query) {
      const notify = () =>
        toast.info('🚀 Search field is empty!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
      notify();
    }
  };

  const onLoadMoreBtnClick = () => {
    if (setCurrentPage > 2) {
      const options = {
        top: null,
        behavior: 'smooth',
      };

      options.top = window.pageYOffset + document.documentElement.clientHeight;
      setTimeout(() => {
        window.scrollTo(options);
      }, 1000);
    }
  };

  const hadleImageClick = e => {
    if (e.target.nodeName !== 'IMG') {
      return;
    }

    e.preventDefault();

    const fullImgLink = e.target.getAttribute('data-large');
    const lowSrc = e.target.getAttribute('src');

    setSelectedImgURL(fullImgLink);
    setSelectedLowQImgUrl(lowSrc);
    setIsModalOpen(true);
  };

  const toggleModal = () => {
    setIsModalOpen(isModalOpen => !isModalOpen);

    if (setIsModalOpen) {
      document.body.style.overflowY = 'hidden';
    }
  };

  return (
    <>
      <Seachbar onSubmit={handleSubmit} />

      {gallery.length === 0 && <DefaultEmptyField />}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        draggablePercent={60}
      />

      {isLoading && (
        <Section>
          <LoaderSpinner />
        </Section>
      )}

      <authContext.Provider value={hadleImageClick}>
        {search && <ImageGallery gallery={gallery} />}
      </authContext.Provider>

      {isModalOpen && (
        <Modal onClose={toggleModal}>
          <img
            src={selectedLowQImgUrl}
            data-src={selectedImgURL}
            alt="fullsizeImage"
            className="lazyload blur-up"
          />
        </Modal>
      )}

      <Section>
        {search && gallery.length > 11 && <Button onClick={fetchPictures} />}
      </Section>
    </>
  );
}
