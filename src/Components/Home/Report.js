import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../Api/api';


const ReportModal = ({ postId, onClose,onSuccess }) => {
 const [reportContent, setReportContent] = useState('');
 const userId = localStorage.getItem('userId')
 console.log(postId,"-----")

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/report_post/${postId}/${userId}/`, {
        content: reportContent,
      });
      if (response.status === 201) {
        alert('Report submitted successfully!');
        onSuccess()
        onClose();
      } else {
        alert('Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    }
 };

 return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Report Post
            </h3>
            <div className="mt-2">
              <form onSubmit={handleSubmit}>
                <textarea
                 value={reportContent}
                 onChange={(e) => setReportContent(e.target.value)}
                 placeholder="Enter your report here..."
                 required
                 className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                />
                <div className="mt-3">
                 <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Submit Report
                 </button>
                </div>
              </form>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button onClick={onClose} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
 );
};

export default ReportModal;
