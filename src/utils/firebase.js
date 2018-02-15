import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyAlFSd_V3smF-_DrRgAoqrxssgf7yVdYUg',
  authDomain: 'zencal-db.firebaseapp.com',
  databaseURL: 'https://zencal-db.firebaseio.com',
  projectId: 'zencal-db',
  storageBucket: 'zencal-db.appspot.com',
  messagingSenderId: '287359296549'
};

const fire = firebase.initializeApp(config);
export default fire;