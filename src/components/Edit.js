import "./Edit.css";

export default function Edit({ UserData, personData, setUserData }) {
  let handelChange = (e) => {
    // console.log(e.target.name);
    let newList = UserData.map((value) =>
      value.id === personData.id
        ? {
            ...value,
            [e.target.name]: e.target.value,
          }
        : value
    );
    setUserData(newList);
  };

  return (
    <>
      <th>
        <input type="checkbox" />
      </th>
      <th>
        <input
          type="text"
          name="name"
          value={personData.name}
          onChange={(e) => {
            handelChange(e);
          }}
        />
      </th>
      <th>
        <input
          type="text"
          value={personData.email}
          name="email"
          onChange={(e) => {
            handelChange(e);
          }}
        />
      </th>
      <th>
        <input
          type="text"
          name="role"
          value={personData.role}
          onChange={(e) => {
            handelChange(e);
          }}
        />
      </th>
      <th>
        <button className="submit_btn">Submit</button>
      </th>
    </>
  );
}
