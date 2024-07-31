import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import UpdateList from "./UpdateList";
import DeleteList from './DeleteList';

function Lists(props) {
    let listrows = [];
    props.alldata.forEach(element => {
        listrows.push(
            <tr key={element._id}>
                <td>{element._id}</td>
                <td>{element.title}</td>
                <td>{element.author}</td>
                <td>
                    <UpdateList
                        elementId={element._id}
                        singledata={props.singledata}
                        getList={props.getList}
                        updateList={props.updateList}
                        handleChange={props.handleChange}
                    ></UpdateList>
                </td>
                <td>
                    <DeleteList
                        elementId={element._id}
                        singledata={props.singledata}
                        getLists={props.getList}
                        deleteList={props.deleteList}
                    ></DeleteList>
                </td>
            </tr>
        )
    });
    return (
        <table className='table table-striped'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Update</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>{listrows}</tbody>
        </table>
    )
}

export default Lists;
