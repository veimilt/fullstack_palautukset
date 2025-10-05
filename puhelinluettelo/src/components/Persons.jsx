
const Persons = ({ filteredPersons, onDeletePerson }) => {

    return (
        <>
            {filteredPersons.map(person => <div key={person.name}>{person.name} {person.number} <button onClick={() => onDeletePerson(person.id, person.name)}>delete</button></div>)}
        </>
    )
}

export default Persons