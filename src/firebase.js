import * as firebase from "firebase/app"
import keys from './config/keys'
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore/lite"

const app = firebase.initializeApp(keys)
const auth = getAuth(app)
const db = getFirestore(app)

export { db, auth }
