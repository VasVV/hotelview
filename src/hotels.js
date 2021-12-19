import {useState, useEffect, forwardRef} from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faChevronUp, faChevronDown, faHeart, faStar, faAngleRight, faHome, faCalendar } from '@fortawesome/free-solid-svg-icons';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import image from './background.png';
import DatePicker from "react-datepicker";
import { Rating } from 'react-simple-star-rating';
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate } from "react-router-dom";


import "react-datepicker/dist/react-datepicker.css";


import './hotels.css';
import HotelList from './hotelList';

const headers =  {
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "hotels-com-provider.p.rapidapi.com",
		"x-rapidapi-key": "9f5d71237bmsh3fe4ee195ad13d6p1c668cjsn9c7526558e3b"
    }
};


function Hotels() {

    const [city, setCity] = useState('Москва');
    const [fixedCity, setFixedCity] = useState('Москва');
    const [checkinDate, setCheckinDate] = useState(new Date());
    const [fixedCheckinDate, setFixedCheckinDate] = useState(new Date());
    const [numberOfDays, setNumberOfDays] = useState(1);
    const [fixedNumberOfDays, setFixedNumberOfDays] = useState(1);
    const [checkoutDate, setCheckOutDate] = useState( new Date( new Date().getTime() + 86400000).toISOString().split('T')[0]);
    const [hotelList, setHotelList] = useState([]);
    const [isRatingUp, setIsRatingUp] = useState(true);
    const [isPriceUp, setIsPriceUp] = useState(true);

    const favs = useSelector((state) => state.addRemoveFavs);
    const images = useSelector((state) => state.hardcodedImages);
    const sagaHotels = useSelector((state) => state.getHotels);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const dateToReadableString = date => {
        if (typeof date == 'object') {
          const monthNames = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентябрь", "Октября", "Ноября", "Декабря"];
          let day = date.getDate();
          let month = monthNames[date.getMonth()];
          let year = date.getFullYear();
          return `${day} ${month} ${year}`;
          }
          else return date;
      };

    useEffect(() => {
        isLoggedIn();
        initialInfoLoading();
    }, [])

    const initialInfoLoading = async () => {
        let today = new Date();
        let ms = today.getTime() + 86400000;
        let checkout = new Date(ms).toISOString().split('T')[0];

        try {
            let response = await fetch(`https://hotels-com-provider.p.rapidapi.com/v1/hotels/search?checkin_date=${today.toISOString().split('T')[0]}&checkout_date=${checkout}&sort_order=STAR_RATING_HIGHEST_FIRST&destination_id=1153093&adults_number=1&locale=ru_RU&currency=RUB`, headers);
            let data = await response.json();
            setHotelList(data["searchResults"]["results"]);
          } catch(e) {
              return e;
          }
    }

    const isLoggedIn = () => {
        if ( JSON.parse(localStorage.getItem('isLoggedIn')) == false ) {
            navigate('/');
        }
    };

    const daysEndingFunc = num => {
        const endings = ['дня', 'дней', 'день'];
        let remNum = num % 100;
        if (remNum >=11 && remNum <= 19) {
            return endings[1];
        } else {
            remNum = remNum % 10;
            switch(remNum) {
                case 1: 
                    return endings[2];
                case 2:
                case 3:
                case 4:
                    return endings[0];
                default:
                    return endings[1];
            }
        }
    };

    const hotelsEndingFunc = num => {
        const endings = ['отеля', 'отелей', 'отель'];
        let remNum = num % 100;
        if (remNum >=11 && remNum <= 19) {
            return endings[1];
        } else {
            remNum = remNum % 10;
            switch(remNum) {
                case 1: 
                    return endings[2];
                case 2:
                case 3:
                case 4:
                    return endings[0];
                default:
                    return endings[1];
            }
        }
    };


   const calculateDays =  days => {
       let ms = checkinDate.getTime() + 86400000 * days;
       let checkout = new Date(ms).toISOString().split('T')[0];
       setCheckOutDate(checkout);
       setNumberOfDays(days);
   }

   const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className="hotels__search__form__group__line__wrapper">
        <input onClick={onClick} ref={ref} value={value} className="hotels__search__form__group__line" />
        <FontAwesomeIcon icon={faCalendar} className="hotels__search__form__group__line__icon" />
    </div>
  ));

  const getDestinationId = async query => {
        try {
            let response = await fetch(`https://hotels-com-provider.p.rapidapi.com/v1/destinations/search?query=${query}&currency=RUB&locale=ru_RU`, headers);
            let data = await response.json();
            console.log(data['suggestions'][0]['entities'][0]["destinationId"])
            return data['suggestions'][0]['entities'][0]["destinationId"];
        } catch(e) {
            return e;
        }
  };

  const getHotels = async destinationId => {
      let cityId = await getDestinationId(city);
      dispatch({type: 'PASS_INFO', payload: {checkin: checkinDate.toISOString().split('T')[0], checkout: checkoutDate, city: cityId}  });
      dispatch({type: 'GET_HOTELS'});
     console.log('recevied saga hotels');
     console.log(sagaHotels);
      try {
        let response = await fetch(`https://hotels-com-provider.p.rapidapi.com/v1/hotels/search?checkin_date=${checkinDate.toISOString().split('T')[0]}&checkout_date=${checkoutDate}&sort_order=STAR_RATING_HIGHEST_FIRST&destination_id=${destinationId}&adults_number=1&locale=ru_RU&currency=RUB`, headers);
        let data = await response.json();
        return data["searchResults"]["results"];
      } catch(e) {
          return e;
      }
  }

  const getList = async () => {
      let destinationId = await getDestinationId(city);
      let recievedHotelsList = await getHotels(destinationId);
      setHotelList(recievedHotelsList);
  }

  const formSubmit = async e => {
      e.preventDefault();
      setFixedCity(city);
      setFixedNumberOfDays(numberOfDays);
      setFixedCheckinDate(checkinDate);
      getList();
  }

  const logOut = e => {
      e.preventDefault();
      localStorage.setItem('isLoggedIn', false);
      navigate('/');
  }

  const favsSort = type => {
    if (type === 'rating') {
        if (isRatingUp) {
            console.log('clicked up')
            dispatch({type: 'SORT_RATING_UP'});
            setIsRatingUp(false);
        } else {
            console.log('clicked down')
            dispatch({type: 'SORT_RATING_DOWN'});
            setIsRatingUp(true);
        }
    } else {
        if (isPriceUp) {
            console.log('clicked up')
            dispatch({type: 'SORT_PRICE_UP'});
            setIsPriceUp(false);
        } else {
            console.log('clicked down')
            dispatch({type: 'SORT_PRICE_DOWN'});
            setIsPriceUp(true);
        }
    }
   
  };

  const dateToReadableStringEng = date => {
    if (typeof date == 'object') {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let day = date.getDate();
      let month = monthNames[date.getMonth()];
      let year = date.getFullYear();
      return `${day} ${month}, ${year}`;
      } else return date;
  };

  const isCurrFaved = name => {
      if (favs.findIndex(e => e.name == name) != -1 && favs.findIndex(e => e.checkin == dateToReadableStringEng(checkinDate)) != -1 && favs.findIndex( e => e.days == numberOfDays) != -1) {
          console.log(true);
          return true;
      } else return false;
  }
  

    return (
        <div className="hotels">
            <div className="hotels__header">
                <p className="hotels__header__title">Simple Hotel Check</p>
                <a className="hotels__header__quit" onClick={(e) => logOut(e)}> Выйти <FontAwesomeIcon icon={faSignOutAlt} /> </a>
            </div>
            <div className="hotels__main">
                <div className="hotels__left">
                    <div className="hotels__search">
                        <form className="hotels__search__form" onSubmit={e => formSubmit(e)}>
                            <div className="hotels__search__form__group">
                                <label className="hotels__search__form__group__label" for="location">Локация</label>
                                <input type="text" className="hotels__search__form__group__line" id="location" onChange={e => setCity(e.target.value)} value={city} />
                            </div>
                            <div className="hotels__search__form__group">
                                <label className="hotels__search__form__group__label" for="date">Дата заселения</label>
                                <DatePicker
                                     id="date"
                                    selected={checkinDate}
                                    onChange={date => setCheckinDate(date)}
                                    customInput={<CustomInput />}
                                    />   
                            </div>
                            <div className="hotels__search__form__group">
                                <label className="hotels__search__form__group__label" for="days">Количество дней</label>
                                <input type="text" className="hotels__search__form__group__line" id="days" onChange={e => calculateDays(e.target.value)} value={numberOfDays}/>
                            </div>
                            <button className="hotels__search__submit" type='submit'>
                                <span className="hotels__search__submit__text">Найти</span> 
                            </button>
                        </form>
                    </div>
                    <div className="hotels__favourites">
                        <p className="hotels__favourites__header">Избранное</p>
                        <div className="hotels__favourites__selectors">
                            <div className="hotels__favourites__selectors__rating" onClick={() => favsSort('rating')}>
                                <span className="hotels__favourites__selectors__rating__text">Рейтинг</span>
                                <div className="hotels__favourites__selectors__rating__updown" >
                                    <FontAwesomeIcon icon={faChevronUp} transform="down-6" size="xs" className={!isRatingUp ? "hotels__favourites__selectors__updown__greyedout" : ''} />
                                    <FontAwesomeIcon icon={faChevronDown} transform="down-1" size="xs" className={isRatingUp ? "hotels__favourites__selectors__updown__greyedout" : ''}/>
                                </div>
                            </div>
                            <div className="hotels__favourites__selectors__price" onClick={() => favsSort('price')}>
                                <span className="hotels__favourites__selectors__price__text">Цена</span>
                                <div className="hotels__favourites__selectors__price__updown">
                                    <FontAwesomeIcon icon={faChevronUp} transform="down-6"  size="xs" className={!isPriceUp ? "hotels__favourites__selectors__updown__greyedout" : ''}/> 
                                    <FontAwesomeIcon icon={faChevronDown} transform="down-1"  size="xs" className={isPriceUp ? "hotels__favourites__selectors__updown__greyedout" : ''}/>
                                </div>
                            </div>
                        </div>
                        <div className="hotels__favourites__list">
                            {favs.map( e => {
                                return (
                                    <HotelList
                                        name={e.name}
                                        checkinDate={favs[favs.findIndex(arrayEl => arrayEl.id == e.id && arrayEl.checkin == e.checkin && arrayEl.days == e.days)].checkin}
                                        numberOfDays={favs[favs.findIndex(arrayEl => arrayEl.id == e.id && arrayEl.checkin == e.checkin && arrayEl.days == e.days)].days}
                                        daysEnding = {favs[favs.findIndex(arrayEl => arrayEl.id == e.id && arrayEl.checkin == e.checkin && arrayEl.days == e.days)].ending}
                                        rating = {e.guestReviews.unformattedRating}
                                        price={e.ratePlan.price.current}
                                        info={e}
                                        isMainList={false}
                                        isFaved={true}
                                    /> 
                                    )
                            })}
                        </div>
                    </div>
                </div>
                <div className="hotels__right">
                    <div className="hotels__results">
                        <div className="hotels__results__header">
                            <div>
                                <span className="hotels__results__header__static">Отели</span> <FontAwesomeIcon icon={faAngleRight} className="hotels__results__header__icon" transform="down-1" /> <span className="hotels__results__header__dynamic">{fixedCity}</span>
                            </div>
                            <div className="hotels__results__header__date">
                                {dateToReadableString(checkinDate)}
                            </div>
                        </div>
                        <div className="hotels__results__carousel">
                            <Carousel 
                                autoPlay={true}
                                emulateTouch={true}
                                infiniteLoop={true}
                                interval={2000}
                                swipeable={true}
                                showThumbs={false}
                                >
                                <div>
                                    <img src={images[0]} />
                                </div>
                                <div>
                                    <img src={images[1]} />
                                </div>
                                <div>
                                    <img src={images[2]} />
                                </div>
                            </Carousel>
                        </div>
                        <div className="hotels__results__favourited">
                            <span className="hotels__results__favourited__static">Добавлено в Избранное: </span>
                            <span className="hotels__results__favourited__dynamic"> {favs.length} </span>
                            <span className="hotels__results__favourited__static">{hotelsEndingFunc(favs.length)} </span>
                        </div>
                        <div className="hotels__results__list">
                            {hotelList.map(e => {
                                return (
                                    <HotelList
                                        name={e.name}
                                        checkinDate={fixedCheckinDate}
                                        numberOfDays={fixedNumberOfDays}
                                        daysEnding = {daysEndingFunc(fixedNumberOfDays)}
                                        rating = {e.guestReviews.unformattedRating}
                                        price={e.ratePlan.price.current}
                                        info={e}
                                        isMainList={true}
                                        isFaved ={isCurrFaved(e.name)}
                                    />
                                    
                                    )
                            })}
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hotels;