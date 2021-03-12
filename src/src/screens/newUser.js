import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Button } from 'react-materialize';
import { useHistory, useParams } from 'react-router';

const FORM_UPDATE = 'UPDATE';
const USER_LOADED =  'USER_LOADED';
const formReducer = (state, action) => {
    let updatedValues = null;
    switch (action.type){
        case FORM_UPDATE:
            updatedValues = {
                ...state.inputValues,
                [action.inputId]: action.value
            };
    
            return {
                ...state,
                inputValues: updatedValues
            }
        
        case USER_LOADED:
            updatedValues = {
                ...state.inputValues,
                id: action.user.id,
                firstName: action.user.firstName,
                lastName: action.user.lastName,
                birthday: action.user.birthday,
                gender_id: action.user.gender_id,
                password: action.user.password
            }

            return {
                ...state,
                inputValues: updatedValues
            }
        
        default: return state;
    }
};

const NewUser = props => {

    const [formState, dispatchForm] = useReducer(formReducer, {
        inputValues: {
            id: null,
            firstName: '',
            lastName: '',
            birthday: '1993-07-30',
            password: 'superSecurePassword',
            gender_id: 1,
        }
    });
    
    const [genders, setGenders] = useState([]);
    const [loading, setLoading] = useState(true);

    const {id} = useParams();
    const history = useHistory();

    useEffect(() => {
        if (id) {
            fetch('http://localhost:4000/user/'+id)
            .then(response => response.json())
            .then(data => {
                dispatchForm({type: USER_LOADED, user: data.user});
                return fetch('http://localhost:4000/gender');
            })
            .then(response => response.json())
            .then(data => {
                if (data.genders){
                    setGenders(data.genders);
                }
    
                setLoading(false);
            });
        } else {
            fetch('http://localhost:4000/gender')
            .then(response => response.json())
            .then(data => {
                if (data.genders){
                    setGenders(data.genders);
                }
    
                setLoading(false);
            });
        }
    }, [id, dispatchForm, setGenders, setLoading]);
    

    const onTextChangeHander = useCallback((text, inputId) => {
        dispatchForm({type: FORM_UPDATE, value: text, inputId});
    }, [dispatchForm]);

    const onFormSubmitHandler = useCallback((event) => {
        event.preventDefault();
        setLoading(true);

        let data = {user: {
            firstName: formState.inputValues.firstName, 
            lastName: formState.inputValues.lastName, 
            birthday: formState.inputValues.birthday, 
            password: formState.inputValues.password, 
            gender_id: formState.inputValues.gender_id
        }};

        let method = 'POST';

        if (id){ //updating
            data.user['id'] = formState.inputValues.id;
            method = 'PUT';
        } 

        fetch('http://localhost:4000/user', {
            method: method, 
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(data)
        })
        .then(data => {
            setLoading(false);
            history.push('/');
        })
    }, [formState, setLoading, history, id]);

    return (
        <div style={{marginRight: '30%', marginLeft: '30%', marginTop: 100}}>
            { !loading && (
                <form onSubmit = {onFormSubmitHandler}>
                    <label for="fname">First name:</label>
                    <input type="text" value={formState.inputValues.firstName} onChange={event => onTextChangeHander(event.target.value, 'firstName')} name="fname"/><br/><br/>

                    <label for="lname">Last name:</label>
                    <input type="text" value={formState.inputValues.lastName} onChange={event => onTextChangeHander(event.target.value, 'lastName')} name="lname"/><br/><br/>

                    <label for="birthday">Birthday:</label>
                    <input type="text" value={formState.inputValues.birthday} onChange={event => onTextChangeHander(event.target.value, 'birthday')} name="birthday"/><br/><br/>

                    {!id && (
                        <div>
                        <label for="pwd">password:</label>
                       <input type="text" value={formState.inputValues.password} onChange={event => onTextChangeHander(event.target.value, 'password')} name="pwd"/><br/><br/>
    
                        </div>
                       
                    )}

                    <label for="gender">Gender:</label>
                    <select style={{display: 'unset'}} value={formState.inputValues.gender_id} onChange={event => onTextChangeHander(event.target.value, 'gender_id')}>
                        {genders.map(gender => (
                            <option key={gender.gender_id} value={gender.gender_id}>{gender.name}</option>
                        ))}
                    </select>

                    <Button
                        node="button"
                        type="submit"
                        waves="light"
                        style={{width: '100%', marginTop: 50}}
                    >
                        SEND
                    </Button>
                </form>
            )}
        </div>
    );
}

export default NewUser;