import React, { Component } from 'react';
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

export default class App extends Component {
  state = {
    gallery: [],
    currentPage: 1,
    isLoading: false,
    search: '',
    error: null,
    selectedImgURL: '',
    selectedLowQImgUrl: '',
    isModalOpen: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.search !== this.state.search) {
      this.fetchPictures();
    }
  }

  fetchPictures = () => {
    const { search, currentPage } = this.state;

    this.setState({ isLoading: true });

    fetchGallery(search, currentPage)
      .then(images => {
        this.setState(prevState => ({
          gallery: [...prevState.gallery, ...images],
          currentPage: prevState.currentPage + 1,
        }));
      })
      .catch(error => this.setState({ error }))
      .finally(() => {
        this.onLoadMoreBtnClick();
        this.setState({ isLoading: false });
      });
  };

  handleSubmit = query => {
    if (query !== this.state.search) {
      this.setState({
        gallery: [],
        search: query,
        currentPage: 1,
        error: null,
      });
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

      return;
    }
  };

  onLoadMoreBtnClick = () => {
    if (this.state.currentPage > 2) {
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

  hadleImageClick = e => {
    if (e.target.nodeName !== 'IMG') {
      return;
    }

    e.preventDefault();

    const fullImgLink = e.target.getAttribute('data-large');
    const lowSrc = e.target.getAttribute('src');

    this.setState({
      selectedImgURL: fullImgLink,
      selectedLowQImgUrl: lowSrc,
      isModalOpen: true,
    });
  };

  toggleModal = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });

    if (this.state.isModalOpen) {
      document.body.style.overflowY = 'hidden';
    }
  };

  render() {
    const {
      search,
      gallery,
      isLoading,
      selectedImgURL,
      isModalOpen,
      selectedLowQImgUrl,
    } = this.state;

    // console.log(gallery);

    return (
      <>
        <Seachbar onSubmit={this.handleSubmit} />

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

        <authContext.Provider value={this.hadleImageClick}>
          {search && <ImageGallery gallery={gallery} />}
        </authContext.Provider>

        {isModalOpen && (
          <Modal onClose={this.toggleModal}>
            <img
              src={selectedLowQImgUrl}
              data-src={selectedImgURL}
              alt="fullsizeImage"
              className="lazyload blur-up"
            ></img>
          </Modal>
        )}

        <Section>
          {search && gallery.length > 11 && (
            <Button onClick={this.fetchPictures} />
          )}
        </Section>
      </>
    );
  }
}
