import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const FirebaseTestPage = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dbData, setDbData] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [authError, setAuthError] = useState('');
  const [dbError, setDbError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Fetch initial data
    fetchData();

    return () => unsubscribe();
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      setAuthError('');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      setAuthError('');
      await signOut(auth);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const fetchData = async () => {
    try {
      setDbError('');
      const querySnapshot = await getDocs(collection(db, 'test-items'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDbData(items);
    } catch (error) {
      setDbError('Error fetching data: ' + error.message);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    try {
      setDbError('');
      await addDoc(collection(db, 'test-items'), {
        text: newItem,
        createdAt: new Date().toISOString()
      });
      setNewItem('');
      fetchData(); // Refresh the list
    } catch (error) {
      setDbError('Error adding item: ' + error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Firebase Test Page</h1>

      {/* Authentication Section */}
      <div className="mb-8 p-6 border rounded-lg bg-white shadow">
        <h2 className="text-2xl font-semibold mb-4">Authentication Test</h2>
        
        <div className="mb-4">
          <p className="font-medium">Current Auth State:</p>
          <p className="mt-2">
            {user ? `Signed in as ${user.email}` : 'Not signed in'}
          </p>
        </div>

        {!user ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </button>
          </form>
        ) : (
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        )}

        {authError && (
          <p className="mt-4 text-red-500">{authError}</p>
        )}
      </div>

      {/* Database Section */}
      <div className="p-6 border rounded-lg bg-white shadow">
        <h2 className="text-2xl font-semibold mb-4">Database Test</h2>

        <form onSubmit={handleAddItem} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="New item text"
              className="flex-1 p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Item
            </button>
          </div>
        </form>

        <div>
          <h3 className="font-medium mb-2">Items in Database:</h3>
          {dbData.length > 0 ? (
            <ul className="space-y-2">
              {dbData.map((item) => (
                <li
                  key={item.id}
                  className="p-2 border rounded bg-gray-50"
                >
                  {item.text}
                  <span className="text-sm text-gray-500 ml-2">
                    ({new Date(item.createdAt).toLocaleString()})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No items in database</p>
          )}
        </div>

        {dbError && (
          <p className="mt-4 text-red-500">{dbError}</p>
        )}
      </div>
    </div>
  );
};

export default FirebaseTestPage;