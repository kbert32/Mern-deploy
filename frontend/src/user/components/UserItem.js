import { Link } from 'react-router-dom';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import { AuthContext } from '../../shared/context/auth-context';
import { useContext } from 'react';
import './UserItem.css';

export default function UserItem(props) {

    const authCtx = useContext(AuthContext);

    let highlight;
    if (props.id === authCtx.userId) {
        highlight = true;
    }
    
    return (
        <li className='user-item'>
            <Card className={`user-item__content ${highlight && 'loggedIn'}`}>
                <Link to={`/${props.id}/places`}>
                    <div className='user-item__image'>
                        <Avatar image={process.env.REACT_APP_BACKEND_URL + `/${props.image}`} alt={props.name} />
                    </div>
                    <div className='user-item__info'>
                        <h2>{props.name}</h2>
                        <h3>{props.placeCount.toLocaleString('en-us')} {props.placeCount === 1 ? 'Place' : 'Places'}</h3>
                    </div>    
                </Link>
            </Card>
        </li>
    );
};
