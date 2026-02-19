import { useEffect, useRef, useState } from "react";
import "./Dropdown.css"

const Dropdown = () => {
    const [dropdownActivated, setDropdownActivated] = useState(false);
    const dropdownReference = useRef(null);

    useEffect(() => {
        function dropdownHandler (e) {
            if(dropdownReference.current){
                if(!dropdownReference.current.contains(e.target)){
                    setDropdownActivated(false);
                }
            }
        }
        document.addEventListener("click", dropdownHandler);

        return() => {
            document.removeEventListener("click", dropdownHandler);
        }
    })

    let dropdownItems = [
        {
            id:1,
            label: "Login",
            value: "login-page"
        },
        {
            id: 2,
            label: "Register",
            value: "register-page"
        }
    ]

    return (
        <>
            <section id="dropdown-container" ref={dropdownReference}>
                <button className="dropdown-button" onClick={() => {
                    setDropdownActivated(!dropdownActivated);
                }}>
                    Profile
                </button>
                
                <div className={`dropdown-options ${dropdownActivated ? "visible" : ""}`}>
                    {dropdownItems.map((option, index) => {

                        return (
                            <button>
                                <a>
                                    {option.label}
                                </a>
                            </button>
                        )

                    })}
                </div>
            </section>
        </>
    )
}

export default Dropdown;