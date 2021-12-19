import './hotels.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faSignOutAlt, faChevronUp, faChevronDown, faHeart, faStar, faAngleRight, faHome, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'
import { Rating } from 'react-simple-star-rating';
import {useSelector, useDispatch} from 'react-redux';



function HotelList(props) {

    const dispatch = useDispatch();

    const favs = useSelector((state) => state.addRemoveFavs);

    const handleRating = () => { return;}

  const dateToReadableString = date => {
      if (typeof date == 'object') {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let day = date.getDate();
        let month = monthNames[date.getMonth()];
        let year = date.getFullYear();
        return `${day} ${month}, ${year}`;
        }
        else return date;
    };

    const addRemoveFavs = (info, checkin, days, ending) => {
        info = {
            ...info,
            checkin,
            days,
            ending
        }
        let exists = favs.findIndex(arrayEl => arrayEl.id == info.id && arrayEl.checkin == checkin && arrayEl.days == days);
        exists != -1 ? dispatch({type: 'REMOVE_FROM_FAVS', payload: exists}) : dispatch({type: 'ADD_TO_FAVS', payload: info});
    }

    return (
        <div className="hotels__results__list__item">
                                        <div className="hotels__results__list__item__home">
                                            {
                                            props.isMainList ?
                                            <div className="hotels__results__list__item__home__circlebg">
                                                <FontAwesomeIcon icon={faHome} size="3x" className="hotels__results__list__item__home__icon" /> 
                                            </div> : ''
                                             }
                                        </div>
                                            <div className="hotels__results__list__item__info">
                                                    <div className="hotels__favourites__list__firstline">
                                                        <p className="hotels__favourites__list__firstline__name">{props.name.length > 35 && ! props.isMainList ? props.name.slice(0, 35) + '...' : props.name}</p>
                                                        <FontAwesomeIcon icon={props.isFaved? faHeart : farHeart} className="hotels__favourites__list__firstline__heart" onClick={() => addRemoveFavs(props.info, dateToReadableString(props.checkinDate), props.numberOfDays, props.daysEnding )}/>
                                                    </div>
                                                    <div className="hotels__favourites__list__secondline">
                                                        <p className="hotels__favourites__list__secondline__date">{dateToReadableString(props.checkinDate)}<span className="hotels__favourites__list__secondline__date__divider">—</span> {props.numberOfDays} {props.daysEnding} </p>
                                                    </div>
                                                    <div className="hotels__favourites__list__thirdline">
                                                    <div className="hotels__favourites__list__thirdline__rating">
                                                                <Rating
                                                                    onClick={handleRating}
                                                                    ratingValue={props.rating}
                                                                    fullIcon={<FontAwesomeIcon icon={faStar} className="hotels__favourites__list__thirdline__rating__starfilled" />}
                                                                    emptyIcon={<FontAwesomeIcon icon={faStar} className="hotels__favourites__list__thirdline__rating__starempty"/> }
                                                                    readonly={true}
                                                                />    
                                                    </div>
                                                    <div className="hotels__favourites__list__thirdline__price">
                                                        <span className="hotels__favourites__list__thirdline__price__static">Price:</span> <span className="hotels__favourites__list__thirdline__price__dynamic">{props.price.replace('RUB', '₽')}  </span>
                                                    </div>
                                                </div>
                                                <hr />
                                            </div>
                                </div>
    )
}

export default HotelList;

//e.guestReviews.unformattedRating
//e.ratePlan.price.current