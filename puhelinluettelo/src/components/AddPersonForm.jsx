import styles from './AddPersonForm.module.css'

const AddPersonForm = ({ onSubmit, onNameChange, onNumberChange }) => {
    return (
        <form className={styles.customForm} onSubmit={onSubmit}>
            <div>
                <input onChange={onNameChange} placeholder="name"/>
            </div>
            <div>
                <input onChange={onNumberChange} placeholder="number"/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default AddPersonForm