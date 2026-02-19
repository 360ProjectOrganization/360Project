import Dropdown from "./Dropdown";
import "./Header.css"

function Header() {

    return (
        <>
            <section id="header-container">
                <section id="jobly-container">
                    <a href="/">JobLy</a>
                </section>

                <section id="navigation-container">
                    <button className="header-button-company">
                        <a href="/"> {/* To be added later */}
                            Company Portal
                        </a>
                    </button>

                    <button className="header-button-admin">
                        <a href="/"> {/* To be added later */}
                            Admin Portal
                        </a>
                    </button>
                </section>

                <section id="user-profile">
                    <Dropdown />
                </section>
            </section>
        </>
    );
};

export default Header;