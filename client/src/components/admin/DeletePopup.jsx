export default function DeletePopup({deletePopupSwitch, deleteFunction}){
    return(
        <div className="delete-popup-container">
            <div className="delete-popup-content">
                <h2>Are you sure you want to delete this user?</h2>
                <div className="delete-popup-button-container">
                    <button onClick={deleteFunction} className="delete-popup-confirm-button">Yes</button>
                    <button onClick={deletePopupSwitch} className="delete-popup-cancel-button">No</button>
                </div>
            </div>
        </div>
    )
}