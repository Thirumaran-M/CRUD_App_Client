import axios from "axios";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [filterUsers, setfilterUsers] = useState([]);
  const [userData, setUserData] = useState({ projNo: "", pIsbn: "", msRec: "", division: "", noOfPages: "", language: "", noOfChar: "", trimSize: "", template: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Search Function
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    console.log(searchText);
    const filteredUsers = users.filter((user) => user.pIsbn.toLowerCase().includes(searchText) || user.language.toLowerCase().includes(searchText));
    setfilterUsers(filteredUsers);
  }
  //Delete Function
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure to delete this record?");
    if (isConfirmed) {
      await axios.delete(`http://localhost:8181/report/delete/${id}`).then((res) => {
        //console.log(res.data);
        setUsers(res.data);
        setfilterUsers(res.data);
      })
    }
  }
  //Add Function
  const handleAddRecord = async () => {
    setUserData({ projNo: "", pIsbn: "", msRec: "", division: "", noOfPages: "", language: "", noOfChar: "", trimSize: "", template: "" });
    setIsModalOpen(true);

  }
  //Close Add Function Block
  const closeModal = () => {
    setIsModalOpen(false);
  }

  //Handle Data from Input text box
  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }

  //Handle Submit Data Function to Add New Record
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userData);
    if (userData._id) {
      try {
        const res = await axios.put(`http://localhost:8181/report/edit/${userData._id}`, userData);
        //      console.log(res.data);
        window.alert("Record Updated Successfully!");
        getAllUsers();
        closeModal();
      } catch (error) {
        console.error("Error fetching the data", error);
      }
    } else {
      try {
        const res = await axios.post("http://localhost:8181/report/new", userData);
        //      console.log(res.data);
        window.alert("New Record Added Successfully!");
        getAllUsers();
        closeModal();
      } catch (error) {
        console.error("Error fetching the data", error);
      }
    }
  }

  //Update Record
  const handleUpdate = (user) => {
    setUserData(user);
    setIsModalOpen(true);
  }

  //Display all data
  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8181/report/all");
      //console.log(res.data);
      setUsers(res.data);
      setfilterUsers(res.data);
    } catch (error) {
      console.error("Error fetching the data", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <div className="container">
        <div className="right"><img src="../assets/pl.png" className="logo" /></div>
        <h2>Peter Lang - PM Tool</h2>
        <div className="input-search">
          <input type="search" placeholder="Search ISBN/Language Here" onChange={handleSearchChange} />
          <button className="btn green" onClick={handleAddRecord}>Add Record</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Project&#160;No.</th>
              <th>Print&#160;ISBN - Paperback</th>
              <th>MS&#160;Received&#160;On</th>
              <th>Division</th>
              <th>No&#160;of&#160;Pages</th>
              <th>Language</th>
              <th>Tot.&#160;No&#160;of&#160;Char</th>
              <th>Trim&#160;Size</th>
              <th>Template</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterUsers && filterUsers.map((user, index) => {
              return (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.projNo}</td>
                  <td>{user.pIsbn}</td>
                  <td>{user.msRec}</td>
                  <td>{user.division}</td>
                  <td>{user.noOfPages}</td>
                  <td>{user.language}</td>
                  <td>{user.noOfChar}</td>
                  <td>{user.trimSize}</td>
                  <td>{user.template}</td>
                  <td><button className="btn green" onClick={() => handleUpdate(user)}>Edit</button></td>
                  <td><button className="btn red" onClick={() => handleDelete(user._id)}>Delete</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h3>{userData._id ? "Update Record" : "Add Record"}</h3>
              <div className="input-group">
                <label htmlFor="projNo">Project No.: </label>
                <input type="text" value={userData.projNo} name="projNo" id="projNo" onChange={handleData} />
              </div>
              <div className="input-group">
                <label htmlFor="pIsbn">Print ISBN - Paperback: </label>
                <input type="text" value={userData.pIsbn} name="pIsbn" id="pIsbn" onChange={handleData} />
              </div>
              <div className="input-group">
                <label htmlFor="msRec">MS Received On: </label>
                <input type="text" value={userData.msRec} name="msRec" id="msRec" onChange={handleData} />
              </div>
              <div className="input-group">
                <label htmlFor="division">Division: </label>
                <input type="text" value={userData.division} name="division" id="division" onChange={handleData} />
              </div>
              <div className="input-group">
                <label htmlFor="noOfPages">No of Pages: </label>
                <input type="number" value={userData.noOfPages} name="noOfPages" id="noOfPages" onChange={handleData} />
              </div>
              <div className="input-group">
                <label htmlFor="language">Language: </label>
                <input type="text" value={userData.language} name="language" id="language" onChange={handleData} />
              </div>
              <div className="input-group">
                <label htmlFor="noOfChar">No of Characters: </label>
                <input type="number" value={userData.noOfChar} name="noOfChar" id="noOfChar" onChange={handleData} />
              </div>
              <div className="input-group">
                <label htmlFor="trimSize">Trim Size: </label>
                <input type="text" value={userData.trimSize} name="trimSize" id="trimSize" onChange={handleData} />
              </div>
              <div className="input-group">
                <label htmlFor="template">Template: </label>
                <input type="text" value={userData.template} name="template" id="template" onChange={handleData} />
              </div>
              <button className="btn green" onClick={handleSubmit}>{userData._id ? "Update Record" : "Add Record"}</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
