const Country = ({ name, onShow }) => {
    return (
        <div>
            <span>{name}</span><button onClick={onShow}>Show</button>
        </div>
    )
};

export default Country;
