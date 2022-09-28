import { useEffect, useState } from 'react'
import './App.css'

type User = {
  id: number
  username: string
}

function App () {
  const [currentUser, setUser] = useState({ id: 1, username: 'Nicolas' })
  const [friends, setFriends] = useState<User[]>([])
  const [searchedUsers, setSearchedUsers] = useState<User[]>([])

  useEffect(() => {
    fetch(`http://localhost:5678/my-friends/${currentUser.id}`)
      .then(resp => resp.json())
      .then(friends => setFriends(friends))
  }, [currentUser.id])

  return (
    <div className='App'>
      <h1>Friends with Benefits</h1>
      <h2>Welcome back, {currentUser.username}!</h2>
      <ul>
        {friends.map(friend => (
          <li key={friend.id}>
            {friend.username}{' '}
            <button
              onClick={() => {
                fetch('http://localhost:5678/remove-friend', {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    ourId: currentUser.id,
                    theirId: friend.id
                  })
                }).then(() => {
                  fetch(`http://localhost:5678/my-friends/${currentUser.id}`)
                    .then(resp => resp.json())
                    .then(friends => setFriends(friends))
                })
              }}
            >
              🦵🏻
            </button>
          </li>
        ))}
        {friends.length === 0 && <h3>Awwww, you have no friends 😢</h3>}
      </ul>

      <form
        onSubmit={e => {
          e.preventDefault()
          // @ts-ignore
          fetch(`http://localhost:5678/search/${e.target.username.value}`)
            .then(resp => resp.json())
            .then(searchedUsers => setSearchedUsers(searchedUsers))
        }}
      >
        <input type='text' name='username' />
        <button>SEARCH</button>
      </form>

      <h3>Here are the users you found:</h3>
      <ul>
        {searchedUsers.map(user => (
          <li key={user.id}>
            {user.username}
            <button
              onClick={() => {
                fetch('http://localhost:5678/make-friend', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    ourId: currentUser.id,
                    theirId: user.id
                  })
                }).then(() => {
                  fetch(`http://localhost:5678/my-friends/${currentUser.id}`)
                    .then(resp => resp.json())
                    .then(friends => setFriends(friends))
                })
              }}
            >
              🤗
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
