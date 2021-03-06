import React, {createContext, FC} from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Redirect} from 'react-router-dom'
import 'firebaseConfig'
import 'style/index.sass'
import Navbar from 'components/Navbar'
import {Routes} from 'routes'
import {useAuthState} from 'react-firebase-hooks/auth'
import firebase from 'firebase/app'
import {FirebaseContextProps} from 'types/dbTypes'
import 'firebase/firestore'
import Loader from 'components/loader/Loader'
import {authPageId} from 'pages/AuthPage'
import {navList} from 'constant/common'

const auth = firebase.auth()
const db = firebase.firestore()

export const FirebaseContext = createContext<FirebaseContextProps>({firebase, auth, user: null, db})

const App: FC = () => {
  const [user, loading] = useAuthState(auth)

  if (loading) return <Loader/>

  if (!user) return (
    <div className="app">
      <Redirect to={`/${authPageId}`}/>
      <Routes/>
    </div>
  )

  return (
    <FirebaseContext.Provider value={{firebase, auth, user, db}}>
      <div className="app">
        <Navbar navList={navList}/>
        <div className="main-content">
          <Routes/>
        </div>
      </div>
    </FirebaseContext.Provider>
  )
}


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App/>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
