import React, { Component } from 'react';
import './Searchbar.css';
import 'react-toastify/dist/ReactToastify.css';

export default class Searchbar extends Component {
  state = {
    query: '',
  };

  handleChange = e => {
    this.setState({
      query: e.currentTarget.value.trim(),
    });
  };

  handleSubmit = e => {
    const { query } = this.state;
    e.preventDefault();

    this.props.onSubmit(query);
    this.setState({ query: '' });
  };

  render() {
    const { query } = this.state;

    return (
      <header className="Searchbar">
        <form className="SearchForm" onSubmit={this.handleSubmit}>
          <button type="submit" className="SearchForm-button">
            <span className="SearchForm-button-label">Search</span>
          </button>

          <input
            value={query}
            className="SearchForm-input"
            name="form_input"
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            onChange={this.handleChange}
          />
        </form>
      </header>
    );
  }
}
