import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/database'

const config = {
  // App keys
}

const database = firebase.initializeApp(config);

export default database;

