import backButtonImg from "../../imgs/BackButton.png";
export default function BackButton({functionToCall}){
    return(
        <img className="backButton" onClick={functionToCall} src={backButtonImg }alt="Back Button" />
    )
}