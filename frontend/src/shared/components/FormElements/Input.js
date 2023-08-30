import { useReducer, useEffect } from 'react';

import { validate } from '../../util/validators';
import './Input.css';           

function inputReducer(state, action) {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case 'TOUCH':
            return {
                ...state,
                touched: true
            };
        default: 
            return state;
    }
};


export default function Input(props) {

    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || '', 
        isValid: props.initialValid || false, 
        touched: false
    });

    const {id, onInput} = props;        //these props are pulled from the objects to avoid infinite loops within 
    const {value, isValid} = inputState;    //useEffect

    useEffect(() => {
        onInput(id, value, isValid)
    }, [id, value, isValid, onInput]);

    function changeHandler(event) {
        dispatch({type: 'CHANGE', val: event.target.value, validators: props.validators});
    };

    function touchHandler() {
        dispatch({type: 'TOUCH'});
    };

    const element = props.element === 'input' ? (
        <input 
            id={props.id} 
            type={props.type} 
            placeholder={props.placeholder} 
            onChange={changeHandler} 
            onBlur={touchHandler}
            value={inputState.value} 
        />
    ) : (
        <textarea 
            id={props.id} 
            rows={props.rows || 3} 
            onChange={changeHandler} 
            onBlur={touchHandler}
            value={inputState.value} 
        /> 
    );

    return (
        <div className={`form-control ${!inputState.isValid && inputState.touched && 'form-control--invalid'}`}>
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.touched && <p>{props.errorText}</p>}
        </div>
    );
};


//We can also use third party libraries for form functionality such as React 'Formik'