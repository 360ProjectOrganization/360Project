import { usePfp } from "../../context/ProfilePictureContext.jsx";

function ProfilePicture() {
    const { image } = usePfp();

    return (
        <>
            <div>
                <img id="pfp"
                    src={image}
                    alt="pfp"
                    style={{
                            width: "3.5em",
                            height:"3.5em",
                            padding: "0.5em",
                            borderRadius: "6em"
                        }}
                ></img>
            </div>
        </>
    )
}

export default ProfilePicture;