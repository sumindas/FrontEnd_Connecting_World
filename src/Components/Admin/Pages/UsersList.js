// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import ConfirmationModal from './confirmationModal';


// const UsersList = () => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/socialadmin/users/');
//         setUsers(response.data);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     fetchData();
//   }, []); 

//   const onBlock = async (userId) => {
//     try {
//         const response = await axios.post(`http://127.0.0.1:8000/socialadmin/block_unblock_user/${userId}/`);
//         console.log("Success:",response)
//     } catch (error) {
//         console.error('Error blocking/unblocking user:', error);
//     }
// };


//   return (
//     <>
//       <div className="text-center">
//         <h1 className="text-4xl mt-3 mb-3 text-pink-700 font-bold"> User Management</h1>
//       </div>

//       <div className="container mx-auto my-5">
//         <table className="min-w-full bg-white border border-gray-300">
//           <thead>
//             <tr>
//               <th className="py-2 px-4 border-b">User ID</th>
//               <th className="py-2 px-4 border-b">Username</th>
//               <th className="py-2 px-4 border-b">Email</th>
//               <th className="py-2 px-4 border-b">Active</th>
//               <th className="py-2 px-4 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id}>
//                 <td className="py-2 px-4 border-b">{user.id}</td>
//                 <td className="py-2 px-4 border-b">{user.username}</td>
//                 <td className="py-2 px-4 border-b">{user.email}</td>
//                 <td className="py-2 px-4 border-b">{user.is_active ? 'Yes' : 'No'}</td>
//                 <td className="py-2 px-4 border-b">
//                   {user.is_active ? (
//                     <button
//                       className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
//                       onClick={() => onBlock(user.id)}
//                     >
//                       Block
//                     </button>
//                   ) : (
//                     <button
//                       className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
//                       onClick={() => onBlock(user.id)}
//                     >
//                       Unblock
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

// export default React.memo(UsersList);
// UsersList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmationModal from './confirmationModal';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/socialadmin/users/');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const onBlockUnblockClick = (userId, action) => {
    setSelectedUserId(userId);
    setActionType(action);
    setShowConfirmationModal(true);
  };

  const handleConfirmation = async () => {
    try {
      const block_unblock_response = await axios.post(`http://127.0.0.1:8000/socialadmin/block_unblock_user/${selectedUserId}/`);
      console.log("Response:",block_unblock_response)
      console.log(`Confirmed ${actionType} for user ${selectedUserId}`);


      const response = await axios.get('http://127.0.0.1:8000/socialadmin/users/');
      setUsers(response.data);

      // Close the modal
      setShowConfirmationModal(false);
      setSelectedUserId(null);
      setActionType('');
    } catch (error) {
      console.error('Error handling confirmation:', error);
    }
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
    setSelectedUserId(null);
    setActionType('');
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-4xl mt-3 mb-3 text-pink-700 font-bold">User Management</h1>
      </div>

      <div className="container mx-auto my-5">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">User ID</th>
              <th className="py-2 px-4 border-b">Username</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Active</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{user.id}</td>
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.is_active ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4 border-b">
                  {user.is_active ? (
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => onBlockUnblockClick(user.id, 'Block')}
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => onBlockUnblockClick(user.id, 'Unblock')}
                    >
                      Unblock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmationModal}
        onHide={closeConfirmationModal}
        onConfirm={handleConfirmation}
        actionType={actionType}
      />
    </>
  );
};

export default React.memo(UsersList);
