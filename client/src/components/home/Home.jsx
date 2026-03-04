import HomeSubNav from "./HomeSubNav.jsx";
import HomeJobPostings from "./HomeJobPostings.jsx";
export default function Home() {
    const handleLocationFilter = () => {

    };

    const handleJobTitleFilter = () => {

    };

    const handleDropDownFilter = () => {

    };

    return (
        <>
            <HomeSubNav
                onLocationClick={handleLocationFilter}
                onJobTitleClick={handleJobTitleFilter}
                onDropDown={handleDropDownFilter}
            />

            <HomeJobPostings/>
        </>
    );
}