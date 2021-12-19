import { put, select, all } from 'redux-saga/effects';

const headers =  {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "hotels-com-provider.p.rapidapi.com",
      "x-rapidapi-key": "9f5d71237bmsh3fe4ee195ad13d6p1c668cjsn9c7526558e3b"
    }
};

function* deserialize( action ) {
  console.log('I am state')
  const state = yield select();
  
  console.log(state);
  yield put({ type: 'DESERIALIZE_COMPLETE' });
}

function* fetchHotels() {
  console.log('start yile')
  const state = yield select();
  console.log('i am state');
  console.log(state);
  
  // const json = yield fetch(`https://hotels-com-provider.p.rapidapi.com/v1/hotels/search?checkin_date=${state.info.checkin}&checkout_date=${state.info.checkout}&sort_order=STAR_RATING_HIGHEST_FIRST&destination_id=${state.info.city}&adults_number=1&locale=ru_RU&currency=RUB`, headers
  // )
  //       .then(response => response.json(), );   
  //       console.log('I AM SAGA')
  //       console.log(json)
  // yield put({ type: "GET_HOTELS", payload: json, });
}

export default function* rootSaga() {
   yield all([
    fetchHotels(),
   ]);
}