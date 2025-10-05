
const SearchFilter = ({ name, onChange }) => {
    return (
        <div>
            {name} <input onChange={onChange} />
        </div>
    )
}

export default SearchFilter