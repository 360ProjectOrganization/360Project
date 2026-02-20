import { useEffect, useRef, useState } from "react";
import "./Dropdown.css"
import { getToken } from "../../utils/api.js"

const Dropdown = () => {
    const [dropdownActivated, setDropdownActivated] = useState(false);
    const dropdownReference = useRef(null);

    const token = getToken();

    useEffect(() => {
        function dropdownHandler (e) {
            if(dropdownReference.current){
                if(!dropdownReference.current.contains(e.target)){
                    setDropdownActivated(false);
                }
            }
        };
        document.addEventListener("click", dropdownHandler);
        return() => {
            document.removeEventListener("click", dropdownHandler);
        };
    });

    let dropdownItems = [
        {
            id:1,
            label: "Login",
            value: "/Login"
        },
        {
            id: 2,
            label: "Register",
            value: "/register-applicant" //TODO Update for general applicant page
        }
    ];

    return (
        <>
            <section id="dropdown-container" ref={dropdownReference}>
                <button className="dropdown-button" onClick={() => {
                    setDropdownActivated(!dropdownActivated);
                }}>
                    Profile
                </button>
                
                <div className={`dropdown-options ${dropdownActivated && !token ? "visible" : ""}`}>
                    {dropdownItems.map((option) => {
                        return (
                            <a href={option.value} className="dropdown-option-button">
                                {option.label}
                            </a>
                        )

                    })}
                </div>
            </section>
        </>
    )
};

export default Dropdown;