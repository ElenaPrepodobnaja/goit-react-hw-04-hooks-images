import axios from 'axios';
import PropTypes from 'prop-types';

const API_KEY = '22622194-9ff4545401c35c3e57910f120';
const BASE_URL = 'https://pixabay.com/api/';

const fetchGallery = (query, currentPage) => {
  return axios
    .get(
      `${BASE_URL}?q=${query}&page=${currentPage}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`,
    )
    .then(response => response.data.hits);
};

fetchGallery.propTypes = {
  query: PropTypes.string.isRequired,
  currentPage: PropTypes.number.isRequired,
};

export default fetchGallery;
