import '../styles/BasicComponents.scss'

export const BasicButton = ({onClick, children, className = '', styles = {}}) => {
    return(
    <button 
    onClick={onClick}
    className={`basic-button ${className}`}
    styles={styles}
    >
        {children}
    </button>
    )
}
