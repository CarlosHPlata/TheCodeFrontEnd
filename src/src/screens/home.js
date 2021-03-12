import React, { useCallback, useEffect, useState } from "react";
import { Button, Table } from "react-materialize";
//import { Table } from "react-materialize";

const Home = props => {

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [genders, setGenders] = useState([]);

    const onLoadUsersHandler = useCallback(() => {
        fetch('http://localhost:4000/user')
        .then(response => response.json())
        .then(data => {
            if (data.users){
                setUsers(data.users);
            }

            return fetch('http://localhost:4000/gender')
        })
        .then(response => response.json())
        .then(data => {
            if (data.genders){
                setGenders(data.genders);
            }

            setLoading(false);
        });
    }, [setUsers, setGenders, setLoading]);

    useEffect(() => {
        onLoadUsersHandler();
    }, [onLoadUsersHandler]);

    const onDeleteHandler = (id) => {
        fetch('http://localhost:4000/user/'+id, {method: 'DELETE'})
        .then(rsponse => {
            onLoadUsersHandler();
        })
    }
    

    return (
        <div style={{marginRight: 100, marginLeft: 100, marginTop: 30}}>
            <Button node="a" href="/user">Create new User</Button>

            {
                !loading && (
                    <Table>
                        <thead>
                            <tr>
                                <th data-field="firstName">
                                    First Name
                                </th>
                                <th data-field="lastName">
                                    Last Name
                                </th>
                                <th data-field="birthday">
                                    Birthday
                                </th>
                                <th data-field="gender">
                                    Gender
                                </th>
                                <th data-field="actions">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        {user.firstName}
                                    </td>
                                    <td>
                                        {user.lastName}
                                    </td>
                                    <td>
                                        {user.birthday}
                                    </td>
                                    <td>
                                        {genders.find(g => g.gender_id === user.gender_id).name}
                                    </td>
                                    <td>
                                        <Button node="a" href={"user/"+user.id}>Edit</Button>
                                        <Button style={{marginLeft:10}} className="red" onClick={()=>onDeleteHandler(user.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )
            }
            
        </div>
    )
}

export default Home;