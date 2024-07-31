import React from "react";
import Lists from "./Lists";
import CreateList from "./CreateList";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      alldata: [],
      singledata: {
        title: "",
        author: ""
      },
      error: null
    };
  }

  getLists = () => {
    this.setState({ loading: true, error: null });
    fetch("http://localhost:5000/posts")
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(result => 
        this.setState({
          loading: false,
          alldata: result
        })
      )
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        this.setState({ loading: false, error: error.message });
      });
  }
  

  getList = (event, id) => {
    this.setState({
      singledata: {
        title: "Loading.....",
        author: "Loading....."
      },
      error: null
    }, () => {
      fetch(`http://localhost:5000/posts/${id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then(result => {
          this.setState({
            singledata: {
              title: result.title,
              author: result.author ? result.author : ""
            }
          });
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
          this.setState({ error: error.message });
        });
    });
  }

  handleChange = (event) => {
    let title = this.state.singledata.title;
    let author = this.state.singledata.author;
    if (event.target.name === "title") title = event.target.value;
    else author = event.target.value;

    this.setState({
      singledata: {
        title: title,
        author: author
      }
    });
  }

  createList = () => {
    fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.singledata)
    }).then(
      this.setState({
        singledata: {
          title: "",
          author: ""
        }
      })
    ).catch(console.error);
  }

  updateList = (event, id) => {
    fetch(`http://localhost:5000/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.singledata)
    }).then(res => res.json())
      .then(result => {
        this.setState({
          singledata: {
            title: "",
            author: ""
          }
        });
        this.getLists();
      })
      .catch(console.error);
  }

  deleteList = (event, id) => {
    fetch(`http://localhost:5000/posts/${id}`, {
      method: "DELETE"
    }).then(res => res.json())
      .then(result => {
        this.setState({
          singledata: {
            title: "",
            author: ""
          }
        });
        this.getLists();
      })
      .catch(console.error);
  }

  render() {
    const listTable = this.state.loading ? (
      <span>Loading Data.....Please be patient.</span>
    ) : (
      <Lists alldata={this.state.alldata}
        singledata={this.state.singledata}
        getList={this.getList}
        updateList={this.updateList}
        deleteList={this.deleteList}
        handleChange={this.handleChange} />
    );

    return (
      <div className="container">
        <span className="title-bar">
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.getLists}
          >
            Get Lists
          </button>
          <CreateList singledata={this.state.singledata} handleChange={this.handleChange} createList={this.createList} />
        </span>
        {listTable}
        {this.state.error && <div className="error">{this.state.error}</div>}
      </div>
    )
  }
}

export default App;
