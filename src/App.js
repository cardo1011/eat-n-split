import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState([...initialFriends]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddfriend() {
    setShowAddFriend((show) => !show);

    // Closes FormSplitBill component whenever trying to add a friend.
    setSelectedFriend(null);
  }

  function handleAddFriend(friend) {
    // In order to follow react principles of not mutating state, we copy the existing array of friends using the spread operator and append the new friend to the end of the array.
    setFriends((friends) => [...friends, friend]);

    // Makes FormAddFriend stop rendering after submitting the form to add the intended friend.
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));

    // Closes FormAddFriend component after selecting a friend to split a bill with.
    setShowAddFriend(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {/* Conditionally rendering the FormAddFriend by using the short circuiting method. */}
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={() => handleShowAddfriend()}>
          {showAddFriend === true ? "Close" : "Add Friend"}
        </Button>
      </div>

      {/* Conditionally rendering the FormSplitBill by using the short circuiting method for whenever a friend is selected by clicking its corresponding button. */}
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} />}
    </div>
  );
}

// onSelection and selectedFriend props were only passed to this component to be able to drill the components to the Friend component. (aka pass the props to its child component)
function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {/* Rendering a list of friends dynamically by using the map method in order to scale the list */}
      {friends.map((friend) => (
        <Friend
          friendObj={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friendObj, onSelection, selectedFriend }) {
  // A boolean variable that is used to determine if a button should show "close" or "select" after comparing if they are the same friend.
  const isSelected = selectedFriend?.id === friendObj.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friendObj.image} alt={friendObj.name} />
      <h3>{`${friendObj.name}`}</h3>

      {/* In order to keep my code easier to read (In my opinion), instead of using a nested ternary, I used 3 different conditional paragraphs. These paragraphs render what the financial standing was with a friend with a corresponding CSS class */}

      {friendObj.balance < 0 && (
        <p className="red">
          You owe {friendObj.name} ${Math.abs(friendObj.balance)}
        </p>
      )}
      {friendObj.balance > 0 && (
        <p className="green">
          {friendObj.name} owes you ${Math.abs(friendObj.balance)}
        </p>
      )}
      {friendObj.balance === 0 && <p>You and {friendObj.name} are even</p>}
      <Button onClick={() => onSelection(friendObj)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  // Adding a handleSubmit() function to the form that way the form can be submitted when the "Add" button is clicked or "enter" key is pressed instead of only adding "onClick" functionality to the button.

  function handleSubmit(e) {
    e.preventDefault();

    // Guard to prevent the form being submitted without a name or image.
    if (!name || !image) return;

    // In order to prevent duplicate ID's, I used crypto.randomUUID() instead of Math.random().
    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);

    //Resets form to default values after being submitted.
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👥 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>📸 Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

// Passing selectedFriend prop in order to be able to access the selectedFriends values into the form.
function FormSplitBill({ selectedFriend }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setwhoIsPaying] = useState("user");

  return (
    <form className="form-split-bill">
      <h2>{`Split the bill with ${selectedFriend.name}`}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍 Your expense</label>
      <input
        type="text"
        value={paidByUser}
        // To prevent negative values that make no sense, I check to see if the input is greater than the bill and update the state variable accordingly
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>👭 {`${selectedFriend.name}'s expense`}</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who's paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setwhoIsPaying(Number(e.target.value))}
      >
        <option value="user">You</option>
        <option value="friend">{`${selectedFriend.name}`}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
